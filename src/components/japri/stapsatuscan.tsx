"use client";

import { useRef } from "react";
import {
  ImageIcon,
  X,
  CheckCircle2,
  ScanLine,
  Loader2,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

interface FormData {
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

interface Step1ScanProps {
  form: FormData;
  preview: string | null;
  file: File | null;
  isScanning: boolean;
  ocrDone: boolean;
  onFile: (f: File) => void;
  onClearFile: () => void;
  onScan: () => void;
  onNext: () => void;
}

const vehicleFields: { label: string; key: keyof FormData }[] = [
  { label: "Nomor Polisi", key: "nomorPolisi" },
  { label: "Nama Pemilik", key: "namaPemilik" },
  { label: "Merk", key: "merk" },
  { label: "Type", key: "type" },
  { label: "Tahun Buat", key: "tahunBuat" },
  { label: "Warna TNKB", key: "warnaTnkb" },
  { label: "Masa Berlaku", key: "masaBerlaku" },
];

const biayaFields: { label: string; key: keyof FormData }[] = [
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
];

export function Step1Scan({
  form,
  preview,
  file,
  isScanning,
  ocrDone,
  onFile,
  onClearFile,
  onScan,
  onNext,
}: Step1ScanProps) {
  const fileRef = useRef<HTMLInputElement>(null);

  // Optimasi 1: Memberikan strict type pada event React untuk HTMLDivElement
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const f = e.dataTransfer.files[0];
    if (f && f.type.startsWith("image/")) onFile(f);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Left: Upload */}
      <div className="space-y-4">
        <div>
          <h2 className="text-base font-semibold">Unggah Screenshot</h2>
          <p className="text-sm text-muted-foreground mt-0.5">
            Screenshot dari aplikasi Mobile Bapenda
          </p>
        </div>

        {/* Drop Zone */}
        <div
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          className="relative rounded-xl overflow-hidden border-2 border-dashed border-border bg-muted/30 hover:bg-muted/50 transition-colors"
        >
          {preview ? (
            <div className="relative">
              {/* Catatan: Tag <img> standar sudah sangat tepat untuk URL.createObjectURL (blob) di Next.js */}
              <img
                src={preview}
                alt="Preview"
                className="w-full max-h-80 object-contain"
              />
              <button
                type="button"
                onClick={onClearFile}
                className="absolute top-3 right-3 rounded-full bg-background/80 backdrop-blur-sm border p-1.5 shadow-sm hover:bg-background transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
              {ocrDone && (
                <div className="absolute bottom-3 left-3">
                  <Badge variant="default" className="gap-1.5 bg-green-600 hover:bg-green-600">
                    <CheckCircle2 className="w-3 h-3" />
                    Data berhasil diekstrak
                  </Badge>
                </div>
              )}
            </div>
          ) : (
            <label
              htmlFor="file-upload"
              className="flex flex-col items-center justify-center gap-3 cursor-pointer py-16 px-6"
            >
              <div className="w-14 h-14 rounded-2xl bg-muted flex items-center justify-center border">
                <ImageIcon className="w-7 h-7 text-muted-foreground" />
              </div>
              <div className="text-center">
                <p className="text-sm font-medium">Tap untuk upload</p>
                <p className="text-xs text-muted-foreground mt-1">
                  atau drag & drop · PNG, JPG, WEBP
                </p>
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
          // Optimasi 2: Memberikan strict type pada event Change untuk HTMLInputElement
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            const f = e.target.files?.[0];
            if (f) onFile(f);
          }}
        />

        {/* Action Buttons - Komponen ini sudah benar dan akan otomatis mengikuti preset jika globals.css sudah ter-update */}
        <div className="flex gap-2">
          <Button
            onClick={onScan}
            disabled={!file || isScanning}
            className="flex-1"
          >
            {isScanning ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Memindai...
              </>
            ) : (
              <>
                <ScanLine className="w-4 h-4 mr-2" />
                Pindai OCR
              </>
            )}
          </Button>
          <Button
            variant="outline"
            onClick={onNext}
            disabled={!ocrDone}
            className="flex-1"
          >
            Lanjut
            <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
      </div>

      {/* Right: OCR Result */}
      <div>
        {ocrDone ? (
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm">Hasil OCR</CardTitle>
                <Badge variant="outline" className="text-green-600 border-green-600 gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  Berhasil
                </Badge>
              </div>
              <CardDescription>Periksa data sebelum melanjutkan</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Vehicle Info */}
              <div>
                <p className="text-xs font-semibold text-primary uppercase tracking-wider mb-2">
                  Informasi Kendaraan
                </p>
                <dl className="space-y-1.5">
                  {vehicleFields.map(({ label, key }) => (
                    <div key={key} className="flex justify-between items-center gap-4">
                      <dt className="text-xs text-muted-foreground shrink-0">{label}</dt>
                      <dd className="text-xs font-medium text-right truncate">
                        {form[key] || "—"}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>

              <Separator />

              {/* Biaya Info */}
              <div>
                <p className="text-xs font-semibold text-primary uppercase tracking-wider mb-2">
                  Informasi Biaya
                </p>
                <dl className="space-y-1.5">
                  {biayaFields.map(({ label, key }) => (
                    <div key={key} className="flex justify-between items-center gap-4">
                      <dt className="text-xs text-muted-foreground shrink-0">{label}</dt>
                      <dd className="text-xs font-medium text-right">{form[key] || "0"}</dd>
                    </div>
                  ))}
                </dl>
                <Separator className="my-2" />
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-primary">Total Pembayaran</span>
                  <span className="text-sm font-bold text-destructive">
                    {form.totalPembayaran || "0"}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="h-full min-h-48 flex items-center justify-center">
            <CardContent className="text-center py-12">
              <ScanLine className="w-10 h-10 text-muted-foreground/40 mx-auto mb-3" />
              <p className="text-sm text-muted-foreground">
                Hasil OCR akan tampil di sini
              </p>
              <p className="text-xs text-muted-foreground/60 mt-1">
                Upload gambar lalu klik "Pindai OCR"
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}