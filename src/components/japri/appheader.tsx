"use client";

import { ScanLine } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

type ActiveTab = "kirim" | "log";

interface AppHeaderProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
}

export function AppHeader({ activeTab, onTabChange }: AppHeaderProps) {
  return (
    <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="container max-w-5xl mx-auto px-4 h-14 flex items-center justify-between gap-4">
        {/* Brand */}
        <div className="flex items-center gap-2.5 shrink-0">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center shadow-sm">
            <ScanLine className="w-4 h-4 text-primary-foreground" />
          </div>
          <div className="hidden sm:block">
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm tracking-tight">JAPRI PKB</span>
              <Badge variant="secondary" className="text-[10px] px-1.5 py-0 h-4">
                Bapenda
              </Badge>
            </div>
            <p className="text-[10px] text-muted-foreground leading-none">
              Sistem Teguran Digital
            </p>
          </div>
          <span className="font-bold text-sm tracking-tight sm:hidden">JAPRI PKB</span>
        </div>

        {/* Tab Navigation */}
        <Tabs value={activeTab} onValueChange={(v) => onTabChange(v as ActiveTab)}>
          <TabsList className="h-8">
            <TabsTrigger value="kirim" className="text-xs px-4 h-7">
              Kirim Teguran
            </TabsTrigger>
            <TabsTrigger value="log" className="text-xs px-4 h-7">
              Log Operasi
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
    </header>
  );
}