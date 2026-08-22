/**
 * STAGE 3: Rule Engine + Price Database - Knowledge Lookup
 * Mencocokkan hasil deteksi AI dengan aturan bisnis & database harga terkini
 * untuk menghitung nilai jual secara otomatis dan konsisten.
 */

export interface PricingRuleInput {
  category_name: string;
  base_price_per_unit: number;
  unit: string;
  weight_or_quantity: number;
  condition_grade?: "Grade A" | "Grade B" | "Grade C";
  is_hazardous?: boolean;
}

export interface PricingRuleResult {
  category_name: string;
  unit: string;
  weight_or_quantity: number;
  base_price_per_unit: number;
  condition_grade: "Grade A" | "Grade B" | "Grade C";
  condition_multiplier: number;
  volume_bonus_multiplier: number;
  adjusted_unit_price: number;
  estimated_total_price: number;
  hazardous_flag: boolean;
  breakdown_notes: string[];
}

export function evaluatePricingRules(input: PricingRuleInput): PricingRuleResult {
  const breakdown_notes: string[] = [];

  // 1. Evaluasi Multiplier Kondisi Barang (Grade A / B / C)
  let condition_grade = input.condition_grade || "Grade A";
  let condition_multiplier = 1.0;

  if (condition_grade === "Grade B") {
    condition_multiplier = 0.85;
    breakdown_notes.push("Diskon kondisi Grade B (Terkontaminasi ringan / agak basah): -15%");
  } else if (condition_grade === "Grade C") {
    condition_multiplier = 0.70;
    breakdown_notes.push("Diskon kondisi Grade C (Bercampur / rusak berat): -30%");
  } else {
    breakdown_notes.push("Bonus kondisi Grade A (Tersortir bersih & kering): 100% harga standar");
  }

  // 2. Evaluasi Multiplier Volume / Bulk Bonus
  let volume_bonus_multiplier = 1.0;
  if (input.weight_or_quantity >= 50) {
    volume_bonus_multiplier = 1.10;
    breakdown_notes.push("Bonus Kuota Besar (≥50kg): +10% harga insentif");
  } else if (input.weight_or_quantity >= 10) {
    volume_bonus_multiplier = 1.05;
    breakdown_notes.push("Bonus Kuota Menengah (≥10kg): +5% harga insentif");
  }

  // 3. Hitung unit price yang disesuaikan & total harga final
  const adjusted_unit_price = Math.round(
    input.base_price_per_unit * condition_multiplier * volume_bonus_multiplier
  );

  const estimated_total_price = Math.round(adjusted_unit_price * input.weight_or_quantity);

  // 4. Penanganan Komponen Berbahaya (B3 / Baterai / Bahan Kimia)
  const hazardous_flag = Boolean(input.is_hazardous);
  if (hazardous_flag) {
    breakdown_notes.push("PERHATIAN: Barang Mengandung Komponen Berbahaya (B3). Memerlukan prosedur khusus.");
  }

  return {
    category_name: input.category_name,
    unit: input.unit,
    weight_or_quantity: input.weight_or_quantity,
    base_price_per_unit: input.base_price_per_unit,
    condition_grade,
    condition_multiplier,
    volume_bonus_multiplier,
    adjusted_unit_price,
    estimated_total_price,
    hazardous_flag,
    breakdown_notes,
  };
}
