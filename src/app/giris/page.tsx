"use client";

import Link from "next/link";
import { useState, useActionState } from "react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { girisYap } from "@/app/actions/auth";

export default function GirisSayfasi() {
  const [hata, setHata] = useState<string | null>(null);
  const [yukleniyor, setYukleniyor] = useState(false);

  async function onSubmit(formData: FormData) {
    setYukleniyor(true);
    setHata(null);
    const sonuc = await girisYap(formData);
    if (sonuc?.hata) {
      setHata(sonuc.hata);
      setYukleniyor(false);
    }
  }

  return (
    <div className="min-h-full flex flex-col">
      <SiteHeader />

      <main className="flex-1 mx-auto flex w-full max-w-6xl justify-center px-6 py-20">
        <div className="w-full max-w-md">
          <div className="rounded-2xl border border-murekkep/10 bg-kagit p-8 shadow-sm">
            <h1 className="font-display text-3xl tracking-tight text-murekkep">
              Giriş yap
            </h1>
            <p className="mt-2 text-sm text-zeytin-acik">
              Reçete arşivinize ve raporlarınıza erişin.
            </p>

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
                <div className="mb-1.5 flex items-center justify-between">
                  <label
                    htmlFor="sifre"
                    className="block text-sm font-medium text-murekkep"
                  >
                    Şifre
                  </label>
                  <Link
                    href="/sifremi-unuttum"
                    className="text-xs text-zeytin-acik underline underline-offset-4 hover:text-biber"
                  >
                    Şifremi unuttum
                  </Link>
                </div>
                <input
                  id="sifre"
                  name="sifre"
                  type="password"
                  required
                  autoComplete="current-password"
                  placeholder="••••••••"
                  className="w-full rounded-xl border border-murekkep/10 bg-krem/60 px-4 py-2.5 text-sm text-murekkep outline-none transition placeholder:text-zeytin-acik/60 focus:border-biber/40 focus:bg-kagit focus:ring-4 focus:ring-biber/10"
                />
              </div>
              <button
                type="submit"
                disabled={yukleniyor}
                className="w-full rounded-full bg-murekkep px-5 py-3 text-sm font-medium text-krem transition hover:bg-zeytin disabled:opacity-70"
              >
                {yukleniyor ? "Giriş yapılıyor..." : "Giriş yap"}
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
                Google ile giriş yap
              </button>
            </form>
          </div>

          <p className="mt-6 text-center text-sm text-zeytin-acik">
            Hesabınız yok mu?{" "}
            <Link
              href="/kayit"
              className="text-murekkep underline underline-offset-4 hover:text-biber"
            >
              Kayıt olun
            </Link>
          </p>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
