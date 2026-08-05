/**
 * EcoChain Premium Design System Theme Tokens & Guidelines Reference
 *
 * Rules:
 * 1. Accessibility: All touch targets must be at least 48x48px.
 * 2. Contrast: Text contrast ratio against background minimum 4.5:1.
 * 3. Accent Rule: Always use dark text (#0F172A) on top of accent (#F59E0B) for high readability.
 * 4. Typography: Plus Jakarta Sans for Body, Outfit for Headings. Base font size is 16px (1rem).
 */

export const theme = {
  colors: {
    primary: {
      default: "#10B981", // Rich Emerald 500
      hover: "#059669", // Emerald 600
      light: "#ECFDF5", // Emerald 50
    },
    secondary: {
      default: "#14B8A6", // Teal 500
      hover: "#0F766E", // Teal 700
      light: "#F0FDFA", // Teal 50
    },
    accent: {
      default: "#F59E0B", // Amber 500
      hover: "#D97706", // Amber 600
      textOnAccent: "#0F172A", // CRITICAL: Slate 900 dark text on accent background
    },
    danger: {
      default: "#EF4444", // Red 500
      hover: "#DC2626", // Red 600
      light: "#FEF2F2", // Red 50
    },
    neutral: {
      bg: "#F8FAFC",
      text: "#0F172A",
      border: "#E2E8F0",
      white: "#FFFFFF",
    },
  },
  typography: {
    fontBody: "var(--font-sans), 'Plus Jakarta Sans', system-ui, sans-serif",
    fontHeading: "var(--font-heading), 'Outfit', system-ui, sans-serif",
    baseSize: "16px",
  },
  ux: {
    minTouchTargetSize: "48px",
    borderRadiusCard: "24px",
    borderRadiusButton: "14px",
  },
} as const;

export type Theme = typeof theme;
