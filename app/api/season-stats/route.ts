import { NextRequest, NextResponse } from "next/server";

const ESPN_SEARCH = "https://site.web.api.espn.com/apis/common/v3/search";
const ESPN_STATS = "https://sports.core.api.espn.com/v2/sports/basketball/leagues/nba/seasons";

function currentNbaSeason() {
  const now = new Date();
  // NBA season year = the year it ends (e.g. 2025-26 season → 2026)
  return now.getMonth() >= 9 ? now.getFullYear() + 1 : now.getFullYear();
}

function findStat(categories: any[], name: string): number | null {
  for (const cat of categories) {
    for (const stat of cat.stats ?? []) {
      if (stat.name === name) return stat.value ?? null;
    }
  }
  return null;
}

// "J. Brown" → "Brown", "R. Harper Jr." → "Harper Jr.", "OG Anunoby" → "OG Anunoby"
function extractLastName(name: string) {
  const dotIdx = name.indexOf(". ");
  return dotIdx !== -1 ? name.slice(dotIdx + 2) : name;
}

async function searchAthlete(query: string): Promise<string | null> {
  const res = await fetch(
    `${ESPN_SEARCH}?query=${encodeURIComponent(query)}&limit=5&type=player&sport=basketball&league=nba`,
    { next: { revalidate: 86400 } }
  );
  if (!res.ok) return null;
  const data = await res.json();
  return data.items?.[0]?.id ?? null;
}

export async function POST(req: NextRequest) {
  const { playerName } = await req.json();

  // 1. Resolve athlete ID — try full name first, fall back to last name only
  let athleteId = await searchAthlete(playerName);
  if (!athleteId) {
    athleteId = await searchAthlete(extractLastName(playerName));
  }
  if (!athleteId) {
    return NextResponse.json({ error: "Player not found" }, { status: 404 });
  }

  // 2. Fetch current-season regular-season averages (seasontype 2 = regular season)
  const season = currentNbaSeason();
  const statsRes = await fetch(
    `${ESPN_STATS}/${season}/types/2/athletes/${athleteId}/statistics/0`,
    { next: { revalidate: 3600 } }
  );
  if (!statsRes.ok) {
    return NextResponse.json({ error: "Stats unavailable" }, { status: 502 });
  }
  const data = await statsRes.json();
  const categories: any[] = data.splits?.categories ?? [];

  const get = (name: string) => findStat(categories, name);

  return NextResponse.json({
    pts:       +((get("avgPoints")       ?? 0) as number).toFixed(1),
    reb:       +((get("avgRebounds")     ?? 0) as number).toFixed(1),
    ast:       +((get("avgAssists")      ?? 0) as number).toFixed(1),
    fg_pct:    +((get("fieldGoalPct")    ?? 0) as number).toFixed(1),
    three_pct: +((get("threePointPct")   ?? 0) as number).toFixed(1),
    ft_pct:    +((get("freeThrowPct")    ?? 0) as number).toFixed(1),
    stl:       +((get("avgSteals")       ?? 0) as number).toFixed(1),
    blk:       +((get("avgBlocks")       ?? 0) as number).toFixed(1),
    to:        +((get("avgTurnovers")    ?? 0) as number).toFixed(1),
    mpg:       +((get("avgMinutes")      ?? 0) as number).toFixed(1),
    gp:        Math.round((get("gamesPlayed") ?? 0) as number),
  });
}
