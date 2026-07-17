import Link from "next/link";

const SUTUNLAR = [
  {
    baslik: "Ürün",
    linkler: [
      { ad: "Reçete kontrolü", href: "/kontrol" },
      { ad: "Nasıl çalışır", href: "/#ozellikler" },
      { ad: "Fiyatlar", href: "/#fiyat" },
      { ad: "Giriş yap", href: "/giris" },
    ],
  },
  {
    baslik: "Mevzuat",
    linkler: [
      { ad: "Uyum takvimi", href: "/#takvim" },
      { ad: "14 zorunlu alerjen", href: "/#ozellikler" },
      { ad: "Et kökeni bildirimi", href: "/#ozellikler" },
      { ad: "Kalori beyanı", href: "/#takvim" },
    ],
  },
  {
    baslik: "İşletmeler için",
    linkler: [
      { ad: "Restoranlar", href: "/kontrol" },
      { ad: "Kafeler", href: "/kontrol" },
      { ad: "Zincir markalar", href: "/#fiyat" },
      { ad: "Merkezi mutfaklar", href: "/#fiyat" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="relative overflow-hidden bg-murekkep text-krem">
      <div
        className="doku pointer-events-none absolute inset-0 opacity-20"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -bottom-32 -left-20 h-80 w-80 rounded-full bg-biber/20 blur-3xl"
        aria-hidden
      />

      <div className="relative mx-auto max-w-6xl px-6 py-16">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          {/* Marka + bülten */}
          <div>
            <div className="flex items-center gap-2.5">
              <span
                className="grid h-9 w-9 place-items-center rounded-full bg-biber text-sm font-semibold text-krem"
                aria-hidden
              >
                ŞM
              </span>
              <span className="font-display text-xl font-semibold">
                Şeffaf Menü
              </span>
            </div>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-krem/60">
              Restoran, kafe ve zincir markaların menülerini Türk Gıda
              Kodeksi&apos;ne uygun hale getiren uyum hizmeti.
            </p>

            <form className="mt-6 max-w-xs" aria-label="Bülten aboneliği">
              <label
                htmlFor="bulten"
                className="text-xs uppercase tracking-[0.14em] text-krem/50"
              >
                Mevzuat güncellemelerinden haberdar ol
              </label>
              <div className="mt-2 flex gap-2">
                <input
                  id="bulten"
                  type="email"
                  placeholder="e-posta adresin"
                  className="min-w-0 flex-1 rounded-lg border border-krem/15 bg-krem/5 px-3 py-2 text-sm text-krem outline-none transition placeholder:text-krem/40 focus:border-safran/60 focus:bg-krem/10"
                />
                <button
                  type="submit"
                  className="kalk shrink-0 rounded-lg bg-safran px-3.5 py-2 text-sm font-medium text-murekkep"
                >
                  Katıl
                </button>
              </div>
            </form>
          </div>

          {/* Link sütunları */}
          {SUTUNLAR.map((sutun) => (
            <div key={sutun.baslik}>
              <h3 className="text-xs uppercase tracking-[0.14em] text-safran">
                {sutun.baslik}
              </h3>
              <ul className="mt-4 space-y-2.5">
                {sutun.linkler.map((link) => (
                  <li key={link.ad}>
                    <Link
                      href={link.href}
                      className="text-sm text-krem/65 transition hover:text-krem"
                    >
                      {link.ad}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Yasal uyarı */}
        <div className="mt-14 rounded-lg border border-krem/10 bg-krem/[0.03] p-5">
          <p className="max-w-4xl text-xs leading-relaxed text-krem/55">
            <strong className="text-krem/80">
              Bu site bir onay mercii değildir.
            </strong>{" "}
            Raporlar yalnızca girilen reçete metnine dayanır; tedarikçi
            bileşimlerini, üretim hattındaki çapraz bulaşmayı veya etiket dışı
            içerikleri göremez. Alerjen, et kökeni ve diğer zorunlu bildirimlerin
            nihai doğruluğundan yasal olarak işletme sorumludur. Mevzuat
            bilgileri ikincil kaynaklardan derlenmiştir; yükümlülüğünüzü Resmî
            Gazete metninden teyit edin.
          </p>
        </div>

        {/* Alt şerit */}
        <div className="mt-8 flex flex-col items-center justify-between gap-4 border-t border-krem/10 pt-6 sm:flex-row">
          <p className="text-xs text-krem/40">
            © {new Date().getFullYear()} Şeffaf Menü · Türkiye
          </p>
          <div className="flex gap-6 text-xs text-krem/40">
            <a
              href="mailto:kayaalp.ismail.1221@gmail.com"
              className="transition hover:text-krem/70"
            >
              İletişim
            </a>
            <span>Gizlilik</span>
            <span>Kullanım koşulları</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
