import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { teguran } from "@/db/database/schema";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY!);

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      nomorPolisi,
      namaPemilik,
      totalPembayaran,
      email,
      petugasNama,
      catatanOperasi,
    } = body;

    if (!nomorPolisi || !namaPemilik || !totalPembayaran || !email) {
      return NextResponse.json({ error: "Data tidak lengkap" }, { status: 400 });
    }

    const tanggal = new Date().toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });

    const { error } = await resend.emails.send({
      from: process.env.EMAIL_FROM!,
      to: email,
      subject: `Teguran PKB - ${nomorPolisi}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden;">
          
          <!-- Header -->
          <div style="background-color: #1e3a5f; padding: 24px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 18px;">BADAN PENDAPATAN DAERAH</h1>
            <p style="color: #93c5fd; margin: 4px 0 0; font-size: 13px;">SURAT TEGURAN PAJAK KENDARAAN BERMOTOR</p>
          </div>

          <!-- Alert -->
          <div style="background-color: #fef2f2; border-left: 4px solid #ef4444; padding: 16px 24px;">
            <p style="color: #dc2626; font-weight: bold; margin: 0; font-size: 14px;">
              ⚠️ KENDARAAN ANDA BELUM MELUNASI PAJAK KENDARAAN BERMOTOR (PKB)
            </p>
          </div>

          <!-- Data Kendaraan -->
          <div style="padding: 24px;">
            <h2 style="font-size: 14px; color: #64748b; text-transform: uppercase; letter-spacing: 1px; margin: 0 0 16px;">
              Data Kendaraan
            </h2>
            <table style="width: 100%; border-collapse: collapse;">
              <tr style="border-bottom: 1px solid #f1f5f9;">
                <td style="padding: 10px 0; color: #64748b; font-size: 13px; width: 40%;">Nomor Polisi</td>
                <td style="padding: 10px 0; font-weight: bold; font-size: 15px; color: #0f172a;">${nomorPolisi}</td>
              </tr>
              <tr style="border-bottom: 1px solid #f1f5f9;">
                <td style="padding: 10px 0; color: #64748b; font-size: 13px;">Nama Pemilik</td>
                <td style="padding: 10px 0; color: #0f172a; font-size: 13px;">${namaPemilik}</td>
              </tr>
              <tr style="border-bottom: 1px solid #f1f5f9;">
                <td style="padding: 10px 0; color: #64748b; font-size: 13px;">Total Tunggakan</td>
                <td style="padding: 10px 0; font-weight: bold; color: #dc2626; font-size: 15px;">${totalPembayaran}</td>
              </tr>
              <tr>
                <td style="padding: 10px 0; color: #64748b; font-size: 13px;">Tanggal Teguran</td>
                <td style="padding: 10px 0; color: #0f172a; font-size: 13px;">${tanggal}</td>
              </tr>
            </table>
          </div>

          <!-- Cara Bayar -->
          <div style="background-color: #f8fafc; padding: 20px 24px; margin: 0 24px 24px; border-radius: 8px;">
            <h3 style="font-size: 13px; color: #475569; margin: 0 0 12px;">Segera lakukan pembayaran melalui:</h3>
            <ul style="margin: 0; padding-left: 20px; color: #475569; font-size: 13px; line-height: 2;">
              <li>Samsat terdekat</li>
              <li>Aplikasi Signal / Sambara</li>
              <li>Bank / ATM yang bekerja sama</li>
            </ul>
          </div>

          <!-- Warning -->
          <div style="padding: 0 24px 24px;">
            <p style="color: #64748b; font-size: 12px; margin: 0;">
              Keterlambatan pembayaran akan dikenakan <strong>DENDA</strong> sesuai peraturan yang berlaku.
              Harap segera melakukan pembayaran sebelum jatuh tempo.
            </p>
          </div>

          <!-- Footer -->
          <div style="background-color: #f1f5f9; padding: 16px 24px; text-align: center;">
            <p style="color: #94a3b8; font-size: 12px; margin: 0;">
              Petugas: <strong>${petugasNama || "Tim Bapenda"}</strong>
            </p>
            <p style="color: #cbd5e1; font-size: 11px; margin: 4px 0 0;">
              Pesan ini dikirim secara otomatis oleh sistem JAPRI PKB — Bapenda
            </p>
          </div>

        </div>
      `,
    });

    if (error) {
      throw new Error(error.message || "Gagal mengirim email");
    }

    // Simpan ke database
    await db.insert(teguran).values({
      nomorPolisi,
      namaPemilik,
      totalPembayaran,
      nomorWa: email,
      statusPengiriman: "terkirim",
      petugasNama: petugasNama || null,
      catatanOperasi: catatanOperasi || null,
    });

    return NextResponse.json({
      success: true,
      message: "Teguran berhasil dikirim via Email",
    });
  } catch (error: any) {
    console.error("Kirim Teguran Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}