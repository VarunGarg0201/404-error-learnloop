"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { updateProfile } from "@/features/profile/actions";
import { useUserStore } from "@/store/user-store";
import { Edit3, Loader2, Check } from "lucide-react";

/* ═══════════════════════════════════════════════════════════
   Edit Profile Modal
   ═══════════════════════════════════════════════════════════ */

interface EditProfileModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSaved?: () => void;
}

export function EditProfileModal({ isOpen, onOpenChange, onSaved }: EditProfileModalProps) {
  const { user } = useUserStore();
  const [displayName, setDisplayName] = useState(user?.displayName || "");
  const [bio, setBio] = useState(user?.bio || "");
  const [campus, setCampus] = useState(user?.campus || "");
  const [stream, setStream] = useState(user?.stream || "");
  const [year, setYear] = useState(user?.year || "");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const res = await updateProfile({
      displayName: displayName.trim(),
      bio: bio.trim(),
      campus: campus.trim(),
      stream: stream.trim(),
      year: year.trim(),
    });
    setSaving(false);
    if (res.success) {
      setSaved(true);
      setTimeout(() => {
        onOpenChange(false);
        setSaved(false);
        onSaved?.();
      }, 1000);
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[460px]">
        <DialogTitle className="flex items-center gap-2">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10">
            <Edit3 className="w-4 h-4 text-primary" />
          </div>
          Edit Profile
        </DialogTitle>

        {saved ? (
          <div className="py-8 text-center space-y-2">
            <div className="w-12 h-12 rounded-full bg-success/10 flex items-center justify-center mx-auto">
              <Check className="w-6 h-6 text-success" />
            </div>
            <p className="text-sm font-semibold">Profile updated!</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 mt-2">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground">Display Name</label>
              <input
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-border/60 bg-muted/30 text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30"
                required
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground">Bio</label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={3}
                placeholder="Tell others about yourself..."
                className="w-full px-3 py-2 rounded-lg border border-border/60 bg-muted/30 text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30 resize-none"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground">Campus</label>
                <input
                  value={campus}
                  onChange={(e) => setCampus(e.target.value)}
                  placeholder="e.g. IIT Delhi"
                  className="w-full px-3 py-2 rounded-lg border border-border/60 bg-muted/30 text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground">Year</label>
                <input
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  placeholder="e.g. 3rd Year"
                  className="w-full px-3 py-2 rounded-lg border border-border/60 bg-muted/30 text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30"
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground">Stream / Branch</label>
              <input
                value={stream}
                onChange={(e) => setStream(e.target.value)}
                placeholder="e.g. Computer Science"
                className="w-full px-3 py-2 rounded-lg border border-border/60 bg-muted/30 text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30"
              />
            </div>
            <Button type="submit" className="w-full gap-1.5" disabled={saving || !displayName.trim()}>
              {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
              Save Changes
            </Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
