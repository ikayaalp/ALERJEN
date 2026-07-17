import { describe, expect, it } from "vitest";
import { alerjenTespitEt, incelemeGerekiyorMu, normalize } from "./detect";

function tespitEdilenIdler(metin: string) {
  return alerjenTespitEt(metin)
    .tespitEdilen.map((bulgu) => bulgu.alerjenId)
    .sort();
}

describe("normalize", () => {
  it("Türkçe karakterleri ve büyük harfleri sadeleştirir", () => {
    expect(normalize("SÜT")).toBe("sut");
    expect(normalize("Buğday Unu")).toBe("bugday unu");
    expect(normalize("Antep Fıstığı")).toBe("antep fistigi");
    expect(normalize("İrmik")).toBe("irmik");
  });
});

describe("temel tespit", () => {
  it("basit içerikleri yakalar", () => {
    expect(tespitEdilenIdler("200 ml süt")).toEqual(["sut"]);
    expect(tespitEdilenIdler("2 yumurta")).toEqual(["yumurta"]);
  });

  it("Türkçe ekleri olan yazımları yakalar", () => {
    expect(tespitEdilenIdler("sütlü çikolata")).toEqual(["sut"]);
    expect(tespitEdilenIdler("buğdaydan yapılmış")).toEqual(["gluten"]);
  });

  it("bir satırdan birden fazla alerjen çıkarabilir", () => {
    expect(tespitEdilenIdler("2 kaşık soya sosu")).toEqual(["gluten", "soya"]);
  });

  it("aynı alerjenin birden fazla kaynağını tek bulguda toplar", () => {
    const sonuc = alerjenTespitEt("200 ml süt\n100 g tereyağı\n50 g kaşar");
    expect(sonuc.tespitEdilen).toHaveLength(1);
    expect(sonuc.tespitEdilen[0].alerjenId).toBe("sut");
    expect(sonuc.tespitEdilen[0].kaynaklar).toHaveLength(3);
  });
});

describe("olumsuzluk", () => {
  it("'-sız' ekini alerjen sanmaz", () => {
    expect(tespitEdilenIdler("glutensiz un karışımı")).not.toContain("gluten");
    expect(tespitEdilenIdler("susamsız simit")).not.toContain("susam");
    expect(tespitEdilenIdler("alkolsüz bira")).not.toContain("alkol");
  });

  it("susamsız simit hâlâ glüten bildirir", () => {
    expect(tespitEdilenIdler("susamsız simit")).toContain("gluten");
  });

  it("laktozsuz süt HÂLÂ süt bildirir", () => {
    // Laktozsuz sütten laktoz uzaklaştırılmıştır ama süt proteini durur;
    // süt alerjisi olan biri için risklidir. Bildirim düşürülemez.
    expect(tespitEdilenIdler("laktozsuz süt")).toEqual(["sut"]);
  });

  it("olumsuzlanan yemiş, başka yemiş varken grubu düşürmez", () => {
    expect(tespitEdilenIdler("fındıksız ama bademli kek")).toContain(
      "sert-kabuklu-yemis",
    );
  });

  it("tek kaynak olumsuzlanınca grup düşer", () => {
    expect(tespitEdilenIdler("fındıksız kek")).not.toContain("sert-kabuklu-yemis");
  });

  it("olumsuzlanan alerjeni ayrı listede beyan olarak tutar", () => {
    const sonuc = alerjenTespitEt("glutensiz ekmek");
    expect(sonuc.tespitEdilen).toHaveLength(0);
    expect(sonuc.beyanEdilenYok.map((b) => b.alerjenId)).toContain("gluten");
  });

  it("cümle içi olumsuzluk kalıplarını anlar", () => {
    expect(tespitEdilenIdler("bu üründe süt içermez")).toEqual([]);
  });
});

describe("en uzun eşleşme önceliği", () => {
  it("'yer fıstığı'nı belirsiz 'fıstık'a düşürmez", () => {
    const sonuc = alerjenTespitEt("50 g yer fıstığı");
    expect(sonuc.tespitEdilen.map((b) => b.alerjenId)).toContain("yer-fistigi");
  });

  it("'antep fıstığı'nı sert kabuklu yemiş sayar", () => {
    const sonuc = alerjenTespitEt("50 g antep fıstığı");
    expect(sonuc.tespitEdilen.map((b) => b.alerjenId)).toContain("sert-kabuklu-yemis");
  });
});

describe("çakışan terimler", () => {
  it("'buğday unu' satırını hem 'buğday unu' hem 'buğday' diye iki kez saymaz", () => {
    const sonuc = alerjenTespitEt("500 g buğday unu");
    const gluten = sonuc.tespitEdilen.find((b) => b.alerjenId === "gluten");
    expect(gluten?.kaynaklar).toHaveLength(1);
    expect(gluten?.kaynaklar[0].eslesenTerim).toBe("buğday unu");
  });

  it("'buğday unu' satırına 'hangi un?' diye sormaz", () => {
    const sonuc = alerjenTespitEt("500 g buğday unu");
    expect(sonuc.belirsiz).toHaveLength(0);
    expect(incelemeGerekiyorMu(sonuc)).toBe(false);
  });

  it("'yer fıstığı' satırını belirsiz 'fıstık' diye de işaretlemez", () => {
    const sonuc = alerjenTespitEt("50 g yer fıstığı");
    expect(sonuc.belirsiz).toHaveLength(0);
  });

  it("ayrı duran kısa terim hâlâ yakalanır", () => {
    const sonuc = alerjenTespitEt("buğday unu ve nişasta");
    expect(sonuc.belirsiz.map((b) => b.terim)).toContain("nişasta");
  });
});

describe("belirsiz terimler", () => {
  it("tek başına 'fıstık' için karar vermez, sorar", () => {
    const sonuc = alerjenTespitEt("100 g fıstık");
    expect(sonuc.tespitEdilen).toHaveLength(0);
    expect(sonuc.belirsiz.map((b) => b.terim)).toContain("fıstık");
    expect(incelemeGerekiyorMu(sonuc)).toBe(true);
  });

  it("jelatinin kaynağını sorar", () => {
    const sonuc = alerjenTespitEt("10 g jelatin");
    expect(sonuc.belirsiz.map((b) => b.terim)).toContain("jelatin");
  });

  it("'nişasta'yı glüten saymaz ama sorar", () => {
    const sonuc = alerjenTespitEt("20 g nişasta");
    expect(sonuc.tespitEdilen).toHaveLength(0);
    expect(sonuc.belirsiz.map((b) => b.terim)).toContain("nişasta");
  });

  it("'buğday nişastası' belirsiz değil, kesin glütendir", () => {
    const sonuc = alerjenTespitEt("20 g buğday nişastası");
    expect(sonuc.tespitEdilen.map((b) => b.alerjenId)).toContain("gluten");
  });
});

describe("tanınmayan içerikler", () => {
  it("sözlükte olmayan içeriği 'temiz' saymaz, incelemeye alır", () => {
    const sonuc = alerjenTespitEt("100 g zerdeçal\n50 g kuşkonmaz");
    expect(sonuc.taninmayan).toEqual(["100 g zerdeçal", "50 g kuşkonmaz"]);
    expect(incelemeGerekiyorMu(sonuc)).toBe(true);
  });
});

describe("et kökeni", () => {
  it("tavuğu kanatlı olarak bildirir", () => {
    const sonuc = alerjenTespitEt("300 g tavuk göğsü");
    expect(sonuc.etKokenleri.map((b) => b.kokenId)).toEqual(["kanatli"]);
  });

  it("dana ve kuzuyu ayrı ayrı bildirir", () => {
    const sonuc = alerjenTespitEt("200 g dana eti\n200 g kuzu but");
    expect(sonuc.etKokenleri.map((b) => b.kokenId).sort()).toEqual([
      "dana",
      "kuzu",
    ]);
  });

  it("'kıyma' için hangi hayvan olduğunu sorar", () => {
    const sonuc = alerjenTespitEt("500 g kıyma");
    expect(sonuc.etKokenleri).toHaveLength(0);
    expect(sonuc.etBelirsiz.map((b) => b.terim)).toContain("kıyma");
    expect(incelemeGerekiyorMu(sonuc)).toBe(true);
  });

  it("et taramasının tanıdığı satırı 'tanınmayan' saymaz", () => {
    const sonuc = alerjenTespitEt("500 g kıyma");
    expect(sonuc.taninmayan).toHaveLength(0);
  });

  it("domuz hem alerjen hem et kökeni olarak raporlanır", () => {
    const sonuc = alerjenTespitEt("100 g domuz eti");
    expect(sonuc.tespitEdilen.map((b) => b.alerjenId)).toContain("domuz");
    expect(sonuc.etKokenleri.map((b) => b.kokenId)).toContain("domuz");
  });

  it("'dana döner' kesin köken verir, ayrıca 'döner' diye sormaz", () => {
    const sonuc = alerjenTespitEt("200 g dana döner");
    expect(sonuc.etKokenleri.map((b) => b.kokenId)).toContain("dana");
    expect(sonuc.etBelirsiz.map((b) => b.terim)).not.toContain("dana");
  });
});

describe("reçete ayrıştırma", () => {
  it("boş satırları ve yorumları atar", () => {
    const sonuc = alerjenTespitEt("# Kek reçetesi\n\n200 ml süt\n\n");
    expect(sonuc.tespitEdilen).toHaveLength(1);
    expect(sonuc.taninmayan).toHaveLength(0);
  });
});

describe("gerçekçi reçete", () => {
  it("karışık bir reçeteyi doğru çözer", () => {
    const recete = [
      "500 g buğday unu",
      "200 ml süt",
      "3 yumurta",
      "100 g tereyağı",
      "50 g fındık",
      "1 tatlı kaşığı tuz",
    ].join("\n");

    const sonuc = alerjenTespitEt(recete);
    const idler = sonuc.tespitEdilen.map((b) => b.alerjenId).sort();

    expect(idler).toEqual(["gluten", "sert-kabuklu-yemis", "sut", "yumurta"]);
    expect(sonuc.taninmayan).toEqual(["1 tatlı kaşığı tuz"]);
  });
});
