import { ALLERGENS, type AllergenId } from "./allergens";
import { AMBIGUOUS_TERMS, INGREDIENT_RULES } from "./ingredient-map";
import {
  ET_BELIRSIZ_TERIMLER,
  ET_KOKENLERI,
  ET_KURALLARI,
  type EtKokeniId,
} from "./meat";

/**
 * Türkçe metni eşleme için sadeleştirir: küçük harfe çevirir ve aksanları
 * düşürür. Böylece "Süt", "süt", "SUT" ve "sut" aynı terime denk gelir.
 */
export function normalize(text: string): string {
  return text
    .toLocaleLowerCase("tr")
    .replace(/[ıîi̇]/g, "i")
    .replace(/[şs]/g, "s")
    .replace(/ğ/g, "g")
    .replace(/[üû]/g, "u")
    .replace(/ö/g, "o")
    .replace(/ç/g, "c")
    .replace(/â/g, "a")
    .replace(/\s+/g, " ")
    .trim();
}

/** Olumsuzluk ekleri: "susamsız", "glutensiz", "sütsüz", "tuzsuz" */
const OLUMSUZLUK_EKLERI = ["siz", "suz"];

/** Satır genelinde olumsuzluk bildiren kalıplar */
const OLUMSUZLUK_KALIPLARI = [
  "icermez",
  "icermiyor",
  "yoktur",
  "kullanilmamistir",
  "kullanilmaz",
  "free",
];

interface TerimEslesmesi {
  /** Eşleşmenin satırdaki başlangıcı */
  bas: number;
  /** Eşleşmenin bitişi (ek dahil) */
  son: number;
  /** Terimin hemen ardından gelen ek ("susamsız" -> "siz") */
  ek: string;
}

/**
 * Terimin satırdaki tüm geçişlerini kelime sınırlarına saygılı biçimde bulur.
 * Türkçe sondan eklemeli olduğu için terimin ardındaki ekleri kabul eder ama
 * ayrı döndürür — olumsuzluk eki tespiti buna bağlı.
 */
function terimBul(normalSatir: string, normalTerim: string): TerimEslesmesi[] {
  const eslesmeler: TerimEslesmesi[] = [];
  let aramaIndex = 0;

  while (aramaIndex <= normalSatir.length) {
    const index = normalSatir.indexOf(normalTerim, aramaIndex);
    if (index === -1) break;

    const oncekiKarakter = index === 0 ? "" : normalSatir[index - 1];
    const basSinirdaMi = index === 0 || !/[a-z0-9]/.test(oncekiKarakter);

    if (basSinirdaMi) {
      const kalan = normalSatir.slice(index + normalTerim.length);
      const ek = kalan.match(/^[a-z]*/)?.[0] ?? "";
      eslesmeler.push({
        bas: index,
        son: index + normalTerim.length + ek.length,
        ek,
      });
    }

    aramaIndex = index + 1;
  }

  return eslesmeler;
}

/**
 * Uzun terim kısa terimi yutar: "buğday unu" eşleştiyse aynı yerdeki "buğday"
 * ve "un" tekrar sayılmaz. Aksi halde rapor aynı satırı defalarca gösterir ve
 * "buğday unu" satırına "hangi un?" diye sorar.
 */
function cakisiyorMu(
  eslesme: TerimEslesmesi,
  isaretliAraliklar: { bas: number; son: number }[],
): boolean {
  return isaretliAraliklar.some(
    (aralik) => eslesme.bas < aralik.son && aralik.bas < eslesme.son,
  );
}

function olumsuzMu(normalSatir: string, ek: string): boolean {
  if (OLUMSUZLUK_EKLERI.some((olumsuzEk) => ek.startsWith(olumsuzEk))) {
    return true;
  }
  return OLUMSUZLUK_KALIPLARI.some((kalip) => normalSatir.includes(kalip));
}

export interface AlerjenBulgusu {
  alerjenId: AllergenId;
  kaynaklar: { satir: string; eslesenTerim: string }[];
}

export interface BelirsizBulgu {
  satir: string;
  terim: string;
  soru: string;
  olasiAlerjenler: AllergenId[];
}

export interface BeyanEdilenYokBulgu {
  satir: string;
  alerjenId: AllergenId;
  eslesenTerim: string;
}

export interface EtBulgusu {
  kokenId: EtKokeniId;
  kaynaklar: { satir: string; eslesenTerim: string }[];
}

export interface EtBelirsizBulgu {
  satir: string;
  terim: string;
  soru: string;
  olasiKokenler: EtKokeniId[];
}

export interface TespitSonucu {
  /** Kesin eşleşen alerjenler */
  tespitEdilen: AlerjenBulgusu[];
  /** Kullanıcının netleştirmesi gereken terimler */
  belirsiz: BelirsizBulgu[];
  /** "glutensiz" gibi açıkça yokluk beyan edilen satırlar */
  beyanEdilenYok: BeyanEdilenYokBulgu[];
  /** Sözlükte karşılığı olmayan satırlar — temiz demek DEĞİL, incelenmeli demek */
  taninmayan: string[];
  /** Mevzuatın ayrıca istediği et kökeni bildirimi */
  etKokenleri: EtBulgusu[];
  /** Hangi hayvandan geldiği belirsiz et terimleri ("kıyma", "döner") */
  etBelirsiz: EtBelirsizBulgu[];
}

/** Reçete metnini satırlara böler; boş satırları ve yorumları atar. */
export function receteyiAyristir(metin: string): string[] {
  return metin
    .split(/\r?\n/)
    .map((satir) => satir.trim())
    .filter((satir) => satir.length > 0 && !satir.startsWith("#"));
}

// Uzun terimler önce denenir: "yer fıstığı" varken "fıstık"a düşmesin.
const SIRALI_KURALLAR = [...INGREDIENT_RULES].sort(
  (a, b) => b.terim.length - a.terim.length,
);
const SIRALI_BELIRSIZLER = [...AMBIGUOUS_TERMS].sort(
  (a, b) => b.terim.length - a.terim.length,
);
const SIRALI_ET_KURALLARI = [...ET_KURALLARI].sort(
  (a, b) => b.terim.length - a.terim.length,
);
const SIRALI_ET_BELIRSIZLER = [...ET_BELIRSIZ_TERIMLER].sort(
  (a, b) => b.terim.length - a.terim.length,
);

/**
 * Et kökeni taraması. Alerjen taramasından bağımsız yürür ve kendi aralık
 * takibini tutar — "domuz" gibi hem alerjen hem köken olan terimler iki
 * raporda da görünmeli.
 */
function etKokeniTara(satirlar: string[]) {
  const bulgular = new Map<EtKokeniId, EtBulgusu>();
  const etBelirsiz: EtBelirsizBulgu[] = [];

  for (const satir of satirlar) {
    const normalSatir = normalize(satir);
    const isaretliAraliklar: { bas: number; son: number }[] = [];

    for (const kural of SIRALI_ET_KURALLARI) {
      const eslesme = terimBul(normalSatir, normalize(kural.terim)).find(
        (aday) => !cakisiyorMu(aday, isaretliAraliklar),
      );
      if (!eslesme || olumsuzMu(normalSatir, eslesme.ek)) continue;

      isaretliAraliklar.push({ bas: eslesme.bas, son: eslesme.son });

      for (const kokenId of kural.kokenler) {
        const mevcut = bulgular.get(kokenId);
        if (mevcut) {
          mevcut.kaynaklar.push({ satir, eslesenTerim: kural.terim });
        } else {
          bulgular.set(kokenId, {
            kokenId,
            kaynaklar: [{ satir, eslesenTerim: kural.terim }],
          });
        }
      }
    }

    for (const belirsizTerim of SIRALI_ET_BELIRSIZLER) {
      const eslesme = terimBul(normalSatir, normalize(belirsizTerim.terim)).find(
        (aday) => !cakisiyorMu(aday, isaretliAraliklar),
      );
      if (!eslesme || olumsuzMu(normalSatir, eslesme.ek)) continue;

      isaretliAraliklar.push({ bas: eslesme.bas, son: eslesme.son });
      etBelirsiz.push({
        satir,
        terim: belirsizTerim.terim,
        soru: belirsizTerim.soru,
        olasiKokenler: belirsizTerim.olasiKokenler,
      });
    }
  }

  const etKokenleri = [...bulgular.values()].sort((a, b) =>
    ET_KOKENLERI[a.kokenId].ad.localeCompare(ET_KOKENLERI[b.kokenId].ad, "tr"),
  );

  return { etKokenleri, etBelirsiz };
}

export function alerjenTespitEt(metin: string): TespitSonucu {
  const satirlar = receteyiAyristir(metin);

  const bulgular = new Map<AllergenId, AlerjenBulgusu>();
  const belirsiz: BelirsizBulgu[] = [];
  const beyanEdilenYok: BeyanEdilenYokBulgu[] = [];
  const taninmayan: string[] = [];

  for (const satir of satirlar) {
    const normalSatir = normalize(satir);
    let satirdaEslesmeVar = false;

    // Önce satırdaki tüm eşleşmeleri topla; olumsuzluk kararı satırın
    // tamamı görülmeden verilemez ("fındıksız ama bademli" -> yemiş kalır).
    const olumluAdaylar: { alerjenId: AllergenId; terim: string }[] = [];
    const olumsuzAdaylar: { alerjenId: AllergenId; terim: string; birincil: boolean }[] = [];
    const isaretliAraliklar: { bas: number; son: number }[] = [];

    for (const kural of SIRALI_KURALLAR) {
      const eslesme = terimBul(normalSatir, normalize(kural.terim)).find(
        (aday) => !cakisiyorMu(aday, isaretliAraliklar),
      );
      if (!eslesme) continue;

      isaretliAraliklar.push({ bas: eslesme.bas, son: eslesme.son });
      satirdaEslesmeVar = true;
      const olumsuz = olumsuzMu(normalSatir, eslesme.ek);

      for (const alerjenId of kural.alerjenler) {
        if (olumsuz) {
          olumsuzAdaylar.push({
            alerjenId,
            terim: kural.terim,
            birincil: kural.birincil === true,
          });
        } else {
          olumluAdaylar.push({ alerjenId, terim: kural.terim });
        }
      }
    }

    for (const olumsuzAday of olumsuzAdaylar) {
      const baskaKaynakVar = olumluAdaylar.some(
        (aday) => aday.alerjenId === olumsuzAday.alerjenId,
      );

      // Olumsuzluk alerjeni ancak terim alerjenin kendi adıysa ("glutensiz
      // ekmek") ya da satırda o alerjeni bildiren başka içerik yoksa
      // ("fındıksız kek") siler. Aksi halde olumlu bildirim kazanır:
      // "laktozsuz süt" hâlâ süt içerir.
      if (olumsuzAday.birincil || !baskaKaynakVar) {
        beyanEdilenYok.push({
          satir,
          alerjenId: olumsuzAday.alerjenId,
          eslesenTerim: olumsuzAday.terim,
        });
      }
    }

    const silinenler = new Set(
      beyanEdilenYok.filter((b) => b.satir === satir).map((b) => b.alerjenId),
    );

    for (const aday of olumluAdaylar) {
      if (silinenler.has(aday.alerjenId)) continue;

      const mevcut = bulgular.get(aday.alerjenId);
      if (mevcut) {
        mevcut.kaynaklar.push({ satir, eslesenTerim: aday.terim });
      } else {
        bulgular.set(aday.alerjenId, {
          alerjenId: aday.alerjenId,
          kaynaklar: [{ satir, eslesenTerim: aday.terim }],
        });
      }
    }

    for (const belirsizTerim of SIRALI_BELIRSIZLER) {
      const eslesme = terimBul(normalSatir, normalize(belirsizTerim.terim)).find(
        (aday) => !cakisiyorMu(aday, isaretliAraliklar),
      );
      if (!eslesme || olumsuzMu(normalSatir, eslesme.ek)) continue;

      isaretliAraliklar.push({ bas: eslesme.bas, son: eslesme.son });
      satirdaEslesmeVar = true;
      belirsiz.push({
        satir,
        terim: belirsizTerim.terim,
        soru: belirsizTerim.soru,
        olasiAlerjenler: belirsizTerim.olasiAlerjenler,
      });
    }

    if (!satirdaEslesmeVar) {
      taninmayan.push(satir);
    }
  }

  const tespitEdilen = [...bulgular.values()].sort((a, b) =>
    ALLERGENS[a.alerjenId].ad.localeCompare(ALLERGENS[b.alerjenId].ad, "tr"),
  );

  const { etKokenleri, etBelirsiz } = etKokeniTara(satirlar);

  // Et taramasının tanıdığı satır "tanınmayan" sayılmaz: "200 g kıyma"
  // alerjen sözlüğünde yok ama bilinmeyen bir içerik de değil.
  const etinTanidigiSatirlar = new Set([
    ...etKokenleri.flatMap((bulgu) => bulgu.kaynaklar.map((k) => k.satir)),
    ...etBelirsiz.map((bulgu) => bulgu.satir),
  ]);

  return {
    tespitEdilen,
    belirsiz,
    beyanEdilenYok,
    taninmayan: taninmayan.filter((satir) => !etinTanidigiSatirlar.has(satir)),
    etKokenleri,
    etBelirsiz,
  };
}

/** Rapor tam mı, yoksa kullanıcı müdahalesi gerekiyor mu? */
export function incelemeGerekiyorMu(sonuc: TespitSonucu): boolean {
  return (
    sonuc.belirsiz.length > 0 ||
    sonuc.taninmayan.length > 0 ||
    sonuc.etBelirsiz.length > 0
  );
}
