import Link from "next/link";
import { ChevronRightIcon } from "@/components/icons";

export type ServiceCardProps = {
  title: string;
  description: string;
  href: string;
  inverted?: boolean;
};

export default function ServiceCard({
  title,
  description,
  href,
  inverted = false,
}: ServiceCardProps) {
  return (
    <Link href={href}>
      <article
        className={`motion-soft h-full rounded-lg border p-5 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg ${
          inverted
            ? "border-white/10 bg-white/10 hover:bg-white/15"
            : "border-neutral-200 bg-white"
        }`}
      >
        <div className="flex flex-col gap-3">
          <div>
            <h3 className={`text-2xl font-bold ${inverted ? "text-white" : "text-neutral-900"}`}>
              {title}
            </h3>
            <p className={`mt-3 leading-7 ${inverted ? "text-white/80" : "text-neutral-600"}`}>
              {description}
            </p>
          </div>
          <div className="mt-auto flex items-center gap-2 text-yellow-700 font-semibold">
            Ver más
            <ChevronRightIcon />
          </div>
        </div>
      </article>
    </Link>
  );
}
