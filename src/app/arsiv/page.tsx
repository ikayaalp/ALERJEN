"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { ALLERGENS } from "@/lib/allergens";
import { ET_KOKENLERI } from "@/lib/meat";
import { incelemeGerekiyorMu } from "@/lib/detect";
import Link from "next/link";

function MenuCiktisi({ sonuc }: { sonuc: any }) {
  if (incelemeGerekiyorMu(sonuc)) {
    return (
      <p className="text-sm text-uyari">
        Belirsiz içerikler giderilmediği için yasal menü çıktısı oluşturulamıyor.
      </p>
    );
  }

  const alerjenler = sonuc.tespitEdilen.map((b: any) => ALLERGENS[b.alerjenId as keyof typeof ALLERGENS].ad).join(", ");
  const etKokenleri = sonuc.etKokenleri.map((b: any) => ET_KOKENLERI[b.kokenId as keyof typeof ET_KOKENLERI].ad).join(", ");

  let metin = [];
  if (alerjenler) metin.push(`Alerjen Uyarısı: ${alerjenler} içerir.`);
  if (etKokenleri) metin.push(`Et Menşei: ${etKokenleri}.`);

  if (metin.length === 0) {
    return <p className="text-sm font-medium text-zeytin">Bu üründe bildirimi zorunlu herhangi bir alerjen veya et kökeni tespit edilmemiştir.</p>;
  }

  return (
    <div className="rounded border border-murekkep/20 bg-kagit/50 p-3">
      <p className="font-mono text-sm text-murekkep">{metin.join(" ")}</p>
    </div>
  );
}

export default function ArsivSayfasi() {
  const [receteler, setReceteler] = useState<any[]>([]);
  const [yukleniyor, setYukleniyor] = useState(true);

  useEffect(() => {
    async function fetchReceteler() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        window.location.href = "/giris";
        return;
      }

      const { data } = await supabase
        .from("receteler")
        .select("*")
        .order("olusturulma_tarihi", { ascending: false });

      if (data) {
        setReceteler(data);
      }
      setYukleniyor(false);
    }

    fetchReceteler();
  }, []);

  return (
    <div className="min-h-full flex flex-col">
      <SiteHeader />
      
      <main className="mx-auto w-full max-w-4xl px-6 py-10 flex-1">
        <div className="mb-8">
          <h1 className="font-display text-3xl tracking-tight text-murekkep">
            Reçete Arşivi
          </h1>
          <p className="mt-2 text-zeytin-acik">
            Daha önce analiz edip kaydettiğiniz reçeteler ve menü beyanları.
          </p>
        </div>

        {yukleniyor ? (
          <div className="flex justify-center p-10">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-biber border-t-transparent" />
          </div>
        ) : receteler.length === 0 ? (
          <div className="rounded-lg border border-dashed border-murekkep/20 bg-kagit/50 p-12 text-center">
            <p className="text-sm text-zeytin-acik mb-4">
              Henüz kaydedilmiş bir reçeteniz yok.
            </p>
            <Link href="/kontrol" className="text-sm font-medium text-biber hover:underline">
              İlk reçetenizi analiz etmek için tıklayın
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {receteler.map((recete) => (
              <div key={recete.id} className="rounded-lg border border-murekkep/10 bg-kagit p-5 shadow-sm">
                <div className="mb-4 flex justify-between items-baseline border-b border-murekkep/5 pb-3">
                  <h2 className="text-lg font-semibold text-murekkep">{recete.ad}</h2>
                  <span className="text-xs text-zeytin-acik">
                    {new Date(recete.olusturulma_tarihi).toLocaleDateString("tr-TR")}
                  </span>
                </div>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-xs font-medium text-zeytin-acik uppercase tracking-wider mb-2">Reçete İçeriği</h3>
                    <div className="whitespace-pre-wrap font-mono text-xs text-murekkep bg-krem/30 p-3 rounded border border-murekkep/5">
                      {recete.icerik}
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-xs font-medium text-zeytin-acik uppercase tracking-wider mb-2">Menü Beyanı</h3>
                    <MenuCiktisi sonuc={recete.analiz_sonucu} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <SiteFooter />
    </div>
  );
}
