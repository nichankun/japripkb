import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("image") as File;

    if (!file) {
      return NextResponse.json({ error: "Tidak ada gambar" }, { status: 400 });
    }

    const buffer = await file.arrayBuffer();
    const base64 = Buffer.from(buffer).toString("base64");
    const mimeType = file.type as "image/jpeg" | "image/png" | "image/webp";

    const model = genAI.getGenerativeModel({ model: "gemini-3.1-flash-lite" });

    const prompt = `Kamu adalah sistem OCR untuk aplikasi Mobile Bapenda (Badan Pendapatan Daerah) Indonesia.
Ekstrak data berikut dari screenshot ini dengan TEPAT:
1. Nomor Polisi Kendaraan (format: huruf-angka-huruf, contoh: DD 1234 ABC)
2. Nama Pemilik Kendaraan
3. Total Pembayaran/Tunggakan PKB (dalam Rupiah)

Balas HANYA dalam format JSON berikut, tanpa teks lain:
{
  "nomorPolisi": "...",
  "namaPemilik": "...",
  "totalPembayaran": "..."
}

Jika data tidak ditemukan di gambar, isi dengan string kosong "".`;

    const result = await model.generateContent([
      prompt,
      {
        inlineData: {
          data: base64,
          mimeType,
        },
      },
    ]);

    const text = result.response.text();
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("Format respons OCR tidak valid");

    const data = JSON.parse(jsonMatch[0]);
    return NextResponse.json(data);
  } catch (error) {
    console.error("OCR Error:", error);
    return NextResponse.json(
      { error: "Gagal memproses gambar" },
      { status: 500 }
    );
  }
}