export type UserRole = "rumah_tangga" | "pemulung" | "pengepul" | "admin";

export type WasteCategoryGroup = "plastik" | "kertas" | "logam" | "elektronik" | "lainnya";

export type TransactionType = "drop_off" | "pickup";

export type TransactionStatus = "pending" | "confirmed" | "completed" | "cancelled";

export type PaymentStatus = "unpaid" | "paid";

export type PickupStatus =
  | "searching"
  | "assigned"
  | "on_the_way"
  | "completed"
  | "cancelled"
  | "fallback_kurir";

export type EscrowStatus = "funded" | "held" | "released" | "disputed" | "refunded";

export interface Profile {
  id: string;
  full_name: string;
  phone_number: string;
  role: UserRole;
  address?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  is_verified_partner: boolean;
  created_at: string;
}

export interface WasteCategory {
  id: string;
  name: string;
  unit: string;
  base_price_per_unit: number;
  category_group: WasteCategoryGroup;
  updated_at: string;
}

export interface ScanResult {
  id: string;
  user_id: string;
  image_url: string;
  detected_category_id?: string | null;
  estimated_weight_kg?: number | null;
  estimated_price?: number | null;
  ai_confidence?: number | null;
  created_at: string;
}

export interface Transaction {
  id: string;
  seller_id: string;
  buyer_id: string;
  scan_result_id?: string | null;
  final_weight_kg: number;
  final_price: number;
  transaction_type: TransactionType;
  status: TransactionStatus;
  payment_status: PaymentStatus;
  created_at: string;
  completed_at?: string | null;
}

export interface PickupRequest {
  id: string;
  requester_id: string;
  assigned_pemulung_id?: string | null;
  pickup_address: string;
  latitude: number;
  longitude: number;
  preferred_time: string;
  status: PickupStatus;
  fallback_tier: number;
  created_at: string;
}

export interface EcoPoint {
  id: string;
  name: string;
  operator_id: string;
  address: string;
  latitude: number;
  longitude: number;
  is_active: boolean;
}

export interface B2BOrder {
  id: string;
  pengepul_id: string;
  buyer_company_name: string;
  total_weight_kg: number;
  total_price: number;
  escrow_status: EscrowStatus;
  created_at: string;
  released_at?: string | null;
}

export interface ImpactLog {
  id: string;
  transaction_id?: string | null;
  waste_category_id: string;
  weight_kg: number;
  estimated_co2_reduction_kg: number;
  logged_at: string;
}
