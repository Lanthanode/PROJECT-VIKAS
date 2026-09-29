# 📖 Railway Management System &mdash; User Guide

This guide explains how to navigate, search, book tickets, check PNR status, cancel bookings, and use the DBMS Lab and Admin Portal.

---

## 1. Searching for Trains

1. Navigate to the **Trains** page from the top navigation bar (`/trains`) or use the search bar on the Homepage.
2. In the **From Station** input, enter your departure city (e.g. `Delhi` or `Mumbai`).
3. In the **To Station** input, enter your destination city (e.g. `Mumbai`, `Chandigarh`, or `Pune`).
4. Select your **Journey Date**.
5. Click **Search Trains**. The system queries the PostgreSQL `Train` table and displays all matching schedules, departure times, arrival times, and base fares.

---

## 2. Booking a Ticket

1. Click the **Book Ticket** button located in the top navbar or on any train card.
2. The **Book your journey** modal will open:
   - **Passenger Name**: Enter the traveler's full name (e.g. `Rahul Sharma`).
   - **Age & Gender**: Enter age (1-120) and gender (Male, Female, or Other).
   - **Phone Number**: Enter a valid 10-digit mobile number.
   - **From & To**: Select source and destination stations.
   - **Journey Date**: Select travel date.
   - **Train**: Choose your preferred train (e.g. `1001 — Rajdhani Express`).
   - **Seat Assignment**: Keep "Auto (Next Available)" or select "Select Specific" to enter a preferred seat.
   - **Payment Mode**: Choose between `UPI`, `Card`, or `Net Banking`.
3. Click **Confirm Reservation**.
4. Upon successful execution:
   - A celebration confetti animation triggers.
   - The system creates the `Passenger`, `Payment`, and `Reservation` records in the SQL database.
   - The PostgreSQL trigger `trg_reservation_audit` automatically inserts an audit entry into `Reservation_Audit`.
   - A digital boarding pass preview with your unique **PNR Number** (e.g. `PNR-260915-401`) is displayed.

---

## 3. Checking PNR Status & Printing Ticket

1. Navigate to **PNR Status** (`/pnr`).
2. Enter your PNR Number or Reservation ID into the search input.
3. Click **Search**.
4. The system retrieves your real-time booking details via the SQL database.
5. Click **Print Ticket** to generate a printable or PDF copy of your railway pass.

---

## 4. Cancelling a Booking

1. Open **Bookings** (`/bookings`) or retrieve your ticket under **PNR Status** (`/pnr`).
2. Click the **Cancel Ticket** button next to your reservation.
3. A confirmation dialog will appear. Confirm the cancellation.
4. The system executes:
   - `UPDATE Reservation SET Reservation_Status = 'Cancelled' WHERE Reservation_ID = ...`
   - The assigned seat is immediately released and becomes available for future bookings.
   - The PostgreSQL trigger records the cancellation action in `Reservation_Audit`.

---

## 5. Using the DBMS Lab & SQL Runner

1. Navigate to **DBMS Lab** (`/dbms-lab`).
2. Use the tabs to test:
   - **PDF Demonstration Queries**: Run Simple Filter (`Age > 20`), Nested Query (`IN`), Two-Table JOIN, and View queries.
   - **Interactive SQL Console**: Type custom SQL statements (e.g. `SELECT * FROM Station;`) and execute them directly against PostgreSQL.
   - **Trigger Audit Trail**: Inspect all audit rows generated automatically by the database trigger.
   - **Relational Schema**: View primary keys, foreign keys, and integrity constraint rules.

---

## 6. Accessing the Admin Portal

1. Navigate to **Admin** (`/admin`).
2. Enter the administrator master password (`admin123`).
3. Click **Access Admin Portal**.
4. You can now perform full CRUD operations:
   - **Passengers Tab**: Insert new passenger records or view all registered travelers.
   - **Trains Tab**: Add new train schedules, routes, and fares.
   - **Stations Tab**: Register new stations and station codes.
   - **Reservations Tab**: Monitor all bookings and financial transaction statuses.
