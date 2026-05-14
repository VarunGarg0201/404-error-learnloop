"use client";

import { Bell, Search, Sparkles } from "lucide-react";
import { usePathname } from "next/navigation";
import { useUIStore } from "@/store/ui-store";
import { useUserStore } from "@/store/user-store";
import { signOut } from "@/features/auth/actions";
import { Button } from "@/components/ui/button";
import { UserAvatar } from "@/components/shared/user-avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import Link from "next/link";

const PAGE_TITLES: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/discover": "Discover",
  "/rooms": "Study Rooms",
  "/squads": "Learning Squads",
  "/communities": "Communities",
  "/profile": "Profile",
  "/settings": "Settings",
  "/assistant": "AI Assistant",
};

interface TopNavProps {
  title?: string;
}

export function TopNav({ title }: TopNavProps) {
  const pathname = usePathname();
  const { setAiPanelOpen } = useUIStore();
  const { user } = useUserStore();

  const pageTitle = title || PAGE_TITLES[pathname] || "";


  return (
    <header
      className={cn(
        "sticky top-0 z-30 flex items-center justify-between h-14 px-4 lg:px-6",
        "bg-background/80 backdrop-blur-xl",
        "border-b border-border/50"
      )}
    >
      {/* Left: Page title */}
      <div className="flex items-center gap-3">
        {pageTitle && (
          <h1 className="text-sm font-semibold tracking-tight">{pageTitle}</h1>
        )}
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-1">
        {/* Search */}
        <Button
          variant="ghost"
          size="sm"
          className="h-8 px-2.5 text-muted-foreground hover:text-foreground"
        >
          <Search className="w-4 h-4" />
          <span className="hidden sm:inline ml-2 text-xs">Search</span>
          <kbd className="hidden lg:inline-flex ml-3 pointer-events-none h-5 items-center gap-0.5 rounded border border-border/60 bg-muted/50 px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
            ⌘K
          </kbd>
        </Button>

        {/* AI Assistant */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setAiPanelOpen(true)}
          className="h-8 px-2.5 text-muted-foreground hover:text-primary"
        >
          <Sparkles className="w-4 h-4" />
        </Button>

        {/* Notifications */}
        <Button
          variant="ghost"
          size="sm"
          className="h-8 px-2.5 text-muted-foreground hover:text-foreground relative"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-primary rounded-full" />
        </Button>

        {/* User Avatar */}
        <DropdownMenu>
          <DropdownMenuTrigger className="flex items-center justify-center h-8 w-8 rounded-full ml-1 hover:bg-accent/60 transition-colors outline-none">
            <UserAvatar
              src={user?.avatarUrl}
              name={user?.displayName || "User"}
              size="sm"
            />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">
                  {user?.displayName || "Student"}
                </p>
                <p className="text-xs text-muted-foreground">
                  {user?.email || "—"}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem render={<Link href="/profile" />}>
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem render={<Link href="/settings" />}>
              Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              variant="destructive"
              onClick={() => signOut()}
            >
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
