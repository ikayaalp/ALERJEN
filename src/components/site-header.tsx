import Link from "next/link";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-stone-200/80 bg-stone-50/85 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-baseline gap-3">
          <span className="font-display text-2xl tracking-tight text-stone-900">
            Alerjen Kontrol
          </span>
          <span className="hidden text-[11px] uppercase tracking-[0.18em] text-stone-400 md:block">
            Türk Gıda Kodeksi
          </span>
        </Link>

        <nav className="hidden items-center gap-7 text-sm text-stone-600 md:flex">
          <Link href="/#ozellikler" className="transition hover:text-stone-900">
            Özellikler
          </Link>
          <Link href="/#takvim" className="transition hover:text-stone-900">
            Mevzuat takvimi
          </Link>
          <Link href="/#fiyat" className="transition hover:text-stone-900">
            Fiyatlandırma
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/giris"
            className="rounded-full px-4 py-2 text-sm text-stone-700 transition hover:bg-stone-200/60"
          >
            Giriş yap
          </Link>
          <Link
            href="/kontrol"
            className="rounded-full bg-stone-900 px-4 py-2 text-sm text-stone-50 shadow-sm transition hover:bg-stone-700"
          >
            Ücretsiz dene
          </Link>
        </div>
      </div>
    </header>
  );
}
