import { NextResponse } from "next/server";

const ESPN_STANDINGS = "https://site.web.api.espn.com/apis/v2/sports/basketball/nba/standings";

function currentNbaSeason() {
  const now = new Date();
  return now.getMonth() >= 9 ? now.getFullYear() + 1 : now.getFullYear();
}

function getStat(stats: any[], name: string): string {
  return stats.find((s: any) => s.name === name)?.displayValue ?? "--";
}

function getStatNum(stats: any[], name: string): number {
  return stats.find((s: any) => s.name === name)?.value ?? 0;
}

function parseConference(conf: any) {
  const entries: any[] = conf.standings?.entries ?? [];
  return entries
    .map((entry: any) => {
      const stats: any[] = entry.stats ?? [];
      return {
        name: entry.team?.displayName ?? "",
        abbr: entry.team?.abbreviation ?? "",
        wins: getStatNum(stats, "wins"),
        losses: getStatNum(stats, "losses"),
        pct: getStatNum(stats, "winPercent"),
        pctDisplay: getStat(stats, "winPercent"),
        gb: getStat(stats, "gamesBehind"),
        gbNum: getStatNum(stats, "gamesBehind"),
        l10: getStat(stats, "Last Ten Games"),
      };
    })
    .sort((a, b) => b.wins - a.wins || a.losses - b.losses)
    .map(({ pct: _pct, gbNum: _gbNum, ...team }) => team);
}

export async function GET() {
  const season = currentNbaSeason();
  const res = await fetch(`${ESPN_STANDINGS}?season=${season}&seasontype=2`, {
    next: { revalidate: 3600 },
  });
  if (!res.ok) return NextResponse.json({ error: "Failed to fetch standings" }, { status: 502 });

  const data = await res.json();
  const conferences: any[] = data.children ?? [];

  const east = conferences.find((c: any) => c.name?.includes("East") || c.abbreviation === "East");
  const west = conferences.find((c: any) => c.name?.includes("West") || c.abbreviation === "West");

  return NextResponse.json({
    east: east ? parseConference(east) : [],
    west: west ? parseConference(west) : [],
  });
}
