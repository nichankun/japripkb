import { pgTable, serial, text, timestamp, varchar } from "drizzle-orm/pg-core";

export const teguran = pgTable("teguran", {
  id: serial("id").primaryKey(),
  nomorPolisi: varchar("nomor_polisi", { length: 20 }).notNull(),
  namaPemilik: text("nama_pemilik").notNull(),
  totalPembayaran: varchar("total_pembayaran", { length: 50 }).notNull(),
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