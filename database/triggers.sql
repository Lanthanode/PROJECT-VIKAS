-- ============================================================================
-- RAILWAY MANAGEMENT SYSTEM - TRIGGERS & STORED FUNCTIONS
-- Capstone Project: Indian Railways Passenger Reservation
-- Target RDBMS: PostgreSQL
-- ============================================================================

-- Function: trg_fn_reservation_audit
-- Handles automated audit logging whenever a Reservation is created, updated, or cancelled.
CREATE OR REPLACE FUNCTION trg_fn_reservation_audit()
RETURNS TRIGGER AS $$
BEGIN
    IF (TG_OP = 'INSERT') THEN
        INSERT INTO Reservation_Audit (
            Reservation_ID,
            Action,
            Old_Status,
            New_Status,
            Details
        ) VALUES (
            NEW.Reservation_ID,
            'RESERVATION_CREATED',
            NULL,
            NEW.Reservation_Status,
            'Passenger ' || NEW.Passenger_ID || ' booked Train ' || NEW.Train_ID || 
            ' on ' || TO_CHAR(NEW.Journey_Date, 'YYYY-MM-DD') || ' with Seat ' || NEW.Seat_Number || 
            ' [PNR: ' || NEW.PNR || ']'
        );
        RETURN NEW;

    ELSIF (TG_OP = 'UPDATE') THEN
        INSERT INTO Reservation_Audit (
            Reservation_ID,
            Action,
            Old_Status,
            New_Status,
            Details
        ) VALUES (
            NEW.Reservation_ID,
            CASE 
                WHEN NEW.Reservation_Status = 'Cancelled' THEN 'RESERVATION_CANCELLED'
                ELSE 'RESERVATION_UPDATED'
            END,
            OLD.Reservation_Status,
            NEW.Reservation_Status,
            'Status changed from ' || OLD.Reservation_Status || ' to ' || NEW.Reservation_Status || 
            ' for Seat ' || NEW.Seat_Number
        );
        RETURN NEW;

    ELSIF (TG_OP = 'DELETE') THEN
        INSERT INTO Reservation_Audit (
            Reservation_ID,
            Action,
            Old_Status,
            New_Status,
            Details
        ) VALUES (
            OLD.Reservation_ID,
            'RESERVATION_DELETED',
            OLD.Reservation_Status,
            'DELETED',
            'Reservation ID ' || OLD.Reservation_ID || ' [PNR: ' || OLD.PNR || '] was purged.'
        );
        RETURN OLD;
    END IF;

    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Trigger: trg_reservation_audit
DROP TRIGGER IF EXISTS trg_reservation_audit ON Reservation;

CREATE TRIGGER trg_reservation_audit
AFTER INSERT OR UPDATE OR DELETE ON Reservation
FOR EACH ROW
EXECUTE FUNCTION trg_fn_reservation_audit();
