import { pgTable, serial, text, timestamp, varchar } from "drizzle-orm/pg-core";

export const teguran = pgTable("teguran", {
  id: serial("id").primaryKey(),

  // Identitas kendaraan
  nomorPolisi: varchar("nomor_polisi", { length: 20 }).notNull(),
  namaPemilik: text("nama_pemilik").notNull(),
  merk: varchar("merk", { length: 50 }),
  type: varchar("type", { length: 50 }),
  tahunBuat: varchar("tahun_buat", { length: 10 }),
  warnaTnkb: varchar("warna_tnkb", { length: 30 }),
  masaBerlaku: varchar("masa_berlaku", { length: 20 }),

  // Rincian biaya
  pkb: varchar("pkb", { length: 50 }),
  tunggakanPkb: varchar("tunggakan_pkb", { length: 50 }),
  dendaPkb: varchar("denda_pkb", { length: 50 }),
  swdkllj: varchar("swdkllj", { length: 50 }),
  tunggakanSwdkllj: varchar("tunggakan_swdkllj", { length: 50 }),
  dendaSwdkllj: varchar("denda_swdkllj", { length: 50 }),
  opsenPkb: varchar("opsen_pkb", { length: 50 }),
  dendaOpsen: varchar("denda_opsen", { length: 50 }),
  tunggakanOpsen: varchar("tunggakan_opsen", { length: 50 }),
  stnkStick: varchar("stnk_stick", { length: 50 }),
  platNomor: varchar("plat_nomor", { length: 50 }),
  totalPembayaran: varchar("total_pembayaran", { length: 50 }).notNull(),

  // Pengiriman & operasi
  nomorWa: varchar("nomor_wa", { length: 100 }).notNull(),
  statusPengiriman: varchar("status_pengiriman", { length: 20 })
    .notNull()
    .default("terkirim"),
  petugasNama: text("petugas_nama"),
  catatanOperasi: text("catatan_operasi"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type Teguran = typeof teguran.$inferSelect;
export type NewTeguran = typeof teguran.$inferInsert;