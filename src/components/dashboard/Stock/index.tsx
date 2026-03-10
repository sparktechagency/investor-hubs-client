'use client'
import { useGetStocksQuery } from '@/redux/slice/stocksApi';
import { BookmarkCheck, Search } from 'lucide-react';
import UserStockCard from './UserStockCard';
import ManagePagination from '@/components/shared/ManagePagination';
import { useGetSearchParams } from '@/hooks/getSearchParams';
import { useUpdateSearchParams } from '@/hooks/useUpdateSearchParams';
import { useEffect } from 'react';

const StockPage = () => {
    const { data: stocksData, refetch } = useGetStocksQuery({});

    
      const { searchTerm, page } = useGetSearchParams();
      const updateSearchParams = useUpdateSearchParams()
    
      useEffect(() => {
        refetch()
      }, [searchTerm, page]);

    return (
        <div className="p-4 sm:p-6 lg:p-8">
            <div className="mb-6 sm:mb-8">
                <h1 className="text-2xl sm:text-3xl font-serif text-white mb-2">
                    Exclusive Stock
                </h1>
                <p className="text-sm sm:text-base text-gray-400">
                    Curated off-market opportunities.
                </p>
            </div>

            <div className=" flex items-center justify-end gap-5 rounded-lg mb-6">
                <div className="relative w-1/3">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => updateSearchParams("searchTerm", e.target.value)}
                        placeholder="Search stocks by title."
                        className="w-full bg-[#1A1A1A] border border-primary/20 rounded-lg pl-12 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-primary transition-colors"
                    />
                </div>
            </div>
            <div className="space-y-4 mb-10">
                {stocksData?.data?.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 text-center border border-white/30 rounded-xl">
                        <div className="w-14 h-14 rounded-full bg-[#E6C97A]/10 flex items-center justify-center mb-4">
                            <BookmarkCheck className="w-6 h-6 text-[#E6C97A]/60" />
                        </div>
                        <p className="text-gray-400 text-sm">
                            No requests found for this category.
                        </p>
                    </div>
                ) : (
                    <div className="flex flex-col gap-4 sm:gap-6 lg:gap-8">
                        {stocksData?.data?.map((stock: any) =>
                            <UserStockCard key={stock.id} item={stock} canExpressInterest={false} />
                        )}
                    </div>
                )}
            </div>
            <ManagePagination meta={stocksData?.meta} />
        </div>
    )
}

export default StockPage