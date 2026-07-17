"use client";

import { useState } from "react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { sifreSifirla } from "@/app/actions/auth";

export default function SifreSifirlaSayfasi() {
  const [hata, setHata] = useState<string | null>(null);
  const [yukleniyor, setYukleniyor] = useState(false);

  async function onSubmit(formData: FormData) {
    setYukleniyor(true);
    setHata(null);
    const sonuc = await sifreSifirla(formData);
    
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
              Yeni Şifre Belirle
            </h1>
            <p className="mt-2 text-sm text-zeytin-acik">
              Lütfen hesabınız için yeni bir şifre girin.
            </p>

            {hata && (
              <div className="mt-6 rounded-xl border border-safran/40 bg-safran/10 p-4 text-sm text-biber">
                {hata}
              </div>
            )}

            <form action={onSubmit} className="mt-8 space-y-5">
              <div>
                <label
                  htmlFor="sifre"
                  className="mb-1.5 block text-sm font-medium text-murekkep"
                >
                  Yeni Şifre
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
                {yukleniyor ? "Güncelleniyor..." : "Şifreyi Güncelle"}
              </button>
            </form>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
