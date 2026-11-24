"use client";

import { usePathname } from "next/navigation";
import Header from "@/components/general/header";

export default function ConditionalHeader() {
  const pathname = usePathname();
  if (pathname?.startsWith("/admin")) return null;
  return <Header />;
}
