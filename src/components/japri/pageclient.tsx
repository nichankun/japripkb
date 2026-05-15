"use client";

import { useState, useRef } from "react";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";
import { ClipboardList } from "lucide-react";

import { AppHeader } from "@/components/japri/appheader";
import { StepIndicator } from "@/components/japri/steindicator";
import { Step1Scan } from "@/components/japri/stapsatuscan";
import { Step2Send } from "@/components/japri/stepduasend";
import LogTeguran from "@/components/LogTeguran";

// ---------- Types ----------
interface OcrResult {
  nomorPolisi: string;
  namaPemilik: string;
  totalPembayaran: string;
}

type ActiveTab = "kirim" | "log";
type Step = 1 | 2;

export interface FormData {
  nomorPolisi: string;
  namaPemilik: string;
  merk: string;
  type: string;
  tahunBuat: string;
  warnaTnkb: string;
  masaBerlaku: string;
  pkb: string;
  tunggakanPkb: string;
  dendaPkb: string;
  swdkllj: string;
  tunggakanSwdkllj: string;
  dendaSwdkllj: string;
  opsenPkb: string;
  dendaOpsen: string;
  tunggakanOpsen: string;
  stnkStick: string;
  platNomor: string;
  totalPembayaran: string;
  email: string;
  petugasNama: string;
  catatanOperasi: string;
}

const EMPTY_FORM: FormData = {
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
};

const STEPS = [
  { number: 1, label: "Pindai Screenshot" },
  { number: 2, label: "Verifikasi & Kirim" },
];

export function JapriClient() {
  const fileRef = useRef<HTMLInputElement>(null);

  const [preview, setPreview] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [activeTab, setActiveTab] = useState<ActiveTab>("kirim");
  const [step, setStep] = useState<Step>(1);
  const [ocrDone, setOcrDone] = useState(false);
  const [form, setForm] = useState<FormData>(EMPTY_FORM);

  // ---- Handlers ----
  const handleFile = (f: File) => {
    setFile(f);
    setPreview(URL.createObjectURL(f));
    setOcrDone(false);
  };

  const handleClearFile = () => {
    setPreview(null);
    setFile(null);
    setOcrDone(false);
    if (fileRef.current) fileRef.current.value = "";
  };

  const handleFormChange = (key: keyof FormData, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
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
      setForm(EMPTY_FORM);
      handleClearFile();
      setStep(1);
    } catch (e: any) {
      toast.error("Pengiriman Gagal", { description: e.message });
    } finally {
      setIsSending(false);
    }
  };

  const completedSteps = ocrDone ? [1] : [];

  return (
    <div className="min-h-screen bg-background">
      <AppHeader activeTab={activeTab} onTabChange={setActiveTab} />

      <main className="container max-w-5xl mx-auto px-4 pb-12">
        {activeTab === "kirim" ? (
          <>
            <StepIndicator
              currentStep={step}
              steps={STEPS}
              completedSteps={completedSteps}
            />

            {step === 1 && (
              <Step1Scan
                form={form}
                preview={preview}
                file={file}
                isScanning={isScanning}
                ocrDone={ocrDone}
                onFile={handleFile}
                onClearFile={handleClearFile}
                onScan={handleScan}
                onNext={() => setStep(2)}
              />
            )}

            {step === 2 && (
              <Step2Send
                form={form}
                isSending={isSending}
                onFormChange={handleFormChange}
                onBack={() => setStep(1)}
                onSend={handleSend}
              />
            )}
          </>
        ) : (
          <div className="pt-6">
            <div className="flex items-center gap-2 mb-6">
              <ClipboardList className="w-5 h-5 text-primary" />
              <h2 className="text-lg font-semibold">Log Operasi</h2>
            </div>
            <LogTeguran />
          </div>
        )}
      </main>

      <Toaster />
    </div>
  );
}