"use client";

import Link from "next/link";

interface PaginationProps {
  pagination: {
    page: number;
    pageSize: number;
    pageCount: number;
    total: number;
  };
  baseUrl?: string;
  searchParams?: Record<string, string>;
}

export default function Pagination({ pagination, baseUrl = "/catalog", searchParams = {} }: PaginationProps) {
  const { page, pageCount } = pagination;

  if (pageCount <= 1) return null;

  const createPageUrl = (pageNum: number) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", pageNum.toString());
    return `${baseUrl}?${params.toString()}`;
  };

  const pages = [];
  const maxVisible = 5;
  let start = Math.max(1, page - Math.floor(maxVisible / 2));
  let end = Math.min(pageCount, start + maxVisible - 1);

  if (end - start + 1 < maxVisible) {
    start = Math.max(1, end - maxVisible + 1);
  }

  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  return (
    <div className="flex justify-center mt-8">
      <div className="flex items-center gap-2">
        {page > 1 && (
          <Link
            href={createPageUrl(page - 1)}
            className="px-3 py-2 rounded border border-gray-300 hover:border-gray-400 text-sm transition-colors"
          >
            Anterior
          </Link>
        )}

        {start > 1 && (
          <>
            <Link
              href={createPageUrl(1)}
              className="px-3 py-2 rounded border border-gray-300 hover:border-gray-400 text-sm"
            >
              1
            </Link>
            {start > 2 && <span className="px-2 text-gray-500">...</span>}
          </>
        )}

        {pages.map((pageNum) => (
          <Link
            key={pageNum}
            href={createPageUrl(pageNum)}
            className={`px-3 py-2 rounded border text-sm transition-colors ${
              pageNum === page
                ? "border-yellow-500 bg-yellow-500 text-white"
                : "border-gray-300 hover:border-gray-400"
            }`}
          >
            {pageNum}
          </Link>
        ))}

        {end < pageCount && (
          <>
            {end < pageCount - 1 && <span className="px-2 text-gray-500">...</span>}
            <Link
              href={createPageUrl(pageCount)}
              className="px-3 py-2 rounded border border-gray-300 hover:border-gray-400 text-sm"
            >
              {pageCount}
            </Link>
          </>
        )}

        {page < pageCount && (
          <Link
            href={createPageUrl(page + 1)}
            className="px-3 py-2 rounded border border-gray-300 hover:border-gray-400 text-sm transition-colors"
          >
            Siguiente
          </Link>
        )}
      </div>
    </div>
  );
}