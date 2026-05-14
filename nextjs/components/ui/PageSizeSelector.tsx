"use client";

import { useRouter, useSearchParams } from "next/navigation";

interface PageSizeSelectorProps {
  currentSize: number;
}

export default function PageSizeSelector({ currentSize }: PageSizeSelectorProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleChange = (size: string) => {
    const params = new URLSearchParams(searchParams);
    params.set("pageSize", size);
    params.set("page", "1"); // Reset to first page
    router.push(`/catalog?${params.toString()}`);
  };

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-gray-600">Mostrar:</span>
      <select
        value={currentSize}
        onChange={(e) => handleChange(e.target.value)}
        className="px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
      >
        <option value={12}>12</option>
        <option value={24}>24</option>
        <option value={36}>36</option>
      </select>
    </div>
  );
}