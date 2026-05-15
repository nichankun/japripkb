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

    const model = genAI.getGenerativeModel({ model: "gemini-3-flash-preview" });

    const prompt = `Kamu adalah sistem OCR untuk aplikasi Mobile Bapenda Sultra Indonesia.
Ekstrak SEMUA data berikut dari screenshot ini dengan TEPAT:

INFORMASI KENDARAAN:
- Nomor Polisi
- Nama Pemilik
- Merk Kendaraan
- Type Kendaraan
- Tahun Buat
- Warna TNKB
- Masa Berlaku

INFORMASI BIAYA:
- PKB
- Tunggakan PKB
- Denda PKB
- SWDKLLJ
- Tunggakan SWDKLLJ
- Denda SWDKLLJ
- Opsen PKB
- Denda Opsen
- Tunggakan Opsen
- STNK / STICK
- Plat Nomor / DT
- Total Pembayaran

Balas HANYA dalam format JSON berikut, tanpa teks lain:
{
  "nomorPolisi": "...",
  "namaPemilik": "...",
  "merk": "...",
  "type": "...",
  "tahunBuat": "...",
  "warnaTnkb": "...",
  "masaBerlaku": "...",
  "pkb": "...",
  "tunggakanPkb": "...",
  "dendaPkb": "...",
  "swdkllj": "...",
  "tunggakanSwdkllj": "...",
  "dendaSwdkllj": "...",
  "opsenPkb": "...",
  "dendaOpsen": "...",
  "tunggakanOpsen": "...",
  "stnkStick": "...",
  "platNomor": "...",
  "totalPembayaran": "..."
}

Jika data tidak ditemukan, isi dengan "0" untuk angka dan "-" untuk teks.`;

    const result = await model.generateContent([
      prompt,
      { inlineData: { data: base64, mimeType } },
    ]);

    const text = result.response.text();
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("Format respons OCR tidak valid");

    const data = JSON.parse(jsonMatch[0]);
    return NextResponse.json(data);
  } catch (error) {
    console.error("OCR Error:", error);
    return NextResponse.json({ error: "Gagal memproses gambar" }, { status: 500 });
  }
}