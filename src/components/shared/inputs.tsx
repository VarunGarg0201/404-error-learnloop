import * as React from "react";
import { cn } from "@/lib/utils";
import { Search, Eye, EyeOff, type LucideIcon } from "lucide-react";

/* ═══════════════════════════════════════════════════════════
   LearnLoop Input System
   ─────────────────────────────────────────────────────────
   Consistent, accessible, with icon/addon support.
   ═══════════════════════════════════════════════════════════ */

/* ─── Base Input Field ─── */
interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  description?: string;
  error?: string;
  icon?: LucideIcon;
  iconPosition?: "left" | "right";
  addon?: React.ReactNode;
}

export const InputField = React.forwardRef<HTMLInputElement, InputFieldProps>(
  (
    {
      label,
      description,
      error,
      icon: Icon,
      iconPosition = "left",
      addon,
      className,
      id,
      ...props
    },
    ref
  ) => {
    const inputId = id || React.useId();

    return (
      <div className="space-y-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-xs font-medium text-foreground"
          >
            {label}
          </label>
        )}
        {description && (
          <p className="text-[11px] text-muted-foreground">{description}</p>
        )}
        <div className="relative">
          {Icon && iconPosition === "left" && (
            <div className="absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none">
              <Icon className="w-3.5 h-3.5 text-muted-foreground" />
            </div>
          )}
          <input
            ref={ref}
            id={inputId}
            className={cn(
              "flex h-9 w-full rounded-lg border border-border/60 bg-input/30",
              "px-3 py-1.5 text-sm text-foreground placeholder:text-muted-foreground/60",
              "transition-colors duration-150",
              "focus:border-primary/50 focus:ring-2 focus:ring-primary/20 focus:outline-none",
              "disabled:opacity-50 disabled:cursor-not-allowed",
              Icon && iconPosition === "left" && "pl-8",
              Icon && iconPosition === "right" && "pr-8",
              error && "border-destructive/50 focus:border-destructive focus:ring-destructive/20",
              className
            )}
            aria-invalid={!!error}
            {...props}
          />
          {Icon && iconPosition === "right" && (
            <div className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none">
              <Icon className="w-3.5 h-3.5 text-muted-foreground" />
            </div>
          )}
          {addon && (
            <div className="absolute right-2 top-1/2 -translate-y-1/2">
              {addon}
            </div>
          )}
        </div>
        {error && (
          <p className="text-[11px] text-destructive font-medium">{error}</p>
        )}
      </div>
    );
  }
);
InputField.displayName = "InputField";

/* ─── Search Input ─── */
interface SearchInputProps
  extends Omit<InputFieldProps, "icon" | "iconPosition"> {
  onClear?: () => void;
}

export const SearchInput = React.forwardRef<HTMLInputElement, SearchInputProps>(
  ({ className, onClear, ...props }, ref) => {
    return (
      <InputField
        ref={ref}
        icon={Search}
        iconPosition="left"
        placeholder="Search..."
        className={cn("h-8 text-xs", className)}
        {...props}
      />
    );
  }
);
SearchInput.displayName = "SearchInput";

/* ─── Password Input ─── */
export const PasswordInput = React.forwardRef<
  HTMLInputElement,
  Omit<InputFieldProps, "type" | "icon" | "addon">
>(({ className, ...props }, ref) => {
  const [visible, setVisible] = React.useState(false);

  return (
    <InputField
      ref={ref}
      type={visible ? "text" : "password"}
      addon={
        <button
          type="button"
          onClick={() => setVisible(!visible)}
          className="text-muted-foreground hover:text-foreground transition-colors p-0.5"
          tabIndex={-1}
        >
          {visible ? (
            <EyeOff className="w-3.5 h-3.5" />
          ) : (
            <Eye className="w-3.5 h-3.5" />
          )}
        </button>
      }
      className={cn("pr-9", className)}
      {...props}
    />
  );
});
PasswordInput.displayName = "PasswordInput";

/* ─── Textarea Field ─── */
interface TextareaFieldProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  description?: string;
  error?: string;
}

export const TextareaField = React.forwardRef<
  HTMLTextAreaElement,
  TextareaFieldProps
>(({ label, description, error, className, id, ...props }, ref) => {
  const textareaId = id || React.useId();

  return (
    <div className="space-y-1.5">
      {label && (
        <label
          htmlFor={textareaId}
          className="block text-xs font-medium text-foreground"
        >
          {label}
        </label>
      )}
      {description && (
        <p className="text-[11px] text-muted-foreground">{description}</p>
      )}
      <textarea
        ref={ref}
        id={textareaId}
        className={cn(
          "flex min-h-[80px] w-full rounded-lg border border-border/60 bg-input/30",
          "px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/60",
          "transition-colors duration-150 resize-y",
          "focus:border-primary/50 focus:ring-2 focus:ring-primary/20 focus:outline-none",
          "disabled:opacity-50 disabled:cursor-not-allowed",
          error &&
            "border-destructive/50 focus:border-destructive focus:ring-destructive/20",
          className
        )}
        aria-invalid={!!error}
        {...props}
      />
      {error && (
        <p className="text-[11px] text-destructive font-medium">{error}</p>
      )}
    </div>
  );
});
TextareaField.displayName = "TextareaField";
