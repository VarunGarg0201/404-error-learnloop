import { PageHeader } from "@/components/shared/page-header";
import { SurfaceCard } from "@/components/shared/cards";
import { Separator } from "@/components/ui/separator";

export const metadata = {
  title: "Settings",
};

export default function SettingsPage() {
  return (
    <>
      <PageHeader
        title="Settings"
        description="Manage your account, privacy, and preferences."
      />

      <div className="space-y-4 max-w-2xl">
        <SurfaceCard>
          <h3 className="text-sm font-semibold mb-1">Account</h3>
          <p className="text-xs text-muted-foreground">
            Manage your email, password, and connected accounts.
          </p>
        </SurfaceCard>

        <SurfaceCard>
          <h3 className="text-sm font-semibold mb-1">Privacy</h3>
          <p className="text-xs text-muted-foreground">
            Control your visibility: public, campus-only, or anonymous.
          </p>
        </SurfaceCard>

        <SurfaceCard>
          <h3 className="text-sm font-semibold mb-1">Notifications</h3>
          <p className="text-xs text-muted-foreground">
            Choose which notifications you receive and how.
          </p>
        </SurfaceCard>

        <SurfaceCard>
          <h3 className="text-sm font-semibold mb-1">Appearance</h3>
          <p className="text-xs text-muted-foreground">
            Theme preferences and display settings.
          </p>
        </SurfaceCard>
      </div>
    </>
  );
}
