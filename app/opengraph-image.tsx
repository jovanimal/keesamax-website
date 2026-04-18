import { ImageResponse } from "next/og";
import { site } from "@/data/site";

export const runtime = "edge";
export const alt = `${site.legalName} — Boutique Recruitment Specialists`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage(): ImageResponse {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background:
            "radial-gradient(ellipse at top right, #D4A57422 0%, transparent 60%), linear-gradient(180deg, #FBFAF7 0%, #F5EBD9 100%)",
          padding: "80px",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div
            style={{
              width: 88,
              height: 88,
              borderRadius: 20,
              background: "#0F2341",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              position: "relative",
            }}
          >
            <div
              style={{
                position: "absolute",
                top: 14,
                left: 14,
                right: 14,
                height: 6,
                borderRadius: 3,
                background: "#C85A2E",
                transform: "skewX(-8deg)",
              }}
            />
            <div
              style={{
                color: "white",
                fontSize: 52,
                fontWeight: 800,
                letterSpacing: -1,
              }}
            >
              K
            </div>
          </div>
          <div
            style={{
              fontSize: 40,
              fontWeight: 800,
              color: "#0F2341",
              letterSpacing: -1,
            }}
          >
            Keesamax
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div
            style={{
              fontSize: 72,
              fontWeight: 800,
              color: "#0F172A",
              letterSpacing: -2,
              lineHeight: 1.05,
            }}
          >
            Connecting talent,
            <br />
            inspiring growth.
          </div>
          <div
            style={{
              fontSize: 28,
              color: "#475569",
              lineHeight: 1.4,
              maxWidth: 900,
            }}
          >
            Boutique recruitment across Southeast Asia — executive
            headhunting, skilled placement, and career coaching since 2013.
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderTop: "2px solid #E2E8F0",
            paddingTop: 24,
          }}
        >
          <div style={{ fontSize: 22, color: "#64748B", fontWeight: 500 }}>
            {site.url.replace(/^https?:\/\//, "")}
          </div>
          <div
            style={{
              fontSize: 20,
              color: "#0F2341",
              fontWeight: 700,
              letterSpacing: 2,
              textTransform: "uppercase",
            }}
          >
            Malaysia · APAC · EMEA
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
