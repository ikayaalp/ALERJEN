import type { ReactNode } from "react";

export function AlerjenRozeti({ children }: { children: ReactNode }) {
  return (
    <span className="rounded-full border border-murekkep/10 bg-krem px-2 py-0.5 text-xs text-zeytin-acik">
      {children}
    </span>
  );
}
