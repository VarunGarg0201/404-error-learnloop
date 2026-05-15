"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Compass,
  Users,
  MessageSquare,
  BookOpen,
  Sparkles,
  Settings,
  ChevronLeft,
  Zap,
  Coins,
  GraduationCap,
  TrendingUp,
  Rss,
  Brain,
  Rocket,
  Bell,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useUIStore } from "@/store/ui-store";
import { useUserStore } from "@/store/user-store";
import { UserAvatar } from "@/components/shared/user-avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const navItems = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Discover", href: "/discover", icon: Compass },
  { label: "Feed", href: "/feed", icon: Rss },
  { label: "Rooms", href: "/rooms", icon: MessageSquare },
  { label: "Squads", href: "/squads", icon: Users },
  { label: "Communities", href: "/communities", icon: BookOpen },
  { label: "Projects", href: "/projects", icon: Rocket },
  { label: "Teach", href: "/teach", icon: GraduationCap },
  { label: "DNA", href: "/dna", icon: Brain },
  { label: "Growth", href: "/growth", icon: TrendingUp },
  { label: "Credits", href: "/credits", icon: Coins },
  { label: "Notifications", href: "/notifications", icon: Bell },
];

const bottomNavItems = [
  { label: "AI Assistant", href: "/assistant", icon: Sparkles },
  { label: "Settings", href: "/settings", icon: Settings },
];

function NavLink({
  item,
  isActive,
  collapsed,
}: {
  item: (typeof navItems)[0];
  isActive: boolean;
  collapsed: boolean;
}) {
  const Icon = item.icon;

  return (
    <Link
      href={item.href}
      className={cn(
        "group flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-sm font-medium",
        "transition-all duration-150 ease-out",
        "relative overflow-hidden",
        isActive
          ? "bg-primary/10 text-primary"
          : "text-muted-foreground hover:text-foreground hover:bg-accent/60"
      )}
    >
      {isActive && (
        <motion.div
          layoutId="sidebar-active"
          className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-primary rounded-r-full"
          transition={{ type: "spring", stiffness: 350, damping: 30 }}
        />
      )}
      <Icon
        className={cn(
          "w-[18px] h-[18px] shrink-0 transition-colors duration-150",
          isActive
            ? "text-primary"
            : "text-muted-foreground group-hover:text-foreground"
        )}
      />
      <AnimatePresence>
        {!collapsed && (
          <motion.span
            initial={{ opacity: 0, x: -4 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -4 }}
            transition={{ duration: 0.12 }}
            className="whitespace-nowrap"
          >
            {item.label}
          </motion.span>
        )}
      </AnimatePresence>
    </Link>
  );
}

export function Sidebar() {
  const pathname = usePathname();
  const { sidebarCollapsed, toggleSidebar } = useUIStore();
  const { user } = useUserStore();

  return (
    <motion.aside
      initial={false}
      animate={{ width: sidebarCollapsed ? 68 : 240 }}
      transition={{ duration: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
      className={cn(
        "hidden md:flex flex-col h-screen sticky top-0 z-40",
        "bg-sidebar border-r border-sidebar-border",
        "select-none"
      )}
    >
      {/* ─── Logo ─── */}
      <div className="flex items-center h-14 px-4 border-b border-sidebar-border">
        <Link
          href="/dashboard"
          className="flex items-center gap-2.5 overflow-hidden"
        >
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10 shrink-0">
            <Zap className="w-4 h-4 text-primary" />
          </div>
          <AnimatePresence>
            {!sidebarCollapsed && (
              <motion.span
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -8 }}
                transition={{ duration: 0.15 }}
                className="font-semibold text-sm tracking-tight whitespace-nowrap"
              >
                LearnLoop
              </motion.span>
            )}
          </AnimatePresence>
        </Link>
      </div>

      {/* ─── Main Nav ─── */}
      <nav className="flex-1 px-2 py-3 space-y-0.5 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = pathname.startsWith(item.href);

          if (sidebarCollapsed) {
            return (
              <Tooltip key={item.href}>
                <TooltipTrigger
                  render={
                    <NavLink
                      item={item}
                      isActive={isActive}
                      collapsed={sidebarCollapsed}
                    />
                  }
                />
                <TooltipContent side="right" sideOffset={8}>
                  {item.label}
                </TooltipContent>
              </Tooltip>
            );
          }

          return (
            <NavLink
              key={item.href}
              item={item}
              isActive={isActive}
              collapsed={sidebarCollapsed}
            />
          );
        })}
      </nav>

      {/* ─── Bottom Nav ─── */}
      <div className="px-2 py-3 space-y-0.5 border-t border-sidebar-border">
        {bottomNavItems.map((item) => {
          const isActive = pathname.startsWith(item.href);

          if (sidebarCollapsed) {
            return (
              <Tooltip key={item.href}>
                <TooltipTrigger
                  render={
                    <NavLink
                      item={item}
                      isActive={isActive}
                      collapsed={sidebarCollapsed}
                    />
                  }
                />
                <TooltipContent side="right" sideOffset={8}>
                  {item.label}
                </TooltipContent>
              </Tooltip>
            );
          }

          return (
            <NavLink
              key={item.href}
              item={item}
              isActive={isActive}
              collapsed={sidebarCollapsed}
            />
          );
        })}

        {/* Collapse Toggle */}
        <button
          onClick={toggleSidebar}
          className={cn(
            "flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-sm font-medium w-full",
            "text-muted-foreground hover:text-foreground hover:bg-accent/60",
            "transition-all duration-150 ease-out"
          )}
        >
          <motion.div
            animate={{ rotate: sidebarCollapsed ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronLeft className="w-[18px] h-[18px] shrink-0" />
          </motion.div>
          <AnimatePresence>
            {!sidebarCollapsed && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.12 }}
                className="whitespace-nowrap"
              >
                Collapse
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </div>

      {/* ─── User Profile ─── */}
      <div className="px-2 py-3 border-t border-sidebar-border">
        <div
          className={cn(
            "flex items-center gap-2.5 px-2.5 py-2 rounded-lg",
            "hover:bg-accent/60 transition-colors cursor-pointer",
            sidebarCollapsed && "justify-center px-0"
          )}
        >
          <UserAvatar
            name={user?.displayName || "Student"}
            src={user?.avatarUrl}
            size="sm"
            showOnline
          />
          <AnimatePresence>
            {!sidebarCollapsed && (
              <motion.div
                initial={{ opacity: 0, x: -4 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -4 }}
                transition={{ duration: 0.12 }}
                className="flex-1 min-w-0"
              >
                <p className="text-[12px] font-semibold truncate">
                  {user?.displayName || "Student"}
                </p>
                <p className="text-[10px] text-muted-foreground truncate">
                  ⚡ {user?.knowledgeCredits ?? 142} KC
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.aside>
  );
}
