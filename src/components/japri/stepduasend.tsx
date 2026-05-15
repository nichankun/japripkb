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

  const handleInputChange = (key: keyof FormData) => (e: React.ChangeEvent<HTMLInputElement>) => {
    onFormChange(key, e.target.value);
  };

  const handleTextareaChange = (key: keyof FormData) => (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onFormChange(key, e.target.value);
  };

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
        {/* Left: Kendaraan (Read Only) */}
        <div className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Data Kendaraan</CardTitle>
              <CardDescription>Informasi kendaraan dari STNK (Terkunci)</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <FieldGroup label="Identitas Kendaraan">
                <div className="grid grid-cols-2 gap-3">
                  <FormField label="Nomor Polisi" required>
                    <Input
                      value={form.nomorPolisi}
                      readOnly
                      placeholder="DD 1234 ABC"
                      className="uppercase h-9 text-sm bg-muted/50 cursor-default focus-visible:ring-0"
                    />
                  </FormField>
                  <FormField label="Total Tunggakan" required>
                    <Input
                      value={form.totalPembayaran}
                      readOnly
                      placeholder="Rp 500.000"
                      className="h-9 text-sm bg-muted/50 cursor-default focus-visible:ring-0"
                    />
                  </FormField>
                </div>
                <FormField label="Nama Pemilik" required>
                  <Input
                    value={form.namaPemilik}
                    readOnly
                    placeholder="Nama sesuai STNK"
                    className="h-9 text-sm bg-muted/50 cursor-default focus-visible:ring-0"
                  />
                </FormField>
                <div className="grid grid-cols-2 gap-3">
                  <FormField label="Merk">
                    <Input
                      value={form.merk}
                      readOnly
                      placeholder="YAMAHA"
                      className="h-9 text-sm bg-muted/50 cursor-default focus-visible:ring-0"
                    />
                  </FormField>
                  <FormField label="Type">
                    <Input
                      value={form.type}
                      readOnly
                      placeholder="B6H-F A/T"
                      className="h-9 text-sm bg-muted/50 cursor-default focus-visible:ring-0"
                    />
                  </FormField>
                  <FormField label="Tahun Buat">
                    <Input
                      value={form.tahunBuat}
                      readOnly
                      placeholder="2023"
                      className="h-9 text-sm bg-muted/50 cursor-default focus-visible:ring-0"
                    />
                  </FormField>
                  <FormField label="Warna TNKB">
                    <Input
                      value={form.warnaTnkb}
                      readOnly
                      placeholder="Putih"
                      className="h-9 text-sm bg-muted/50 cursor-default focus-visible:ring-0"
                    />
                  </FormField>
                </div>
                <FormField label="Masa Berlaku">
                  <Input
                    value={form.masaBerlaku}
                    readOnly
                    placeholder="13-06-2026"
                    className="h-9 text-sm bg-muted/50 cursor-default focus-visible:ring-0"
                  />
                </FormField>
              </FieldGroup>
            </CardContent>
          </Card>
        </div>

        {/* Right: Pengiriman (Editable) */}
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
                  onChange={handleInputChange("email")}
                  placeholder="email@example.com"
                  type="email"
                  className="h-9 text-sm"
                />
              </FormField>
              <FormField label="Nama Petugas">
                <Input
                  value={form.petugasNama}
                  onChange={handleInputChange("petugasNama")}
                  placeholder="Nama petugas operasi"
                  className="h-9 text-sm"
                />
              </FormField>
              <FormField label="Catatan Operasi">
                <Textarea
                  value={form.catatanOperasi}
                  onChange={handleTextareaChange("catatanOperasi")}
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