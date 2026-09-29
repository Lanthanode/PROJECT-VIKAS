import os
import time
from playwright.sync_api import sync_playwright

os.makedirs('screenshots', exist_ok=True)

def capture_all():
    with sync_playwright() as p:
        browser = p.chromium.launch()
        context = browser.new_context(viewport={'width': 1440, 'height': 900})
        page = context.new_page()

        print('[1/15] Capturing Homepage (Hero + Stats)...')
        page.goto('http://localhost:3000', wait_until='networkidle')
        time.sleep(1)
        page.screenshot(path='screenshots/01_homepage.png', full_page=False)

        print('[2/15] Capturing Available Trains section...')
        trains_sec = page.locator('#trains')
        if trains_sec.count() > 0:
            trains_sec.scroll_into_view_if_needed()
            time.sleep(0.5)
            page.screenshot(path='screenshots/02_available_trains.png')

        print('[3/15] Capturing Major Stations section...')
        stations_sec = page.locator('#stations')
        if stations_sec.count() > 0:
            stations_sec.scroll_into_view_if_needed()
            time.sleep(0.5)
            page.screenshot(path='screenshots/03_major_stations.png')

        print('[4/15] Capturing Recent Bookings table...')
        bookings_sec = page.locator('#bookings')
        if bookings_sec.count() > 0:
            bookings_sec.scroll_into_view_if_needed()
            time.sleep(0.5)
            page.screenshot(path='screenshots/04_recent_bookings.png')

        print('[5/15] Capturing Booking Modal (Empty)...')
        page.goto('http://localhost:3000', wait_until='networkidle')
        page.click('button:has-text("Book Ticket")')
        page.wait_for_selector('text=Book your journey')
        time.sleep(0.5)
        page.screenshot(path='screenshots/05_booking_modal_empty.png')

        print('[6/15] Capturing Booking Modal (Filled)...')
        page.fill('input[placeholder*="Rahul Sharma"]', 'Rahul Sharma')
        page.fill('input[type="tel"]', '9876543210')
        page.select_option('select:has-text("Rajdhani")', value='1001')
        time.sleep(0.5)
        page.screenshot(path='screenshots/06_booking_modal_filled.png')

        print('[7/15] Capturing Booking Success & Boarding Pass...')
        page.click('button:has-text("Confirm Reservation")')
        page.wait_for_selector('text=Reservation Successful!', timeout=10000)
        time.sleep(1)
        page.screenshot(path='screenshots/07_reservation_success.png')

        print('[8/15] Capturing PNR Status & Digital Printable Ticket...')
        page.goto('http://localhost:3000/pnr?pnr=PNR-260915-401', wait_until='networkidle')
        time.sleep(1)
        page.screenshot(path='screenshots/08_pnr_ticket.png', full_page=False)

        print('[9/15] Capturing Trains Schedule Page...')
        page.goto('http://localhost:3000/trains', wait_until='networkidle')
        time.sleep(1)
        page.screenshot(path='screenshots/09_trains_schedule.png', full_page=False)

        print('[10/15] Capturing Stations Network Page...')
        page.goto('http://localhost:3000/stations', wait_until='networkidle')
        time.sleep(1)
        page.screenshot(path='screenshots/10_stations_network.png', full_page=False)

        print('[11/15] Capturing Bookings Management Page...')
        page.goto('http://localhost:3000/bookings', wait_until='networkidle')
        time.sleep(1)
        page.screenshot(path='screenshots/11_bookings_management.png', full_page=False)

        print('[12/15] Capturing DBMS Lab & SQL Demo Execution...')
        page.goto('http://localhost:3000/dbms-lab', wait_until='networkidle')
        time.sleep(1)
        page.screenshot(path='screenshots/12_dbms_lab_queries.png', full_page=False)

        print('[13/15] Capturing Trigger Audit Trail Tab...')
        page.click('button:has-text("Trigger Audit Trail")')
        time.sleep(1)
        page.screenshot(path='screenshots/13_trigger_audit_trail.png', full_page=False)

        print('[14/15] Capturing Admin Management Portal...')
        page.goto('http://localhost:3000/admin', wait_until='networkidle')
        page.fill('input[type="password"]', 'admin123')
        page.click('button:has-text("Access Admin Portal")')
        page.wait_for_selector('text=Database Administration (CRUD)')
        time.sleep(1)
        page.screenshot(path='screenshots/14_admin_portal.png', full_page=False)

        print('[15/15] Capturing Mobile Responsive View (iPhone 14 / 375x812)...')
        mobile_context = browser.new_context(viewport={'width': 375, 'height': 812}, is_mobile=True)
        mobile_page = mobile_context.new_page()
        mobile_page.goto('http://localhost:3000', wait_until='networkidle')
        time.sleep(1)
        mobile_page.screenshot(path='screenshots/15_mobile_responsive.png', full_page=False)

        browser.close()
        print('All 15 real screenshots captured successfully in /screenshots directory!')

if __name__ == '__main__':
    capture_all()
