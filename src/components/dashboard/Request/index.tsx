"use client";

import { useGetSearchParams } from "@/hooks/getSearchParams";
import { useUpdateSearchParams } from "@/hooks/useUpdateSearchParams";
import { useGetCategoriesQuery } from "@/redux/slice/categoryApi";
import AllRequestList from "./AllRequestList";

export default function RequestBoard() {    
    const { data: categoryData, isLoading: loadingCat } = useGetCategoriesQuery({})
    const updateSearchParams = useUpdateSearchParams()
    const { categoryId } = useGetSearchParams()

    const handleAddParams = (id: string) => {
        updateSearchParams('categoryId', id)
    }

    return (
        <div className="min-h-screen bg-black text-white px-4 sm:px-6 lg:px-10 py-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-semibold">Request Board</h1>
                    <p className="text-sm text-gray-400">
                        Connect with the community anonymously.
                    </p>
                </div>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-2 mb-8">
                <button
                    onClick={() => updateSearchParams("categoryId",)}
                    className={`px-4 py-1.5 rounded-full text-sm border transition cursor-pointer ${!categoryId
                            ? "bg-primary! text-white border-primary"
                            : "border-[#E6C97A]/30 text-gray-300 hover:border-[#E6C97A]"
                        }`}
                >
                    All
                </button>
                {categoryData?.data?.map((cat: any) => (
                    <button
                        key={cat}
                        onClick={() => handleAddParams(cat?._id)}
                        className={`px-4 py-1.5 rounded-full text-sm border transition cursor-pointer ${cat?._id === categoryId
                            ? "bg-primary text-black border-[#E6C97A]"
                            : "border-[#E6C97A]/30 text-gray-300 hover:border-[#E6C97A]"
                            }`}
                    >
                        {cat?.name}
                    </button>
                ))}
            </div>

            <AllRequestList />
        </div>
    );
}