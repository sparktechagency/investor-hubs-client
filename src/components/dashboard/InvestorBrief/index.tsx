'use client'
import { useGetInvestorBriefQuery } from '@/redux/slice/feedbackApi';
import { Search, TrendingUp } from 'lucide-react';
import BriefCard from './BriefCard';
import ManagePagination from '@/components/shared/ManagePagination';
import { useGetSearchParams } from '@/hooks/getSearchParams';
import { useUpdateSearchParams } from '@/hooks/useUpdateSearchParams';
import { useEffect } from 'react';

const InvestorBrief = () => {
    const { data: briefs, refetch } = useGetInvestorBriefQuery({});  
        const { searchTerm, page } = useGetSearchParams();
        const updateSearchParams = useUpdateSearchParams()
    
        useEffect(() => {
            refetch()
        }, [searchTerm, page]);  
    return (
        <div className="p-4 sm:p-6 lg:p-8">
            <div className="mb-12">
                <div className="flex items-center gap-3 mb-4">
                    <TrendingUp className="w-6 h-6 text-primary" />
                    <span className="text-sm text-primary uppercase tracking-wider font-medium">Market Intelligence</span>
                </div>
                <h1 className="text-4xl md:text-5xl font-serif text-white mb-4">Investor Briefs</h1>
                <p className="text-gray-400 text-lg max-w-3xl">
                    Expert analysis, market insights, and investment opportunities curated by our research team.
                    Stay ahead with data-driven intelligence.
                </p>
            </div>
            {/* Search Bar */}
            <div
                className="mb-12"
            >
                <div className="relative max-w-2xl mx-auto">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                    <input
                        type="text"
                        onChange={(e) => updateSearchParams("searchTerm", e.target.value)}
                        placeholder="Search briefs by title or keyword..."
                        className="w-full bg-[#111111] border border-primary/20 rounded-xl pl-12 pr-4 py-4 text-white placeholder:text-gray-600 focus:border-primary focus:ring-1 focus:ring-primary/30 outline-none transition-all"
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-20">
            {briefs?.data?.map((brief:any, index:number) => (
                <BriefCard
                    key={index}
                    brief={brief}
                />
            ))}
          </div>
          <ManagePagination meta={briefs?.meta} />
        </div>
    )
}

export default InvestorBrief