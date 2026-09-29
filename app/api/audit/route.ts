import { NextResponse } from 'next/server';
import { getAuditLogs } from '@/lib/services/railway';

export async function GET() {
  try {
    const logs = await getAuditLogs(50);
    return NextResponse.json({ success: true, data: logs });
  } catch (error: any) {
    console.error('Audit API error:', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to fetch audit records' },
      { status: 500 }
    );
  }
}
