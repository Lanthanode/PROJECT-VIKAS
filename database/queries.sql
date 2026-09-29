-- ============================================================================
-- RAILWAY MANAGEMENT SYSTEM - DEMONSTRATION SQL QUERIES
-- Capstone Project: Indian Railways Passenger Reservation
-- Target RDBMS: PostgreSQL
-- ============================================================================

-- ----------------------------------------------------------------------------
-- QUERY 1: Simple SELECT with Filter (Explicitly required by PDF Page 3)
-- Demonstrates: Basic filtering with WHERE clause and integer comparison.
-- Description: Retrieves all passengers older than 20 years.
-- ----------------------------------------------------------------------------
SELECT *
FROM Passenger
WHERE Age > 20;

-- ----------------------------------------------------------------------------
-- QUERY 2: Nested Subquery with IN Operator (Explicitly required by PDF Page 3)
-- Demonstrates: Subquery / nested query to find passengers who have booked tickets.
-- Description: Retrieves names of passengers with at least one reservation.
-- ----------------------------------------------------------------------------
SELECT Name
FROM Passenger
WHERE Passenger_ID IN (
    SELECT Passenger_ID
    FROM Reservation
);

-- ----------------------------------------------------------------------------
-- QUERY 3: Two-Table INNER JOIN (Explicitly required by PDF Page 3)
-- Demonstrates: Combining Passenger and Reservation using Primary-Foreign key equality.
-- Description: Lists passenger name, their reservation ID, and assigned seat.
-- ----------------------------------------------------------------------------
SELECT 
    P.Name,
    R.Reservation_ID,
    R.Seat_Number
FROM Passenger P
JOIN Reservation R ON P.Passenger_ID = R.Passenger_ID;

-- ----------------------------------------------------------------------------
-- QUERY 4: Querying the SQL View (Explicitly required by PDF Page 3)
-- Demonstrates: Accessing pre-defined views for abstraction and data simplification.
-- ----------------------------------------------------------------------------
SELECT *
FROM Passenger_Reservation_View;

-- ----------------------------------------------------------------------------
-- QUERY 5: Four-Table Relational JOIN (End-to-End Booking Details)
-- Demonstrates: Multi-table relational integrity across Passenger, Reservation, Train, and Payment.
-- ----------------------------------------------------------------------------
SELECT 
    R.PNR,
    P.Name AS Passenger_Name,
    P.Phone_Number,
    T.Train_ID,
    T.Train_Name,
    T.Source,
    T.Destination,
    R.Seat_Number,
    R.Journey_Date,
    Pay.Amount,
    Pay.Payment_Mode,
    R.Reservation_Status
FROM Reservation R
JOIN Passenger P ON R.Passenger_ID = P.Passenger_ID
JOIN Train T ON R.Train_ID = T.Train_ID
JOIN Payment Pay ON R.Payment_ID = Pay.Payment_ID
ORDER BY R.Journey_Date ASC;

-- ----------------------------------------------------------------------------
-- QUERY 6: Aggregation with GROUP BY and HAVING (Revenue per Train)
-- Demonstrates: Aggregate functions (COUNT, SUM), GROUP BY, and HAVING filter.
-- ----------------------------------------------------------------------------
SELECT 
    T.Train_ID,
    T.Train_Name,
    COUNT(R.Reservation_ID) AS Confirmed_Passengers,
    SUM(Pay.Amount) AS Total_Collection
FROM Train T
JOIN Reservation R ON T.Train_ID = R.Train_ID
JOIN Payment Pay ON R.Payment_ID = Pay.Payment_ID
WHERE R.Reservation_Status = 'Confirmed'
GROUP BY T.Train_ID, T.Train_Name
HAVING SUM(Pay.Amount) > 1000.00
ORDER BY Total_Collection DESC;

-- ----------------------------------------------------------------------------
-- QUERY 7: Bridge Table M:N Navigation (Stations served by multiple trains)
-- Demonstrates: Bridge table traversal with COUNT(DISTINCT) aggregation.
-- ----------------------------------------------------------------------------
SELECT 
    S.Station_ID,
    S.Station_Name,
    S.Location,
    COUNT(TS.Train_ID) AS Total_Trains_Connecting
FROM Station S
JOIN Train_Station TS ON S.Station_ID = TS.Station_ID
GROUP BY S.Station_ID, S.Station_Name, S.Location
ORDER BY Total_Trains_Connecting DESC;

-- ----------------------------------------------------------------------------
-- QUERY 8: Subquery with NOT EXISTS (Passengers with NO reservations)
-- Demonstrates: Anti-semi-join pattern using correlated subqueries.
-- ----------------------------------------------------------------------------
SELECT P.Passenger_ID, P.Name, P.Phone_Number
FROM Passenger P
WHERE NOT EXISTS (
    SELECT 1 
    FROM Reservation R 
    WHERE R.Passenger_ID = P.Passenger_ID
);

-- ----------------------------------------------------------------------------
-- QUERY 9: Trigger Audit Trail Verification
-- Demonstrates: Inspecting the audit log populated automatically by the database trigger.
-- ----------------------------------------------------------------------------
SELECT 
    Audit_ID,
    Reservation_ID,
    Action,
    Action_Time,
    Details
FROM Reservation_Audit
ORDER BY Action_Time DESC;
