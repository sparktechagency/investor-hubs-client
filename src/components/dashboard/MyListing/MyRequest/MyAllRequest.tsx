'use client'
import { useDeleteRequestMutation, useGetMyRequestsQuery } from '@/redux/slice/requestApi';
import { getImageUrl } from '@/utils/baseUrl';
import getStringToAvater from '@/utils/getStringToAvater';
import { Avatar } from '@mui/material';
import Image from 'next/image';
import React, { useEffect, useState } from 'react'
import { BookmarkCheck, Eye, Pencil, Search, Trash2 } from 'lucide-react';
import UpdateRequestModal from './Updaterequestmodal';
import { toast } from 'sonner';
import DeleteConfirmModal from '../../Shared/DeleteConfirmModal';
import MyRequestDetailModal from './MyRequestDetailModal';
import MyRequestCard from './MyRequestCard';
import RequestConversationModal from '../../Shared/Chatting/RequestConversationModal';
import ManagePagination from '@/components/shared/ManagePagination';
import { useGetSearchParams } from '@/hooks/getSearchParams';
import { useUpdateSearchParams } from '@/hooks/useUpdateSearchParams';

const MyAllRequest = () => {
    const [openUpdateModal, setOpenUpdateModal] = useState(false);
    const [selectedRequest, setSelectedRequest] = useState(null)
    const [deleteModal, setDeleteModal] = useState(false);

    const [detailModal, setDetailModal] = useState(false);


    const [openConversation, setOpenConversation] = useState(false);
    const [selectRequest, setSelectRequest] = useState(null);

    const { data: myRequestData, isLoading, refetch } = useGetMyRequestsQuery({});
    const [deleteRequest] = useDeleteRequestMutation()


    const { searchTerm, page, categoryId } = useGetSearchParams();
    const updateSearchParams = useUpdateSearchParams()

    useEffect(() => {
        refetch()
    }, [searchTerm, page, categoryId]);

    // handleDelete
    const handleDelete = async () => {
        try {
            const response = await deleteRequest((selectRequest as any)?._id).unwrap();
            if (response?.message) {
                toast.success(response?.message);
                setDeleteModal(false);
                setSelectRequest(null)
            }
        } catch (error: any) {
            toast.error(error?.data?.message ?? "Failed to delete");
        }
    };

    return (
        <div className="">
            <div className=" flex items-center justify-end gap-5 rounded-lg mb-6">
                <div className="relative w-1/3">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => updateSearchParams("searchTerm", e.target.value)}
                        placeholder="Search conversations..."
                        className="w-full bg-[#1A1A1A] border border-primary/20 rounded-lg pl-12 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-primary transition-colors"
                    />
                </div>
            </div>

            <div className="space-y-4 mb-10">
                {myRequestData?.data?.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 text-center border border-white/30 rounded-xl">
                        <div className="w-14 h-14 rounded-full bg-[#E6C97A]/10 flex items-center justify-center mb-4">
                            <BookmarkCheck className="w-6 h-6 text-[#E6C97A]/60" />
                        </div>
                        <p className="text-gray-400 text-sm">
                            No requests found for this category.
                        </p>
                    </div>
                ) : (
                    myRequestData?.data?.map((req: any, i: any) => <MyRequestCard req={req} setOpenConversation={setOpenConversation} setSelectRequest={setSelectRequest} setOpenUpdateModal={setOpenUpdateModal} setDeleteModal={setDeleteModal} setDetailModal={setDetailModal} />)
                )}
                <UpdateRequestModal open={openUpdateModal} onClose={() => { setOpenUpdateModal(false); setSelectedRequest(null) }} request={selectRequest} />

                <DeleteConfirmModal
                    open={deleteModal}
                    onClose={() => setDeleteModal(false)}
                    onConfirm={handleDelete}
                    itemName={(selectRequest as any)?.title}
                />
                <MyRequestDetailModal
                    open={detailModal}
                    onClose={() => setDetailModal(false)}
                    listing={selectRequest}
                />
                <RequestConversationModal request={selectRequest} open={openConversation} onClose={() => setOpenConversation(false)} />
            </div>
            <ManagePagination meta={myRequestData?.meta} />
        </div>

    )
}

export default MyAllRequest