import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { alerjenTespitEt } from "@/lib/detect";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    
    // 1. Session dogrula
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json(
        { hata: "Oturum açmanız gerekiyor." },
        { status: 401 }
      );
    }

    const body = await request.json();
    const recete = body.recete;

    if (!recete || typeof recete !== "string" || recete.trim().length === 0) {
      return NextResponse.json(
        { hata: "Geçerli bir reçete metni gerekli." },
        { status: 400 }
      );
    }

    // 2. Kredi dustur (RPC)
    const { data: yeniBakiye, error: rpcHata } = await supabase.rpc("kredi_dustur", {
      p_kullanici_id: user.id
    });

    if (rpcHata) {
      return NextResponse.json(
        { hata: "Krediniz kalmadı. Lütfen kredi yükleyin." },
        { status: 402 }
      );
    }

    // 3. Analizi calistir
    const sonuc = alerjenTespitEt(recete);

    // 4. Sonuclari don
    return NextResponse.json({
      sonuc,
      yeniBakiye
    });

  } catch (error: any) {
    console.error("Analiz hatası:", error);
    return NextResponse.json(
      { hata: "İşlem sırasında bir hata oluştu." },
      { status: 500 }
    );
  }
}
