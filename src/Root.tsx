import React from 'react';
import {
  AbsoluteFill,
  Audio,
  Composition,
  Sequence,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';

const CyberStage: React.FC<{
  primary: string;
  secondary: string;
  tag: string;
  headline: string;
  subline: string;
  children: React.ReactNode;
}> = ({primary, secondary, tag, headline, subline, children}) => {
  const frame = useCurrentFrame();
  const gridOffset = (frame * 5) % 90;
  const glowPulse = interpolate(Math.sin(frame * 0.15), [-1, 1], [0.6, 1.1]);

  return (
    <AbsoluteFill
      style={{
        backgroundColor: '#02040a',
        backgroundImage: `radial-gradient(circle at 50% 40%, ${primary}38 0%, ${secondary}1a 48%, #010308 92%)`,
        fontFamily: 'system-ui, -apple-system, sans-serif',
        color: '#ffffff',
        overflow: 'hidden',
      }}
    >
      {/* 3D Animated Circuit Grid Floor */}
      <div
        style={{
          position: 'absolute',
          bottom: -280,
          left: -350,
          right: -350,
          height: 1150,
          transform: 'perspective(850px) rotateX(68deg)',
          backgroundImage: `
            linear-gradient(to right, ${primary}55 2px, transparent 2px),
            linear-gradient(to bottom, ${secondary}55 2px, transparent 2px)
          `,
          backgroundSize: '90px 90px',
          backgroundPosition: `0px ${gridOffset}px`,
          boxShadow: `0 -80px 180px ${primary}66 inset`,
        }}
      />

      {/* Rising Cyber Matrix Particles */}
      {Array.from({length: 20}).map((_, i) => {
        const topPos = 1920 - ((frame * (4 + (i % 5)) + i * 110) % 2050);
        const leftPos = (i * 57) % 1040;
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: leftPos,
              top: topPos,
              width: i % 3 === 0 ? 5 : 10,
              height: i % 3 === 0 ? 36 : 10,
              borderRadius: 4,
              backgroundColor: i % 2 === 0 ? primary : secondary,
              boxShadow: `0 0 20px ${primary}`,
              opacity: 0.7,
            }}
          />
        );
      })}

      {/* Top Cyber HUD Bar */}
      <div
        style={{
          position: 'absolute',
          top: 75,
          left: 55,
          right: 55,
          padding: '18px 30px',
          background: 'rgba(5, 10, 25, 0.88)',
          border: `2px solid ${primary}`,
          borderRadius: 16,
          boxShadow: `0 0 35px ${primary}66`,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <span style={{fontSize: 28, fontWeight: 900, letterSpacing: 3, color: primary}}>
          ● {tag}
        </span>
        <span style={{fontSize: 24, fontWeight: 700, color: '#94a3b8'}}>
          REC // 00:{String(Math.floor(frame / 30)).padStart(2, '0')}
        </span>
      </div>

      {/* 3D Visual Container */}
      <AbsoluteFill style={{perspective: 1200}}>{children}</AbsoluteFill>

      {/* Bottom Cinematic Caption & Kinetic Text */}
      <div
        style={{
          position: 'absolute',
          bottom: 110,
          left: 50,
          right: 50,
          padding: '28px 34px',
          background: 'linear-gradient(135deg, rgba(8,14,32,0.96), rgba(3,6,16,0.96))',
          border: `3px solid ${primary}`,
          borderRadius: 24,
          boxShadow: `0 0 ${50 * glowPulse}px ${primary}88`,
          textAlign: 'center',
        }}
      >
        <div
          style={{
            fontSize: 42,
            fontWeight: 900,
            letterSpacing: 2,
            color: '#ffffff',
            textShadow: `0 0 22px ${primary}`,
          }}
        >
          {headline}
        </div>
        <div style={{fontSize: 28, fontWeight: 700, color: '#cbd5e1', marginTop: 10}}>
          {subline}
        </div>
      </div>
    </AbsoluteFill>
  );
};

const Scene1Hook: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const pop = spring({frame: frame - 15, fps, config: {damping: 12}});
  const glitchX = frame > 45 && frame % 6 < 2 ? 14 : 0;

  return (
    <CyberStage
      primary="#ef4444"
      secondary="#3b82f6"
      tag="SCENE 01 // ZERO-CLICK DANGER"
      headline="ONE CLICK = BIG RISK?"
      subline="No OTP. No Password. Photos & Contacts Stolen!"
    >
      <div
        style={{
          position: 'absolute',
          top: '20%',
          left: '50%',
          width: 500,
          height: 880,
          marginLeft: -250 + glitchX,
          borderRadius: 48,
          border: '7px solid #38bdf8',
          background: 'linear-gradient(180deg, #0f172a 0%, #1e1b4b 100%)',
          boxShadow: '0 0 95px #ef444499, 0 0 45px #3b82f666 inset',
          transform: `rotateY(-15deg) rotateX(10deg) scale(${0.9 + pop * 0.1})`,
          padding: 36,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}
      >
        <div
          style={{
            padding: 22,
            borderRadius: 18,
            background: 'rgba(239,68,68,0.2)',
            border: '2px solid #ef4444',
            color: '#fca5a5',
            fontSize: 27,
            fontWeight: 800,
            textAlign: 'center',
          }}
        >
          http://free-reward-claim.xyz/login
        </div>
        <div style={{textAlign: 'center', fontSize: 105}}>
          {frame < 40 ? '👆' : '⚡'}
        </div>
        <div style={{display: 'flex', justifyContent: 'space-around', fontSize: 60}}>
          <span>🖼️</span>
          <span>👥</span>
          <span>🔓</span>
        </div>
        <div
          style={{
            padding: 24,
            borderRadius: 18,
            background: '#ef4444',
            textAlign: 'center',
            fontSize: 33,
            fontWeight: 900,
            boxShadow: '0 0 35px #ef4444',
          }}
        >
          NO OTP • NO PASSWORD
        </div>
      </div>
    </CyberStage>
  );
};
const Scene2Vulnerability: React.FC = () => {
  const frame = useCurrentFrame();
  const zoom = interpolate(frame, [0, 330], [0.95, 1.22]);
  const crackPulse = interpolate(Math.sin(frame * 0.25), [-1, 1], [0.5, 1]);

  return (
    <CyberStage
      primary="#06b6d4"
      secondary="#ef4444"
      tag="SCENE 02 // BROWSER EXPLOIT"
      headline="SECURITY VULNERABILITY"
      subline="Hackers Exploit Hidden Browser & Software Flaws"
    >
      <div
        style={{
          position: 'absolute',
          top: '18%',
          left: '8%',
          right: '8%',
          height: 1000,
          transform: `scale(${zoom})`,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        {/* 3D Browser Code Interface with Red Fault Lines */}
        <div
          style={{
            width: '100%',
            padding: 34,
            borderRadius: 28,
            background: 'rgba(6, 22, 46, 0.9)',
            border: '3px solid #22d3ee',
            boxShadow: '0 0 65px #06b6d466',
            transform: 'perspective(900px) rotateY(-10deg)',
          }}
        >
          <div style={{fontSize: 28, fontWeight: 800, color: '#38bdf8', marginBottom: 14}}>
            BROWSER_ENGINE // VULNERABILITY DETECTED
          </div>
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              style={{
                display: 'flex',
                alignItems: 'center',
                margin: '16px 0',
                padding: '14px 20px',
                background: 'rgba(239, 68, 68, 0.2)',
                borderLeft: '6px solid #ef4444',
                borderRadius: 10,
              }}
            >
              <span style={{fontSize: 34, marginRight: 16}}>⚠️</span>
              <div
                style={{
                  flex: 1,
                  height: 10,
                  borderRadius: 5,
                  background: 'linear-gradient(90deg, #ef4444, #06b6d4)',
                  boxShadow: '0 0 20px #ef4444',
                }}
              />
            </div>
          ))}
        </div>

        {/* Cracked Glowing Cyan Shield with Red Laser Burst */}
        <svg viewBox="0 0 240 260" width="420" height="450">
          <path
            d="M120 15 L220 55 L220 135 C220 195 120 245 120 245 C120 245 20 195 20 135 L20 55 Z"
            fill="rgba(6, 182, 212, 0.22)"
            stroke="#22d3ee"
            strokeWidth="7"
          />
          <path
            d="M55 85 L115 125 L90 160 L145 135 L190 185"
            fill="none"
            stroke="#ef4444"
            strokeWidth="9"
            opacity={crackPulse}
          />
          <circle cx="120" cy="130" r={30 * crackPulse} fill="#ef4444" />
        </svg>
      </div>
    </CyberStage>
  );
};

const Scene3MaliciousLink: React.FC = () => {
  const frame = useCurrentFrame();
  const skullScale = interpolate(Math.sin(frame * 0.2), [-1, 1], [0.9, 1.12]);

  return (
    <CyberStage
      primary="#ef4444"
      secondary="#f59e0b"
      tag="SCENE 03 // PAYLOAD TRIGGER"
      headline="MALICIOUS LINK"
      subline="Harmful Hidden Code Triggers Browser Weakness"
    >
      <div
        style={{
          position: 'absolute',
          top: '19%',
          left: '7%',
          right: '7%',
          display: 'flex',
          flexDirection: 'column',
          gap: 38,
        }}
      >
        <div
          style={{
            padding: 36,
            borderRadius: 28,
            background: 'rgba(15, 23, 42, 0.94)',
            border: '3px solid #38bdf8',
            boxShadow: '0 0 60px #ef444477',
            transform: 'perspective(850px) rotateX(8deg)',
          }}
        >
          <div
            style={{
              padding: '20px 26px',
              background: '#ffffff',
              color: '#0f172a',
              borderRadius: 14,
              fontSize: 32,
              fontWeight: 900,
              boxShadow: '0 0 30px #38bdf8',
            }}
          >
            🔒 https://malicious-link.net/exploit.js
          </div>
          <div
            style={{
              marginTop: 26,
              padding: 22,
              borderRadius: 16,
              background: 'rgba(239, 68, 68, 0.25)',
              border: '3px solid #ef4444',
              color: '#fca5a5',
              fontSize: 36,
              fontWeight: 900,
              textAlign: 'center',
            }}
          >
            🔓 PHISHING WARNING // LOCK SHATTERED
          </div>
        </div>

        <div
          style={{
            height: 520,
            borderRadius: 32,
            background: 'radial-gradient(circle, rgba(239,68,68,0.35) 0%, rgba(10,14,28,0.95) 80%)',
            border: '3px solid #ef4444',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            transform: `scale(${skullScale})`,
            boxShadow: '0 0 85px #ef444499',
          }}
        >
          <div style={{fontSize: 155, textShadow: '0 0 50px #ef4444'}}>💀</div>
          <div style={{fontSize: 34, fontWeight: 900, color: '#fde047', marginTop: 18}}>
            ⚡ HIDDEN EXPLOIT TRIGGERED
          </div>
        </div>
      </div>
    </CyberStage>
  );
};
const Scene4Unauthorized: React.FC = () => {
  const frame = useCurrentFrame();
  const hoverY = Math.sin(frame * 0.12) * 18;

  const cards = [
    {icon: '🖼️', title: 'PHOTOS', x: 85, y: 400},
    {icon: '👥', title: 'CONTACTS', x: 730, y: 400},
    {icon: '📁', title: 'FILES', x: 85, y: 740},
    {icon: '📍', title: 'LOCATION', x: 730, y: 740},
    {icon: '🎙️', title: 'MIC', x: 220, y: 240},
    {icon: '🔑', title: 'PRIVATE DATA', x: 580, y: 240},
  ];

  return (
    <CyberStage
      primary="#dc2626"
      secondary="#0284c7"
      tag="SCENE 04 // SYSTEM COMPROMISED"
      headline="UNAUTHORIZED ACCESS"
      subline="Personal Information, Photos & Contacts at Risk"
    >
      {cards.map((c, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            left: c.x,
            top: c.y + hoverY * (i % 2 === 0 ? 1 : -1),
            padding: '18px 24px',
            borderRadius: 22,
            background: 'rgba(15, 23, 42, 0.92)',
            border: '3px solid #ef4444',
            boxShadow: '0 0 35px #ef4444aa',
            textAlign: 'center',
          }}
        >
          <div style={{fontSize: 52}}>{c.icon}</div>
          <div style={{fontSize: 22, fontWeight: 900, color: '#fca5a5', marginTop: 6}}>
            ⚠️ {c.title}
          </div>
        </div>
      ))}

      {/* Central Red Surveillance Eye & 3D Isometric Phone */}
      <div
        style={{
          position: 'absolute',
          top: '35%',
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <div
          style={{
            width: 240,
            height: 240,
            borderRadius: '50%',
            background: 'radial-gradient(circle, #ef4444 0%, #7f1d1d 72%, transparent 100%)',
            border: '5px solid #f87171',
            boxShadow: '0 0 95px #ef4444',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 115,
          }}
        >
          👁️
        </div>
        <div
          style={{
            marginTop: 55,
            width: 580,
            height: 330,
            borderRadius: 42,
            background: 'linear-gradient(135deg, #0284c755, #ef444477)',
            border: '7px solid #38bdf8',
            transform: 'perspective(700px) rotateX(56deg)',
            boxShadow: '0 35px 95px #ef4444bb, 0 0 55px #38bdf899 inset',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 95,
          }}
        >
          🔓
        </div>
      </div>
    </CyberStage>
  );
};

const Scene5RealityCheck: React.FC = () => {
  const frame = useCurrentFrame();
  const blueShift = frame > 70;
  const orbitRot = interpolate(frame, [0, 270], [-24, 24]);
  const pct = interpolate(frame, [15, 220], [18, 100], {extrapolateRight: 'clamp'});

  return (
    <CyberStage
      primary={blueShift ? '#06b6d4' : '#ec4899'}
      secondary="#3b82f6"
      tag="SCENE 05 // REALITY CHECK"
      headline="NOT EVERY LINK IS DANGEROUS"
      subline="Depends on Phone Model, Software Version & Flaws"
    >
      <div
        style={{
          position: 'absolute',
          top: '21%',
          left: '8%',
          right: '8%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 44,
          transform: `perspective(1000px) rotateY(${orbitRot}deg)`,
        }}
      >
        <div
          style={{
            width: 320,
            height: 360,
            borderRadius: '26px 26px 160px 160px',
            background: 'linear-gradient(180deg, rgba(6,182,212,0.4), rgba(236,72,153,0.35))',
            border: '6px solid #22d3ee',
            boxShadow: '0 0 90px #06b6d4, 0 0 45px #ec4899 inset',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 135,
          }}
        >
          🛡️
        </div>

        <div
          style={{
            width: '100%',
            padding: 36,
            borderRadius: 28,
            background: 'rgba(10, 22, 48, 0.94)',
            border: '3px solid #38bdf8',
            boxShadow: '0 0 55px #06b6d477',
          }}
        >
          <div style={{fontSize: 32, fontWeight: 900, color: '#38bdf8', marginBottom: 14}}>
            📱 SOFTWARE SECURITY UPDATE
          </div>
          <div style={{fontSize: 27, color: '#cbd5e1', marginBottom: 18}}>
            Patching Vulnerability... {Math.floor(pct)}%
          </div>
          <div style={{width: '100%', height: 26, background: '#1e293b', borderRadius: 13, overflow: 'hidden'}}>
            <div
              style={{
                width: `${pct}%`,
                height: '100%',
                background: 'linear-gradient(90deg, #06b6d4, #3b82f6)',
                boxShadow: '0 0 25px #06b6d4',
              }}
            />
          </div>
        </div>
      </div>
    </CyberStage>
  );
};
const Scene6FinalProtection: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const shieldPop = spring({frame, fps, config: {damping: 12}});
  const pulse = interpolate(Math.sin(frame * 0.16), [-1, 1], [0.92, 1.12]);

  return (
    <CyberStage
      primary="#10b981"
      secondary="#06b6d4"
      tag="SCENE 06 // DIGITAL SECURITY SHIELD"
      headline="AVOID UNKNOWN LINKS"
      subline="Keep Your Phone Updated • Stay Protected!"
    >
      <div
        style={{
          position: 'absolute',
          top: '19%',
          left: '8%',
          right: '8%',
          height: 960,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {/* 3D Isometric Smartphone with Glowing Cyan Shield */}
        <div
          style={{
            width: 700,
            height: 460,
            borderRadius: 50,
            background: 'linear-gradient(135deg, #042f2e 0%, #0f172a 100%)',
            border: '8px solid #22d3ee',
            transform: `perspective(850px) rotateX(48deg) rotateZ(-10deg) scale(${shieldPop})`,
            boxShadow: '0 45px 120px #06b6d4aa, 0 0 65px #10b98177 inset',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <div
            style={{
              transform: `scale(${pulse})`,
              fontSize: 180,
              filter: 'drop-shadow(0 0 50px #22d3ee)',
            }}
          >
            🛡️
          </div>
        </div>
      </div>
    </CyberStage>
  );
};

export const HelloWorld: React.FC = () => {
  return (
    <AbsoluteFill style={{backgroundColor: '#02040a'}}>
      <Audio src={staticFile('voice.wav')} />

      {/* 0:00 - 0:08 */}
      <Sequence from={0} durationInFrames={240}>
        <Scene1Hook />
      </Sequence>

      {/* 0:08 - 0:19 */}
      <Sequence from={240} durationInFrames={330}>
        <Scene2Vulnerability />
      </Sequence>

      {/* 0:19 - 0:30 */}
      <Sequence from={570} durationInFrames={330}>
        <Scene3MaliciousLink />
      </Sequence>

      {/* 0:30 - 0:40 */}
      <Sequence from={900} durationInFrames={300}>
        <Scene4Unauthorized />
      </Sequence>

      {/* 0:40 - 0:49 */}
      <Sequence from={1200} durationInFrames={270}>
        <Scene5RealityCheck />
      </Sequence>

      {/* 0:49 - 0:59 */}
      <Sequence from={1470} durationInFrames={300}>
        <Scene6FinalProtection />
      </Sequence>
    </AbsoluteFill>
  );
};

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="HelloWorld"
        component={HelloWorld}
        durationInFrames={1770}
        fps={30}
        width={1080}
        height={1920}
      />
    </>
  );
};




