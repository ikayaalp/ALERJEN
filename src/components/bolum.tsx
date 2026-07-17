import type { ReactNode } from "react";

interface BolumProps {
  baslik: string;
  sayi?: number;
  aciklama?: string;
  children: ReactNode;
}

export function Bolum({ baslik, sayi, aciklama, children }: BolumProps) {
  return (
    <section>
      <div className="mb-3 flex items-baseline gap-2">
        <h2 className="font-display text-xl tracking-tight text-stone-900">
          {baslik}
        </h2>
        {sayi !== undefined && (
          <span className="rounded-full bg-stone-100 px-2 py-0.5 text-xs font-medium text-stone-600">
            {sayi}
          </span>
        )}
      </div>
      {aciklama && <p className="mb-3 text-sm text-stone-500">{aciklama}</p>}
      {children}
    </section>
  );
}
