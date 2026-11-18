/**
 * src/Root.tsx — Premium audio-reactive Remotion video
 *
 * Fixes:
 * - Removes the missing @remotion/google-fonts/Sora dependency.
 * - Keeps automatic audio duration detection with a safe fallback.
 * - Adds a cleaner cinematic cyber-style visualizer and responsive layouts.
 *
 * Required:
 *   npm i @remotion/media-utils
 *   Put your audio at: public/studio_voice__12_.wav
 *
 * Render:
 *   npx remotion render PremiumVoice out/voice.mp4
 *   npx remotion render PremiumVoiceWide out/voice-wide.mp4
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

/* ---------------- SETTINGS ---------------- */

const AUDIO_FILE = "studio_voice__12_.wav";
const FPS = 30;
const FALLBACK_SECONDS = 56.05;

const C = {
  bg: "#050914",
  navy: "#0B1530",
  blue: "#28C9FF",
  cyan: "#70F1FF",
  violet: "#806BFF",
  pink: "#FF4F91",
  red: "#FF3E55",
  white: "#F5FAFF",
  muted: "rgba(225,240,255,0.62)",
};

type Caption = { from: number; to: number; text: string };

export type VoiceProps = {
  title: string;
  subtitle: string;
  captions: Caption[];
};

const defaultProps: VoiceProps = {
  title: "CYBER SECURITY",
  subtitle: "Understand the technology",
  captions: [],
};

const clamp = (v: number, min = 0, max = 1) =>
  Math.min(max, Math.max(min, v));

const formatTime = (seconds: number) => {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
};

/* ---------------- SMALL VISUAL ELEMENTS ---------------- */

const GlowOrb: React.FC<{
  x: number;
  y: number;
  size: number;
  color: string;
  opacity: number;
  blur: number;
}> = ({ x, y, size, color, opacity, blur }) => (
  <div
    style={{
      position: "absolute",
      left: `${x}%`,
      top: `${y}%`,
      width: size,
      height: size,
      borderRadius: "50%",
      transform: "translate(-50%, -50%)",
      background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
      filter: `blur(${blur}px)`,
      opacity,
      pointerEvents: "none",
    }}
  />
);

const CaptionBlock: React.FC<{ caption: Caption; vertical: boolean; unit: number }> = ({
  caption,
  vertical,
  unit,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const start = Math.round(caption.from * fps);
  const end = Math.round(caption.to * fps);
  const localFrame = frame - start;

  const fadeIn = interpolate(frame, [start, start + 9], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const fadeOut = interpolate(frame, [end - 8, end], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const enter = spring({
    frame: Math.max(0, localFrame),
    fps,
    config: { damping: 18, stiffness: 120 },
  });

  return (
    <div
      style={{
        maxWidth: "100%",
        padding: `${unit * 0.035}px ${unit * 0.045}px`,
        borderRadius: unit * 0.025,
        background: "rgba(5,12,28,0.72)",
        border: "1px solid rgba(112,241,255,0.34)",
        boxShadow: "0 12px 45px rgba(0,0,0,0.35), 0 0 24px rgba(40,201,255,0.12)",
        backdropFilter: "blur(18px)",
        color: C.white,
        fontSize: unit * (vertical ? 0.043 : 0.032),
        lineHeight: 1.35,
        fontWeight: 600,
        textAlign: vertical ? "center" : "left",
        opacity: fadeIn * fadeOut,
        transform: `translateY(${(1 - enter) * 18}px)`,
        fontFamily: '"Noto Sans Devanagari", "Noto Sans Bengali", Arial, sans-serif',
        overflowWrap: "anywhere",
      }}
    >
      {caption.text}
    </div>
  );
};

/* ---------------- MAIN VIDEO ---------------- */

const PremiumVoice: React.FC<VoiceProps> = ({ title, subtitle, captions }) => {
  const frame = useCurrentFrame();
  const { fps, width, height, durationInFrames } = useVideoConfig();

  const audioData = useAudioData(staticFile(AUDIO_FILE));
  const vertical = height >= width;
  const unit = Math.min(width, height);
  const t = frame / fps;
  const total = durationInFrames / fps;
  const progress = clamp(frame / Math.max(1, durationInFrames));

  // Audio-reactive spectrum. If audio data is not ready, the animation still renders.
  const HALF = 42;
  const BAR_COUNT = HALF * 2;
  const bars: number[] = new Array(HALF).fill(0.08);
  let voiceLevel = 0;

  if (audioData) {
    const raw = visualizeAudio({
      fps,
      frame,
      audioData,
      numberOfSamples: 256,
      optimizeFor: "speed",
    });

    for (let i = 0; i < HALF; i++) {
      const low = Math.floor((i / HALF) * 120);
      const high = Math.max(low + 1, Math.floor(((i + 1) / HALF) * 120));
      let sum = 0;
      for (let j = low; j < high; j++) sum += raw[j] ?? 0;
      bars[i] = clamp(Math.sqrt(sum / (high - low)) * (1.8 + (i / HALF) * 1.3));
    }

    let bass = 0;
    for (let i = 0; i < 18; i++) bass += raw[i] ?? 0;
    voiceLevel = clamp(Math.sqrt(bass / 18) * 2.2);
  }

  const cx = vertical ? width / 2 : width * 0.68;
  const cy = vertical ? height * 0.43 : height * 0.5;
  const radius = unit * (vertical ? 0.235 : 0.205);
  const ringCircumference = 2 * Math.PI * radius;

  const intro = spring({
    frame: Math.max(0, frame - 3),
    fps,
    config: { damping: 16, stiffness: 75, mass: 1 },
  });

  const zoom = interpolate(frame, [0, 42], [1.12, 1], {
    easing: Easing.out(Easing.cubic),
    extrapolateRight: "clamp",
  });
  const cameraScale = zoom * (1 + progress * 0.035 + voiceLevel * 0.012);
  const driftX = Math.sin(t * 0.28) * width * 0.006;
  const driftY = Math.cos(t * 0.24) * height * 0.005;

  const fadeOut = interpolate(
    frame,
    [durationInFrames - 18, durationInFrames],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  const activeCaption = captions.find((c) => t >= c.from && t < c.to);

  const titleStyle: React.CSSProperties = vertical
    ? {
        position: "absolute",
        top: height * 0.105,
        left: width * 0.07,
        right: width * 0.07,
        textAlign: "center",
      }
    : {
        position: "absolute",
        top: height * 0.28,
        left: width * 0.065,
        width: width * 0.36,
        textAlign: "left",
      };

  const captionStyle: React.CSSProperties = vertical
    ? {
        position: "absolute",
        left: width * 0.07,
        right: width * 0.07,
        top: height * 0.735,
        display: "flex",
        justifyContent: "center",
      }
    : {
        position: "absolute",
        left: width * 0.065,
        top: height * 0.53,
        width: width * 0.38,
        display: "flex",
        justifyContent: "flex-start",
      };

  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(145deg, ${C.navy} 0%, ${C.bg} 58%, #090D20 100%)`,
        color: C.white,
        fontFamily: '"Noto Sans", "Noto Sans Devanagari", "Noto Sans Bengali", Arial, sans-serif',
        overflow: "hidden",
      }}
    >
      <Audio
        src={staticFile(AUDIO_FILE)}
        volume={(f) =>
          interpolate(f, [durationInFrames - 8, durationInFrames], [1, 0], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          })
        }
      />

      <AbsoluteFill style={{ opacity: fadeOut }}>
        {/* Cinematic background lighting */}
        <GlowOrb x={18 + Math.sin(t * 0.22) * 4} y={23} size={unit * 1.05} color={C.violet} opacity={0.27} blur={30} />
        <GlowOrb x={86 + Math.cos(t * 0.18) * 3} y={57} size={unit * 0.95} color={C.blue} opacity={0.23} blur={34} />
        <GlowOrb x={32} y={91 + Math.sin(t * 0.16) * 3} size={unit * 0.8} color={C.pink} opacity={0.16} blur={36} />

        {/* Fine technical grid */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            opacity: 0.13,
            backgroundImage:
              "linear-gradient(rgba(112,241,255,0.16) 1px, transparent 1px), linear-gradient(90deg, rgba(112,241,255,0.16) 1px, transparent 1px)",
            backgroundSize: `${unit * 0.075}px ${unit * 0.075}px`,
            maskImage: "linear-gradient(to bottom, transparent, black 18%, black 82%, transparent)",
          }}
        />

        {/* Main visualizer stage */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            transform: `translate(${driftX}px, ${driftY}px) scale(${cameraScale})`,
            transformOrigin: `${cx}px ${cy}px`,
          }}
        >
          <svg
            width={width}
            height={height}
            viewBox={`0 0 ${width} ${height}`}
            style={{ position: "absolute", inset: 0, overflow: "visible" }}
          >
            <defs>
              <linearGradient id="spectrum" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor={C.cyan} />
                <stop offset="48%" stopColor={C.violet} />
                <stop offset="100%" stopColor={C.pink} />
              </linearGradient>
              <radialGradient id="coreGlow">
                <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.95" />
                <stop offset="28%" stopColor={C.cyan} stopOpacity="0.85" />
                <stop offset="70%" stopColor={C.violet} stopOpacity="0.34" />
                <stop offset="100%" stopColor={C.violet} stopOpacity="0" />
              </radialGradient>
              <filter id="softGlow" x="-100%" y="-100%" width="300%" height="300%">
                <feGaussianBlur stdDeviation="12" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* Outer halo */}
            <circle
              cx={cx}
              cy={cy}
              r={radius * (1.65 + voiceLevel * 0.22)}
              fill="url(#coreGlow)"
              opacity={0.36 + voiceLevel * 0.2}
            />

            {/* Progress ring */}
            <circle
              cx={cx}
              cy={cy}
              r={radius * 1.43}
              fill="none"
              stroke="rgba(220,240,255,0.15)"
              strokeWidth={Math.max(2, unit * 0.002)}
            />
            <circle
              cx={cx}
              cy={cy}
              r={radius * 1.43}
              fill="none"
              stroke={C.cyan}
              strokeWidth={Math.max(3, unit * 0.003)}
              strokeLinecap="round"
              strokeDasharray={ringCircumference * 1.43}
              strokeDashoffset={ringCircumference * 1.43 * (1 - progress)}
              transform={`rotate(-90 ${cx} ${cy})`}
              filter="url(#softGlow)"
            />

            {/* Audio spectrum ring */}
            <g
              stroke="url(#spectrum)"
              strokeLinecap="round"
              strokeWidth={Math.max(2, unit * 0.003)}
              filter="url(#softGlow)"
            >
              {Array.from({ length: BAR_COUNT }).map((_, k) => {
                const idx = k < HALF ? k : BAR_COUNT - 1 - k;
                const angle = (k / BAR_COUNT) * Math.PI * 2 - Math.PI / 2;
                const appear = Easing.out(Easing.cubic)(clamp((frame - 4 - k * 0.12) / 18));
                const length = (unit * 0.012 + unit * 0.105 * bars[idx]) * appear;
                const inner = radius * 0.91;
                const outer = inner + length;
                return (
                  <line
                    key={k}
                    x1={cx + Math.cos(angle) * inner}
                    y1={cy + Math.sin(angle) * inner}
                    x2={cx + Math.cos(angle) * outer}
                    y2={cy + Math.sin(angle) * outer}
                    opacity={0.75 + voiceLevel * 0.25}
                  />
                );
              })}
            </g>

            {/* Core */}
            <circle
              cx={cx}
              cy={cy}
              r={radius * (0.7 + voiceLevel * 0.035)}
              fill="url(#coreGlow)"
              opacity={intro}
            />
            <circle
              cx={cx}
              cy={cy}
              r={radius * 0.47}
              fill="rgba(8,18,42,0.74)"
              stroke="rgba(112,241,255,0.62)"
              strokeWidth={Math.max(2, unit * 0.003)}
            />
            <circle
              cx={cx}
              cy={cy}
              r={radius * (0.25 + voiceLevel * 0.025)}
              fill={C.cyan}
              opacity={0.72 + voiceLevel * 0.28}
              filter="url(#softGlow)"
            />
            <circle
              cx={cx}
              cy={cy}
              r={radius * 0.11}
              fill="#FFFFFF"
              opacity={0.9}
            />

            {/* Orbiting data points */}
            {Array.from({ length: 12 }).map((_, i) => {
              const a = t * 0.35 + (i / 12) * Math.PI * 2;
              const orbit = radius * 1.72;
              const x = cx + Math.cos(a) * orbit;
              const y = cy + Math.sin(a) * orbit;
              return (
                <g key={i}>
                  <circle cx={x} cy={y} r={unit * 0.004} fill={i % 2 ? C.cyan : C.pink} opacity={0.8} />
                  <circle cx={x} cy={y} r={unit * 0.012} fill={C.cyan} opacity={0.08} />
                </g>
              );
            })}
          </svg>
        </div>

        {/* Title and subtitle */}
        <div style={titleStyle}>
          <div
            style={{
              fontSize: unit * (vertical ? 0.075 : 0.066),
              fontWeight: 800,
              letterSpacing: vertical ? "0.035em" : "0.015em",
              lineHeight: 1.12,
              textShadow: "0 4px 28px rgba(40,201,255,0.22)",
              opacity: interpolate(frame, [4, 24], [0, 1], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              }),
              transform: `translateY(${interpolate(frame, [4, 24], [24, 0], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              })}px)`,
            }}
          >
            {title}
          </div>
          {subtitle ? (
            <div
              style={{
                marginTop: unit * 0.018,
                color: C.muted,
                fontSize: unit * (vertical ? 0.029 : 0.025),
                fontWeight: 400,
                letterSpacing: "0.08em",
                opacity: interpolate(frame, [14, 34], [0, 1], {
                  extrapolateLeft: "clamp",
                  extrapolateRight: "clamp",
                }),
              }}
            >
              {subtitle}
            </div>
          ) : null}
        </div>

        {/* Captions */}
        <div style={captionStyle}>
          {activeCaption ? (
            <CaptionBlock
              key={activeCaption.from}
              caption={activeCaption}
              vertical={vertical}
              unit={unit}
            />
          ) : null}
        </div>

        {/* Timecode + progress */}
        <div
          style={{
            position: "absolute",
            left: vertical ? 0 : width * 0.065,
            right: vertical ? 0 : undefined,
            bottom: height * (vertical ? 0.055 : 0.075),
            width: vertical ? "100%" : undefined,
            textAlign: vertical ? "center" : "left",
            color: C.muted,
            fontSize: unit * 0.025,
            letterSpacing: "0.14em",
            fontVariantNumeric: "tabular-nums",
          }}
        >
          {formatTime(Math.min(t, total))} / {formatTime(total)}
        </div>

        {/* Bottom progress line */}
        <div
          style={{
            position: "absolute",
            left: width * 0.07,
            right: width * 0.07,
            bottom: height * 0.025,
            height: Math.max(3, unit * 0.003),
            background: "rgba(255,255,255,0.12)",
            borderRadius: 999,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              width: `${progress * 100}%`,
              height: "100%",
              borderRadius: 999,
              background: `linear-gradient(90deg, ${C.blue}, ${C.violet}, ${C.pink})`,
              boxShadow: `0 0 16px ${C.blue}`,
            }}
          />
        </div>

        {/* Vignette */}
        <AbsoluteFill
          style={{
            background:
              "radial-gradient(ellipse at center, transparent 42%, rgba(0,0,0,0.28) 100%)",
            pointerEvents: "none",
          }}
        />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/* ---------------- ROOT ---------------- */

const calculateAudioDuration = async () => {
  try {
    const seconds = await getAudioDurationInSeconds(staticFile(AUDIO_FILE));
    return { durationInFrames: Math.max(1, Math.ceil(seconds * FPS)) };
  } catch (error) {
    console.warn("Could not read audio duration; using fallback duration.", error);
    return { durationInFrames: Math.ceil(FALLBACK_SECONDS * FPS) };
  }
};

export const RemotionRoot: React.FC = () => {
  const fallbackFrames = Math.ceil(FALLBACK_SECONDS * FPS);

  return (
    <>
      <Composition
        id="PremiumVoice"
        component={PremiumVoice}
        durationInFrames={fallbackFrames}
        fps={FPS}
        width={1080}
        height={1920}
        defaultProps={defaultProps}
        calculateMetadata={calculateAudioDuration}
      />

      <Composition
        id="PremiumVoiceWide"
        component={PremiumVoice}
        durationInFrames={fallbackFrames}
        fps={FPS}
        width={1920}
        height={1080}
        defaultProps={defaultProps}
        calculateMetadata={calculateAudioDuration}
      />
    </>
  );
};

