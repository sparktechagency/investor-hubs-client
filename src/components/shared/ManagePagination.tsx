'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import React from 'react';

const ManagePagination = ({ meta }: any) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentPage = meta?.page;
  const totalPage = meta?.totalPage;

  const updatePage = (page: number) => {
    if (page < 1 || page > totalPage) return;

    const params = new URLSearchParams(searchParams.toString());
    params.set('page', page.toString());
    params.set('limit', meta.limit.toString());
    router.push(`?${params.toString()}`);
  };

  return (
    <div className={`${!totalPage ? "hidden" : "flex"} items-center justify-center w-full p-4`}>
      <div className="flex items-center space-x-2 md:space-x-4">

        {/* Prev */}
        <button
          disabled={currentPage === 1 || totalPage === 1}
          onClick={() => updatePage(currentPage - 1)}
          className="text-gray-700 dark:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronLeft />
        </button>

        {/* Pages */}
        {Array.from({ length: totalPage }).map((_, i) => {
          const page = i + 1;
          const isActive = page === currentPage;

          return (
            <button
              key={page}
              disabled={totalPage === 1}
              onClick={() => updatePage(page)}
              className={`flex items-center justify-center w-10 h-10 md:w-12 md:h-12 rounded-full transition
              ${
                isActive
                  ? 'bg-primary text-white dark:bg-primary'
                  : 'border border-primary text-primary dark:border-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
              }
              ${totalPage === 1 ? 'opacity-50 cursor-not-allowed' : ''}
              `}
            >
              {page}
            </button>
          );
        })}

        {/* Next */}
        <button
          disabled={currentPage === totalPage || totalPage === 1}
          onClick={() => updatePage(currentPage + 1)}
          className="text-gray-700 dark:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronRight />
        </button>

      </div>
    </div>
  );
};

export default ManagePagination;