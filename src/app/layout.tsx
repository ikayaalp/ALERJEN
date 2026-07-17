import type { Metadata } from "next";
import { Fraunces, Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin", "latin-ext"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin", "latin-ext"],
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin", "latin-ext"],
  axes: ["SOFT", "WONK", "opsz"],
});

const SITE_URL = "https://alerjenkontrol.com";
const BASLIK = "Alerjen Kontrol — Menü ve Reçete Alerjen Tarama Aracı";
const ACIKLAMA =
  "Restoran ve kafeler için reçete alerjen kontrolü. Türk Gıda Kodeksi'nin 1 Temmuz 2026'da zorunlu kıldığı 14 alerjen, et kökeni, alkol ve kalori bildirimlerini menünüz için satır satır çıkarır.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: BASLIK,
    template: "%s — Alerjen Kontrol",
  },
  description: ACIKLAMA,
  keywords: [
    "alerjen bildirimi",
    "menü alerjen",
    "restoran alerjen zorunluluğu",
    "Türk Gıda Kodeksi",
    "1 Temmuz 2026 menü",
    "gıda alerjenleri",
    "et kökeni bildirimi",
    "kalori beyanı menü",
    "kafe alerjen mevzuatı",
    "reçete alerjen kontrolü",
  ],
  authors: [{ name: "Alerjen Kontrol" }],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "tr_TR",
    url: SITE_URL,
    siteName: "Alerjen Kontrol",
    title: BASLIK,
    description: ACIKLAMA,
  },
  twitter: {
    card: "summary_large_image",
    title: BASLIK,
    description: ACIKLAMA,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
  category: "food safety",
};

/** Google zengin sonuçları için yapısal veri (JSON-LD). */
const YAPISAL_VERI = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Alerjen Kontrol",
  applicationCategory: "BusinessApplication",
  operatingSystem: "Web",
  url: SITE_URL,
  description: ACIKLAMA,
  inLanguage: "tr-TR",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "TRY",
    description: "Reçete alerjen kontrolü ücretsiz.",
  },
  audience: {
    "@type": "BusinessAudience",
    audienceType: "Restoran, kafe, pastane ve merkezi mutfaklar",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="tr"
      className={`${geistSans.variable} ${geistMono.variable} ${fraunces.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-krem text-murekkep">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(YAPISAL_VERI) }}
        />
        {children}
      </body>
    </html>
  );
}
