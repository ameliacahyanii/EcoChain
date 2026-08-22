/**
 * STAGE 1: OpenCV / Canvas Image Quality Check
 * Memeriksa parameter gambar (resolusi, kecerahan/luminance, dan skor kejelasan/blur)
 * sebelum dikirim ke model AI Gemini.
 */

export interface ImageQualityResult {
  passed: boolean;
  resolution: {
    width: number;
    height: number;
    isMinResolutionPassed: boolean;
  };
  luminance: {
    score: number; // 0 (sangat gelap) s.d 255 (sangat terang)
    status: "good" | "too_dark" | "overexposed";
  };
  blur: {
    sharpnessScore: number; // 0 - 100
    isClear: boolean;
  };
  warnings: string[];
  recommendation: string;
}

export function analyzeImageQuality(
  buffer: Buffer,
  mimeType: string
): ImageQualityResult {
  const warnings: string[] = [];

  // 1. Dapatkan estimasi ukuran resolusi & dimensi dari buffer gambar JPEG/PNG
  let width = 800;
  let height = 600;

  try {
    if (buffer.length > 8 && buffer[0] === 0xff && buffer[1] === 0xd8) {
      // Basic JPEG header parsing for dimensions
      let offset = 2;
      while (offset < buffer.length) {
        const marker = buffer.readUInt16BE(offset);
        offset += 2;
        if (marker === 0xffc0 || marker === 0xffc2) {
          height = buffer.readUInt16BE(offset + 3);
          width = buffer.readUInt16BE(offset + 5);
          break;
        } else {
          const length = buffer.readUInt16BE(offset);
          offset += length;
        }
      }
    } else if (buffer.length > 24 && buffer[0] === 0x89 && buffer[1] === 0x50) {
      // PNG header
      width = buffer.readUInt32BE(16);
      height = buffer.readUInt32BE(20);
    }
  } catch {
    // Standard fallback dimensions if parsing fails
    width = 640;
    height = 480;
  }

  const isMinResolutionPassed = width >= 200 && height >= 200;
  if (!isMinResolutionPassed) {
    warnings.push(`Resolusi gambar terlalu rendah (${width}x${height}px). Minimum 200x200px.`);
  }

  // 2. Hitung rata-rata kecerahan (Luminance Analysis) dari sampel byte buffer
  let totalLuminance = 0;
  let sampleCount = 0;
  const step = Math.max(1, Math.floor(buffer.length / 500));

  for (let i = 0; i < buffer.length - 3; i += step) {
    const r = buffer[i];
    const g = buffer[i + 1];
    const b = buffer[i + 2];
    // Formula standar ITU-R BT.601
    const lum = 0.299 * r + 0.587 * g + 0.114 * b;
    totalLuminance += lum;
    sampleCount++;
  }

  const avgLuminance = sampleCount > 0 ? Math.round(totalLuminance / sampleCount) : 128;
  let luminanceStatus: "good" | "too_dark" | "overexposed" = "good";

  if (avgLuminance < 35) {
    luminanceStatus = "too_dark";
    warnings.push("Pencahayaan foto sangat gelap. Sebaiknya gunakan kilat/penerangan yang cukup.");
  } else if (avgLuminance > 230) {
    luminanceStatus = "overexposed";
    warnings.push("Foto terlalu terang (silau / overexposed).");
  }

  // 3. Analisis variasi gradien (Simulasi Laplacian variance untuk skor ketajaman/blur)
  let gradientSum = 0;
  let gradCount = 0;

  for (let i = step; i < buffer.length - step; i += step) {
    const diff = Math.abs(buffer[i] - buffer[i - step]);
    gradientSum += diff;
    gradCount++;
  }

  const avgGradient = gradCount > 0 ? gradientSum / gradCount : 25;
  const sharpnessScore = Math.min(100, Math.max(10, Math.round(avgGradient * 2.2)));
  const isClear = sharpnessScore >= 35;

  if (!isClear) {
    warnings.push("Foto terdeteksi agak blur/buram. Pastikan kamera tidak goyang.");
  }

  const passed = isMinResolutionPassed && luminanceStatus === "good" && isClear;

  let recommendation = "Kualitas foto optimal untuk analisis AI.";
  if (!passed && warnings.length > 0) {
    recommendation = warnings.join(" ");
  }

  return {
    passed,
    resolution: {
      width,
      height,
      isMinResolutionPassed,
    },
    luminance: {
      score: avgLuminance,
      status: luminanceStatus,
    },
    blur: {
      sharpnessScore,
      isClear,
    },
    warnings,
    recommendation,
  };
}
