import { NextRequest, NextResponse } from 'next/server';
import { getTrains } from '@/lib/services/railway';
import { query } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const from = searchParams.get('from') || undefined;
    const to = searchParams.get('to') || undefined;

    const trains = await getTrains(from, to);
    return NextResponse.json({ success: true, data: trains });
  } catch (error: any) {
    console.error('Trains API error:', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to fetch trains' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { trainId, trainName, source, destination, departureTime, arrivalTime, totalSeats, baseFare } = body;

    if (!trainId || !trainName || !source || !destination || !departureTime || !arrivalTime) {
      return NextResponse.json({ success: false, error: 'All fields are required.' }, { status: 400 });
    }

    const res = await query(
      `INSERT INTO Train (Train_ID, Train_Name, Source, Destination, Departure_Time, Arrival_Time, Total_Seats, Base_Fare)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING *;`,
      [trainId, trainName, source, destination, departureTime, arrivalTime, totalSeats || 60, baseFare || 500.00]
    );

    return NextResponse.json({ success: true, data: res.rows[0] });
  } catch (error: any) {
    console.error('Create Train error:', error);
    return NextResponse.json({ success: false, error: error?.message || 'Failed to create train' }, { status: 500 });
  }
}
