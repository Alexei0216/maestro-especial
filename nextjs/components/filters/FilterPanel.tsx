"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useCallback, useEffect, useRef } from "react";

interface FilterPanelProps {
  categories: Array<{ id: number; name: string; slug: string }>;
  maxPrice?: number;
  attributes?: {
    sizes: Array<{ id: string; name: string }>;
    types: Array<{ id: string; name: string }>;
  };
  onSearchChange?: (search: string) => void;
}

export default function FilterPanel({
  categories,
  maxPrice = 10000,
  attributes = { sizes: [], types: [] },
  onSearchChange,
}: FilterPanelProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const parsePositiveNumber = (value: string | null) => {
    if (value === null || value.trim() === "") return null;
    const parsed = Number(value);
    return Number.isFinite(parsed) && parsed >= 0 ? parsed : null;
  };

  // Get current filter values from URL
  const minPriceQuery = parsePositiveNumber(searchParams.get("minPrice"));
  const maxPriceQuery = parsePositiveNumber(searchParams.get("maxPrice"));
  const currentCategories =
    searchParams.get("categories")?.split(",").filter(Boolean) || [];
  const currentSort = searchParams.get("sort") || "";
  const currentSizes = searchParams.get("sizes")?.split(",").filter(Boolean) || [];
  const currentTypes = searchParams.get("types")?.split(",").filter(Boolean) || [];
  const currentSearch = searchParams.get("search") || "";

  const initialMinPrice =
    minPriceQuery !== null ? minPriceQuery : 0;
  const initialMaxPrice =
    maxPriceQuery !== null
      ? maxPriceQuery
      : maxPrice;

  const [priceRange, setPriceRange] = useState<[number, number]>([
    Math.min(initialMinPrice, initialMaxPrice),
    Math.max(initialMinPrice, initialMaxPrice),
  ]);
  const [selectedCategories, setSelectedCategories] =
    useState<string[]>(currentCategories);
  const [sort, setSort] = useState(currentSort);
  const [selectedSizes, setSelectedSizes] = useState<string[]>(currentSizes);
  const [selectedTypes, setSelectedTypes] = useState<string[]>(currentTypes);
  const [search, setSearch] = useState(currentSearch);
  const [activeHandle, setActiveHandle] = useState<"min" | "max" | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const isFirstAutoApplyRender = useRef(true);

  const clamp = (value: number, min: number, max: number) =>
    Math.min(max, Math.max(min, value));
  const snapValue = (value: number) => Math.round(value / 100) * 100;
  const valueFromPosition = (clientX: number) => {
    if (!trackRef.current) return 0;
    const rect = trackRef.current.getBoundingClientRect();
    const percent = (clientX - rect.left) / rect.width;
    return clamp(snapValue(percent * maxPrice), 0, maxPrice);
  };

  useEffect(() => {
    if (!activeHandle) return;

    const handleMove = (event: MouseEvent | TouchEvent) => {
      const clientX =
        "touches" in event ? event.touches[0]?.clientX : event.clientX;
      if (clientX === undefined) return;
      const nextValue = valueFromPosition(clientX);

      setPriceRange(([currentMin, currentMax]) => {
        if (activeHandle === "min") {
          const nextMin = Math.min(nextValue, currentMax);
          return [clamp(nextMin, 0, currentMax), currentMax];
        }
        const nextMax = Math.max(nextValue, currentMin);
        return [currentMin, clamp(nextMax, currentMin, maxPrice)];
      });
    };

    const stopDragging = () => setActiveHandle(null);

    document.addEventListener("mousemove", handleMove);
    document.addEventListener("touchmove", handleMove, {
      passive: false,
    } as EventListenerOptions);
    document.addEventListener("mouseup", stopDragging);
    document.addEventListener("touchend", stopDragging);

    return () => {
      document.removeEventListener("mousemove", handleMove);
      document.removeEventListener("touchmove", handleMove as EventListener);
      document.removeEventListener("mouseup", stopDragging);
      document.removeEventListener("touchend", stopDragging);
    };
  }, [activeHandle, maxPrice]);

  // Apply filters
  const applyFilters = useCallback((searchValue = search) => {
    const params = new URLSearchParams();

    if (priceRange[0] > 0) params.append("minPrice", priceRange[0].toString());
    if (priceRange[1] < maxPrice)
      params.append("maxPrice", priceRange[1].toString());
    if (selectedCategories.length > 0)
      params.append("categories", selectedCategories.join(","));
    if (sort) params.append("sort", sort);
    if (selectedSizes.length > 0) params.append("sizes", selectedSizes[0]);
    if (selectedTypes.length > 0) params.append("types", selectedTypes[0]);
    const normalizedSearch = searchValue.trim();
    if (normalizedSearch) params.append("search", normalizedSearch);
    const queryString = params.toString();
    router.replace(`/catalog${queryString ? "?" + queryString : ""}`, {
      scroll: false,
    });
  }, [priceRange, selectedCategories, sort, selectedSizes, selectedTypes, search, maxPrice, router, searchParams]);

  // Reset filters
  const resetFilters = useCallback(() => {
    setPriceRange([0, maxPrice]);
    setSelectedCategories([]);
    setSort("");
    setSelectedSizes([]);
    setSelectedTypes([]);
    setSearch("");
    if (onSearchChange) onSearchChange("");
    router.push("/catalog");
  }, [maxPrice, router, onSearchChange]);

  useEffect(() => {
    if (onSearchChange) onSearchChange(search);
  }, [search, onSearchChange]);

  useEffect(() => {
    if (isFirstAutoApplyRender.current) {
      isFirstAutoApplyRender.current = false;
      return;
    }

    const timer = setTimeout(() => {
      applyFilters(search);
    }, 300);

    return () => clearTimeout(timer);
  }, [search, priceRange, selectedCategories, sort, selectedSizes, selectedTypes, applyFilters]);

  return (
    <div className="w-full md:w-72 pr-0 md:pr-6 mb-6 md:mb-0">
      {/* Search Bar */}
      <div className="bg-white rounded-lg shadow-md p-6 motion-soft hover:shadow-lg mb-6">
        <h2 className="text-lg font-semibold mb-4 text-gray-900">Buscar</h2>
        <div className="relative">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar productos..."
            className="w-full px-4 py-2.5 border border-gray-200 rounded-md text-sm motion-soft focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
          />
          <svg
            className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 motion-soft hover:shadow-lg">
        <h2 className="text-lg font-semibold mb-6 text-gray-900">Filtros</h2>

        {/* Price Range Filter */}
        <div className="mb-6 pb-6 border-b border-gray-200">
          <h3 className="font-medium text-gray-800 mb-4 text-sm uppercase tracking-wide">
            Precio
          </h3>

          <div className="px-1 space-y-4">
            <div className="relative h-12" ref={trackRef}>
              <div className="absolute inset-x-0 top-1/2 h-2 -translate-y-1/2 rounded-full bg-gray-200" />
              <div
                className="absolute top-1/2 h-2 -translate-y-1/2 rounded-full bg-yellow-500"
                style={{
                  left: `${(priceRange[0] / maxPrice) * 100}%`,
                  width: `${((priceRange[1] - priceRange[0]) / maxPrice) * 100}%`,
                }}
              />

              <button
                type="button"
                aria-label="Precio mínimo"
                onMouseDown={() => setActiveHandle("min")}
                onTouchStart={() => setActiveHandle("min")}
                className="pointer-events-auto absolute top-1/2 h-5 w-5 -translate-y-1/2 -translate-x-1/2 rounded-full border-2 border-white bg-yellow-500 shadow focus:outline-none"
                style={{ left: `${(priceRange[0] / maxPrice) * 100}%` }}
              />
              <button
                type="button"
                aria-label="Precio máximo"
                onMouseDown={() => setActiveHandle("max")}
                onTouchStart={() => setActiveHandle("max")}
                className="pointer-events-auto absolute top-1/2 h-5 w-5 -translate-y-1/2 -translate-x-1/2 rounded-full border-2 border-white bg-yellow-500 shadow focus:outline-none"
                style={{ left: `${(priceRange[1] / maxPrice) * 100}%` }}
              />
            </div>

            <div className="grid grid-cols-2 gap-3 text-sm text-gray-700 font-medium">
              <div className="space-y-1">
                <div className="text-xs text-gray-500">Mín.</div>
                <div>{priceRange[0]} €</div>
              </div>
              <div className="space-y-1 text-right">
                <div className="text-xs text-gray-500">Máx.</div>
                <div>{priceRange[1]} €</div>
              </div>
            </div>
          </div>
        </div>

        {/* Category Filter */}
        {categories.length > 0 && (
          <div className="mb-6 pb-6 border-b border-gray-200">
            <h3 className="font-medium text-gray-800 mb-4 text-sm uppercase tracking-wide">
              Categoría
            </h3>
            <div className="space-y-2">
              {categories.map((cat) => {
                const categoryValue = cat.slug
                  ? `slug:${cat.slug}`
                  : `id:${cat.id}`;

                return (
                  <label
                    key={cat.id}
                    className="flex items-center cursor-pointer group"
                  >
                    <input
                      type="checkbox"
                      value={categoryValue}
                      checked={selectedCategories.includes(categoryValue)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedCategories((current) =>
                            Array.from(new Set([...current, categoryValue])),
                          );
                        } else {
                          setSelectedCategories((current) =>
                            current.filter((value) => value !== categoryValue),
                          );
                        }
                      }}
                      className="w-4 h-4 text-yellow-600 border-gray-300 rounded focus:ring-yellow-500 cursor-pointer"
                    />
                    <span className="text-sm text-gray-700 ml-3 group-hover:text-gray-900 motion-soft">
                      {cat.name}
                    </span>
                  </label>
                );
              })}
            </div>
          </div>
        )}

        {/* Sort Filter */}
        <div className="mb-6">
          <h3 className="font-medium text-gray-800 mb-4 text-sm uppercase tracking-wide">
            Ordenar
          </h3>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="w-full px-3 py-2.5 border border-gray-200 rounded-md text-sm motion-soft focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent appearance-none bg-white"
          >
            <option value="">Por defecto</option>
            <option value="newest">Más nuevos primero</option>
            <option value="name_asc">Nombre: A-Z</option>
            <option value="name_desc">Nombre: Z-A</option>
            <option value="price_asc">Precio: menor a mayor</option>
            <option value="price_desc">Precio: mayor a menor</option>
          </select>
        </div>

        {/* Size Filter */}
        {attributes.sizes.length > 0 && (
          <div className="mb-6">
            <h3 className="font-medium text-gray-800 mb-4 text-sm uppercase tracking-wide">Tamaño</h3>
            <div className="text-xs text-gray-500 mb-2">Selecciona solo un tamaño</div>
            <div className="space-y-2">
              {attributes.sizes.map((size) => (
                <label key={size.id} className="flex items-center cursor-pointer group">
                  <input
                    type="radio"
                    name="size"
                    checked={selectedSizes.includes(size.id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedSizes([size.id]);
                      } else {
                        setSelectedSizes([]);
                      }
                    }}
                    className="w-4 h-4 text-yellow-600 border-gray-300 focus:ring-yellow-500 cursor-pointer"
                  />
                  <span className="text-sm text-gray-700 ml-3 group-hover:text-gray-900 motion-soft">{size.name}</span>
                </label>
              ))}
            </div>
          </div>
        )}

        {/* Type Filter */}
        {attributes.types.length > 0 && (
          <div className="mb-6">
            <h3 className="font-medium text-gray-800 mb-4 text-sm uppercase tracking-wide">Tipo</h3>
            <div className="text-xs text-gray-500 mb-2">Selecciona solo un tipo</div>
            <div className="space-y-2">
              {attributes.types.map((type) => (
                <label key={type.id} className="flex items-center cursor-pointer group">
                  <input
                    type="radio"
                    name="type"
                    checked={selectedTypes.includes(type.id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedTypes([type.id]);
                      } else {
                        setSelectedTypes([]);
                      }
                    }}
                    className="w-4 h-4 text-yellow-600 border-gray-300 focus:ring-yellow-500 cursor-pointer"
                  />
                  <span className="text-sm text-gray-700 ml-3 group-hover:text-gray-900 motion-soft">{type.name}</span>
                </label>
              ))}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="space-y-2 pt-2">
          <button
            onClick={resetFilters}
            className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-2.5 px-4 rounded-md motion-soft transition-colors"
          >
            Restablecer
          </button>
        </div>
      </div>
    </div>
  );
}
