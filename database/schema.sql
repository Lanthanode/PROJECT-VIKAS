-- ============================================================================
-- RAILWAY MANAGEMENT SYSTEM - DATABASE SCHEMA (DDL)
-- Capstone Project: Indian Railways Passenger Reservation
-- Target RDBMS: PostgreSQL
-- ============================================================================

-- Drop tables in reverse dependency order if recreating
DROP VIEW IF EXISTS Train_Reservation_Summary_View CASCADE;
DROP VIEW IF EXISTS Confirmed_Bookings_View CASCADE;
DROP VIEW IF EXISTS Passenger_Reservation_View CASCADE;
DROP TABLE IF EXISTS Reservation_Audit CASCADE;
DROP TABLE IF EXISTS Train_Station CASCADE;
DROP TABLE IF EXISTS Reservation CASCADE;
DROP TABLE IF EXISTS Payment CASCADE;
DROP TABLE IF EXISTS Station CASCADE;
DROP TABLE IF EXISTS Train CASCADE;
DROP TABLE IF EXISTS Passenger CASCADE;

-- ----------------------------------------------------------------------------
-- TABLE 1: Passenger
-- Represents travelers who book train tickets.
-- ----------------------------------------------------------------------------
CREATE TABLE Passenger (
    Passenger_ID SERIAL PRIMARY KEY,
    Name VARCHAR(100) NOT NULL,
    Age INT NOT NULL CHECK (Age > 0 AND Age <= 120),
    Gender VARCHAR(10) NOT NULL CHECK (Gender IN ('Male', 'Female', 'Other')),
    Phone_Number VARCHAR(20) NOT NULL UNIQUE,
    Created_At TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- ----------------------------------------------------------------------------
-- TABLE 2: Train
-- Stores train schedule and route definitions.
-- ----------------------------------------------------------------------------
CREATE TABLE Train (
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

-- ----------------------------------------------------------------------------
-- TABLE 3: Station
-- Master catalog of railway stations and their geographic locations.
-- ----------------------------------------------------------------------------
CREATE TABLE Station (
    Station_ID INT PRIMARY KEY,
    Station_Name VARCHAR(100) NOT NULL,
    Location VARCHAR(100) NOT NULL,
    Station_Code VARCHAR(10) NOT NULL UNIQUE,
    Created_At TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- ----------------------------------------------------------------------------
-- TABLE 4: Payment
-- Financial records for ticket purchases.
-- ----------------------------------------------------------------------------
CREATE TABLE Payment (
    Payment_ID SERIAL PRIMARY KEY,
    Amount DECIMAL(10, 2) NOT NULL CHECK (Amount >= 0),
    Payment_Mode VARCHAR(50) NOT NULL CHECK (Payment_Mode IN ('UPI', 'Card', 'Net Banking', 'Cash')),
    Payment_Status VARCHAR(50) NOT NULL DEFAULT 'Paid' CHECK (Payment_Status IN ('Paid', 'Pending', 'Refunded', 'Failed')),
    Transaction_Ref VARCHAR(100) UNIQUE,
    Payment_Date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- ----------------------------------------------------------------------------
-- TABLE 5: Reservation
-- Core transactional entity linking Passenger, Train, and Payment.
-- ----------------------------------------------------------------------------
CREATE TABLE Reservation (
    Reservation_ID SERIAL PRIMARY KEY,
    Passenger_ID INT NOT NULL REFERENCES Passenger(Passenger_ID) ON DELETE CASCADE,
    Train_ID INT NOT NULL REFERENCES Train(Train_ID) ON DELETE RESTRICT,
    Payment_ID INT NOT NULL REFERENCES Payment(Payment_ID) ON DELETE RESTRICT,
    Seat_Number VARCHAR(20) NOT NULL,
    Journey_Date DATE NOT NULL,
    Reservation_Status VARCHAR(20) NOT NULL DEFAULT 'Confirmed' CHECK (Reservation_Status IN ('Confirmed', 'Cancelled', 'Pending')),
    PNR VARCHAR(30) NOT NULL UNIQUE,
    Created_At TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    -- Prevent duplicate seat booking for the same train, journey date, and seat number:
    CONSTRAINT unique_train_journey_seat UNIQUE (Train_ID, Journey_Date, Seat_Number)
);

-- ----------------------------------------------------------------------------
-- TABLE 6: Train_Station (Bridge Entity)
-- Represents M:N relationship between Trains and Stations along with routing order.
-- Composite Primary Key: (Train_ID, Station_ID)
-- ----------------------------------------------------------------------------
CREATE TABLE Train_Station (
    Train_ID INT NOT NULL REFERENCES Train(Train_ID) ON DELETE CASCADE,
    Station_ID INT NOT NULL REFERENCES Station(Station_ID) ON DELETE CASCADE,
    Stop_Sequence INT NOT NULL DEFAULT 1 CHECK (Stop_Sequence > 0),
    Halt_Minutes INT NOT NULL DEFAULT 5 CHECK (Halt_Minutes >= 0),
    Distance_KM INT NOT NULL DEFAULT 0 CHECK (Distance_KM >= 0),
    PRIMARY KEY (Train_ID, Station_ID)
);

-- ----------------------------------------------------------------------------
-- TABLE 7: Reservation_Audit (Audit Trail)
-- Automatically populated by database trigger on Reservation changes.
-- ----------------------------------------------------------------------------
CREATE TABLE Reservation_Audit (
    Audit_ID SERIAL PRIMARY KEY,
    Reservation_ID INT NOT NULL,
    Action VARCHAR(50) NOT NULL,
    Action_Time TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    Old_Status VARCHAR(50),
    New_Status VARCHAR(50),
    Details TEXT
);

-- Indexes for optimal query performance
CREATE INDEX idx_reservation_passenger ON Reservation(Passenger_ID);
CREATE INDEX idx_reservation_train ON Reservation(Train_ID);
CREATE INDEX idx_reservation_journey_date ON Reservation(Journey_Date);
CREATE INDEX idx_train_route ON Train(Source, Destination);
