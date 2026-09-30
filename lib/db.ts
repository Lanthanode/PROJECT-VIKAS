import { PGlite } from '@electric-sql/pglite';
import { Pool } from 'pg';
import path from 'path';
import fs from 'fs';

// Database instance singleton
let pgliteInstance: PGlite | null = null;
let pgPoolInstance: Pool | null = null;
let isInitialized = false;

const DB_PATH = path.join(process.cwd(), 'data', 'railway_db');

/**
 * Initializes and returns the active PostgreSQL database instance.
 * Prefers DATABASE_URL if configured, otherwise falls back to persistent PGlite PostgreSQL.
 */
export async function getDb() {
  if (process.env.DATABASE_URL) {
    if (!pgPoolInstance) {
      console.log('[Database] Connecting to remote PostgreSQL via DATABASE_URL...');
      pgPoolInstance = new Pool({
        connectionString: process.env.DATABASE_URL,
        ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : undefined,
      });
    }
    return {
      type: 'pool' as const,
      query: async (text: string, params?: any[]) => {
        const res = await pgPoolInstance!.query(text, params);
        return { rows: res.rows, rowCount: res.rowCount };
      },
      exec: async (text: string) => {
        await pgPoolInstance!.query(text);
      }
    };
  }

  // Use embedded PGlite PostgreSQL engine
  if (!pgliteInstance) {
    // Ensure data and DB directory exists recursively
    if (!fs.existsSync(DB_PATH)) {
      fs.mkdirSync(DB_PATH, { recursive: true });
    }

    console.log(`[Database] Initializing embedded PostgreSQL PGlite at ${DB_PATH}...`);
    pgliteInstance = new PGlite(DB_PATH);
  }

  return {
    type: 'pglite' as const,
    query: async (text: string, params?: any[]) => {
      const res = await pgliteInstance!.query(text, params);
      return { rows: res.rows, rowCount: res.rows.length };
    },
    exec: async (text: string) => {
      await pgliteInstance!.exec(text);
    }
  };
}

/**
 * Executes a query with error boundary logging
 */
export async function query(text: string, params?: any[]) {
  const db = await getDb();
  await ensureSchema();
  try {
    return await db.query(text, params);
  } catch (error: any) {
    console.error('[Database Error]', {
      query: text.replace(/\s+/g, ' ').trim(),
      params,
      message: error?.message,
    });
    throw error;
  }
}

/**
 * Ensures schema, views, triggers, and seed data exist.
 */
export async function ensureSchema() {
  if (isInitialized) return;

  const db = await getDb();
  try {
    // Check if Passenger table already exists
    const check = await db.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_name = 'passenger' OR table_name = 'Passenger';
    `);

    if (check.rows.length === 0) {
      console.log('[Database] Schema not detected. Applying DDL, Views, Triggers, and Seed data...');
      await applyDdlAndSeed();
    }
    isInitialized = true;
  } catch (err: any) {
    console.log('[Database] Schema check caught error, attempting migration:', err.message);
    await applyDdlAndSeed();
    isInitialized = true;
  }
}

/**
 * Runs the complete schema creation and sample seed scripts
 */
export async function applyDdlAndSeed() {
  const db = await getDb();

  // 1. DDL Schema
  const schemaSql = `
    CREATE TABLE IF NOT EXISTS Passenger (
      Passenger_ID SERIAL PRIMARY KEY,
      Name VARCHAR(100) NOT NULL,
      Age INT NOT NULL CHECK (Age > 0 AND Age <= 120),
      Gender VARCHAR(10) NOT NULL CHECK (Gender IN ('Male', 'Female', 'Other')),
      Phone_Number VARCHAR(20) NOT NULL UNIQUE,
      Created_At TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS Train (
      Train_ID INT PRIMARY KEY,
      Train_Name VARCHAR(100) NOT NULL,
      Source VARCHAR(100) NOT NULL,
      Destination VARCHAR(100) NOT NULL,
      Departure_Time TIME NOT NULL,
      Arrival_Time TIME NOT NULL,
      Total_Seats INT NOT NULL DEFAULT 60 CHECK (Total_Seats > 0),
      Base_Fare DECIMAL(10, 2) NOT NULL DEFAULT 500.00 CHECK (Base_Fare >= 0),
      Created_At TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      CONSTRAINT check_source_dest_different CHECK (Source <> Destination)
    );

    CREATE TABLE IF NOT EXISTS Station (
      Station_ID INT PRIMARY KEY,
      Station_Name VARCHAR(100) NOT NULL,
      Location VARCHAR(100) NOT NULL,
      Station_Code VARCHAR(10) NOT NULL UNIQUE,
      Created_At TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS Payment (
      Payment_ID SERIAL PRIMARY KEY,
      Amount DECIMAL(10, 2) NOT NULL CHECK (Amount >= 0),
      Payment_Mode VARCHAR(50) NOT NULL CHECK (Payment_Mode IN ('UPI', 'Card', 'Net Banking', 'Cash')),
      Payment_Status VARCHAR(50) NOT NULL DEFAULT 'Paid' CHECK (Payment_Status IN ('Paid', 'Pending', 'Refunded', 'Failed')),
      Transaction_Ref VARCHAR(100) UNIQUE,
      Payment_Date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS Reservation (
      Reservation_ID SERIAL PRIMARY KEY,
      Passenger_ID INT NOT NULL REFERENCES Passenger(Passenger_ID) ON DELETE CASCADE,
      Train_ID INT NOT NULL REFERENCES Train(Train_ID) ON DELETE RESTRICT,
      Payment_ID INT NOT NULL REFERENCES Payment(Payment_ID) ON DELETE RESTRICT,
      Seat_Number VARCHAR(20) NOT NULL,
      Journey_Date DATE NOT NULL,
      Reservation_Status VARCHAR(20) NOT NULL DEFAULT 'Confirmed' CHECK (Reservation_Status IN ('Confirmed', 'Cancelled', 'Pending')),
      PNR VARCHAR(30) NOT NULL UNIQUE,
      Created_At TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      CONSTRAINT unique_train_journey_seat UNIQUE (Train_ID, Journey_Date, Seat_Number)
    );

    CREATE TABLE IF NOT EXISTS Train_Station (
      Train_ID INT NOT NULL REFERENCES Train(Train_ID) ON DELETE CASCADE,
      Station_ID INT NOT NULL REFERENCES Station(Station_ID) ON DELETE CASCADE,
      Stop_Sequence INT NOT NULL DEFAULT 1 CHECK (Stop_Sequence > 0),
      Halt_Minutes INT NOT NULL DEFAULT 5 CHECK (Halt_Minutes >= 0),
      Distance_KM INT NOT NULL DEFAULT 0 CHECK (Distance_KM >= 0),
      PRIMARY KEY (Train_ID, Station_ID)
    );

    CREATE TABLE IF NOT EXISTS Reservation_Audit (
      Audit_ID SERIAL PRIMARY KEY,
      Reservation_ID INT NOT NULL,
      Action VARCHAR(50) NOT NULL,
      Action_Time TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      Old_Status VARCHAR(50),
      New_Status VARCHAR(50),
      Details TEXT
    );
  `;
  await db.exec(schemaSql);

  // 2. Triggers & Stored Procedure
  const triggerSql = `
    CREATE OR REPLACE FUNCTION trg_fn_reservation_audit()
    RETURNS TRIGGER AS $$
    BEGIN
        IF (TG_OP = 'INSERT') THEN
            INSERT INTO Reservation_Audit (
                Reservation_ID, Action, Old_Status, New_Status, Details
            ) VALUES (
                NEW.Reservation_ID,
                'RESERVATION_CREATED',
                NULL,
                NEW.Reservation_Status,
                'Passenger ' || NEW.Passenger_ID || ' booked Train ' || NEW.Train_ID || 
                ' for ' || TO_CHAR(NEW.Journey_Date, 'YYYY-MM-DD') || ' with Seat ' || NEW.Seat_Number || 
                ' [PNR: ' || NEW.PNR || ']'
            );
            RETURN NEW;
        ELSIF (TG_OP = 'UPDATE') THEN
            INSERT INTO Reservation_Audit (
                Reservation_ID, Action, Old_Status, New_Status, Details
            ) VALUES (
                NEW.Reservation_ID,
                CASE 
                    WHEN NEW.Reservation_Status = 'Cancelled' THEN 'RESERVATION_CANCELLED'
                    ELSE 'RESERVATION_UPDATED'
                END,
                OLD.Reservation_Status,
                NEW.Reservation_Status,
                'Status changed from ' || OLD.Reservation_Status || ' to ' || NEW.Reservation_Status || ' for Seat ' || NEW.Seat_Number
            );
            RETURN NEW;
        ELSIF (TG_OP = 'DELETE') THEN
            INSERT INTO Reservation_Audit (
                Reservation_ID, Action, Old_Status, New_Status, Details
            ) VALUES (
                OLD.Reservation_ID,
                'RESERVATION_DELETED',
                OLD.Reservation_Status,
                'DELETED',
                'Reservation ID ' || OLD.Reservation_ID || ' [PNR: ' || OLD.PNR || '] was deleted.'
            );
            RETURN OLD;
        END IF;
        RETURN NULL;
    END;
    $$ LANGUAGE plpgsql;

    DROP TRIGGER IF EXISTS trg_reservation_audit ON Reservation;

    CREATE TRIGGER trg_reservation_audit
    AFTER INSERT OR UPDATE OR DELETE ON Reservation
    FOR EACH ROW
    EXECUTE FUNCTION trg_fn_reservation_audit();
  `;
  await db.exec(triggerSql);

  // 3. Views
  const viewsSql = `
    CREATE OR REPLACE VIEW Passenger_Reservation_View AS
    SELECT 
        P.Name AS Passenger_Name,
        P.Age,
        P.Gender,
        P.Phone_Number,
        R.Reservation_ID,
        R.PNR,
        R.Seat_Number,
        R.Journey_Date,
        R.Reservation_Status
    FROM Passenger P
    JOIN Reservation R ON P.Passenger_ID = R.Passenger_ID;

    CREATE OR REPLACE VIEW Confirmed_Bookings_View AS
    SELECT 
        R.Reservation_ID,
        R.PNR,
        P.Passenger_ID,
        P.Name AS Passenger_Name,
        P.Phone_Number,
        T.Train_ID,
        T.Train_Name,
        T.Source,
        T.Destination,
        T.Departure_Time,
        T.Arrival_Time,
        R.Seat_Number,
        R.Journey_Date,
        R.Reservation_Status,
        Pay.Payment_ID,
        Pay.Amount AS Payment_Amount,
        Pay.Payment_Mode,
        Pay.Payment_Status,
        R.Created_At AS Booking_Timestamp
    FROM Reservation R
    JOIN Passenger P ON R.Passenger_ID = P.Passenger_ID
    JOIN Train T ON R.Train_ID = T.Train_ID
    JOIN Payment Pay ON R.Payment_ID = Pay.Payment_ID;

    CREATE OR REPLACE VIEW Train_Reservation_Summary_View AS
    SELECT 
        T.Train_ID,
        T.Train_Name,
        T.Source,
        T.Destination,
        T.Total_Seats,
        COUNT(R.Reservation_ID) AS Total_Bookings,
        COUNT(CASE WHEN R.Reservation_Status = 'Confirmed' THEN 1 END) AS Confirmed_Bookings,
        COUNT(CASE WHEN R.Reservation_Status = 'Cancelled' THEN 1 END) AS Cancelled_Bookings,
        COALESCE(SUM(CASE WHEN R.Reservation_Status = 'Confirmed' THEN Pay.Amount ELSE 0 END), 0.00) AS Total_Revenue
    FROM Train T
    LEFT JOIN Reservation R ON T.Train_ID = R.Train_ID
    LEFT JOIN Payment Pay ON R.Payment_ID = Pay.Payment_ID
    GROUP BY T.Train_ID, T.Train_Name, T.Source, T.Destination, T.Total_Seats;
  `;
  await db.exec(viewsSql);

  // 4. Seed Data (Only if empty)
  const passCount = await db.query('SELECT COUNT(*) as count FROM Passenger;');
  if (parseInt(passCount.rows[0].count) === 0) {
    const seedSql = `
      INSERT INTO Passenger (Passenger_ID, Name, Age, Gender, Phone_Number) VALUES
      (101, 'Rahul Sharma', 21, 'Male', '9876543210'),
      (102, 'Neerav Joshi', 28, 'Male', '9811223344'),
      (103, 'Priya Mehta', 24, 'Female', '9822334455'),
      (104, 'Aman Verma', 30, 'Male', '9833445566'),
      (105, 'Muskaan Khoja', 22, 'Female', '9844556677'),
      (106, 'Vedant', 26, 'Male', '9855667788');

      INSERT INTO Train (Train_ID, Train_Name, Source, Destination, Departure_Time, Arrival_Time, Total_Seats, Base_Fare) VALUES
      (1001, 'Rajdhani Express', 'Delhi', 'Mumbai', '16:30:00', '08:00:00', 60, 1500.00),
      (1002, 'Shatabdi Express', 'Delhi', 'Chandigarh', '07:40:00', '11:00:00', 60, 1200.00),
      (1003, 'Duronto Express', 'Mumbai', 'Pune', '06:00:00', '09:30:00', 60, 900.00),
      (1004, 'Vande Bharat Express', 'Delhi', 'Varanasi', '06:00:00', '14:00:00', 60, 1750.00),
      (1005, 'Tejas Express', 'Mumbai', 'Ahmedabad', '15:30:00', '21:55:00', 60, 1350.00);

      INSERT INTO Station (Station_ID, Station_Name, Location, Station_Code) VALUES
      (201, 'New Delhi', 'Delhi', 'NDLS'),
      (202, 'Mumbai Central', 'Mumbai', 'BCT'),
      (203, 'Chandigarh', 'Chandigarh', 'CDG'),
      (204, 'Pune Junction', 'Pune', 'PUNE'),
      (205, 'Varanasi Cantt', 'Varanasi', 'BSB'),
      (206, 'Ahmedabad Junction', 'Ahmedabad', 'ADI');

      INSERT INTO Train_Station (Train_ID, Station_ID, Stop_Sequence, Halt_Minutes, Distance_KM) VALUES
      (1001, 201, 1, 0, 0),
      (1001, 202, 2, 0, 1384),
      (1002, 201, 1, 0, 0),
      (1002, 203, 2, 0, 244),
      (1003, 202, 1, 0, 0),
      (1003, 204, 2, 0, 192),
      (1004, 201, 1, 0, 0),
      (1004, 205, 2, 0, 755),
      (1005, 202, 1, 0, 0),
      (1005, 206, 2, 0, 492);

      INSERT INTO Payment (Payment_ID, Amount, Payment_Mode, Payment_Status, Transaction_Ref) VALUES
      (301, 1500.00, 'UPI', 'Paid', 'TXN-UPI-20260915-001'),
      (302, 1000.00, 'Card', 'Paid', 'TXN-CRD-20260915-002'),
      (303, 1200.00, 'Card', 'Paid', 'TXN-CRD-20260918-003'),
      (304, 900.00, 'UPI', 'Paid', 'TXN-UPI-20260920-004'),
      (305, 1000.00, 'Net Banking', 'Paid', 'TXN-NB-20260930-005'),
      (306, 1000.00, 'Card', 'Paid', 'TXN-CRD-20261127-006'),
      (307, 1750.00, 'UPI', 'Paid', 'TXN-UPI-20261001-007');

      INSERT INTO Reservation (Reservation_ID, Passenger_ID, Train_ID, Payment_ID, Seat_Number, Journey_Date, Reservation_Status, PNR) VALUES
      (401, 101, 1001, 301, 'A1-10', '2026-09-15', 'Confirmed', 'PNR-260915-401'),
      (402, 102, 1001, 302, 'B1-04', '2026-09-15', 'Confirmed', 'PNR-260915-402'),
      (403, 103, 1002, 303, 'B2-15', '2026-09-18', 'Confirmed', 'PNR-260918-403'),
      (404, 104, 1003, 304, 'C1-08', '2026-09-20', 'Confirmed', 'PNR-260920-404'),
      (405, 105, 1002, 305, 'A2-05', '2026-09-30', 'Confirmed', 'PNR-260930-405'),
      (406, 106, 1003, 306, 'C1-12', '2026-11-27', 'Confirmed', 'PNR-261127-406');
    `;
    await db.exec(seedSql);
    console.log('[Database] Seed records successfully inserted!');
  }
}
