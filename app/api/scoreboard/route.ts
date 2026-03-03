import { NextResponse } from "next/server";

const ESPN = "https://site.api.espn.com/apis/site/v2/sports/basketball/nba";

const SUFFIXES = new Set(["Jr.", "Sr.", "II", "III", "IV", "V"]);

function abbreviateName(full: string): string {
  const parts = full.trim().split(" ");
  if (parts.length === 1) return full;
  const first = parts[0];
  const rest = parts.slice(1).filter((p) => !SUFFIXES.has(p));
  const last = rest.at(-1) ?? parts.at(-1)!;
  return `${first[0]}. ${last}`;
}

function teamColor(hex: string): string {
  return hex ? `#${hex}` : "#888888";
}

function parseSplit(val: string): [number, number] {
  const [a, b] = val.split("-").map(Number);
  return [a ?? 0, b ?? 0];
}

function toInt(s: string): number {
  return parseInt(s, 10) || 0;
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "America/New_York",
  }).toUpperCase();
}

function yyyymmdd(date: Date): string {
  return date.toISOString().slice(0, 10).replace(/-/g, "");
}

async function fetchScoreboard(date: Date) {
  const res = await fetch(
    `${ESPN}/scoreboard?dates=${yyyymmdd(date)}&limit=20`,
    { next: { revalidate: 30 } }
  );
  if (!res.ok) return null;
  return res.json();
}

async function fetchBoxScore(eventId: string) {
  const res = await fetch(`${ESPN}/summary?event=${eventId}`, {
    next: { revalidate: 30 },
  });
  if (!res.ok) return null;
  return res.json();
}

function transformPlayers(teamData: any): any[] {
  const athletes: any[] = teamData?.statistics?.[0]?.athletes ?? [];
  return athletes
    .filter((a: any) => a.stats?.length > 0 && a.stats[0] !== "0:00" && a.stats[0] !== "DNP")
    .sort((a: any, b: any) => (b.starter ? 1 : 0) - (a.starter ? 1 : 0) || toInt(b.stats?.[1]) - toInt(a.stats?.[1]))
    .map((a: any) => {
      const s = a.stats;
      const [fgm, fga] = parseSplit(s[2] ?? "0-0");
      const [tpm, tpa] = parseSplit(s[3] ?? "0-0");
      const minRaw = s[0] ?? "0";
      return {
        name: abbreviateName(a.athlete?.displayName ?? "Unknown"),
        pos: a.athlete?.position?.abbreviation ?? "?",
        pts: toInt(s[1]),
        reb: toInt(s[5]),
        ast: toInt(s[6]),
        fgm,
        fga,
        tpm,
        tpa,
        stl: toInt(s[8]),
        blk: toInt(s[9]),
        to: toInt(s[7]),
        pm: toInt(s[13]),
        min: parseInt(minRaw.split(":")[0], 10) || 0,
      };
    });
}

function transformCompetitor(c: any) {
  return {
    abbr: c.team?.abbreviation ?? "",
    name: c.team?.displayName ?? "",
    score: parseInt(c.score ?? "0", 10),
    color: teamColor(c.team?.color ?? ""),
    q: (c.linescores ?? []).map((l: any) => Math.round(l.value ?? 0)),
  };
}

export async function GET() {
  // Try today, then yesterday if no completed games
  const now = new Date();
  let data = await fetchScoreboard(now);
  const events: any[] = data?.events ?? [];

  const hasCompleted = events.some(
    (e) => e.competitions?.[0]?.status?.type?.state === "post"
  );
  if (!hasCompleted) {
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    data = await fetchScoreboard(yesterday);
  }

  const allEvents: any[] = data?.events ?? [];
  const dateLabel = allEvents[0]?.date ? formatDate(allEvents[0].date) : "";

  const finalEvents = allEvents.filter(
    (e) => e.competitions?.[0]?.status?.type?.state === "post"
  );
  const liveEvents = allEvents.filter(
    (e) => e.competitions?.[0]?.status?.type?.state === "in"
  );
  const upcomingEvents = allEvents.filter(
    (e) => e.competitions?.[0]?.status?.type?.state === "pre"
  );

  // Fetch box scores for completed games in parallel
  const boxScores = await Promise.all(
    finalEvents.map((e) => fetchBoxScore(e.id))
  );

  const games = finalEvents.map((event, i) => {
    const comp = event.competitions[0];
    const home = comp.competitors.find((c: any) => c.homeAway === "home") ?? comp.competitors[1];
    const away = comp.competitors.find((c: any) => c.homeAway === "away") ?? comp.competitors[0];
    const box = boxScores[i];
    const homeId = home.team?.id;
    const awayId = away.team?.id;
    const homePlayers = box ? transformPlayers(box.boxscore?.players?.find((p: any) => p.team?.id === homeId)) : [];
    const awayPlayers = box ? transformPlayers(box.boxscore?.players?.find((p: any) => p.team?.id === awayId)) : [];
    return {
      id: event.id,
      home: transformCompetitor(home),
      away: transformCompetitor(away),
      homePlayers,
      awayPlayers,
    };
  });

  const live = liveEvents.map((event) => {
    const comp = event.competitions[0];
    const status = comp.status;
    const home = comp.competitors.find((c: any) => c.homeAway === "home") ?? comp.competitors[1];
    const away = comp.competitors.find((c: any) => c.homeAway === "away") ?? comp.competitors[0];
    return {
      homeAbbr: home.team?.abbreviation ?? "",
      homeName: home.team?.displayName ?? "",
      homeScore: parseInt(home.score ?? "0", 10),
      awayAbbr: away.team?.abbreviation ?? "",
      awayName: away.team?.displayName ?? "",
      awayScore: parseInt(away.score ?? "0", 10),
      quarter: status.period ?? 0,
      clock: status.displayClock ?? "",
    };
  });

  const upcoming = upcomingEvents.map((event) => {
    const comp = event.competitions[0];
    const home = comp.competitors.find((c: any) => c.homeAway === "home") ?? comp.competitors[1];
    const away = comp.competitors.find((c: any) => c.homeAway === "away") ?? comp.competitors[0];
    const time = new Date(event.date).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      timeZone: "America/New_York",
    });
    // Win probability from predictor if available
    const predictor = comp.predictor;
    const homeProb = Math.round(predictor?.homeTeam?.gameProjection ?? 50);
    const awayProb = 100 - homeProb;
    return {
      homeAbbr: home.team?.abbreviation ?? "",
      homeName: home.team?.displayName ?? "",
      awayAbbr: away.team?.abbreviation ?? "",
      awayName: away.team?.displayName ?? "",
      time,
      homeProb,
      awayProb,
    };
  });

  return NextResponse.json({ games, live, upcoming, date: dateLabel });
}
