export interface NavItem {
  label: string;
  href: string;
  children?: { label: string; href: string }[];
}

// Static entries only. The "Category" dropdown is built dynamically at
// render time in Header from the live /api/categories list — see
// components/general/header.tsx.
export const staticNavItems: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "Single Post", href: "/post/sample" },
  {
    label: "Pages",
    href: "/pages",
    children: [
      { label: "About", href: "/about" },
      { label: "Contact", href: "/contact" },
    ],
  },
  { label: "Shop", href: "/shop" },
];
