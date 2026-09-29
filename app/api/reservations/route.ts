import { NextRequest, NextResponse } from 'next/server';
import { getRecentBookings, bookTicket } from '@/lib/services/railway';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '50');
    const bookings = await getRecentBookings(limit);
    return NextResponse.json({ success: true, data: bookings });
  } catch (error: any) {
    console.error('Reservations GET error:', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to fetch reservations' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const result = await bookTicket({
      name: body.name,
      age: parseInt(body.age),
      gender: body.gender,
      phoneNumber: body.phoneNumber,
      trainId: parseInt(body.trainId),
      journeyDate: body.journeyDate,
      seatNumber: body.seatNumber,
      paymentMode: body.paymentMode || 'UPI',
      amount: body.amount ? parseFloat(body.amount) : undefined,
    });

    return NextResponse.json({ success: true, data: result });
  } catch (error: any) {
    console.error('Reservations POST error:', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Booking transaction failed' },
      { status: 400 }
    );
  }
}
