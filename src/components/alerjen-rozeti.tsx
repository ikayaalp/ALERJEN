import type { ReactNode } from "react";

export function AlerjenRozeti({ children }: { children: ReactNode }) {
  return (
    <span className="rounded-full border border-stone-200 bg-stone-50 px-2 py-0.5 text-xs text-stone-600">
      {children}
    </span>
  );
}
