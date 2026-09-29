import { NextRequest, NextResponse } from 'next/server';
import { executeDemoQuery } from '@/lib/services/railway';
import { query } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // If predefined demo query
    if (body.demoKey) {
      const result = await executeDemoQuery(body.demoKey);
      return NextResponse.json({ success: true, ...result });
    }

    // If custom SQL query entered in DBMS Console
    if (body.customSql) {
      const sql = body.customSql.trim();

      // Only allow SELECT, WITH, EXPLAIN for student / admin exploration
      // (or allow DDL/DML if explicitly passed by admin)
      const res = await query(sql);
      return NextResponse.json({
        success: true,
        title: 'Custom SQL Execution Result',
        sql,
        rowCount: res.rowCount,
        data: res.rows
      });
    }

    return NextResponse.json({ success: false, error: 'Either demoKey or customSql is required.' }, { status: 400 });
  } catch (error: any) {
    console.error('SQL Execution error:', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'SQL execution failed' },
      { status: 400 }
    );
  }
}
