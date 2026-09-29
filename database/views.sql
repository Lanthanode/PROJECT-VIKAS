-- ============================================================================
-- RAILWAY MANAGEMENT SYSTEM - VIEWS
-- Capstone Project: Indian Railways Passenger Reservation
-- Target RDBMS: PostgreSQL
-- ============================================================================

-- ----------------------------------------------------------------------------
-- VIEW 1: Passenger_Reservation_View (Required explicitly by Capstone PDF page 3)
-- Simplifies access by joining Passenger and Reservation details.
-- ----------------------------------------------------------------------------
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

-- ----------------------------------------------------------------------------
-- VIEW 2: Confirmed_Bookings_View
-- Full relational denormalization across Passenger, Reservation, Train, and Payment.
-- ----------------------------------------------------------------------------
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

-- ----------------------------------------------------------------------------
-- VIEW 3: Train_Reservation_Summary_View
-- Analytical aggregate view calculating total bookings, confirmed count, and revenue.
-- ----------------------------------------------------------------------------
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
