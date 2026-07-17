"use client";

import Link from "next/link";
import { useState } from "react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { kayitOl } from "@/app/actions/auth";

export default function KayitSayfasi() {
  const [hata, setHata] = useState<string | null>(null);
  const [basarili, setBasarili] = useState(false);
  const [yukleniyor, setYukleniyor] = useState(false);

  async function onSubmit(formData: FormData) {
    setYukleniyor(true);
    setHata(null);
    const sonuc = await kayitOl(formData);
    
    if (sonuc?.hata) {
      setHata(sonuc.hata);
      setYukleniyor(false);
    } else {
      setBasarili(true);
    }
  }

  return (
    <div className="min-h-full flex flex-col">
      <SiteHeader />

      <main className="flex-1 mx-auto flex w-full max-w-6xl justify-center px-6 py-20">
        <div className="w-full max-w-md">
          <div className="rounded-2xl border border-murekkep/10 bg-kagit p-8 shadow-sm">
            <h1 className="font-display text-3xl tracking-tight text-murekkep">
              Kayıt ol
            </h1>
            <p className="mt-2 text-sm text-zeytin-acik">
              Hemen kayıt olun ve 3 ücretsiz analiz kredisi kazanın.
            </p>

            {basarili ? (
              <div className="mt-8 rounded-xl border border-zeytin/25 bg-zeytin/[0.07] p-5 text-sm text-zeytin">
                <strong>Kayıt başarılı!</strong> Lütfen e-posta adresinize gelen onay bağlantısına tıklayarak hesabınızı doğrulayın. (Eğer test ortamındaysanız doğrudan giriş yapmayı deneyebilirsiniz.)
              </div>
            ) : (
              <>
                {hata && (
                  <div className="mt-6 rounded-xl border border-safran/40 bg-safran/10 p-4 text-sm text-biber">
                    {hata}
                  </div>
                )}

                <form action={onSubmit} className="mt-8 space-y-5">
                  <div>
                    <label
                      htmlFor="eposta"
                      className="mb-1.5 block text-sm font-medium text-murekkep"
                    >
                      E-posta
                    </label>
                    <input
                      id="eposta"
                      name="eposta"
                      type="email"
                      required
                      autoComplete="email"
                      placeholder="siz@isletmeniz.com"
                      className="w-full rounded-xl border border-murekkep/10 bg-krem/60 px-4 py-2.5 text-sm text-murekkep outline-none transition placeholder:text-zeytin-acik/60 focus:border-biber/40 focus:bg-kagit focus:ring-4 focus:ring-biber/10"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="sifre"
                      className="mb-1.5 block text-sm font-medium text-murekkep"
                    >
                      Şifre
                    </label>
                    <input
                      id="sifre"
                      name="sifre"
                      type="password"
                      required
                      autoComplete="new-password"
                      placeholder="En az 6 karakter"
                      minLength={6}
                      className="w-full rounded-xl border border-murekkep/10 bg-krem/60 px-4 py-2.5 text-sm text-murekkep outline-none transition placeholder:text-zeytin-acik/60 focus:border-biber/40 focus:bg-kagit focus:ring-4 focus:ring-biber/10"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={yukleniyor}
                    className="w-full rounded-full bg-murekkep px-5 py-3 text-sm font-medium text-krem transition hover:bg-zeytin disabled:opacity-70"
                  >
                    {yukleniyor ? "Kayıt olunuyor..." : "Kayıt ol"}
                  </button>
                  
                  <div className="relative py-3">
                    <div className="absolute inset-0 flex items-center" aria-hidden="true">
                      <div className="w-full border-t border-murekkep/10"></div>
                    </div>
                    <div className="relative flex justify-center">
                      <span className="bg-kagit px-3 text-xs text-zeytin-acik">veya</span>
                    </div>
                  </div>
                  
                  <button
                    type="button"
                    className="w-full rounded-full border border-murekkep/10 bg-krem/60 px-5 py-3 text-sm font-medium text-murekkep transition hover:bg-kagit hover:border-murekkep/20 flex justify-center items-center gap-2"
                    onClick={() => alert("Yakında...")}
                  >
                    Google ile kayıt ol
                  </button>
                </form>
              </>
            )}
          </div>

          <p className="mt-6 text-center text-sm text-zeytin-acik">
            Zaten hesabınız var mı?{" "}
            <Link
              href="/giris"
              className="text-murekkep underline underline-offset-4 hover:text-biber"
            >
              Giriş yapın
            </Link>
          </p>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
