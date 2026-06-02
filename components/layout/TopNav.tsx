"use client";

import { Bell, Search } from "lucide-react";
import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { usePathname } from "next/navigation";

export function TopNav() {
  const [name, setName] = useState("");
  const pathname = usePathname();
  const supabase = createClient();

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user?.user_metadata?.name) {
        setName(user.user_metadata.name);
      }
    });
  }, [supabase]);

  const getPageTitle = () => {
    if (pathname.startsWith("/dashboard")) return "Dashboard";
    if (pathname.startsWith("/wishlist")) return "Wishlist";
    if (pathname.startsWith("/buylist")) return "Buy List";
    if (pathname.startsWith("/goals")) return "Goals";
    if (pathname.startsWith("/expenses")) return "Expenses";
    if (pathname.startsWith("/settings")) return "Settings";
    return "DreamVault";
  };

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-hairline bg-canvas-parchment/80 px-6 backdrop-blur-[20px] backdrop-saturate-[180%]">
      <div>
        <h2 className="text-body-strong text-ink">
          {getPageTitle()}
        </h2>
      </div>

      <div className="flex items-center gap-2">
        <button
          className="flex h-9 w-9 items-center justify-center rounded-full bg-surface-pearl text-ink-muted-80 transition-all duration-200 hover:bg-divider-soft active:scale-95"
          aria-label="Search"
        >
          <Search className="h-4 w-4" />
        </button>
        <button
          className="relative flex h-9 w-9 items-center justify-center rounded-full bg-surface-pearl text-ink-muted-80 transition-all duration-200 hover:bg-divider-soft active:scale-95"
          aria-label="Notifications"
        >
          <Bell className="h-4 w-4" />
          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-danger ring-2 ring-canvas-parchment" />
        </button>
        <div className="ml-1 flex h-9 w-9 items-center justify-center rounded-full bg-primary text-[13px] font-semibold text-on-primary">
          {name?.charAt(0)?.toUpperCase() || "D"}
        </div>
      </div>
    </header>
  );
}
