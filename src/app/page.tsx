"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";
import LogTeguran from "@/components/LogTeguran";
import {
  ScanLine,
  Send,
  Loader2,
  ImageIcon,
  X,
  CheckCircle2,
  ChevronRight,
  ClipboardList,
  ArrowLeft,
} from "lucide-react";

interface OcrResult {
  nomorPolisi: string;
  namaPemilik: string;
  totalPembayaran: string;
}

type ActiveTab = "kirim" | "log";
type Step = 1 | 2;

export default function Home() {
  const fileRef = useRef<HTMLInputElement>(null);

  const [preview, setPreview] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [activeTab, setActiveTab] = useState<ActiveTab>("kirim");
  const [step, setStep] = useState<Step>(1);
  const [ocrDone, setOcrDone] = useState(false);

 // Ganti state form:
const [form, setForm] = useState({
  nomorPolisi: "",
  namaPemilik: "",
  merk: "",
  type: "",
  tahunBuat: "",
  warnaTnkb: "",
  masaBerlaku: "",
  pkb: "",
  tunggakanPkb: "",
  dendaPkb: "",
  swdkllj: "",
  tunggakanSwdkllj: "",
  dendaSwdkllj: "",
  opsenPkb: "",
  dendaOpsen: "",
  tunggakanOpsen: "",
  stnkStick: "",
  platNomor: "",
  totalPembayaran: "",
  email: "",
  petugasNama: "",
  catatanOperasi: "",
});

  const handleFile = (f: File) => {
    setFile(f);
    setPreview(URL.createObjectURL(f));
    setOcrDone(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const f = e.dataTransfer.files[0];
    if (f && f.type.startsWith("image/")) handleFile(f);
  };

  const handleScan = async () => {
    if (!file) return toast.error("Pilih gambar dulu!");
    setIsScanning(true);
    try {
      const fd = new FormData();
      fd.append("image", file);
      const res = await fetch("/api/ocr", { method: "POST", body: fd });
      const data: OcrResult = await res.json();
      if (!res.ok) throw new Error((data as any).error);
      setForm((prev) => ({ ...prev, ...data }));
      setOcrDone(true);
      toast.success("OCR Berhasil!", { description: "Data berhasil diekstrak." });
    } catch (e: any) {
      toast.error("OCR Gagal", { description: e.message });
    } finally {
      setIsScanning(false);
    }
  };

  const handleSend = async () => {
    if (!form.email) return toast.error("Email wajib diisi!");
    setIsSending(true);
    try {
      const res = await fetch("/api/kirim-teguran", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      toast.success("Teguran Terkirim!", {
        description: `Email berhasil dikirim ke ${form.email}`,
      });
      setForm({
  nomorPolisi: "", namaPemilik: "", merk: "", type: "",
  tahunBuat: "", warnaTnkb: "", masaBerlaku: "",
  pkb: "", tunggakanPkb: "", dendaPkb: "",
  swdkllj: "", tunggakanSwdkllj: "", dendaSwdkllj: "",
  opsenPkb: "", dendaOpsen: "", tunggakanOpsen: "",
  stnkStick: "", platNomor: "", totalPembayaran: "",
  email: "", petugasNama: "", catatanOperasi: "",
});
      setPreview(null);
      setFile(null);
      setOcrDone(false);
      setStep(1);
      if (fileRef.current) fileRef.current.value = "";
    } catch (e: any) {
      toast.error("Pengiriman Gagal", { description: e.message });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#0a0f1e] text-white font-sans">

      {/* Header */}
      <header className="sticky top-0 z-50 bg-[#0a0f1e]/90 backdrop-blur border-b border-white/5">
        <div className="max-w-lg mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-linear-to-br from-blue-500 to-blue-700 flex items-center justify-center shadow-lg shadow-blue-900/40">
              <ScanLine className="w-4 h-4 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-sm text-white leading-none">JAPRI PKB</h1>
              <p className="text-[10px] text-blue-400 mt-0.5">Bapenda · Sistem Teguran Digital</p>
            </div>
          </div>

          {/* Tab Toggle */}
          <div className="flex bg-white/5 rounded-lg p-0.5 gap-0.5">
            <button
              onClick={() => setActiveTab("kirim")}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                activeTab === "kirim"
                  ? "bg-blue-600 text-white shadow"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Kirim
            </button>
            <button
              onClick={() => setActiveTab("log")}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                activeTab === "log"
                  ? "bg-blue-600 text-white shadow"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Log
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-lg mx-auto px-4 pb-10">
        {activeTab === "kirim" ? (
          <>
            {/* Step Indicator */}
            <div className="flex items-center gap-2 py-5">
              {/* Step 1 */}
              <div className="flex items-center gap-2">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                  step === 1
                    ? "bg-blue-600 text-white ring-2 ring-blue-500/30"
                    : ocrDone
                    ? "bg-green-600 text-white"
                    : "bg-white/10 text-slate-400"
                }`}>
                  {ocrDone && step === 2 ? <CheckCircle2 className="w-4 h-4" /> : "1"}
                </div>
                <span className={`text-xs font-medium ${step === 1 ? "text-white" : "text-slate-500"}`}>
                  Pindai
                </span>
              </div>

              <div className={`flex-1 h-px transition-all ${ocrDone ? "bg-blue-600" : "bg-white/10"}`} />

              {/* Step 2 */}
              <div className="flex items-center gap-2">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                  step === 2
                    ? "bg-blue-600 text-white ring-2 ring-blue-500/30"
                    : "bg-white/10 text-slate-400"
                }`}>
                  2
                </div>
                <span className={`text-xs font-medium ${step === 2 ? "text-white" : "text-slate-500"}`}>
                  Kirim
                </span>
              </div>
            </div>

            {/* STEP 1 */}
            {step === 1 && (
              <div className="space-y-3">
                <div>
                  <h2 className="text-base font-semibold text-white">Unggah Screenshot</h2>
                  <p className="text-xs text-slate-400 mt-0.5">Screenshot dari aplikasi Mobile Bapenda</p>
                </div>

                {/* Upload Area */}
                <div
                  onDrop={handleDrop}
                  onDragOver={(e) => e.preventDefault()}
                  className="relative rounded-2xl overflow-hidden border border-white/10 bg-white/5"
                >
                  {preview ? (
                    <div className="relative">
                      <img
                        src={preview}
                        alt="Preview"
                        className="w-full max-h-72 object-contain"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setPreview(null);
                          setFile(null);
                          setOcrDone(false);
                          if (fileRef.current) fileRef.current.value = "";
                        }}
                        className="absolute top-3 right-3 bg-black/60 backdrop-blur rounded-full p-1.5 border border-white/10"
                      >
                        <X className="w-3.5 h-3.5 text-white" />
                      </button>
                      {ocrDone && (
                        <div className="absolute bottom-3 left-3 bg-green-600/90 backdrop-blur rounded-full px-3 py-1 flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                          <span className="text-xs text-white font-medium">Data berhasil diekstrak</span>
                        </div>
                      )}
                    </div>
                  ) : (
                    <label
                      htmlFor="file-upload"
                      className="flex flex-col items-center justify-center gap-3 cursor-pointer py-14 px-6"
                    >
                      <div className="w-14 h-14 rounded-2xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center">
                        <ImageIcon className="w-7 h-7 text-blue-400" />
                      </div>
                      <div className="text-center">
                        <p className="text-sm font-medium text-white">Tap untuk upload</p>
                        <p className="text-xs text-slate-500 mt-1">atau drag & drop di sini · PNG, JPG, WEBP</p>
                      </div>
                    </label>
                  )}
                </div>

                <input
                  id="file-upload"
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) handleFile(f);
                  }}
                />

                {/* OCR Result Preview */}
                {ocrDone && (
  <Card className="bg-white/5 border-green-500/20">
    <CardContent className="p-4 space-y-3">
      <p className="text-xs text-green-400 font-semibold uppercase tracking-wider">Hasil OCR</p>
      
      <p className="text-xs text-blue-400 font-medium">Informasi Kendaraan</p>
      <div className="space-y-1.5">
        {[
          ["Nomor Polisi", form.nomorPolisi],
          ["Nama", form.namaPemilik],
          ["Merk", form.merk],
          ["Type", form.type],
          ["Tahun Buat", form.tahunBuat],
          ["Warna TNKB", form.warnaTnkb],
          ["Masa Berlaku", form.masaBerlaku],
        ].map(([label, value]) => (
          <div key={label} className="flex justify-between items-center">
            <span className="text-xs text-slate-400">{label}</span>
            <span className="text-xs font-medium text-white">{value || "-"}</span>
          </div>
        ))}
      </div>

      <div className="border-t border-white/10 pt-3">
        <p className="text-xs text-blue-400 font-medium mb-1.5">Informasi Biaya</p>
        <div className="space-y-1.5">
          {[
            ["PKB", form.pkb],
            ["Tunggakan PKB", form.tunggakanPkb],
            ["Denda PKB", form.dendaPkb],
            ["SWDKLLJ", form.swdkllj],
            ["Tunggakan SWDKLLJ", form.tunggakanSwdkllj],
            ["Denda SWDKLLJ", form.dendaSwdkllj],
            ["Opsen PKB", form.opsenPkb],
            ["Denda Opsen", form.dendaOpsen],
            ["Tunggakan Opsen", form.tunggakanOpsen],
            ["STNK / STICK", form.stnkStick],
            ["Plat Nomor / DT", form.platNomor],
          ].map(([label, value]) => (
            <div key={label} className="flex justify-between items-center">
              <span className="text-xs text-slate-400">{label}</span>
              <span className="text-xs text-white">{value || "0"}</span>
            </div>
          ))}
        </div>
        <div className="flex justify-between items-center mt-2 pt-2 border-t border-white/10">
          <span className="text-xs font-bold text-blue-400">Total Pembayaran</span>
          <span className="text-sm font-bold text-red-400">{form.totalPembayaran || "0"}</span>
        </div>
      </div>
    </CardContent>
  </Card>
)}

                {/* Buttons */}
                <div className="flex gap-2">
                  <Button
                    onClick={handleScan}
                    disabled={!file || isScanning}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 h-11 rounded-xl"
                  >
                    {isScanning ? (
                      <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Memindai...</>
                    ) : (
                      <><ScanLine className="w-4 h-4 mr-2" />Pindai OCR</>
                    )}
                  </Button>
                  <Button
                    onClick={() => setStep(2)}
                    disabled={!ocrDone}
                    className="flex-1 bg-white/10 hover:bg-white/15 h-11 rounded-xl text-white disabled:opacity-30"
                  >
                    Lanjut <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              </div>
            )}

            {/* STEP 2 */}
            {step === 2 && (
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setStep(1)}
                    className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center border border-white/10"
                  >
                    <ArrowLeft className="w-4 h-4 text-slate-400" />
                  </button>
                  <div>
                    <h2 className="text-base font-semibold text-white">Verifikasi & Kirim</h2>
                    <p className="text-xs text-slate-400 mt-0.5">Periksa data dan lengkapi email</p>
                  </div>
                </div>

                <Card className="bg-white/5 border-white/10">
  <CardContent className="p-4 space-y-3">
    <p className="text-xs text-blue-400 font-semibold uppercase tracking-wider">Data Kendaraan</p>
    <div className="grid grid-cols-2 gap-3">
      <div>
        <Label className="text-slate-400 text-xs mb-1.5 block">Nomor Polisi *</Label>
        <Input
          value={form.nomorPolisi}
          onChange={(e) => setForm({ ...form, nomorPolisi: e.target.value })}
          placeholder="DD 1234 ABC"
          className="bg-white/5 border-white/10 text-white placeholder:text-slate-600 uppercase h-10 rounded-xl"
        />
      </div>
      <div>
        <Label className="text-slate-400 text-xs mb-1.5 block">Total Tunggakan *</Label>
        <Input
          value={form.totalPembayaran}
          onChange={(e) => setForm({ ...form, totalPembayaran: e.target.value })}
          placeholder="Rp 500.000"
          className="bg-white/5 border-white/10 text-white placeholder:text-slate-600 h-10 rounded-xl"
        />
      </div>
    </div>
    <div>
      <Label className="text-slate-400 text-xs mb-1.5 block">Nama Pemilik *</Label>
      <Input
        value={form.namaPemilik}
        onChange={(e) => setForm({ ...form, namaPemilik: e.target.value })}
        placeholder="Nama sesuai STNK"
        className="bg-white/5 border-white/10 text-white placeholder:text-slate-600 h-10 rounded-xl"
      />
    </div>
    <div className="grid grid-cols-2 gap-3">
      <div>
        <Label className="text-slate-400 text-xs mb-1.5 block">Merk</Label>
        <Input
          value={form.merk}
          onChange={(e) => setForm({ ...form, merk: e.target.value })}
          placeholder="YAMAHA"
          className="bg-white/5 border-white/10 text-white placeholder:text-slate-600 h-10 rounded-xl"
        />
      </div>
      <div>
        <Label className="text-slate-400 text-xs mb-1.5 block">Type</Label>
        <Input
          value={form.type}
          onChange={(e) => setForm({ ...form, type: e.target.value })}
          placeholder="B6H-F A/T"
          className="bg-white/5 border-white/10 text-white placeholder:text-slate-600 h-10 rounded-xl"
        />
      </div>
    </div>
    <div className="grid grid-cols-2 gap-3">
      <div>
        <Label className="text-slate-400 text-xs mb-1.5 block">Tahun Buat</Label>
        <Input
          value={form.tahunBuat}
          onChange={(e) => setForm({ ...form, tahunBuat: e.target.value })}
          placeholder="2023"
          className="bg-white/5 border-white/10 text-white placeholder:text-slate-600 h-10 rounded-xl"
        />
      </div>
      <div>
        <Label className="text-slate-400 text-xs mb-1.5 block">Warna TNKB</Label>
        <Input
          value={form.warnaTnkb}
          onChange={(e) => setForm({ ...form, warnaTnkb: e.target.value })}
          placeholder="Putih"
          className="bg-white/5 border-white/10 text-white placeholder:text-slate-600 h-10 rounded-xl"
        />
      </div>
    </div>
    <div>
      <Label className="text-slate-400 text-xs mb-1.5 block">Masa Berlaku</Label>
      <Input
        value={form.masaBerlaku}
        onChange={(e) => setForm({ ...form, masaBerlaku: e.target.value })}
        placeholder="13-06-2026"
        className="bg-white/5 border-white/10 text-white placeholder:text-slate-600 h-10 rounded-xl"
      />
    </div>

    <div className="border-t border-white/10 pt-3">
      <p className="text-xs text-blue-400 font-semibold uppercase tracking-wider mb-3">Informasi Biaya</p>
      <div className="grid grid-cols-2 gap-3">
        {[
          { label: "PKB", key: "pkb" },
          { label: "Tunggakan PKB", key: "tunggakanPkb" },
          { label: "Denda PKB", key: "dendaPkb" },
          { label: "SWDKLLJ", key: "swdkllj" },
          { label: "Tunggakan SWDKLLJ", key: "tunggakanSwdkllj" },
          { label: "Denda SWDKLLJ", key: "dendaSwdkllj" },
          { label: "Opsen PKB", key: "opsenPkb" },
          { label: "Denda Opsen", key: "dendaOpsen" },
          { label: "Tunggakan Opsen", key: "tunggakanOpsen" },
          { label: "STNK / STICK", key: "stnkStick" },
          { label: "Plat Nomor / DT", key: "platNomor" },
        ].map(({ label, key }) => (
          <div key={key}>
            <Label className="text-slate-400 text-xs mb-1.5 block">{label}</Label>
            <Input
              value={(form as any)[key]}
              onChange={(e) => setForm({ ...form, [key]: e.target.value })}
              placeholder="0"
              className="bg-white/5 border-white/10 text-white placeholder:text-slate-600 h-10 rounded-xl"
            />
          </div>
        ))}
      </div>
    </div>
  </CardContent>
</Card>

                <Card className="bg-white/5 border-white/10">
                  <CardContent className="p-4 space-y-3">
                    <p className="text-xs text-blue-400 font-semibold uppercase tracking-wider">Pengiriman</p>
                    <div>
                      <Label className="text-slate-400 text-xs mb-1.5 block">Email Penerima *</Label>
                      <Input
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        placeholder="email@example.com"
                        type="email"
                        className="bg-white/5 border-white/10 text-white placeholder:text-slate-600 h-10 rounded-xl"
                      />
                    </div>
                    <div>
                      <Label className="text-slate-400 text-xs mb-1.5 block">Nama Petugas</Label>
                      <Input
                        value={form.petugasNama}
                        onChange={(e) => setForm({ ...form, petugasNama: e.target.value })}
                        placeholder="Nama petugas operasi"
                        className="bg-white/5 border-white/10 text-white placeholder:text-slate-600 h-10 rounded-xl"
                      />
                    </div>
                    <div>
                      <Label className="text-slate-400 text-xs mb-1.5 block">Catatan Operasi</Label>
                      <Textarea
                        value={form.catatanOperasi}
                        onChange={(e) => setForm({ ...form, catatanOperasi: e.target.value })}
                        placeholder="Lokasi operasi, kondisi, dll..."
                        className="bg-white/5 border-white/10 text-white placeholder:text-slate-600 resize-none rounded-xl"
                        rows={2}
                      />
                    </div>
                  </CardContent>
                </Card>

                <Button
                  onClick={handleSend}
                  disabled={isSending || !form.nomorPolisi || !form.namaPemilik || !form.email}
                  className="w-full h-12 bg-linear-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold rounded-xl shadow-lg shadow-green-900/30"
                >
                  {isSending ? (
                    <><Loader2 className="w-5 h-5 mr-2 animate-spin" />Mengirim Teguran...</>
                  ) : (
                    <><Send className="w-5 h-5 mr-2" />Kirim Teguran via Email</>
                  )}
                </Button>
              </div>
            )}
          </>
        ) : (
          <div className="pt-4">
            <div className="flex items-center gap-2 mb-4">
              <ClipboardList className="w-4 h-4 text-blue-400" />
              <h2 className="text-base font-semibold text-white">Log Operasi</h2>
            </div>
            <LogTeguran />
          </div>
        )}
      </div>

      <Toaster />
    </main>
  );
}