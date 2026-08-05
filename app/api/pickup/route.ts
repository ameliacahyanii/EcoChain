import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

// Helper function to calculate Haversine distance between two coordinates in KM
function calculateHaversineDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth's radius in KM
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Number((R * c).toFixed(2));
}

// MOCK VERIFIED PEMULUNG LOCATIONS FOR TIER 1 & TIER 2 DEMO
const MOCK_PEMULUNG_PARTNERS = [
  {
    id: "pemulung-001",
    full_name: "Pak Budi (Pemulung Mitra)",
    phone_number: "081234567891",
    role: "pemulung",
    latitude: -6.2088,
    longitude: 106.8456,
    is_verified_partner: true,
    vehicle: "Gerobak Motor EcoRoute",
  },
  {
    id: "pemulung-002",
    full_name: "Pak Maman (Pemulung Mitra)",
    phone_number: "081298765432",
    role: "pemulung",
    latitude: -6.215,
    longitude: 106.85,
    is_verified_partner: true,
    vehicle: "Sepeda Sepeda Roda Tiga",
  },
];

// POST: Buat Permintaan Jemput On-Demand Baru (EcoRoute Engine)
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      requester_id,
      pickup_address,
      latitude,
      longitude,
      preferred_time_preset,
      scan_id,
      notes,
    } = body;

    if (!pickup_address || latitude === undefined || longitude === undefined) {
      return NextResponse.json(
        { error: "Alamat dan koordinat lokasi penjemputan wajib diisi" },
        { status: 400 }
      );
    }

    // Hitung estimasi waktu penjemputan dari preset
    const now = new Date();
    let preferredTime = new Date(now.getTime() + 30 * 60 * 1000); // Default 30 min
    if (preferred_time_preset === "Nanti Sore") {
      preferredTime.setHours(16, 0, 0, 0);
    } else if (preferred_time_preset === "Besok Pagi") {
      preferredTime.setDate(preferredTime.getDate() + 1);
      preferredTime.setHours(9, 0, 0, 0);
    }

    // Tier 1 logic: Cari Pemulung Mitra dalam radius 2km
    const userLat = Number(latitude);
    const userLon = Number(longitude);

    const nearbyPemulungTier1 = MOCK_PEMULUNG_PARTNERS.filter((p) => {
      const dist = calculateHaversineDistance(userLat, userLon, p.latitude, p.longitude);
      return dist <= 2.0;
    });

    const newPickupId = `pickup-${Date.now()}`;
    const newRequest = {
      id: newPickupId,
      requester_id: requester_id || "demo-user-rt",
      pickup_address,
      latitude: userLat,
      longitude: userLon,
      preferred_time: preferredTime.toISOString(),
      status: "searching",
      fallback_tier: 1,
      created_at: new Date().toISOString(),
      response_deadline: new Date(Date.now() + 5 * 60 * 1000).toISOString(), // 5 menit deadline Tier 1
      notes: notes || "",
      scan_id: scan_id || null,
      matched_pemulung_count: Math.max(1, nearbyPemulungTier1.length),
    };

    // Simpan ke Supabase jika memungkinkan
    try {
      await supabase.from("pickup_requests").insert({
        id: newRequest.id,
        requester_id: newRequest.requester_id,
        pickup_address: newRequest.pickup_address,
        latitude: newRequest.latitude,
        longitude: newRequest.longitude,
        preferred_time: newRequest.preferred_time,
        status: newRequest.status,
        fallback_tier: newRequest.fallback_tier,
      });
    } catch {
      // Fallback local state if DB table not connected yet
    }

    return NextResponse.json({
      success: true,
      data: newRequest,
      message: "Permintaan penjemputan berhasil dikirim ke Pemulung Mitra terdekat (Tier 1: Radius 2km).",
    });
  } catch (error) {
    console.error("Pickup API Error:", error);
    return NextResponse.json(
      { error: "Gagal membuat permintaan penjemputan" },
      { status: 500 }
    );
  }
}

// GET: Ambil daftar permintaan penjemputan aktif (untuk Pemulung Mitra / User)
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const role = searchParams.get("role") || "pemulung";
  const userLat = parseFloat(searchParams.get("lat") || "-6.2088");
  const userLon = parseFloat(searchParams.get("lon") || "106.8456");

  // Sample active requests
  const sampleRequests = [
    {
      id: "pickup-demo-01",
      requester_name: "Ibu Ratna (Rumah Tangga)",
      requester_phone: "081234567800",
      pickup_address: "Jl. Tebet Raya No. 42, Jakarta Selatan",
      latitude: -6.2205,
      longitude: 106.8525,
      preferred_time: "Sekarang (Segera)",
      status: "searching",
      fallback_tier: 1,
      category_name: "Plastik PET & Kertas Kardus",
      estimated_weight_kg: 8.5,
      distance_km: calculateHaversineDistance(userLat, userLon, -6.2205, 106.8525),
      created_at: new Date(Date.now() - 3 * 60 * 1000).toISOString(),
    },
    {
      id: "pickup-demo-02",
      requester_name: "Bpk. Hendra",
      requester_phone: "081399887766",
      pickup_address: "Jl. Pancoran Barat III No. 12",
      latitude: -6.245,
      longitude: 106.838,
      preferred_time: "Nanti Sore (16.00 WIB)",
      status: "searching",
      fallback_tier: 2,
      category_name: "Elektronik - Laptop & Kabel Tembaga",
      estimated_weight_kg: 3.0,
      distance_km: calculateHaversineDistance(userLat, userLon, -6.245, 106.838),
      created_at: new Date(Date.now() - 7 * 60 * 1000).toISOString(),
    },
  ];

  return NextResponse.json({
    success: true,
    requests: sampleRequests,
  });
}

// PATCH: Terima Orderan / Update Status / Eskalasi Tier Fallback
export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { pickup_id, action, pemulung_id, new_tier } = body;

    let updatedStatus = "searching";
    let updatedTier = 1;
    let assignedPemulung = null;

    if (action === "accept") {
      updatedStatus = "assigned";
      assignedPemulung = MOCK_PEMULUNG_PARTNERS[0];
    } else if (action === "start_journey") {
      updatedStatus = "on_the_way";
    } else if (action === "complete") {
      updatedStatus = "completed";
    } else if (action === "escalate_tier") {
      updatedTier = new_tier || 2;
      if (updatedTier >= 3) {
        updatedStatus = "fallback_kurir";
      }
    }

    return NextResponse.json({
      success: true,
      pickup_id,
      status: updatedStatus,
      fallback_tier: updatedTier,
      assigned_pemulung: assignedPemulung,
      message:
        action === "accept"
          ? "Orderan berhasil diterima! Pemulung Mitra siap menuju lokasi."
          : action === "escalate_tier"
          ? `Tingkat penjemputan dinaikkan ke Tier ${updatedTier}.`
          : "Status penjemputan diperbarui.",
    });
  } catch (error) {
    console.error("Pickup PATCH Error:", error);
    return NextResponse.json(
      { error: "Gagal memperbarui status penjemputan" },
      { status: 500 }
    );
  }
}
