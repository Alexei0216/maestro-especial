"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

interface FilterPanelProps {
  categories: Array<{ id: number; name: string; slug: string }>;
  brands: Array<{ id: number; title: string; slug: string }>;
  btuOptions: number[];
  roomAreaOptions: number[];
  energyClassOptions: string[];
  installationTypeOptions: string[];
  maxPrice?: number;
  onSearchChange?: (search: string) => void;
}

const parseList = (value: string | null) =>
  (value ?? "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

const getCategoryValue = (category: { id: number; slug: string }) =>
  category.slug?.trim() ? `slug:${category.slug.trim()}` : `id:${category.id}`;

export default function FilterPanel({
  categories,
  brands,
  btuOptions,
  roomAreaOptions,
  energyClassOptions,
  installationTypeOptions,
  maxPrice = 10000,
  onSearchChange,
}: FilterPanelProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const searchInUrl = searchParams.get("search") ?? "";
  const sort = searchParams.get("sort") ?? "";
  const selectedBrands = parseList(searchParams.get("brands"));
  const selectedEnergyClass = parseList(searchParams.get("energyClass"));
  const selectedBTU = searchParams.get("btu") ?? "";
  const selectedRoomArea = searchParams.get("roomArea") ?? "";
  const selectedInstallationType = searchParams.get("installationType") ?? "";
  const inverterOnly = searchParams.get("inverter") === "true";
  const wifiOnly = searchParams.get("wifi") === "true";
  const minPrice = searchParams.get("minPrice") ?? "";
  const maxPriceValue = searchParams.get("maxPrice") ?? "";
  const selectedCategories = parseList(searchParams.get("categories"));

  const [searchInput, setSearchInput] = useState(searchInUrl);
  const isFirstSearchRender = useRef(true);
  const [activeHandle, setActiveHandle] = useState<"min" | "max" | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, maxPrice]);

  useEffect(() => {
    setSearchInput(searchInUrl);
  }, [searchInUrl]);

  useEffect(() => {
    if (onSearchChange) onSearchChange(searchInput);
  }, [searchInput, onSearchChange]);

  const updateParams = (mutate: (params: URLSearchParams) => void) => {
    const params = new URLSearchParams(searchParams.toString());
    mutate(params);
    params.delete("page");
    const query = params.toString();
    router.replace(`/catalog${query ? `?${query}` : ""}`, { scroll: false });
  };

  const rawMin = Number(minPrice);
  const rawMax = Number(maxPriceValue);
  const normalizedMin = Number.isFinite(rawMin) ? rawMin : 0;
  const normalizedMax = Number.isFinite(rawMax) ? rawMax : maxPrice;

  useEffect(() => {
    setPriceRange([normalizedMin, normalizedMax]);
  }, [normalizedMin, normalizedMax]);

  useEffect(() => {
    if (!activeHandle || !trackRef.current) return;

    const clamp = (value: number, min: number, max: number) =>
      Math.min(max, Math.max(min, value));
    const snap = (value: number) => Math.round(value / 100) * 100;

    const handleMove = (event: MouseEvent | TouchEvent) => {
      const clientX =
        "touches" in event ? event.touches[0]?.clientX : event.clientX;
      if (clientX === undefined || !trackRef.current) return;
      const rect = trackRef.current.getBoundingClientRect();
      const percent = (clientX - rect.left) / rect.width;
      const nextValue = clamp(snap(percent * maxPrice), 0, maxPrice);

      setPriceRange(([currentMin, currentMax]) => {
        if (activeHandle === "min") {
          const nextMin = Math.min(nextValue, currentMax);
          return [clamp(nextMin, 0, currentMax), currentMax];
        }
        const nextMax = Math.max(nextValue, currentMin);
        return [currentMin, clamp(nextMax, currentMin, maxPrice)];
      });
    };

    const stop = () => {
      setActiveHandle(null);
      updateParams((params) => {
        const [nextMin, nextMax] = priceRange;
        if (nextMin <= 0) params.delete("minPrice");
        else params.set("minPrice", String(nextMin));

        if (nextMax >= maxPrice) params.delete("maxPrice");
        else params.set("maxPrice", String(nextMax));
      });
    };
    document.addEventListener("mousemove", handleMove);
    document.addEventListener("touchmove", handleMove, {
      passive: false,
    } as EventListenerOptions);
    document.addEventListener("mouseup", stop);
    document.addEventListener("touchend", stop);

    return () => {
      document.removeEventListener("mousemove", handleMove);
      document.removeEventListener("touchmove", handleMove as EventListener);
      document.removeEventListener("mouseup", stop);
      document.removeEventListener("touchend", stop);
    };
  }, [activeHandle, maxPrice, priceRange]);

  useEffect(() => {
    if (isFirstSearchRender.current) {
      isFirstSearchRender.current = false;
      return;
    }

    const timer = setTimeout(() => {
      updateParams((params) => {
        const value = searchInput.trim();
        if (value) params.set("search", value);
        else params.delete("search");
      });
    }, 300);

    return () => clearTimeout(timer);
  }, [searchInput]);

  const selectedBrandSet = useMemo(
    () => new Set(selectedBrands),
    [selectedBrands],
  );
  const selectedEnergySet = useMemo(
    () => new Set(selectedEnergyClass),
    [selectedEnergyClass],
  );

  return (
    <div className="w-full md:w-72 pr-0 md:pr-6 mb-6 md:mb-0">
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4 text-gray-900">Buscar</h2>
        <input
          type="text"
          value={searchInput}
          onChange={(event) => setSearchInput(event.target.value)}
          placeholder="Buscar productos..."
          className="w-full px-4 py-2.5 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
        />
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-lg font-semibold mb-6 text-gray-900">Filtros</h2>

        <div className="mb-6 pb-6 border-b border-gray-200">
          <h3 className="font-medium text-gray-800 mb-3 text-sm uppercase tracking-wide">
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
                className="absolute top-1/2 h-5 w-5 -translate-y-1/2 -translate-x-1/2 rounded-full border-2 border-white bg-yellow-500 shadow"
                style={{ left: `${(priceRange[0] / maxPrice) * 100}%` }}
              />
              <button
                type="button"
                aria-label="Precio máximo"
                onMouseDown={() => setActiveHandle("max")}
                onTouchStart={() => setActiveHandle("max")}
                className="absolute top-1/2 h-5 w-5 -translate-y-1/2 -translate-x-1/2 rounded-full border-2 border-white bg-yellow-500 shadow"
                style={{ left: `${(priceRange[1] / maxPrice) * 100}%` }}
              />
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm text-gray-700 font-medium">
              <div>
                <div className="text-xs text-gray-500">Mín.</div>
                <div>{priceRange[0]} €</div>
              </div>
              <div className="text-right">
                <div className="text-xs text-gray-500">Máx.</div>
                <div>{priceRange[1]} €</div>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-6 pb-6 border-b border-gray-200">
          <h3 className="font-medium text-gray-800 mb-3 text-sm uppercase tracking-wide">
            Categoría
          </h3>
          <div className="space-y-2">
            {categories.map((category) => {
              const value = getCategoryValue(category);
              return (
                <label
                  key={category.id}
                  className="flex items-center gap-2 text-sm text-gray-700"
                >
                  <input
                    className="accent-yellow-500"
                    type="checkbox"
                    checked={selectedCategories.includes(value)}
                    onChange={(event) => {
                      const next = event.target.checked
                        ? [...new Set([...selectedCategories, value])]
                        : selectedCategories.filter((item) => item !== value);
                      updateParams((params) => {
                        if (next.length === 0) params.delete("categories");
                        else params.set("categories", next.join(","));
                      });
                    }}
                  />
                  {category.name}
                </label>
              );
            })}
          </div>
        </div>

        <div className="mb-6 pb-6 border-b border-gray-200">
          <h3 className="font-medium text-gray-800 mb-3 text-sm uppercase tracking-wide">
            Marca
          </h3>
          <div className="space-y-2">
            {brands.map((brand) => (
              <label
                key={brand.id}
                className="flex items-center gap-2 text-sm text-gray-700"
              >
                <input
                  className="accent-yellow-500"
                  type="checkbox"
                  checked={selectedBrandSet.has(brand.slug)}
                  onChange={(event) => {
                    const next = event.target.checked
                      ? [...new Set([...selectedBrands, brand.slug])]
                      : selectedBrands.filter((slug) => slug !== brand.slug);

                    updateParams((params) => {
                      if (next.length === 0) params.delete("brands");
                      else params.set("brands", next.join(","));
                    });
                  }}
                />
                {brand.title}
              </label>
            ))}
          </div>
        </div>

        <div className="mb-6 pb-6 border-b border-gray-200">
          <h3 className="font-medium text-gray-800 mb-3 text-sm uppercase tracking-wide">
            BTU
          </h3>
          <select
            value={selectedBTU}
            onChange={(event) => {
              const value = event.target.value;
              updateParams((params) => {
                if (value) params.set("btu", value);
                else params.delete("btu");
              });
            }}
            className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm"
          >
            <option value="">Cualquiera</option>
            {btuOptions.map((btu) => (
              <option key={btu} value={String(btu)}>{`${btu}+`}</option>
            ))}
          </select>
        </div>

        <div className="mb-6 pb-6 border-b border-gray-200">
          <h3 className="font-medium text-gray-800 mb-3 text-sm uppercase tracking-wide">
            Área recomendada
          </h3>
          <select
            value={selectedRoomArea}
            onChange={(event) => {
              const value = event.target.value;
              updateParams((params) => {
                if (value) params.set("roomArea", value);
                else params.delete("roomArea");
              });
            }}
            className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm"
          >
            <option value="">Cualquiera</option>
            {roomAreaOptions.map((area) => (
              <option key={area} value={String(area)}>{`${area} m²+`}</option>
            ))}
          </select>
        </div>

        <div className="mb-6 pb-6 border-b border-gray-200">
          <h3 className="font-medium text-gray-800 mb-3 text-sm uppercase tracking-wide">
            Clase energética
          </h3>
          <div className="space-y-2">
            {energyClassOptions.map((energy) => (
              <label
                key={energy}
                className="flex items-center gap-2 text-sm text-gray-700"
              >
                <input
                  className="accent-yellow-500"
                  type="checkbox"
                  checked={selectedEnergySet.has(energy)}
                  onChange={(event) => {
                    const next = event.target.checked
                      ? [...new Set([...selectedEnergyClass, energy])]
                      : selectedEnergyClass.filter((value) => value !== energy);

                    updateParams((params) => {
                      if (next.length === 0) params.delete("energyClass");
                      else params.set("energyClass", next.join(","));
                    });
                  }}
                />
                {energy}
              </label>
            ))}
          </div>
        </div>

        <div className="mb-6 pb-6 border-b border-gray-200">
          <h3 className="font-medium text-gray-800 mb-3 text-sm uppercase tracking-wide">
            Instalación
          </h3>
          <select
            value={selectedInstallationType}
            onChange={(event) => {
              const value = event.target.value;
              updateParams((params) => {
                if (value) params.set("installationType", value);
                else params.delete("installationType");
              });
            }}
            className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm"
          >
            <option value="">Cualquiera</option>
            {installationTypeOptions.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-6 pb-6 border-b border-gray-200 space-y-2">
          <h3 className="font-medium text-gray-800 mb-3 text-sm uppercase tracking-wide">
            Tecnología
          </h3>
          <p className="text-xs text-gray-500 mb-2">
            Funciones clave del equipo
          </p>
          <label className="flex items-center gap-2 text-sm text-gray-700">
            <input
              className="accent-yellow-500"
              type="checkbox"
              checked={inverterOnly}
              onChange={(event) => {
                updateParams((params) => {
                  if (event.target.checked) params.set("inverter", "true");
                  else params.delete("inverter");
                });
              }}
            />
            Compresor Inverter
          </label>
          <label className="flex items-center gap-2 text-sm text-gray-700">
            <input
              className="accent-yellow-500"
              type="checkbox"
              checked={wifiOnly}
              onChange={(event) => {
                updateParams((params) => {
                  if (event.target.checked) params.set("wifi", "true");
                  else params.delete("wifi");
                });
              }}
            />
            Conectividad Wi-Fi
          </label>
        </div>

        <div className="mb-6">
          <h3 className="font-medium text-gray-800 mb-3 text-sm uppercase tracking-wide">
            Ordenar
          </h3>
          <select
            value={sort}
            onChange={(event) => {
              const value = event.target.value;
              updateParams((params) => {
                if (value) params.set("sort", value);
                else params.delete("sort");
              });
            }}
            className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm"
          >
            <option value="">Por defecto</option>
            <option value="newest">Más nuevos primero</option>
            <option value="name_asc">Nombre: A-Z</option>
            <option value="name_desc">Nombre: Z-A</option>
            <option value="price_asc">Precio: menor a mayor</option>
            <option value="price_desc">Precio: mayor a menor</option>
          </select>
        </div>

        <button
          onClick={() => router.replace("/catalog", { scroll: false })}
          className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-2.5 px-4 rounded-md transition-colors"
        >
          Restablecer
        </button>
      </div>
    </div>
  );
}
