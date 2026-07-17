-- 1. profiller tablosu
CREATE TABLE public.profiller (
  id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  eposta text,
  olusturulma_tarihi timestamp with time zone DEFAULT now(),
  PRIMARY KEY (id)
);

ALTER TABLE public.profiller ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Kullanicilar kendi profillerini gorebilir." ON public.profiller
  FOR SELECT USING (auth.uid() = id);

-- 2. kredi_bakiyeleri tablosu
CREATE TABLE public.kredi_bakiyeleri (
  kullanici_id uuid NOT NULL REFERENCES public.profiller(id) ON DELETE CASCADE,
  bakiye integer NOT NULL DEFAULT 0,
  guncellenme_tarihi timestamp with time zone DEFAULT now(),
  PRIMARY KEY (kullanici_id)
);

ALTER TABLE public.kredi_bakiyeleri ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Kullanicilar kendi kredi bakiyelerini gorebilir." ON public.kredi_bakiyeleri
  FOR SELECT USING (auth.uid() = kullanici_id);

-- 3. kredi_islemleri tablosu
CREATE TABLE public.kredi_islemleri (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  kullanici_id uuid NOT NULL REFERENCES public.profiller(id) ON DELETE CASCADE,
  miktar integer NOT NULL,
  sebep text NOT NULL CHECK (sebep IN ('kayit_bonusu', 'recete_kontrolu', 'admin_ekleme', 'satin_alma')),
  olusturulma_tarihi timestamp with time zone DEFAULT now(),
  PRIMARY KEY (id)
);

ALTER TABLE public.kredi_islemleri ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Kullanicilar kendi kredi islemlerini gorebilir." ON public.kredi_islemleri
  FOR SELECT USING (auth.uid() = kullanici_id);

-- 4. Yeni kullanici kayit trigger'i
CREATE OR REPLACE FUNCTION public.kullanici_olusturuldu_tetikleyicisi()
RETURNS TRIGGER AS $$
BEGIN
  -- profiller'e ekle
  INSERT INTO public.profiller (id, eposta)
  VALUES (new.id, new.email);
  
  -- kredi_bakiyeleri'ne ekle (3 kredi bonus)
  INSERT INTO public.kredi_bakiyeleri (kullanici_id, bakiye)
  VALUES (new.id, 3);
  
  -- kredi_islemleri'ne kayit dus
  INSERT INTO public.kredi_islemleri (kullanici_id, miktar, sebep)
  VALUES (new.id, 3, 'kayit_bonusu');
  
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.kullanici_olusturuldu_tetikleyicisi();

-- 5. kredi_dustur fonksiyonu (SECURITY DEFINER ile atomik islem)
CREATE OR REPLACE FUNCTION public.kredi_dustur(p_kullanici_id uuid)
RETURNS integer AS $$
DECLARE
  v_bakiye integer;
BEGIN
  -- Bakiyeyi guncelle
  UPDATE public.kredi_bakiyeleri
  SET 
    bakiye = bakiye - 1,
    guncellenme_tarihi = now()
  WHERE kullanici_id = p_kullanici_id AND bakiye > 0
  RETURNING bakiye INTO v_bakiye;
  
  -- Eger guncellenecek kayit bulunamadiysa (bakiye 0 ise veya kullanici yoksa)
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Yetersiz kredi veya bakiye bulunamadi';
  END IF;
  
  -- Islemi logla
  INSERT INTO public.kredi_islemleri (kullanici_id, miktar, sebep)
  VALUES (p_kullanici_id, -1, 'recete_kontrolu');
  
  RETURN v_bakiye;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
