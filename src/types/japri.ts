export interface OcrResult {
  nomorPolisi: string;
  namaPemilik: string;
  totalPembayaran: string;
}

export interface FormState {
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

export type ActiveTab = "kirim" | "log";
export type Step = 1 | 2;