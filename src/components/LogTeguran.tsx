"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription // Optimasi: Menambahkan import DrawerDescription untuk aksesibilitas
} from "@/components/ui/drawer";
import {
  Loader2,
  CheckCircle2,
  Clock,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Car,
  Receipt,
  User,
  Mail,
} from "lucide-react";
import { Teguran } from "@/db/database/schema";

const PAGE_SIZE = 8;

// ---------- Detail Content ----------
function DetailContent({ item }: { item: Teguran }) {
  const biayaRows = [
    { label: "PKB", value: item.pkb },
    { label: "Tunggakan PKB", value: item.tunggakanPkb },
    { label: "Denda PKB", value: item.dendaPkb },
    { label: "SWDKLLJ", value: item.swdkllj },
    { label: "Tunggakan SWDKLLJ", value: item.tunggakanSwdkllj },
    { label: "Denda SWDKLLJ", value: item.dendaSwdkllj },
    { label: "Opsen PKB", value: item.opsenPkb },
    { label: "Denda Opsen", value: item.dendaOpsen },
    { label: "Tunggakan Opsen", value: item.tunggakanOpsen },
    { label: "STNK / Stick", value: item.stnkStick },
    { label: "Plat Nomor / DT", value: item.platNomor },
  ];

  const kendaraanRows = [
    { label: "Nomor Polisi", value: item.nomorPolisi },
    { label: "Nama Pemilik", value: item.namaPemilik },
    { label: "Merk", value: item.merk },
    { label: "Type", value: item.type },
    { label: "Tahun Buat", value: item.tahunBuat },
    { label: "Warna TNKB", value: item.warnaTnkb },
    { label: "Masa Berlaku", value: item.masaBerlaku },
  ];

  return (
    <div className="space-y-5 px-1">
      {/* Header badge */}
      <div className="flex items-center gap-2 flex-wrap">
        <Badge variant="outline" className="gap-1 text-green-600 border-green-500">
          <CheckCircle2 className="w-3 h-3" />
          {item.statusPengiriman}
        </Badge>
        <span className="text-xs text-muted-foreground">
          {new Date(item.createdAt).toLocaleString("id-ID", {
            day: "numeric",
            month: "long",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          })}
        </span>
      </div>

      {/* Kendaraan */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-xs font-semibold text-primary uppercase tracking-wider">
          <Car className="w-3.5 h-3.5" />
          Informasi Kendaraan
        </div>
        <div className="grid grid-cols-2 gap-x-6 gap-y-2.5">
          {kendaraanRows.map(({ label, value }) => (
            <div key={label}>
              <p className="text-[10px] text-muted-foreground">{label}</p>
              <p className="text-sm font-medium">{value || "—"}</p>
            </div>
          ))}
        </div>
      </div>

      <Separator />

      {/* Biaya */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-xs font-semibold text-primary uppercase tracking-wider">
          <Receipt className="w-3.5 h-3.5" />
          Rincian Biaya
        </div>
        <div className="space-y-1.5">
          {biayaRows.map(({ label, value }) => (
            <div key={label} className="flex justify-between items-center">
              <span className="text-xs text-muted-foreground">{label}</span>
              <span className="text-xs font-medium">{value || "0"}</span>
            </div>
          ))}
        </div>
        <Separator />
        <div className="flex justify-between items-center pt-0.5">
          <span className="text-sm font-bold">Total Pembayaran</span>
          <span className="text-sm font-bold text-destructive">{item.totalPembayaran}</span>
        </div>
      </div>

      <Separator />

      {/* Operasi */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-xs font-semibold text-primary uppercase tracking-wider">
          <User className="w-3.5 h-3.5" />
          Info Operasi
        </div>
        <div className="space-y-2.5">
          {item.petugasNama && (
            <div>
              <p className="text-[10px] text-muted-foreground">Petugas</p>
              <p className="text-sm font-medium">{item.petugasNama}</p>
            </div>
          )}
          {item.nomorWa && (
            <div className="flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 shrink-0 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">{item.nomorWa}</span>
            </div>
          )}
          {item.catatanOperasi && (
            <div className="flex items-start gap-1.5">
              <MapPin className="w-3.5 h-3.5 shrink-0 mt-0.5 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">{item.catatanOperasi}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ---------- Main Component ----------
export default function LogTeguran() {
  const [data, setData] = useState<Teguran[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<Teguran | null>(null);
  const [error, setError] = useState<string | null>(null); // State error handling

  // Simple media query — true = desktop (md+)
  const [isDesktop, setIsDesktop] = useState(false);
  
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    setIsDesktop(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsDesktop(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  // Optimasi: Fetch API dengan penanganan error yang lebih aman (Type Safe + Fallback)
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const r = await fetch("/api/log-teguran");
        if (!r.ok) throw new Error("Gagal mengambil data log");
        const d: Teguran[] = await r.json();
        setData(d);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Terjadi kesalahan yang tidak diketahui");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const totalPages = Math.ceil(data.length / PAGE_SIZE);
  const paginated = data.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 text-muted-foreground">
        <Loader2 className="w-5 h-5 animate-spin mr-2" />
        <span className="text-sm">Memuat log...</span>
      </div>
    );
  }
  
  // Handling jika terjadi error saat memuat data
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-destructive">
        <p className="text-sm font-semibold">Gagal memuat log</p>
        <p className="text-xs">{error}</p>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
        <Clock className="w-10 h-10 mb-3 opacity-30" />
        <p className="text-sm">Belum ada teguran yang dikirim</p>
      </div>
    );
  }

  const dialogTitle = selected
    ? `${selected.nomorPolisi} · ${selected.namaPemilik}`
    : "";

  return (
    <>
      <div className="flex flex-col gap-4">
        {/* Summary */}
        <div className="flex items-center justify-between">
          <p className="text-xs text-muted-foreground">
            {data.length} teguran tercatat · halaman {page} dari {totalPages}
          </p>
          <Badge variant="secondary" className="text-xs">
            {PAGE_SIZE} per halaman
          </Badge>
        </div>

        {/* Log List */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {paginated.map((item) => (
            <Card
              key={item.id}
              className="overflow-hidden cursor-pointer hover:bg-muted/40 transition-colors"
              onClick={() => setSelected(item)}
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-sm tracking-wide">
                        {item.nomorPolisi}
                      </span>
                      <Badge
                        variant="outline"
                        className="text-[10px] gap-1 text-green-600 border-green-500 px-1.5 py-0 h-4"
                      >
                        <CheckCircle2 className="w-2.5 h-2.5" />
                        {item.statusPengiriman}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground truncate">
                      {item.namaPemilik}
                    </p>
                    <p className="text-sm font-semibold text-primary">
                      {item.totalPembayaran}
                    </p>
                    {item.petugasNama && (
                      <p className="text-xs text-muted-foreground">
                        Petugas: {item.petugasNama}
                      </p>
                    )}
                  </div>

                  <div className="text-right shrink-0">
                    <p className="text-xs font-medium">
                      {new Date(item.createdAt).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "short",
                      })}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(item.createdAt).toLocaleTimeString("id-ID", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>

                {item.catatanOperasi && (
                  <p className="text-xs text-muted-foreground mt-3 pt-3 border-t flex items-start gap-1.5">
                    <MapPin className="w-3 h-3 shrink-0 mt-0.5" />
                    <span className="line-clamp-2">{item.catatanOperasi}</span>
                  </p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 pt-2">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>

            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <Button
                  key={p}
                  variant={p === page ? "default" : "ghost"}
                  size="icon"
                  className="h-8 w-8 text-xs"
                  onClick={() => setPage(p)}
                >
                  {p}
                </Button>
              ))}
            </div>

            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        )}
      </div>

      {/* Desktop: Dialog */}
      {isDesktop && (
        <Dialog open={!!selected} onOpenChange={(open) => !open && setSelected(null)}>
          <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-base">{dialogTitle}</DialogTitle>
               <DialogDescription className="sr-only">
                Detail riwayat teguran untuk kendaraan {selected?.nomorPolisi}
               </DialogDescription>
            </DialogHeader>
            {selected && <DetailContent item={selected} />}
          </DialogContent>
        </Dialog>
      )}

      {/* Mobile: Drawer (slides up from bottom) */}
      {!isDesktop && (
        <Drawer open={!!selected} onOpenChange={(open) => !open && setSelected(null)}>
          <DrawerContent className="max-h-[90vh]">
            <DrawerHeader className="pb-2">
              <DrawerTitle className="text-base text-left">{dialogTitle}</DrawerTitle>
              {/* Optimasi Aksesibilitas: Menambahkan DrawerDescription yang wajib pada versi terbaru shadcn */}
              <DrawerDescription className="sr-only">
                Detail riwayat teguran untuk kendaraan {selected?.nomorPolisi}
              </DrawerDescription>
            </DrawerHeader>
            <div className="overflow-y-auto px-4 pb-6">
              {selected && <DetailContent item={selected} />}
            </div>
          </DrawerContent>
        </Drawer>
      )}
    </>
  );
}