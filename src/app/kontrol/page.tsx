"use client";

import { useMemo, useState } from "react";
import { ALLERGENS } from "@/lib/allergens";
import { ET_KOKENLERI } from "@/lib/meat";
import { alerjenTespitEt, incelemeGerekiyorMu } from "@/lib/detect";
import { AlerjenRozeti } from "@/components/alerjen-rozeti";
import { Bolum } from "@/components/bolum";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

const ORNEK_RECETE = `500 g buğday unu
200 ml süt
3 yumurta
100 g tereyağı
50 g fındık
200 g kıyma
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
          <h1 className="font-display text-3xl tracking-tight text-murekkep sm:text-4xl">
            Reçete kontrolü
          </h1>
          <p className="mt-2 text-zeytin-acik">
            Her bulgunun hangi içerikten geldiğini gösteririz. Emin olmadığımız
            yerde tahmin yürütmez, size sorarız.
          </p>
        </section>

        <div className="grid gap-8 lg:grid-cols-[minmax(0,420px)_minmax(0,1fr)] lg:items-start">
          <section className="lg:sticky lg:top-24">
            <div className="rounded-lg border border-murekkep/10 bg-kagit p-5 shadow-sm">
              <div className="mb-3 flex items-baseline justify-between">
                <label
                  htmlFor="recete"
                  className="text-sm font-medium text-murekkep"
                >
                  Reçete
                </label>
                <button
                  type="button"
                  onClick={() => setRecete(ORNEK_RECETE)}
                  className="text-xs text-zeytin-acik underline underline-offset-4 transition hover:text-biber"
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
                className="w-full resize-none rounded-lg border border-murekkep/10 bg-krem/60 p-4 font-mono text-sm leading-relaxed text-murekkep outline-none transition placeholder:text-zeytin-acik/60 focus:border-biber/40 focus:bg-kagit focus:ring-4 focus:ring-biber/10"
              />
              <p className="mt-3 text-xs text-zeytin-acik">
                Satır başına bir içerik yazın. `#` ile başlayan satırlar not
                sayılır.
              </p>
            </div>
          </section>

          <section aria-live="polite">
            {bosMu ? (
              <div className="rounded-lg border border-dashed border-murekkep/20 bg-kagit/50 p-12 text-center">
                <p className="text-sm text-zeytin-acik">
                  Reçeteyi girdiğinizde rapor burada anlık oluşur.
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                <div
                  className={`rounded-lg border p-5 ${
                    inceleme
                      ? "border-safran/40 bg-safran/10"
                      : "border-zeytin/25 bg-zeytin/[0.07]"
                  }`}
                >
                  <p className="text-sm text-murekkep">
                    {inceleme ? (
                      <>
                        <strong className="text-uyari">
                          Rapor tamamlanmadı.
                        </strong>{" "}
                        {acikNoktaSayisi} madde netleştirilmeli. Bunlar
                        çözülmeden rapor kullanılamaz.
                      </>
                    ) : (
                      <>
                        <strong className="text-zeytin">
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
                    <p className="rounded-lg border border-murekkep/10 bg-kagit p-5 text-sm text-zeytin-acik">
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
                              {bulgu.kaynaklar.map((kaynak, index) => (
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
                      {sonuc.etKokenleri.map((bulgu) => {
                        const koken = ET_KOKENLERI[bulgu.kokenId];
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
                              {bulgu.kaynaklar.map((kaynak, index) => (
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
                      {sonuc.etBelirsiz.map((bulgu, index) => (
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
                              {bulgu.olasiKokenler.map((id) => (
                                <AlerjenRozeti key={id}>
                                  {ET_KOKENLERI[id].ad}
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
                      {sonuc.belirsiz.map((bulgu, index) => (
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
                    <ul className="divide-y divide-kum rounded-lg border border-murekkep/10 bg-kagit shadow-sm">
                      {sonuc.taninmayan.map((satir, index) => (
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
                      {sonuc.beyanEdilenYok.map((bulgu, index) => (
                        <li
                          key={index}
                          className="flex items-baseline justify-between gap-4 px-5 py-2.5"
                        >
                          <span className="font-mono text-sm text-zeytin-acik">
                            {bulgu.satir}
                          </span>
                          <span className="shrink-0 text-xs text-zeytin-acik">
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

        <p className="mt-16 max-w-3xl border-t border-murekkep/10 pt-6 text-xs leading-relaxed text-zeytin-acik">
          <strong className="text-zeytin">
            Bu araç bir onay belgesi değildir.
          </strong>{" "}
          Sonuçlar reçete metnindeki kelimelere dayanır; tedarikçi
          bileşimlerini, üretim hattındaki çapraz bulaşmayı veya etiket dışı
          içerikleri göremez. Nihai alerjen ve et kökeni bildiriminin
          doğruluğundan yasal olarak işletme sorumludur.
        </p>
      </main>

      <SiteFooter />
    </div>
  );
}
