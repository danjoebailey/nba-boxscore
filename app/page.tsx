"use client";

import { useState, useEffect } from "react";

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
      <td colSpan={2} style={{ padding: "8px 8px 8px 16px", fontSize: "10px", color: "#444", letterSpacing: "0.08em", whiteSpace: "nowrap" }}>
        25-26 AVG · {stats.gp}GP
      </td>
      {cell(`${stats.mpg}`, "#444")}
      {cell(`${stats.pts}`, accentColor)}
      {cell(`${stats.reb}`)}
      {cell(`${stats.ast}`)}
      {cell(`${stats.fg_pct}%`, "#888")}
      {cell(`${stats.three_pct}%`, "#888")}
      {cell(`${stats.stl}`)}
      {cell(`${stats.blk}`)}
      {cell(`${stats.to}`)}
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
            const showDivider = i > 0 && !p.starter && players[i - 1]?.starter;
            return (
              <>
                {showDivider && (
                  <tr key={`divider-${i}`}>
                    <td colSpan={12} style={{ padding: 0, height: "1px", background: "#333" }} />
                  </tr>
                )}
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
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "3px" }}>
              <TeamLogo abbr={game.away.abbr} size={52} />
              <span style={{ fontSize: "12px", fontWeight: 800, color: winner === "away" ? "#fff" : "#555", letterSpacing: "0.05em" }}>{game.away.abbr}</span>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", minWidth: "100px", justifyContent: "center" }}>
            <span style={{ fontSize: "26px", fontWeight: 900, color: winner === "away" ? "#fff" : "#444", letterSpacing: "-0.03em" }}>{game.away.score}</span>
            <span style={{ color: "#333", fontSize: "16px" }}>–</span>
            <span style={{ fontSize: "26px", fontWeight: 900, color: winner === "home" ? "#fff" : "#444", letterSpacing: "-0.03em" }}>{game.home.score}</span>
          </div>
          <div style={{ flex: 1, display: "flex", alignItems: "center", gap: "8px" }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "3px" }}>
              <TeamLogo abbr={game.home.abbr} size={52} />
              <span style={{ fontSize: "12px", fontWeight: 800, color: winner === "home" ? "#fff" : "#555", letterSpacing: "0.05em" }}>{game.home.abbr}</span>
            </div>
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
  const [data, setData] = useState<{ games: any[]; live: any[]; upcoming: any[]; date: string } | null>(null);

  useEffect(() => {
    fetch("/api/scoreboard").then(r => r.json()).then(setData);
  }, []);

  const games = data?.games ?? [];
  const live = data?.live ?? [];
  const upcoming = data?.upcoming ?? [];
  const date = data?.date ?? "";

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
          <span style={{ fontSize: "11px", color: "#444", letterSpacing: "0.05em" }}>{date}</span>
        </div>
      </div>

      <div style={{ padding: "16px 16px 0" }}>
        {live.length > 0 && (
          <div style={{ marginBottom: "20px" }}>
            <div style={{ fontSize: "10px", color: "#e53e3e", letterSpacing: "0.15em", fontWeight: 700, marginBottom: "8px", display: "flex", alignItems: "center", gap: "6px" }}>
              <span style={{ display: "inline-block", width: "6px", height: "6px", background: "#e53e3e", borderRadius: "50%", animation: "pulse 1.5s infinite" }} />
              LIVE
            </div>
            {live.map((g, i) => (
              <div key={i} style={{ background: "#110000", border: "1px solid #2d1111", borderRadius: "12px", padding: "16px 20px", marginBottom: "8px" }}>
                <div style={{ display: "flex", alignItems: "center" }}>
                  <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "flex-end", gap: "8px" }}>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "3px" }}>
                      <TeamLogo abbr={g.awayAbbr} size={46} />
                      <span style={{ fontSize: "12px", fontWeight: 800, color: "#aaa", letterSpacing: "0.05em" }}>{g.awayAbbr}</span>
                    </div>
                    <div style={{ fontSize: "28px", fontWeight: 900, color: g.awayScore > g.homeScore ? "#fff" : "#555", letterSpacing: "-0.02em" }}>{g.awayScore}</div>
                  </div>
                  <div style={{ padding: "0 12px", textAlign: "center" }}>
                    <div style={{ fontSize: "10px", color: "#e53e3e", fontWeight: 700 }}>Q{g.quarter}</div>
                    <div style={{ fontSize: "16px", color: "#e53e3e", fontWeight: 700 }}>{g.clock}</div>
                  </div>
                  <div style={{ flex: 1, display: "flex", alignItems: "center", gap: "8px" }}>
                    <div style={{ fontSize: "28px", fontWeight: 900, color: g.homeScore > g.awayScore ? "#fff" : "#555", letterSpacing: "-0.02em" }}>{g.homeScore}</div>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "3px" }}>
                      <TeamLogo abbr={g.homeAbbr} size={46} />
                      <span style={{ fontSize: "12px", fontWeight: 800, color: "#aaa", letterSpacing: "0.05em" }}>{g.homeAbbr}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {upcoming.length > 0 && (
          <div style={{ marginBottom: "20px" }}>
            <div style={{ fontSize: "10px", color: "#555", letterSpacing: "0.15em", fontWeight: 700, marginBottom: "8px" }}>UPCOMING</div>
            {upcoming.map((g, i) => (
              <div key={i} style={{ background: "#0d0d0d", border: "1px solid #1a1a1a", borderRadius: "10px", padding: "12px 16px", marginBottom: "8px", display: "flex", alignItems: "center", gap: "8px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "6px", flex: 1 }}>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "3px" }}>
                    <TeamLogo abbr={g.awayAbbr} size={36} />
                    <span style={{ fontSize: "11px", fontWeight: 800, color: "#777", letterSpacing: "0.05em" }}>{g.awayAbbr}</span>
                  </div>
                </div>
                <div style={{ textAlign: "center", flexShrink: 0 }}>
                  <div style={{ fontSize: "12px", color: "#555" }}>{g.time}</div>
                  <div style={{ fontSize: "10px", color: "#333", marginTop: "4px" }}>{g.awayProb}% – {g.homeProb}%</div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "6px", flex: 1, justifyContent: "flex-end" }}>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "3px" }}>
                    <TeamLogo abbr={g.homeAbbr} size={36} />
                    <span style={{ fontSize: "11px", fontWeight: 800, color: "#777", letterSpacing: "0.05em" }}>{g.homeAbbr}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {games.length > 0 && (
          <>
            <div style={{ fontSize: "10px", color: "#555", letterSpacing: "0.15em", fontWeight: 700, marginBottom: "8px" }}>FINAL</div>
            {games.map(g => <GameCard key={g.id} game={g} />)}
          </>
        )}

        {!data && (
          <div style={{ textAlign: "center", color: "#333", fontSize: "12px", paddingTop: "40px" }}>Loading…</div>
        )}
      </div>
    </div>
  );
}