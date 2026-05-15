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
      merk,
      type,
      tahunBuat,
      warnaTnkb,
      masaBerlaku,
      pkb,
      tunggakanPkb,
      dendaPkb,
      swdkllj,
      tunggakanSwdkllj,
      dendaSwdkllj,
      opsenPkb,
      dendaOpsen,
      tunggakanOpsen,
      stnkStick,
      platNomor,
      totalPembayaran,
      email,
      petugasNama,
      catatanOperasi,
    } = body;

    if (!nomorPolisi || !namaPemilik || !totalPembayaran || !email) {
      return NextResponse.json({ error: "Data tidak lengkap" }, { status: 400 });
    }

    const tanggal = new Date().toLocaleDateString("id-ID", {
      day: "numeric", month: "long", year: "numeric",
    });

    const { error } = await resend.emails.send({
      from: process.env.EMAIL_FROM!,
      to: email,
      subject: `Teguran PKB - ${nomorPolisi}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f8fafc;">

          <!-- Header -->
          <div style="background: linear-gradient(135deg, #1e3a5f, #1e40af); padding: 28px 24px; text-align: center; border-radius: 12px 12px 0 0;">
            <p style="color: #93c5fd; font-size: 11px; letter-spacing: 2px; text-transform: uppercase; margin: 0 0 6px;">Badan Pendapatan Daerah</p>
            <h1 style="color: white; margin: 0; font-size: 20px; font-weight: bold;">SURAT TEGURAN PKB</h1>
            <p style="color: #bfdbfe; font-size: 12px; margin: 6px 0 0;">Pajak Kendaraan Bermotor</p>
          </div>

          <!-- Alert Banner -->
          <div style="background: #fef2f2; border-left: 4px solid #ef4444; padding: 14px 20px; margin: 0;">
            <p style="color: #dc2626; font-weight: bold; margin: 0; font-size: 13px;">
              ⚠️ Kendaraan Anda BELUM MELUNASI Pajak Kendaraan Bermotor (PKB)
            </p>
            <p style="color: #ef4444; font-size: 12px; margin: 4px 0 0;">Tanggal Teguran: ${tanggal}</p>
          </div>

          <!-- Informasi Kendaraan -->
          <div style="background: white; margin: 12px; border-radius: 10px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
            <div style="background: #1e3a5f; padding: 10px 16px; display: flex; align-items: center; gap: 8px;">
              <span style="color: white; font-size: 13px; font-weight: bold;">ℹ️ INFORMASI KENDARAAN</span>
            </div>
            <table style="width: 100%; border-collapse: collapse; padding: 4px;">
              ${[
                ["NOMOR POLISI", nomorPolisi],
                ["NAMA", namaPemilik],
                ["MERK", merk || "-"],
                ["TYPE", type || "-"],
                ["TAHUN BUAT", tahunBuat || "-"],
                ["WARNA TNKB", warnaTnkb || "-"],
                ["MASA BERLAKU", masaBerlaku || "-"],
              ].map(([label, value], i) => `
                <tr style="background: ${i % 2 === 0 ? "#f8fafc" : "white"};">
                  <td style="padding: 9px 16px; color: #64748b; font-size: 12px; width: 45%;">${label}</td>
                  <td style="padding: 9px 16px; color: #0f172a; font-size: 12px; font-weight: ${label === "NOMOR POLISI" ? "bold" : "normal"};">: ${value}</td>
                </tr>
              `).join("")}
            </table>
          </div>

          <!-- Informasi Biaya -->
          <div style="background: white; margin: 12px; border-radius: 10px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
            <div style="background: #1e3a5f; padding: 10px 16px;">
              <span style="color: white; font-size: 13px; font-weight: bold;">💰 INFORMASI BIAYA</span>
            </div>
            <table style="width: 100%; border-collapse: collapse;">
              ${[
                ["PKB", pkb || "0"],
                ["TUNGGAKAN PKB", tunggakanPkb || "0"],
                ["DENDA PKB", dendaPkb || "0"],
                ["SWDKLLJ", swdkllj || "0"],
                ["TUNGGAKAN SWDKLLJ", tunggakanSwdkllj || "0"],
                ["DENDA SWDKLLJ", dendaSwdkllj || "0"],
                ["OPSEN PKB", opsenPkb || "0"],
                ["DENDA OPSEN", dendaOpsen || "0"],
                ["TUNGGAKAN OPSEN", tunggakanOpsen || "0"],
                ["STNK / STICK", stnkStick || "0"],
                ["PLAT NOMOR / DT", platNomor || "0"],
              ].map(([label, value], i) => `
                <tr style="background: ${i % 2 === 0 ? "#f8fafc" : "white"};">
                  <td style="padding: 9px 16px; color: #64748b; font-size: 12px; width: 55%;">${label}</td>
                  <td style="padding: 9px 16px; color: #0f172a; font-size: 12px; text-align: right;">: ${value}</td>
                </tr>
              `).join("")}
            </table>
            <!-- Total -->
            <div style="background: #e0f2fe; padding: 14px 16px; display: flex; justify-content: space-between; align-items: center;">
             <span style="color: #0369a1; font-weight: bold; font-size: 13px;">TOTAL PEMBAYARAN</span>
<span style="color: #0369a1; font-weight: bold; font-size: 16px;">: ${totalPembayaran}</span>
            </div>
          </div>

          <!-- Cara Bayar -->
          <div style="background: white; margin: 12px; border-radius: 10px; padding: 16px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
            <p style="color: #475569; font-size: 12px; font-weight: bold; margin: 0 0 8px;">Segera lakukan pembayaran melalui:</p>
            <ul style="margin: 0; padding-left: 18px; color: #64748b; font-size: 12px; line-height: 2;">
              <li>Samsat terdekat</li>
              <li>Aplikasi Signal / Sambara</li>
              <li>Bank / ATM yang bekerja sama</li>
            </ul>
            <p style="color: #dc2626; font-size: 12px; margin: 10px 0 0;">
              ⚠️ Keterlambatan pembayaran akan dikenakan <strong>DENDA</strong> sesuai peraturan yang berlaku.
            </p>
          </div>

          <!-- Footer -->
          <div style="text-align: center; padding: 16px; border-top: 1px solid #e2e8f0; margin: 0 12px 12px;">
            <p style="color: #94a3b8; font-size: 11px; margin: 0;">
              Petugas: <strong style="color: #64748b;">${petugasNama || "Tim Bapenda"}</strong>
            </p>
            <p style="color: #cbd5e1; font-size: 10px; margin: 4px 0 0;">
              Dikirim otomatis oleh sistem JAPRI PKB · Bapenda Sultra
            </p>
          </div>

        </div>
      `,
    });

    if (error) throw new Error(error.message || "Gagal mengirim email");

    await db.insert(teguran).values({
      nomorPolisi,
      namaPemilik,
      totalPembayaran,
      nomorWa: email,
      statusPengiriman: "terkirim",
      petugasNama: petugasNama || null,
      catatanOperasi: catatanOperasi || null,
    });

    return NextResponse.json({ success: true, message: "Teguran berhasil dikirim via Email" });
  } catch (error: any) {
    console.error("Kirim Teguran Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}