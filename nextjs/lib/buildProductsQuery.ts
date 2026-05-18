export type ProductSort =
  | "newest"
  | "price_asc"
  | "price_desc"
  | "name_asc"
  | "name_desc";

export type ProductSearchParams = Record<string, string | string[] | undefined>;

export interface BuildProductsQueryOptions {
  populate?: string[] | "*";
  page?: number;
  pageSize?: number;
}

const qs = {
  stringify: (input: Record<string, unknown>) => {
    const pairs: string[] = [];

    const append = (key: string, value: unknown) => {
      if (value === undefined || value === null || value === "") return;
      pairs.push(`${key}=${encodeURIComponent(String(value))}`);
    };

    const walk = (prefix: string, value: unknown) => {
      if (Array.isArray(value)) {
        value.forEach((item, index) => walk(`${prefix}[${index}]`, item));
        return;
      }

      if (value && typeof value === "object") {
        Object.entries(value as Record<string, unknown>).forEach(([key, nested]) => {
          walk(`${prefix}[${key}]`, nested);
        });
        return;
      }

      append(prefix, value);
    };

    Object.entries(input).forEach(([key, value]) => walk(key, value));
    return pairs.join("&");
  },
};

const SORT_MAP: Record<ProductSort, string> = {
  newest: "createdAt:desc",
  price_asc: "price:asc",
  price_desc: "price:desc",
  name_asc: "name:asc",
  name_desc: "name:desc",
};

const toNumber = (value?: string) => {
  if (!value) return undefined;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
};

const toBoolean = (value?: string) => {
  if (!value) return undefined;
  if (value === "true") return true;
  if (value === "false") return false;
  return undefined;
};

const toList = (value?: string) =>
  value
    ? value
        .split(",")
        .map((v) => v.trim())
        .filter(Boolean)
    : [];

export function buildProductsQuery(
  searchParams: ProductSearchParams,
  options: BuildProductsQueryOptions = {},
): string {
  const brands = toList(typeof searchParams.brands === "string" ? searchParams.brands : undefined);
  const categories = toList(
    typeof searchParams.categories === "string" ? searchParams.categories : undefined,
  );
  const energyClass = toList(
    typeof searchParams.energyClass === "string"
      ? searchParams.energyClass
      : undefined,
  );

  const minPrice = toNumber(typeof searchParams.minPrice === "string" ? searchParams.minPrice : undefined);
  const maxPrice = toNumber(typeof searchParams.maxPrice === "string" ? searchParams.maxPrice : undefined);
  const btu = toNumber(typeof searchParams.btu === "string" ? searchParams.btu : undefined);
  const roomArea = toNumber(typeof searchParams.roomArea === "string" ? searchParams.roomArea : undefined);
  const inverter = toBoolean(typeof searchParams.inverter === "string" ? searchParams.inverter : undefined);
  const wifi = toBoolean(typeof searchParams.wifi === "string" ? searchParams.wifi : undefined);
  const installationType = toList(
    typeof searchParams.installationType === "string"
      ? searchParams.installationType
      : undefined,
  );
  const search =
    typeof searchParams.search === "string" ? searchParams.search.trim() : "";

  const sortParam =
    typeof searchParams.sort === "string" ? searchParams.sort : undefined;
  const sort = sortParam && sortParam in SORT_MAP ? SORT_MAP[sortParam as ProductSort] : SORT_MAP.newest;

  const page =
    options.page ??
    toNumber(typeof searchParams.page === "string" ? searchParams.page : undefined) ??
    1;

  const pageSize =
    options.pageSize ??
    toNumber(typeof searchParams.pageSize === "string" ? searchParams.pageSize : undefined) ??
    12;

  const queryObject: Record<string, unknown> = {
    filters: {},
    sort,
    pagination: {
      page,
      pageSize,
    },
    populate: options.populate ?? "*",
  };

  const filters = queryObject.filters as Record<string, unknown>;

  if (brands.length > 0) {
    filters.brand = { slug: { $in: brands } };
  }

  if (categories.length > 0) {
    const categorySlugs = categories
      .filter((value) => value.startsWith("slug:"))
      .map((value) => value.replace("slug:", "").trim())
      .filter(Boolean);
    const categoryIds = categories
      .filter((value) => value.startsWith("id:"))
      .map((value) => Number(value.replace("id:", "").trim()))
      .filter((value) => Number.isFinite(value));

    if (categorySlugs.length > 0 && categoryIds.length > 0) {
      filters.$or = [
        ...(Array.isArray(filters.$or) ? (filters.$or as unknown[]) : []),
        { category: { slug: { $in: categorySlugs } } },
        { category: { id: { $in: categoryIds } } },
      ];
    } else if (categorySlugs.length > 0) {
      filters.category = { slug: { $in: categorySlugs } };
    } else if (categoryIds.length > 0) {
      filters.category = { id: { $in: categoryIds } };
    }
  }

  if (typeof inverter === "boolean") {
    filters.inverter = { $eq: inverter };
  }

  if (typeof wifi === "boolean") {
    filters.wifi = { $eq: wifi };
  }

  if (typeof btu === "number") {
    filters.btu = { $gte: btu };
  }

  if (typeof roomArea === "number") {
    filters.roomArea = { $gte: roomArea };
  }

  if (energyClass.length > 0) {
    filters.energyClass = { $in: energyClass };
  }

  if (installationType.length > 0) {
    filters.installationType = { $in: installationType };
  }

  if (typeof minPrice === "number") {
    filters.price = {
      ...(filters.price as Record<string, unknown> | undefined),
      $gte: minPrice,
    };
  }

  if (typeof maxPrice === "number") {
    filters.price = {
      ...(filters.price as Record<string, unknown> | undefined),
      $lte: maxPrice,
    };
  }

  if (search) {
    const searchOr = [
      { name: { $containsi: search } },
      { shortDescription: { $containsi: search } },
      { sku: { $containsi: search } },
    ];
    filters.$or = [
      ...(Array.isArray(filters.$or) ? (filters.$or as unknown[]) : []),
      ...searchOr,
    ];
  }

  return qs.stringify(queryObject);
}

