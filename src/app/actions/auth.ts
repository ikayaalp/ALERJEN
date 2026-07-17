"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function girisYap(formData: FormData) {
  const eposta = formData.get("eposta") as string;
  const sifre = formData.get("sifre") as string;
  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email: eposta,
    password: sifre,
  });

  if (error) {
    return {
      basarili: false,
      hata: "Giriş başarısız. Lütfen bilgilerinizi kontrol edin.",
    };
  }

  revalidatePath("/", "layout");
  redirect("/kontrol");
}

export async function kayitOl(formData: FormData) {
  const eposta = formData.get("eposta") as string;
  const sifre = formData.get("sifre") as string;
  const supabase = await createClient();

  const { error } = await supabase.auth.signUp({
    email: eposta,
    password: sifre,
    options: {
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/api/auth/callback`,
    },
  });

  if (error) {
    return {
      basarili: false,
      hata: "Kayıt olurken bir hata oluştu: " + error.message,
    };
  }

  return { basarili: true };
}

export async function sifremiUnuttum(formData: FormData) {
  const eposta = formData.get("eposta") as string;
  const supabase = await createClient();

  const { error } = await supabase.auth.resetPasswordForEmail(eposta, {
    redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/sifre-sifirla`,
  });

  if (error) {
    return {
      basarili: false,
      hata: "Şifre sıfırlama linki gönderilemedi.",
    };
  }

  return { basarili: true };
}

export async function sifreSifirla(formData: FormData) {
  const sifre = formData.get("sifre") as string;
  const supabase = await createClient();

  const { error } = await supabase.auth.updateUser({
    password: sifre,
  });

  if (error) {
    return {
      basarili: false,
      hata: "Şifre güncellenemedi.",
    };
  }

  redirect("/giris");
}

export async function cikisYap() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/");
}
