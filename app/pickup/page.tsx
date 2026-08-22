"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { Button, Card, BigInput, StatusBadge } from "@/components/ui";
import { useAuth } from "@/lib/context/AuthContext";
import {
  Truck,
  ArrowLeft,
  MapPin,
  Clock,
  CheckCircle2,
  Phone,
  MessageSquare,
  AlertTriangle,
  Radio,
  Navigation as NavIcon,
  ChevronRight,
  ShieldCheck,
  Package,
  Loader2,
} from "lucide-react";

function PickupContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { role } = useAuth();

  // Params from EcoScan API redirect
  const queryCategory = searchParams.get("category") || "";
  const queryWeight = searchParams.get("weight") || "";
  const queryType = searchParams.get("type") || "pickup";

  // Form State
  const [address, setAddress] = useState(
    "Jl. Tebet Raya No. 42, RT.05/RW.02, Tebet Barat, Jakarta Selatan"
  );
  const [coords, setCoords] = useState<{ lat: number; lon: number }>({
    lat: -6.2205,
    lon: 106.8525,
  });
  const [timePreset, setTimePreset] = useState<"Sekarang" | "Nanti Sore" | "Besok Pagi">(
    "Sekarang"
  );
  const [notes, setNotes] = useState("");
  const [isLocating, setIsLocating] = useState(false);

  // Request & Active Job State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeRequest, setActiveRequest] = useState<any>(null);
  const [fallbackTier, setFallbackTier] = useState<number>(1);
  const [requestStatus, setRequestStatus] = useState<
    "idle" | "searching" | "assigned" | "on_the_way" | "completed" | "fallback_kurir"
  >("idle");

  // Pemulung Orders List State
  const [availableOrders, setAvailableOrders] = useState<any[]>([]);

  // Get User Geolocation
  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      alert("Browser Anda tidak mendukung deteksi lokasi otomatis.");
      return;
    }
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCoords({ lat: pos.coords.latitude, lon: pos.coords.longitude });
        setAddress(
          `Lokasi GPS Terdeteksi (${pos.coords.latitude.toFixed(4)}, ${pos.coords.longitude.toFixed(4)})`
        );
        setIsLocating(false);
      },
      () => {
        setIsLocating(false);
        alert("Gagal mengambil lokasi GPS. Silakan ketik alamat manual.");
      }
    );
  };

  // Submit Pickup Request (Household View)
  const handleSubmitRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/pickup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pickup_address: address,
          latitude: coords.lat,
          longitude: coords.lon,
          preferred_time_preset: timePreset,
          notes,
          category: queryCategory,
        }),
      });

      const json = await res.json();
      if (res.ok && json.success) {
        setActiveRequest(json.data);
        setRequestStatus("searching");
        setFallbackTier(1);
      }
    } catch {
      // Demo fallback state
      setRequestStatus("searching");
      setFallbackTier(1);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Simulate real-time progress transitions & fallback tier escalation for demo
  useEffect(() => {
    let timer1: NodeJS.Timeout | undefined;
    let timer2: NodeJS.Timeout | undefined;

    if (requestStatus === "searching") {
      // Step 1 -> Step 2 after 4 seconds (Pemulung accepts)
      timer1 = setTimeout(() => {
        setRequestStatus("assigned");
        setActiveRequest((prev: any) => ({
          ...prev,
          assigned_pemulung: {
            name: "Pak Budi",
            role: "Pemulung Mitra EcoRoute",
            phone: "081234567891",
            vehicle: "Gerobak Motor EcoRoute",
            rating: "4.9 ★",
          },
        }));
      }, 4000);
    } else if (requestStatus === "assigned") {
      // Step 2 -> Step 3 after 5 seconds (Pemulung on the way)
      timer2 = setTimeout(() => {
        setRequestStatus("on_the_way");
      }, 5000);
    }

    return () => {
      if (timer1) clearTimeout(timer1);
      if (timer2) clearTimeout(timer2);
    };
  }, [requestStatus]);

  // Fetch Available Orders for Pemulung Role
  useEffect(() => {
    if (role === "pemulung") {
      fetch("/api/pickup?role=pemulung")
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            setAvailableOrders(data.requests);
          }
        })
        .catch(() => {});
    }
  }, [role]);

  // Handle Pemulung Accepts Order
  const handleAcceptOrder = (orderId: string) => {
    setRequestStatus("assigned");
    setActiveRequest({
      id: orderId,
      requester_name: "Ibu Ratna (Rumah Tangga)",
      requester_phone: "081234567800",
      pickup_address: "Jl. Tebet Raya No. 42, Jakarta Selatan",
      category_name: queryCategory || "Plastik PET & Kertas Kardus",
      estimated_weight_kg: queryWeight || "8.5",
    });
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Mode Banner Drop-off vs Pickup */}
      {queryType === "drop_off" && (
        <Card className="bg-[#DCFCE7] border-2 border-[#16A34A] p-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-[#16A34A] text-white rounded-xl">
              <MapPin className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#166534]">EcoPoint Terdekat Aktif</h3>
              <p className="text-xs text-[#15803D]">
                Lapak Jaya Cilandak • Buka s/d 17.00 WIB (Jarak 0.6 km)
              </p>
            </div>
          </div>
          <Link href="https://maps.google.com" target="_blank">
            <Button variant="primary" className="text-xs py-2 px-3 min-h-[40px]">
              Petunjuk Arah
            </Button>
          </Link>
        </Card>
      )}

      {/* ==================================================================== */}
      {/* SECTION A: PEMULUNG MITRA VIEW (Daftar Orderan Terdekat)             */}
      {/* ==================================================================== */}
      {role === "pemulung" && requestStatus === "idle" && (
        <div className="flex flex-col gap-4 animate-in fade-in">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-[#111827] flex items-center gap-2">
              <Radio className="w-5 h-5 text-[#16A34A] animate-pulse" />
              Permintaan Jemput Aktif di Sekitar Anda
            </h2>
            <span className="text-xs font-semibold px-2.5 py-1 bg-[#DCFCE7] text-[#166534] rounded-full">
              {availableOrders.length} Orderan
            </span>
          </div>

          <div className="flex flex-col gap-3">
            {availableOrders.map((order) => (
              <Card
                key={order.id}
                className="flex flex-col gap-4 p-5 bg-white border border-[#E5E7EB] hover:border-[#16A34A] transition-colors"
              >
                <div className="flex items-start justify-between gap-2 border-b border-[#E5E7EB] pb-3">
                  <div>
                    <span className="text-xs font-bold text-[#16A34A] uppercase tracking-wider">
                      📍 {order.distance_km} km dari lokasi Anda
                    </span>
                    <h3 className="text-base sm:text-lg font-bold text-[#111827] mt-0.5">
                      {order.requester_name}
                    </h3>
                  </div>
                  <span className="text-xs font-extrabold px-2.5 py-1 bg-[#FEF3C7] text-[#92400E] rounded-full border border-[#FCD34D]">
                    Tier {order.fallback_tier} (Pemulung Prioritas)
                  </span>
                </div>

                <div className="flex flex-col gap-2 text-sm text-[#374151]">
                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-[#6B7280] shrink-0 mt-1" />
                    <span>{order.pickup_address}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Package className="w-4 h-4 text-[#0D9488] shrink-0" />
                    <span className="font-semibold text-[#111827]">
                      {order.category_name} ({order.estimated_weight_kg} kg)
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-[#6B7280] shrink-0" />
                    <span>Waktu Minta: {order.preferred_time}</span>
                  </div>
                </div>

                <Button
                  variant="primary"
                  fullWidth
                  className="py-3 text-base shadow-sm"
                  onClick={() => handleAcceptOrder(order.id)}
                >
                  Terima Orderan Ini Now
                  <ChevronRight className="w-5 h-5 ml-1" />
                </Button>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* SECTION B: RUMAH TANGGA FORM MINTA JEMPUT                            */}
      {/* ==================================================================== */}
      {role !== "pemulung" && requestStatus === "idle" && (
        <Card className="p-6 bg-white border border-[#E5E7EB] flex flex-col gap-6 shadow-sm">
          <div className="border-b border-[#E5E7EB] pb-3">
            <h2 className="text-xl font-bold text-[#111827]">Formulir Penjemputan EcoRoute</h2>
            <p className="text-sm text-[#4B5563] mt-0.5">
              Pemulung Mitra terdekat akan langsung menerima notifikasi lokasi Anda.
            </p>
          </div>

          <form onSubmit={handleSubmitRequest} className="flex flex-col gap-6">
            {/* Barang dari Scan jika ada */}
            {queryCategory && (
              <div className="bg-[#CCFBF1]/50 p-4 rounded-xl border border-[#0D9488] flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-[#0D9488] uppercase">Barang Terdeteksi</span>
                  <p className="text-base font-bold text-[#111827]">{queryCategory}</p>
                </div>
                {queryWeight && (
                  <span className="text-sm font-extrabold text-[#0D9488] bg-white px-3 py-1 rounded-lg border border-[#99F6E4]">
                    {queryWeight} kg
                  </span>
                )}
              </div>
            )}

            {/* Alamat Input + Geolocation Button */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <label className="text-base font-bold text-[#111827]">Alamat Lengkap Penjemputan</label>
                <button
                  type="button"
                  onClick={handleGetLocation}
                  disabled={isLocating}
                  className="text-xs font-bold text-[#16A34A] hover:underline flex items-center gap-1 min-h-[36px]"
                >
                  <NavIcon className="w-3.5 h-3.5" />
                  {isLocating ? "Mencari GPS..." : "Gunakan Lokasi GPS"}
                </button>
              </div>

              <textarea
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
                rows={3}
                className="w-full p-4 bg-white text-[#111827] text-base rounded-[12px] border border-[#E5E7EB] focus:ring-4 focus:ring-green-200 focus:border-[#16A34A] focus:outline-none transition-all placeholder:text-[#9CA3AF]"
                placeholder="Masukkan jalan, nomor rumah, RT/RW, dan patokan dekat lokasi..."
              />
            </div>

            {/* Waktu Penjemputan (Pilihan Tombol BESAR) */}
            <div className="flex flex-col gap-2">
              <label className="text-base font-bold text-[#111827]">Pilih Waktu Penjemputan</label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  { id: "Sekarang", label: "⚡ Sekarang (Segera)", desc: "Dalam 15-30 menit" },
                  { id: "Nanti Sore", label: "🌆 Nanti Sore", desc: "Pukul 16.00 WIB" },
                  { id: "Besok Pagi", label: "🌅 Besok Pagi", desc: "Pukul 09.00 WIB" },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setTimePreset(item.id as any)}
                    className={`p-4 rounded-2xl border-2 text-left transition-all flex flex-col gap-1 min-h-[64px] ${
                      timePreset === item.id
                        ? "border-[#16A34A] bg-[#DCFCE7] text-[#166534] font-bold shadow-xs"
                        : "border-[#E5E7EB] bg-white text-[#374151] hover:border-gray-300"
                    }`}
                  >
                    <span className="text-base">{item.label}</span>
                    <span className="text-xs text-[#6B7280] font-normal">{item.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Catatan Tambahan (Opsional) */}
            <BigInput
              label="Catatan Tambahan (Opsional)"
              placeholder="Contoh: Titip di pagar depan / Ada 2 karung kardus"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />

            {/* Submit Button */}
            <Button
              type="submit"
              variant="primary"
              fullWidth
              isLoading={isSubmitting}
              className="py-4 text-lg shadow-md"
            >
              <Truck className="w-6 h-6 mr-2" />
              Kirim Permintaan Jemput (EcoRoute)
            </Button>
          </form>
        </Card>
      )}

      {/* ==================================================================== */}
      {/* SECTION C: REAL-TIME TRACKING VISUAL STEPPER (Active Request View)   */}
      {/* ==================================================================== */}
      {requestStatus !== "idle" && (
        <div className="flex flex-col gap-5 animate-in fade-in">
          {/* Tier Escalation Banner Notification */}
          <Card
            className={`p-4 border-2 flex items-center justify-between gap-3 ${
              fallbackTier === 1
                ? "bg-[#DCFCE7] border-[#86EFAC] text-[#166534]"
                : fallbackTier === 2
                ? "bg-[#FEF3C7] border-[#FCD34D] text-[#92400E]"
                : "bg-red-50 border-red-300 text-[#991B1B]"
            }`}
          >
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-6 h-6 shrink-0" />
              <div className="text-xs sm:text-sm font-semibold">
                {fallbackTier === 1 && (
                  <span>
                    <strong>Tier 1 (Prioritas Pemulung)</strong> — Memprioritaskan Pemulung Mitra
                    terdaftar di radius 2km.
                  </span>
                )}
                {fallbackTier === 2 && (
                  <span>
                    <strong>Tier 2 (Radius 5km)</strong> — Jangkauan diperluas ke Pemulung Mitra di
                    radius 5km.
                  </span>
                )}
                {requestStatus === "fallback_kurir" && (
                  <span>
                    <strong>Sedang dialihkan ke kurir mitra cadangan</strong> — Penjemputan tetap
                    dijamin aman!
                  </span>
                )}
              </div>
            </div>
            <StatusBadge status={requestStatus === "completed" ? "Selesai" : "Diproses"} />
          </Card>

          {/* REAL-TIME VISUAL STEPPER CARD */}
          <Card className="p-6 bg-white border border-[#E5E7EB] flex flex-col gap-6">
            <h2 className="text-lg font-bold text-[#111827] border-b border-[#E5E7EB] pb-3">
              Status Penjemputan Real-Time
            </h2>

            <div className="flex flex-col gap-6 relative pl-4 border-l-2 border-[#E5E7EB]">
              {/* Step 1: Mencari Pemulung */}
              <div className="flex items-start gap-4 relative">
                <div
                  className={`absolute -left-[25px] w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                    requestStatus === "searching"
                      ? "bg-[#16A34A] text-white ring-4 ring-green-100 animate-pulse"
                      : "bg-[#16A34A] text-white"
                  }`}
                >
                  1
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#111827]">
                    Mencari Pemulung Terdekat
                  </h3>
                  <p className="text-xs sm:text-sm text-[#6B7280]">
                    Sistem EcoRoute memancarkan lokasi ke pemulung mitra di sekitar rute.
                  </p>
                </div>
              </div>

              {/* Step 2: Pemulung Ditemukan */}
              <div className="flex items-start gap-4 relative">
                <div
                  className={`absolute -left-[25px] w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                    requestStatus === "assigned"
                      ? "bg-[#16A34A] text-white ring-4 ring-green-100"
                      : requestStatus === "on_the_way" || requestStatus === "completed"
                      ? "bg-[#16A34A] text-white"
                      : "bg-[#E5E7EB] text-[#6B7280]"
                  }`}
                >
                  2
                </div>
                <div className="flex-1">
                  <h3 className="text-base font-bold text-[#111827]">Pemulung Ditemukan</h3>
                  {activeRequest?.assigned_pemulung ? (
                    <div className="mt-2 bg-[#F9FAFB] p-3.5 rounded-xl border border-[#E5E7EB] flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-[#16A34A] text-white font-bold flex items-center justify-center">
                          PB
                        </div>
                        <div>
                          <p className="font-bold text-[#111827] text-sm">
                            {activeRequest.assigned_pemulung.name}
                          </p>
                          <p className="text-xs text-[#6B7280]">
                            {activeRequest.assigned_pemulung.vehicle} • {activeRequest.assigned_pemulung.rating}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Link href={`tel:${activeRequest.assigned_pemulung.phone}`}>
                          <Button variant="outline" className="p-2 min-h-[40px] min-w-[40px]">
                            <Phone className="w-4 h-4 text-[#16A34A]" />
                          </Button>
                        </Link>
                        <Link href={`https://wa.me/${activeRequest.assigned_pemulung.phone}`} target="_blank">
                          <Button variant="primary" className="p-2 min-h-[40px] min-w-[40px]">
                            <MessageSquare className="w-4 h-4" />
                          </Button>
                        </Link>
                      </div>
                    </div>
                  ) : (
                    <p className="text-xs text-[#6B7280]">Menunggu konfirmasi penerimaan...</p>
                  )}
                </div>
              </div>

              {/* Step 3: Sedang Menuju Lokasi */}
              <div className="flex items-start gap-4 relative">
                <div
                  className={`absolute -left-[25px] w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                    requestStatus === "on_the_way"
                      ? "bg-[#0D9488] text-white ring-4 ring-teal-100 animate-bounce"
                      : requestStatus === "completed"
                      ? "bg-[#16A34A] text-white"
                      : "bg-[#E5E7EB] text-[#6B7280]"
                  }`}
                >
                  3
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#111827]">Sedang Menuju Lokasi</h3>
                  <p className="text-xs sm:text-sm text-[#6B7280]">
                    {requestStatus === "on_the_way"
                      ? "Estimasi tiba dalam 10-15 menit di lokasi Anda."
                      : "Menunggu perjalanan dimulai."}
                  </p>
                </div>
              </div>

              {/* Step 4: Selesai */}
              <div className="flex items-start gap-4 relative">
                <div
                  className={`absolute -left-[25px] w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                    requestStatus === "completed"
                      ? "bg-[#16A34A] text-white"
                      : "bg-[#E5E7EB] text-[#6B7280]"
                  }`}
                >
                  4
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#111827]">Penimbangan & Selesai</h3>
                  <p className="text-xs sm:text-sm text-[#6B7280]">
                    Penimbangan akhir transparan & pembayaran langsung diterima.
                  </p>
                </div>
              </div>
            </div>

            {/* Interactive Progress Controls for Demo / Pemulung Test */}
            <div className="border-t border-[#E5E7EB] pt-4 flex flex-wrap gap-2">
              <span className="text-xs font-bold text-[#6B7280] w-full">Simulasi Alur Demo:</span>
              <Button
                variant="outline"
                className="text-xs py-2 px-3 min-h-[36px]"
                onClick={() => setRequestStatus("searching")}
              >
                1. Cari Pemulung
              </Button>
              <Button
                variant="outline"
                className="text-xs py-2 px-3 min-h-[36px]"
                onClick={() => {
                  setRequestStatus("assigned");
                  setActiveRequest((prev: any) => ({
                    ...prev,
                    assigned_pemulung: {
                      name: "Pak Budi",
                      role: "Pemulung Mitra EcoRoute",
                      phone: "081234567891",
                      vehicle: "Gerobak Motor EcoRoute",
                      rating: "4.9 ★",
                    },
                  }));
                }}
              >
                2. Terima Order
              </Button>
              <Button
                variant="outline"
                className="text-xs py-2 px-3 min-h-[36px]"
                onClick={() => setRequestStatus("on_the_way")}
              >
                3. OTW Lokasi
              </Button>
              <Button
                variant="primary"
                className="text-xs py-2 px-3 min-h-[36px]"
                onClick={() => setRequestStatus("completed")}
              >
                4. Selesai Jemput
              </Button>
              <Button
                variant="danger"
                className="text-xs py-2 px-3 min-h-[36px]"
                onClick={() => {
                  setRequestStatus("fallback_kurir");
                  setFallbackTier(3);
                }}
              >
                Simulasi Fallback Tier 3
              </Button>
            </div>
          </Card>

          <Button variant="outline" fullWidth onClick={() => setRequestStatus("idle")}>
            Buat Permintaan Jemputan Baru
          </Button>
        </div>
      )}
    </div>
  );
}

export default function PickupPage() {
  const { role } = useAuth();

  return (
    <main className="min-h-screen bg-[#F9FAFB] p-4 sm:p-6 max-w-3xl mx-auto flex flex-col gap-6">
      {/* Header Bar */}
      <div className="flex items-center justify-between gap-3">
        <Link href="/">
          <Button variant="outline" className="p-2.5 sm:p-3 min-w-[44px] sm:min-w-[48px] min-h-[44px] sm:min-h-[48px] flex items-center justify-center">
            <ArrowLeft className="w-5 h-5 sm:w-6 sm:h-6" />
          </Button>
        </Link>
        <div className="flex-1">
          <h1 className="text-lg sm:text-2xl font-extrabold text-[#111827] tracking-tight font-heading flex items-center gap-2">
            <Truck className="w-5 h-5 sm:w-6 sm:h-6 text-[#16A34A] shrink-0" />
            EcoRoute Penjemputan
          </h1>
          <p className="text-xs sm:text-sm text-[#4B5563]">
            {role === "pemulung"
              ? "Daftar permintaan jemputan dari Rumah Tangga sekitar"
              : "Jemput di rumah memberdayakan Pemulung Mitra terdekat"}
          </p>
        </div>
      </div>

      <Suspense
        fallback={
          <Card className="flex flex-col items-center justify-center p-12 min-h-[300px]">
            <Loader2 className="w-8 h-8 text-[#16A34A] animate-spin" />
            <p className="text-sm text-[#4B5563] mt-2 font-medium">Memuat lokasi Penjemputan...</p>
          </Card>
        }
      >
        <PickupContent />
      </Suspense>
    </main>
  );
}
