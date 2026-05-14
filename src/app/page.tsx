"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";
import LogTeguran from "@/components/LogTeguran";
import {
  Upload,
  ScanLine,
  Send,
  FileCheck,
  Loader2,
  ImageIcon,
  X,
} from "lucide-react";

interface OcrResult {
  nomorPolisi: string;
  namaPemilik: string;
  totalPembayaran: string;
}

export default function Home() {
  const fileRef = useRef<HTMLInputElement>(null);

  const [preview, setPreview] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [activeTab, setActiveTab] = useState<"kirim" | "log">("kirim");

  const [form, setForm] = useState({
    nomorPolisi: "",
    namaPemilik: "",
    totalPembayaran: "",
    email: "",
    petugasNama: "",
    catatanOperasi: "",
  });

  const handleFile = (f: File) => {
    setFile(f);
    const url = URL.createObjectURL(f);
    setPreview(url);
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
        nomorPolisi: "",
        namaPemilik: "",
        totalPembayaran: "",
        email: "",
        petugasNama: "",
        catatanOperasi: "",
      });
      setPreview(null);
      setFile(null);
      if (fileRef.current) fileRef.current.value = "";
    } catch (e: any) {
      toast.error("Pengiriman Gagal", { description: e.message });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 font-sans">
      {/* Header */}
      <header className="bg-slate-900 border-b border-slate-800 sticky top-0 z-50">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center shrink-0">
            <FileCheck className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-white text-base leading-tight">JAPRI PKB</h1>
            <p className="text-slate-400 text-xs">
              Sistem Peringatan Pajak Kendaraan Bermotor
            </p>
          </div>
          <Badge className="ml-auto bg-blue-900 text-blue-300 text-[10px]">
            Bapenda
          </Badge>
        </div>
      </header>

      {/* Tab Navigation */}
      <div className="max-w-2xl mx-auto px-4 pt-4">
        <div className="flex gap-2 bg-slate-900 p-1 rounded-xl mb-4">
          <button
            onClick={() => setActiveTab("kirim")}
            className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all ${
              activeTab === "kirim"
                ? "bg-blue-600 text-white"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Kirim Teguran
          </button>
          <button
            onClick={() => setActiveTab("log")}
            className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all ${
              activeTab === "log"
                ? "bg-blue-600 text-white"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Log Operasi
          </button>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 pb-8 space-y-4">
        {activeTab === "kirim" ? (
          <>
            {/* Upload Screenshot */}
            <Card className="bg-slate-900 border-slate-800">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-semibold text-slate-300 flex items-center gap-2">
                  <ScanLine className="w-4 h-4 text-blue-400" />
                  STEP 1 — Unggah Screenshot Mobile Bapenda
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div
                  onDrop={handleDrop}
                  onDragOver={(e) => e.preventDefault()}
                  className="relative border-2 border-dashed border-slate-700 rounded-xl overflow-hidden min-h-40"
                >
                  {preview ? (
                    <div className="relative flex items-center justify-center p-4">
                      <img
                        src={preview}
                        alt="Preview"
                        className="max-h-48 rounded-lg object-contain"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setPreview(null);
                          setFile(null);
                          if (fileRef.current) fileRef.current.value = "";
                        }}
                        className="absolute top-2 right-2 bg-red-600 rounded-full p-1 z-10"
                      >
                        <X className="w-3 h-3 text-white" />
                      </button>
                    </div>
                  ) : (
                    <label
                      htmlFor="file-upload"
                      className="flex flex-col items-center justify-center gap-3 cursor-pointer w-full h-full min-h-40 p-6"
                    >
                      <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center">
                        <ImageIcon className="w-6 h-6 text-slate-500" />
                      </div>
                      <p className="text-slate-400 text-sm text-center">
                        Tap untuk upload atau drag & drop screenshot di sini
                      </p>
                      <p className="text-slate-600 text-xs">PNG, JPG, WEBP</p>
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
                <Button
                  onClick={handleScan}
                  disabled={!file || isScanning}
                  className="w-full mt-3 bg-blue-600 hover:bg-blue-700"
                >
                  {isScanning ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Memindai...
                    </>
                  ) : (
                    <>
                      <ScanLine className="w-4 h-4 mr-2" />
                      Pindai dengan OCR
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* Form Data */}
            <Card className="bg-slate-900 border-slate-800">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-semibold text-slate-300 flex items-center gap-2">
                  <Upload className="w-4 h-4 text-green-400" />
                  STEP 2 — Verifikasi & Lengkapi Data
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label className="text-slate-400 text-xs mb-1 block">
                      Nomor Polisi *
                    </Label>
                    <Input
                      value={form.nomorPolisi}
                      onChange={(e) =>
                        setForm({ ...form, nomorPolisi: e.target.value })
                      }
                      placeholder="DD 1234 ABC"
                      className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-600 uppercase"
                    />
                  </div>
                  <div>
                    <Label className="text-slate-400 text-xs mb-1 block">
                      Total Tunggakan *
                    </Label>
                    <Input
                      value={form.totalPembayaran}
                      onChange={(e) =>
                        setForm({ ...form, totalPembayaran: e.target.value })
                      }
                      placeholder="Rp 500.000"
                      className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-600"
                    />
                  </div>
                </div>
                <div>
                  <Label className="text-slate-400 text-xs mb-1 block">
                    Nama Pemilik *
                  </Label>
                  <Input
                    value={form.namaPemilik}
                    onChange={(e) =>
                      setForm({ ...form, namaPemilik: e.target.value })
                    }
                    placeholder="Nama sesuai STNK"
                    className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-600"
                  />
                </div>
                <div>
                  <Label className="text-slate-400 text-xs mb-1 block">
                    Email *
                  </Label>
                  <Input
                    value={form.email}
                    onChange={(e) =>
                      setForm({ ...form, email: e.target.value })
                    }
                    placeholder="email@example.com"
                    type="email"
                    className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-600"
                  />
                </div>
                <div>
                  <Label className="text-slate-400 text-xs mb-1 block">
                    Nama Petugas
                  </Label>
                  <Input
                    value={form.petugasNama}
                    onChange={(e) =>
                      setForm({ ...form, petugasNama: e.target.value })
                    }
                    placeholder="Nama petugas operasi"
                    className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-600"
                  />
                </div>
                <div>
                  <Label className="text-slate-400 text-xs mb-1 block">
                    Catatan Operasi
                  </Label>
                  <Textarea
                    value={form.catatanOperasi}
                    onChange={(e) =>
                      setForm({ ...form, catatanOperasi: e.target.value })
                    }
                    placeholder="Lokasi operasi, kondisi, dll..."
                    className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-600 resize-none"
                    rows={2}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Send Button */}
            <Button
              onClick={handleSend}
              disabled={
                isSending ||
                !form.nomorPolisi ||
                !form.namaPemilik ||
                !form.email
              }
              className="w-full h-12 bg-green-600 hover:bg-green-700 text-white font-semibold text-base"
            >
              {isSending ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Mengirim Teguran...
                </>
              ) : (
                <>
                  <Send className="w-5 h-5 mr-2" />
                  Kirim Teguran via Email
                </>
              )}
            </Button>
          </>
        ) : (
          <LogTeguran />
        )}
      </div>

      <Toaster />
    </main>
  );
}