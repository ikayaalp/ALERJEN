import Link from "next/link";

export function SiteHeader() {
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

        <div className="flex items-center gap-2">
          <Link
            href="/giris"
            className="rounded-lg px-3.5 py-2 text-sm text-zeytin transition hover:bg-kum"
          >
            Giriş
          </Link>
          <Link
            href="/kontrol"
            className="rounded-lg bg-murekkep px-4 py-2 text-sm font-medium text-krem transition hover:bg-zeytin"
          >
            Reçeteni dene
          </Link>
        </div>
      </div>
    </header>
  );
}
