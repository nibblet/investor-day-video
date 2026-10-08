import { loadFont } from "@remotion/fonts";
import { staticFile } from "remotion";

export const C = {
  bg: "#111214",
  surface: "#1C1E22",
  elevated: "#2C2F36",
  subtle: "#3A3D45",
  hover: "#44474F",
  text: "#F0F0F0",
  text2: "#9A9DA5",
  muted: "#6A6D74",
  brand: "#F97316",
  brandSoft: "rgba(249, 115, 22, 0.15)",
  success: "rgb(34, 197, 94)",
  successSoft: "rgba(34, 197, 94, 0.15)",
} as const;

// Geist is bundled in public/fonts (OFL) so renders never depend on the network.
export const SANS = "Geist";
export const MONO = "Geist Mono";
for (const weight of ["400", "500", "600", "700"]) {
  loadFont({ family: SANS, url: staticFile(`fonts/Geist-${weight}.woff2`), weight });
}
for (const weight of ["400", "500"]) {
  loadFont({ family: MONO, url: staticFile(`fonts/GeistMono-${weight}.woff2`), weight });
}

export const FPS = 30;
export const PHONE = { width: 1080, height: 2340 } as const;
export const VERTICAL = { width: 1080, height: 1920 } as const;
export const MONITOR = { width: 1920, height: 1080 } as const;
