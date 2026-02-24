import { useState, useRef, useEffect } from "react";
import { TRACKS } from "./data/tracks";

function formatTime(seconds) {
  if (isNaN(seconds)) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

function BreathDot() {
  return (
    <div style={{ display: "flex", justifyContent: "center", margin: "2rem 0 1rem" }}>
      <div
        style={{
          width: 8,
          height: 8,
          borderRadius: "50%",
          backgroundColor: "var(--accent)",
          animation: "breathe 6s ease-in-out infinite",
        }}
      />
    </div>
  );
}

function FilterPill({ label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: "0.5rem 1.2rem",
        borderRadius: 999,
        border: active ? "1.5px solid var(--accent)" : "1.5px solid var(--border)",
        backgroundColor: active ? "var(--accent-bg)" : "transparent",
        color: active ? "var(--accent)" : "var(--text-secondary)",
        fontFamily: "'DM Sans', sans-serif",
        fontSize: "0.85rem",
        fontWeight: active ? 500 : 400,
        cursor: "pointer",
        transition: "all 0.3s ease",
        letterSpacing: "0.02em",
      }}
    >
      {label}
    </button>
  );
}

function TrackCard({ track, isActive, onPlay }) {
  return (
    <button
      onClick={() => onPlay(track)}
      style={{
        display: "block",
        width: "100%",
        textAlign: "left",
        padding: "1.25rem 1.5rem",
        borderRadius: 16,
        border: isActive ? "1.5px solid var(--accent)" : "1.5px solid var(--border)",
        backgroundColor: isActive ? "var(--accent-bg)" : "var(--card-bg)",
        cursor: "pointer",
        transition: "all 0.35s ease",
        fontFamily: "'DM Sans', sans-serif",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div style={{ flex: 1 }}>
          <div
            style={{
              fontSize: "1rem",
              fontWeight: 500,
              color: isActive ? "var(--accent)" : "var(--text-primary)",
              marginBottom: 6,
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: "1.15rem",
              letterSpacing: "0.01em",
            }}
          >
            {track.title}
          </div>
          <div
            style={{
              fontSize: "0.8rem",
              color: "var(--text-tertiary)",
              lineHeight: 1.5,
            }}
          >
            {track.description}
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", marginLeft: 16, flexShrink: 0 }}>
          <span
            style={{
              fontSize: "0.75rem",
              color: "var(--text-tertiary)",
              fontVariantNumeric: "tabular-nums",
              marginBottom: 6,
            }}
          >
            {track.duration}
          </span>
          <div style={{ display: "flex", gap: 6 }}>
            <span
              style={{
                fontSize: "0.65rem",
                padding: "2px 8px",
                borderRadius: 999,
                backgroundColor: track.language === "en-ko" ? "var(--tag-bilingual)" : "var(--tag-en)",
                color: "var(--text-primary)",
                fontWeight: 500,
                letterSpacing: "0.03em",
                textTransform: "uppercase",
              }}
            >
              {track.language === "en-ko" ? "EN/KO" : "EN"}
            </span>
            {track.hasMetta && (
              <span
                style={{
                  fontSize: "0.65rem",
                  padding: "2px 8px",
                  borderRadius: 999,
                  backgroundColor: "var(--tag-metta)",
                  color: "var(--accent)",
                  fontWeight: 500,
                  letterSpacing: "0.03em",
                }}
              >
                METTĀ
              </span>
            )}
          </div>
        </div>
      </div>
      {isActive && (
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            bottom: 0,
            width: 3,
            backgroundColor: "var(--accent)",
            borderRadius: "3px 0 0 3px",
          }}
        />
      )}
    </button>
  );
}

function AudioPlayer({ track, audioRef, isPlaying, setIsPlaying }) {
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const progressRef = useRef(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onTime = () => setCurrentTime(audio.currentTime);
    const onDuration = () => setDuration(audio.duration);
    const onEnded = () => setIsPlaying(false);

    audio.addEventListener("timeupdate", onTime);
    audio.addEventListener("loadedmetadata", onDuration);
    audio.addEventListener("ended", onEnded);

    return () => {
      audio.removeEventListener("timeupdate", onTime);
      audio.removeEventListener("loadedmetadata", onDuration);
      audio.removeEventListener("ended", onEnded);
    };
  }, [track]);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(() => {});
    }
    setIsPlaying(!isPlaying);
  };

  const seek = (e) => {
    if (!progressRef.current || !audioRef.current) return;
    const rect = progressRef.current.getBoundingClientRect();
    const pct = (e.clientX - rect.left) / rect.width;
    audioRef.current.currentTime = pct * duration;
  };

  if (!track) return null;

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: "var(--player-bg)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        borderTop: "1px solid var(--border)",
        padding: "0.75rem 1.5rem 1rem",
        zIndex: 100,
      }}
    >
      <div style={{ maxWidth: 640, margin: "0 auto" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <button
            onClick={togglePlay}
            style={{
              width: 44,
              height: 44,
              borderRadius: "50%",
              border: "1.5px solid var(--accent)",
              backgroundColor: "transparent",
              color: "var(--accent)",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "1.1rem",
              flexShrink: 0,
              transition: "all 0.2s ease",
            }}
          >
            {isPlaying ? "❚❚" : "▶"}
          </button>
          <div style={{ flex: 1 }}>
            <div
              style={{
                fontSize: "0.85rem",
                color: "var(--text-primary)",
                fontFamily: "'Cormorant Garamond', serif",
                fontWeight: 600,
                marginBottom: 8,
                letterSpacing: "0.01em",
              }}
            >
              {track.title}
            </div>
            <div
              ref={progressRef}
              onClick={seek}
              style={{
                width: "100%",
                height: 4,
                backgroundColor: "var(--border)",
                borderRadius: 4,
                cursor: "pointer",
                position: "relative",
              }}
            >
              <div
                style={{
                  width: `${progress}%`,
                  height: "100%",
                  backgroundColor: "var(--accent)",
                  borderRadius: 4,
                  transition: "width 0.1s linear",
                }}
              />
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontSize: "0.7rem",
                color: "var(--text-tertiary)",
                marginTop: 4,
                fontVariantNumeric: "tabular-nums",
              }}
            >
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ThemeToggle({ isDark, onToggle }) {
  return (
    <button
      onClick={onToggle}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      style={{
        position: "fixed",
        top: 20,
        right: 20,
        width: 42,
        height: 42,
        borderRadius: "50%",
        border: "1.5px solid var(--border)",
        backgroundColor: "var(--card-bg)",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "1.1rem",
        zIndex: 200,
        transition: "all 0.4s ease",
        boxShadow: isDark ? "0 2px 12px rgba(0,0,0,0.3)" : "0 2px 12px rgba(0,0,0,0.06)",
      }}
    >
      <span
        style={{
          display: "inline-block",
          transition: "transform 0.4s ease",
          transform: isDark ? "rotate(180deg)" : "rotate(0deg)",
        }}
      >
        {isDark ? "☀" : "☽"}
      </span>
    </button>
  );
}

export default function VipassanaApp() {
  const [isDark, setIsDark] = useState(false);
  const [langFilter, setLangFilter] = useState("all");
  const [instructionFilter, setInstructionFilter] = useState("all");
  const [mettaFilter, setMettaFilter] = useState("all");
  const [activeTrack, setActiveTrack] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

  const filtered = TRACKS.filter((t) => {
    if (langFilter !== "all" && t.language !== langFilter) return false;
    if (instructionFilter !== "all" && t.instruction !== instructionFilter) return false;
    if (mettaFilter === "yes" && !t.hasMetta) return false;
    if (mettaFilter === "no" && t.hasMetta) return false;
    return true;
  });

  const playTrack = (track) => {
    // Check if audioUrl is a Zoom link
    const isZoom = typeof track.audioUrl === "string" && track.audioUrl.startsWith("https://us04web.zoom.us/");
    if (isZoom) {
      window.open(track.audioUrl, "_blank");
      return;
    }
    setActiveTrack(track);
    setIsPlaying(true);
    if (audioRef.current) {
      audioRef.current.src = track.audioUrl;
      audioRef.current.play().catch(() => {});
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&family=DM+Sans:wght@300;400;500&display=swap');

        :root {
          --bg: ${isDark ? "#1a1916" : "#f7f5f0"};
          --card-bg: ${isDark ? "#252320" : "#ffffff"};
          --player-bg: ${isDark ? "rgba(26, 25, 22, 0.94)" : "rgba(247, 245, 240, 0.92)"};
          --text-primary: ${isDark ? "#e8e4dc" : "#2c2a25"};
          --text-secondary: ${isDark ? "#a09b93" : "#6b6760"};
          --text-tertiary: ${isDark ? "#6b6760" : "#9e9a93"};
          --accent: ${isDark ? "#c4b598" : "#7a6e5d"};
          --accent-bg: ${isDark ? "rgba(196, 181, 152, 0.1)" : "rgba(122, 110, 93, 0.08)"};
          --border: ${isDark ? "rgba(196, 181, 152, 0.12)" : "rgba(122, 110, 93, 0.15)"};
          --tag-en: ${isDark ? "rgba(196, 181, 152, 0.12)" : "rgba(122, 110, 93, 0.1)"};
          --tag-bilingual: ${isDark ? "rgba(196, 181, 152, 0.15)" : "rgba(139, 125, 97, 0.15)"};
          --tag-metta: ${isDark ? "rgba(196, 181, 152, 0.08)" : "rgba(122, 110, 93, 0.08)"};
        }

        * { margin: 0; padding: 0; box-sizing: border-box; }

        body {
          background-color: var(--bg);
          color: var(--text-primary);
          font-family: 'DM Sans', sans-serif;
          -webkit-font-smoothing: antialiased;
          transition: background-color 0.5s ease, color 0.5s ease;
        }

        @keyframes breathe {
          0%, 100% { transform: scale(1); opacity: 0.4; }
          50% { transform: scale(2.5); opacity: 0.8; }
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .track-enter {
          animation: fadeIn 0.4s ease forwards;
        }

        button:hover {
          opacity: 0.85;
        }
      `}</style>

      <audio ref={audioRef} preload="metadata" />

      <ThemeToggle isDark={isDark} onToggle={() => setIsDark(!isDark)} />

      <div
        style={{
          maxWidth: 960,
          width: "100%",
          margin: "0 auto",
          padding: "3rem 2.5rem 9rem",
        }}
      >
        {/* Header */}
        <header style={{ textAlign: "center", marginBottom: "2.5rem" }}>
          <h1
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: "2.2rem",
              fontWeight: 300,
              color: "var(--text-primary)",
              letterSpacing: "0.04em",
              marginBottom: 4,
            }}
          >
            Vipassanā
          </h1>
          <p
            style={{
              fontSize: "0.82rem",
              color: "var(--text-tertiary)",
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              fontWeight: 400,
            }}
          >
            Group Meditation
          </p>
          <BreathDot />
        </header>

        {/* Filters */}
        <div style={{ marginBottom: "2rem" }}>
          {/* Language */}
          <div style={{ marginBottom: 14 }}>
            <div
              style={{
                fontSize: "0.7rem",
                color: "var(--text-tertiary)",
                textTransform: "uppercase",
                letterSpacing: "0.12em",
                marginBottom: 8,
                fontWeight: 500,
              }}
            >
              Language
            </div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              <FilterPill label="All" active={langFilter === "all"} onClick={() => setLangFilter("all")} />
              <FilterPill label="English" active={langFilter === "en"} onClick={() => setLangFilter("en")} />
              <FilterPill label="English + 한국어" active={langFilter === "en-ko"} onClick={() => setLangFilter("en-ko")} />
            </div>
          </div>

          {/* Instruction Level */}
          <div style={{ marginBottom: 14 }}>
            <div
              style={{
                fontSize: "0.7rem",
                color: "var(--text-tertiary)",
                textTransform: "uppercase",
                letterSpacing: "0.12em",
                marginBottom: 8,
                fontWeight: 500,
              }}
            >
              Guidance
            </div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              <FilterPill label="All" active={instructionFilter === "all"} onClick={() => setInstructionFilter("all")} />
              <FilterPill label="Full" active={instructionFilter === "full"} onClick={() => setInstructionFilter("full")} />
              <FilterPill label="Light" active={instructionFilter === "light"} onClick={() => setInstructionFilter("light")} />
            </div>
          </div>

          {/* Mettā */}
          <div>
            <div
              style={{
                fontSize: "0.7rem",
                color: "var(--text-tertiary)",
                textTransform: "uppercase",
                letterSpacing: "0.12em",
                marginBottom: 8,
                fontWeight: 500,
              }}
            >
              Mettā (Loving-kindness)
            </div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              <FilterPill label="All" active={mettaFilter === "all"} onClick={() => setMettaFilter("all")} />
              <FilterPill label="With Mettā" active={mettaFilter === "yes"} onClick={() => setMettaFilter("yes")} />
              <FilterPill label="Without" active={mettaFilter === "no"} onClick={() => setMettaFilter("no")} />
            </div>
          </div>
        </div>

        {/* Track List */}
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {filtered.map((track, i) => (
            <div key={track.id} className="track-enter" style={{ animationDelay: `${i * 0.06}s` }}>
              <TrackCard track={track} isActive={activeTrack?.id === track.id} onPlay={playTrack} />
            </div>
          ))}
          {filtered.length === 0 && (
            <div
              style={{
                textAlign: "center",
                padding: "3rem 1rem",
                color: "var(--text-tertiary)",
                fontSize: "0.9rem",
                fontStyle: "italic",
              }}
            >
              No tracks match these filters
            </div>
          )}
        </div>

        {/* Track count */}
        <div
          style={{
            textAlign: "center",
            marginTop: "1.5rem",
            fontSize: "0.75rem",
            color: "var(--text-tertiary)",
            letterSpacing: "0.05em",
          }}
        >
          {filtered.length} track{filtered.length !== 1 ? "s" : ""}
        </div>
      </div>

      {/* Player */}
      <AudioPlayer track={activeTrack} audioRef={audioRef} isPlaying={isPlaying} setIsPlaying={setIsPlaying} />
    </>
  );
}

