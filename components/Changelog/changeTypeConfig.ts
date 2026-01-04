import { Sparkles, Bug, Zap, Shield } from "lucide-react";
import type { ChangeType } from "./types";

export const changeTypeConfig: Record<
  ChangeType,
  { icon: typeof Sparkles; label: string; color: string }
> = {
  feature: { icon: Sparkles, label: "New", color: "text-accent" },
  fix: { icon: Bug, label: "Fix", color: "text-error" },
  improvement: { icon: Zap, label: "Improved", color: "text-warning" },
  security: { icon: Shield, label: "Security", color: "text-info" },
};
