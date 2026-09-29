-- ============================================================================
-- RAILWAY MANAGEMENT SYSTEM - SEED DATA (DML)
-- Capstone Project: Indian Railways Passenger Reservation
-- Target RDBMS: PostgreSQL
-- ============================================================================

-- Clean existing data
TRUNCATE TABLE Reservation_Audit RESTART IDENTITY CASCADE;
TRUNCATE TABLE Train_Station CASCADE;
TRUNCATE TABLE Reservation RESTART IDENTITY CASCADE;
TRUNCATE TABLE Payment RESTART IDENTITY CASCADE;
TRUNCATE TABLE Station CASCADE;
TRUNCATE TABLE Train CASCADE;
TRUNCATE TABLE Passenger RESTART IDENTITY CASCADE;

-- ----------------------------------------------------------------------------
-- 1. INSERT PASSENGERS
-- Preserving Rahul Sharma (ID 101) exactly as defined in PDF Page 3.
-- Plus additional realistic passengers from PDF UI screenshots (Pages 6-8).
-- ----------------------------------------------------------------------------
INSERT INTO Passenger (Passenger_ID, Name, Age, Gender, Phone_Number) VALUES
(101, 'Rahul Sharma', 21, 'Male', '9876543210'),
(102, 'Neerav Joshi', 28, 'Male', '9811223344'),
(103, 'Priya Mehta', 24, 'Female', '9822334455'),
(104, 'Aman Verma', 30, 'Male', '9833445566'),
(105, 'Muskaan Khoja', 22, 'Female', '9844556677'),
(106, 'Vedant', 26, 'Male', '9855667788');

-- Set passenger sequence to max id + 1
SELECT setval(pg_get_serial_sequence('Passenger', 'passenger_id'), 107, true);

-- ----------------------------------------------------------------------------
-- 2. INSERT TRAINS
-- Preserving Rajdhani Express (ID 1001) exactly as defined in PDF Page 3.
-- Plus additional trains shown in PDF Page 6 (Shatabdi, Duronto).
-- ----------------------------------------------------------------------------
INSERT INTO Train (Train_ID, Train_Name, Source, Destination, Departure_Time, Arrival_Time, Total_Seats, Base_Fare) VALUES
(1001, 'Rajdhani Express', 'Delhi', 'Mumbai', '16:30:00', '08:00:00', 60, 1500.00),
(1002, 'Shatabdi Express', 'Delhi', 'Chandigarh', '07:40:00', '11:00:00', 60, 1200.00),
(1003, 'Duronto Express', 'Mumbai', 'Pune', '06:00:00', '09:30:00', 60, 900.00),
(1004, 'Vande Bharat Express', 'Delhi', 'Varanasi', '06:00:00', '14:00:00', 60, 1750.00),
(1005, 'Tejas Express', 'Mumbai', 'Ahmedabad', '15:30:00', '21:55:00', 60, 1350.00);

-- ----------------------------------------------------------------------------
-- 3. INSERT STATIONS
-- Matching PDF Page 7 major stations (New Delhi, Mumbai Central, Chandigarh, Pune Junction).
-- ----------------------------------------------------------------------------
INSERT INTO Station (Station_ID, Station_Name, Location, Station_Code) VALUES
(201, 'New Delhi', 'Delhi', 'NDLS'),
(202, 'Mumbai Central', 'Mumbai', 'BCT'),
(203, 'Chandigarh', 'Chandigarh', 'CDG'),
(204, 'Pune Junction', 'Pune', 'PUNE'),
(205, 'Varanasi Cantt', 'Varanasi', 'BSB'),
(206, 'Ahmedabad Junction', 'Ahmedabad', 'ADI');

-- ----------------------------------------------------------------------------
-- 4. INSERT TRAIN_STATION BRIDGE RELATIONSHIPS
-- Establishes route topologies and stops for each train.
-- ----------------------------------------------------------------------------
INSERT INTO Train_Station (Train_ID, Station_ID, Stop_Sequence, Halt_Minutes, Distance_KM) VALUES
-- Train 1001: Delhi -> Mumbai
(1001, 201, 1, 0, 0),
(1001, 202, 2, 0, 1384),

-- Train 1002: Delhi -> Chandigarh
(1002, 201, 1, 0, 0),
(1002, 203, 2, 0, 244),

-- Train 1003: Mumbai -> Pune
(1003, 202, 1, 0, 0),
(1003, 204, 2, 0, 192),

-- Train 1004: Delhi -> Varanasi
(1004, 201, 1, 0, 0),
(1004, 205, 2, 0, 755),

-- Train 1005: Mumbai -> Ahmedabad
(1005, 202, 1, 0, 0),
(1005, 206, 2, 0, 492);

-- ----------------------------------------------------------------------------
-- 5. INSERT PAYMENTS
-- Preserving Payment ID 301 (₹1500, UPI, Paid) exactly as defined in PDF Page 3.
-- Plus payments corresponding to recent bookings shown in PDF screenshots.
-- ----------------------------------------------------------------------------
INSERT INTO Payment (Payment_ID, Amount, Payment_Mode, Payment_Status, Transaction_Ref) VALUES
(301, 1500.00, 'UPI', 'Paid', 'TXN-UPI-20260915-001'),
(302, 1000.00, 'Card', 'Paid', 'TXN-CRD-20260915-002'),
(303, 1200.00, 'Card', 'Paid', 'TXN-CRD-20260918-003'),
(304, 900.00, 'UPI', 'Paid', 'TXN-UPI-20260920-004'),
(305, 1000.00, 'Net Banking', 'Paid', 'TXN-NB-20260930-005'),
(306, 1000.00, 'Card', 'Paid', 'TXN-CRD-20261127-006'),
(307, 1750.00, 'UPI', 'Paid', 'TXN-UPI-20261001-007');

-- Set payment sequence to max id + 1
SELECT setval(pg_get_serial_sequence('Payment', 'payment_id'), 308, true);

-- ----------------------------------------------------------------------------
-- 6. INSERT RESERVATIONS
-- Preserving Reservation 401 (Rahul Sharma, 1001, 301, Seat A1-10, 15-09-2026, Confirmed)
-- Plus reservations matching the PDF Recent Bookings table (Pages 7 & 8).
-- Note: Trigger trg_reservation_audit will automatically populate Reservation_Audit table!
-- ----------------------------------------------------------------------------
INSERT INTO Reservation (Reservation_ID, Passenger_ID, Train_ID, Payment_ID, Seat_Number, Journey_Date, Reservation_Status, PNR) VALUES
(401, 101, 1001, 301, 'A1-10', '2026-09-15', 'Confirmed', 'PNR-260915-401'),
(402, 102, 1001, 302, 'B1-04', '2026-09-15', 'Confirmed', 'PNR-260915-402'),
(403, 103, 1002, 303, 'B2-15', '2026-09-18', 'Confirmed', 'PNR-260918-403'),
(404, 104, 1003, 304, 'C1-08', '2026-09-20', 'Confirmed', 'PNR-260920-404'),
(405, 105, 1002, 305, 'A2-05', '2026-09-30', 'Confirmed', 'PNR-260930-405'),
(406, 106, 1003, 306, 'C1-12', '2026-11-27', 'Confirmed', 'PNR-261127-406');

-- Set reservation sequence to max id + 1
SELECT setval(pg_get_serial_sequence('Reservation', 'reservation_id'), 407, true);
