// ConversationPanel.tsx
import MuiImageViewer from "@/components/shared/MuiImageViewer";
import { getIsAuthenticated } from "@/hooks/socket";
import useSocket from "@/hooks/useSocket";
import { useGetMessagesQuery, useSendMessageMutation } from "@/redux/slice/chatApi";
import { useGetProfileQuery } from "@/redux/slice/userApi";
import { getImageUrl } from "@/utils/baseUrl";
import Grid from "@mui/material/Grid";
import {
    ArrowLeft,
    Image,
    Loader,
    MessageCircleMore,
    OctagonX,
    Send,
    X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

const SOCKET_EVENTS = {
    SEND_MESSAGE: "send_message",
    NEW_MESSAGE: "new_message",
    JOIN_CONVERSATION: "join_conversation",
    LEAVE_CONVERSATION: "leave_conversation",
    MESSAGE_SENT: "message_sent",
    USER_TYPING: "user_typing",
    USER_STOPPED_TYPING: "user_stopped_typing",
    TYPING_START: "typing_start",
    TYPING_STOP: "typing_stop",
    ERROR: "error",
};

function ConversationPanel({
    conversationId,
    setSelectedConversationId,
}: {
    conversationId: string;
    setSelectedConversationId?: any;
}) {
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const [imageFiles, setImageFiles] = useState<File[]>([]);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [localMessages, setLocalMessages] = useState<any[]>([]);
    const [typingAlias, setTypingAlias] = useState<string | null>(null);
    const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    // ✅ profileId কে ref এ রাখো — stale closure এড়াতে
    const profileIdRef = useRef<string | undefined>(undefined);

    const { data, isLoading } = useGetMessagesQuery(conversationId);
    const [sendMessage] = useSendMessageMutation();
    const { data: profileData } = useGetProfileQuery({});
    const socket = useSocket();

    // ✅ profileData update হলে ref আপডেট করো
    // console.log(profileData, "profile data")
    // console.log(profileIdRef, "profile ref")
    useEffect(() => {
        profileIdRef.current = profileData?._id;
    }, [profileData?.data?._id]);
    useEffect(() => {
        console.log("profileData full:", profileData);
    }, [profileData]);

    // ─── Sync server messages into local state ───────────────────────
    useEffect(() => {
        if (data?.messages && profileIdRef.current) {
            const enriched = data.messages.map((msg: any) => ({
                ...msg,
                isMine: msg.senderId === profileIdRef.current,
            }));
            setLocalMessages(enriched);
        }
    }, [data?.messages, profileData?.data?._id]);

    // ─── Join AFTER authentication ────────────────────────────────────
    useEffect(() => {
        if (!socket || !conversationId) return;

        const joinRoom = () => {
            socket!.emit(SOCKET_EVENTS.JOIN_CONVERSATION, conversationId);
            console.log("🚀 Joined conversation:", conversationId);
        };

        if (getIsAuthenticated()) {
            joinRoom();
        } else {
            socket.once("authenticated", joinRoom);
        }

        return () => {
            socket!.emit(SOCKET_EVENTS.LEAVE_CONVERSATION, conversationId);
            socket!.off("authenticated", joinRoom);
        };
    }, [socket, conversationId]);

    // ─── Listen for incoming messages ────────────────────────────────
    useEffect(() => {
        if (!socket) return;

        const handleNewMessage = (msg: any) => {
            setLocalMessages((prev) => {
                const exists = prev.some((m) => m._id === msg._id);
                if (exists) return prev;

                return [...prev, {
                    ...msg,
                    // ✅ ref থেকে নেওয়া — সবসময় fresh value
                    isMine: msg.senderId === profileIdRef.current,
                }];
            });
        };

        const handleMessageSent = ({
            message: savedMsg,
        }: {
            tempId: string;
            message: any;
        }) => {
            setLocalMessages((prev) =>
                prev.map((m) =>
                    m._id.toString().startsWith("optimistic-") &&
                        m.content === savedMsg.content
                        ? { ...savedMsg, isMine: true }
                        : m
                )
            );
        };

        const handleError = ({ message: errMsg }: { message: string }) => {
            toast.error(errMsg);
            setLoading(false);
        };

        socket.on(SOCKET_EVENTS.NEW_MESSAGE, handleNewMessage);
        socket.on(SOCKET_EVENTS.MESSAGE_SENT, handleMessageSent);
        socket.on(SOCKET_EVENTS.ERROR, handleError);

        return () => {
            socket.off(SOCKET_EVENTS.NEW_MESSAGE, handleNewMessage);
            socket.off(SOCKET_EVENTS.MESSAGE_SENT, handleMessageSent);
            socket.off(SOCKET_EVENTS.ERROR, handleError);
        };
    }, [socket]);

    // ─── Typing indicators ────────────────────────────────────────────
    useEffect(() => {
        if (!socket) return;

        const handleUserTyping = ({ alias }: { alias: string }) =>
            setTypingAlias(alias);
        const handleUserStoppedTyping = () => setTypingAlias(null);

        socket.on(SOCKET_EVENTS.USER_TYPING, handleUserTyping);
        socket.on(SOCKET_EVENTS.USER_STOPPED_TYPING, handleUserStoppedTyping);

        return () => {
            socket.off(SOCKET_EVENTS.USER_TYPING, handleUserTyping);
            socket.off(SOCKET_EVENTS.USER_STOPPED_TYPING, handleUserStoppedTyping);
        };
    }, [socket]);

    // ─── Auto-scroll ──────────────────────────────────────────────────
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [localMessages]);

    // ─── Typing emit helpers ──────────────────────────────────────────
    const emitTyping = () => {
        if (!socket || !profileData) return;
        socket.emit(SOCKET_EVENTS.TYPING_START, {
            conversationId,
            alias: data?.conversation?.myAlias ?? "User",
        });
        if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
        typingTimeoutRef.current = setTimeout(() => {
            socket.emit(SOCKET_EVENTS.TYPING_STOP, {
                conversationId,
                alias: data?.conversation?.myAlias ?? "User",
            });
        }, 1500);
    };

    const removeImage = (index: number) => {
        setImageFiles((prev) => prev.filter((_, i) => i !== index));
    };

    // ─── Send message ─────────────────────────────────────────────────
    const handleSendMessage = async (e: any) => {
        e.preventDefault();
        if (!message.trim() && !imageFiles.length) return;

        // Images go through REST
        if (imageFiles.length > 0) {
            setLoading(true);
            const payload = new FormData();
            payload.append("data", JSON.stringify({ content: message }));
            imageFiles.forEach((img) => payload.append("images", img));

            try {
                const response = await sendMessage({
                    id: conversationId,
                    payload,
                })?.unwrap();
                if (response?.success) {
                    setImageFiles([]);
                    setMessage("");
                }
            } catch (error: any) {
                toast.error(error?.data?.message);
            } finally {
                setLoading(false);
            }
            return;
        }

        // Text → socket
        if (!socket) {
            toast.error("Not connected to server");
            return;
        }

        if (!getIsAuthenticated()) {
            toast.error("Socket not authenticated yet, please wait...");
            return;
        }

        const trimmed = message.trim();

        // ✅ Optimistic bubble
        const optimisticMsg = {
            _id: `optimistic-${Date.now()}`,
            conversationId,
            content: trimmed,
            images: [],
            isMine: true,
            senderAlias: data?.conversation?.myAlias ?? "You",
            createdAt: new Date().toISOString(),
        };
        // setLocalMessages((prev) => [...prev, optimisticMsg]);
        setMessage("");

        socket.emit(SOCKET_EVENTS.SEND_MESSAGE, {
            conversationId,
            content: trimmed,
        });
    };

    return (
        <div className="flex flex-col h-full">
            {/* Header */}
            {isLoading ? (
                <p className="p-4 text-gray-400 animate-bounce">
                    <Loader />
                </p>
            ) : (
                data?.conversation?.myAlias === "Post Owner" && (
                    <div
                        onClick={() => setSelectedConversationId("")}
                        className="flex items-center gap-3 px-6 py-4 border-b border-white/10 cursor-pointer"
                    >
                        <button className="text-gray-400 hover:text-white">
                            <ArrowLeft className="w-4 h-4" />
                        </button>
                        <p className="text-white font-semibold">Back</p>
                    </div>
                )
            )}

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-3">
                {localMessages.length ? (
                    localMessages.map((msg: any) => (
                        <ChatBubble key={msg._id} msg={msg} />
                    ))
                ) : (
                    <div className="flex-1 flex h-[calc(100%-100px)] items-center justify-center px-4 py-2">
                        <div className="flex flex-col items-center gap-4 px-8 text-center">
                            <MessageCircleMore
                                className="w-32 h-32 text-primary"
                                strokeWidth={1.5}
                            />
                            <div>
                                <h3 className="text-xl font-semibold text-gray-200 mb-2">
                                    No messages yet
                                </h3>
                                <p className="text-gray-500 max-w-sm">
                                    Start a conversation by sending your first message below
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Typing indicator */}
                {typingAlias && (
                    <div className="flex items-start">
                        <div className="bg-[#1A1A1A] border border-white/10 rounded-2xl rounded-bl-md px-4 py-2 text-xs text-gray-400 italic">
                            {typingAlias} is typing…
                        </div>
                    </div>
                )}

                <div ref={messagesEndRef} />
            </div>

            {/* Footer */}
            {data?.conversation?.status === "closed" ? (
                <div className="px-6 py-6 border-t border-white/10 flex items-center justify-center gap-2 text-slate-500">
                    <OctagonX size={20} />
                    <p className="text-center text-sm">
                        This conversation has been closed by admin
                    </p>
                </div>
            ) : (
                <div className="px-6 border-t border-white/10 relative">
                    {/* Image Preview */}
                    {imageFiles.length > 0 && (
                        <div className="absolute -top-[180%] w-full pr-14 flex gap-3 justify-end overflow-x-auto bg-transparent">
                            {imageFiles.map((file, index) => (
                                <div
                                    key={index}
                                    className="relative rounded-xl border bg-primary p-2 shadow"
                                >
                                    <button
                                        onClick={() => removeImage(index)}
                                        className="absolute top-2 right-2 bg-red-600 text-white rounded-full p-1 shadow"
                                        disabled={loading}
                                    >
                                        <X size={14} />
                                    </button>
                                    <img
                                        src={URL.createObjectURL(file)}
                                        alt="preview"
                                        className="h-24 w-24 rounded-lg object-cover"
                                    />
                                </div>
                            ))}
                        </div>
                    )}
                    <form onSubmit={handleSendMessage}>
                        <div className="flex items-center gap-2 py-4">
                            <label
                                className={`cursor-pointer ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
                            >
                                <input
                                    type="file"
                                    hidden
                                    multiple
                                    accept="image/*"
                                    disabled={loading}
                                    onChange={(e) => {
                                        if (e.target.files) {
                                            setImageFiles((prev) => [
                                                ...prev,
                                                ...Array.from(e.target.files!),
                                            ]);
                                        }
                                    }}
                                />
                                <Image className="text-gray-500 hover:text-gray-700" />
                            </label>

                            <input
                                name="content"
                                value={message}
                                onChange={(e) => {
                                    setMessage(e.target.value);
                                    emitTyping();
                                }}
                                placeholder="Type a message..."
                                className="flex-1 bg-[#1A1A1A] border border-white/10 rounded-full px-4 py-2 text-sm text-gray-300"
                            />
                            <button
                                type="submit"
                                disabled={loading || (!message.trim() && !imageFiles.length)}
                                className="bg-primary p-2 rounded-full disabled:opacity-50"
                            >
                                <Send className="w-4 h-4 text-black" />
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
}

function ChatBubble({ msg }: { msg: any }) {
    if (msg.senderRole === "SYSTEM") {
        return (
            <div className="flex justify-center">
                <div className="bg-[#D4AF370D] border border-[#E6C97A]/30 rounded-xl px-4 py-2 text-xs text-gray-300">
                    {msg.message}
                </div>
            </div>
        );
    }

    return (
        <div className={`flex flex-col ${msg?.isMine ? "items-end" : "items-start"}`}>
            {msg?.images?.length > 0 && (
                <div className="flex items-center gap-2 mb-1">
                    {msg.images.map((img: string, i: number) => (
                        <Grid size={{ xs: 4, md: 4 }} key={i}>
                            <MuiImageViewer
                                src={`${getImageUrl()}${img}`}
                                alt={`Image ${i + 1}`}
                                height={100}
                                style={{ borderRadius: 8, objectFit: "cover" }}
                            />
                        </Grid>
                    ))}
                </div>
            )}
            <div
                className={`max-w-[75%] px-4 py-2 rounded-2xl text-sm ${msg?.isMine
                        ? "bg-[#E6C97A] text-black rounded-br-md"
                        : "bg-[#1A1A1A] text-gray-300 rounded-bl-md border border-white/10"
                    }`}
            >
                {!msg?.isMine && (
                    <p className="text-[10px] text-gray-400 mb-1">{msg.senderAlias}</p>
                )}
                {msg.content}
                <p className="text-[9px] text-gray-500 mt-1">
                    {new Date(msg.createdAt).toLocaleTimeString()}
                </p>
            </div>
        </div>
    );
}

export default ConversationPanel;