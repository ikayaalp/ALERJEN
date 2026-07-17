"use client";

import Link from "next/link";
import { useState } from "react";
import { SiteHeader } from "@/components/site-header";

export default function GirisSayfasi() {
  const [gonderildi, setGonderildi] = useState(false);

  return (
    <div className="min-h-full">
      <SiteHeader />

      <main className="mx-auto flex max-w-6xl justify-center px-6 py-20">
        <div className="w-full max-w-md">
          <div className="rounded-2xl border border-stone-200 bg-white p-8 shadow-sm">
            <h1 className="font-display text-3xl tracking-tight text-stone-900">
              Giriş yap
            </h1>
            <p className="mt-2 text-sm text-stone-600">
              Reçete arşivinize ve raporlarınıza erişin.
            </p>

            {gonderildi ? (
              <div className="mt-8 rounded-xl border border-amber-200 bg-amber-50 p-5 text-sm text-amber-900">
                <strong>Hesap sistemi henüz açılmadı.</strong> Şu an kayıt
                gerekmeden{" "}
                <Link href="/kontrol" className="underline underline-offset-4">
                  kontrol aracını
                </Link>{" "}
                kullanabilirsiniz. Açılışta ilk siz haberdar olmak için{" "}
                <a
                  href="mailto:kayaalp.ismail.1221@gmail.com"
                  className="underline underline-offset-4"
                >
                  bize yazın
                </a>
                .
              </div>
            ) : (
              <form
                className="mt-8 space-y-5"
                onSubmit={(olay) => {
                  olay.preventDefault();
                  setGonderildi(true);
                }}
              >
                <div>
                  <label
                    htmlFor="eposta"
                    className="mb-1.5 block text-sm font-medium text-stone-800"
                  >
                    E-posta
                  </label>
                  <input
                    id="eposta"
                    type="email"
                    required
                    autoComplete="email"
                    placeholder="siz@isletmeniz.com"
                    className="w-full rounded-xl border border-stone-200 bg-stone-50/60 px-4 py-2.5 text-sm text-stone-900 outline-none transition placeholder:text-stone-400 focus:border-amber-600/40 focus:bg-white focus:ring-4 focus:ring-amber-600/10"
                  />
                </div>
                <div>
                  <label
                    htmlFor="sifre"
                    className="mb-1.5 block text-sm font-medium text-stone-800"
                  >
                    Şifre
                  </label>
                  <input
                    id="sifre"
                    type="password"
                    required
                    autoComplete="current-password"
                    placeholder="••••••••"
                    className="w-full rounded-xl border border-stone-200 bg-stone-50/60 px-4 py-2.5 text-sm text-stone-900 outline-none transition placeholder:text-stone-400 focus:border-amber-600/40 focus:bg-white focus:ring-4 focus:ring-amber-600/10"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full rounded-full bg-stone-900 px-5 py-3 text-sm font-medium text-stone-50 transition hover:bg-stone-700"
                >
                  Giriş yap
                </button>
              </form>
            )}
          </div>

          <p className="mt-6 text-center text-sm text-stone-600">
            Hesabınız yok mu?{" "}
            <Link
              href="/kontrol"
              className="text-stone-900 underline underline-offset-4 hover:text-amber-700"
            >
              Kayıt olmadan deneyin
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}
