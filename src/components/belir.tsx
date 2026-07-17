"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

interface BelirProps {
  children: ReactNode;
  /** 1-4 arası kademeli gecikme sınıfı */
  gecikme?: 1 | 2 | 3 | 4;
  className?: string;
}

/**
 * Öğe görünüme girdiğinde bir kez yumuşakça belirir. IntersectionObserver
 * kullanır; görünürlük tetiklendikten sonra gözlemi bırakır.
 */
export function Belir({ children, gecikme, className = "" }: BelirProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [gorundu, setGorundu] = useState(false);

  useEffect(() => {
    const dugum = ref.current;
    if (!dugum || gorundu) return;

    const gozlemci = new IntersectionObserver(
      (girisler) => {
        if (girisler[0].isIntersecting) {
          setGorundu(true);
          gozlemci.disconnect();
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" },
    );

    gozlemci.observe(dugum);
    return () => gozlemci.disconnect();
  }, [gorundu]);

  const gecikmeSinifi = gecikme ? `gecik-${gecikme}` : "";

  return (
    <div
      ref={ref}
      className={`belir ${gecikmeSinifi} ${gorundu ? "gorundu" : ""} ${className}`}
    >
      {children}
    </div>
  );
}
