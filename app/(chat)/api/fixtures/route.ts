import { NextResponse } from 'next/server';

const SPORTMONKS_API_TOKEN = process.env.SPORTMONKS_API_TOKEN;
const SPORTMONKS_BASE_URL = 'https://api.sportmonks.com/v3/football';

export async function GET() {
  if (!SPORTMONKS_API_TOKEN) {
    return NextResponse.json({ error: 'SportMonks API token not found' }, { status: 500 });
  }

  try {
    const today = new Date().toISOString().split('T')[0];
    const url = `${SPORTMONKS_BASE_URL}/fixtures/date/${today}?api_token=${SPORTMONKS_API_TOKEN}&include=participants,scores,state,league&per_page=25`;

    const response = await fetch(url, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`SportMonks API error: ${response.status}`);
    }

    const data = await response.json();

    // Filter and format the fixtures for better frontend consumption
    const formattedFixtures = data.data?.map((fixture: any) => ({
      id: fixture.id,
      name: fixture.name,
      startingAt: fixture.starting_at,
      state: fixture.state?.name || 'Not Started',
      homeTeam: {
        id: fixture.participants?.find((p: any) => p.meta.location === 'home')?.id,
        name: fixture.participants?.find((p: any) => p.meta.location === 'home')?.name,
        logo: fixture.participants?.find((p: any) => p.meta.location === 'home')?.image_path,
      },
      awayTeam: {
        id: fixture.participants?.find((p: any) => p.meta.location === 'away')?.id,
        name: fixture.participants?.find((p: any) => p.meta.location === 'away')?.name,
        logo: fixture.participants?.find((p: any) => p.meta.location === 'away')?.image_path,
      },
      league: {
        name: fixture.league?.name,
        logo: fixture.league?.image_path,
      },
      hasOdds: fixture.has_odds || false,
    })) || [];

    return NextResponse.json({
      fixtures: formattedFixtures,
      count: formattedFixtures.length,
    });
  } catch (error) {
    console.error('Error fetching fixtures:', error);
    return NextResponse.json({ error: 'Failed to fetch fixtures' }, { status: 500 });
  }
}