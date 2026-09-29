import { NextResponse } from 'next/server';
import { getDashboardStats } from '@/lib/services/railway';

export async function GET() {
  try {
    const stats = await getDashboardStats();
    return NextResponse.json({ success: true, data: stats });
  } catch (error: any) {
    console.error('Stats API error:', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to fetch database statistics' },
      { status: 500 }
    );
  }
}
