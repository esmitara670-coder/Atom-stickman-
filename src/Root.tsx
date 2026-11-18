import React from 'react';
import {
  AbsoluteFill,
  Composition,
  Easing,
  Sequence,
  interpolate,
  interpolateColors,
  random,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';

// ============================================================================
// TIMING LOCKED TO 59-SECOND SCRIPT (30 FPS = 1770 FRAMES)
// Pure Visual | Zero External Files | CapCut Ready
// ============================================================================
const FPS = 30;
const TOTAL_FRAMES = 59 * FPS; // 1770 frames

const SCENES = {
  S1: { from: 0, duration: 8 * FPS },     // 0:00 - 0:08 (Suspicious Link)
  S2: { from: 240, duration: 11 * FPS },  // 0:08 - 0:19 (Security Vulnerability)
  S3: { from: 570, duration: 11 * FPS },  // 0:19 - 0:30 (Malicious Link)
  S4: { from: 900, duration: 10 * FPS },  // 0:30 - 0:40 (Unauthorized Access)
  S5: { from: 1200, duration: 9 * FPS },  // 0:40 - 0:49 (Reality Check)
  S6: { from: 1470, duration: 10 * FPS }, // 0:49 - 0:59 (Final Protection)
};

// ============================================================================
// CUSTOM VECTOR ICONS & HOLOGRAPHIC ELEMENTS
// ============================================================================
const IconShield: React.FC<{
  id: string;
  color: string;
  size?: number;
  checked?: boolean;
  lockInside?: boolean;
}> = ({ id, color, size = 160, checked = false, lockInside = false }) => (
  <svg width={size} height={size} viewBox="0 0 110 120" fill="none">
    <defs>
      <linearGradient id={`sh-${id}`} x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor={color} stopOpacity="0.55" />
        <stop offset="55%" stopColor={color} stopOpacity="0.18" />
        <stop offset="100%" stopColor="#ffffff" stopOpacity="0.06" />
      </linearGradient>
    </defs>
    <path
      d="M55 6 L98 23 V58 C98 86 78 105 55 114 C32 105 12 86 12 58 V23 L55 6 Z"
      fill={`url(#sh-${id})`}
      stroke={color}
      strokeWidth="4"
    />
    <path
      d="M55 16 L88 29 V57 C88 80 72 95 55 103 C38 95 22 80 22 57 V29 L55 16 Z"
      stroke={color}
      strokeOpacity="0.5"
      strokeWidth="2"
    />
    {checked && (
      <path
        d="M36 60 L50 74 L76 44"
        stroke="#ffffff"
        strokeWidth="7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    )}
    {lockInside && (
      <g>
        <path
          d="M44 55 V45 C44 37 66 37 66 45 V55"
          stroke="#ffffff"
          strokeWidth="4.5"
          strokeLinecap="round"
        />
        <rect
          x="37"
          y="55"
          width="36"
          height="28"
          rx="6"
          fill={color}
          fillOpacity="0.4"
          stroke="#ffffff"
          strokeWidth="3.5"
        />
        <circle cx="55" cy="67" r="3.5" fill="#ffffff" />
        <path d="M55 70 V76" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" />
      </g>
    )}
  </svg>
);

const IconPadlock: React.FC<{
  color: string;
  size?: number;
  unlocked?: boolean;
  crackProgress?: number;
}> = ({ color, size = 100, unlocked = false, crackProgress = 0 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
    <path
      d={unlocked ? 'M32 42 V28 C32 16 68 16 68 28 V31' : 'M32 45 V30 C32 16 68 16 68 30 V45'}
      stroke={color}
      strokeWidth="6.5"
      strokeLinecap="round"
      transform={unlocked ? 'translate(8, -7) rotate(16 50 30)' : undefined}
    />
    <rect
      x="18"
      y="44"
      width="64"
      height="46"
      rx="11"
      fill={color}
      fillOpacity="0.2"
      stroke={color}
      strokeWidth="4"
    />
    <circle cx="50" cy="63" r="6" fill={color} />
    <path d="M50 68 V79" stroke={color} strokeWidth="4.5" strokeLinecap="round" />
    {crackProgress > 0 && (
      <path
        d="M52 44 L42 57 L58 68 L45 79 L53 90"
        stroke="#ff1f45"
        strokeWidth="4.5"
        strokeLinecap="round"
        strokeDasharray="78"
        strokeDashoffset={78 * (1 - crackProgress)}
      />
    )}
  </svg>
);

const IconSurveillanceEye: React.FC<{ size?: number; color?: string }> = ({
  size = 165,
  color = '#ff2a4b',
}) => (
  <svg width={size} height={size} viewBox="0 0 120 80" fill="none">
    <path
      d="M6 40 C26 8 94 8 114 40 C94 72 26 72 6 40 Z"
      fill={color}
      fillOpacity="0.18"
      stroke={color}
      strokeWidth="4"
    />
    <circle cx="60" cy="40" r="22" fill={color} fillOpacity="0.32" stroke={color} strokeWidth="3.5" />
    <circle cx="60" cy="40" r="10" fill="#ffffff" />
    <circle cx="60" cy="40" r="5" fill={color} />
  </svg>
);

const FloatingDataCard: React.FC<{
  type: 'photo' | 'contact' | 'file' | 'loc' | 'mic';
  label: string;
  danger?: boolean;
}> = ({ type, label, danger = true }) => {
  const color = danger ? '#ff2a4b' : '#00e5ff';
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 8,
        padding: '15px 20px',
        borderRadius: 22,
        background: danger ? 'rgba(38, 6, 14, 0.9)' : 'rgba(6, 26, 46, 0.9)',
        border: `2.5px solid ${color}`,
        boxShadow: `0 12px 32px rgba(0,0,0,0.6), 0 0 28px ${color}66`,
        minWidth: 126,
      }}
    >
      <svg width={38} height={38} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.1">
        {type === 'photo' && (
          <>
            <rect x="3" y="4" width="18" height="16" rx="2.5" />
            <circle cx="8.5" cy="9.5" r="1.5" />
            <path d="M21 15 L16 10 L5 20" />
          </>
        )}
        {type === 'contact' && (
          <>
            <circle cx="12" cy="8" r="4" />
            <path d="M4 20 C4 16 8 14 12 14 C16 14 20 16 20 20" />
          </>
        )}
        {type === 'file' && (
          <>
            <path d="M14 2 H6 A2 2 0 0 0 4 4 V20 A2 2 0 0 0 6 22 H18 A2 2 0 0 0 20 20 V8 Z" />
            <path d="M14 2 V8 H20" />
          </>
        )}
        {type === 'loc' && (
          <>
            <path d="M12 21 C12 21 19 14.5 19 9.5 A7 7 0 1 0 5 9.5 C5 14.5 12 21 12 21 Z" />
            <circle cx="12" cy="9.5" r="2.5" />
          </>
        )}
        {type === 'mic' && (
          <>
            <rect x="9" y="3" width="6" height="11" rx="3" />
            <path d="M5 11 A7 7 0 0 0 19 11" />
            <path d="M12 18 V22" />
          </>
        )}
      </svg>
      <span
        style={{
          fontSize: 16,
          fontWeight: 800,
          color: '#ffffff',
          letterSpacing: 1,
          textTransform: 'uppercase',
        }}
      >
        {label}
      </span>
      {danger && (
        <span
          style={{
            fontSize: 11,
            fontWeight: 900,
            color: '#ffffff',
            background: '#ff1f45',
            padding: '2px 9px',
            borderRadius: 6,
            letterSpacing: 1.2,
          }}
        >
          EXPOSED
        </span>
      )}
    </div>
  );
};

// ============================================================================
// CYBER ENVIRONMENT BACKDROP & 3D SMARTPHONE CHASSIS
// ============================================================================
const CyberEnvironment: React.FC<{
  primary: string;
  secondary: string;
  frame: number;
  circuitLines?: boolean;
}> = ({ primary, secondary, frame, circuitLines = false }) => {
  const gridShift = (frame * 2.8) % 84;

  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(circle at 50% 42%, ${primary}38 0%, #050914 58%, #020308 100%)`,
        overflow: 'hidden',
      }}
    >
      {/* Volumetric Glow Orb */}
      <div
        style={{
          position: 'absolute',
          width: 960,
          height: 960,
          borderRadius: '50%',
          background: `radial-gradient(circle, ${secondary}28 0%, transparent 68%)`,
          top: '52%',
          left: '50%',
          transform: `translate(-50%, -50%) scale(${1 + Math.sin(frame * 0.05) * 0.07})`,
        }}
      />

      {/* Motherboard Circuit Traces (Scene 5 & 6) */}
      {circuitLines && (
        <svg
          viewBox="0 0 1080 1920"
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.28 }}
        >
          {[140, 290, 790, 940].map((x, idx) => (
            <g key={x} stroke={primary} strokeWidth="2.5" fill="none">
              <path
                d={`M${x} 0 V${480 + idx * 90} L${x + (idx < 2 ? 75 : -75)} ${560 + idx * 90} V1920`}
              />
              <circle cx={x} cy={480 + idx * 90} r="7" fill={primary} />
              <circle cx={x + (idx < 2 ? 75 : -75)} cy={560 + idx * 90} r="7" fill={primary} />
            </g>
          ))}
        </svg>
      )}

      {/* Animated Perspective Floor Grid */}
      <div
        style={{
          position: 'absolute',
          left: '-45%',
          right: '-45%',
          bottom: '-18%',
          height: '58%',
          perspective: 720,
          opacity: 0.44,
        }}
      >
        <div
          style={{
            width: '100%',
            height: '100%',
            transform: 'rotateX(73deg)',
            backgroundImage: `
              linear-gradient(${primary}66 1.5px, transparent 1.5px),
              linear-gradient(90deg, ${primary}66 1.5px, transparent 1.5px)
            `,
            backgroundSize: '84px 84px',
            backgroundPosition: `0px ${gridShift}px`,
          }}
        />
      </div>

      {/* Depth Cyber Particles */}
      {Array.from({ length: 28 }).map((_, i) => {
        const x = random(`cx-${i}`) * 100;
        const speed = 0.6 + random(`cs-${i}`) * 1.5;
        const y0 = random(`cy-${i}`) * 100;
        const y = (y0 - frame * speed * 0.2 + 220) % 112;
        const size = 4 + random(`cz-${i}`) * 8;
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: `${x}%`,
              top: `${y}%`,
              width: size,
              height: size,
              borderRadius: '50%',
              background: i % 2 === 0 ? primary : secondary,
              boxShadow: `0 0 ${size * 2.6}px ${primary}`,
              opacity: 0.28 + random(`co-${i}`) * 0.5,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};

const CyberPhone3D: React.FC<{
  rotateX?: number;
  rotateY?: number;
  rotateZ?: number;
  scale?: number;
  glowColor: string;
  children: React.ReactNode;
}> = ({ rotateX = 0, rotateY = 0, rotateZ = 0, scale = 1, glowColor, children }) => (
  <div style={{ perspective: 1500, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
    <div
      style={{
        width: 430,
        height: 820,
        borderRadius: 60,
        background: 'linear-gradient(150deg, #1d273b 0%, #090e1a 60%, #151f33 100%)',
        padding: 16,
        border: `3.5px solid ${glowColor}`,
        boxShadow: `
          0 35px 95px rgba(0, 0, 0, 0.9),
          0 0 65px ${glowColor}55,
          inset 0 0 26px ${glowColor}33
        `,
        transform: `scale(${scale}) rotateX(${rotateX}deg) rotateY(${rotateY}deg) rotateZ(${rotateZ}deg)`,
        transformStyle: 'preserve-3d',
        position: 'relative',
      }}
    >
      {/* Dynamic Island */}
      <div
        style={{
          position: 'absolute',
          top: 30,
          left: '50%',
          transform: 'translateX(-50%)',
          width: 118,
          height: 28,
          borderRadius: 20,
          background: '#04060c',
          zIndex: 25,
          border: '1px solid rgba(255,255,255,0.1)',
        }}
      />
      {/* Glass Glare Reflection */}
      <div
        style={{
          position: 'absolute',
          inset: 16,
          borderRadius: 44,
          background:
            'linear-gradient(125deg, rgba(255,255,255,0.11) 0%, transparent 34%, transparent 72%, rgba(255,255,255,0.05) 100%)',
          pointerEvents: 'none',
          zIndex: 20,
        }}
      />
      {/* Screen Container */}
      <div
        style={{
          width: '100%',
          height: '100%',
          borderRadius: 44,
          background: 'linear-gradient(180deg, #0b1224 0%, #050812 100%)',
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        {children}
      </div>
    </div>
  </div>
);

const TopTitleBadge: React.FC<{
  text: string;
  accent: string;
  frame: number;
  fps: number;
  delay?: number;
}> = ({ text, accent, frame, fps, delay = 10 }) => {
  const anim = spring({ frame: frame - delay, fps, config: { damping: 14, stiffness: 135 } });
  return (
    <div
      style={{
        position: 'absolute',
        top: 150,
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        opacity: anim,
        transform: `translateY(${interpolate(anim, [0, 1], [-28, 0])}px) scale(${interpolate(anim, [0, 1], [0.92, 1])})`,
        zIndex: 35,
      }}
    >
      <div
        style={{
          padding: '16px 40px',
          borderRadius: 18,
          background: 'rgba(5, 10, 22, 0.85)',
          border: `2.5px solid ${accent}`,
          boxShadow: `0 0 40px ${accent}55`,
        }}
      >
        <span
          style={{
            fontSize: 44,
            fontWeight: 900,
            letterSpacing: 3,
            color: '#ffffff',
            textShadow: `0 0 22px ${accent}`,
            textTransform: 'uppercase',
          }}
        >
          {text}
        </span>
      </div>
    </div>
  );
};

// ============================================================================
// SCENE 1 — THE SUSPICIOUS LINK (0:00 - 0:08 | 240 Frames)
// ============================================================================
const Scene1SuspiciousLink: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const clickFrame = 62;
  const isClicked = frame >= clickFrame;
  const dangerP = interpolate(frame, [clickFrame, clickFrame + 22], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const primary = interpolateColors(dangerP, [0, 1], ['#00ccff', '#ff1f45']);
  const floatY = Math.sin(frame * 0.065) * 14;

  const cursorX = interpolate(frame, [24, clickFrame - 4], [250, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  });
  const cursorY = interpolate(frame, [24, clickFrame - 4], [260, 20], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  });
  const tapScale = frame >= clickFrame - 3 && frame <= clickFrame + 5 ? 0.78 : 1;

  const rippleScale = interpolate(frame, [clickFrame, clickFrame + 26], [0.2, 6], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const rippleOpacity = interpolate(frame, [clickFrame, clickFrame + 26], [0.95, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const glitchX = frame >= clickFrame && frame <= clickFrame + 16 ? Math.sin(frame * 48) * 15 : 0;

  const stealP = interpolate(frame, [82, 158], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.quad),
  });

  const otpPop = spring({ frame: frame - 152, fps, config: { damping: 12, stiffness: 165 } });
  const passPop = spring({ frame: frame - 172, fps, config: { damping: 12, stiffness: 165 } });

  return (
    <AbsoluteFill style={{ transform: `translateX(${glitchX}px)` }}>
      <CyberEnvironment primary={primary} secondary={isClicked ? '#ff6a00' : '#0055ff'} frame={frame} />

      <TopTitleBadge
        text="ONE CLICK = BIG RISK?"
        accent={primary}
        frame={frame}
        fps={fps}
        delay={isClicked ? 66 : 140}
      />

      <AbsoluteFill
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          transform: `translateY(${floatY - 25}px)`,
        }}
      >
        <CyberPhone3D
          rotateY={interpolate(frame, [0, 240], [-11, 11])}
          rotateX={6}
          scale={1.06}
          glowColor={primary}
        >
          <div
            style={{
              padding: '72px 28px 16px',
              display: 'flex',
              justifyContent: 'space-between',
              color: '#93a8cc',
              fontSize: 15,
              fontWeight: 700,
            }}
          >
            <span>INBOX</span>
            <span style={{ color: isClicked ? '#ff3355' : '#00e5ff' }}>
              {isClicked ? '● SYSTEM BREACH' : '● NEW MESSAGE'}
            </span>
          </div>

          <div
            style={{
              margin: '26px 24px',
              padding: 24,
              borderRadius: 24,
              background: isClicked ? 'rgba(255, 28, 65, 0.2)' : 'rgba(22, 36, 66, 0.94)',
              border: `2px solid ${isClicked ? '#ff3355' : '#2d549e'}`,
              transform: `scale(${spring({ frame: frame - 8, fps, config: { damping: 14 } })})`,
            }}
          >
            <div style={{ fontSize: 14, color: '#9ab4db', marginBottom: 8, fontWeight: 800 }}>
              UNKNOWN NUMBER • NOW
            </div>
            <div style={{ fontSize: 22, color: '#ffffff', lineHeight: 1.4, marginBottom: 16 }}>
              Urgent! Tap this link to verify your account immediately:
            </div>
            <div
              style={{
                padding: '13px 16px',
                borderRadius: 12,
                background: isClicked ? 'rgba(255, 31, 69, 0.32)' : 'rgba(0, 174, 255, 0.22)',
                border: `2px solid ${isClicked ? '#ff3355' : '#00d4ff'}`,
                color: isClicked ? '#ff8da1' : '#5ce6ff',
                fontSize: 19,
                fontWeight: 800,
                textDecoration: 'underline',
                fontFamily: 'monospace',
              }}
            >
              https://verify-now.xyz/k9
            </div>
          </div>

          {isClicked && (
            <div
              style={{
                position: 'absolute',
                top: 310,
                left: '50%',
                width: 92,
                height: 92,
                marginLeft: -46,
                marginTop: -46,
                borderRadius: '50%',
                border: '6px solid #ff2a4b',
                transform: `scale(${rippleScale})`,
                opacity: rippleOpacity,
              }}
            />
          )}

          {frame >= 22 && frame <= 80 && (
            <div
              style={{
                position: 'absolute',
                top: 295,
                left: '50%',
                transform: `translate(${cursorX - 26}px, ${cursorY}px) scale(${tapScale})`,
                width: 56,
                height: 56,
                borderRadius: '50%',
                background: 'rgba(255, 255, 255, 0.28)',
                border: '3.5px solid #ffffff',
                boxShadow: '0 0 28px #00e5ff',
              }}
            />
          )}

          {isClicked && (
            <div
              style={{
                margin: '30px 24px',
                padding: 22,
                borderRadius: 20,
                background: 'rgba(255, 20, 55, 0.25)',
                border: '2px solid #ff2a4b',
                textAlign: 'center',
                opacity: dangerP,
              }}
            >
              <div style={{ fontSize: 22, fontWeight: 900, color: '#ff4d6d', letterSpacing: 2 }}>
                ⚠ HIDDEN SCRIPT EXECUTED
              </div>
              <div style={{ fontSize: 15, color: '#ffd1d9', marginTop: 8, fontFamily: 'monospace' }}>
                UNAUTHORIZED TRANSFER ACTIVE
              </div>
            </div>
          )}
        </CyberPhone3D>

        {isClicked && (
          <>
            <div
              style={{
                position: 'absolute',
                transform: `translate(${interpolate(stealP, [0, 1], [-120, -340])}px, ${interpolate(stealP, [0, 1], [30, -270])}px) scale(${stealP})`,
                opacity: stealP,
              }}

