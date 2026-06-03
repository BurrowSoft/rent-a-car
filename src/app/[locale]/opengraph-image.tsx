import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "RentACarMole — Compare & Book Rental Cars Worldwide";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OGImage() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: "linear-gradient(135deg, #f43f5e 0%, #be123c 100%)", fontFamily: "sans-serif", padding: "60px" }}>
        <div style={{ fontSize: 120, marginBottom: 32 }}>🚗</div>
        <div style={{ fontSize: 72, fontWeight: 900, color: "white", letterSpacing: "-2px", marginBottom: 16 }}>RentACarMole</div>
        <div style={{ fontSize: 28, color: "rgba(255,255,255,0.85)", textAlign: "center", maxWidth: 700 }}>
          Compare &amp; Book Rental Cars Worldwide
        </div>
        <div style={{ position: "absolute", bottom: 48, display: "flex", alignItems: "center", gap: 10, background: "rgba(255,255,255,0.15)", borderRadius: 99, padding: "10px 24px", color: "rgba(255,255,255,0.9)", fontSize: 20 }}>
          By BurrowSoft · rentacarmole.com
        </div>
      </div>
    ),
    size
  );
}
