"use client";

import { useOnboardingStore } from "@/features/onboarding/store";
import { InputField } from "@/components/shared/inputs";
import { UserAvatar } from "@/components/shared/user-avatar";
import { Button } from "@/components/ui/button";
import { Camera } from "lucide-react";

/* ═══════════════════════════════════════════════════════════
   Step 1: Identity — Name, Username, Avatar
   ═══════════════════════════════════════════════════════════ */

export function StepIdentity() {
  const { data, updateData } = useOnboardingStore();

  return (
    <div className="space-y-6">
      {/* Heading */}
      <div className="text-center space-y-1">
        <p className="text-2xl">👋</p>
        <h2 className="text-lg font-semibold tracking-tight">
          Let&apos;s get to know you
        </h2>
        <p className="text-sm text-muted-foreground">
          This is how other students will see you.
        </p>
      </div>

      {/* Avatar */}
      <div className="flex justify-center">
        <div className="relative group cursor-pointer">
          <UserAvatar
            name={data.displayName || "?"}
            src={data.avatarUrl}
            size="lg"
            className="w-20 h-20 text-xl"
          />
          <div className="absolute inset-0 flex items-center justify-center rounded-full bg-background/60 opacity-0 group-hover:opacity-100 transition-opacity">
            <Camera className="w-5 h-5 text-muted-foreground" />
          </div>
        </div>
      </div>

      {/* Fields */}
      <div className="space-y-4">
        <InputField
          label="Display name"
          placeholder="What should we call you?"
          value={data.displayName}
          onChange={(e) => updateData({ displayName: e.target.value })}
        />
        <InputField
          label="Username"
          description="This will be your unique handle"
          placeholder="@coollearner"
          value={data.username}
          onChange={(e) =>
            updateData({
              username: e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ""),
            })
          }
          addon={
            data.username ? (
              <span className="text-[10px] text-muted-foreground">
                @{data.username}
              </span>
            ) : null
          }
        />
      </div>
    </div>
  );
}
