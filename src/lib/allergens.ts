/**
 * Türk Gıda Kodeksi Gıda Etiketleme ve Tüketicileri Bilgilendirme Yönetmeliği
 * kapsamında bildirimi zorunlu alerjenler.
 *
 * KAYNAK DOĞRULAMASI GEREKLİ: Bu liste ikincil kaynaklardan derlendi.
 * Yayına çıkmadan önce Resmî Gazete'deki yönetmelik eki ile madde madde
 * karşılaştırılmalı.
 */

export type AllergenId =
  | "gluten"
  | "kabuklu-deniz"
  | "yumurta"
  | "balik"
  | "yer-fistigi"
  | "soya"
  | "sut"
  | "sert-kabuklu-yemis"
  | "kereviz"
  | "hardal"
  | "susam"
  | "sulfit"
  | "lupin"
  | "yumusakca"
  | "alkol"
  | "domuz";

export interface Allergen {
  id: AllergenId;
  ad: string;
  /** Yönetmelik ekindeki 14 zorunlu alerjenden mi, Türkiye'ye özel ek bildirim mi? */
  kapsam: "zorunlu-14" | "turkiye-ek";
  aciklama: string;
}

export const ALLERGENS: Record<AllergenId, Allergen> = {
  gluten: {
    id: "gluten",
    ad: "Glüten içeren tahıllar",
    kapsam: "zorunlu-14",
    aciklama: "Buğday, çavdar, arpa, yulaf, kılçıksız buğday, kamut ve melezleri.",
  },
  "kabuklu-deniz": {
    id: "kabuklu-deniz",
    ad: "Kabuklu deniz hayvanları",
    kapsam: "zorunlu-14",
    aciklama: "Karides, yengeç, ıstakoz gibi kabuklular ve bunlardan üretilenler.",
  },
  yumurta: {
    id: "yumurta",
    ad: "Yumurta",
    kapsam: "zorunlu-14",
    aciklama: "Yumurta ve yumurta ürünleri.",
  },
  balik: {
    id: "balik",
    ad: "Balık",
    kapsam: "zorunlu-14",
    aciklama: "Balık ve balık ürünleri.",
  },
  "yer-fistigi": {
    id: "yer-fistigi",
    ad: "Yer fıstığı",
    kapsam: "zorunlu-14",
    aciklama: "Yer fıstığı ve yer fıstığı ürünleri.",
  },
  soya: {
    id: "soya",
    ad: "Soya",
    kapsam: "zorunlu-14",
    aciklama: "Soya fasulyesi ve soya ürünleri.",
  },
  sut: {
    id: "sut",
    ad: "Süt",
    kapsam: "zorunlu-14",
    aciklama: "Süt ve süt ürünleri (laktoz dahil).",
  },
  "sert-kabuklu-yemis": {
    id: "sert-kabuklu-yemis",
    ad: "Sert kabuklu yemişler",
    kapsam: "zorunlu-14",
    aciklama: "Badem, fındık, ceviz, kaju, pekan, brezilya cevizi, antep fıstığı, makadamya.",
  },
  kereviz: {
    id: "kereviz",
    ad: "Kereviz",
    kapsam: "zorunlu-14",
    aciklama: "Kereviz ve kereviz ürünleri.",
  },
  hardal: {
    id: "hardal",
    ad: "Hardal",
    kapsam: "zorunlu-14",
    aciklama: "Hardal ve hardal ürünleri.",
  },
  susam: {
    id: "susam",
    ad: "Susam",
    kapsam: "zorunlu-14",
    aciklama: "Susam tohumu ve susam ürünleri.",
  },
  sulfit: {
    id: "sulfit",
    ad: "Kükürt dioksit ve sülfitler",
    kapsam: "zorunlu-14",
    aciklama: "10 mg/kg veya 10 mg/L üzeri SO2 cinsinden konsantrasyonlarda.",
  },
  lupin: {
    id: "lupin",
    ad: "Lupin",
    kapsam: "zorunlu-14",
    aciklama: "Lupin (acı bakla) ve lupin ürünleri.",
  },
  yumusakca: {
    id: "yumusakca",
    ad: "Yumuşakçalar",
    kapsam: "zorunlu-14",
    aciklama: "Midye, salyangoz, kalamar, ahtapot gibi yumuşakçalar.",
  },
  alkol: {
    id: "alkol",
    ad: "Alkol",
    kapsam: "turkiye-ek",
    aciklama: "Türkiye mevzuatına özel bildirim yükümlülüğü.",
  },
  domuz: {
    id: "domuz",
    ad: "Domuz kaynaklı bileşen",
    kapsam: "turkiye-ek",
    aciklama: "Türkiye mevzuatına özel bildirim yükümlülüğü.",
  },
};

export const ALLERGEN_LIST: Allergen[] = Object.values(ALLERGENS);
