"use client";

import { useState, useEffect } from "react";
import { ALLERGENS } from "@/lib/allergens";
import { ET_KOKENLERI } from "@/lib/meat";
import { incelemeGerekiyorMu } from "@/lib/detect";
import { AlerjenRozeti } from "@/components/alerjen-rozeti";
import { Bolum } from "@/components/bolum";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { createClient } from "@/lib/supabase/client";

const ORNEK_RECETE = `500 g buğday unu
200 ml süt
3 yumurta
100 g tereyağı
50 g fındık
200 g kıyma
1 tatlı kaşığı tuz`;

function MenuCiktisi({ sonuc }: { sonuc: any }) {
  if (incelemeGerekiyorMu(sonuc)) {
    return (
      <div className="rounded-lg border border-safran/40 bg-safran/10 p-5 mb-6">
        <h3 className="font-semibold text-murekkep mb-2">Yasal Menü Çıktısı Hazır Değil</h3>
        <p className="text-sm text-uyari">
          Aşağıda <strong>"Netleştirilmesi Gerekenler"</strong> olarak belirtilen içerikleri reçetenizde daha açık yazmalısınız (örneğin "yağ" yerine "tereyağı" veya "ayçiçek yağı"). Belirsizlikler varken yasal çıktı oluşturulamaz.
        </p>
      </div>
    );
  }

  const alerjenler = sonuc.tespitEdilen.map((b: any) => ALLERGENS[b.alerjenId as keyof typeof ALLERGENS].ad).join(", ");
  const etKokenleri = sonuc.etKokenleri.map((b: any) => ET_KOKENLERI[b.kokenId as keyof typeof ET_KOKENLERI].ad).join(", ");

  let metin = [];
  if (alerjenler) metin.push(`Alerjen Uyarısı: ${alerjenler} içerir.`);
  if (etKokenleri) metin.push(`Et Menşei: ${etKokenleri}.`);

  const nihaiMetin = metin.length > 0 
    ? metin.join(" ") 
    : "Bu üründe bildirimi zorunlu herhangi bir alerjen veya et kökeni bulunmamaktadır.";

  return (
    <div className="rounded-lg border-2 border-zeytin/40 bg-zeytin/5 p-6 mb-8 shadow-sm">
      <h3 className="text-sm font-bold text-zeytin uppercase tracking-wider mb-3">Menüde Yazması Gereken Metin</h3>
      <div className="bg-kagit rounded border border-murekkep/10 p-4 relative group">
        <p className="font-mono text-base text-murekkep select-all">{nihaiMetin}</p>
        <button 
          onClick={() => navigator.clipboard.writeText(nihaiMetin)}
          className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-zeytin text-krem text-xs px-2 py-1 rounded"
        >
          Kopyala
        </button>
      </div>
      <p className="mt-3 text-xs text-zeytin-acik">
        Bu metni doğrudan kopyalayıp matbaaya veya QR menü sisteminize verebilirsiniz. Reçeteniz arşivinize kaydedilmiştir.
      </p>
    </div>
  );
}

export default function KontrolSayfasi() {
  const [ad, setAd] = useState("");
  const [recete, setRecete] = useState("");
  const [sonuc, setSonuc] = useState<any | null>(null);
  const [yukleniyor, setYukleniyor] = useState(false);
  const [hata, setHata] = useState<string | null>(null);
  const [kalanKredi, setKalanKredi] = useState<number | null>(null);

  useEffect(() => {
    async function fetchKredi() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data } = await supabase
          .from("kredi_bakiyeleri")
          .select("bakiye")
          .eq("kullanici_id", user.id)
          .single();
        if (data) {
          setKalanKredi(data.bakiye);
        }
      }
    }
    fetchKredi();
  }, []);

  async function analizEt() {
    if (recete.trim().length === 0) return;
    
    setYukleniyor(true);
    setHata(null);
    setSonuc(null);

    try {
      const res = await fetch("/api/analiz", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ recete, ad: ad.trim() || "İsimsiz Reçete" }),
      });
      const data = await res.json();
      
      if (!res.ok) {
        setHata(data.hata || "Analiz sırasında bir hata oluştu.");
      } else {
        setSonuc(data.sonuc);
        setKalanKredi(data.yeniBakiye);
        
        window.dispatchEvent(new Event("kredi_guncellendi"));
      }
    } catch (err) {
      setHata("Sunucu ile bağlantı kurulamadı.");
    } finally {
      setYukleniyor(false);
    }
  }

  const bosMu = recete.trim().length === 0;
  const inceleme = sonuc ? incelemeGerekiyorMu(sonuc) : false;

  return (
    <div className="min-h-full flex flex-col">
      <SiteHeader />

      <main className="mx-auto max-w-6xl px-6 py-10 flex-1 w-full">
        <section className="mb-10 max-w-2xl flex flex-col items-start gap-4">
          <div>
            <h1 className="font-display text-3xl tracking-tight text-murekkep sm:text-4xl">
              Reçete kontrolü
            </h1>
            <p className="mt-2 text-zeytin-acik">
              Reçetenizi girin, mevzuata uygun menü metnini anında alın ve arşivinize kaydedin.
            </p>
          </div>
          {kalanKredi !== null && (
            <div className="inline-flex items-center gap-2 rounded-full border border-zeytin/20 bg-zeytin/5 px-3 py-1.5 text-sm font-medium text-zeytin">
              <span>Kalan kredi:</span>
              <span className="font-mono text-biber">{kalanKredi}</span>
            </div>
          )}
        </section>

        <div className="grid gap-8 lg:grid-cols-[minmax(0,420px)_minmax(0,1fr)] lg:items-start">
          <section className="lg:sticky lg:top-24">
            <div className="rounded-lg border border-murekkep/10 bg-kagit p-5 shadow-sm flex flex-col gap-4">
              <div>
                <label htmlFor="ad" className="text-sm font-medium text-murekkep mb-1.5 block">
                  Reçete Adı
                </label>
                <input
                  id="ad"
                  type="text"
                  value={ad}
                  onChange={(e) => setAd(e.target.value)}
                  placeholder="Örn: Fındıklı Kek"
                  className="w-full rounded-lg border border-murekkep/10 bg-krem/60 px-4 py-2.5 text-sm text-murekkep outline-none transition focus:border-biber/40 focus:bg-kagit focus:ring-4 focus:ring-biber/10"
                />
              </div>

              <div>
                <div className="mb-1.5 flex items-baseline justify-between">
                  <label htmlFor="recete" className="text-sm font-medium text-murekkep">
                    İçerikler
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setAd("Örnek Reçete");
                      setRecete(ORNEK_RECETE);
                    }}
                    className="text-xs text-zeytin-acik underline underline-offset-4 transition hover:text-biber"
                  >
                    Örnek yükle
                  </button>
                </div>
                <textarea
                  id="recete"
                  value={recete}
                  onChange={(olay) => {
                    setRecete(olay.target.value);
                    setSonuc(null);
                  }}
                  rows={14}
                  spellCheck={false}
                  placeholder={"500 g buğday unu\n200 ml süt\n3 yumurta"}
                  className="w-full resize-none rounded-lg border border-murekkep/10 bg-krem/60 p-4 font-mono text-sm leading-relaxed text-murekkep outline-none transition placeholder:text-zeytin-acik/60 focus:border-biber/40 focus:bg-kagit focus:ring-4 focus:ring-biber/10"
                />
                <p className="mt-2 text-xs text-zeytin-acik">
                  Satır başına bir içerik yazın. `#` ile başlayan satırlar not sayılır.
                </p>
              </div>
              
              <button
                onClick={analizEt}
                disabled={bosMu || yukleniyor}
                className="w-full rounded-lg bg-murekkep px-4 py-3 text-sm font-medium text-krem transition hover:bg-zeytin disabled:opacity-50 disabled:cursor-not-allowed mt-2"
              >
                {yukleniyor ? "Analiz ediliyor..." : "Analiz Et ve Kaydet (1 Kredi)"}
              </button>
            </div>
          </section>

          <section aria-live="polite">
            {hata && (
              <div className="mb-6 rounded-lg border border-safran/40 bg-safran/10 p-5">
                <p className="text-sm text-biber">{hata}</p>
                {hata.includes("kredi") && (
                  <button className="mt-3 rounded-md bg-kagit px-3 py-1.5 text-xs font-medium text-murekkep border border-murekkep/10 hover:bg-krem transition" onClick={() => alert("Kredi yükleme yakında!")}>
                    Kredi Yükle
                  </button>
                )}
              </div>
            )}

            {!sonuc && !hata && !yukleniyor && (
              <div className="rounded-lg border border-dashed border-murekkep/20 bg-kagit/50 p-12 text-center flex flex-col items-center justify-center min-h-[400px]">
                <p className="text-sm text-zeytin-acik max-w-sm">
                  Reçetenizi yazıp <strong>Analiz Et ve Kaydet</strong> butonuna bastığınızda, menünüzde kullanmanız gereken yasal uyarı metni burada oluşacaktır.
                </p>
              </div>
            )}

            {yukleniyor && (
              <div className="rounded-lg border border-dashed border-murekkep/20 bg-kagit/50 p-12 text-center flex flex-col items-center justify-center min-h-[400px] gap-4">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-biber border-t-transparent" />
                <p className="text-sm font-medium text-zeytin-acik">
                  Reçete taranıyor ve yasal metin oluşturuluyor...
                </p>
              </div>
            )}

            {sonuc && !yukleniyor && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <MenuCiktisi sonuc={sonuc} />

                <Bolum
                  baslik="Tespit edilen alerjenler"
                  sayi={sonuc.tespitEdilen.length}
                >
                  {sonuc.tespitEdilen.length === 0 ? (
                    <p className="rounded-lg border border-murekkep/10 bg-kagit p-5 text-sm text-zeytin-acik">
                      Kesin eşleşme yok. Bu &quot;alerjen içermiyor&quot;
                      anlamına <strong>gelmez</strong>.
                    </p>
                  ) : (
                    <ul className="space-y-3">
                      {sonuc.tespitEdilen.map((bulgu: any) => {
                        const alerjen = ALLERGENS[bulgu.alerjenId as keyof typeof ALLERGENS];
                        return (
                          <li
                            key={bulgu.alerjenId}
                            className="overflow-hidden rounded-lg border border-uyari/25 bg-kagit shadow-sm"
                          >
                            <div className="flex items-center gap-2 border-b border-uyari/15 bg-uyari/[0.06] px-5 py-3">
                              <h3 className="font-medium text-murekkep">
                                {alerjen.ad}
                              </h3>
                              {alerjen.kapsam === "turkiye-ek" && (
                                <AlerjenRozeti>Türkiye&apos;ye özel</AlerjenRozeti>
                              )}
                            </div>
                            <ul className="divide-y divide-kum">
                              {bulgu.kaynaklar.map((kaynak: any, index: number) => (
                                <li
                                  key={index}
                                  className="flex items-baseline justify-between gap-4 px-5 py-2.5"
                                >
                                  <span className="font-mono text-sm text-zeytin">
                                    {kaynak.satir}
                                  </span>
                                  <span className="shrink-0 rounded bg-uyari/[0.08] px-2 py-0.5 font-mono text-xs text-uyari">
                                    {kaynak.eslesenTerim}
                                  </span>
                                </li>
                              ))}
                            </ul>
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </Bolum>

                {sonuc.etKokenleri.length > 0 && (
                  <Bolum
                    baslik="Et kökeni bildirimi"
                    sayi={sonuc.etKokenleri.length}
                    aciklama="Mevzuat, etin hangi hayvana ait olduğunun menüde belirtilmesini istiyor."
                  >
                    <ul className="space-y-3">
                      {sonuc.etKokenleri.map((bulgu: any) => {
                        const koken = ET_KOKENLERI[bulgu.kokenId as keyof typeof ET_KOKENLERI];
                        return (
                          <li
                            key={bulgu.kokenId}
                            className="overflow-hidden rounded-lg border border-zeytin/25 bg-kagit shadow-sm"
                          >
                            <div className="border-b border-zeytin/15 bg-zeytin/[0.06] px-5 py-3">
                              <h3 className="font-medium text-zeytin">
                                {koken.ad}
                              </h3>
                            </div>
                            <ul className="divide-y divide-kum">
                              {bulgu.kaynaklar.map((kaynak: any, index: number) => (
                                <li
                                  key={index}
                                  className="flex items-baseline justify-between gap-4 px-5 py-2.5"
                                >
                                  <span className="font-mono text-sm text-zeytin">
                                    {kaynak.satir}
                                  </span>
                                  <span className="shrink-0 rounded bg-zeytin/[0.08] px-2 py-0.5 font-mono text-xs text-zeytin">
                                    {kaynak.eslesenTerim}
                                  </span>
                                </li>
                              ))}
                            </ul>
                          </li>
                        );
                      })}
                    </ul>
                  </Bolum>
                )}

                {sonuc.etBelirsiz.length > 0 && (
                  <Bolum
                    baslik="Et kökeni netleştirilmeli"
                    sayi={sonuc.etBelirsiz.length}
                    aciklama="Bu içerikler etin hangi hayvandan geldiğini söylemiyor. Menüde belirtilmesi zorunlu."
                  >
                    <ul className="space-y-3">
                      {sonuc.etBelirsiz.map((bulgu: any, index: number) => (
                        <li
                          key={index}
                          className="rounded-lg border border-safran/40 bg-kagit p-5 shadow-sm"
                        >
                          <p className="font-mono text-sm text-murekkep">
                            {bulgu.satir}
                          </p>
                          <p className="mt-2 text-sm text-biber">{bulgu.soru}</p>
                          {bulgu.olasiKokenler.length > 0 && (
                            <div className="mt-3 flex flex-wrap gap-1.5">
                              {bulgu.olasiKokenler.map((id: string) => (
                                <AlerjenRozeti key={id}>
                                  {ET_KOKENLERI[id as keyof typeof ET_KOKENLERI].ad}
                                </AlerjenRozeti>
                              ))}
                            </div>
                          )}
                        </li>
                      ))}
                    </ul>
                  </Bolum>
                )}

                {sonuc.belirsiz.length > 0 && (
                  <Bolum
                    baslik="Netleştirilmesi gerekenler"
                    sayi={sonuc.belirsiz.length}
                    aciklama="Bu içerikler tek başına hangi alerjene girdiğini söylemiyor. Tahmin etmiyoruz."
                  >
                    <ul className="space-y-3">
                      {sonuc.belirsiz.map((bulgu: any, index: number) => (
                        <li
                          key={index}
                          className="rounded-lg border border-safran/40 bg-kagit p-5 shadow-sm"
                        >
                          <p className="font-mono text-sm text-murekkep">
                            {bulgu.satir}
                          </p>
                          <p className="mt-2 text-sm text-biber">
                            {bulgu.soru}
                          </p>
                          {bulgu.olasiAlerjenler.length > 0 && (
                            <div className="mt-3 flex flex-wrap gap-1.5">
                              {bulgu.olasiAlerjenler.map((id: string) => (
                                <AlerjenRozeti key={id}>
                                  {ALLERGENS[id as keyof typeof ALLERGENS].ad}
                                </AlerjenRozeti>
                              ))}
                            </div>
                          )}
                        </li>
                      ))}
                    </ul>
                  </Bolum>
                )}

                {sonuc.taninmayan.length > 0 && (
                  <Bolum
                    baslik="Tanınmayan içerikler"
                    sayi={sonuc.taninmayan.length}
                    aciklama="Sözlüğümüzde yoklar. Alerjen içermedikleri anlamına gelmez — elle kontrol edin."
                  >
                    <ul className="divide-y divide-kum rounded-lg border border-murekkep/10 bg-kagit shadow-sm">
                      {sonuc.taninmayan.map((satir: string, index: number) => (
                        <li
                          key={index}
                          className="px-5 py-2.5 font-mono text-sm text-zeytin-acik"
                        >
                          {satir}
                        </li>
                      ))}
                    </ul>
                  </Bolum>
                )}

                {sonuc.beyanEdilenYok.length > 0 && (
                  <Bolum
                    baslik="Yokluk beyanı olarak okunanlar"
                    aciklama="Metinde açıkça bulunmadığı belirtilen alerjenler."
                  >
                    <ul className="divide-y divide-kum rounded-lg border border-murekkep/10 bg-kagit shadow-sm">
                      {sonuc.beyanEdilenYok.map((bulgu: any, index: number) => (
                        <li
                          key={index}
                          className="flex items-baseline justify-between gap-4 px-5 py-2.5"
                        >
                          <span className="font-mono text-sm text-zeytin-acik">
                            {bulgu.satir}
                          </span>
                          <span className="shrink-0 text-xs text-zeytin-acik">
                            {ALLERGENS[bulgu.alerjenId as keyof typeof ALLERGENS].ad} bildirilmedi
                          </span>
                        </li>
                      ))}
                    </ul>
                  </Bolum>
                )}
              </div>
            )}
          </section>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
