"use client";

import { useState } from "react";
import { useTheme } from "next-themes";
import { PageHeader } from "@/components/shared/page-header";
import { SurfaceCard } from "@/components/shared/cards";
import { UserAvatar } from "@/components/shared/user-avatar";
import { useUserStore } from "@/store/user-store";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import {
  User,
  Shield,
  Bell,
  Palette,
  Globe,
  Lock,
  Smartphone,
  Mail,
  Monitor,
  Moon,
  Sun,
  Eye,
  EyeOff,
  ChevronRight,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { signOut } from "@/features/auth/actions";

/* ═══════════════════════════════════════════════════════════
   Settings Page — Interactive preferences
   ═══════════════════════════════════════════════════════════ */

function SettingRow({
  icon: Icon,
  label,
  description,
  children,
  danger,
}: {
  icon: typeof User;
  label: string;
  description?: string;
  children?: React.ReactNode;
  danger?: boolean;
}) {
  return (
    <div className="flex items-center justify-between py-3">
      <div className="flex items-center gap-3">
        <div
          className={cn(
            "flex items-center justify-center w-8 h-8 rounded-lg shrink-0",
            danger ? "bg-destructive/10" : "bg-muted/60"
          )}
        >
          <Icon
            className={cn(
              "w-4 h-4",
              danger ? "text-destructive" : "text-muted-foreground"
            )}
          />
        </div>
        <div>
          <p
            className={cn(
              "text-sm font-medium",
              danger && "text-destructive"
            )}
          >
            {label}
          </p>
          {description && (
            <p className="text-[11px] text-muted-foreground mt-0.5">
              {description}
            </p>
          )}
        </div>
      </div>
      {children}
    </div>
  );
}

function SettingSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <SurfaceCard>
      <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
        {title}
      </h3>
      <div className="divide-y divide-border/30">{children}</div>
    </SurfaceCard>
  );
}

export default function SettingsPage() {
  const { user } = useUserStore();
  const { theme, setTheme } = useTheme();

  const [notifications, setNotifications] = useState({
    matches: true,
    messages: true,
    squadCheckIn: true,
    creditEarned: true,
    emailDigest: false,
    pushNotifications: true,
  });

  const [privacy, setPrivacy] = useState({
    profilePublic: true,
    showOnlineStatus: true,
    showKC: true,
    showLearningDNA: true,
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Settings"
        description="Manage your account, privacy, and preferences."
      />

      <div className="space-y-5 max-w-2xl">
        {/* Account Section */}
        <SettingSection title="Account">
          <SettingRow icon={User} label="Profile" description={user?.email || "Manage your profile details"}>
            <div className="flex items-center gap-2">
              <UserAvatar name={user?.displayName || "Student"} src={user?.avatarUrl} size="sm" />
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </div>
          </SettingRow>
          <SettingRow icon={Mail} label="Email" description={user?.email || "you@university.edu"}>
            <Button size="xs" variant="secondary">Change</Button>
          </SettingRow>
          <SettingRow icon={Lock} label="Password" description="Last changed 30 days ago">
            <Button size="xs" variant="secondary">Update</Button>
          </SettingRow>
          <SettingRow icon={Globe} label="Connected accounts" description="Google, GitHub">
            <Button size="xs" variant="secondary">Manage</Button>
          </SettingRow>
        </SettingSection>

        {/* Appearance Section */}
        <SettingSection title="Appearance">
          <div className="py-3">
            <p className="text-sm font-medium mb-3">Theme</p>
            <div className="grid grid-cols-3 gap-2">
              {[
                { value: "light", label: "Light", icon: Sun },
                { value: "dark", label: "Dark", icon: Moon },
                { value: "system", label: "System", icon: Monitor },
              ].map(({ value, label, icon: ThemeIcon }) => (
                <button
                  key={value}
                  onClick={() => setTheme(value)}
                  className={cn(
                    "flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-[12px] font-medium border transition-all",
                    theme === value
                      ? "bg-primary/10 border-primary/30 text-primary"
                      : "bg-card border-border/50 text-muted-foreground hover:border-border hover:text-foreground"
                  )}
                >
                  <ThemeIcon className="w-3.5 h-3.5" />
                  {label}
                </button>
              ))}
            </div>
          </div>
        </SettingSection>

        {/* Notifications Section */}
        <SettingSection title="Notifications">
          <SettingRow icon={Bell} label="New matches" description="When AI finds compatible peers">
            <Switch
              checked={notifications.matches}
              onCheckedChange={(v) => setNotifications((n) => ({ ...n, matches: v }))}
            />
          </SettingRow>
          <SettingRow icon={Smartphone} label="Messages" description="Chat messages and room invites">
            <Switch
              checked={notifications.messages}
              onCheckedChange={(v) => setNotifications((n) => ({ ...n, messages: v }))}
            />
          </SettingRow>
          <SettingRow icon={Bell} label="Squad check-ins" description="Daily check-in reminders">
            <Switch
              checked={notifications.squadCheckIn}
              onCheckedChange={(v) => setNotifications((n) => ({ ...n, squadCheckIn: v }))}
            />
          </SettingRow>
          <SettingRow icon={Bell} label="Credits earned" description="Knowledge Credit notifications">
            <Switch
              checked={notifications.creditEarned}
              onCheckedChange={(v) => setNotifications((n) => ({ ...n, creditEarned: v }))}
            />
          </SettingRow>
          <SettingRow icon={Mail} label="Email digest" description="Weekly summary via email">
            <Switch
              checked={notifications.emailDigest}
              onCheckedChange={(v) => setNotifications((n) => ({ ...n, emailDigest: v }))}
            />
          </SettingRow>
        </SettingSection>

        {/* Privacy Section */}
        <SettingSection title="Privacy">
          <SettingRow icon={Eye} label="Public profile" description="Visible to all LearnLoop users">
            <Switch
              checked={privacy.profilePublic}
              onCheckedChange={(v) => setPrivacy((p) => ({ ...p, profilePublic: v }))}
            />
          </SettingRow>
          <SettingRow icon={Globe} label="Online status" description="Show when you're active">
            <Switch
              checked={privacy.showOnlineStatus}
              onCheckedChange={(v) => setPrivacy((p) => ({ ...p, showOnlineStatus: v }))}
            />
          </SettingRow>
          <SettingRow icon={Shield} label="Knowledge Credits" description="Show your KC balance publicly">
            <Switch
              checked={privacy.showKC}
              onCheckedChange={(v) => setPrivacy((p) => ({ ...p, showKC: v }))}
            />
          </SettingRow>
          <SettingRow icon={EyeOff} label="Learning DNA" description="Share your learning traits">
            <Switch
              checked={privacy.showLearningDNA}
              onCheckedChange={(v) => setPrivacy((p) => ({ ...p, showLearningDNA: v }))}
            />
          </SettingRow>
        </SettingSection>

        {/* Danger Zone */}
        <SurfaceCard className="border-destructive/20">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-destructive/70 mb-1">
            Danger Zone
          </h3>
          <div className="divide-y divide-border/30">
            <SettingRow
              icon={LogOut}
              label="Sign out"
              description="Sign out of your account"
              danger
            >
              <Button
                size="xs"
                variant="destructive"
                onClick={() => signOut()}
              >
                Sign out
              </Button>
            </SettingRow>
          </div>
        </SurfaceCard>
      </div>
    </div>
  );
}
