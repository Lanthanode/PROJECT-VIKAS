import { NextRequest, NextResponse } from 'next/server';
import { cancelTicket } from '@/lib/services/railway';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const result = await cancelTicket(id);
    return NextResponse.json({ success: true, data: result });
  } catch (error: any) {
    console.error('Cancel Reservation error:', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Cancellation failed' },
      { status: 400 }
    );
  }
}
