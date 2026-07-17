/**
 * Et kökeni bildirimi.
 *
 * Mevzuat, menüde etin hangi hayvana ait olduğunun açıkça belirtilmesini
 * istiyor (dana, kuzu, kanatlı). Bu bir alerjen değil — ayrı bir menşei
 * bildirim yükümlülüğü. Alerjenlerden ayrı tutuluyor çünkü hukuki dayanağı ve
 * raporlama biçimi farklı.
 *
 * KAYNAK DOĞRULAMASI GEREKLİ: İkincil kaynaklardan (haber) derlendi. Resmî
 * Gazete metniyle karşılaştırılmalı.
 */

export type EtKokeniId = "dana" | "kuzu" | "kanatli" | "domuz" | "av";

export interface EtKokeni {
  id: EtKokeniId;
  ad: string;
  aciklama: string;
}

export const ET_KOKENLERI: Record<EtKokeniId, EtKokeni> = {
  dana: {
    id: "dana",
    ad: "Dana / sığır",
    aciklama: "Sığır cinsi hayvan eti.",
  },
  kuzu: {
    id: "kuzu",
    ad: "Kuzu / koyun",
    aciklama: "Koyun cinsi hayvan eti.",
  },
  kanatli: {
    id: "kanatli",
    ad: "Kanatlı",
    aciklama: "Tavuk, hindi, ördek, kaz gibi kanatlı hayvan eti.",
  },
  domuz: {
    id: "domuz",
    ad: "Domuz",
    aciklama: "Domuz eti. Ayrıca alerjen bildirimine de tabidir.",
  },
  av: {
    id: "av",
    ad: "Av hayvanı",
    aciklama: "Av eti (tavşan, keklik vb.).",
  },
};

export interface EtKuralı {
  terim: string;
  kokenler: EtKokeniId[];
}

export const ET_KURALLARI: EtKuralı[] = [
  // Dana / sığır
  { terim: "dana", kokenler: ["dana"] },
  { terim: "dana eti", kokenler: ["dana"] },
  { terim: "sığır", kokenler: ["dana"] },
  { terim: "sığır eti", kokenler: ["dana"] },
  { terim: "biftek", kokenler: ["dana"] },
  { terim: "bonfile", kokenler: ["dana"] },
  { terim: "antrikot", kokenler: ["dana"] },
  { terim: "kontrfile", kokenler: ["dana"] },
  { terim: "pastırma", kokenler: ["dana"] },
  { terim: "kavurma", kokenler: ["dana"] },
  { terim: "işkembe", kokenler: ["dana"] },

  // Kuzu / koyun
  { terim: "kuzu", kokenler: ["kuzu"] },
  { terim: "kuzu eti", kokenler: ["kuzu"] },
  { terim: "koyun", kokenler: ["kuzu"] },
  { terim: "koyun eti", kokenler: ["kuzu"] },
  { terim: "kuzu pirzola", kokenler: ["kuzu"] },
  { terim: "kuzu incik", kokenler: ["kuzu"] },
  { terim: "kuzu but", kokenler: ["kuzu"] },

  // Kanatlı
  { terim: "tavuk", kokenler: ["kanatli"] },
  { terim: "tavuk eti", kokenler: ["kanatli"] },
  { terim: "tavuk göğsü", kokenler: ["kanatli"] },
  { terim: "tavuk but", kokenler: ["kanatli"] },
  { terim: "piliç", kokenler: ["kanatli"] },
  { terim: "hindi", kokenler: ["kanatli"] },
  { terim: "ördek", kokenler: ["kanatli"] },
  { terim: "kaz", kokenler: ["kanatli"] },
  { terim: "bıldırcın", kokenler: ["kanatli"] },
  { terim: "kanatlı", kokenler: ["kanatli"] },

  // Domuz
  { terim: "domuz", kokenler: ["domuz"] },
  { terim: "domuz eti", kokenler: ["domuz"] },
  { terim: "jambon", kokenler: ["domuz"] },
  { terim: "bacon", kokenler: ["domuz"] },
  { terim: "pepperoni", kokenler: ["domuz"] },

  // Av
  { terim: "tavşan", kokenler: ["av"] },
  { terim: "keklik", kokenler: ["av"] },
];

export interface EtBelirsizTerim {
  terim: string;
  olasiKokenler: EtKokeniId[];
  soru: string;
}

/**
 * Mevzuatın asıl hedefi bu terimler: "kıyma" yazan bir menü, etin hangi
 * hayvandan geldiğini söylemiyor. Hangi hayvan olduğu sorulmalı.
 */
export const ET_BELIRSIZ_TERIMLER: EtBelirsizTerim[] = [
  {
    terim: "kıyma",
    olasiKokenler: ["dana", "kuzu", "kanatli"],
    soru: "Hangi hayvanın kıyması? Menüde belirtilmesi zorunlu.",
  },
  {
    terim: "et",
    olasiKokenler: ["dana", "kuzu", "kanatli"],
    soru: "Hangi hayvanın eti? Dana, kuzu ve kanatlı ayrı ayrı belirtilmeli.",
  },
  {
    terim: "köfte",
    olasiKokenler: ["dana", "kuzu", "kanatli"],
    soru: "Köftenin eti hangi hayvandan?",
  },
  {
    terim: "döner",
    olasiKokenler: ["dana", "kuzu", "kanatli"],
    soru: "Döner hangi etten? Dana, kuzu ve tavuk ayrı bildirilmeli.",
  },
  {
    terim: "sucuk",
    olasiKokenler: ["dana", "kanatli"],
    soru: "Sucuk hangi etten üretilmiş?",
  },
  {
    terim: "salam",
    olasiKokenler: ["dana", "kanatli", "domuz"],
    soru: "Salam hangi etten? Domuz içeriyorsa ayrıca alerjen bildirimi gerekir.",
  },
  {
    terim: "sosis",
    olasiKokenler: ["dana", "kanatli", "domuz"],
    soru: "Sosis hangi etten? Domuz içeriyorsa ayrıca alerjen bildirimi gerekir.",
  },
  {
    terim: "salça",
    olasiKokenler: [],
    soru: "Et suyu veya et özü içeriyor mu? İçeriyorsa kökeni belirtilmeli.",
  },
  {
    terim: "et suyu",
    olasiKokenler: ["dana", "kanatli"],
    soru: "Et suyu hangi hayvandan?",
  },
  {
    terim: "bulyon",
    olasiKokenler: ["dana", "kanatli"],
    soru: "Bulyon hangi hayvandan? Tavuk ve dana ayrı bildirilmeli.",
  },
  {
    terim: "jelatin",
    olasiKokenler: ["dana", "domuz"],
    soru: "Jelatinin kaynağı hangi hayvan? Domuz ise ayrıca alerjen bildirimi gerekir.",
  },
];
