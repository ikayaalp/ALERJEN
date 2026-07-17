import type { AllergenId } from "./allergens";

/**
 * Türkçe içerik adı -> alerjen eşlemesi.
 *
 * Kural: bir terim buraya ancak alerjeni KESİN ise girer. Şüphe varsa
 * AMBIGUOUS_TERMS'e girer ve kullanıcıya sorulur. Sessizce tahmin yürütmüyoruz —
 * kaçırılan bir alerjen sağlık riski, uydurulan bir alerjen ise güven kaybı.
 */
export interface IngredientRule {
  terim: string;
  alerjenler: AllergenId[];
  /**
   * Terim, alerjenin kendi adı mı? ("süt" evet, "laktoz" hayır — laktoz sütün
   * işaretçisi, kendisi değil.) Olumsuzluk yorumu buna bağlı: "glutensiz ekmek"
   * glüteni siler, ama "laktozsuz süt" sütü SİLMEZ — laktozsuz süt hâlâ süt
   * proteini içerir ve süt alerjisi olanlar için risklidir.
   */
  birincil?: true;
}

export const INGREDIENT_RULES: IngredientRule[] = [
  // --- Glüten içeren tahıllar ---
  { terim: "buğday", alerjenler: ["gluten"] },
  { terim: "buğday unu", alerjenler: ["gluten"] },
  { terim: "tam buğday unu", alerjenler: ["gluten"] },
  { terim: "buğday nişastası", alerjenler: ["gluten"] },
  { terim: "irmik", alerjenler: ["gluten"] },
  { terim: "bulgur", alerjenler: ["gluten"] },
  { terim: "kepek", alerjenler: ["gluten"] },
  { terim: "çavdar", alerjenler: ["gluten"] },
  { terim: "arpa", alerjenler: ["gluten"] },
  { terim: "yulaf", alerjenler: ["gluten"] },
  { terim: "yulaf ezmesi", alerjenler: ["gluten"] },
  { terim: "malt", alerjenler: ["gluten"] },
  { terim: "malt ekstraktı", alerjenler: ["gluten"] },
  { terim: "kuskus", alerjenler: ["gluten"] },
  { terim: "erişte", alerjenler: ["gluten"] },
  { terim: "şehriye", alerjenler: ["gluten"] },
  { terim: "makarna", alerjenler: ["gluten"] },
  { terim: "ekmek", alerjenler: ["gluten"] },
  { terim: "galeta unu", alerjenler: ["gluten"] },
  { terim: "yufka", alerjenler: ["gluten"] },
  { terim: "baklava yufkası", alerjenler: ["gluten"] },
  { terim: "kadayıf", alerjenler: ["gluten"] },
  { terim: "spelt", alerjenler: ["gluten"] },
  { terim: "kamut", alerjenler: ["gluten"] },
  { terim: "seitan", alerjenler: ["gluten"] },
  { terim: "glüten", alerjenler: ["gluten"], birincil: true },

  // --- Süt ---
  { terim: "süt", alerjenler: ["sut"], birincil: true },
  { terim: "süt tozu", alerjenler: ["sut"] },
  { terim: "yoğurt", alerjenler: ["sut"] },
  { terim: "ayran", alerjenler: ["sut"] },
  { terim: "kefir", alerjenler: ["sut"] },
  { terim: "peynir", alerjenler: ["sut"] },
  { terim: "beyaz peynir", alerjenler: ["sut"] },
  { terim: "kaşar", alerjenler: ["sut"] },
  { terim: "kaşar peyniri", alerjenler: ["sut"] },
  { terim: "labne", alerjenler: ["sut"] },
  { terim: "lor", alerjenler: ["sut"] },
  { terim: "mozzarella", alerjenler: ["sut"] },
  { terim: "parmesan", alerjenler: ["sut"] },
  { terim: "tereyağı", alerjenler: ["sut"] },
  { terim: "kaymak", alerjenler: ["sut"] },
  { terim: "krema", alerjenler: ["sut"] },
  { terim: "laktoz", alerjenler: ["sut"] },
  { terim: "kazein", alerjenler: ["sut"] },
  { terim: "kazeinat", alerjenler: ["sut"] },
  { terim: "peynir altı suyu", alerjenler: ["sut"] },
  { terim: "whey", alerjenler: ["sut"] },
  { terim: "muhallebi", alerjenler: ["sut"] },
  { terim: "dondurma", alerjenler: ["sut"] },

  // --- Yumurta ---
  { terim: "yumurta", alerjenler: ["yumurta"], birincil: true },
  { terim: "yumurta akı", alerjenler: ["yumurta"] },
  { terim: "yumurta sarısı", alerjenler: ["yumurta"] },
  { terim: "mayonez", alerjenler: ["yumurta"] },
  { terim: "albümin", alerjenler: ["yumurta"] },
  { terim: "beze", alerjenler: ["yumurta"] },
  { terim: "meringue", alerjenler: ["yumurta"] },

  // --- Susam ---
  { terim: "susam", alerjenler: ["susam"], birincil: true },
  { terim: "susam yağı", alerjenler: ["susam"] },
  { terim: "tahin", alerjenler: ["susam"] },
  { terim: "tahini", alerjenler: ["susam"] },
  { terim: "simit", alerjenler: ["susam", "gluten"] },

  // --- Yer fıstığı ---
  { terim: "yer fıstığı", alerjenler: ["yer-fistigi"], birincil: true },
  { terim: "amerikan fıstığı", alerjenler: ["yer-fistigi"] },
  { terim: "yer fıstığı yağı", alerjenler: ["yer-fistigi"] },

  // --- Sert kabuklu yemişler ---
  { terim: "badem", alerjenler: ["sert-kabuklu-yemis"] },
  { terim: "badem unu", alerjenler: ["sert-kabuklu-yemis"] },
  { terim: "fındık", alerjenler: ["sert-kabuklu-yemis"] },
  { terim: "ceviz", alerjenler: ["sert-kabuklu-yemis"] },
  { terim: "kaju", alerjenler: ["sert-kabuklu-yemis"] },
  { terim: "antep fıstığı", alerjenler: ["sert-kabuklu-yemis"] },
  { terim: "pekan", alerjenler: ["sert-kabuklu-yemis"] },
  { terim: "makadamya", alerjenler: ["sert-kabuklu-yemis"] },
  { terim: "brezilya cevizi", alerjenler: ["sert-kabuklu-yemis"] },
  { terim: "marzipan", alerjenler: ["sert-kabuklu-yemis"] },
  { terim: "praline", alerjenler: ["sert-kabuklu-yemis"] },

  // --- Soya ---
  { terim: "soya", alerjenler: ["soya"], birincil: true },
  { terim: "soya fasulyesi", alerjenler: ["soya"] },
  { terim: "soya sosu", alerjenler: ["soya", "gluten"] },
  { terim: "soya unu", alerjenler: ["soya"] },
  { terim: "soya lesitini", alerjenler: ["soya"] },
  { terim: "tofu", alerjenler: ["soya"] },
  { terim: "edamame", alerjenler: ["soya"] },
  { terim: "miso", alerjenler: ["soya"] },
  { terim: "tempeh", alerjenler: ["soya"] },

  // --- Balık ---
  { terim: "balık", alerjenler: ["balik"], birincil: true },
  { terim: "hamsi", alerjenler: ["balik"] },
  { terim: "somon", alerjenler: ["balik"] },
  { terim: "ton balığı", alerjenler: ["balik"] },
  { terim: "sardalya", alerjenler: ["balik"] },
  { terim: "levrek", alerjenler: ["balik"] },
  { terim: "çipura", alerjenler: ["balik"] },
  { terim: "uskumru", alerjenler: ["balik"] },
  { terim: "ançüez", alerjenler: ["balik"] },
  { terim: "balık sosu", alerjenler: ["balik"] },
  { terim: "havyar", alerjenler: ["balik"] },

  // --- Kabuklu deniz hayvanları ---
  { terim: "karides", alerjenler: ["kabuklu-deniz"] },
  { terim: "yengeç", alerjenler: ["kabuklu-deniz"] },
  { terim: "ıstakoz", alerjenler: ["kabuklu-deniz"] },
  { terim: "kerevit", alerjenler: ["kabuklu-deniz"] },
  { terim: "langust", alerjenler: ["kabuklu-deniz"] },

  // --- Yumuşakçalar ---
  { terim: "midye", alerjenler: ["yumusakca"] },
  { terim: "kalamar", alerjenler: ["yumusakca"] },
  { terim: "ahtapot", alerjenler: ["yumusakca"] },
  { terim: "salyangoz", alerjenler: ["yumusakca"] },
  { terim: "istiridye", alerjenler: ["yumusakca"] },
  { terim: "deniz tarağı", alerjenler: ["yumusakca"] },

  // --- Kereviz ---
  { terim: "kereviz", alerjenler: ["kereviz"], birincil: true },
  { terim: "kereviz kökü", alerjenler: ["kereviz"] },
  { terim: "kereviz sapı", alerjenler: ["kereviz"] },

  // --- Hardal ---
  { terim: "hardal", alerjenler: ["hardal"], birincil: true },
  { terim: "hardal tohumu", alerjenler: ["hardal"] },
  { terim: "dijon hardalı", alerjenler: ["hardal"] },

  // --- Sülfit ---
  { terim: "sülfit", alerjenler: ["sulfit"], birincil: true },
  { terim: "kükürt dioksit", alerjenler: ["sulfit"] },
  { terim: "sodyum metabisülfit", alerjenler: ["sulfit"] },
  { terim: "e220", alerjenler: ["sulfit"] },
  { terim: "e221", alerjenler: ["sulfit"] },
  { terim: "e222", alerjenler: ["sulfit"] },
  { terim: "e223", alerjenler: ["sulfit"] },
  { terim: "e224", alerjenler: ["sulfit"] },
  { terim: "e226", alerjenler: ["sulfit"] },
  { terim: "e227", alerjenler: ["sulfit"] },
  { terim: "e228", alerjenler: ["sulfit"] },

  // --- Lupin ---
  { terim: "lupin", alerjenler: ["lupin"], birincil: true },
  { terim: "acı bakla", alerjenler: ["lupin"] },
  { terim: "termiye", alerjenler: ["lupin"] },

  // --- Alkol (Türkiye'ye özel bildirim) ---
  { terim: "alkol", alerjenler: ["alkol"], birincil: true },
  { terim: "şarap", alerjenler: ["alkol", "sulfit"] },
  { terim: "beyaz şarap", alerjenler: ["alkol", "sulfit"] },
  { terim: "kırmızı şarap", alerjenler: ["alkol", "sulfit"] },
  { terim: "bira", alerjenler: ["alkol", "gluten"] },
  { terim: "votka", alerjenler: ["alkol"] },
  { terim: "rom", alerjenler: ["alkol"] },
  { terim: "likör", alerjenler: ["alkol"] },
  { terim: "konyak", alerjenler: ["alkol"] },
  { terim: "brendi", alerjenler: ["alkol"] },
  { terim: "viski", alerjenler: ["alkol", "gluten"] },
  { terim: "rakı", alerjenler: ["alkol"] },
  { terim: "vermut", alerjenler: ["alkol", "sulfit"] },
  { terim: "etanol", alerjenler: ["alkol"] },

  // --- Domuz (Türkiye'ye özel bildirim) ---
  { terim: "domuz", alerjenler: ["domuz"], birincil: true },
  { terim: "domuz eti", alerjenler: ["domuz"] },
  { terim: "jambon", alerjenler: ["domuz"] },
  { terim: "bacon", alerjenler: ["domuz"] },
  { terim: "pepperoni", alerjenler: ["domuz"] },
  { terim: "domuz yağı", alerjenler: ["domuz"] },
];

/**
 * Tek başına alerjeni belirlenemeyen terimler. Bunlar tespit edilir ama
 * "karar veremedim, sen söyle" diye kullanıcıya sorulur — asla varsayılan
 * bir alerjene atanmaz.
 */
export interface AmbiguousTerm {
  terim: string;
  olasiAlerjenler: AllergenId[];
  soru: string;
}

export const AMBIGUOUS_TERMS: AmbiguousTerm[] = [
  {
    terim: "fıstık",
    olasiAlerjenler: ["yer-fistigi", "sert-kabuklu-yemis"],
    soru: "Yer fıstığı mı, antep fıstığı mı? İkisi ayrı alerjen grubu.",
  },
  {
    terim: "fıstık ezmesi",
    olasiAlerjenler: ["yer-fistigi", "sert-kabuklu-yemis"],
    soru: "Yer fıstığından mı, antep fıstığından mı yapılmış?",
  },
  {
    terim: "jelatin",
    olasiAlerjenler: ["domuz"],
    soru: "Kaynağı domuz mu, sığır mı, balık mı? Domuz ve balık ise bildirim gerekir.",
  },
  {
    terim: "nişasta",
    olasiAlerjenler: ["gluten"],
    soru: "Buğday nişastası mı, mısır/patates nişastası mı? Buğday ise glüten bildirimi gerekir.",
  },
  {
    terim: "lesitin",
    olasiAlerjenler: ["soya", "yumurta"],
    soru: "Soya lesitini mi, ayçiçek lesitini mi, yumurta lesitini mi?",
  },
  {
    terim: "un",
    olasiAlerjenler: ["gluten"],
    soru: "Hangi un? Buğday/çavdar/arpa/yulaf ise glüten bildirimi gerekir.",
  },
  {
    terim: "margarin",
    olasiAlerjenler: ["sut", "soya"],
    soru: "Süt yağı veya soya yağı içeriyor mu? Etiketini kontrol edin.",
  },
  {
    terim: "sirke",
    olasiAlerjenler: ["sulfit"],
    soru: "Şarap sirkesi mi? Sülfit içerebilir.",
  },
  {
    terim: "kuru kayısı",
    olasiAlerjenler: ["sulfit"],
    soru: "Kükürtlenmiş mi? 10 mg/kg üzeri SO2 varsa sülfit bildirimi gerekir.",
  },
  {
    terim: "kuru üzüm",
    olasiAlerjenler: ["sulfit"],
    soru: "Kükürtlenmiş mi? 10 mg/kg üzeri SO2 varsa sülfit bildirimi gerekir.",
  },
  {
    terim: "bitkisel yağ",
    olasiAlerjenler: ["soya", "yer-fistigi", "susam"],
    soru: "Hangi bitkiden? Soya, yer fıstığı veya susam yağı ise bildirim gerekir.",
  },
  {
    terim: "aroma",
    olasiAlerjenler: [],
    soru: "Aroma bileşiminde alerjen taşıyıcı olabilir. Tedarikçi spesifikasyonunu kontrol edin.",
  },
  {
    terim: "kıvam artırıcı",
    olasiAlerjenler: [],
    soru: "Bileşimini tedarikçi spesifikasyonundan doğrulayın.",
  },
];
