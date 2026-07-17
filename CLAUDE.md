# CLAUDE.md

Bu dosya, bu depoda çalışacak her AI ajanı için (Claude Code, Gemini 3.1 Pro
veya başka biri) ortak brief'tir. Çalışma modeli: mimarlık/planlama Claude
Code'da yapılıyor, uygulama (kod yazımı) başka bir modele (örn. Gemini 3.1
Pro) devredilebiliyor. Bu dosya ikisi arasındaki sözleşmedir — aşağıdaki
kurallar tekrar keşfedilmesin diye burada.

İki destek dosyası daha var, ikisi de hâlâ geçerli ama farklı rol taşıyor:
- **GEMINI-PROMPT.md** — ürünün orijinal Türkçe ürün/hukuk şartnamesi. Mevzuat
  takvimi, güvenlik ilkeleri, tespit motoru davranış şartnamesi ve test
  tablosu için **otorite kaynak** budur. Tek istisna: "Tasarım dili" bölümü
  **güncel değil** (bkz. aşağıdaki Tasarım Sistemi bölümü) — kodda uygulanan
  palet farklı, ona göre değil buradaki bilgiye göre hareket edin.
- **AGENTS.md** — tek satırlık ama kritik bir uyarı taşıyor, aşağıda tekrar
  ediliyor çünkü `@AGENTS.md` import sözdizimi yalnızca Claude Code tarafından
  otomatik çözülüyor; Gemini gibi başka bir ajan bu dosyayı kendiliğinden
  yüklemez.

## KRİTİK: Next.js sürüm uyarısı

Proje **Next.js 16.2.10** kullanıyor. Bu, çoğu modelin eğitim verisindeki
Next.js'ten farklı — API'ler, konvansiyonlar ve dosya yapısı değişmiş olabilir.
App Router'a, config'e veya veri getirme (`fetch`, sayfa/route dosyaları)
API'lerine dokunmadan önce `node_modules/next/dist/docs/` altındaki ilgili
rehberi okuyun. Deprecation notlarına uyun. Eğitim verinizdeki alışkanlıklarla
kod yazıp derleme hatası almak yerine önce doğrulayın.

## Komutlar

```bash
npm run dev      # geliştirme sunucusu
npm run build    # prod build
npm run start    # prod sunucu
npm run lint     # eslint (eslint-config-next core-web-vitals + typescript)
```

**Test:** `vitest` bağımlılığı var ve `src/lib/detect.test.ts` mevcut ama
`package.json`'da `test` script'i **tanımlı değil**. Doğrudan çalıştırın:

```bash
npx vitest run                    # tüm testler, tek seferlik
npx vitest run src/lib/detect.test.ts   # tek dosya
npx vitest                        # watch modu
```

Tespit motorunda (`src/lib/detect.ts`, `ingredient-map.ts`, `meat.ts`)
değişiklik yapan her PR bu testleri geçmeli ve GEMINI-PROMPT.md'deki test
tablosuna yeni satırlar eklemeli.

## Mimari

### Tespit motoru (`src/lib/`) — saf TypeScript, UI'dan bağımsız

İki paralel, birbirinden bağımsız çalışan tarama var, ikisi de
`alerjenTespitEt()` içinde (`detect.ts`) tetikleniyor:

1. **Alerjen taraması** — `allergens.ts` (16 alerjen: 14 zorunlu + 2 Türkiye'ye
   özel: alkol, domuz) ve `ingredient-map.ts` (Türkçe içerik → alerjen
   sözlüğü + `AMBIGUOUS_TERMS`) üzerinden çalışır.
2. **Et kökeni taraması** — `meat.ts` (5 köken: dana, kuzu, kanatlı, domuz, av)
   üzerinden çalışır, kendi aralık takibini tutar. Alerjenlerden ayrı çünkü
   hukuki dayanağı farklı (mevzuat menşei bildirimini ayrıca istiyor).

Pipeline sırası (`detect.ts` içinde): `normalize()` (Türkçe küçük harf +
aksan sadeleştirme) → en uzun terimden kısaya doğru eşleme + **aralık
takibiyle çakışma eleme** → satır bazlı olumsuzluk çözümü (`birincil` vs.
"işaretçi" ayrımı) → belirsiz terimler işaretlenir → hiçbir kural eşleşmeyen
satır `taninmayan`'a düşer (et taramasının tanıdığı satırlar hariç).

**Bu motora dokunmadan önce GEMINI-PROMPT.md'nin "Tespit motoru — davranış
şartnamesi" bölümünü okuyun.** Özellikle:
- Sessiz kayıp yasak: bilinmeyen/belirsiz içerik asla "temiz" sayılmaz.
- Tahmin yok: alerjeni belirsiz terim varsayılan alerjene atanmaz, sorulur.
- Olumsuzluk **satır bazlı**, terim bazlı değil (`laktozsuz süt` → süt HÂLÂ
  var — bu şartnamenin en kritik test vakası, `detect.test.ts` içinde de var).
- Her bulgu kaynağını (satır + eşleşen terim) taşır, kara kutu yok.

Kodu değiştirdikten sonra sadece testlere güvenmeyin — GEMINI-PROMPT.md'nin
sonunda not edildiği gibi, geçmişte tüm testler yeşilken sadece tarayıcıda
görülen iki regresyon oldu (çakışan terim tekrarı, `buğday unu`na yanlış soru
sorulması).

### Uygulama katmanı

- **Next.js App Router + TypeScript + Tailwind CSS 4**, Türkçe içerik
  (`lang="tr"`).
- **Supabase** — `src/lib/supabase/{client,server,middleware}.ts` üç ayrı
  istemci (browser/server/middleware). `middleware.ts` + bu middleware
  client'ı `/kontrol`'ü oturumsuz erişime kapatıyor.
- **Kimlik doğrulama** — Server Actions, `src/app/actions/auth.ts`
  (`girisYap`, `kayitOl`, `sifremiUnuttum`, `sifreSifirla`, `cikisYap`).
  Sayfalar: `/giris`, `/kayit`, `/sifremi-unuttum`, `/sifre-sifirla`.
- **Kredi sistemi** — kayıt olan kullanıcıya 3 kredi bonusu (DB trigger),
  her analiz 1 kredi düşürüyor. Şema ve mantık `supabase/migrations/0000_init.sql`
  içinde: `profiller`, `kredi_bakiyeleri`, `kredi_islemleri` tabloları +
  `kredi_dustur()` RPC (atomik düşüm, `SECURITY DEFINER`). API route
  (`src/app/api/analiz/route.ts`) sırayla: oturum doğrula → `kredi_dustur`
  RPC'sini çağır (kredi yoksa 402 döner) → ancak ondan sonra
  `alerjenTespitEt()` çalıştırır. **Kredi düşümü ve analiz her zaman bu
  sırada olmalı** — analiz önce çalışıp kredi sonra düşülürse kullanıcı
  bakiyesi negatife düşmeden ücretsiz analiz çekebilir.
- **Sayfalar**: `/` (landing), `/kontrol` (araç — iki sütun: reçete girişi +
  canlı rapor), kimlik doğrulama sayfaları yukarıda.

### Tasarım sistemi

Tüm renk token'ları `src/app/globals.css` içinde `@theme inline` altında,
**Türkçe adlarla**: `krem`/`kum`/`kagit`/`murekkep` (nötrler), `biber`/
`biber-acik` (marka — **çam yeşili**, kod adı tarihsel nedenle "biber" ama
değeri yeşil), `zeytin`/`zeytin-acik` (ikincil metin), `safran`/`safran-acik`
(altın vurgu), `uyari`/`uyari-acik` (alerjen uyarısı — kiremit kırmızısı).

**GEMINI-PROMPT.md'nin "Tasarım dili" bölümü (stone/amber paleti) artık
geçerli değil** — gerçek uygulanan palet yukarıdaki yeşil/altın kombinasyonu.
Yeni UI yazarken `globals.css`'teki token'ları kullanın, GEMINI-PROMPT.md'deki
renk isimlerini değil.

Diğer sabitler hâlâ geçerli: serif `font-display` (Fraunces) başlıklarda, Geist
gövdede, mono reçete satırlarında; `latin-ext` alt kümesi şart (Türkçe
karakterler için); sadece açık tema — koyu tema **bilerek** kaldırıldı, çünkü
alerjen uyarı renk kodlaması koyu zeminde güvenilir okunmuyor.

### Türkçe kod konvansiyonu

Domain katmanındaki tanımlayıcılar, tipler ve yorumlar Türkçe:
`alerjenTespitEt`, `belirsiz`, `taninmayan`, `beyanEdilenYok`, `kullanici_id`,
`kredi_dustur`, vb. Yeni kod bu konvansiyona uymalı — İngilizceleştirmeyin.

## Bilinen boşluklar / yarım kalmış uçlar

- `kayitOl()` (`src/app/actions/auth.ts:37`) e-posta onayını
  `${SITE_URL}/api/auth/callback`'e yönlendiriyor ama bu route **mevcut
  değil** (`src/app/api/` altında sadece `analiz/route.ts` var). Yeni kayıt
  olan kullanıcı onay linkine tıklayınca 404 alır — bir sonraki auth işine
  bu route'u eklemek dahil edilmeli.
- Giriş/kayıt sayfalarındaki "Google ile giriş/kayıt" butonları işlevsiz stub
  (`alert("Yakında...")`).
- `/kontrol` sayfasındaki "Kredi Yükle" butonu da stub; ödeme sağlayıcı
  bağlanmadı (bkz. yol haritası madde 6).
- `next.config.ts` neredeyse boş (varsayılan) — henüz proje-özel config yok.

## Yol haritası (GEMINI-PROMPT.md'den, öncelik sırasıyla — durum güncellendi)

1. **Open Food Facts entegrasyonu** — başlanmadı. Kural: tanınmayan içerikler
   için yalnızca *öneri* üretir, "doğrulanmadı" etiketiyle gelir, kullanıcı
   onaylamadan rapora girmez.
2. **Sözlüğü büyütmek** (`ingredient-map.ts`) — sürekli devam eden asıl değer
   alanı; her yeni terim insan onayından geçmeli.
3. **Fotoğraftan reçete (OCR)** — başlanmadı. Önerilen: `tesseract.js` (`tur`
   dil paketi, tek stack, Vercel'e deploy edilebilir). OCR çıktısı **asla**
   doğrudan `alerjenTespitEt()`'e verilmez — önce kullanıcıya düzenlenebilir
   gösterilip onaylatılır.
4. **Kalori/besin değeri** — başlanmadı. USDA FoodData Central (alerjen için
   değil, sadece kalori/besin değeri için uygun — bkz. GEMINI-PROMPT.md'deki
   gerekçe). Mevzuatın ikinci ayağı, tarih 31 Aralık 2027.
5. **Hesap sistemi** — **tamamlandı** (Supabase auth + kredi defteri
   yukarıdaki gibi kuruldu; orijinal roadmap sırasının önüne geçti).
6. **Ödeme** — başlanmadı. Türkiye'de kart tahsilatı için **iyzico** veya
   **PayTR** gerekiyor — Stripe Türkiye'de doğrudan TL tahsilatı yapmıyor.
7. **QR menü çıktısı** — başlanmadı.

## Mevzuat bağlamı (kısa)

Türk Gıda Kodeksi kademeli yürürlük: 1 Temmuz 2026 (ulusal zincirler — bugünün
tarihi bu eşiği geçti, `page.tsx`'teki "Yürürlükte" rozeti bu yüzden doğru),
31 Aralık 2026 (yerel 3+ şubeli zincirler), 31 Aralık 2027 (kalori beyanı).
Bu tarihler ikincil kaynaklardan derlendi — Resmî Gazete'yle doğrulanmadan
yayına çıkılmamalı; UI'da bu uyarı zaten var, kaldırılmamalı.
