import { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

type MenuLinkIconName = "home" | "catalog" | "contact" | "checkout";

export function MenuIcon(props: IconProps) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2.2"
      className="h-5 w-5"
      {...props}
    >
      <path d="M4 7h16" />
      <path d="M4 12h16" />
      <path d="M4 17h16" />
    </svg>
  );
}

export function CloseIcon(props: IconProps) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2.2"
      className="h-5 w-5"
      {...props}
    >
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  );
}

export function CartIcon(props: IconProps) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2.2"
      className="h-5 w-5"
      {...props}
    >
      <path d="M6 6h15l-1.5 9h-12z" />
      <path d="M6 6 5 3H2" />
      <circle cx="9" cy="20" r="1" />
      <circle cx="18" cy="20" r="1" />
    </svg>
  );
}

export function ChevronLeftIcon(props: IconProps) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2.2"
      className="h-5 w-5"
      {...props}
    >
      <path d="m15 18-6-6 6-6" />
    </svg>
  );
}

export function ChevronRightIcon(props: IconProps) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2.2"
      className="h-5 w-5"
      {...props}
    >
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}

export function CatalogIcon(props: IconProps) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2.2"
      className="h-5 w-5"
      {...props}
    >
      <path d="M4 7h16a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2Z" />
      <path d="M4 11h16" />
      <path d="M8 15h8" />
    </svg>
  );
}

export function ContactIcon(props: IconProps) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2.2"
      className="h-5 w-5"
      {...props}
    >
      <path d="M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4z" />
      <path d="M8 10h8" />
      <path d="M8 14h5" />
    </svg>
  );
}

export function CheckoutIcon(props: IconProps) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2.2"
      className="h-5 w-5"
      {...props}
    >
      <rect x="3" y="8" width="18" height="10" rx="2" />
      <path d="M3 12h18" />
      <path d="M7 16.5 10 19.5 15 14" />
    </svg>
  );
}

export function HomeIcon(props: IconProps) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2.2"
      className="h-10 w-10"
      {...props}
    >
      <path d="m3 11 9-8 9 8" />
      <path d="M5 11v9a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-9" />
      <path d="M9 21V13h6v8" />
    </svg>
  );
}

export function MenuLinkIcon({ icon, ...props }: { icon: MenuLinkIconName } & IconProps) {
  const sharedProps = {
    "aria-hidden": true,
    ...props,
  };

  if (icon === "catalog") return <CatalogIcon {...sharedProps} />;
  if (icon === "contact") return <ContactIcon {...sharedProps} />;
  if (icon === "checkout") return <CheckoutIcon {...sharedProps} />;
  return <HomeIcon {...sharedProps} />;
}
