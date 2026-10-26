import { NextResponse } from "next/server";

const LEAGUES = {
  "premier-league": "PL",
  "la-liga": "PD",
  "serie-a": "SA",
  bundesliga: "BL1",
  "ligue-1": "FL1",
  "champions-league": "CL",
};

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const slug = searchParams.get("league")?.trim().toLowerCase();
  const view = searchParams.get("view") || "standings";
  const code = LEAGUES[slug];
  const token = process.env.FOOTBALL_DATA_TOKEN;

  if (!code) {
    return NextResponse.json(
      { error: "Invalid league slug.", received: slug },
      { status: 400 }
    );
  }

  if (!["standings", "matches"].includes(view)) {
    return NextResponse.json(
      { error: "View must be standings or matches." },
      { status: 400 }
    );
  }

  if (!token) {
    return NextResponse.json(
      { error: "FOOTBALL_DATA_TOKEN is missing from .env.local." },
      { status: 500 }
    );
  }

  const endpoint =
    view === "matches"
      ? `https://api.football-data.org/v4/competitions/${code}/matches`
      : `https://api.football-data.org/v4/competitions/${code}/standings`;

  try {
    const response = await fetch(endpoint, {
      headers: { "X-Auth-Token": token },
      next: { revalidate: view === "matches" ? 900 : 1800 },
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("football-data.org error:", response.status, data);

      return NextResponse.json(
        {
          error: data.message || data.error || "Football API request failed.",
          status: response.status,
        },
        { status: response.status }
      );
    }

    if (view === "matches") {
      return NextResponse.json({
        competition: data.competition?.name,
        season: data.filters?.season,
        matches: data.matches || [],
      });
    }

    return NextResponse.json({
      competition: data.competition?.name,
      season: data.season?.startDate,
      standings:
        data.standings?.find((item) => item.type === "TOTAL")?.table || [],
    });
  } catch (error) {
    console.error("Football route error:", error);

    return NextResponse.json(
      { error: "Could not connect to football-data.org." },
      { status: 502 }
    );
  }
}
