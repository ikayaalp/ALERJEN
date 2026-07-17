import Link from "next/link";
import { SiteHeader } from "@/components/site-header";

const OZELLIKLER = [
  {
    baslik: "Satır satır kaynak",
    metin:
      "Her alerjenin reçetenin hangi satırından, hangi kelimeden geldiğini gösteririz. Denetimde 'neden bu çıktı?' sorusunun cevabı hazırdır.",
  },
  {
    baslik: "Tahmin yok, soru var",
    metin:
      "'Fıstık' yer fıstığı mı antep fıstığı mı? 'Jelatin' hangi kaynaktan? Belirsiz içerikte karar size bırakılır — sessizce varsayılmaz.",
  },
  {
    baslik: "Türkiye'ye özel bildirimler",
    metin:
      "14 zorunlu alerjenin yanında mevzuatın istediği alkol ve domuz kaynaklı bileşen bildirimlerini de ayrı işaretleriz.",
  },
  {
    baslik: "Olumsuzluk anlayışı",
    metin:
      "'Glutensiz ekmek' glüten bildirmez; ama 'laktozsuz süt' süt bildirmeye devam eder — çünkü süt proteini hâlâ oradadır.",
  },
  {
    baslik: "Fotoğraftan reçete",
    metin:
      "Reçetenizin fotoğrafını yükleyin, metni çıkarıp onayınıza sunalım. Onaysız hiçbir metin analize girmez.",
    yakinda: true,
  },
  {
    baslik: "QR menü çıktısı",
    metin:
      "Onaylanan raporlardan yönetmeliğin kabul ettiği karekodlu alerjen menüsü üretin.",
    yakinda: true,
  },
];

const TAKVIM = [
  {
    tarih: "1 Temmuz 2026",
    kim: "Ulusal zincir restoranlar",
    ne: "Menülerde alerjen bilgisi zorunlu.",
    gecti: true,
  },
  {
    tarih: "31 Aralık 2026",
    kim: "Aynı ilde 3+ şubeli yerel zincirler",
    ne: "Alerjen bilgisi zorunluluğu başlıyor.",
    gecti: false,
  },
  {
    tarih: "31 Aralık 2027",
    kim: "Yerel zincirler",
    ne: "Kalori beyanı zorunluluğu başlıyor.",
    gecti: false,
  },
];

const PLANLAR = [
  {
    ad: "Başlangıç",
    fiyat: "Ücretsiz",
    donem: "",
    aciklama: "Tek şubeli işletmeler ve deneme için.",
    maddeler: [
      "Sınırsız reçete kontrolü",
      "14 zorunlu alerjen + 2 ek bildirim",
      "Satır satır kaynak raporu",
    ],
    eylem: { metin: "Hemen başla", href: "/kontrol" },
    one_cikan: false,
  },
  {
    ad: "İşletme",
    fiyat: "₺499",
    donem: "/ay",
    aciklama: "Menüsünü mevzuata hazırlayan restoranlar için.",
    maddeler: [
      "Başlangıç'taki her şey",
      "Reçete arşivi ve sürüm geçmişi",
      "PDF rapor çıktısı",
      "Fotoğraftan reçete (yakında)",
      "QR menü çıktısı (yakında)",
    ],
    eylem: { metin: "Planı seç", href: "/giris" },
    one_cikan: true,
  },
  {
    ad: "Zincir",
    fiyat: "Özel",
    donem: "",
    aciklama: "Çok şubeli markalar ve merkezi mutfaklar için.",
    maddeler: [
      "İşletme'deki her şey",
      "Şube bazlı menü yönetimi",
      "Toplu reçete aktarımı",
      "Öncelikli destek",
    ],
    eylem: { metin: "Bize ulaşın", href: "mailto:kayaalp.ismail.1221@gmail.com" },
    one_cikan: false,
  },
];

export default function AnaSayfa() {
  return (
    <div className="min-h-full">
      <SiteHeader />

      <main>
        {/* Hero */}
        <section className="mx-auto grid max-w-6xl items-center gap-12 px-6 pb-20 pt-16 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:pt-24">
          <div>
            <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs text-amber-900">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-600" />
              1 Temmuz 2026 — menüde alerjen bildirimi dönemi başladı
            </p>
            <h1 className="font-display text-5xl leading-[1.05] tracking-tight text-stone-900 sm:text-6xl">
              Menünüz mevzuata hazır mı, reçeteniz söylesin.
            </h1>
            <p className="mt-5 max-w-xl text-lg text-stone-600">
              Reçetenizi yazın; Türk Gıda Kodeksi&apos;nin bildirimi zorunlu
              tuttuğu alerjenleri satır satır, kaynağıyla birlikte çıkaralım.
              Emin olmadığımız yerde tahmin yürütmeyiz — size sorarız.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link
                href="/kontrol"
                className="rounded-full bg-stone-900 px-6 py-3 text-sm font-medium text-stone-50 shadow-sm transition hover:bg-stone-700"
              >
                Ücretsiz kontrol et
              </Link>
              <Link
                href="#takvim"
                className="rounded-full border border-stone-300 px-6 py-3 text-sm text-stone-700 transition hover:border-stone-400 hover:bg-white"
              >
                Mevzuat takvimi
              </Link>
            </div>
            <p className="mt-4 text-xs text-stone-500">
              Kayıt gerekmez · Reçeteniz tarayıcınızdan çıkmaz
            </p>
          </div>

          {/* Statik rapor örneği */}
          <div className="relative">
            <div
              className="absolute -inset-6 rounded-[2rem] bg-gradient-to-br from-amber-100/60 via-transparent to-red-100/40"
              aria-hidden
            />
            <div className="relative rounded-2xl border border-stone-200 bg-white p-5 shadow-lg shadow-stone-200/60">
              <div className="mb-4 flex items-center justify-between border-b border-stone-100 pb-3">
                <span className="font-display text-lg text-stone-900">
                  Rapor · Fındıklı kek
                </span>
                <span className="rounded-full bg-red-50 px-2.5 py-1 text-xs font-medium text-red-700">
                  4 alerjen
                </span>
              </div>
              <ul className="space-y-2.5 text-sm">
                {[
                  ["Glüten içeren tahıllar", "500 g buğday unu"],
                  ["Süt", "200 ml süt · 100 g tereyağı"],
                  ["Yumurta", "3 yumurta"],
                  ["Sert kabuklu yemişler", "50 g fındık"],
                ].map(([alerjen, kaynak]) => (
                  <li
                    key={alerjen}
                    className="flex items-baseline justify-between gap-3 rounded-lg border border-red-100 bg-red-50/50 px-3.5 py-2.5"
                  >
                    <span className="font-medium text-red-950">{alerjen}</span>
                    <span className="text-right font-mono text-xs text-stone-500">
                      {kaynak}
                    </span>
                  </li>
                ))}
                <li className="flex items-baseline justify-between gap-3 rounded-lg border border-stone-200 bg-stone-50 px-3.5 py-2.5">
                  <span className="text-stone-700">1 tatlı kaşığı tuz</span>
                  <span className="text-xs text-stone-500">
                    tanınmadı — elle kontrol
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Özellikler */}
        <section id="ozellikler" className="border-y border-stone-200 bg-white">
          <div className="mx-auto max-w-6xl px-6 py-20">
            <h2 className="font-display text-3xl tracking-tight text-stone-900 sm:text-4xl">
              Denetimde savunabileceğiniz bir rapor
            </h2>
            <p className="mt-3 max-w-2xl text-stone-600">
              Kara kutu değil. Her bulgunun gerekçesi görünür, her belirsizlik
              açıkça işaretlenir.
            </p>
            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {OZELLIKLER.map((ozellik) => (
                <div
                  key={ozellik.baslik}
                  className="rounded-2xl border border-stone-200 bg-stone-50/50 p-6"
                >
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium text-stone-900">
                      {ozellik.baslik}
                    </h3>
                    {ozellik.yakinda && (
                      <span className="rounded-full bg-stone-200 px-2 py-0.5 text-[11px] text-stone-600">
                        yakında
                      </span>
                    )}
                  </div>
                  <p className="mt-2 text-sm leading-relaxed text-stone-600">
                    {ozellik.metin}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Mevzuat takvimi */}
        <section id="takvim" className="mx-auto max-w-6xl px-6 py-20">
          <h2 className="font-display text-3xl tracking-tight text-stone-900 sm:text-4xl">
            Mevzuat takvimi
          </h2>
          <p className="mt-3 max-w-2xl text-stone-600">
            Tarım ve Orman Bakanlığı düzenlemesi kademeli yürürlüğe giriyor.
            Hangi tarihte kimin kapsamda olduğunu bilin.
          </p>
          <ol className="mt-10 space-y-0">
            {TAKVIM.map((madde, index) => (
              <li key={madde.tarih} className="relative flex gap-6 pb-10 last:pb-0">
                <div className="flex flex-col items-center">
                  <span
                    className={`mt-1 h-3 w-3 shrink-0 rounded-full ${
                      madde.gecti ? "bg-amber-600" : "bg-stone-300"
                    }`}
                  />
                  {index < TAKVIM.length - 1 && (
                    <span className="mt-1 w-px flex-1 bg-stone-200" />
                  )}
                </div>
                <div className="-mt-0.5">
                  <p className="font-display text-xl text-stone-900">
                    {madde.tarih}
                    {madde.gecti && (
                      <span className="ml-3 rounded-full bg-amber-100 px-2.5 py-0.5 align-middle text-xs font-sans text-amber-900">
                        yürürlükte
                      </span>
                    )}
                  </p>
                  <p className="mt-1 text-sm font-medium text-stone-700">
                    {madde.kim}
                  </p>
                  <p className="text-sm text-stone-600">{madde.ne}</p>
                </div>
              </li>
            ))}
          </ol>
          <p className="mt-8 max-w-2xl text-xs text-stone-500">
            Tarihler ikincil kaynaklardan derlenmiştir; işletmenizin
            yükümlülüğünü Resmî Gazete metninden ve bağlı olduğunuz il
            müdürlüğünden teyit edin.
          </p>
        </section>

        {/* Fiyatlandırma */}
        <section id="fiyat" className="border-t border-stone-200 bg-white">
          <div className="mx-auto max-w-6xl px-6 py-20">
            <h2 className="font-display text-3xl tracking-tight text-stone-900 sm:text-4xl">
              Fiyatlandırma
            </h2>
            <p className="mt-3 max-w-2xl text-stone-600">
              Kontrol her zaman ücretsiz. Ücretli planlar arşiv, çıktı ve şube
              yönetimi ekler.
            </p>
            <div className="mt-12 grid gap-6 lg:grid-cols-3">
              {PLANLAR.map((plan) => (
                <div
                  key={plan.ad}
                  className={`relative flex flex-col rounded-2xl border p-7 ${
                    plan.one_cikan
                      ? "border-stone-900 bg-stone-900 text-stone-50 shadow-xl shadow-stone-300/50"
                      : "border-stone-200 bg-stone-50/50 text-stone-900"
                  }`}
                >
                  {plan.one_cikan && (
                    <span className="absolute -top-3 left-7 rounded-full bg-amber-500 px-3 py-1 text-xs font-medium text-stone-950">
                      En çok tercih edilen
                    </span>
                  )}
                  <h3 className="font-medium">{plan.ad}</h3>
                  <p className="mt-3">
                    <span className="font-display text-4xl tracking-tight">
                      {plan.fiyat}
                    </span>
                    <span
                      className={
                        plan.one_cikan ? "text-stone-400" : "text-stone-500"
                      }
                    >
                      {plan.donem}
                    </span>
                  </p>
                  <p
                    className={`mt-2 text-sm ${
                      plan.one_cikan ? "text-stone-300" : "text-stone-600"
                    }`}
                  >
                    {plan.aciklama}
                  </p>
                  <ul
                    className={`mt-6 flex-1 space-y-2.5 text-sm ${
                      plan.one_cikan ? "text-stone-200" : "text-stone-700"
                    }`}
                  >
                    {plan.maddeler.map((madde) => (
                      <li key={madde} className="flex gap-2.5">
                        <span
                          className={
                            plan.one_cikan ? "text-amber-400" : "text-amber-600"
                          }
                        >
                          ✓
                        </span>
                        {madde}
                      </li>
                    ))}
                  </ul>
                  <Link
                    href={plan.eylem.href}
                    className={`mt-8 rounded-full px-5 py-2.5 text-center text-sm font-medium transition ${
                      plan.one_cikan
                        ? "bg-amber-500 text-stone-950 hover:bg-amber-400"
                        : "border border-stone-300 text-stone-800 hover:border-stone-400 hover:bg-white"
                    }`}
                  >
                    {plan.eylem.metin}
                  </Link>
                </div>
              ))}
            </div>
            <p className="mt-8 text-xs text-stone-500">
              Çevrimiçi ödeme entegrasyonu hazırlanıyor; İşletme planı şu an
              hesap açılışında etkinleştirilir.
            </p>
          </div>
        </section>

        {/* Kapanış CTA */}
        <section className="mx-auto max-w-6xl px-6 py-20">
          <div className="rounded-3xl border border-stone-200 bg-gradient-to-br from-stone-900 to-stone-800 px-8 py-14 text-center sm:px-14">
            <h2 className="font-display text-3xl tracking-tight text-stone-50 sm:text-4xl">
              İlk reçetenizi 30 saniyede kontrol edin
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-stone-300">
              Kayıt yok, kurulum yok. Reçetenizi yapıştırın, raporu görün.
            </p>
            <Link
              href="/kontrol"
              className="mt-8 inline-block rounded-full bg-amber-500 px-8 py-3 text-sm font-medium text-stone-950 transition hover:bg-amber-400"
            >
              Ücretsiz dene
            </Link>
          </div>
        </section>
      </main>

      <footer className="border-t border-stone-200 bg-white">
        <div className="mx-auto max-w-6xl px-6 py-10">
          <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-center">
            <span className="font-display text-xl text-stone-900">
              Alerjen Kontrol
            </span>
            <nav className="flex gap-6 text-sm text-stone-600">
              <Link href="/#ozellikler" className="hover:text-stone-900">
                Özellikler
              </Link>
              <Link href="/#fiyat" className="hover:text-stone-900">
                Fiyatlandırma
              </Link>
              <Link href="/kontrol" className="hover:text-stone-900">
                Kontrol aracı
              </Link>
            </nav>
          </div>
          <p className="mt-8 max-w-3xl text-xs leading-relaxed text-stone-500">
            <strong className="text-stone-700">
              Bu site bir onay mercii değildir.
            </strong>{" "}
            Raporlar reçete metnine dayanır; tedarikçi bileşimlerini, çapraz
            bulaşmayı veya etiket dışı içerikleri göremez. Nihai alerjen
            bildiriminin doğruluğundan yasal olarak işletme sorumludur.
          </p>
        </div>
      </footer>
    </div>
  );
}
