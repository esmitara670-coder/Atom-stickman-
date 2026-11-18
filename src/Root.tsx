/**
 * src/Root.tsx — Premium audio-reactive voice video (Remotion v4)
 *
 * SETUP
 *  1. Copy the audio into  public/studio_voice__12_.wav
 *  2. npm i @remotion/media-utils @remotion/google-fonts
 *  3. src/index.ts must have:  registerRoot(RemotionRoot)
 *  4. Preview:  npx remotion studio
 *     Render :  npx remotion render PremiumVoice out/voice.mp4        (1080x1920)
 *               npx remotion render PremiumVoiceWide out/voice-wide.mp4 (1920x1080)
 *
 * Duration is read from the audio file itself, so it always matches.
 */
import React from "react";
import {
  AbsoluteFill,
  Audio,
  Composition,
  Easing,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import {
  getAudioDurationInSeconds,
  useAudioData,
  visualizeAudio,
} from "@remotion/media-utils";
import { loadFont } from "@remotion/google-fonts/Sora";

const { fontFamily: sora } = loadFont("normal", {
  weights: ["300", "600"],
  subsets: ["latin"],
});
const FONT = `${sora}, "Noto Sans Devanagari", "Noto Sans Bengali", system-ui, sans-serif`;

/* ───────────────────────── SETTINGS ───────────────────────── */

const AUDIO_FILE = "studio_voice__12_.wav"; // lives in /public
const FPS = 30;
const FALLBACK_SECONDS = 56.05;

const C = {
  ink: "#080B16",
  deep: "#141A3A",
  violet: "#7B61FF",
  ice: "#62E6FF",
  rose: "#FF5C93",
  champagne: "#F4E4C1",
  pearl: "#FFF8E8",
  mist: "rgba(244,228,193,0.62)",
};

type Caption = { from: number; to: number; text: string }; // seconds

export type VoiceProps = {
  title: string;
  subtitle: string;
  /** Optional subtitles. Keep each one on screen for at least 1.8 s. */
  captions: Caption[];
};

const defaultProps: VoiceProps = {
  title: "Studio Voice",
  subtitle: "",
  captions: [
    // { from: 0.3, to: 2.6, text: "Your first line goes here" },
    // { from: 2.6, to: 5.0, text: "Then the next one" },
  ],
};

/* ───────────────────────── HELPERS ───────────────────────── */

const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const fmt = (s: number) => {
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
};

const ORBS = [
  { color: C.violet, x: 0.18, y: 0.22, size: 1.0, speed: 0.21, phase: 0.0, alpha: 0.42 },
  { color: C.ice, x: 0.88, y: 0.58, size: 0.85, speed: 0.17, phase: 2.1, alpha: 0.28 },
  { color: C.rose, x: 0.3, y: 0.92, size: 0.8, speed: 0.13, phase: 4.2, alpha: 0.26 },
];

/* ───────────────────────── CAPTION ───────────────────────── */

const CaptionBlock: React.FC<{
  c: Caption;
  size: number;
  align: "center" | "flex-start";
}> = ({ c, size, align }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const start = Math.round(c.from * fps);
  const end = Math.round(c.to * fps);
  const local = frame - start;
  const out = interpolate(frame, [end - 6, end], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        justifyContent: align,
        gap: `${size * 0.1}px ${size * 0.28}px`,
        padding: `${size * 0.5}px ${size * 0.75}px`,
        borderRadius: size * 0.9,
        background: "rgba(255,255,255,0.06)",
        border: "1px solid rgba(244,228,193,0.18)",
        backdropFilter: "blur(20px)",
        boxShadow: "0 24px 70px rgba(0,0,0,0.38)",
        opacity: out,
      }}
    >
      {c.text.split(" ").map((w, i) => {
        const s = spring({
          frame: Math.max(0, local - i * 2),
          fps,
          config: { damping: 16, stiffness: 140 },
        });
        return (
          <span
            key={i}
            style={{
              display: "inline-block",
              fontSize: size,
              fontWeight: 600,
              lineHeight: 1.25,
              color: C.pearl,
              opacity: s,
              transform: `translateY(${(1 - s) * size * 0.5}px)`,
            }}
          >
            {w}
          </span>
        );
      })}
    </div>
  );
};

/* ───────────────────────── MAIN SCENE ───────────────────────── */

const PremiumVoice: React.FC<VoiceProps> = ({ title, subtitle, captions }) => {
  const frame = useCurrentFrame();
  const { fps, width, height, durationInFrames } = useVideoConfig();
  const audioData = useAudioData(staticFile(AUDIO_FILE));

  const vertical = height > width;
  const unit = Math.min(width, height);
  const t = frame / fps;
  const total = durationInFrames / fps;
  const progress = clamp(frame / durationInFrames);

  /* ── audio analysis ── */
  const HALF = 48;
  const BARS = HALF * 2;
  const bars = new Array<number>(HALF).fill(0);
  let level = 0;
  if (audioData) {
    const raw = visualizeAudio({
      fps,
      frame,
      audioData,
      numberOfSamples: 256,
      optimizeFor: "speed",
    });
    for (let i = 0; i < HALF; i++) {
      const lo = Math.floor((i / HALF) * 120);
      const hi = Math.max(lo + 1, Math.floor(((i + 1) / HALF) * 120));
      let sum = 0;
      for (let j = lo; j < hi; j++) sum += raw[j] ?? 0;
      const v = sum / (hi - lo);
      bars[i] = clamp(Math.sqrt(v) * (1.5 + (i / HALF) * 1.6));
    }
    let low = 0;
    for (let i = 0; i < 20; i++) low += raw[i] ?? 0;
    level = clamp(Math.sqrt(low / 20) * 2.1);
  }

  /* ── layout ── */
  const base = unit * 0.2;
  const cx = vertical ? width / 2 : width * 0.64;
  const cy = vertical ? height * 0.46 : height * 0.5;
  const pad = width * 0.07;

  const titleBox: React.CSSProperties = vertical
    ? { left: 0, right: 0, top: height * 0.085, textAlign: "center" }
    : { left: pad, top: height * 0.26, width: width * 0.38, textAlign: "left" };
  const capBox: React.CSSProperties = vertical
    ? { left: pad, right: pad, top: height * 0.76, justifyContent: "center" }
    : { left: pad, top: height * 0.52, width: width * 0.38, justifyContent: "flex-start" };
  const timeBox: React.CSSProperties = vertical
    ? { left: 0, right: 0, bottom: height * 0.055, textAlign: "center" }
    : { left: pad, bottom: height * 0.08, textAlign: "left" };

  /* ── intro (one orchestrated moment, done inside ~1.2 s) ── */
  const coreIn = spring({
    frame: Math.max(0, frame - 2),
    fps,
    config: { damping: 14, stiffness: 80, mass: 1 },
  });
  const trackIn = interpolate(frame, [0, 24], [0, 1], {
    easing: Easing.out(Easing.cubic),
    extrapolateRight: "clamp",
  });
  const reveal = (delay: number): React.CSSProperties => {
    const p = interpolate(frame, [delay, delay + 22], [0, 1], {
      easing: Easing.out(Easing.cubic),
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
    return {
      opacity: p,
      transform: `translateY(${(1 - p) * 26}px)`,
      filter: `blur(${(1 - p) * 10}px)`,
    };
  };

  /* ── camera: pull-back, slow push, drift, tilt, voice pulse ── */
  const introZoom = interpolate(frame, [0, 36], [1.14, 1], {
    easing: Easing.out(Easing.cubic),
    extrapolateRight: "clamp",
  });
  const push = introZoom * (1 + 0.06 * progress + level * 0.012);
  const driftX = Math.sin(t * 0.35) * width * 0.008;
  const driftY = Math.cos(t * 0.27) * height * 0.006;
  const tilt = Math.sin(t * 0.22) * 0.6;

  /* ── outro ── */
  const fadeOut = interpolate(frame, [durationInFrames - 14, durationInFrames], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  /* ── progress ring ── */
  const ringR = base * 2;
  const circ = 2 * Math.PI * ringR;
  const headA = -Math.PI / 2 + progress * Math.PI * 2;

  const active = captions.find((c) => t >= c.from && t < c.to);

  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(180deg, ${C.deep} 0%, ${C.ink} 70%)`,
        fontFamily: FONT,
        overflow: "hidden",
      }}
    >
      <Audio
        src={staticFile(AUDIO_FILE)}
        volume={(f) =>
          interpolate(f, [durationInFrames - 6, durationInFrames], [1, 0], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          })
        }
      />

      <AbsoluteFill style={{ opacity: fadeOut }}>
        {/* aurora */}
        {ORBS.map((o, i) => {
          const size = Math.max(width, height) * 0.7 * o.size;
          const x = (o.x + Math.sin(t * o.speed + o.phase) * 0.07) * width;
          const y = (o.y + Math.cos(t * o.speed * 0.8 + o.phase) * 0.05) * height;
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                left: x - size / 2,
                top: y - size / 2,
                width: size,
                height: size,
                borderRadius: "50%",
                background: `radial-gradient(circle, ${o.color} 0%, transparent 62%)`,
                opacity: o.alpha + level * 0.2,
              }}
            />
          );
        })}

        {/* stage */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            transformOrigin: `${cx}px ${cy}px`,
            transform: `translate(${driftX}px, ${driftY}px) rotate(${tilt}deg) scale(${push})`,
          }}
        >
          <svg width={width} height={height} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
            <defs>
              <linearGradient
                id="barGrad"
                gradientUnits="userSpaceOnUse"
                x1={cx}
                y1={cy - base * 1.8}
                x2={cx}
                y2={cy + base * 1.8}
              >
                <stop offset="0" stopColor={C.ice} />
                <stop offset="0.5" stopColor={C.violet} />
                <stop offset="1" stopColor={C.rose} />
              </linearGradient>
              <radialGradient id="core" cx="50%" cy="40%" r="68%">
                <stop offset="0" stopColor={C.pearl} />
                <stop offset="0.4" stopColor={C.champagne} />
                <stop offset="1" stopColor={C.violet} />
              </radialGradient>
              <radialGradient id="halo">
                <stop offset="0" stopColor={C.violet} stopOpacity="0.55" />
                <stop offset="1" stopColor={C.violet} stopOpacity="0" />
              </radialGradient>
            </defs>

            {/* halo that breathes with the voice */}
            <circle cx={cx} cy={cy} r={base * (1.15 + level * 0.55) * coreIn} fill="url(#halo)" />

            {/* progress track + elapsed arc */}
            <circle
              cx={cx}
              cy={cy}
              r={ringR}
              fill="none"
              stroke={C.champagne}
              strokeOpacity={0.12 * trackIn}
              strokeWidth={2}
            />
            <circle
              cx={cx}
              cy={cy}
              r={ringR}
              fill="none"
              stroke={C.champagne}
              strokeWidth={3}
              strokeLinecap="round"
              strokeDasharray={circ}
              strokeDashoffset={circ * (1 - progress)}
              transform={`rotate(-90 ${cx} ${cy})`}
              opacity={trackIn}
            />
            <circle
              cx={cx + Math.cos(headA) * ringR}
              cy={cy + Math.sin(headA) * ringR}
              r={7}
              fill={C.pearl}
              opacity={trackIn}
              style={{ filter: `drop-shadow(0 0 10px ${C.champagne})` }}
            />

            {/* spectrum ring (mirrored, bass on top) */}
            <g
              stroke="url(#barGrad)"
              strokeLinecap="round"
              strokeWidth={(2 * Math.PI * base * 1.02) / BARS * 0.42}
              style={{ filter: `drop-shadow(0 0 ${10 + level * 18}px rgba(98,230,255,0.45))` }}
            >
              {Array.from({ length: BARS }).map((_, k) => {
                const idx = k < HALF ? k : BARS - 1 - k;
                const a = ((k + 0.5) / BARS) * Math.PI * 2 - Math.PI / 2;
                const rv = Easing.out(Easing.cubic)(clamp((frame - (2 + k * 0.22)) / 14));
                const len = (base * 0.07 + base * 0.63 * bars[idx]) * rv;
                const r1 = base * 1.02;
                const r2 = r1 + len;
                return (
                  <line
                    key={k}
                    x1={cx + Math.cos(a) * r1}
                    y1={cy + Math.sin(a) * r1}
                    x2={cx + Math.cos(a) * r2}
                    y2={cy + Math.sin(a) * r2}
                  />
                );
              })}
            </g>

            {/* glass ring + pearl core */}
            <circle
              cx={cx}
              cy={cy}
              r={base * 0.92}
              fill="none"
              stroke={C.champagne}
              strokeOpacity={0.22}
              strokeWidth={1.5}
            />
            <g
              transform={`translate(${cx} ${cy}) scale(${coreIn * (0.94 + level * 0.14 + Math.sin(t * 1.6) * 0.012)}) translate(${-cx} ${-cy})`}
              opacity={0.72 + level * 0.28}
            >
              <circle cx={cx} cy={cy} r={base * 0.8} fill="url(#core)" />
              <ellipse
                cx={cx - base * 0.25}
                cy={cy - base * 0.32}
                rx={base * 0.22}
                ry={base * 0.1}
                fill="#fff"
                opacity={0.35}
                transform={`rotate(-30 ${cx - base * 0.25} ${cy - base * 0.32})`}
              />
            </g>
          </svg>
        </div>

        {/* title */}
        <div style={{ position: "absolute", color: C.pearl, ...titleBox }}>
          <div
            style={{
              fontSize: unit * 0.072,
              fontWeight: 600,
              letterSpacing: "-0.02em",
              lineHeight: 1.08,
              ...reveal(6),
            }}
          >
            {title}
          </div>
          {subtitle ? (
            <div
              style={{
                marginTop: unit * 0.016,
                fontSize: unit * 0.03,
                fontWeight: 300,
                color: C.mist,
                letterSpacing: "0.01em",
                ...reveal(14),
              }}
            >
              {subtitle}
            </div>
          ) : null}
        </div>

        {/* captions */}
        <div style={{ position: "absolute", display: "flex", ...capBox }}>
          {active ? (
            <CaptionBlock
              key={active.from}
              c={active}
              size={unit * (vertical ? 0.046 : 0.038)}
              align={vertical ? "center" : "flex-start"}
            />
          ) : null}
        </div>

        {/* timecode */}
        <div
          style={{
            position: "absolute",
            fontSize: unit * 0.026,
            fontWeight: 300,
            letterSpacing: "0.12em",
            color: C.mist,
            fontVariantNumeric: "tabular-nums",
            ...timeBox,
            ...reveal(20),
          }}
        >
          {fmt(Math.min(t, total))} / {fmt(total)}
        </div>

        {/* film grain */}
        <svg
          width={width}
          height={height}
          style={{
            position: "absolute",
            inset: 0,
            mixBlendMode: "overlay",
            opacity: 0.09,
            pointerEvents: "none",
          }}
        >
          <filter id="grain">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.9"
              numOctaves={2}
              seed={Math.floor(frame / 2) % 50}
              stitchTiles="stitch"
            />
          </filter>
          <rect width="100%" height="100%" filter="url(#grain)" />
        </svg>

        {/* vignette */}
        <AbsoluteFill
          style={{
            background: "radial-gradient(ellipse at center, transparent 52%, rgba(0,0,0,0.55) 100%)",
            pointerEvents: "none",
          }}
        />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/* ───────────────────────── ROOT ───────────────────────── */

const readDuration = async () => {
  try {
    const s = await getAudioDurationInSeconds(staticFile(AUDIO_FILE));
    return { durationInFrames: Math.ceil(s * FPS) };
  } catch {
    return { durationInFrames: Math.ceil(FALLBACK_SECONDS * FPS) };
  }
};

export const RemotionRoot: React.FC = () => {
  const frames = Math.ceil(FALLBACK_SECONDS * FPS);
  return (
    <>
      {/* Shorts / Reels / TikTok */}
      <Composition
        id="PremiumVoice"
        component={PremiumVoice}
        durationInFrames={frames}
        fps={FPS}
        width={1080}
        height={1920}
        defaultProps={defaultProps}
        calculateMetadata={readDuration}
      />
      {/* YouTube landscape */}
      <Composition
        id="PremiumVoiceWide"
        component={PremiumVoice}
        durationInFrames={frames}
        fps={FPS}
        width={1920}
        height={1080}
        defaultProps={defaultProps}
        calculateMetadata={readDuration}
      />
    </>
  );
};
