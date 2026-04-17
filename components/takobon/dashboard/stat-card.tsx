import { type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type Props = {
  label: string;
  value: number | string;
  icon: LucideIcon;
  variant?: "default" | "gold" | "owned" | "missing" | "wished";
  className?: string;
};

const variants = {
  default: {
    icon: "text-text-tertiary",
    value: "text-text-primary",
  },
  gold: {
    icon: "text-gold-400",
    value: "text-gold-400",
  },
  owned: {
    icon: "text-state-owned",
    value: "text-text-primary",
  },
  missing: {
    icon: "text-state-missing",
    value: "text-text-primary",
  },
  wished: {
    icon: "text-state-wished",
    value: "text-text-primary",
  },
};

export function StatCard({ label, value, icon: Icon, variant = "default", className }: Props) {
  const v = variants[variant];

  return (
    <div
      className={cn(
        "takobon-card takobon-card-hover p-4 flex flex-col gap-3",
        variant === "gold" && "takobon-gold-surface",
        className
      )}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs uppercase tracking-widest text-text-tertiary font-medium">
          {label}
        </span>
        <Icon className={cn("size-4", v.icon)} strokeWidth={1.5} />
      </div>
      <span className={cn("text-3xl font-semibold tabular-nums tracking-tight", v.value)}>
        {value}
      </span>
    </div>
  );
}
