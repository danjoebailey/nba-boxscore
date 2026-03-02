"use client";

import { useState, useEffect } from "react";

const GAMES = [
  {
    id: "cc617819",
    home: { abbr: "BOS", name: "Boston Celtics", score: 148, color: "#007A33", q: [35, 31, 43, 39] },
    away: { abbr: "BKN", name: "Brooklyn Nets",  score: 111, color: "#AAAAAA", q: [32, 25, 26, 28] },
    homePlayers: [
      { name: "J. Brown",      pos: "F",   pts: 28, reb: 7,  ast: 9, fgm: 9,  fga: 12, tpm: 4, tpa: 4,  stl: 2, blk: 1, to: 2, pm: 25,  min: 34 },
      { name: "P. Pritchard",  pos: "G",   pts: 22, reb: 0,  ast: 5, fgm: 9,  fga: 12, tpm: 4, tpa: 5,  stl: 1, blk: 0, to: 1, pm: 40,  min: 30 },
      { name: "S. Hauser",     pos: "F",   pts: 13, reb: 3,  ast: 2, fgm: 5,  fga: 9,  tpm: 2, tpa: 6,  stl: 0, blk: 0, to: 1, pm: 27,  min: 28 },
      { name: "D. White",      pos: "G",   pts: 12, reb: 3,  ast: 7, fgm: 4,  fga: 9,  tpm: 4, tpa: 8,  stl: 1, blk: 2, to: 1, pm: 31,  min: 32 },
      { name: "B. Scheierman", pos: "G",   pts: 10, reb: 3,  ast: 6, fgm: 3,  fga: 3,  tpm: 2, tpa: 2,  stl: 1, blk: 0, to: 0, pm: 18,  min: 22 },
      { name: "N. Queta",      pos: "C",   pts: 8,  reb: 2,  ast: 1, fgm: 4,  fga: 4,  tpm: 0, tpa: 0,  stl: 2, blk: 1, to: 1, pm: 1,   min: 14 },
      { name: "H. Gonzalez",   pos: "G",   pts: 8,  reb: 2,  ast: 1, fgm: 4,  fga: 6,  tpm: 0, tpa: 2,  stl: 1, blk: 2, to: 0, pm: 16,  min: 18 },
      { name: "J. Walsh",      pos: "G",   pts: 6,  reb: 3,  ast: 0, fgm: 2,  fga: 2,  tpm: 2, tpa: 2,  stl: 0, blk: 0, to: 3, pm: -2,  min: 12 },
      { name: "L. Garza",      pos: "C",   pts: 4,  reb: 3,  ast: 1, fgm: 1,  fga: 2,  tpm: 0, tpa: 0,  stl: 1, blk: 0, to: 0, pm: 1,   min: 10 },
      { name: "D. Banton",     pos: "F",   pts: 4,  reb: 0,  ast: 1, fgm: 1,  fga: 4,  tpm: 0, tpa: 0,  stl: 0, blk: 0, to: 1, pm: -4,  min: 10 },
      { name: "R. Harper Jr.", pos: "G-F", pts: 3,  reb: 0,  ast: 0, fgm: 1,  fga: 1,  tpm: 1, tpa: 1,  stl: 0, blk: 0, to: 0, pm: -4,  min: 6  },
      { name: "J. Tonje",      pos: "G",   pts: 2,  reb: 2,  ast: 1, fgm: 0,  fga: 1,  tpm: 0, tpa: 1,  stl: 0, blk: 0, to: 0, pm: 1,   min: 8  },
    ],
    awayPlayers: [
      { name: "D. Wolf",     pos: "F",   pts: 16, reb: 2,  ast: 1, fgm: 5,  fga: 12, tpm: 2, tpa: 6,  stl: 1, blk: 0, to: 1, pm: -15, min: 32 },
      { name: "N. Claxton",  pos: "C",   pts: 12, reb: 4,  ast: 2, fgm: 5,  fga: 9,  tpm: 0, tpa: 0,  stl: 0, blk: 0, to: 1, pm: -20, min: 28 },
      { name: "J. Minott",   pos: "F",   pts: 9,  reb: 2,  ast: 0, fgm: 4,  fga: 7,  tpm: 1, tpa: 3,  stl: 0, blk: 0, to: 1, pm: -16, min: 24 },
      { name: "N. Clowney",  pos: "F",   pts: 10, reb: 3,  ast: 2, fgm: 4,  fga: 9,  tpm: 2, tpa: 4,  stl: 0, blk: 0, to: 0, pm: -17, min: 26 },
      { name: "O. Agbaji",   pos: "G",   pts: 8,  reb: 1,  ast: 1, fgm: 3,  fga: 3,  tpm: 2, tpa: 2,  stl: 0, blk: 0, to: 0, pm: -1,  min: 16 },
      { name: "T. Mann",     pos: "G-F", pts: 8,  reb: 1,  ast: 3, fgm: 3,  fga: 5,  tpm: 2, tpa: 4,  stl: 0, blk: 0, to: 1, pm: -23, min: 30 },
      { name: "B. Saraf",    pos: "G",   pts: 7,  reb: 0,  ast: 1, fgm: 3,  fga: 3,  tpm: 1, tpa: 1,  stl: 0, blk: 0, to: 1, pm: -3,  min: 18 },
      { name: "Z. Williams", pos: "F",   pts: 5,  reb: 0,  ast: 0, fgm: 2,  fga: 5,  tpm: 1, tpa: 3,  stl: 1, blk: 0, to: 0, pm: -21, min: 20 },
      { name: "G. Nelson",   pos: "F",   pts: 3,  reb: 2,  ast: 4, fgm: 1,  fga: 1,  tpm: 0, tpa: 0,  stl: 0, blk: 2, to: 2, pm: -3,  min: 14 },
      { name: "D. Sharpe",   pos: "C",   pts: 2,  reb: 5,  ast: 3, fgm: 1,  fga: 7,  tpm: 0, tpa: 1,  stl: 0, blk: 0, to: 1, pm: -14, min: 22 },
      { name: "J. Wilson",   pos: "F",   pts: 0,  reb: 1,  ast: 1, fgm: 0,  fga: 2,  tpm: 0, tpa: 1,  stl: 0, blk: 0, to: 0, pm: -1,  min: 8  },
    ],
  },
  {
    id: "e96ef958",
    home: { abbr: "MIL", name: "Milwaukee Bucks", score: 98,  color: "#00471B", q: [30, 27, 26, 15] },
    away: { abbr: "NYK", name: "New York Knicks",  score: 127, color: "#F58426", q: [38, 39, 26, 24] },
    homePlayers: [
      { name: "M. Turner",        pos: "C",   pts: 19, reb: 4,  ast: 2,  fgm: 5,  fga: 8,  tpm: 4, tpa: 7,  stl: 0, blk: 1, to: 2, pm: -20, min: 30 },
      { name: "K. Kuzma",         pos: "F",   pts: 17, reb: 4,  ast: 2,  fgm: 6,  fga: 11, tpm: 4, tpa: 7,  stl: 0, blk: 0, to: 0, pm: -16, min: 28 },
      { name: "R. Rollins",       pos: "G",   pts: 13, reb: 4,  ast: 4,  fgm: 5,  fga: 9,  tpm: 2, tpa: 5,  stl: 0, blk: 0, to: 5, pm: -30, min: 32 },
      { name: "K. Porter Jr.",    pos: "G",   pts: 11, reb: 6,  ast: 10, fgm: 4,  fga: 12, tpm: 1, tpa: 2,  stl: 1, blk: 1, to: 3, pm: -16, min: 34 },
      { name: "C. Thomas",        pos: "G",   pts: 7,  reb: 2,  ast: 1,  fgm: 2,  fga: 9,  tpm: 0, tpa: 2,  stl: 0, blk: 1, to: 0, pm: -17, min: 24 },
      { name: "A. Green",         pos: "F",   pts: 7,  reb: 2,  ast: 0,  fgm: 2,  fga: 6,  tpm: 2, tpa: 6,  stl: 0, blk: 0, to: 1, pm: -17, min: 20 },
      { name: "G. Trent Jr.",     pos: "G",   pts: 5,  reb: 1,  ast: 0,  fgm: 2,  fga: 3,  tpm: 1, tpa: 2,  stl: 0, blk: 0, to: 1, pm: 3,   min: 10 },
      { name: "J. Sims",          pos: "C",   pts: 2,  reb: 4,  ast: 1,  fgm: 1,  fga: 1,  tpm: 0, tpa: 0,  stl: 0, blk: 0, to: 0, pm: -21, min: 14 },
      { name: "G. Harris",        pos: "G",   pts: 2,  reb: 0,  ast: 1,  fgm: 1,  fga: 2,  tpm: 0, tpa: 1,  stl: 1, blk: 0, to: 0, pm: 3,   min: 8  },
      { name: "O. Dieng",         pos: "F",   pts: 0,  reb: 3,  ast: 2,  fgm: 0,  fga: 2,  tpm: 0, tpa: 2,  stl: 1, blk: 0, to: 1, pm: -11, min: 12 },
      { name: "T. Antetokounmpo", pos: "F",   pts: 1,  reb: 0,  ast: 0,  fgm: 0,  fga: 1,  tpm: 0, tpa: 1,  stl: 1, blk: 0, to: 0, pm: 1,   min: 4  },
      { name: "P. Nance",         pos: "F",   pts: 0,  reb: 0,  ast: 1,  fgm: 0,  fga: 2,  tpm: 0, tpa: 2,  stl: 0, blk: 0, to: 0, pm: 3,   min: 4  },
    ],
    awayPlayers: [
      { name: "J. Brunson",     pos: "G",   pts: 27, reb: 7,  ast: 3, fgm: 11, fga: 17, tpm: 4, tpa: 6,  stl: 0, blk: 0, to: 1, pm: 15,  min: 34 },
      { name: "OG Anunoby",     pos: "F",   pts: 24, reb: 3,  ast: 3, fgm: 8,  fga: 10, tpm: 5, tpa: 7,  stl: 2, blk: 0, to: 1, pm: 20,  min: 30 },
      { name: "K. Towns",       pos: "C",   pts: 17, reb: 13, ast: 1, fgm: 6,  fga: 13, tpm: 1, tpa: 1,  stl: 0, blk: 0, to: 1, pm: 21,  min: 32 },
      { name: "L. Shamet",      pos: "G",   pts: 15, reb: 0,  ast: 3, fgm: 5,  fga: 8,  tpm: 5, tpa: 7,  stl: 1, blk: 1, to: 0, pm: 20,  min: 24 },
      { name: "M. Bridges",     pos: "G",   pts: 10, reb: 0,  ast: 6, fgm: 5,  fga: 8,  tpm: 0, tpa: 0,  stl: 2, blk: 2, to: 0, pm: 14,  min: 28 },
      { name: "M. Diawara",     pos: "F",   pts: 10, reb: 3,  ast: 2, fgm: 2,  fga: 6,  tpm: 2, tpa: 3,  stl: 0, blk: 0, to: 1, pm: 25,  min: 20 },
      { name: "M. Robinson",    pos: "C-F", pts: 0,  reb: 3,  ast: 3, fgm: 0,  fga: 0,  tpm: 0, tpa: 0,  stl: 1, blk: 2, to: 0, pm: 10,  min: 14 },
      { name: "J. Sochan",      pos: "F",   pts: 2,  reb: 2,  ast: 0, fgm: 1,  fga: 3,  tpm: 0, tpa: 2,  stl: 0, blk: 0, to: 0, pm: -3,  min: 8  },
      { name: "T. Kolek",       pos: "G",   pts: 3,  reb: 0,  ast: 0, fgm: 1,  fga: 3,  tpm: 1, tpa: 3,  stl: 0, blk: 0, to: 2, pm: -3,  min: 6  },
      { name: "J. Clarkson",    pos: "G",   pts: 0,  reb: 0,  ast: 0, fgm: 0,  fga: 3,  tpm: 0, tpa: 3,  stl: 0, blk: 0, to: 0, pm: -3,  min: 6  },
      { name: "A. Hukporti",    pos: "C",   pts: 0,  reb: 3,  ast: 1, fgm: 0,  fga: 1,  tpm: 0, tpa: 0,  stl: 0, blk: 0, to: 1, pm: -3,  min: 6  },
      { name: "T. Jemison III", pos: "C",   pts: 0,  reb: 1,  ast: 1, fgm: 0,  fga: 0,  tpm: 0, tpa: 0,  stl: 0, blk: 0, to: 1, pm: 0,   min: 4  },
    ],
  },
  {
    id: "56066788",
    home: { abbr: "DET", name: "Detroit Pistons",     score: 122, color: "#C8102E", q: [8, 23, 35, 29, 27] },
    away: { abbr: "CLE", name: "Cleveland Cavaliers", score: 119, color: "#860038", q: [5, 19, 30, 30, 35] },
    homePlayers: [
      { name: "J. Duren",      pos: "C",   pts: 33, reb: 16, ast: 3, fgm: 11, fga: 19, tpm: 0, tpa: 0,  stl: 1, blk: 3, to: 0, pm: 14,  min: 42 },
      { name: "C. Cunningham", pos: "G",   pts: 25, reb: 10, ast: 7, fgm: 11, fga: 21, tpm: 0, tpa: 3,  stl: 2, blk: 0, to: 4, pm: 2,   min: 44 },
      { name: "A. Thompson",   pos: "F",   pts: 18, reb: 8,  ast: 5, fgm: 7,  fga: 10, tpm: 0, tpa: 0,  stl: 2, blk: 1, to: 1, pm: 7,   min: 38 },
      { name: "R. Holland II", pos: "F",   pts: 12, reb: 3,  ast: 0, fgm: 4,  fga: 6,  tpm: 2, tpa: 3,  stl: 0, blk: 0, to: 1, pm: -6,  min: 22 },
      { name: "D. Robinson",   pos: "G",   pts: 8,  reb: 2,  ast: 2, fgm: 3,  fga: 9,  tpm: 2, tpa: 8,  stl: 0, blk: 2, to: 2, pm: 7,   min: 30 },
      { name: "D. Jenkins",    pos: "G",   pts: 8,  reb: 1,  ast: 1, fgm: 2,  fga: 10, tpm: 1, tpa: 3,  stl: 0, blk: 0, to: 1, pm: 0,   min: 20 },
      { name: "P. Reed",       pos: "F",   pts: 4,  reb: 6,  ast: 1, fgm: 2,  fga: 4,  tpm: 0, tpa: 1,  stl: 1, blk: 0, to: 0, pm: -11, min: 16 },
      { name: "J. Green",      pos: "G",   pts: 2,  reb: 2,  ast: 0, fgm: 1,  fga: 4,  tpm: 0, tpa: 3,  stl: 1, blk: 0, to: 0, pm: 6,   min: 12 },
      { name: "M. Sasser",     pos: "G",   pts: 0,  reb: 1,  ast: 1, fgm: 0,  fga: 3,  tpm: 0, tpa: 2,  stl: 0, blk: 0, to: 2, pm: 1,   min: 10 },
      { name: "C. LeVert",     pos: "G",   pts: 1,  reb: 2,  ast: 1, fgm: 0,  fga: 1,  tpm: 0, tpa: 0,  stl: 1, blk: 0, to: 2, pm: -4,  min: 10 },
    ],
    awayPlayers: [
      { name: "J. Allen",    pos: "C",   pts: 25, reb: 9,  ast: 4, fgm: 10, fga: 12, tpm: 0, tpa: 0,  stl: 0, blk: 1, to: 1, pm: -9,  min: 38 },
      { name: "E. Mobley",   pos: "F",   pts: 23, reb: 12, ast: 1, fgm: 9,  fga: 15, tpm: 4, tpa: 8,  stl: 0, blk: 4, to: 1, pm: -5,  min: 40 },
      { name: "S. Merrill",  pos: "G",   pts: 20, reb: 1,  ast: 3, fgm: 6,  fga: 14, tpm: 4, tpa: 10, stl: 2, blk: 0, to: 2, pm: -13, min: 36 },
      { name: "J. Tyson",    pos: "F",   pts: 15, reb: 4,  ast: 1, fgm: 5,  fga: 10, tpm: 4, tpa: 7,  stl: 2, blk: 0, to: 1, pm: -9,  min: 28 },
      { name: "D. Schroder", pos: "G",   pts: 12, reb: 1,  ast: 9, fgm: 4,  fga: 15, tpm: 0, tpa: 2,  stl: 1, blk: 1, to: 8, pm: -15, min: 42 },
      { name: "T. Bryant",   pos: "C-F", pts: 13, reb: 8,  ast: 1, fgm: 5,  fga: 12, tpm: 1, tpa: 3,  stl: 0, blk: 1, to: 1, pm: 10,  min: 24 },
      { name: "T. Proctor",  pos: "G",   pts: 4,  reb: 0,  ast: 1, fgm: 1,  fga: 2,  tpm: 0, tpa: 1,  stl: 1, blk: 0, to: 0, pm: 12,  min: 14 },
      { name: "N. Tomlin",   pos: "F",   pts: 2,  reb: 2,  ast: 0, fgm: 1,  fga: 5,  tpm: 0, tpa: 1,  stl: 1, blk: 1, to: 0, pm: 1,   min: 12 },
    ],
  },
];

const LIVE = [
  { homeAbbr: "OKC", homeName: "Oklahoma City Thunder", homeScore: 57,
    awayAbbr: "DEN", awayName: "Denver Nuggets", awayScore: 62,
    quarter: 3, clock: "9:44" },
];

const UPCOMING = [
  { homeAbbr: "CHA", homeName: "Charlotte Hornets", awayAbbr: "POR", awayName: "Portland Trail Blazers", time: "1:00 PM", homeProb: 74, awayProb: 26 },
  { homeAbbr: "MIA", homeName: "Miami Heat", awayAbbr: "HOU", awayName: "Houston Rockets", time: "3:30 PM", homeProb: 40, awayProb: 60 },
];

function TeamLogo({ abbr, size = 32 }: { abbr: string; size?: number }) {
  const [err, setErr] = useState(false);
  if (err) return <div style={{ width: size, height: size, flexShrink: 0 }} />;
  return (
    <img
      src={`https://a.espncdn.com/i/teamlogos/nba/500/${abbr.toLowerCase()}.png`}
      alt={abbr}
      width={size}
      height={size}
      onError={() => setErr(true)}
      style={{ objectFit: "contain", display: "block", flexShrink: 0 }}
    />
  );
}

const COLS = 12;

async function fetchSeasonStats(playerName: string) {
  const response = await fetch("/api/season-stats", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ playerName }),
  });
  if (!response.ok) throw new Error("Failed to fetch");
  return response.json();
}

function SeasonStatsRow({ playerName, accentColor }: { playerName: string; accentColor: string }) {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetchSeasonStats(playerName)
      .then(s => { setStats(s); setLoading(false); })
      .catch(() => { setError(true); setLoading(false); });
  }, [playerName]);

  const cell = (val: string, color = "#888") => (
    <td style={{ padding: "8px 6px", textAlign: "center", color, fontSize: "11px" }}>{val}</td>
  );

  if (loading) {
    return (
      <tr>
        <td colSpan={COLS} style={{ padding: "10px 12px", background: "#0d0d0d", borderBottom: "1px solid #1a1a1a" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "#555", fontSize: "11px" }}>
            <span style={{ display: "inline-block", width: "8px", height: "8px", borderRadius: "50%", background: "#333", animation: "pulse 1s infinite" }} />
            Loading season averages…
          </div>
        </td>
      </tr>
    );
  }

  if (error || !stats) {
    return (
      <tr>
        <td colSpan={COLS} style={{ padding: "8px 12px", background: "#0d0d0d", color: "#555", fontSize: "11px", borderBottom: "1px solid #1a1a1a" }}>
          Could not load season stats.
        </td>
      </tr>
    );
  }

  return (
    <tr style={{ background: "#0d0d0d", borderBottom: "1px solid #333" }}>
      <td colSpan={2} style={{ padding: "8px 8px 8px 16px", fontSize: "10px", color: "#444", letterSpacing: "0.08em", whiteSpace: "nowrap", position: "sticky", left: 0, background: "#0d0d0d", zIndex: 1 }}>
        25 AVG · {stats.gp}GP
      </td>
      {cell(`${stats.pts}`, accentColor)}
      {cell(`${stats.reb}`)}
      {cell(`${stats.ast}`)}
      {cell(`${stats.fg_pct}%`, "#888")}
      {cell(`${stats.three_pct}%`, "#888")}
      {cell(`${stats.stl}`)}
      {cell(`${stats.blk}`)}
      {cell(`${stats.to}`)}
      {cell(`${stats.mpg}m`, "#444")}
    </tr>
  );
}

function PlayerTable({ players, accentColor }: { players: any[]; accentColor: string }) {
  const [expandedPlayer, setExpandedPlayer] = useState<string | null>(null);
  const toggle = (name: string) => setExpandedPlayer(prev => prev === name ? null : name);
  const pmColor = (pm: number) => pm > 0 ? "#4ade80" : pm < 0 ? "#f87171" : "#555";
  const pmLabel = (pm: number) => pm > 0 ? `+${pm}` : `${pm}`;
  const rowBg = (i: number, isExpanded: boolean) => {
    if (isExpanded) return "#161616";
    return i % 2 === 0 ? "#111" : "#131313";
  };

  return (
    <div style={{ overflowX: "auto" }}>
      <table style={{ borderCollapse: "collapse", fontSize: "12px" }}>
        <thead>
          <tr style={{ color: "#666", borderBottom: "1px solid #222" }}>
            <th style={{ textAlign: "left", padding: "6px 8px", fontWeight: 600, letterSpacing: "0.05em", whiteSpace: "nowrap", position: "sticky", left: 0, background: "#111", zIndex: 2 }}>PLAYER</th>
            <th style={{ padding: "6px 6px", textAlign: "center", fontWeight: 600 }}>POS</th>
            <th style={{ padding: "6px 6px", textAlign: "center", fontWeight: 600 }}>MIN</th>
            <th style={{ padding: "6px 6px", textAlign: "center", fontWeight: 600, color: accentColor }}>PTS</th>
            <th style={{ padding: "6px 6px", textAlign: "center", fontWeight: 600 }}>REB</th>
            <th style={{ padding: "6px 6px", textAlign: "center", fontWeight: 600 }}>AST</th>
            <th style={{ padding: "6px 6px", textAlign: "center", fontWeight: 600 }}>FG</th>
            <th style={{ padding: "6px 6px", textAlign: "center", fontWeight: 600 }}>3PT</th>
            <th style={{ padding: "6px 6px", textAlign: "center", fontWeight: 600 }}>STL</th>
            <th style={{ padding: "6px 6px", textAlign: "center", fontWeight: 600 }}>BLK</th>
            <th style={{ padding: "6px 6px", textAlign: "center", fontWeight: 600 }}>TO</th>
            <th style={{ padding: "6px 6px", textAlign: "center", fontWeight: 600 }}>+/-</th>
          </tr>
        </thead>
        <tbody>
          {players.map((p, i) => {
            const isExpanded = expandedPlayer === p.name;
            const pm = p.pm ?? 0;
            const bg = rowBg(i, isExpanded);
            return (
              <>
                <tr
                  key={p.name}
                  onClick={() => toggle(p.name)}
                  style={{ borderBottom: isExpanded ? "none" : "1px solid #1a1a1a", background: isExpanded ? "#161616" : i % 2 === 0 ? "transparent" : "rgba(255,255,255,0.02)", cursor: "pointer" }}
                >
                  <td style={{ padding: "8px 8px", fontWeight: 600, whiteSpace: "nowrap", color: isExpanded ? "#fff" : "#f0f0f0", position: "sticky", left: 0, zIndex: 1, background: bg }}>
                    <span style={{ marginRight: "5px", fontSize: "9px", color: isExpanded ? accentColor : "#333" }}>{isExpanded ? "▼" : "▶"}</span>
                    {p.name}
                  </td>
                  <td style={{ padding: "8px 6px", textAlign: "center", color: "#555", fontSize: "11px" }}>{p.pos}</td>
                  <td style={{ padding: "8px 6px", textAlign: "center", color: "#555", fontSize: "11px" }}>{p.min}</td>
                  <td style={{ padding: "8px 6px", textAlign: "center", fontWeight: 700, color: accentColor, fontSize: "14px" }}>{p.pts}</td>
                  <td style={{ padding: "8px 6px", textAlign: "center", color: "#ccc" }}>{p.reb}</td>
                  <td style={{ padding: "8px 6px", textAlign: "center", color: "#ccc" }}>{p.ast}</td>
                  <td style={{ padding: "8px 6px", textAlign: "center", color: "#999", fontSize: "11px" }}>{p.fgm}/{p.fga}</td>
                  <td style={{ padding: "8px 6px", textAlign: "center", color: "#999", fontSize: "11px" }}>{p.tpm}/{p.tpa}</td>
                  <td style={{ padding: "8px 6px", textAlign: "center", color: "#777" }}>{p.stl}</td>
                  <td style={{ padding: "8px 6px", textAlign: "center", color: "#777" }}>{p.blk}</td>
                  <td style={{ padding: "8px 6px", textAlign: "center", color: "#777" }}>{p.to}</td>
                  <td style={{ padding: "8px 6px", textAlign: "center", fontWeight: 700, color: pmColor(pm), fontSize: "12px" }}>{pmLabel(pm)}</td>
                </tr>
                {isExpanded && (
                  <SeasonStatsRow key={`${p.name}-season`} playerName={p.name} accentColor={accentColor} />
                )}
              </>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function GameCard({ game }: { game: any }) {
  const [expanded, setExpanded] = useState(false);
  const [activeTeam, setActiveTeam] = useState("home");
  const winner = game.home.score > game.away.score ? "home" : "away";
  const isOT = game.home.q.length > 4;

  return (
    <div style={{ background: "#111", border: "1px solid #222", borderRadius: "12px", overflow: "hidden", marginBottom: "12px" }}>
      <div onClick={() => setExpanded(e => !e)} style={{ cursor: "pointer", padding: "16px 20px", userSelect: "none" }}>
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", marginBottom: "12px", position: "relative" }}>
          <span style={{ fontSize: "11px", color: "#555", letterSpacing: "0.1em", fontWeight: 600 }}>{isOT ? "FINAL/OT" : "FINAL"}</span>
          <span style={{ fontSize: "11px", color: "#444", position: "absolute", right: 0 }}>{expanded ? "▲" : "▼"}</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "flex-end", gap: "8px" }}>
            <div style={{ fontSize: "13px", fontWeight: 800, color: winner === "away" ? "#fff" : "#555", textAlign: "right", lineHeight: 1.2 }}>{game.away.name}</div>
            <TeamLogo abbr={game.away.abbr} size={34} />
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", minWidth: "100px", justifyContent: "center" }}>
            <span style={{ fontSize: "26px", fontWeight: 900, color: winner === "away" ? "#fff" : "#444", letterSpacing: "-0.03em" }}>{game.away.score}</span>
            <span style={{ color: "#333", fontSize: "16px" }}>–</span>
            <span style={{ fontSize: "26px", fontWeight: 900, color: winner === "home" ? "#fff" : "#444", letterSpacing: "-0.03em" }}>{game.home.score}</span>
          </div>
          <div style={{ flex: 1, display: "flex", alignItems: "center", gap: "8px" }}>
            <TeamLogo abbr={game.home.abbr} size={34} />
            <div style={{ fontSize: "13px", fontWeight: 800, color: winner === "home" ? "#fff" : "#555", lineHeight: 1.2 }}>{game.home.name}</div>
          </div>
        </div>
      </div>

      {expanded && (
        <div style={{ borderTop: "1px solid #1d1d1d" }}>
          <div style={{ padding: "12px 16px", borderBottom: "1px solid #1a1a1a" }}>
            <div style={{ display: "flex", gap: "4px" }}>
              {game.away.q.map((q: number, i: number) => {
                const hq = game.home.q[i];
                const label = i < 4 ? `Q${i + 1}` : `OT${i - 3}`;
                return (
                  <div key={i} style={{ flex: 1, background: "#0d0d0d", borderRadius: "6px", padding: "6px 4px", textAlign: "center" }}>
                    <div style={{ fontSize: "9px", color: "#444", marginBottom: "4px" }}>{label}</div>
                    <div style={{ fontSize: "12px", fontWeight: 700, color: q > hq ? "#fff" : "#555" }}>{q}</div>
                    <div style={{ fontSize: "12px", fontWeight: 700, color: hq > q ? "#fff" : "#555" }}>{hq}</div>
                    <div style={{ display: "flex", justifyContent: "space-between", marginTop: "4px", fontSize: "8px", color: "#333" }}>
                      <span>{game.away.abbr}</span><span>{game.home.abbr}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          <div style={{ display: "flex", borderBottom: "1px solid #1a1a1a" }}>
            {["away", "home"].map(side => {
              const team = game[side];
              const isActive = activeTeam === side;
              const isLight = team.color === "#FFFFFF" || team.color === "#AAAAAA";
              const underline = isLight ? "#aaa" : team.color;
              return (
                <button key={side} onClick={() => setActiveTeam(side)} style={{ flex: 1, padding: "10px", border: "none", cursor: "pointer", background: isActive ? "#1a1a1a" : "transparent", color: isActive ? "#fff" : "#555", fontWeight: 700, fontSize: "12px", borderBottom: isActive ? `2px solid ${underline}` : "2px solid transparent", transition: "all 0.15s", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", fontFamily: "inherit" }}>
                  <TeamLogo abbr={team.abbr} size={18} />
                  {team.name}
                </button>
              );
            })}
          </div>
          <div style={{ padding: "0 4px 12px" }}>
            <PlayerTable
              players={activeTeam === "home" ? game.homePlayers : game.awayPlayers}
              accentColor={(() => { const c = game[activeTeam].color; return (c === "#FFFFFF" || c === "#AAAAAA") ? "#e0e0e0" : c; })()}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default function Home() {
  return (
    <div style={{ background: "#0a0a0a", minHeight: "100vh", fontFamily: "'DM Mono', 'Courier New', monospace", color: "#fff", maxWidth: "480px", margin: "0 auto", padding: "0 0 40px" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=Bebas+Neue&display=swap');
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.3; } }
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { height: 4px; background: #111; }
        ::-webkit-scrollbar-thumb { background: #333; border-radius: 2px; }
      `}</style>

      <div style={{ padding: "20px 20px 12px", borderBottom: "1px solid #181818", position: "sticky", top: 0, background: "#0a0a0a", zIndex: 10 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
          <h1 style={{ fontSize: "28px", fontFamily: "'Bebas Neue', sans-serif", letterSpacing: "0.08em", color: "#fff", margin: 0 }}>NBA SCORES</h1>
          <span style={{ fontSize: "11px", color: "#444", letterSpacing: "0.05em" }}>FEB 28, 2026</span>
        </div>
      </div>

      <div style={{ padding: "16px 16px 0" }}>
        <div style={{ marginBottom: "20px" }}>
          <div style={{ fontSize: "10px", color: "#e53e3e", letterSpacing: "0.15em", fontWeight: 700, marginBottom: "8px", display: "flex", alignItems: "center", gap: "6px" }}>
            <span style={{ display: "inline-block", width: "6px", height: "6px", background: "#e53e3e", borderRadius: "50%", animation: "pulse 1.5s infinite" }} />
            LIVE
          </div>
          {LIVE.map((g, i) => (
            <div key={i} style={{ background: "#110000", border: "1px solid #2d1111", borderRadius: "12px", padding: "16px 20px", marginBottom: "8px" }}>
              <div style={{ display: "flex", alignItems: "center" }}>
                <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "flex-end", gap: "8px" }}>
                  <div style={{ fontSize: "12px", fontWeight: 800, textAlign: "right", lineHeight: 1.2 }}>{g.awayName}</div>
                  <TeamLogo abbr={g.awayAbbr} size={30} />
                  <div style={{ fontSize: "28px", fontWeight: 900, color: g.awayScore > g.homeScore ? "#fff" : "#555", letterSpacing: "-0.02em" }}>{g.awayScore}</div>
                </div>
                <div style={{ padding: "0 12px", textAlign: "center" }}>
                  <div style={{ fontSize: "10px", color: "#e53e3e", fontWeight: 700 }}>Q{g.quarter}</div>
                  <div style={{ fontSize: "16px", color: "#e53e3e", fontWeight: 700 }}>{g.clock}</div>
                </div>
                <div style={{ flex: 1, display: "flex", alignItems: "center", gap: "8px" }}>
                  <div style={{ fontSize: "28px", fontWeight: 900, color: g.homeScore > g.awayScore ? "#fff" : "#555", letterSpacing: "-0.02em" }}>{g.homeScore}</div>
                  <TeamLogo abbr={g.homeAbbr} size={30} />
                  <div style={{ fontSize: "12px", fontWeight: 800, lineHeight: 1.2 }}>{g.homeName}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div style={{ marginBottom: "20px" }}>
          <div style={{ fontSize: "10px", color: "#555", letterSpacing: "0.15em", fontWeight: 700, marginBottom: "8px" }}>UPCOMING</div>
          {UPCOMING.map((g, i) => (
            <div key={i} style={{ background: "#0d0d0d", border: "1px solid #1a1a1a", borderRadius: "10px", padding: "12px 16px", marginBottom: "8px", display: "flex", alignItems: "center", gap: "8px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "6px", flex: 1 }}>
                <TeamLogo abbr={g.awayAbbr} size={22} />
                <span style={{ fontWeight: 800, fontSize: "12px", color: "#777" }}>{g.awayName}</span>
              </div>
              <div style={{ textAlign: "center", flexShrink: 0 }}>
                <div style={{ fontSize: "12px", color: "#555" }}>{g.time}</div>
                <div style={{ fontSize: "10px", color: "#333", marginTop: "4px" }}>{g.awayProb}% – {g.homeProb}%</div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "6px", flex: 1, justifyContent: "flex-end" }}>
                <span style={{ fontWeight: 800, fontSize: "12px", color: "#777" }}>{g.homeName}</span>
                <TeamLogo abbr={g.homeAbbr} size={22} />
              </div>
            </div>
          ))}
        </div>

        <div style={{ fontSize: "10px", color: "#555", letterSpacing: "0.15em", fontWeight: 700, marginBottom: "8px" }}>FINAL</div>
        {GAMES.map(g => <GameCard key={g.id} game={g} />)}
      </div>
    </div>
  );
}