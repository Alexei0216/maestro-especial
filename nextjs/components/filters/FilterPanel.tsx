"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useCallback } from "react";

interface FilterPanelProps {
  categories: Array<{ id: number; name: string; slug: string }>;
  maxPrice?: number;
}

export default function FilterPanel({ categories, maxPrice = 10000 }: FilterPanelProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Get current filter values from URL
  const currentMinPrice = searchParams.get("minPrice") || "0";
  const currentMaxPrice = searchParams.get("maxPrice") || maxPrice.toString();
  const currentCategory = searchParams.get("category") || "";
  const currentSort = searchParams.get("sort") || "";

  const [minPrice, setMinPrice] = useState(currentMinPrice);
  const [maxPrice_, setMaxPrice] = useState(currentMaxPrice);
  const [category, setCategory] = useState(currentCategory);
  const [sort, setSort] = useState(currentSort);

  // Apply filters
  const applyFilters = useCallback(() => {
    const params = new URLSearchParams();

    if (minPrice && minPrice !== "0") params.append("minPrice", minPrice);
    if (maxPrice_ && maxPrice_ !== maxPrice.toString()) params.append("maxPrice", maxPrice_);
    if (category) params.append("category", category);
    if (sort) params.append("sort", sort);

    const queryString = params.toString();
    router.push(`/catalog${queryString ? "?" + queryString : ""}`);
  }, [minPrice, maxPrice_, category, sort, maxPrice, router]);

  // Reset filters
  const resetFilters = useCallback(() => {
    setMinPrice("0");
    setMaxPrice(maxPrice.toString());
    setCategory("");
    setSort("");
    router.push("/catalog");
  }, [maxPrice, router]);

  return (
    <div className="w-full md:w-72 pr-0 md:pr-6 mb-6 md:mb-0">
      <div className="bg-white rounded-lg shadow-md p-6 motion-soft hover:shadow-lg">
        <h2 className="text-lg font-semibold mb-6 text-gray-900">Фильтры</h2>

        {/* Price Range Filter */}
        <div className="mb-6 pb-6 border-b border-gray-200">
          <h3 className="font-medium text-gray-800 mb-4 text-sm uppercase tracking-wide">Цена</h3>
          <div className="space-y-3">
            <div>
              <label className="block text-xs text-gray-600 mb-2 font-medium">От (₽)</label>
              <input
                type="number"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                min="0"
                max={maxPrice}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-md text-sm motion-soft focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-600 mb-2 font-medium">До (₽)</label>
              <input
                type="number"
                value={maxPrice_}
                onChange={(e) => setMaxPrice(e.target.value)}
                min="0"
                max={maxPrice}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-md text-sm motion-soft focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Category Filter */}
        {categories.length > 0 && (
          <div className="mb-6 pb-6 border-b border-gray-200">
            <h3 className="font-medium text-gray-800 mb-4 text-sm uppercase tracking-wide">Категория</h3>
            <div className="space-y-3">
              <label className="flex items-center cursor-pointer group">
                <input
                  type="radio"
                  name="category"
                  value=""
                  checked={category === ""}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-4 h-4 text-yellow-600 border-gray-300 focus:ring-yellow-500 cursor-pointer"
                />
                <span className="text-sm text-gray-700 ml-3 group-hover:text-gray-900 motion-soft">Все категории</span>
              </label>
              {categories.map((cat) => (
                <label key={cat.id} className="flex items-center cursor-pointer group">
                  <input
                    type="radio"
                    name="category"
                    value={cat.slug}
                    checked={category === cat.slug}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-4 h-4 text-yellow-600 border-gray-300 focus:ring-yellow-500 cursor-pointer"
                  />
                  <span className="text-sm text-gray-700 ml-3 group-hover:text-gray-900 motion-soft">{cat.name}</span>
                </label>
              ))}
            </div>
          </div>
        )}

        {/* Sort Filter */}
        <div className="mb-6">
          <h3 className="font-medium text-gray-800 mb-4 text-sm uppercase tracking-wide">Сортировка</h3>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="w-full px-3 py-2.5 border border-gray-200 rounded-md text-sm motion-soft focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent appearance-none bg-white"
          >
            <option value="">По умолчанию</option>
            <option value="newest">Новые первыми</option>
            <option value="price_asc">Цена: от низкой к высокой</option>
            <option value="price_desc">Цена: от высокой к низкой</option>
          </select>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2 pt-2">
          <button
            onClick={applyFilters}
            className="w-full bg-yellow-600 hover:bg-yellow-700 text-white font-medium py-2.5 px-4 rounded-md motion-soft transition-colors shadow-sm hover:shadow-md"
          >
            Применить
          </button>
          <button
            onClick={resetFilters}
            className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-2.5 px-4 rounded-md motion-soft transition-colors"
          >
            Сбросить
          </button>
        </div>
      </div>
    </div>
  );
}
