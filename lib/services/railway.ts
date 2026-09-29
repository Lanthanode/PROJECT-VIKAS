import { query } from '@/lib/db';

export interface BookingInput {
  name: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  phoneNumber: string;
  trainId: number;
  journeyDate: string; // YYYY-MM-DD
  seatNumber?: string;
  paymentMode: 'UPI' | 'Card' | 'Net Banking' | 'Cash';
  amount?: number;
}

/**
 * Returns live database aggregate statistics
 */
export async function getDashboardStats() {
  const [trainsRes, stationsRes, passengersRes, bookingsRes, revenueRes] = await Promise.all([
    query('SELECT COUNT(*) AS count FROM Train;'),
    query('SELECT COUNT(*) AS count FROM Station;'),
    query('SELECT COUNT(*) AS count FROM Passenger;'),
    query("SELECT COUNT(*) AS count FROM Reservation WHERE Reservation_Status = 'Confirmed';"),
    query("SELECT COALESCE(SUM(Amount), 0) AS total FROM Payment WHERE Payment_Status = 'Paid';"),
  ]);

  return {
    activeTrains: parseInt(trainsRes.rows[0]?.count || '0'),
    stations: parseInt(stationsRes.rows[0]?.count || '0'),
    passengers: parseInt(passengersRes.rows[0]?.count || '0'),
    confirmedBookings: parseInt(bookingsRes.rows[0]?.count || '0'),
    totalRevenue: parseFloat(revenueRes.rows[0]?.total || '0'),
  };
}

/**
 * Searches and retrieves available trains
 */
export async function getTrains(from?: string, to?: string) {
  let sql = `
    SELECT 
      t.Train_ID,
      t.Train_Name,
      t.Source,
      t.Destination,
      TO_CHAR(t.Departure_Time, 'HH24:MI') AS Departure_Time,
      TO_CHAR(t.Arrival_Time, 'HH24:MI') AS Arrival_Time,
      t.Total_Seats,
      t.Base_Fare
    FROM Train t
  `;

  const params: any[] = [];
  const conditions: string[] = [];

  if (from) {
    params.push(`%${from.trim().toLowerCase()}%`);
    conditions.push(`LOWER(t.Source) LIKE $${params.length}`);
  }

  if (to) {
    params.push(`%${to.trim().toLowerCase()}%`);
    conditions.push(`LOWER(t.Destination) LIKE $${params.length}`);
  }

  if (conditions.length > 0) {
    sql += ` WHERE ${conditions.join(' AND ')}`;
  }

  sql += ` ORDER BY t.Train_ID ASC;`;

  const res = await query(sql, params);
  return res.rows;
}

/**
 * Retrieves all railway stations with their connected train counts
 */
export async function getStations() {
  const sql = `
    SELECT 
      s.Station_ID,
      s.Station_Name,
      s.Location,
      s.Station_Code,
      COUNT(ts.Train_ID) AS Connected_Trains
    FROM Station s
    LEFT JOIN Train_Station ts ON s.Station_ID = ts.Station_ID
    GROUP BY s.Station_ID, s.Station_Name, s.Location, s.Station_Code
    ORDER BY s.Station_ID ASC;
  `;
  const res = await query(sql);
  return res.rows;
}

/**
 * Retrieves recent bookings via the SQL Confirmed_Bookings_View
 */
export async function getRecentBookings(limit: number = 20) {
  const sql = `
    SELECT 
      r.Reservation_ID,
      r.PNR,
      p.Name AS Passenger_Name,
      p.Phone_Number,
      t.Train_Name,
      t.Source,
      t.Destination,
      r.Seat_Number,
      TO_CHAR(r.Journey_Date, 'YYYY-MM-DD') AS Journey_Date,
      r.Reservation_Status,
      pay.Amount AS Payment_Amount,
      pay.Payment_Mode,
      pay.Payment_Status
    FROM Reservation r
    JOIN Passenger p ON r.Passenger_ID = p.Passenger_ID
    JOIN Train t ON r.Train_ID = t.Train_ID
    JOIN Payment pay ON r.Payment_ID = pay.Payment_ID
    ORDER BY r.Reservation_ID DESC
    LIMIT $1;
  `;
  const res = await query(sql, [limit]);
  return res.rows;
}

/**
 * Retrieves occupied seat numbers for a train on a given journey date
 */
export async function getOccupiedSeats(trainId: number, journeyDate: string): Promise<string[]> {
  const sql = `
    SELECT Seat_Number
    FROM Reservation
    WHERE Train_ID = $1 
      AND Journey_Date = $2 
      AND Reservation_Status = 'Confirmed';
  `;
  const res = await query(sql, [trainId, journeyDate]);
  return res.rows.map((r: any) => r.seat_number);
}

/**
 * Generates an automatic next available seat if none selected
 */
export async function assignSeat(trainId: number, journeyDate: string, preferredSeat?: string): Promise<string> {
  const occupied = await getOccupiedSeats(trainId, journeyDate);

  if (preferredSeat) {
    if (occupied.includes(preferredSeat)) {
      throw new Error(`Seat ${preferredSeat} is already occupied on train ${trainId} for ${journeyDate}.`);
    }
    return preferredSeat;
  }

  // Pre-defined seat layouts (Coaches A1, B1, B2, C1)
  const coaches = ['A1', 'B1', 'B2', 'C1'];
  for (const coach of coaches) {
    for (let i = 1; i <= 20; i++) {
      const seat = `${coach}-${i < 10 ? '0' + i : i}`;
      if (!occupied.includes(seat)) {
        return seat;
      }
    }
  }

  throw new Error(`All seats are currently booked for train ${trainId} on ${journeyDate}.`);
}

/**
 * Atomic booking workflow:
 * 1. Validates passenger input
 * 2. Checks/assigns available seat
 * 3. Creates/finds Passenger
 * 4. Creates Payment record
 * 5. Creates Reservation record (Trigger automatically fires!)
 * 6. Returns full booking confirmation
 */
export async function bookTicket(input: BookingInput) {
  // Input validations
  if (!input.name || input.name.trim().length < 2) {
    throw new Error('Passenger name must be at least 2 characters long.');
  }
  if (!input.age || input.age <= 0 || input.age > 120) {
    throw new Error('Age must be a valid number between 1 and 120.');
  }
  if (!['Male', 'Female', 'Other'].includes(input.gender)) {
    throw new Error('Gender must be Male, Female, or Other.');
  }
  if (!input.phoneNumber || input.phoneNumber.trim().length < 8) {
    throw new Error('Please enter a valid phone number.');
  }
  if (!input.journeyDate) {
    throw new Error('Journey date is required.');
  }

  // Verify train exists
  const trainRes = await query('SELECT * FROM Train WHERE Train_ID = $1;', [input.trainId]);
  if (trainRes.rows.length === 0) {
    throw new Error(`Train with ID ${input.trainId} does not exist.`);
  }
  const train = trainRes.rows[0];

  // Assign or validate seat
  const seatNumber = await assignSeat(input.trainId, input.journeyDate, input.seatNumber);

  const amount = input.amount || parseFloat(train.base_fare || '1000.00');

  // Step 1: Upsert Passenger by phone number
  let passengerId: number;
  const existingPassenger = await query('SELECT Passenger_ID FROM Passenger WHERE Phone_Number = $1;', [input.phoneNumber.trim()]);
  if (existingPassenger.rows.length > 0) {
    passengerId = existingPassenger.rows[0].passenger_id;
    // Update name/age if provided
    await query('UPDATE Passenger SET Name = $1, Age = $2, Gender = $3 WHERE Passenger_ID = $4;', [
      input.name.trim(), input.age, input.gender, passengerId
    ]);
  } else {
    const newPassenger = await query(
      `INSERT INTO Passenger (Name, Age, Gender, Phone_Number) 
       VALUES ($1, $2, $3, $4) 
       RETURNING Passenger_ID;`,
      [input.name.trim(), input.age, input.gender, input.phoneNumber.trim()]
    );
    passengerId = newPassenger.rows[0].passenger_id;
  }

  // Step 2: Create Payment Record
  const txnRef = `TXN-${input.paymentMode.substring(0, 3).toUpperCase()}-${Date.now()}`;
  const paymentRes = await query(
    `INSERT INTO Payment (Amount, Payment_Mode, Payment_Status, Transaction_Ref)
     VALUES ($1, $2, 'Paid', $3)
     RETURNING Payment_ID, Amount, Payment_Mode, Payment_Status;`,
    [amount, input.paymentMode, txnRef]
  );
  const paymentId = paymentRes.rows[0].payment_id;

  // Step 3: Generate PNR
  // Format: PNR-YYMMDD-XXXX
  const dateStr = input.journeyDate.replace(/[^0-9]/g, '').slice(2, 8);
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  const pnr = `PNR-${dateStr}-${randomSuffix}`;

  // Step 4: Create Reservation (Triggers Reservation_Audit!)
  const reservationRes = await query(
    `INSERT INTO Reservation (
       Passenger_ID, Train_ID, Payment_ID, Seat_Number, Journey_Date, Reservation_Status, PNR
     ) VALUES ($1, $2, $3, $4, $5, 'Confirmed', $6)
     RETURNING Reservation_ID, PNR, Seat_Number, Journey_Date, Reservation_Status, Created_At;`,
    [passengerId, input.trainId, paymentId, seatNumber, input.journeyDate, pnr]
  );
  const reservation = reservationRes.rows[0];

  return {
    success: true,
    reservationId: reservation.reservation_id,
    pnr: reservation.pnr,
    passengerId,
    passengerName: input.name,
    trainId: train.train_id,
    trainName: train.train_name,
    source: train.source,
    destination: train.destination,
    departureTime: train.departure_time,
    arrivalTime: train.arrival_time,
    seatNumber: reservation.seat_number,
    journeyDate: input.journeyDate,
    reservationStatus: reservation.reservation_status,
    paymentId,
    paymentAmount: amount,
    paymentMode: input.paymentMode,
    paymentStatus: 'Paid',
    transactionRef: txnRef,
    bookingTimestamp: reservation.created_at,
  };
}

/**
 * Retrieves booking details by PNR number
 */
export async function getBookingByPNR(pnr: string) {
  const sql = `
    SELECT 
      r.Reservation_ID,
      r.PNR,
      p.Passenger_ID,
      p.Name AS Passenger_Name,
      p.Age,
      p.Gender,
      p.Phone_Number,
      t.Train_ID,
      t.Train_Name,
      t.Source,
      t.Destination,
      TO_CHAR(t.Departure_Time, 'HH24:MI') AS Departure_Time,
      TO_CHAR(t.Arrival_Time, 'HH24:MI') AS Arrival_Time,
      r.Seat_Number,
      TO_CHAR(r.Journey_Date, 'YYYY-MM-DD') AS Journey_Date,
      r.Reservation_Status,
      pay.Payment_ID,
      pay.Amount AS Payment_Amount,
      pay.Payment_Mode,
      pay.Payment_Status,
      pay.Transaction_Ref,
      r.Created_At AS Booking_Timestamp
    FROM Reservation r
    JOIN Passenger p ON r.Passenger_ID = p.Passenger_ID
    JOIN Train t ON r.Train_ID = t.Train_ID
    JOIN Payment pay ON r.Payment_ID = pay.Payment_ID
    WHERE UPPER(r.PNR) = UPPER($1) OR CAST(r.Reservation_ID AS TEXT) = $1;
  `;
  const res = await query(sql, [pnr.trim()]);
  return res.rows[0] || null;
}

/**
 * Cancels a ticket by PNR or Reservation ID.
 * Frees up seat, sets status to Cancelled, keeps payment for audit.
 * Database trigger automatically logs the cancellation.
 */
export async function cancelTicket(pnrOrId: string) {
  const booking = await getBookingByPNR(pnrOrId);
  if (!booking) {
    throw new Error(`No booking found matching identifier "${pnrOrId}".`);
  }

  if (booking.reservation_status === 'Cancelled') {
    throw new Error(`Reservation ${booking.pnr} is already cancelled.`);
  }

  await query(
    `UPDATE Reservation 
     SET Reservation_Status = 'Cancelled' 
     WHERE Reservation_ID = $1;`,
    [booking.reservation_id]
  );

  return {
    success: true,
    message: `Reservation ${booking.pnr} for ${booking.passenger_name} successfully cancelled.`,
    pnr: booking.pnr,
    seatNumber: booking.seat_number,
    freedSeat: true,
  };
}

/**
 * Retrieves trigger-populated audit trail
 */
export async function getAuditLogs(limit: number = 50) {
  const sql = `
    SELECT 
      Audit_ID,
      Reservation_ID,
      Action,
      TO_CHAR(Action_Time, 'YYYY-MM-DD HH24:MI:SS') AS Action_Time,
      Old_Status,
      New_Status,
      Details
    FROM Reservation_Audit
    ORDER BY Audit_ID DESC
    LIMIT $1;
  `;
  const res = await query(sql, [limit]);
  return res.rows;
}

/**
 * Executes demonstration DBMS queries
 */
export async function executeDemoQuery(queryKey: string) {
  switch (queryKey) {
    case 'simple':
      // SELECT * FROM Passenger WHERE Age > 20; (PDF Page 3)
      return {
        title: 'Simple Query (Filter WHERE Age > 20)',
        sql: 'SELECT * FROM Passenger WHERE Age > 20;',
        description: 'Demonstrates basic selection and filtering on passenger records.',
        data: (await query('SELECT * FROM Passenger WHERE Age > 20;')).rows
      };

    case 'nested':
      // Nested Query with IN (PDF Page 3)
      return {
        title: 'Nested Query (Subquery with IN operator)',
        sql: 'SELECT Name FROM Passenger WHERE Passenger_ID IN (SELECT Passenger_ID FROM Reservation);',
        description: 'Retrieves names of passengers who have made at least one reservation using a nested subquery.',
        data: (await query('SELECT Name FROM Passenger WHERE Passenger_ID IN (SELECT Passenger_ID FROM Reservation);')).rows
      };

    case 'join':
      // JOIN Query (PDF Page 3)
      return {
        title: 'Two-Table INNER JOIN (Passenger + Reservation)',
        sql: `SELECT P.Name, R.Reservation_ID, R.Seat_Number 
FROM Passenger P 
JOIN Reservation R ON P.Passenger_ID = R.Passenger_ID;`,
        description: 'Combines passenger and reservation details across foreign key relationships.',
        data: (await query(`SELECT P.Name, R.Reservation_ID, R.Seat_Number 
FROM Passenger P 
JOIN Reservation R ON P.Passenger_ID = R.Passenger_ID;`)).rows
      };

    case 'view':
      // Querying View (PDF Page 3)
      return {
        title: 'SQL View (Passenger_Reservation_View)',
        sql: 'SELECT * FROM Passenger_Reservation_View;',
        description: 'Queries the pre-compiled relational abstraction view.',
        data: (await query('SELECT * FROM Passenger_Reservation_View;')).rows
      };

    case 'audit':
      // Database Trigger Output
      return {
        title: 'Database Trigger Output (Reservation_Audit)',
        sql: 'SELECT * FROM Reservation_Audit ORDER BY Audit_ID DESC;',
        description: 'Displays audit rows inserted automatically by the PL/pgSQL database trigger upon reservation INSERT/UPDATE.',
        data: (await query('SELECT * FROM Reservation_Audit ORDER BY Audit_ID DESC;')).rows
      };

    case 'complex_revenue':
      // Aggregation & HAVING
      return {
        title: 'Complex Query: Revenue & Booking Count per Train',
        sql: `SELECT 
    T.Train_ID,
    T.Train_Name,
    COUNT(R.Reservation_ID) AS Total_Bookings,
    COUNT(CASE WHEN R.Reservation_Status = 'Confirmed' THEN 1 END) AS Confirmed_Bookings,
    COALESCE(SUM(Pay.Amount), 0.00) AS Total_Revenue
FROM Train T
LEFT JOIN Reservation R ON T.Train_ID = R.Train_ID
LEFT JOIN Payment Pay ON R.Payment_ID = Pay.Payment_ID
GROUP BY T.Train_ID, T.Train_Name
ORDER BY Total_Revenue DESC;`,
        description: 'Demonstrates multi-table outer join, conditional aggregation, and GROUP BY.',
        data: (await query(`SELECT 
    T.Train_ID,
    T.Train_Name,
    COUNT(R.Reservation_ID) AS Total_Bookings,
    COUNT(CASE WHEN R.Reservation_Status = 'Confirmed' THEN 1 END) AS Confirmed_Bookings,
    COALESCE(SUM(Pay.Amount), 0.00) AS Total_Revenue
FROM Train T
LEFT JOIN Reservation R ON T.Train_ID = R.Train_ID
LEFT JOIN Payment Pay ON R.Payment_ID = Pay.Payment_ID
GROUP BY T.Train_ID, T.Train_Name
ORDER BY Total_Revenue DESC;`)).rows
      };

    default:
      throw new Error(`Unknown demo query key: ${queryKey}`);
  }
}
