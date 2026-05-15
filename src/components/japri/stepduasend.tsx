"use client";

import { ArrowLeft, Send, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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

interface Step2SendProps {
  form: FormData;
  isSending: boolean;
  onFormChange: (key: keyof FormData, value: string) => void;
  onBack: () => void;
  onSend: () => void;
}

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

function FieldGroup({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-3">
      <p className="text-xs font-semibold text-primary uppercase tracking-wider">
        {label}
      </p>
      {children}
    </div>
  );
}

function FormField({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs text-muted-foreground">
        {label}
        {required && <span className="text-destructive ml-0.5">*</span>}
      </Label>
      {children}
    </div>
  );
}

export function Step2Send({
  form,
  isSending,
  onFormChange,
  onBack,
  onSend,
}: Step2SendProps) {
  const canSend =
    !isSending && !!form.nomorPolisi && !!form.namaPemilik && !!form.email;

  return (
    <div className="space-y-4">
      {/* Page Header */}
      <div className="flex items-center gap-3">
        <Button variant="outline" size="icon" onClick={onBack} className="shrink-0 h-8 w-8">
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div>
          <h2 className="text-base font-semibold">Verifikasi & Kirim</h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Periksa data dan lengkapi informasi pengiriman
          </p>
        </div>
      </div>

      {/* Two-column on desktop */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Left: Kendaraan + Biaya */}
        <div className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Data Kendaraan</CardTitle>
              <CardDescription>Informasi kendaraan dari STNK</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <FieldGroup label="Identitas Kendaraan">
                <div className="grid grid-cols-2 gap-3">
                  <FormField label="Nomor Polisi" required>
                    <Input
                      value={form.nomorPolisi}
                      onChange={(e) => onFormChange("nomorPolisi", e.target.value)}
                      placeholder="DD 1234 ABC"
                      className="uppercase h-9 text-sm"
                    />
                  </FormField>
                  <FormField label="Total Tunggakan" required>
                    <Input
                      value={form.totalPembayaran}
                      onChange={(e) => onFormChange("totalPembayaran", e.target.value)}
                      placeholder="Rp 500.000"
                      className="h-9 text-sm"
                    />
                  </FormField>
                </div>
                <FormField label="Nama Pemilik" required>
                  <Input
                    value={form.namaPemilik}
                    onChange={(e) => onFormChange("namaPemilik", e.target.value)}
                    placeholder="Nama sesuai STNK"
                    className="h-9 text-sm"
                  />
                </FormField>
                <div className="grid grid-cols-2 gap-3">
                  <FormField label="Merk">
                    <Input
                      value={form.merk}
                      onChange={(e) => onFormChange("merk", e.target.value)}
                      placeholder="YAMAHA"
                      className="h-9 text-sm"
                    />
                  </FormField>
                  <FormField label="Type">
                    <Input
                      value={form.type}
                      onChange={(e) => onFormChange("type", e.target.value)}
                      placeholder="B6H-F A/T"
                      className="h-9 text-sm"
                    />
                  </FormField>
                  <FormField label="Tahun Buat">
                    <Input
                      value={form.tahunBuat}
                      onChange={(e) => onFormChange("tahunBuat", e.target.value)}
                      placeholder="2023"
                      className="h-9 text-sm"
                    />
                  </FormField>
                  <FormField label="Warna TNKB">
                    <Input
                      value={form.warnaTnkb}
                      onChange={(e) => onFormChange("warnaTnkb", e.target.value)}
                      placeholder="Putih"
                      className="h-9 text-sm"
                    />
                  </FormField>
                </div>
                <FormField label="Masa Berlaku">
                  <Input
                    value={form.masaBerlaku}
                    onChange={(e) => onFormChange("masaBerlaku", e.target.value)}
                    placeholder="13-06-2026"
                    className="h-9 text-sm"
                  />
                </FormField>
              </FieldGroup>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Informasi Biaya</CardTitle>
              <CardDescription>Rincian tagihan dan tunggakan</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                {biayaFields.map(({ label, key }) => (
                  <FormField key={key} label={label}>
                    <Input
                      value={form[key]}
                      onChange={(e) => onFormChange(key, e.target.value)}
                      placeholder="0"
                      className="h-9 text-sm"
                    />
                  </FormField>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right: Pengiriman */}
        <div className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Informasi Pengiriman</CardTitle>
              <CardDescription>Data petugas dan penerima teguran</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <FormField label="Email Penerima" required>
                <Input
                  value={form.email}
                  onChange={(e) => onFormChange("email", e.target.value)}
                  placeholder="email@example.com"
                  type="email"
                  className="h-9 text-sm"
                />
              </FormField>
              <FormField label="Nama Petugas">
                <Input
                  value={form.petugasNama}
                  onChange={(e) => onFormChange("petugasNama", e.target.value)}
                  placeholder="Nama petugas operasi"
                  className="h-9 text-sm"
                />
              </FormField>
              <FormField label="Catatan Operasi">
                <Textarea
                  value={form.catatanOperasi}
                  onChange={(e) => onFormChange("catatanOperasi", e.target.value)}
                  placeholder="Lokasi operasi, kondisi, dll..."
                  className="resize-none text-sm"
                  rows={4}
                />
              </FormField>
            </CardContent>
          </Card>

          {/* Send Button - sticky on mobile */}
          <div className="lg:sticky lg:top-20">
            <Button
              onClick={onSend}
              disabled={!canSend}
              className="w-full h-11"
              size="lg"
            >
              {isSending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Mengirim Teguran...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Kirim Teguran via Email
                </>
              )}
            </Button>
            <p className="text-xs text-muted-foreground text-center mt-2">
              * Nomor Polisi, Nama Pemilik, dan Email wajib diisi
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}