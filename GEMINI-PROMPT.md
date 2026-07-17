# Proje Prompt'u — Alerjen Kontrol

## Rolün ve amaç

Kıdemli bir full-stack geliştiricisin. Türkiye'deki restoran, kafe, pastane ve
merkezi mutfaklar için bir **gıda alerjeni uyum aracı** geliştireceksin.

İşletme reçetesini (metin olarak yazarak veya fotoğrafını yükleyerek) girer;
sistem **Türk Gıda Kodeksi Gıda Etiketleme ve Tüketicileri Bilgilendirme
Yönetmeliği** kapsamında bildirimi zorunlu alerjenleri tespit eder ve
denetimde savunulabilir bir rapor üretir.

## Mevzuat bağlamı

Tarım ve Orman Bakanlığı düzenlemesi menülerde alerjen, kalori ve özel bileşen
bilgisini zorunlu kıldı. Kademeli yürürlük takvimi:

| Tarih | Kapsam |
|---|---|
| 1 Temmuz 2026 | Ulusal zincir restoranlar — alerjen bildirimi |
| 31 Aralık 2026 | Aynı ilde 3+ şubeli yerel zincirler — alerjen bildirimi |
| 31 Aralık 2027 | Yerel zincirler — kalori beyanı |

Bildirim afiş, yazı tahtası, menü veya **karekod (QR)** ile yapılabilir; QR
yönetmelikte geçerli yöntem olarak kabul ediliyor.

**Önemli:** Bu tarihler ve kapsamlar ikincil kaynaklardan derlendi. Yayına
çıkmadan önce Resmî Gazete'deki asıl yönetmelik metniyle madde madde
doğrulanmalı. Kodda ve arayüzde bu doğrulama ihtiyacını belirten not bulunmalı.

---

## EN ÖNEMLİ BÖLÜM: Güvenlik ilkeleri

Bu bir sağlık ve hukuki sorumluluk aracı. Kaçırılan bir alerjen birinin
anafilaksi geçirmesi ve işletmenin ceza yemesi demek. Aşağıdaki kurallar
tasarım tercihi değil, zorunluluktur:

1. **Sessiz kayıp yasak.** Bilinmeyen içerik "temiz" sayılamaz. Sözlükte
   karşılığı olmayan her satır "tanınmadı — elle kontrol edilmeli" olarak
   raporlanır ve rapor "tamamlanmadı" durumuna düşer.

2. **Tahmin yok, soru var.** Alerjeni belirsiz terimler asla varsayılan bir
   alerjene atanmaz; kullanıcıya net bir soru sorulur. Örnekler:
   - `fıstık` → yer fıstığı mı, antep fıstığı mı? (İkisi **ayrı** alerjen grubu.)
   - `jelatin` → domuz mu, sığır mı, balık mı?
   - `nişasta` → buğday mı, mısır/patates mi?
   - `lesitin` → soya mı, ayçiçek mi, yumurta mı?
   - `un` → hangi tahıl?
   - `margarin` → süt yağı / soya içeriyor mu?
   - `kuru kayısı`, `kuru üzüm` → kükürtlenmiş mi? (sülfit)
   - `bitkisel yağ` → soya / yer fıstığı / susam mı?

3. **Araç onay belgesi değildir.** Arayüz hiçbir yerde "bu reçete temizdir,
   onaylandı" demez. Dili şudur: "tespit edilenler bunlar, sorumluluk
   işletmede". Bu uyarı sonradan eklenen bir dipnot değil, ürünün diline
   baştan işlenmeli. Araç tedarikçi bileşimlerini, üretim hattı çapraz
   bulaşmasını ve etiket dışı içerikleri **göremez**; bunu açıkça söyler.

4. **Her bulgunun kaynağı görünür.** Her alerjen için "reçetenin hangi
   satırından, hangi kelimeden geldiği" gösterilir. Kara kutu olmayacak;
   denetimde "neden bu çıktı?" sorusunun cevabı hazır olacak.

---

## Alerjen veri modeli

### Yönetmelik kapsamındaki 14 zorunlu alerjen

1. Glüten içeren tahıllar (buğday, çavdar, arpa, yulaf, kılçıksız buğday, kamut)
2. Kabuklu deniz hayvanları (karides, yengeç, ıstakoz)
3. Yumurta
4. Balık
5. Yer fıstığı
6. Soya
7. Süt (laktoz dahil)
8. Sert kabuklu yemişler (badem, fındık, ceviz, kaju, pekan, brezilya cevizi,
   antep fıstığı, makadamya)
9. Kereviz
10. Hardal
11. Susam
12. Kükürt dioksit ve sülfitler (10 mg/kg veya 10 mg/L üzeri SO2)
13. Lupin (acı bakla)
14. Yumuşakçalar (midye, salyangoz, kalamar, ahtapot)

### Türkiye'ye özel ek bildirimler

15. **Alkol**
16. **Domuz kaynaklı bileşen**

Bu ikisi arayüzde "Türkiye'ye özel" rozetiyle ayrı işaretlenmeli.

---

## Tespit motoru — davranış şartnamesi

Motor **deterministik ve kural tabanlı** olacak. Ana otorite, elle kürelenmiş
bir **Türkçe içerik → alerjen sözlüğü**. LLM yalnızca bilinmeyen içerikler için
*öneri* üretebilir ve bu öneriler daima "doğrulanmadı" işaretiyle sunulur —
asla sessizce rapora girmez. Gerekçe: denetimde izlenebilirlik ve LLM'in
alerjen kaçırma/uydurma riski.

### 1. Türkçe normalizasyon

Eşleme öncesi metin küçük harfe çevrilir ve aksanlar düşürülür, böylece
kullanıcı `süt` de yazsa `SUT` da yazsa tutar:

```
ı, î, İ → i    ş → s    ğ → g    ü, û → u    ö → o    ç → c    â → a
```

Küçük harfe çevirirken Türkçe yerel ayar kullanılmalı (`toLocaleLowerCase("tr")`),
çünkü `İ` karakteri varsayılan `toLowerCase()` ile bozuluyor.

### 2. Kelime sınırı ve Türkçe ekler

Türkçe sondan eklemeli. `sütlü çikolata` → süt, `buğdaydan yapılmış` → glüten
tutmalı. Yani terimin **ardındaki ekler kabul edilir**, ama ek ayrı yakalanır —
olumsuzluk tespiti buna bağlı. Terimin **önü** kelime sınırında olmalı.

### 3. Olumsuzluk (KRİTİK — buradaki incelik hayati)

`-siz / -sız / -suz / -süz` ekleri ve `içermez`, `içermiyor`, `yoktur`,
`kullanılmamıştır`, `free` kalıpları olumsuzluk bildirir.

Ama olumsuzluk **satır bazlı** yorumlanmalı, terim bazlı değil. Kurallar:

Her terim, o alerjenin **kendi adı mı** (`birincil`) yoksa sadece bir
**işaretçisi mi** olduğuna göre etiketlenir:
- `süt` → sütün kendi adı → **birincil**
- `laktoz` → sütün işaretçisi → **birincil değil**
- `glüten` → birincil / `ekmek` → birincil değil
- `susam` → birincil / `simit` → birincil değil

Bir olumsuzluk, alerjeni ancak şu durumda siler:
> Olumsuzlanan terim o alerjen için **birincil** ise, **VEYA** satırda o
> alerjeni bildiren başka olumlu terim yoksa.

Bu kuralın üretmesi gereken sonuçlar — testle sabitlenmeli:

| Girdi | Beklenen | Neden |
|---|---|---|
| `glutensiz ekmek` | glüten **YOK** | `glüten` birincil, `ekmek`ten gelen çıkarımı ezer |
| `susamsız simit` | susam YOK, **glüten VAR** | Sadece susam olumsuzlanmış; simit hâlâ glütenli |
| **`laktozsuz süt`** | **süt VAR** | **Laktozsuz sütte laktoz yok ama SÜT PROTEİNİ var. Süt alerjisi olan biri için risklidir. Bildirim asla düşürülemez.** |
| `alkolsüz bira` | alkol YOK | `alkol` birincil |
| `fındıksız kek` | yemiş YOK | Yemişin tek kaynağı olumsuzlanmış |
| `fındıksız ama bademli kek` | yemiş **VAR** | Badem hâlâ yemiş bildiriyor |

`laktozsuz süt` satırı bu şartnamenin en kritik maddesi. Naif bir uygulama
burada alerjeni düşürür ve bu **tehlikelidir**.

### 4. Çakışan terim elemesi (KRİTİK)

Terimler **uzundan kısaya** denenir ve eşleşen karakter aralıkları
işaretlenir. Daha önce işaretlenmiş bir aralığın üstüne binen kısa terim
**elenir**. Yalnızca sıralama yetmez — aralık takibi şart.

Bu olmazsa şu iki hata oluşur (ikisi de gerçekten yaşandı):
- `500 g buğday unu` hem `buğday unu` hem `buğday` olarak eşleşir, rapor aynı
  satırı iki kez gösterir.
- Aynı satır belirsiz `un` terimine de takılır ve sistem `buğday unu` yazan
  satıra **"hangi un?"** diye sorar. Bu, aracı aptal gösterir ve asıl
  belirsizlikleri gürültüye boğar.

Beklenen sonuçlar:
- `500 g buğday unu` → glüten, tek kaynak (`buğday unu`), **belirsiz madde yok**
- `50 g yer fıstığı` → yer fıstığı; belirsiz `fıstık` olarak **işaretlenmez**
- `buğday unu ve nişasta` → glüten (kesin) + `nişasta` (belirsiz, ayrı durduğu için)

### 5. Çıktı yapısı

Motor dört ayrı liste döndürür:
- `tespitEdilen` — kesin eşleşen alerjenler, her biri kaynak satır + eşleşen terimle
- `belirsiz` — netleştirilmesi gereken terimler, sorusu ve olası alerjenleriyle
- `beyanEdilenYok` — açıkça yokluk beyan edilen alerjenler (`glutensiz` gibi)
- `taninmayan` — sözlükte karşılığı olmayan satırlar

`belirsiz` veya `taninmayan` doluysa rapor **"tamamlanmadı"** sayılır.

### 6. Reçete ayrıştırma

Satır başına bir içerik. Boş satırlar atlanır, `#` ile başlayanlar not sayılır.

---

## Teknoloji

- **Next.js (App Router) + TypeScript + Tailwind CSS**
- Test: **Vitest**. Yukarıdaki tablolardaki her satır test edilmeli.
- Tespit motoru saf TypeScript, UI'dan bağımsız, `src/lib/` altında.
- Türkçe alan terminolojisi kodda korunur (`alerjenTespitEt`, `belirsiz`,
  `taninmayan` gibi) — ekip Türkçe konuşuyor.

Önerilen dosya yapısı:

```
src/
  lib/
    allergens.ts        # 14 + 2 alerjen tanımı
    ingredient-map.ts   # Türkçe içerik → alerjen sözlüğü + belirsiz terimler
    detect.ts           # normalizasyon, eşleme, olumsuzluk, çakışma elemesi
    detect.test.ts
  components/
    site-header.tsx
  app/
    page.tsx            # landing
    kontrol/page.tsx    # araç
    giris/page.tsx
```

---

## Sayfalar

### `/` — Landing page

- Yapışkan header: logo, menü (Özellikler / Mevzuat takvimi / Fiyatlandırma),
  "Giriş yap" ve "Ücretsiz dene" düğmeleri
- Hero: büyük serif başlık, "1 Temmuz 2026 yürürlükte" rozeti, yanında gerçek
  rapor görünümünün statik örneği
- Özellik kartları: satır satır kaynak, tahmin yok/soru var, Türkiye'ye özel
  bildirimler, olumsuzluk anlayışı, fotoğraftan reçete, QR menü çıktısı
- Mevzuat takvimi: yukarıdaki üç tarih, yürürlükte olan işaretli, altında
  "Resmî Gazete'den teyit edin" notu
- Fiyatlandırma: 3 plan (ücretsiz / işletme / zincir özel)
- Kapanış CTA + sorumluluk notlu footer

### `/kontrol` — Araç

İki sütun: solda yapışkan reçete girişi (textarea + "Örnek yükle"), sağda
canlı rapor. Rapor bölümleri: durum bandı (tamamlandı/tamamlanmadı), tespit
edilen alerjenler, netleştirilmesi gerekenler, tanınmayan içerikler, yokluk
beyanları. Girdi değiştikçe anlık güncellenir.

### `/giris` — Giriş

E-posta + şifre formu.

---

## Tasarım dili

Premium menü siteleri havası. Sıcak ve sakin:

- Palet: `stone` nötrleri (arka plan `stone-50`, metin `stone-900`), vurgu
  `amber-600/700`, alerjen uyarıları `red`, olumlu durum `emerald`
- Tipografi: başlıklar **serif** (Instrument Serif gibi), gövde sans (Geist),
  reçete satırları **monospace**
- Google Font kullanılıyorsa `latin-ext` alt kümesi **şart** — onsuz Türkçe
  karakterler (ğ, ş, ı) eksik kalır
- Yumuşak köşeler (`rounded-2xl`), ince kenarlıklar, hafif gölge, bol boşluk
- **Açık temada sabit.** Koyu tema kurmayın: alerjen uyarılarının kırmızı/amber
  renk kodlaması koyu zeminde güvenilir okunmuyor. Next.js şablonundaki
  `prefers-color-scheme: dark` bloğu **kaldırılmalı**, yoksa koyu zemin +
  koyu yazı çıkar ve sayfa okunmaz olur.
- Mobil uyumlu; iki sütun dar ekranda tek sütuna iner

---

## Yapılacaklar (öncelik sırasıyla)

### 1. Open Food Facts entegrasyonu
Açık kaynak, AB merkezli, **API anahtarı gerektirmez**. Alerjen etiketleri
AB'nin 14 alerjen listesine göre; Türk Gıda Kodeksi'yle neredeyse birebir
örtüşüyor. Türk ürünleri mevcut.

**Ama kullanıcı katkılı bir veritabanı** — yanlış ve eksik kayıt bolca var.
Tek doğru kaynak sayılamaz. Rolü: tanınmayan içerikler için **öneri** üretmek.
Gelen her öneri "OFF'tan geldi, doğrulanmadı" etiketiyle sunulur ve kullanıcı
onaylamadan rapora **girmez**. Kürelenmiş sözlük otorite olmaya devam eder.

> USDA FoodData Central alerjen için **kullanılmamalı**: Amerikan veritabanı,
> içerikler İngilizce, `tahin`/`kaşar`/`irmik`/`yufka` gibi Türk mutfağı
> terimleri eşleşmiyor, alerjen verisi zayıf. USDA'nın yeri kalori/besin
> değeri hesabı (aşağıda).

### 2. Sözlüğü büyütmek
Ürünün asıl değeri burada. Gerçek mutfak diline göre genişletilmeli; OFF
verisinden yarı otomatik büyütülebilir ama her giriş insan onayından geçmeli.

### 3. Fotoğraftan reçete (OCR)
`tesseract.js` ile başlanmalı — Tesseract'ın WASM portu, Node'da çalışır,
Türkçe dil paketi (`tur`) var, ücretsiz, **tek stack** (Python servisi
gerekmez, Vercel'e deploy edilebilir).

Sınırı bilerek: Tesseract basılı/taranmış metinde iyi, **el yazısında
kullanılamaz**. El yazısı reçeteler hedefse görsel model (Claude API vb.)
gerekir; bu karar gerçek fotoğraflarla ölçülerek verilmeli, peşinen değil.

**Hangi OCR olursa olsun zorunlu kural:** çıkan metin doğrudan analize
sokulmaz. OCR `süt` yerine `sut`, `fındık` yerine `fındtk` okur; motor tanımaz
ve **alerjen sessizce kaybolur**. Önce kullanıcıya düzenlenebilir şekilde
gösterilip onaylatılır, analiz ondan sonra çalışır.

### 4. Kalori / besin değeri
Mevzuatın diğer yarısı (31 Aralık 2027). USDA FoodData Central verisi burada
uygun (ücretsiz API anahtarı alınıyor). Porsiyon bazlı hesap gerekir.

### 5. Hesap sistemi
Ücretli özelliklerin (arşiv, PDF, sürüm geçmişi) ön koşulu. Veritabanı +
oturum yönetimi gerekir.

### 6. Ödeme
Türkiye'de kart tahsilatı için **iyzico** veya **PayTR** gibi bir sağlayıcıyla
sözleşme gerekiyor; Stripe Türkiye'de doğrudan tahsilat yapmıyor. Sağlayıcı
hesabı açılana kadar fiyat kartlarında durum açıkça belirtilmeli.

### 7. QR menü çıktısı
Onaylanan raporlardan yönetmeliğin kabul ettiği karekodlu alerjen menüsü.

---

## Test şartı

Aşağıdakiler test olarak yazılmalı ve geçmeli:

```
normalize("SÜT") === "sut"
normalize("Antep Fıstığı") === "antep fistigi"

"200 ml süt"                → [süt]
"sütlü çikolata"            → [süt]
"2 kaşık soya sosu"         → [soya, glüten]
"glutensiz ekmek"           → []
"susamsız simit"            → [glüten]        (susam yok)
"laktozsuz süt"             → [süt]           ← KRİTİK
"alkolsüz bira"             → alkol yok
"fındıksız kek"             → yemiş yok
"fındıksız ama bademli kek" → [yemiş]
"500 g buğday unu"          → [glüten], tek kaynak, belirsiz madde YOK
"50 g yer fıstığı"          → [yer fıstığı], belirsiz madde YOK
"100 g fıstık"              → tespit yok, belirsiz: fıstık
"20 g nişasta"              → tespit yok, belirsiz: nişasta
"20 g buğday nişastası"     → [glüten] (belirsiz değil)
"100 g zerdeçal"            → tanınmayan
```

## Son not

Kodu yazdıktan sonra **gerçekten tarayıcıda çalıştırıp deneyin.** Bu projede
iki hata (çakışan terim tekrarı ve `buğday unu`na "hangi un?" sorması) tüm
testler yeşilken sadece arayüzde görülerek yakalandı. Testler geçiyor olması
doğru çalıştığı anlamına gelmiyor.
