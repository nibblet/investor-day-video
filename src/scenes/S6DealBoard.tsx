import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { C, MONO, SANS } from "../theme";
import { board, type BoardCard } from "../data/valleyStation";
import { useEnter } from "../components/ui";

// Shot 6A monitor plate (1920×1080), 0:52–0:58. Every deal on one board; one
// card moves from Offer to Under contract while Paul watches.
export const S6A_DURATION = 180;

const MOVE_AT = 84;
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const COL_W = 286;
const COL_GAP = 20;
const CARD_H = 118;
const CARD_GAP = 14;
const TOP = 176;
const LEFT = 40;

const MiniCard: React.FC<{ card: BoardCard; style?: React.CSSProperties; highlight?: number }> = ({
  card,
  style,
  highlight = 0,
}) => (
  <div
    style={{
      width: COL_W,
      height: CARD_H,
      boxSizing: "border-box",
      background: C.surface,
      borderRadius: 14,
      padding: "16px 18px",
      border: `2px solid ${highlight > 0 ? `rgba(249,115,22,${0.4 + 0.6 * highlight})` : C.elevated}`,
      boxShadow: highlight > 0 ? `0 12px 40px rgba(249,115,22,${0.25 * highlight})` : "none",
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
      ...style,
    }}
  >
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <span style={{ fontSize: 22, fontWeight: 600, color: C.text, whiteSpace: "nowrap" }}>{card.area}</span>
      {card.stale ? <span style={{ width: 10, height: 10, borderRadius: 5, background: C.brand }} /> : null}
    </div>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", whiteSpace: "nowrap" }}>
      <span style={{ fontSize: 20, color: C.text2, fontVariantNumeric: "tabular-nums" }}>
        ARV ${card.arv.toLocaleString("en-US")}
      </span>
      <span
        style={{
          fontSize: 14,
          fontWeight: 700,
          color: C.text2,
          textTransform: "uppercase",
          letterSpacing: 1,
          padding: "4px 10px",
          borderRadius: 999,
          background: C.elevated,
        }}
      >
        {card.tag}
      </span>
    </div>
  </div>
);

export const S6ADealBoard: React.FC = () => {
  const frame = useCurrentFrame();
  const head = useEnter(0, 12, 12);

  // The moving card: first Offer card → bottom of Under contract.
  const fromCol = board.findIndex((c) => c.stage === "Offer");
  const toCol = board.findIndex((c) => c.stage === "Under contract");
  const mover = board[fromCol].cards[0];
  const fromX = LEFT + fromCol * (COL_W + COL_GAP);
  const toX = LEFT + toCol * (COL_W + COL_GAP);
  const fromY = TOP + 70;
  const toY = TOP + 70 + board[toCol].cards.length * (CARD_H + CARD_GAP);
  const t = interpolate(frame, [MOVE_AT, MOVE_AT + 26], [0, 1], { ...clamp, easing: Easing.bezier(0.65, 0, 0.35, 1) });
  const lift = Math.sin(t * Math.PI);
  const highlight = interpolate(frame, [MOVE_AT - 10, MOVE_AT, MOVE_AT + 50, MOVE_AT + 80], [0, 1, 1, 0], clamp);
  const moved = frame >= MOVE_AT;

  return (
    <AbsoluteFill style={{ background: C.bg, fontFamily: SANS, color: C.text }}>
      <div style={{ ...head, display: "flex", justifyContent: "space-between", alignItems: "flex-end", padding: "52px 40px 0" }}>
        <div>
          <div style={{ fontSize: 46, fontWeight: 700, letterSpacing: -1 }}>Pipeline</div>
          <div style={{ fontSize: 22, color: C.text2, marginTop: 4 }}>Every deal, one board · updated just now</div>
        </div>
        <div style={{ display: "flex", gap: 12 }}>
          {["All markets", "This week"].map((f) => (
            <span key={f} style={{ fontSize: 20, padding: "10px 20px", borderRadius: 999, background: C.surface, color: C.text2, border: `1px solid ${C.elevated}` }}>
              {f}
            </span>
          ))}
        </div>
      </div>

      {board.map((col, i) => {
        const s = { opacity: interpolate(frame, [4 + i * 4, 18 + i * 4], [0, 1], clamp) };
        const count = col.count + (col.stage === "Offer" && moved ? -1 : 0) + (col.stage === "Under contract" && moved ? 1 : 0);
        return (
          <div key={col.stage} style={{ ...s, position: "absolute", left: LEFT + i * (COL_W + COL_GAP), top: TOP, width: COL_W }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", height: 52, marginBottom: 18, borderBottom: `3px solid ${col.stage === "Sold" ? C.success : i === toCol && moved ? C.brand : C.elevated}` }}>
              <span style={{ fontSize: 20, fontWeight: 700, letterSpacing: 1.6, textTransform: "uppercase", color: C.text2 }}>{col.stage}</span>
              <span style={{ fontFamily: MONO, fontSize: 20, color: C.muted }}>{count}</span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: CARD_GAP }}>
              {col.cards.map((card, j) =>
                i === fromCol && j === 0 ? (
                  <div key={card.area + j} style={{ height: CARD_H, borderRadius: 14, border: moved ? `2px dashed ${C.subtle}` : "none" }} />
                ) : (
                  <MiniCard key={card.area + j} card={card} />
                ),
              )}
            </div>
          </div>
        );
      })}

      <MiniCard
        card={mover}
        highlight={highlight}
        style={{
          position: "absolute",
          left: fromX + (toX - fromX) * t,
          top: fromY + (toY - fromY) * t - 24 * lift,
          rotate: `${3 * lift}deg`,
        }}
      />
    </AbsoluteFill>
  );
};
