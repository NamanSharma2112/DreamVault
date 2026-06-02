"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Heart,
  ShoppingBag,
  Target,
  PlusCircle,
} from "lucide-react";

const navItems = [
  { href: "/dashboard", label: "Home", icon: LayoutDashboard },
  { href: "/wishlist", label: "Wishlist", icon: Heart },
  { href: "/add", label: "Add", icon: PlusCircle },
  { href: "/buylist", label: "Buy", icon: ShoppingBag },
  { href: "/goals", label: "Goals", icon: Target },
];

export function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-hairline bg-canvas-parchment/80 backdrop-blur-xl backdrop-saturate-[180%] lg:hidden">
      <div className="mx-auto flex max-w-lg items-center justify-around px-2 pb-[env(safe-area-inset-bottom)] pt-1">
        {navItems.map((item) => {
          const isActive =
            pathname === item.href || pathname.startsWith(item.href + "/");
          const isAdd = item.href === "/add";
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center gap-0.5 px-3 py-1.5 transition-all duration-200",
                isAdd &&
                  "relative -top-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary p-0 text-on-primary active:scale-95",
                !isAdd && isActive && "text-primary",
                !isAdd && !isActive && "text-ink-muted-48"
              )}
            >
              <item.icon className={cn("h-5 w-5", isAdd && "h-6 w-6")} />
              {!isAdd && (
                <span className={cn(
                  "text-[10px] font-medium",
                  isActive && "text-primary"
                )}>{item.label}</span>
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
