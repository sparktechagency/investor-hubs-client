import React from 'react'

import { Calendar, Clock, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { getImageUrl } from '@/utils/baseUrl'

const BriefCard = ({ brief }: any) => {
    const formattedDate = new Date(brief.createdAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    })

    const updatedDate = new Date(brief.updatedAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    })

    return (
        <div>
            <div                
                className="group block bg-[#111111] border border-primary/20 rounded-xl overflow-hidden hover:border-primary hover:-translate-y-1 transition-all"
            >
                {/* Image */}
                <div className="relative aspect-[16/9] overflow-hidden bg-black">
                    <img
                        src={getImageUrl() + brief.image}
                        alt={brief.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                    {/* Status Badge */}
                    <div className={`absolute bottom-3 left-3 px-2 py-1 text-xs font-bold uppercase tracking-wider rounded
                        ${brief.status === 'active'
                            ? 'bg-primary/90 text-black'
                            : 'bg-gray-600/90 text-white'
                        }`}>
                        {brief.status}
                    </div>
                </div>

                {/* Content */}
                <div className="p-6">
                    <div className="flex items-center gap-3 text-xs text-gray-500 mb-3">
                        <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {formattedDate}
                        </span>
                        <span className="w-1 h-1 rounded-full bg-gray-600" />
                        <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            Updated {updatedDate}
                        </span>
                    </div>

                    <h3 className="text-xl font-serif text-white mb-3 group-hover:text-primary transition-colors line-clamp-2">
                        {brief.name}
                    </h3>

                    <p className="text-sm text-gray-400 leading-relaxed line-clamp-3 mb-4">
                        {brief.description}
                    </p>
                </div>
            </div>
        </div>
    )
}

export default BriefCard