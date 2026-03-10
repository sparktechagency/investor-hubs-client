import ManagePagination from '@/components/shared/ManagePagination';
import { useGetSearchParams } from '@/hooks/getSearchParams';
import { useUpdateSearchParams } from '@/hooks/useUpdateSearchParams';
import { useCreateChatMutation } from '@/redux/slice/chatApi';
import { useGetRequestsQuery } from '@/redux/slice/requestApi';
import { BookmarkCheck, Search } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import RequestConversationModal from '../Shared/Chatting/RequestConversationModal';
import RequestCard from './RequestCard';

const AllRequestList = () => {
    const [openConversation, setOpenConversation] = useState(false);
    const [selectRequest, setSelectRequest] = useState(null);

    const { data: requestsData, isLoading, refetch } = useGetRequestsQuery({});

    const [createChat] = useCreateChatMutation();


    const { searchTerm, page, categoryId } = useGetSearchParams();
    const updateSearchParams = useUpdateSearchParams()

    useEffect(() => {
        refetch()
    }, [searchTerm, page, categoryId]);

    const handleViewConversation = async (req: any) => {
        try {
            const response = await createChat({ ownerId: req?.createdBy?._id, id: req?._id })?.unwrap()
            if (response?.success) {
                toast.success(response?.message)
            }
            setOpenConversation(true);
            setSelectRequest(req)
        } catch (error: any) {
            toast.error(error?.data?.message)
        }
    }
    return (
        <div className="">
            <div className=" flex items-center justify-end gap-5 rounded-lg mb-6">
                <div className="relative w-1/3">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => updateSearchParams("searchTerm", e.target.value)}
                        placeholder="Search request by title                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                "
                        className="w-full bg-[#1A1A1A] border border-primary/20 rounded-lg pl-12 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-primary transition-colors"
                    />
                </div>
            </div>

            <div className="space-y-6 mb-10">
                {requestsData?.data?.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 text-center border border-white/30 rounded-xl">
                        <div className="w-14 h-14 rounded-full bg-[#E6C97A]/10 flex items-center justify-center mb-4">
                            <BookmarkCheck className="w-6 h-6 text-[#E6C97A]/60" />
                        </div>
                        <p className="text-gray-400 text-sm">
                            No requests found for this category.
                        </p>
                    </div>
                ) : (
                    requestsData?.data?.map((req: any, i: any) =>
                        <RequestCard key={i} req={req} handleViewConversation={handleViewConversation} setSelectRequest={setSelectRequest} />)
                )}
                <RequestConversationModal request={selectRequest} open={openConversation} onClose={() => setOpenConversation(false)} />
            </div>
            <ManagePagination meta={requestsData?.meta} />
        </div>

    )
}

export default AllRequestList