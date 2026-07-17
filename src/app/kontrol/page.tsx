"use client";

import { useMemo, useState } from "react";
import { ALLERGENS } from "@/lib/allergens";
import { alerjenTespitEt, incelemeGerekiyorMu } from "@/lib/detect";
import { AlerjenRozeti } from "@/components/alerjen-rozeti";
import { Bolum } from "@/components/bolum";
import { SiteHeader } from "@/components/site-header";

const ORNEK_RECETE = `500 g buğday unu
200 ml süt
3 yumurta
100 g tereyağı
50 g fındık
1 tatlı kaşığı tuz`;

export default function KontrolSayfasi() {
  const [recete, setRecete] = useState("");

  const sonuc = useMemo(() => alerjenTespitEt(recete), [recete]);
  const bosMu = recete.trim().length === 0;
  const inceleme = incelemeGerekiyorMu(sonuc);
  const acikNoktaSayisi = sonuc.belirsiz.length + sonuc.taninmayan.length;

  return (
    <div className="min-h-full">
      <SiteHeader />

      <main className="mx-auto max-w-6xl px-6 py-10">
        <section className="mb-10 max-w-2xl">
          <h1 className="font-display text-3xl tracking-tight text-stone-900 sm:text-4xl">
            Reçete kontrolü
          </h1>
          <p className="mt-2 text-stone-600">
            Her bulgunun hangi içerikten geldiğini gösteririz. Emin olmadığımız
            yerde tahmin yürütmez, size sorarız.
          </p>
        </section>

        <div className="grid gap-8 lg:grid-cols-[minmax(0,420px)_minmax(0,1fr)] lg:items-start">
          <section className="lg:sticky lg:top-24">
            <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">
              <div className="mb-3 flex items-baseline justify-between">
                <label
                  htmlFor="recete"
                  className="text-sm font-medium text-stone-800"
                >
                  Reçete
                </label>
                <button
                  type="button"
                  onClick={() => setRecete(ORNEK_RECETE)}
                  className="text-xs text-stone-500 underline underline-offset-4 transition hover:text-amber-700"
                >
                  Örnek yükle
                </button>
              </div>
              <textarea
                id="recete"
                value={recete}
                onChange={(olay) => setRecete(olay.target.value)}
                rows={14}
                spellCheck={false}
                placeholder={"500 g buğday unu\n200 ml süt\n3 yumurta"}
                className="w-full resize-none rounded-xl border border-stone-200 bg-stone-50/60 p-4 font-mono text-sm leading-relaxed text-stone-900 outline-none transition placeholder:text-stone-400 focus:border-amber-600/40 focus:bg-white focus:ring-4 focus:ring-amber-600/10"
              />
              <p className="mt-3 text-xs text-stone-500">
                Satır başına bir içerik yazın. `#` ile başlayan satırlar not
                sayılır.
              </p>
            </div>
          </section>

          <section aria-live="polite">
            {bosMu ? (
              <div className="rounded-2xl border border-dashed border-stone-300 bg-white/50 p-12 text-center">
                <p className="text-sm text-stone-500">
                  Reçeteyi girdiğinizde rapor burada anlık oluşur.
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                <div
                  className={`rounded-2xl border p-5 ${
                    inceleme
                      ? "border-amber-200 bg-amber-50"
                      : "border-emerald-200 bg-emerald-50"
                  }`}
                >
                  <p className="text-sm text-stone-800">
                    {inceleme ? (
                      <>
                        <strong className="text-amber-900">
                          Rapor tamamlanmadı.
                        </strong>{" "}
                        {acikNoktaSayisi} madde netleştirilmeli. Bunlar
                        çözülmeden rapor kullanılamaz.
                      </>
                    ) : (
                      <>
                        <strong className="text-emerald-900">
                          Tüm içerikler tanındı.
                        </strong>{" "}
                        Yine de bir gıda sorumlusunun onaylaması gerekir.
                      </>
                    )}
                  </p>
                </div>

                <Bolum
                  baslik="Tespit edilen alerjenler"
                  sayi={sonuc.tespitEdilen.length}
                >
                  {sonuc.tespitEdilen.length === 0 ? (
                    <p className="rounded-xl border border-stone-200 bg-white p-5 text-sm text-stone-600">
                      Kesin eşleşme yok. Bu &quot;alerjen içermiyor&quot;
                      anlamına <strong>gelmez</strong>.
                    </p>
                  ) : (
                    <ul className="space-y-3">
                      {sonuc.tespitEdilen.map((bulgu) => {
                        const alerjen = ALLERGENS[bulgu.alerjenId];
                        return (
                          <li
                            key={bulgu.alerjenId}
                            className="overflow-hidden rounded-xl border border-red-200/80 bg-white shadow-sm"
                          >
                            <div className="flex items-center gap-2 border-b border-red-100 bg-red-50/70 px-5 py-3">
                              <h3 className="font-medium text-red-950">
                                {alerjen.ad}
                              </h3>
                              {alerjen.kapsam === "turkiye-ek" && (
                                <AlerjenRozeti>Türkiye&apos;ye özel</AlerjenRozeti>
                              )}
                            </div>
                            <ul className="divide-y divide-stone-100">
                              {bulgu.kaynaklar.map((kaynak, index) => (
                                <li
                                  key={index}
                                  className="flex items-baseline justify-between gap-4 px-5 py-2.5"
                                >
                                  <span className="font-mono text-sm text-stone-700">
                                    {kaynak.satir}
                                  </span>
                                  <span className="shrink-0 rounded bg-red-50 px-2 py-0.5 font-mono text-xs text-red-700">
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

                {sonuc.belirsiz.length > 0 && (
                  <Bolum
                    baslik="Netleştirilmesi gerekenler"
                    sayi={sonuc.belirsiz.length}
                    aciklama="Bu içerikler tek başına hangi alerjene girdiğini söylemiyor. Tahmin etmiyoruz."
                  >
                    <ul className="space-y-3">
                      {sonuc.belirsiz.map((bulgu, index) => (
                        <li
                          key={index}
                          className="rounded-xl border border-amber-200/80 bg-white p-5 shadow-sm"
                        >
                          <p className="font-mono text-sm text-stone-800">
                            {bulgu.satir}
                          </p>
                          <p className="mt-2 text-sm text-amber-900">
                            {bulgu.soru}
                          </p>
                          {bulgu.olasiAlerjenler.length > 0 && (
                            <div className="mt-3 flex flex-wrap gap-1.5">
                              {bulgu.olasiAlerjenler.map((id) => (
                                <AlerjenRozeti key={id}>
                                  {ALLERGENS[id].ad}
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
                    <ul className="divide-y divide-stone-100 rounded-xl border border-stone-200 bg-white shadow-sm">
                      {sonuc.taninmayan.map((satir, index) => (
                        <li
                          key={index}
                          className="px-5 py-2.5 font-mono text-sm text-stone-600"
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
                    <ul className="divide-y divide-stone-100 rounded-xl border border-stone-200 bg-white shadow-sm">
                      {sonuc.beyanEdilenYok.map((bulgu, index) => (
                        <li
                          key={index}
                          className="flex items-baseline justify-between gap-4 px-5 py-2.5"
                        >
                          <span className="font-mono text-sm text-stone-600">
                            {bulgu.satir}
                          </span>
                          <span className="shrink-0 text-xs text-stone-500">
                            {ALLERGENS[bulgu.alerjenId].ad} bildirilmedi
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

        <footer className="mt-16 border-t border-stone-200 pt-6">
          <p className="max-w-3xl text-xs leading-relaxed text-stone-500">
            <strong className="text-stone-700">
              Bu araç bir onay belgesi değildir.
            </strong>{" "}
            Sonuçlar reçete metnindeki kelimelere dayanır; tedarikçi
            bileşimlerini, üretim hattındaki çapraz bulaşmayı veya etiket dışı
            içerikleri göremez. Nihai alerjen bildiriminin doğruluğundan yasal
            olarak işletme sorumludur.
          </p>
        </footer>
      </main>
    </div>
  );
}
