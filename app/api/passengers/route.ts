import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET() {
  try {
    const res = await query('SELECT * FROM Passenger ORDER BY Passenger_ID ASC;');
    return NextResponse.json({ success: true, data: res.rows });
  } catch (error: any) {
    console.error('Passengers API error:', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to fetch passengers' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, age, gender, phoneNumber } = body;

    if (!name || !age || !gender || !phoneNumber) {
      return NextResponse.json({ success: false, error: 'All fields are required.' }, { status: 400 });
    }

    const res = await query(
      `INSERT INTO Passenger (Name, Age, Gender, Phone_Number)
       VALUES ($1, $2, $3, $4)
       RETURNING *;`,
      [name.trim(), parseInt(age), gender, phoneNumber.trim()]
    );

    return NextResponse.json({ success: true, data: res.rows[0] });
  } catch (error: any) {
    console.error('Create Passenger error:', error);
    return NextResponse.json({ success: false, error: error?.message || 'Failed to create passenger' }, { status: 500 });
  }
}
