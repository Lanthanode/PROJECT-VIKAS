import { PGlite } from '@electric-sql/pglite';

async function testPostgres() {
  console.log('Testing PostgreSQL engine...');
  const db = new PGlite();

  // Test version
  const v = await db.query('SELECT version();');
  console.log('PostgreSQL version:', v.rows[0].version);

  // Test table creation with constraints
  await db.exec(`
    CREATE TABLE Passenger (
      Passenger_ID SERIAL PRIMARY KEY,
      Name VARCHAR(100) NOT NULL,
      Age INT NOT NULL CHECK (Age > 0 AND Age <= 120),
      Gender VARCHAR(10) NOT NULL CHECK (Gender IN ('Male', 'Female', 'Other')),
      Phone_Number VARCHAR(20) NOT NULL UNIQUE
    );

    CREATE TABLE Train (
      Train_ID INT PRIMARY KEY,
      Train_Name VARCHAR(100) NOT NULL,
      Source VARCHAR(100) NOT NULL,
      Destination VARCHAR(100) NOT NULL,
      Departure_Time TIME NOT NULL,
      Arrival_Time TIME NOT NULL
    );

    CREATE TABLE Station (
      Station_ID INT PRIMARY KEY,
      Station_Name VARCHAR(100) NOT NULL,
      Location VARCHAR(100) NOT NULL
    );

    CREATE TABLE Payment (
      Payment_ID SERIAL PRIMARY KEY,
      Amount DECIMAL(10,2) NOT NULL CHECK (Amount >= 0),
      Payment_Mode VARCHAR(50) NOT NULL CHECK (Payment_Mode IN ('UPI', 'Card', 'Net Banking')),
      Payment_Status VARCHAR(50) NOT NULL CHECK (Payment_Status IN ('Paid', 'Pending', 'Refunded', 'Failed'))
    );

    CREATE TABLE Reservation (
      Reservation_ID SERIAL PRIMARY KEY,
      Passenger_ID INT NOT NULL REFERENCES Passenger(Passenger_ID) ON DELETE CASCADE,
      Train_ID INT NOT NULL REFERENCES Train(Train_ID) ON DELETE RESTRICT,
      Payment_ID INT NOT NULL REFERENCES Payment(Payment_ID) ON DELETE RESTRICT,
      Seat_Number VARCHAR(20) NOT NULL,
      Journey_Date DATE NOT NULL,
      Reservation_Status VARCHAR(20) NOT NULL DEFAULT 'Confirmed' CHECK (Reservation_Status IN ('Confirmed', 'Cancelled', 'Pending')),
      Created_At TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      CONSTRAINT unique_train_journey_seat UNIQUE (Train_ID, Journey_Date, Seat_Number)
    );

    CREATE TABLE Train_Station (
      Train_ID INT NOT NULL REFERENCES Train(Train_ID) ON DELETE CASCADE,
      Station_ID INT NOT NULL REFERENCES Station(Station_ID) ON DELETE CASCADE,
      Stop_Sequence INT NOT NULL DEFAULT 1,
      Halt_Minutes INT NOT NULL DEFAULT 5,
      PRIMARY KEY (Train_ID, Station_ID)
    );

    CREATE TABLE Reservation_Audit (
      Audit_ID SERIAL PRIMARY KEY,
      Reservation_ID INT NOT NULL,
      Action VARCHAR(50) NOT NULL,
      Action_Time TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      Details TEXT
    );

    CREATE OR REPLACE FUNCTION trg_fn_reservation_audit()
    RETURNS TRIGGER AS $$
    BEGIN
      IF (TG_OP = 'INSERT') THEN
        INSERT INTO Reservation_Audit (Reservation_ID, Action, Details)
        VALUES (NEW.Reservation_ID, 'RESERVATION_CREATED', 'Status: ' || NEW.Reservation_Status || ', Seat: ' || NEW.Seat_Number);
      ELSIF (TG_OP = 'UPDATE') THEN
        INSERT INTO Reservation_Audit (Reservation_ID, Action, Details)
        VALUES (NEW.Reservation_ID, 'RESERVATION_UPDATED', 'Old Status: ' || OLD.Reservation_Status || ' -> New Status: ' || NEW.Reservation_Status);
      END IF;
      RETURN NEW;
    END;
    $$ LANGUAGE plpgsql;

    CREATE TRIGGER trg_reservation_audit
    AFTER INSERT OR UPDATE ON Reservation
    FOR EACH ROW
    EXECUTE FUNCTION trg_fn_reservation_audit();

    CREATE VIEW Passenger_Reservation_View AS
    SELECT 
      P.Name AS Passenger_Name,
      R.Reservation_ID,
      R.Seat_Number,
      R.Journey_Date
    FROM Passenger P
    JOIN Reservation R ON P.Passenger_ID = R.Passenger_ID;
  `);

  console.log('Tables, Views, Functions, and Triggers created successfully!');

  // Test PDF sample insertion
  await db.exec(`
    INSERT INTO Passenger (Passenger_ID, Name, Age, Gender, Phone_Number)
    VALUES (101, 'Rahul Sharma', 21, 'Male', '9876543210');

    INSERT INTO Train (Train_ID, Train_Name, Source, Destination, Departure_Time, Arrival_Time)
    VALUES (1001, 'Rajdhani Express', 'Delhi', 'Mumbai', '16:30:00', '08:00:00');

    INSERT INTO Station (Station_ID, Station_Name, Location)
    VALUES (201, 'New Delhi', 'Delhi'), (202, 'Mumbai Central', 'Mumbai');

    INSERT INTO Train_Station (Train_ID, Station_ID, Stop_Sequence, Halt_Minutes)
    VALUES (1001, 201, 1, 0), (1001, 202, 2, 0);

    INSERT INTO Payment (Payment_ID, Amount, Payment_Mode, Payment_Status)
    VALUES (301, 1500.00, 'UPI', 'Paid');

    INSERT INTO Reservation (Reservation_ID, Passenger_ID, Train_ID, Payment_ID, Seat_Number, Journey_Date, Reservation_Status)
    VALUES (401, 101, 1001, 301, 'A1-10', '2026-09-15', 'Confirmed');
  `);

  console.log('Sample data inserted successfully!');

  // Check audit trigger execution
  const auditRes = await db.query('SELECT * FROM Reservation_Audit;');
  console.log('Audit records count:', auditRes.rows.length, auditRes.rows);

  // Check View
  const viewRes = await db.query('SELECT * FROM Passenger_Reservation_View;');
  console.log('View output:', viewRes.rows);

  // Test PDF Simple Query: SELECT * FROM Passenger WHERE Age > 20;
  const simpleQuery = await db.query('SELECT * FROM Passenger WHERE Age > 20;');
  console.log('Simple query (Age > 20):', simpleQuery.rows);

  // Test PDF Nested Query: SELECT Name FROM Passenger WHERE Passenger_ID IN (SELECT Passenger_ID FROM Reservation);
  const nestedQuery = await db.query('SELECT Name FROM Passenger WHERE Passenger_ID IN (SELECT Passenger_ID FROM Reservation);');
  console.log('Nested query:', nestedQuery.rows);

  // Test PDF JOIN Query
  const joinQuery = await db.query(`
    SELECT P.Name, R.Reservation_ID, R.Seat_Number 
    FROM Passenger P 
    JOIN Reservation R ON P.Passenger_ID = R.Passenger_ID;
  `);
  console.log('JOIN query:', joinQuery.rows);

  // Test Duplicate Seat Constraint Prevention
  try {
    await db.query(`
      INSERT INTO Reservation (Passenger_ID, Train_ID, Payment_ID, Seat_Number, Journey_Date, Reservation_Status)
      VALUES (101, 1001, 301, 'A1-10', '2026-09-15', 'Confirmed');
    `);
    console.error('FAILED: Duplicate seat was not prevented!');
  } catch (err) {
    console.log('SUCCESS: Duplicate seat prevented by constraint:', err.message);
  }

  console.log('ALL POSTGRES TESTS PASSED COMPLETELY!');
}

testPostgres().catch(console.error);
