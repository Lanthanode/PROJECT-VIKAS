import { NextRequest, NextResponse } from 'next/server';
import { getStations } from '@/lib/services/railway';
import { query } from '@/lib/db';

export async function GET() {
  try {
    const stations = await getStations();
    return NextResponse.json({ success: true, data: stations });
  } catch (error: any) {
    console.error('Stations API error:', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to fetch stations' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { stationId, stationName, location, stationCode } = body;

    if (!stationId || !stationName || !location || !stationCode) {
      return NextResponse.json({ success: false, error: 'All fields are required.' }, { status: 400 });
    }

    const res = await query(
      `INSERT INTO Station (Station_ID, Station_Name, Location, Station_Code)
       VALUES ($1, $2, $3, $4)
       RETURNING *;`,
      [stationId, stationName, location, stationCode.toUpperCase()]
    );

    return NextResponse.json({ success: true, data: res.rows[0] });
  } catch (error: any) {
    console.error('Create Station error:', error);
    return NextResponse.json({ success: false, error: error?.message || 'Failed to create station' }, { status: 500 });
  }
}
