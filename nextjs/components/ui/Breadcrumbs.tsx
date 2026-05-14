"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  customItems?: BreadcrumbItem[];
  productData?: {
    name: string;
    category?: {
      name: string;
      slug: string;
    };
  };
}

export default function Breadcrumbs({
  customItems,
  productData,
}: BreadcrumbsProps) {
  const pathname = usePathname();

  if (pathname === "/") {
    return null;
  }

  const buildBreadcrumbs = (): BreadcrumbItem[] => {
    const segments = pathname.split("/").filter(Boolean);
    const breadcrumbs: BreadcrumbItem[] = [];

    breadcrumbs.push({ label: "Inicio", href: "/" });

    let currentPath = "";

    for (let i = 0; i < segments.length; i++) {
      currentPath += `/${segments[i]}`;

      switch (segments[i]) {
        case "catalog":
          breadcrumbs.push({ label: "Catálogo", href: "/catalog" });
          break;
        case "checkout":
          breadcrumbs.push({ label: "Checkout" });
          break;
        case "contact":
          breadcrumbs.push({ label: "Contacto" });
          break;
        case "products":
          if (productData) {
            breadcrumbs.push({ label: "Catálogo", href: "/catalog" });
            if (productData.category) {
              breadcrumbs.push({
                label: productData.category.name,
                href: `/catalog?category=${productData.category.slug}`,
              });
            }
            breadcrumbs.push({ label: productData.name });
          }
          break;
        default:
          breadcrumbs.push({ label: segments[i] });
      }
    }

    return breadcrumbs;
  };

  const items = customItems || buildBreadcrumbs();

  return (
    <nav className="flex mb-6 mt-3" aria-label="Breadcrumb">
      <ol className="flex items-center space-x-2 text-sm text-gray-600">
        {items.map((item, index) => (
          <li key={index} className="flex items-center">
            {index > 0 && (
              <svg
                className="w-4 h-4 mx-2 text-gray-400"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            )}
            {item.href ? (
              <Link
                href={item.href}
                className="hover:text-gray-900 transition-colors"
              >
                {item.label}
              </Link>
            ) : (
              <span className="text-gray-900 font-medium">{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
