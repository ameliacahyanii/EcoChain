import { analyzeImageQuality, ImageQualityResult } from "./image-quality";
import { evaluatePricingRules, PricingRuleResult } from "./rule-engine";
import { evaluateConfidenceGate, ConfidenceGateResult } from "./confidence-gate";

export interface PipelineExecutionResult {
  success: boolean;
  scan_id: string;
  stage1_quality: ImageQualityResult;
  stage2_gemini: {
    category_name: string;
    condition_grade: "Grade A" | "Grade B" | "Grade C";
    hazardous_component?: string;
    nlp_recommendation: string;
    raw_confidence: number;
    reasoning: string;
  };
  stage3_rule_engine: PricingRuleResult;
  stage4_confidence_gate: ConfidenceGateResult;
}

export { analyzeImageQuality, evaluatePricingRules, evaluateConfidenceGate };
export type { ImageQualityResult, PricingRuleResult, ConfidenceGateResult };
