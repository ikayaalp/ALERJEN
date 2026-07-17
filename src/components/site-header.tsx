"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { cikisYap } from "@/app/actions/auth";

export function SiteHeader() {
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [bakiye, setBakiye] = useState<number | null>(null);
  const [yukleniyor, setYukleniyor] = useState(true);

  useEffect(() => {
    async function fetchSession() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        setUserEmail(user.email ?? null);
        const { data } = await supabase
          .from("kredi_bakiyeleri")
          .select("bakiye")
          .eq("kullanici_id", user.id)
          .single();
        
        setBakiye(data?.bakiye ?? 0);
      }
      setYukleniyor(false);
    }
    
    fetchSession();

    const handleKrediGuncellendi = () => {
      fetchSession();
    };

    window.addEventListener("kredi_guncellendi", handleKrediGuncellendi);
    return () => window.removeEventListener("kredi_guncellendi", handleKrediGuncellendi);
  }, []);

  return (
    <header className="sticky top-0 z-40 border-b border-murekkep/10 bg-krem/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="group flex items-center gap-2.5">
          <span
            className="grid h-8 w-8 place-items-center rounded-full bg-biber text-[13px] font-semibold text-krem"
            aria-hidden
          >
            ŞM
          </span>
          <span className="font-display text-xl font-semibold tracking-tight text-murekkep">
            Şeffaf Menü
          </span>
        </Link>

        <nav className="hidden items-center gap-8 text-sm text-zeytin-acik md:flex">
          <Link href="/#ozellikler" className="transition hover:text-biber">
            Nasıl çalışır
          </Link>
          <Link href="/#takvim" className="transition hover:text-biber">
            Takvim
          </Link>
          <Link href="/#fiyat" className="transition hover:text-biber">
            Fiyatlar
          </Link>
        </nav>

        <div className="flex items-center gap-4">
          {!yukleniyor && (
            userEmail ? (
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-4 text-sm font-medium text-murekkep">
                  <Link href="/arsiv" className="hover:text-zeytin transition">
                    Arşivim
                  </Link>
                  <span>{userEmail}</span>
                  <span className="flex items-center gap-1.5 rounded-full bg-zeytin/10 px-3 py-1 text-zeytin">
                    Kredi: <strong className="font-mono">{yukleniyor ? "..." : bakiye}</strong>
                  </span>
                </div>
                <form action={cikisYap}>
                  <button
                    type="submit"
                    className="text-sm font-medium text-biber hover:underline underline-offset-4"
                  >
                    Çıkış Yap
                  </button>
                </form>
              </div>
            ) : (
              <>
                <Link
                  href="/giris"
                  className="rounded-lg px-3.5 py-2 text-sm text-zeytin transition hover:bg-kum"
                >
                  Giriş
                </Link>
                <Link
                  href="/kayit"
                  className="rounded-lg bg-murekkep px-4 py-2 text-sm font-medium text-krem transition hover:bg-zeytin"
                >
                  Kayıt ol
                </Link>
              </>
            )
          )}
        </div>
      </div>
    </header>
  );
}
