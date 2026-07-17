import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Belir } from "@/components/belir";

const ADIMLAR = [
  {
    baslik: "Reçeteyi yaz",
    metin:
      "Satır satır içerik. Yazarak ya da fotoğrafını çekerek — bir şey kurmana, kayıt olmana gerek yok.",
  },
  {
    baslik: "Kaynağıyla göster",
    metin:
      "Her alerjen hangi satırdan, hangi kelimeden çıktı, tek tek görürsün. Denetimde 'neden bu çıktı' sorusunun cevabı hazır.",
  },
  {
    baslik: "Şüpheliyi sor",
    metin:
      "Fıstık dediğin yer fıstığı mı, antep mi? İkisi ayrı alerjen. Karar veremiyorsak uydurmuyoruz — sana soruyoruz.",
  },
];

const ALERJENLER = [
  "Glüten",
  "Süt",
  "Yumurta",
  "Balık",
  "Kabuklular",
  "Yumuşakçalar",
  "Yer fıstığı",
  "Sert kabuklu yemişler",
  "Soya",
  "Susam",
  "Kereviz",
  "Hardal",
  "Sülfitler",
  "Lupin",
];

const TAKVIM = [
  {
    tarih: "1 Temmuz 2026",
    kim: "Ulusal zincirler",
    ne: "Menüde alerjen bildirimi zorunlu.",
    gecti: true,
  },
  {
    tarih: "31 Aralık 2026",
    kim: "Aynı ilde 3+ şubeli yerel zincirler",
    ne: "Alerjen bildirimi zorunluluğu başlıyor.",
    gecti: false,
  },
  {
    tarih: "31 Aralık 2027",
    kim: "Yerel zincirler",
    ne: "Kalori beyanı zorunluluğu başlıyor.",
    gecti: false,
  },
];

export default function AnaSayfa() {
  return (
    <div className="min-h-full">
      <SiteHeader />

      <main>
        {/* ---------- Hero ---------- */}
        <section className="relative overflow-hidden">
          <div
            className="doku pointer-events-none absolute inset-0 opacity-[0.5] mix-blend-multiply"
            aria-hidden
          />
          <div
            className="yuz pointer-events-none absolute -right-40 -top-40 h-[36rem] w-[36rem] rounded-full bg-safran-acik/25 blur-3xl"
            aria-hidden
          />

          <div className="relative mx-auto grid max-w-6xl gap-14 px-6 pb-24 pt-16 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:pt-20">
            <div>
              <p className="mb-6 inline-flex items-center gap-2.5 rounded-full border border-biber/25 bg-biber/5 py-1.5 pl-2 pr-4 text-[13px] text-biber">
                <span className="yuz rounded-full bg-biber px-2 py-0.5 text-[11px] font-medium text-krem">
                  Yürürlükte
                </span>
                1 Temmuz 2026 — menüde alerjen dönemi başladı
              </p>

              <h1 className="font-display text-[3.25rem] font-semibold leading-[0.98] tracking-[-0.02em] text-murekkep sm:text-[4.25rem]">
                Mutfağında ne var,
                <br />
                <span className="text-biber">menün onu söylesin.</span>
              </h1>

              <p className="mt-6 max-w-lg text-lg leading-relaxed text-zeytin-acik">
                Reçeteni yaz, Türk Gıda Kodeksi&apos;nin bildirmeni zorunlu
                tuttuğu alerjenleri satır satır çıkaralım. Emin olmadığımız
                yerde tahmin yürütmeyiz — sana sorarız.
              </p>

              <div className="mt-9 flex flex-wrap items-center gap-3">
                <Link
                  href="/kontrol"
                  className="rounded-lg bg-biber px-7 py-3.5 text-sm font-medium text-krem shadow-lg shadow-biber/25 transition hover:bg-biber-acik"
                >
                  Reçeteni dene — ücretsiz
                </Link>
                <Link
                  href="#takvim"
                  className="rounded-lg border border-murekkep/15 px-6 py-3.5 text-sm text-zeytin transition hover:border-murekkep/30 hover:bg-kagit"
                >
                  Ben kapsamda mıyım?
                </Link>
              </div>

              <p className="mt-5 text-[13px] text-zeytin-acik/80">
                Kayıt yok · Kurulum yok · Reçeten tarayıcından çıkmaz
              </p>
            </div>

            {/* Rapor kartı — hafif eğik, elle konmuş hissi */}
            <div className="relative lg:pl-6">
              <div
                className="absolute inset-x-6 top-6 h-full rotate-[2.5deg] rounded-lg border border-murekkep/10 bg-kum"
                aria-hidden
              />
              <div className="relative -rotate-[1.2deg] rounded-lg border border-murekkep/10 bg-kagit p-6 shadow-2xl shadow-murekkep/10">
                <div className="flex items-baseline justify-between border-b border-dashed border-murekkep/15 pb-4">
                  <div>
                    <p className="font-display text-2xl font-semibold text-murekkep">
                      Fındıklı kek
                    </p>
                    <p className="mt-0.5 text-xs uppercase tracking-[0.16em] text-zeytin-acik/70">
                      Alerjen raporu
                    </p>
                  </div>
                  <span className="rounded bg-biber px-2.5 py-1 text-xs font-medium text-krem">
                    4 alerjen
                  </span>
                </div>

                <ul className="mt-4 space-y-px">
                  {[
                    ["Glüten içeren tahıllar", "500 g buğday unu"],
                    ["Süt", "200 ml süt · 100 g tereyağı"],
                    ["Yumurta", "3 yumurta"],
                    ["Sert kabuklu yemişler", "50 g fındık"],
                  ].map(([alerjen, kaynak]) => (
                    <li
                      key={alerjen}
                      className="flex items-baseline justify-between gap-4 border-l-2 border-biber bg-biber/[0.04] py-2.5 pl-3.5 pr-2"
                    >
                      <span className="text-sm font-medium text-murekkep">
                        {alerjen}
                      </span>
                      <span className="text-right font-mono text-[11px] leading-relaxed text-zeytin-acik">
                        {kaynak}
                      </span>
                    </li>
                  ))}
                  <li className="mt-3 flex items-baseline justify-between gap-4 border-l-2 border-zeytin bg-zeytin/[0.06] py-2.5 pl-3.5 pr-2">
                    <span className="text-sm font-medium text-zeytin">
                      Et kökeni: Kanatlı
                    </span>
                    <span className="text-right font-mono text-[11px] text-zeytin-acik">
                      200 g tavuk göğsü
                    </span>
                  </li>
                  <li className="mt-3 flex items-baseline justify-between gap-4 border-l-2 border-safran bg-safran/[0.07] py-2.5 pl-3.5 pr-2">
                    <span className="font-mono text-sm text-murekkep">
                      1 tatlı kaşığı tuz
                    </span>
                    <span className="text-right text-[11px] text-zeytin-acik">
                      tanınmadı — elle kontrol
                    </span>
                  </li>
                </ul>

                <p className="mt-5 border-t border-dashed border-murekkep/15 pt-3.5 text-[11px] leading-relaxed text-zeytin-acik/80">
                  Bu rapor bir onay belgesi değildir. Nihai bildirimden işletme
                  sorumludur.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ---------- Alerjen şeridi ---------- */}
        <section className="border-y border-murekkep/10 bg-zeytin">
          <div className="mx-auto max-w-6xl px-6 py-8">
            <div className="flex flex-wrap items-center gap-x-3 gap-y-2.5">
              <span className="mr-2 text-xs uppercase tracking-[0.16em] text-safran-acik">
                Takip ettiklerimiz
              </span>
              {ALERJENLER.map((ad) => (
                <span
                  key={ad}
                  className="rounded-full border border-krem/20 px-3 py-1 text-[13px] text-krem/85"
                >
                  {ad}
                </span>
              ))}
              <span className="rounded-full bg-safran px-3 py-1 text-[13px] font-medium text-murekkep">
                + Alkol
              </span>
              <span className="rounded-full bg-safran px-3 py-1 text-[13px] font-medium text-murekkep">
                + Domuz
              </span>
              <span className="rounded-full bg-safran px-3 py-1 text-[13px] font-medium text-murekkep">
                + Et kökeni
              </span>
              <span className="text-[13px] text-krem/50">
                Alerjen, et menşei, alkol ve kalori — mevzuatın tamamı
              </span>
            </div>
          </div>
        </section>

        {/* ---------- Nasıl çalışır ---------- */}
        <section id="ozellikler" className="mx-auto max-w-6xl px-6 py-24">
          <div className="max-w-2xl">
            <p className="mb-3 text-xs uppercase tracking-[0.18em] text-biber">
              Nasıl çalışır
            </p>
            <h2 className="font-display text-4xl font-semibold leading-tight tracking-[-0.02em] text-murekkep sm:text-5xl">
              Kara kutu değil. Her bulgunun gerekçesi ortada.
            </h2>
          </div>

          <div className="mt-14 grid gap-px overflow-hidden rounded-lg border border-murekkep/10 bg-murekkep/10 md:grid-cols-3">
            {ADIMLAR.map((adim, index) => (
              <Belir
                key={adim.baslik}
                gecikme={(index + 1) as 1 | 2 | 3}
                className="bg-krem"
              >
                <div className="h-full p-8">
                  <span className="font-display text-5xl font-semibold text-safran">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <h3 className="mt-4 font-display text-2xl font-semibold text-murekkep">
                    {adim.baslik}
                  </h3>
                  <p className="mt-2.5 text-[15px] leading-relaxed text-zeytin-acik">
                    {adim.metin}
                  </p>
                </div>
              </Belir>
            ))}
          </div>

          {/* Öne çıkan detay — asimetrik */}
          <div className="mt-6 grid gap-6 lg:grid-cols-[1.4fr_1fr]">
            <div className="rounded-lg border border-murekkep/10 bg-kagit p-8">
              <h3 className="font-display text-2xl font-semibold text-murekkep">
                &quot;Laktozsuz süt&quot; hâlâ süttür
              </h3>
              <p className="mt-3 max-w-xl text-[15px] leading-relaxed text-zeytin-acik">
                Çoğu araç bunu kaçırır. Laktozsuz sütten laktoz alınmıştır ama
                süt proteini yerinde durur — süt alerjisi olan biri için risk
                aynen sürer. Bizim motor bunu bilir ve süt bildirimini
                düşürmez. Ama &quot;glutensiz ekmek&quot; dersen glüteni
                düşürür. Farkı anlar.
              </p>
              <div className="mt-6 flex flex-wrap gap-2 font-mono text-xs">
                <span className="rounded border border-biber/30 bg-biber/5 px-2.5 py-1.5 text-biber">
                  laktozsuz süt → süt VAR
                </span>
                <span className="rounded border border-zeytin/20 bg-zeytin/5 px-2.5 py-1.5 text-zeytin">
                  glutensiz ekmek → glüten yok
                </span>
                <span className="rounded border border-biber/30 bg-biber/5 px-2.5 py-1.5 text-biber">
                  susamsız simit → glüten VAR
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-6">
              <div className="rounded-lg border border-murekkep/10 bg-murekkep p-8 text-krem">
                <h3 className="font-display text-2xl font-semibold">
                  Bilmiyorsak &quot;temiz&quot; demeyiz
                </h3>
                <p className="mt-3 text-[15px] leading-relaxed text-krem/70">
                  Sözlüğümüzde olmayan bir içerik gördüğümüzde raporu
                  tamamlanmadı sayarız. Sessizce geçiştirmek, bu işte en
                  tehlikeli hata türü.
                </p>
              </div>
              <div className="rounded-lg border border-zeytin/20 bg-zeytin/[0.06] p-8">
                <h3 className="font-display text-2xl font-semibold text-zeytin">
                  Sadece alerjen değil
                </h3>
                <p className="mt-3 text-[15px] leading-relaxed text-zeytin-acik">
                  Mevzuat et kökenini de ister: &quot;kıyma&quot; yazan menü
                  hangi hayvandan geldiğini söylemiyor. Dana, kuzu ve kanatlıyı
                  ayrı işaretler, alkol ve kaloriyi de kapsarız.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ---------- Takvim ---------- */}
        <section id="takvim" className="border-y border-murekkep/10 bg-kum/60">
          <div className="mx-auto grid max-w-6xl gap-12 px-6 py-24 lg:grid-cols-[0.8fr_1.2fr]">
            <div>
              <p className="mb-3 text-xs uppercase tracking-[0.18em] text-biber">
                Takvim
              </p>
              <h2 className="font-display text-4xl font-semibold leading-tight tracking-[-0.02em] text-murekkep">
                Sıra sana ne zaman geliyor?
              </h2>
              <p className="mt-4 text-[15px] leading-relaxed text-zeytin-acik">
                Tarım ve Orman Bakanlığı düzenlemesi kademeli yürürlüğe
                giriyor. Ulusal zincirler için tarih çoktan geçti.
              </p>
            </div>

            <ol>
              {TAKVIM.map((madde) => (
                <li
                  key={madde.tarih}
                  className={`flex gap-6 border-t py-7 last:border-b ${
                    madde.gecti ? "border-biber/25" : "border-murekkep/10"
                  }`}
                >
                  <span
                    className={`mt-2 h-2.5 w-2.5 shrink-0 rounded-full ${
                      madde.gecti ? "bg-biber" : "bg-murekkep/20"
                    }`}
                    aria-hidden
                  />
                  <div className="flex-1">
                    <div className="flex flex-wrap items-baseline gap-3">
                      <p className="font-display text-2xl font-semibold text-murekkep">
                        {madde.tarih}
                      </p>
                      {madde.gecti && (
                        <span className="rounded bg-biber px-2 py-0.5 text-[11px] font-medium text-krem">
                          yürürlükte
                        </span>
                      )}
                    </div>
                    <p className="mt-1.5 text-[15px] font-medium text-zeytin">
                      {madde.kim}
                    </p>
                    <p className="text-[15px] text-zeytin-acik">{madde.ne}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
          <div className="mx-auto max-w-6xl px-6 pb-10">
            <p className="max-w-2xl text-xs leading-relaxed text-zeytin-acik/80">
              Tarihler ikincil kaynaklardan derlenmiştir. İşletmenizin
              yükümlülüğünü Resmî Gazete metninden ve bağlı olduğunuz il
              müdürlüğünden teyit edin.
            </p>
          </div>
        </section>

        {/* ---------- Fiyat ---------- */}
        <section id="fiyat" className="mx-auto max-w-6xl px-6 py-24">
          <div className="max-w-2xl">
            <p className="mb-3 text-xs uppercase tracking-[0.18em] text-biber">
              Fiyatlar
            </p>
            <h2 className="font-display text-4xl font-semibold leading-tight tracking-[-0.02em] text-murekkep sm:text-5xl">
              Kontrol her zaman ücretsiz.
            </h2>
            <p className="mt-4 text-[15px] leading-relaxed text-zeytin-acik">
              Para istediğimiz yer arşiv, çıktı ve şube yönetimi. Reçeteni
              kontrol etmek için hiçbir zaman ödeme yapmayacaksın.
            </p>
          </div>

          <div className="mt-14 grid gap-6 lg:grid-cols-[1fr_1.15fr_1fr] lg:items-center">
            {/* Ücretsiz */}
            <div className="rounded-lg border border-murekkep/10 bg-kagit p-7">
              <p className="font-display text-xl font-semibold text-murekkep">
                Başlangıç
              </p>
              <p className="mt-4 font-display text-5xl font-semibold text-murekkep">
                Ücretsiz
              </p>
              <p className="mt-2 text-sm text-zeytin-acik">
                Tek şubeli işletmeler ve deneme için.
              </p>
              <ul className="mt-7 space-y-3 text-sm text-zeytin">
                {[
                  "Sınırsız reçete kontrolü",
                  "14 zorunlu alerjen + 2 ek bildirim",
                  "Satır satır kaynak raporu",
                ].map((madde) => (
                  <li
                    key={madde}
                    className="border-b border-dashed border-murekkep/10 pb-3 last:border-0"
                  >
                    {madde}
                  </li>
                ))}
              </ul>
              <Link
                href="/kontrol"
                className="mt-7 block rounded-lg border border-murekkep/20 py-3 text-center text-sm font-medium text-murekkep transition hover:bg-kum"
              >
                Hemen başla
              </Link>
            </div>

            {/* İşletme — vurgulu */}
            <div className="relative rounded-lg bg-murekkep p-8 text-krem shadow-2xl shadow-murekkep/25">
              <div
                className="doku pointer-events-none absolute inset-0 rounded-lg opacity-30"
                aria-hidden
              />
              <div className="relative">
                <div className="flex items-baseline justify-between">
                  <p className="font-display text-xl font-semibold">İşletme</p>
                  <span className="rounded bg-safran px-2.5 py-1 text-[11px] font-medium text-murekkep">
                    En çok seçilen
                  </span>
                </div>
                <p className="mt-4 font-display text-6xl font-semibold text-safran">
                  ₺499
                  <span className="font-sans text-base font-normal text-krem/50">
                    /ay
                  </span>
                </p>
                <p className="mt-2 text-sm text-krem/60">
                  Menüsünü mevzuata hazırlayan restoranlar için.
                </p>
                <ul className="mt-7 space-y-3 text-sm text-krem/85">
                  {[
                    { ad: "Başlangıç'taki her şey" },
                    { ad: "Reçete arşivi ve sürüm geçmişi" },
                    { ad: "PDF rapor çıktısı" },
                    { ad: "Fotoğraftan reçete okuma", yakinda: true },
                    { ad: "QR menü çıktısı", yakinda: true },
                  ].map((madde) => (
                    <li
                      key={madde.ad}
                      className="flex items-center justify-between gap-3 border-b border-dashed border-krem/15 pb-3 last:border-0"
                    >
                      <span className={madde.yakinda ? "text-krem/45" : ""}>
                        {madde.ad}
                      </span>
                      {madde.yakinda && (
                        <span className="shrink-0 rounded border border-krem/20 px-1.5 py-0.5 text-[10px] uppercase tracking-wider text-krem/45">
                          yakında
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/giris"
                  className="mt-7 block rounded-lg bg-safran py-3 text-center text-sm font-medium text-murekkep transition hover:bg-safran-acik"
                >
                  Planı seç
                </Link>
              </div>
            </div>

            {/* Zincir */}
            <div className="rounded-lg border border-murekkep/10 bg-kagit p-7">
              <p className="font-display text-xl font-semibold text-murekkep">
                Zincir
              </p>
              <p className="mt-4 font-display text-5xl font-semibold text-murekkep">
                Özel
              </p>
              <p className="mt-2 text-sm text-zeytin-acik">
                Çok şubeli markalar ve merkezi mutfaklar için.
              </p>
              <ul className="mt-7 space-y-3 text-sm text-zeytin">
                {[
                  "İşletme'deki her şey",
                  "Şube bazlı menü yönetimi",
                  "Toplu reçete aktarımı",
                  "Öncelikli destek",
                ].map((madde) => (
                  <li
                    key={madde}
                    className="border-b border-dashed border-murekkep/10 pb-3 last:border-0"
                  >
                    {madde}
                  </li>
                ))}
              </ul>
              <a
                href="mailto:kayaalp.ismail.1221@gmail.com"
                className="mt-7 block rounded-lg border border-murekkep/20 py-3 text-center text-sm font-medium text-murekkep transition hover:bg-kum"
              >
                Bize ulaşın
              </a>
            </div>
          </div>

          <p className="mt-8 max-w-2xl text-xs leading-relaxed text-zeytin-acik/80">
            &quot;Yakında&quot; işaretli özellikler henüz kullanıma açılmadı ve
            fiyata dahil değildir. Çevrimiçi ödeme altyapısı da hazırlanıyor;
            İşletme planı şimdilik hesap açılışında etkinleştirilir.
          </p>
        </section>

        {/* ---------- Kapanış ---------- */}
        <section className="relative overflow-hidden border-t border-murekkep/10 bg-biber">
          <div
            className="doku pointer-events-none absolute inset-0 opacity-25"
            aria-hidden
          />
          <div className="relative mx-auto max-w-6xl px-6 py-24 text-center">
            <h2 className="mx-auto max-w-2xl font-display text-4xl font-semibold leading-tight tracking-[-0.02em] text-krem sm:text-5xl">
              İlk reçeteni 30 saniyede kontrol et.
            </h2>
            <p className="mx-auto mt-4 max-w-md text-krem/75">
              Kayıt yok, kurulum yok. Reçeteni yapıştır, raporu gör.
            </p>
            <Link
              href="/kontrol"
              className="mt-9 inline-block rounded-lg bg-krem px-9 py-4 text-sm font-medium text-biber transition hover:bg-kagit"
            >
              Ücretsiz dene
            </Link>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
