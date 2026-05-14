"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, CheckCircle2, Clock } from "lucide-react";
import { Teguran } from "@/db/database/schema";

export default function LogTeguran() {
  const [data, setData] = useState<Teguran[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/log-teguran")
      .then((r) => r.json())
      .then((d) => setData(d))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16 text-slate-500">
        <Loader2 className="w-6 h-6 animate-spin mr-2" />
        Memuat log...
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="text-center py-16 text-slate-500">
        <Clock className="w-10 h-10 mx-auto mb-3 opacity-30" />
        <p>Belum ada teguran yang dikirim</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <p className="text-slate-500 text-xs">{data.length} teguran tercatat</p>
      {data.map((item) => (
        <Card key={item.id} className="bg-slate-900 border-slate-800">
          <CardContent className="p-4">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-bold text-white text-sm">{item.nomorPolisi}</span>
                  <Badge className="bg-green-900 text-green-400 text-[10px]">
                    <CheckCircle2 className="w-3 h-3 mr-1" />
                    {item.statusPengiriman}
                  </Badge>
                </div>
                <p className="text-slate-300 text-sm truncate">{item.namaPemilik}</p>
                <p className="text-blue-400 text-sm font-medium">{item.totalPembayaran}</p>
                {item.petugasNama && (
                  <p className="text-slate-500 text-xs mt-1">Petugas: {item.petugasNama}</p>
                )}
              </div>
              <div className="text-right shrink-0">
                <p className="text-slate-500 text-xs">
                  {new Date(item.createdAt).toLocaleDateString("id-ID", {
                    day: "numeric",
                    month: "short",
                  })}
                </p>
                <p className="text-slate-600 text-xs">
                  {new Date(item.createdAt).toLocaleTimeString("id-ID", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </div>
            {item.catatanOperasi && (
              <p className="text-slate-600 text-xs mt-2 border-t border-slate-800 pt-2">
                📍 {item.catatanOperasi}
              </p>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}