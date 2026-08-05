import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const pengepulId = searchParams.get("pengepul_id") || "pengepul-demo";

    // 1. Mock/Query Stock per Category
    const stockByCategory = [
      { category: "Kertas Kardus Cokelat", group: "kertas", weight_kg: 1250, unit_price: 2200, total_val: 2750000 },
      { category: "Plastik PET (Botol)", group: "plastik", weight_kg: 840, unit_price: 4500, total_val: 3780000 },
      { category: "Logam Tembaga Super", group: "logam", weight_kg: 120, unit_price: 95000, total_val: 11400000 },
      { category: "Logam Aluminium", group: "logam", weight_kg: 450, unit_price: 14000, total_val: 6300000 },
      { category: "Elektronik Laptop", group: "elektronik", weight_kg: 35, unit_price: 150000, total_val: 5250000 },
    ];

    // 2. Volume Trend 7 Days
    const volume7DaysTrend = [
      { day: "Senin", volume_kg: 320, value_rp: 1850000 },
      { day: "Selasa", volume_kg: 450, value_rp: 2900000 },
      { day: "Rabu", volume_kg: 280, value_rp: 1450000 },
      { day: "Kamis", volume_kg: 510, value_rp: 3400000 },
      { day: "Jumat", volume_kg: 620, value_rp: 4100000 },
      { day: "Sabtu", volume_kg: 780, value_rp: 5600000 },
      { day: "Minggu", volume_kg: 410, value_rp: 2700000 },
    ];

    // 3. Incoming Transactions History
    const incomingTransactions = [
      {
        id: "tx-001",
        seller_name: "Pak Budi (Pemulung Mitra)",
        category: "Plastik PET & Kardus",
        weight_kg: 45.0,
        price_rp: 215000,
        type: "pickup",
        status: "Selesai",
        date: "Hari Ini, 14:20 WIB",
      },
      {
        id: "tx-002",
        seller_name: "Ibu Siti (Rumah Tangga)",
        category: "Logam Aluminium",
        weight_kg: 12.0,
        price_rp: 168000,
        type: "drop_off",
        status: "Selesai",
        date: "Hari Ini, 11:05 WIB",
      },
      {
        id: "tx-003",
        seller_name: "Pak Maman (Pemulung)",
        category: "Elektronik Laptop Bekas",
        weight_kg: 4.0,
        price_rp: 300000,
        type: "pickup",
        status: "Diproses",
        date: "Kemarin, 16:45 WIB",
      },
    ];

    // 4. B2B Orders (EcoVault)
    const b2bOrders = [
      {
        id: "b2b-101",
        buyer_company_name: "PT Daur Ulang Nusantara",
        total_weight_kg: 2500,
        total_price: 15500000,
        escrow_status: "funded",
        created_at: "30 Juli 2026",
      },
      {
        id: "b2b-102",
        buyer_company_name: "PT Paper Recycler Indonesia",
        total_weight_kg: 5000,
        total_price: 11000000,
        escrow_status: "released",
        created_at: "25 Juli 2026",
      },
    ];

    return NextResponse.json({
      success: true,
      summary: {
        total_stock_kg: 2695,
        active_pemulung_count: 14,
        total_stock_value_rp: 29480000,
      },
      stockByCategory,
      volume7DaysTrend,
      incomingTransactions,
      b2bOrders,
    });
  } catch (error) {
    console.error("EcoHub API Error:", error);
    return NextResponse.json({ error: "Gagal mengambil data EcoHub" }, { status: 500 });
  }
}

// POST: Buat Order B2B Baru dengan Rekening Bersama EcoVault
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { buyer_company_name, category, total_weight_kg, total_price } = body;

    const newB2BOrder = {
      id: `b2b-${Date.now()}`,
      buyer_company_name,
      category,
      total_weight_kg: Number(total_weight_kg),
      total_price: Number(total_price),
      escrow_status: "funded",
      created_at: new Date().toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
      }),
    };

    // Insersi ke tabel b2b_orders jika Supabase terkoneksi
    try {
      await supabase.from("b2b_orders").insert({
        buyer_company_name: newB2BOrder.buyer_company_name,
        total_weight_kg: newB2BOrder.total_weight_kg,
        total_price: newB2BOrder.total_price,
        escrow_status: "funded",
      });
    } catch {
      // Demo fallback
    }

    return NextResponse.json({
      success: true,
      data: newB2BOrder,
      message: "Pesanan B2B berhasil dibuat! Dana pembeli telah dikunci di EcoVault Escrow ('funded').",
    });
  } catch (error) {
    console.error("B2B Order API Error:", error);
    return NextResponse.json({ error: "Gagal membuat pesanan B2B" }, { status: 500 });
  }
}
