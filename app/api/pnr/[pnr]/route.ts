import { NextRequest, NextResponse } from 'next/server';
import { getBookingByPNR } from '@/lib/services/railway';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ pnr: string }> }
) {
  try {
    const { pnr } = await params;
    const booking = await getBookingByPNR(pnr);

    if (!booking) {
      return NextResponse.json(
        { success: false, error: `No booking found for PNR or ID "${pnr}"` },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: booking });
  } catch (error: any) {
    console.error('PNR lookup error:', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to retrieve PNR record' },
      { status: 500 }
    );
  }
}
