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

const COLS = 13;

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

  const cell = (val: string, color = "var(--text1)") => (
    <td style={{ padding: "8px 6px", textAlign: "center", color, fontSize: "11px" }}>{val}</td>
  );

  if (loading) {
    return (
      <tr>
        <td colSpan={COLS} style={{ padding: "10px 12px", background: "var(--row-a)", borderBottom: "1px solid var(--border)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "var(--text3)", fontSize: "11px" }}>
            <span style={{ display: "inline-block", width: "8px", height: "8px", borderRadius: "50%", background: "var(--gold)", animation: "pulse 1s infinite" }} />
            Loading season averages…
          </div>
        </td>
      </tr>
    );
  }

  if (error || !stats) {
    return (
      <tr>
        <td colSpan={COLS} style={{ padding: "8px 12px", background: "var(--row-a)", color: "var(--text3)", fontSize: "11px", borderBottom: "1px solid var(--border)" }}>
          Could not load season stats.
        </td>
      </tr>
    );
  }

  return (
    <tr style={{ background: "var(--row-a)", borderBottom: "1px solid var(--gold)" }}>
      <td colSpan={2} style={{ padding: "8px 8px 8px 16px", fontSize: "10px", color: "var(--text3)", letterSpacing: "0.08em", whiteSpace: "nowrap" }}>
        25-26 AVG · {stats.gp}GP
      </td>
      {cell(`${stats.mpg}`, "var(--text2)")}
      {cell(`${stats.pts}`, accentColor)}
      {cell(`${stats.reb}`)}
      {cell(`${stats.ast}`)}
      {cell(`${stats.fg_pct}%`)}
      {cell(`${stats.three_pct}%`)}
      {cell(`${stats.ft_pct}%`)}
      {cell(`${stats.stl}`)}
      {cell(`${stats.blk}`)}
      {cell(`${stats.to}`)}
    </tr>
  );
}

function PlayerTable({ players, accentColor }: { players: any[]; accentColor: string }) {
  const [expandedPlayer, setExpandedPlayer] = useState<string | null>(null);
  const toggle = (name: string) => setExpandedPlayer(prev => prev === name ? null : name);
  const pmColor = (pm: number) => pm > 0 ? "#2A7A3A" : pm < 0 ? "#B03020" : "var(--text3)";
  const pmLabel = (pm: number) => pm > 0 ? `+${pm}` : `${pm}`;
  const rowBg = (i: number, isExpanded: boolean) => {
    if (isExpanded) return "var(--row-a)";
    return i % 2 === 0 ? "var(--row-a)" : "var(--row-b)";
  };

  return (
    <div style={{ overflowX: "auto" }}>
      <table style={{ borderCollapse: "collapse", fontSize: "12px" }}>
        <thead>
          <tr style={{ color: "var(--text2)", borderBottom: "1px solid var(--border)" }}>
            <th style={{ textAlign: "left", padding: "6px 8px", fontWeight: 600, letterSpacing: "0.05em", whiteSpace: "nowrap", position: "sticky", left: 0, background: "var(--head)", zIndex: 2 }}>PLAYER</th>
            <th style={{ padding: "6px 6px", textAlign: "center", fontWeight: 600 }}>POS</th>
            <th style={{ padding: "6px 6px", textAlign: "center", fontWeight: 600 }}>MIN</th>
            <th style={{ padding: "6px 6px", textAlign: "center", fontWeight: 600, color: accentColor }}>PTS</th>
            <th style={{ padding: "6px 6px", textAlign: "center", fontWeight: 600 }}>REB</th>
            <th style={{ padding: "6px 6px", textAlign: "center", fontWeight: 600 }}>AST</th>
            <th style={{ padding: "6px 6px", textAlign: "center", fontWeight: 600 }}>FG</th>
            <th style={{ padding: "6px 6px", textAlign: "center", fontWeight: 600 }}>3PT</th>
            <th style={{ padding: "6px 6px", textAlign: "center", fontWeight: 600 }}>FT</th>
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
                    <td colSpan={12} style={{ padding: 0, height: "1px", background: "var(--gold)" }} />
                  </tr>
                )}
                <tr
                  key={p.name}
                  onClick={() => toggle(p.name)}
                  style={{ borderBottom: isExpanded ? "none" : "1px solid var(--border)", background: isExpanded ? "var(--row-a)" : i % 2 === 0 ? "var(--row-a)" : "var(--row-b)", cursor: "pointer" }}
                >
                  <td style={{ padding: "8px 8px", fontWeight: 600, whiteSpace: "nowrap", color: "var(--text1)", position: "sticky", left: 0, zIndex: 1, background: bg }}>
                    <span style={{ marginRight: "5px", fontSize: "9px", color: isExpanded ? accentColor : "var(--text3)" }}>{isExpanded ? "▼" : "▶"}</span>
                    {p.name}
                  </td>
                  <td style={{ padding: "8px 6px", textAlign: "center", color: "var(--text2)", fontSize: "11px" }}>{p.pos}</td>
                  <td style={{ padding: "8px 6px", textAlign: "center", color: "var(--text2)", fontSize: "11px" }}>{p.min}</td>
                  <td style={{ padding: "8px 6px", textAlign: "center", fontWeight: 700, color: accentColor, fontSize: "14px" }}>{p.pts}</td>
                  <td style={{ padding: "8px 6px", textAlign: "center", color: "var(--text1)" }}>{p.reb}</td>
                  <td style={{ padding: "8px 6px", textAlign: "center", color: "var(--text1)" }}>{p.ast}</td>
                  <td style={{ padding: "8px 6px", textAlign: "center", color: "var(--text1)", fontSize: "11px" }}>{p.fgm}/{p.fga}</td>
                  <td style={{ padding: "8px 6px", textAlign: "center", color: "var(--text1)", fontSize: "11px" }}>{p.tpm}/{p.tpa}</td>
                  <td style={{ padding: "8px 6px", textAlign: "center", color: "var(--text1)", fontSize: "11px" }}>{p.ftm}/{p.fta}</td>
                  <td style={{ padding: "8px 6px", textAlign: "center", color: "var(--text1)" }}>{p.stl}</td>
                  <td style={{ padding: "8px 6px", textAlign: "center", color: "var(--text1)" }}>{p.blk}</td>
                  <td style={{ padding: "8px 6px", textAlign: "center", color: "var(--text1)" }}>{p.to}</td>
                  <td style={{ padding: "8px 6px", textAlign: "center", fontWeight: 700, color: pmColor(pm), fontSize: "12px" }}>{pmLabel(pm)}</td>
                </tr>
                {isExpanded && (
                  <SeasonStatsRow key={`${p.name}-season`} playerName={p.fullName ?? p.name} accentColor={accentColor} />
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
    <div style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: "12px", overflow: "hidden", marginBottom: "12px" }}>
      <div onClick={() => setExpanded(e => !e)} style={{ cursor: "pointer", padding: "16px 20px", userSelect: "none" }}>
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", marginBottom: "12px", position: "relative" }}>
          <span style={{ fontSize: "11px", color: "var(--text3)", letterSpacing: "0.1em", fontWeight: 600 }}>{isOT ? "FINAL/OT" : "FINAL"}</span>
          <span style={{ fontSize: "11px", color: "var(--arrow)", position: "absolute", right: 0 }}>{expanded ? "▲" : "▼"}</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "3px" }}>
              <TeamLogo abbr={game.away.abbr} size={52} />
              <span style={{ fontSize: "12px", fontWeight: 800, color: winner === "away" ? "var(--text1)" : "var(--lose)", letterSpacing: "0.05em" }}>{game.away.abbr}</span>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", minWidth: "100px", justifyContent: "center" }}>
            <span style={{ fontSize: "26px", fontWeight: 900, color: winner === "away" ? "var(--text1)" : "var(--lose2)", letterSpacing: "-0.03em" }}>{game.away.score}</span>
            <span style={{ color: "var(--gold)", fontSize: "16px" }}>–</span>
            <span style={{ fontSize: "26px", fontWeight: 900, color: winner === "home" ? "var(--text1)" : "var(--lose2)", letterSpacing: "-0.03em" }}>{game.home.score}</span>
          </div>
          <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "3px" }}>
              <TeamLogo abbr={game.home.abbr} size={52} />
              <span style={{ fontSize: "12px", fontWeight: 800, color: winner === "home" ? "var(--text1)" : "var(--lose)", letterSpacing: "0.05em" }}>{game.home.abbr}</span>
            </div>
          </div>
        </div>
      </div>

      {expanded && (
        <div style={{ borderTop: "1px solid var(--border)" }}>
          <div style={{ padding: "12px 16px", borderBottom: "1px solid var(--border)" }}>
            <div style={{ display: "grid", gridTemplateColumns: `auto repeat(${game.away.q.length}, 1fr)`, gap: "4px", alignItems: "center" }}>
              <div />
              {game.away.q.map((_: number, i: number) => (
                <div key={i} style={{ fontSize: "9px", color: "var(--text3)", textAlign: "center" }}>
                  {i < 4 ? `Q${i + 1}` : `OT${i - 3}`}
                </div>
              ))}
              <div style={{ fontSize: "10px", fontWeight: 700, color: "var(--text5)", letterSpacing: "0.04em", paddingRight: "8px" }}>{game.away.abbr}</div>
              {game.away.q.map((q: number, i: number) => {
                const hq = game.home.q[i];
                return (
                  <div key={i} style={{ background: "var(--row-a)", borderRadius: "4px", padding: "6px 4px", textAlign: "center", fontSize: "12px", fontWeight: 700, color: q > hq ? "var(--text1)" : "var(--lose)" }}>{q}</div>
                );
              })}
              <div style={{ fontSize: "10px", fontWeight: 700, color: "var(--text5)", letterSpacing: "0.04em", paddingRight: "8px" }}>{game.home.abbr}</div>
              {game.home.q.map((hq: number, i: number) => {
                const q = game.away.q[i];
                return (
                  <div key={i} style={{ background: "var(--row-a)", borderRadius: "4px", padding: "6px 4px", textAlign: "center", fontSize: "12px", fontWeight: 700, color: hq > q ? "var(--text1)" : "var(--lose)" }}>{hq}</div>
                );
              })}
            </div>
          </div>
          <div style={{ display: "flex", borderBottom: "1px solid var(--border)" }}>
            {["away", "home"].map(side => {
              const team = game[side];
              const isActive = activeTeam === side;
              const isLight = team.color === "#FFFFFF" || team.color === "#AAAAAA";
              const underline = isLight ? "var(--text3)" : team.color;
              return (
                <button key={side} onClick={() => setActiveTeam(side)} style={{ flex: 1, padding: "10px", border: "none", cursor: "pointer", background: isActive ? "var(--row-a)" : "transparent", color: isActive ? "var(--text1)" : "var(--text3)", fontWeight: 700, fontSize: "12px", borderBottom: isActive ? `2px solid ${underline}` : "2px solid transparent", transition: "all 0.15s", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", fontFamily: "inherit" }}>
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

function LiveGameCard({ game }: { game: any }) {
  const [expanded, setExpanded] = useState(false);
  const [activeTeam, setActiveTeam] = useState("home");

  return (
    <div style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: "12px", overflow: "hidden", marginBottom: "8px" }}>
      <div onClick={() => setExpanded(e => !e)} style={{ cursor: "pointer", padding: "16px 20px", userSelect: "none" }}>
        <div style={{ display: "flex", alignItems: "center", position: "relative" }}>
          <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "flex-end", gap: "8px" }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "3px" }}>
              <TeamLogo abbr={game.awayAbbr} size={46} />
              <span style={{ fontSize: "12px", fontWeight: 800, color: "var(--lose)", letterSpacing: "0.05em" }}>{game.awayAbbr}</span>
            </div>
            <div style={{ fontSize: "28px", fontWeight: 900, color: game.awayScore > game.homeScore ? "var(--text1)" : "var(--lose2)", letterSpacing: "-0.02em" }}>{game.awayScore}</div>
          </div>
          <div style={{ padding: "0 12px", textAlign: "center" }}>
            <div style={{ fontSize: "10px", color: "#e53e3e", fontWeight: 700 }}>Q{game.quarter}</div>
            <div style={{ fontSize: "16px", color: "#e53e3e", fontWeight: 700 }}>{game.clock}</div>
          </div>
          <div style={{ flex: 1, display: "flex", alignItems: "center", gap: "8px" }}>
            <div style={{ fontSize: "28px", fontWeight: 900, color: game.homeScore > game.awayScore ? "var(--text1)" : "var(--lose2)", letterSpacing: "-0.02em" }}>{game.homeScore}</div>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "3px" }}>
              <TeamLogo abbr={game.homeAbbr} size={46} />
              <span style={{ fontSize: "12px", fontWeight: 800, color: "var(--lose)", letterSpacing: "0.05em" }}>{game.homeAbbr}</span>
            </div>
          </div>
          <span style={{ fontSize: "11px", color: "var(--arrow)", position: "absolute", right: 0, top: 0 }}>{expanded ? "▲" : "▼"}</span>
        </div>
      </div>

      {expanded && (
        <div style={{ borderTop: "1px solid var(--border)" }}>
          <div style={{ display: "flex", borderBottom: "1px solid var(--border)" }}>
            {(["away", "home"] as const).map(side => {
              const abbr = side === "away" ? game.awayAbbr : game.homeAbbr;
              const name = side === "away" ? game.awayName : game.homeName;
              const color = side === "away" ? game.awayColor : game.homeColor;
              const isActive = activeTeam === side;
              const isLight = color === "#FFFFFF" || color === "#AAAAAA";
              const underline = isLight ? "#888" : color;
              return (
                <button key={side} onClick={() => setActiveTeam(side)} style={{ flex: 1, padding: "10px", border: "none", cursor: "pointer", background: isActive ? "var(--row-a)" : "transparent", color: isActive ? "var(--text1)" : "var(--text3)", fontWeight: 700, fontSize: "12px", borderBottom: isActive ? `2px solid ${underline}` : "2px solid transparent", transition: "all 0.15s", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", fontFamily: "inherit" }}>
                  <TeamLogo abbr={abbr} size={18} />
                  {name}
                </button>
              );
            })}
          </div>
          <div style={{ padding: "0 4px 12px" }}>
            {(() => {
              const color = activeTeam === "away" ? game.awayColor : game.homeColor;
              const accentColor = (color === "#FFFFFF" || color === "#AAAAAA") ? "#e0e0e0" : color;
              const players = activeTeam === "away" ? game.awayPlayers : game.homePlayers;
              return players.length > 0
                ? <PlayerTable players={players} accentColor={accentColor} />
                : <div style={{ textAlign: "center", color: "#555", fontSize: "12px", padding: "20px 0" }}>No stats yet</div>;
            })()}
          </div>
        </div>
      )}
    </div>
  );
}

function StandingsTable({ teams }: { teams: any[] }) {
  return (
    <div style={{ overflowX: "auto" }}>
      <table style={{ borderCollapse: "collapse", fontSize: "12px", width: "100%" }}>
        <thead>
          <tr style={{ color: "var(--text2)", borderBottom: "1px solid var(--border)", background: "var(--head)" }}>
            <th style={{ textAlign: "left", padding: "6px 8px", fontWeight: 600, letterSpacing: "0.05em" }}>#</th>
            <th style={{ textAlign: "left", padding: "6px 8px", fontWeight: 600, letterSpacing: "0.05em" }}>TEAM</th>
            <th style={{ padding: "6px 8px", textAlign: "center", fontWeight: 600 }}>W</th>
            <th style={{ padding: "6px 8px", textAlign: "center", fontWeight: 600 }}>L</th>
            <th style={{ padding: "6px 8px", textAlign: "center", fontWeight: 600 }}>PCT</th>
            <th style={{ padding: "6px 8px", textAlign: "center", fontWeight: 600 }}>GB</th>
            <th style={{ padding: "6px 8px", textAlign: "center", fontWeight: 600 }}>L10</th>
          </tr>
        </thead>
        <tbody>
          {teams.map((team, i) => {
            const seed = i + 1;
            const showDivider = i === 6;
            return (
              <>
                {showDivider && (
                  <tr key={`divider-${i}`}>
                    <td colSpan={7} style={{ padding: 0, height: "1px", background: "var(--gold)" }} />
                  </tr>
                )}
                <tr key={team.abbr} style={{ background: i % 2 === 0 ? "var(--row-a)" : "var(--row-b)", borderBottom: "1px solid var(--border)" }}>
                  <td style={{ padding: "9px 8px", color: seed <= 6 ? "var(--text2)" : "var(--text3)", fontSize: "11px", fontWeight: 600 }}>{seed}</td>
                  <td style={{ padding: "9px 8px", fontWeight: 700, color: "var(--text1)", whiteSpace: "nowrap", display: "flex", alignItems: "center", gap: "6px" }}>
                    <TeamLogo abbr={team.abbr} size={20} />
                    {team.abbr}
                  </td>
                  <td style={{ padding: "9px 8px", textAlign: "center", color: "var(--text1)", fontWeight: 700 }}>{team.wins}</td>
                  <td style={{ padding: "9px 8px", textAlign: "center", color: "var(--text1)" }}>{team.losses}</td>
                  <td style={{ padding: "9px 8px", textAlign: "center", color: "var(--text1)" }}>{team.pctDisplay}</td>
                  <td style={{ padding: "9px 8px", textAlign: "center", color: "var(--text2)" }}>{team.gb}</td>
                  <td style={{ padding: "9px 8px", textAlign: "center", color: "var(--text1)" }}>{team.l10}</td>
                </tr>
              </>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function StandingsPage() {
  const [data, setData] = useState<{ east: any[]; west: any[] } | null>(null);
  const [activeConf, setActiveConf] = useState<"east" | "west">("east");

  useEffect(() => {
    fetch("/api/standings").then(r => r.json()).then(setData);
  }, []);

  const teams = data ? data[activeConf] : [];

  return (
    <div style={{ padding: "0 0 12px" }}>
      <div style={{ display: "flex", borderBottom: "1px solid var(--border2)" }}>
        {(["east", "west"] as const).map(conf => {
          const isActive = activeConf === conf;
          const label = conf === "east" ? "EASTERN" : "WESTERN";
          return (
            <button key={conf} onClick={() => setActiveConf(conf)} style={{ flex: 1, padding: "10px", border: "none", cursor: "pointer", background: isActive ? "var(--conf-active)" : "transparent", color: isActive ? "var(--text1)" : "var(--text4)", fontWeight: 700, fontSize: "11px", letterSpacing: "0.08em", borderBottom: isActive ? "2px solid var(--text1)" : "2px solid transparent", transition: "all 0.15s", fontFamily: "inherit" }}>
              {label}
            </button>
          );
        })}
      </div>
      <div style={{ background: "var(--card)", borderRadius: "0 0 12px 12px", overflow: "hidden", margin: "12px 16px 0" }}>
        {!data ? (
          <div style={{ textAlign: "center", color: "var(--text4)", fontSize: "12px", padding: "40px 0" }}>Loading…</div>
        ) : (
          <StandingsTable teams={teams} />
        )}
      </div>
    </div>
  );
}

export default function Home() {
  const [dark, setDark] = useState(false);
  const [activePage, setActivePage] = useState<"scores" | "standings">("scores");
  const [data, setData] = useState<{ games: any[]; live: any[]; upcoming: any[]; date: string } | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem("theme");
    if (saved) {
      setDark(saved === "dark");
    } else {
      setDark(window.matchMedia("(prefers-color-scheme: dark)").matches);
    }
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = (e: MediaQueryListEvent) => {
      if (!localStorage.getItem("theme")) setDark(e.matches);
    };
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  const toggleTheme = () => {
    const next = !dark;
    setDark(next);
    localStorage.setItem("theme", next ? "dark" : "light");
  };

  useEffect(() => {
    fetch("/api/scoreboard").then(r => r.json()).then(setData);
  }, []);

  const games = data?.games ?? [];
  const live = data?.live ?? [];
  const upcoming = data?.upcoming ?? [];
  const date = data?.date ?? "";

  return (
    <div
      data-theme={dark ? "dark" : "light"}
      style={{ background: "var(--bg)", minHeight: "100vh", fontFamily: "'IBM Plex Mono', 'Courier New', monospace", color: "var(--text1)", maxWidth: "480px", margin: "0 auto", padding: "0 0 40px" }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;600;700&family=Bebas+Neue&display=swap');
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.3; } }
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { height: 4px; background: var(--scroll-bg); }
        ::-webkit-scrollbar-thumb { background: var(--gold); border-radius: 2px; }

        [data-theme="light"] {
          --bg: #C8943A;
          --card: #F0DDB0;
          --row-a: #E8D49A;
          --row-b: #F0DDB0;
          --head: #F5E6C8;
          --border: #D4B870;
          --border2: #A07428;
          --gold: #C9A84C;
          --text1: #111111;
          --text2: #5A4A2A;
          --text3: #8A7040;
          --text4: #6B4A1A;
          --text5: #7A6030;
          --lose: #B0A080;
          --lose2: #C0A87A;
          --arrow: #B0903A;
          --conf-active: #B07828;
          --scroll-bg: #EDD9A3;
        }

        [data-theme="dark"] {
          --bg: #1a1207;
          --card: #2c2210;
          --row-a: #271e0c;
          --row-b: #2c2210;
          --head: #211809;
          --border: #3d3020;
          --border2: #5a4828;
          --gold: #C9A84C;
          --text1: #f0e0c0;
          --text2: #C9A84C;
          --text3: #907850;
          --text4: #a08050;
          --text5: #907040;
          --lose: #5a4a2a;
          --lose2: #6a5a3a;
          --arrow: #806030;
          --conf-active: #3d3020;
          --scroll-bg: #2c2210;
        }
      `}</style>

      <div style={{ position: "sticky", top: 0, background: "var(--bg)", zIndex: 10, borderBottom: "1px solid var(--border2)" }}>
        <div style={{ padding: "20px 20px 12px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
            <h1 style={{ fontSize: "28px", fontFamily: "'Bebas Neue', sans-serif", letterSpacing: "0.08em", color: "var(--text1)", margin: 0 }}>NBA SCORES</h1>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <span style={{ fontSize: "11px", color: "var(--text1)", letterSpacing: "0.05em", fontWeight: 600 }}>{date}</span>
              <button
                onClick={toggleTheme}
                title={dark ? "Switch to light mode" : "Switch to dark mode"}
                style={{
                  width: "20px", height: "20px", borderRadius: "50%", border: "none", padding: 0, cursor: "pointer", flexShrink: 0,
                  background: `linear-gradient(to right, var(--text1) 50%, transparent 50%)`,
                  outline: `2px solid var(--text1)`,
                  outlineOffset: "1px",
                }}
              />
            </div>
          </div>
        </div>
        <div style={{ display: "flex" }}>
          {(["scores", "standings"] as const).map(page => {
            const isActive = activePage === page;
            return (
              <button key={page} onClick={() => setActivePage(page)} style={{ flex: 1, padding: "8px", border: "none", cursor: "pointer", background: "transparent", color: isActive ? "var(--text1)" : "var(--text4)", fontWeight: 700, fontSize: "11px", letterSpacing: "0.1em", borderBottom: isActive ? "2px solid var(--text1)" : "2px solid transparent", transition: "all 0.15s", fontFamily: "inherit" }}>
                {page.toUpperCase()}
              </button>
            );
          })}
        </div>
      </div>

      {activePage === "standings" ? (
        <StandingsPage />
      ) : (
        <div style={{ padding: "16px 16px 0" }}>
          {live.length > 0 && (
            <div style={{ marginBottom: "20px" }}>
              <div style={{ fontSize: "10px", color: "#e53e3e", letterSpacing: "0.15em", fontWeight: 700, marginBottom: "8px", display: "flex", alignItems: "center", gap: "6px" }}>
                <span style={{ display: "inline-block", width: "6px", height: "6px", background: "#e53e3e", borderRadius: "50%", animation: "pulse 1.5s infinite" }} />
                LIVE
              </div>
              {live.map((g, i) => <LiveGameCard key={i} game={g} />)}
            </div>
          )}

          {upcoming.length > 0 && (
            <div style={{ marginBottom: "20px" }}>
              <div style={{ fontSize: "10px", color: "var(--text4)", letterSpacing: "0.15em", fontWeight: 700, marginBottom: "8px" }}>UPCOMING</div>
              {upcoming.map((g, i) => (
                <div key={i} style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: "10px", padding: "12px 16px", marginBottom: "8px", display: "flex", alignItems: "center", gap: "8px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "6px", flex: 1 }}>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "3px" }}>
                      <TeamLogo abbr={g.awayAbbr} size={36} />
                      <span style={{ fontSize: "11px", fontWeight: 800, color: "var(--lose)", letterSpacing: "0.05em" }}>{g.awayAbbr}</span>
                    </div>
                  </div>
                  <div style={{ textAlign: "center", flexShrink: 0 }}>
                    <div style={{ fontSize: "12px", color: "var(--text2)" }}>{g.time}</div>
                    <div style={{ fontSize: "10px", color: "var(--text3)", marginTop: "4px" }}>{g.awayProb}% – {g.homeProb}%</div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "6px", flex: 1, justifyContent: "flex-end" }}>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "3px" }}>
                      <TeamLogo abbr={g.homeAbbr} size={36} />
                      <span style={{ fontSize: "11px", fontWeight: 800, color: "var(--lose)", letterSpacing: "0.05em" }}>{g.homeAbbr}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {games.length > 0 && (
            <>
              <div style={{ fontSize: "10px", color: "var(--text4)", letterSpacing: "0.15em", fontWeight: 700, marginBottom: "8px" }}>FINAL</div>
              {games.map(g => <GameCard key={g.id} game={g} />)}
            </>
          )}

          {!data && (
            <div style={{ textAlign: "center", color: "var(--text4)", fontSize: "12px", paddingTop: "40px" }}>Loading…</div>
          )}
        </div>
      )}
    </div>
  );
}
