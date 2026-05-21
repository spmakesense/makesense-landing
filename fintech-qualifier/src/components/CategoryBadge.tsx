import type { LeadCategory } from "@/types";
import { CATEGORY_LABELS, CATEGORY_COLORS } from "@/types";

interface Props {
  category: LeadCategory;
  size?: "sm" | "md" | "lg";
}

export default function CategoryBadge({ category, size = "md" }: Props) {
  const color = CATEGORY_COLORS[category];
  const label = CATEGORY_LABELS[category];

  const padding =
    size === "lg"
      ? "px-5 py-2 text-base"
      : size === "sm"
      ? "px-3 py-1 text-xs"
      : "px-4 py-1.5 text-sm";

  return (
    <span
      className={`inline-block rounded-full font-bold ${padding}`}
      style={{ background: `${color}18`, color, border: `1.5px solid ${color}40` }}
    >
      {label}
    </span>
  );
}
