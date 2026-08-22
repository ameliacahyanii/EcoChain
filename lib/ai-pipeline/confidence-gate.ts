/**
 * STAGE 4: Confidence Gate - Decision Layer
 * Menguji confidence score AI dan kualitas foto terhadap threshold 0,75 (75%).
 * Memutuskan apakah harga otomatis disetujui langsung atau dialihkan ke
 * verifikasi manual operator EcoPoint.
 */

export interface ConfidenceGateInput {
  confidence_score: number; // 0.0 s.d 1.0 (misal 0.85 = 85%)
  quality_passed: boolean;
  is_hazardous?: boolean;
}

export interface ConfidenceGateResult {
  decision: "AUTOMATIC_FINAL_PRICE" | "OPERATOR_MANUAL_VERIFICATION";
  is_final_automatic: boolean;
  confidence_percentage: number;
  threshold_percentage: number;
  badge_text: string;
  status_color: "emerald" | "amber";
  routing_target: string;
  reason: string;
}

export function evaluateConfidenceGate(input: ConfidenceGateInput): ConfidenceGateResult {
  const threshold = 0.75;
  const confNormalized = input.confidence_score > 1 ? input.confidence_score / 100 : input.confidence_score;
  const confPercentage = Math.round(confNormalized * 100);

  const isHighConfidence = confNormalized >= threshold;
  const isAutomaticApproved = isHighConfidence && input.quality_passed;

  if (isAutomaticApproved) {
    return {
      decision: "AUTOMATIC_FINAL_PRICE",
      is_final_automatic: true,
      confidence_percentage: confPercentage,
      threshold_percentage: 75,
      badge_text: "Terverifikasi Otomatis Pipeline AI",
      status_color: "emerald",
      routing_target: "/pickup",
      reason: `Confidence (${confPercentage}%) melebihi ambang batas 75% dan kualitas foto valid. Harga final disetujui secara otomatis.`,
    };
  }

  // Jika confidence < 0.75 atau foto bermasalah -> dialihkan ke verifikasi manual
  let failureReason = `Confidence AI (${confPercentage}%) di bawah batas 75%.`;
  if (!input.quality_passed) {
    failureReason = `Kualitas foto memerlukan pemeriksaan ulang. ${failureReason}`;
  }

  return {
    decision: "OPERATOR_MANUAL_VERIFICATION",
    is_final_automatic: false,
    confidence_percentage: confPercentage,
    threshold_percentage: 75,
    badge_text: "Perlu Verifikasi Manual Operator EcoPoint",
    status_color: "amber",
    routing_target: "/admin/verification",
    reason: failureReason,
  };
}
