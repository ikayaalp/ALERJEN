-- receteler tablosu
CREATE TABLE public.receteler (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  kullanici_id uuid NOT NULL REFERENCES public.profiller(id) ON DELETE CASCADE,
  ad text NOT NULL,
  icerik text NOT NULL,
  analiz_sonucu jsonb NOT NULL,
  olusturulma_tarihi timestamp with time zone DEFAULT now(),
  PRIMARY KEY (id)
);

ALTER TABLE public.receteler ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Kullanicilar kendi recetelerini gorebilir." ON public.receteler
  FOR SELECT USING (auth.uid() = kullanici_id);

CREATE POLICY "Kullanicilar kendi recetelerini ekleyebilir." ON public.receteler
  FOR INSERT WITH CHECK (auth.uid() = kullanici_id);

CREATE POLICY "Kullanicilar kendi recetelerini silebilir." ON public.receteler
  FOR DELETE USING (auth.uid() = kullanici_id);
