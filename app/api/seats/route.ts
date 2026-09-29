import { NextRequest, NextResponse } from 'next/server';
import { getOccupiedSeats } from '@/lib/services/railway';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const trainId = searchParams.get('trainId');
    const date = searchParams.get('date');

    if (!trainId || !date) {
      return NextResponse.json(
        { success: false, error: 'trainId and date query parameters are required' },
        { status: 400 }
      );
    }

    const occupied = await getOccupiedSeats(parseInt(trainId), date);
    return NextResponse.json({ success: true, data: occupied });
  } catch (error: any) {
    console.error('Seats API error:', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to fetch seats' },
      { status: 500 }
    );
  }
}
