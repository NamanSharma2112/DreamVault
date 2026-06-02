"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Heart,
  ShoppingBag,
  Target,
  Goal,
  Settings,
  LogOut,
  Sparkles,
  Receipt,
} from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";

const mainNavItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/wishlist", label: "Wishlist", icon: Heart },
  { href: "/buylist", label: "Buy List", icon: ShoppingBag },
  { href: "/goals", label: "Goals", icon: Goal },
  { href: "/expenses", label: "Expenses", icon: Receipt },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  return (
    <aside className="fixed inset-y-0 left-0 z-40 hidden h-full w-64 flex-col border-r border-hairline bg-canvas-parchment lg:flex">
      {/* Logo */}
      <div className="flex h-16 items-center px-6">
        <Link href="/dashboard" className="flex items-center gap-2.5 text-body-strong tracking-tight text-ink">
          <div className="flex h-8 w-8 items-center justify-center rounded-[8px] bg-primary">
            <Sparkles className="h-4 w-4 text-on-primary" />
          </div>
          DreamVault
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 space-y-1 px-3 py-4">
        {mainNavItems.map((item) => {
          const isActive =
            pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-[11px] px-3 py-2.5 text-[15px] font-medium transition-all duration-200",
                isActive
                  ? "bg-primary/10 text-primary"
                  : "text-ink-muted-80 hover:bg-black/[0.04] hover:text-ink"
              )}
            >
              <item.icon className={cn("h-[18px] w-[18px]", isActive && "text-primary")} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="border-t border-hairline p-3 space-y-1">
        <Link
          href="/settings"
          className={cn(
            "flex items-center gap-3 rounded-[11px] px-3 py-2.5 text-[15px] font-medium transition-all duration-200",
            pathname === "/settings"
              ? "bg-primary/10 text-primary"
              : "text-ink-muted-80 hover:bg-black/[0.04] hover:text-ink"
          )}
        >
          <Settings className={cn("h-[18px] w-[18px]", pathname === "/settings" && "text-primary")} />
          Settings
        </Link>
        <button
          onClick={handleSignOut}
          className="flex w-full items-center gap-3 rounded-[11px] px-3 py-2.5 text-[15px] font-medium text-ink-muted-80 transition-all duration-200 hover:bg-black/[0.04] hover:text-danger active:scale-[0.98]"
        >
          <LogOut className="h-[18px] w-[18px]" />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
