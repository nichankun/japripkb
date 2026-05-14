import { NextResponse } from "next/server";
import { db } from "@/db";
import { teguran } from "@/db/database/schema";
import { desc } from "drizzle-orm";

export async function GET() {
  try {
    const data = await db
      .select()
      .from(teguran)
      .orderBy(desc(teguran.createdAt))
      .limit(100);

    return NextResponse.json(data);
  } catch (error) {
    console.error("Log Error:", error);
    return NextResponse.json({ error: "Gagal mengambil data" }, { status: 500 });
  }
}