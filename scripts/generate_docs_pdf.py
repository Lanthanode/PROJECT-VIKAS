import os
from playwright.sync_api import sync_playwright

def generate_pdf():
    os.makedirs('docs', exist_ok=True)
    html_content = """<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>Railway Management System - Comprehensive Setup Guide & Professor Demonstration Handbook</title>
<style>
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600;700&display=swap');
  
  @page {
    size: A4;
    margin: 16mm 14mm 16mm 14mm;
    @bottom-right {
      content: "Page " counter(page);
      font-size: 8.5pt;
      font-family: 'JetBrains Mono', monospace;
      color: #71717a;
    }
    @bottom-left {
      content: "RailwayMS - Indian Railways DBMS Capstone";
      font-size: 8.5pt;
      color: #71717a;
    }
  }

  body {
    font-family: 'Plus Jakarta Sans', -apple-system, sans-serif;
    color: #18181b;
    line-height: 1.5;
    font-size: 10pt;
    margin: 0;
    padding: 0;
  }

  .cover {
    page-break-after: always;
    text-align: center;
    padding-top: 50px;
  }

  .badge {
    display: inline-block;
    padding: 5px 14px;
    border-radius: 9999px;
    background: #e1efe8;
    color: #0e261d;
    font-size: 8.5pt;
    font-weight: 800;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    border: 1px solid #c4e0d3;
  }

  h1 {
    font-size: 28pt;
    font-weight: 800;
    color: #0e261d;
    margin: 24px 0 10px 0;
    line-height: 1.15;
    letter-spacing: -0.02em;
  }

  .subtitle {
    font-size: 13.5pt;
    color: #4b5563;
    margin-bottom: 30px;
    font-weight: 500;
  }

  .author-box {
    background: #ffffff;
    border: 2px solid #0e261d;
    border-radius: 16px;
    padding: 22px 30px;
    margin: 35px auto;
    max-width: 440px;
    text-align: center;
    box-shadow: 0 10px 25px -5px rgba(14, 38, 29, 0.1);
  }

  .author-label {
    font-size: 9pt;
    text-transform: uppercase;
    letter-spacing: 0.15em;
    color: #059669;
    font-weight: 700;
  }

  .author-name {
    font-size: 20pt;
    font-weight: 800;
    color: #0e261d;
    margin-top: 4px;
    letter-spacing: -0.01em;
  }

  .author-sub {
    font-size: 9.5pt;
    color: #6b7280;
    margin-top: 4px;
    font-weight: 500;
  }

  .meta-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
    max-width: 520px;
    margin: 30px auto;
    text-align: left;
  }

  .meta-card {
    background: #f8faf9;
    border: 1px solid #e2e8e5;
    border-radius: 12px;
    padding: 12px 16px;
  }

  .meta-card-label {
    font-size: 8pt;
    color: #6b7280;
    text-transform: uppercase;
    font-weight: 700;
  }

  .meta-card-value {
    font-size: 9.5pt;
    color: #111827;
    font-weight: 600;
    margin-top: 2px;
  }

  .page {
    page-break-before: always;
  }

  h2 {
    font-size: 15pt;
    font-weight: 800;
    color: #0e261d;
    border-bottom: 2px solid #e1efe8;
    padding-bottom: 6px;
    margin-top: 24px;
    margin-bottom: 12px;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  h3 {
    font-size: 11pt;
    font-weight: 700;
    color: #18181b;
    margin-top: 18px;
    margin-bottom: 6px;
  }

  code {
    font-family: 'JetBrains Mono', monospace;
    font-size: 8.5pt;
    background: #f3f4f6;
    padding: 2px 6px;
    border-radius: 4px;
    color: #065f46;
    border: 1px solid #e5e7eb;
  }

  pre {
    background: #0f172a;
    color: #34d399;
    padding: 12px 16px;
    border-radius: 10px;
    font-family: 'JetBrains Mono', monospace;
    font-size: 8pt;
    overflow-x: auto;
    line-height: 1.45;
    margin: 8px 0;
  }

  table {
    width: 100%;
    border-collapse: collapse;
    margin: 12px 0;
    font-size: 8.5pt;
  }

  th, td {
    border: 1px solid #e5e7eb;
    padding: 7px 10px;
    text-align: left;
  }

  th {
    background: #f4f5f0;
    font-weight: 700;
    color: #0e261d;
  }

  .alert-box {
    background: #f0fdf4;
    border-left: 4px solid #10b981;
    padding: 10px 14px;
    border-radius: 0 8px 8px 0;
    margin: 12px 0;
    font-size: 9pt;
  }

  .alert-box strong {
    color: #065f46;
  }

  .step-pill {
    background: #0e261d;
    color: white;
    border-radius: 9999px;
    width: 22px;
    height: 22px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-size: 8pt;
    font-weight: bold;
    margin-right: 6px;
    flex-shrink: 0;
  }

  .step-item {
    display: flex;
    align-items: flex-start;
    margin-bottom: 12px;
  }

  .step-body {
    flex: 1;
  }
</style>
</head>
<body>

<!-- COVER PAGE -->
<div class="cover">
  <div class="badge">DBMS CAPSTONE PROJECT &bull; SYSTEM MANUAL &bull; VIVA GUIDE</div>
  <h1>RAILWAY MANAGEMENT SYSTEM</h1>
  <div class="subtitle">Complete Setup Guide, Architecture & Professor Viva Presentation Manual</div>

  <div class="author-box">
    <div class="author-label">PROJECT LEAD & DEVELOPER</div>
    <div class="author-name">VIKAS YADAV</div>
    <div class="author-sub">Database Management Systems (DBMS) Capstone Project</div>
  </div>

  <div class="meta-grid">
    <div class="meta-card">
      <div class="meta-card-label">Relational Database Engine</div>
      <div class="meta-card-value">PostgreSQL 16 (ACID Engine)</div>
    </div>
    <div class="meta-card">
      <div class="meta-card-label">Application Framework</div>
      <div class="meta-card-value">Next.js 15 + TypeScript</div>
    </div>
    <div class="meta-card">
      <div class="meta-card-label">Styling & UI Components</div>
      <div class="meta-card-value">Tailwind CSS + Lucide Icons</div>
    </div>
    <div class="meta-card">
      <div class="meta-card-label">GitHub Repository</div>
      <div class="meta-card-value" style="font-family: 'JetBrains Mono'; font-size: 8pt;">Lanthanode/PROJECT-VIKAS</div>
    </div>
  </div>

  <div style="margin-top: 40px; font-size: 9pt; color: #6b7280; line-height: 1.6;">
    <p><strong>Department of Computer Science & Engineering</strong></p>
    <p>Real-Life Case Study: Indian Railways Passenger Reservation System (IRCTC)</p>
    <p>Includes One-Click Batch Launcher &bull; Zero External DB Setup &bull; Live PL/pgSQL Triggers &bull; Automated Auditing</p>
  </div>
</div>

<!-- PAGE 2: QUICK START & ARCHITECTURE -->
<div class="page">
  <h2>1. Quick Start & Execution Options</h2>
  <p>
    The Railway Management System is built to be <strong>100% self-contained</strong>. It embeds an official PostgreSQL 16 WebAssembly engine (<code>@electric-sql/pglite</code>), eliminating the need for examiners or students to manually install, configure, or start a PostgreSQL background daemon.
  </p>

  <div class="alert-box">
    <strong>One-Click Windows Launcher:</strong> For instant presentation to college professors, double-click <code>START_RAILWAY_SYSTEM.bat</code> in the project folder. It verifies Node.js, installs any missing packages, starts the server, and automatically launches your browser to <code>http://localhost:3000</code>.
  </div>

  <h3>Execution Methods Summary</h3>
  <table>
    <thead>
      <tr>
        <th>Method</th>
        <th>Command / Action</th>
        <th>Environment</th>
        <th>Best For</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><strong>One-Click Batch</strong></td>
        <td>Double-click <code>START_RAILWAY_SYSTEM.bat</code></td>
        <td>Windows Local</td>
        <td>College presentation & viva demonstration</td>
      </tr>
      <tr>
        <td><strong>Dev Server</strong></td>
        <td><code>npm run dev</code></td>
        <td>Cross-platform</td>
        <td>Interactive development & live debugging</td>
      </tr>
      <tr>
        <td><strong>Production Build</strong></td>
        <td><code>npm run build && npm run start</code></td>
        <td>Cross-platform</td>
        <td>High-speed compiled production showcase</td>
      </tr>
      <tr>
        <td><strong>Remote PostgreSQL</strong></td>
        <td>Set <code>DATABASE_URL</code> in <code>.env.local</code></td>
        <td>Cloud / Supabase / Neon</td>
        <td>Hosted cloud deployment</td>
      </tr>
    </tbody>
  </table>

  <h2>2. System Architecture Layers</h2>
  <p>The system adheres to strict software engineering separation of concerns across 5 distinct layers:</p>
  
  <table>
    <thead>
      <tr>
        <th>Layer</th>
        <th>Path / Module</th>
        <th>Responsibilities</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><strong>Interface Layer</strong></td>
        <td><code>/app</code>, <code>/components</code></td>
        <td>Responsive UI, booking modal, boarding pass, dark green branding, mobile viewport adaptability.</td>
      </tr>
      <tr>
        <td><strong>Integration Layer</strong></td>
        <td><code>/app/api/...</code></td>
        <td>REST API endpoints for trains, stations, bookings, PNR lookups, and SQL query execution.</td>
      </tr>
      <tr>
        <td><strong>Logic Layer</strong></td>
        <td><code>/lib/services/railway.ts</code></td>
        <td>Seat assignment algorithms, duplicate prevention validation, fare calculations, PNR formatting.</td>
      </tr>
      <tr>
        <td><strong>Storage Layer</strong></td>
        <td><code>/lib/db.ts</code>, <code>/database/</code></td>
        <td>PostgreSQL 16 relational engine, DDL schema, views, triggers, and ACID transactions.</td>
      </tr>
      <tr>
        <td><strong>Security Layer</strong></td>
        <td><code>/app/admin</code></td>
        <td>Master administrative authentication gate (password: <code>admin123</code>) and audit logging.</td>
      </tr>
    </tbody>
  </table>
</div>

<!-- PAGE 3: STEP-BY-STEP INSTALLATION & CONFIG -->
<div class="page">
  <h2>3. Step-by-Step Installation Guide</h2>

  <div class="step-item">
    <div class="step-pill">1</div>
    <div class="step-body">
      <strong>Clone the GitHub Repository</strong>
      <p>Clone the project onto your local workstation using Git:</p>
      <pre>git clone https://github.com/Lanthanode/PROJECT-VIKAS.git
cd PROJECT-VIKAS</pre>
    </div>
  </div>

  <div class="step-item">
    <div class="step-pill">2</div>
    <div class="step-body">
      <strong>Verify Node.js Version</strong>
      <p>Ensure Node.js 18+ or 20+ is installed on your computer:</p>
      <pre>node -v
npm -v</pre>
      <p><em>If not installed, download the official LTS release from <a href="https://nodejs.org/">https://nodejs.org/</a>.</em></p>
    </div>
  </div>

  <div class="step-item">
    <div class="step-pill">3</div>
    <div class="step-body">
      <strong>Install Project Dependencies</strong>
      <p>Install all required frontend and database packages:</p>
      <pre>npm install</pre>
    </div>
  </div>

  <div class="step-item">
    <div class="step-pill">4</div>
    <div class="step-body">
      <strong>Automatic Database Engine Initialization</strong>
      <p>
        No manual <code>psql</code> or database creation commands are needed! When you start the app, <code>/lib/db.ts</code> executes the complete DDL schema, compiles all views, installs the PL/pgSQL audit trigger, and inserts all PDF sample records automatically.
      </p>
      <p><em>Optional:</em> To connect to an external PostgreSQL instance (e.g. Supabase, Neon), create <code>.env.local</code>:</p>
      <pre>DATABASE_URL="postgresql://postgres:[PASSWORD]@[HOST]:5432/[DB_NAME]?sslmode=require"</pre>
    </div>
  </div>

  <div class="step-item">
    <div class="step-pill">5</div>
    <div class="step-body">
      <strong>Launch the Application</strong>
      <pre>npm run dev</pre>
      <p>Open your browser and navigate to: <code>http://localhost:3000</code></p>
    </div>
  </div>

  <h2>4. Core Application URL Reference</h2>
  <table>
    <thead>
      <tr>
        <th>Page / Feature</th>
        <th>URL Route</th>
        <th>Primary Purpose</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><strong>Homepage / Dashboard</strong></td>
        <td><code>http://localhost:3000/</code></td>
        <td>Hero ticket, live stats bar, available trains, major stations, recent bookings.</td>
      </tr>
      <tr>
        <td><strong>Train Schedule</strong></td>
        <td><code>http://localhost:3000/trains</code></td>
        <td>Search by origin/destination stations, view departure/arrival timings and base fares.</td>
      </tr>
      <tr>
        <td><strong>Network Stations</strong></td>
        <td><code>http://localhost:3000/stations</code></td>
        <td>Station catalog with station codes (NDLS, BCT, CDG, PUNE) and connected trains.</td>
      </tr>
      <tr>
        <td><strong>Bookings & Cancellation</strong></td>
        <td><code>http://localhost:3000/bookings</code></td>
        <td>Full table of reservations with instant seat cancellation and trigger logging.</td>
      </tr>
      <tr>
        <td><strong>PNR Status & Ticket</strong></td>
        <td><code>http://localhost:3000/pnr</code></td>
        <td>Search any PNR number to display a printable executive digital boarding pass.</td>
      </tr>
      <tr>
        <td><strong>DBMS Lab & SQL Runner</strong></td>
        <td><code>http://localhost:3000/dbms-lab</code></td>
        <td>Live SQL query runner, views, and PL/pgSQL trigger audit trail inspector.</td>
      </tr>
      <tr>
        <td><strong>Admin Portal (CRUD)</strong></td>
        <td><code>http://localhost:3000/admin</code></td>
        <td>Protected portal for inserting and managing Passengers, Trains, and Stations.</td>
      </tr>
      <tr>
        <td><strong>About & Team Details</strong></td>
        <td><code>http://localhost:3000/about</code></td>
        <td>System specifications, workflow diagram, and academic viva reference notes.</td>
      </tr>
    </tbody>
  </table>
</div>

<!-- PAGE 4: PROFESSOR PRESENTATION CHECKLIST -->
<div class="page">
  <h2>5. College Professor & Viva Presentation Script</h2>
  <p>Follow this exact 10-step sequence during your project demonstration to prove relational database concepts to the examiner:</p>

  <div class="step-item">
    <div class="step-pill">1</div>
    <div class="step-body">
      <strong>Show Live Database Dashboard Statistics</strong>
      <p>Open <code>http://localhost:3000</code>. Point out the dark green statistics bar showing Active Trains (5), Stations (6), Passengers (9), and Confirmed Bookings. Explain that these figures are dynamically computed from PostgreSQL aggregate queries (<code>COUNT(*)</code>, <code>SUM(Amount)</code>).</p>
    </div>
  </div>

  <div class="step-item">
    <div class="step-pill">2</div>
    <div class="step-body">
      <strong>Navigate to Train Schedule</strong>
      <p>Go to <code>/trains</code>. Search "Delhi" to "Mumbai". Show <strong>Rajdhani Express (Train 1001)</strong> departing at 16:30 and arriving at 08:00, exactly matching the capstone PDF.</p>
    </div>
  </div>

  <div class="step-item">
    <div class="step-pill">3</div>
    <div class="step-body">
      <strong>Execute Live Ticket Booking</strong>
      <p>Click "Book Ticket". Enter <strong>Rahul Sharma</strong>, Age <strong>21</strong>, Gender <strong>Male</strong>, Phone <strong>9876543210</strong>. Choose Train 1001 and select UPI payment. Click "Confirm Reservation". Show the celebratory confetti and instant PNR generation.</p>
    </div>
  </div>

  <div class="step-item">
    <div class="step-pill">4</div>
    <div class="step-body">
      <strong>Demonstrate Duplicate Seat Prevention Constraint</strong>
      <p>Attempt to book the exact same seat on Train 1001 for the same journey date. Show the professor that the system returns an error: <em>"Seat is already occupied on train 1001"</em>. Explain that this is enforced by <code>CONSTRAINT unique_train_journey_seat UNIQUE (Train_ID, Journey_Date, Seat_Number)</code> in PostgreSQL.</p>
    </div>
  </div>

  <div class="step-item">
    <div class="step-pill">5</div>
    <div class="step-body">
      <strong>Verify Automated Database Trigger Audit</strong>
      <p>Navigate to <code>/dbms-lab</code> &rarr; click <strong>"Trigger Audit Trail"</strong>. Show the newly inserted record in <code>Reservation_Audit</code> containing <code>RESERVATION_CREATED</code>, timestamp, and reservation details automatically populated by <code>trg_reservation_audit</code> without any manual logging code.</p>
    </div>
  </div>

  <div class="step-item">
    <div class="step-pill">6</div>
    <div class="step-body">
      <strong>Display Printable Boarding Pass & PNR Status</strong>
      <p>Navigate to <code>/pnr</code> and enter the generated PNR number. Display the digital boarding pass showing Passenger details, Train number, Seat, Departure, and Fare.</p>
    </div>
  </div>

  <div class="step-item">
    <div class="step-pill">7</div>
    <div class="step-body">
      <strong>Demonstrate Ticket Cancellation & Seat Release</strong>
      <p>Click "Cancel Ticket". Observe that the status immediately transitions from <code>Confirmed</code> to <code>Cancelled</code>, freeing up the seat in the inventory and generating a <code>RESERVATION_CANCELLED</code> audit row.</p>
    </div>
  </div>

  <div class="step-item">
    <div class="step-pill">8</div>
    <div class="step-body">
      <strong>Execute Capstone SQL Queries in DBMS Lab</strong>
      <p>In <code>/dbms-lab</code>, run:</p>
      <ul>
        <li><strong>Simple Query:</strong> <code>SELECT * FROM Passenger WHERE Age > 20;</code></li>
        <li><strong>Nested Subquery:</strong> <code>SELECT Name FROM Passenger WHERE Passenger_ID IN (SELECT Passenger_ID FROM Reservation);</code></li>
        <li><strong>Two-Table JOIN:</strong> Combines Passenger and Reservation tables across foreign keys.</li>
        <li><strong>Relational View:</strong> <code>SELECT * FROM Passenger_Reservation_View;</code></li>
      </ul>
    </div>
  </div>

  <div class="step-item">
    <div class="step-pill">9</div>
    <div class="step-body">
      <strong>Open Protected Admin Portal (CRUD)</strong>
      <p>Go to <code>/admin</code>, authenticate with <code>admin123</code>, and show live CRUD operations on Passengers, Trains, and Stations.</p>
    </div>
  </div>

  <div class="step-item">
    <div class="step-pill">10</div>
    <div class="step-body">
      <strong>Summarize DBMS Architecture</strong>
      <p>Conclude by explaining why relational normalization matters, why foreign keys prevent orphan rows, and how the bridge table <code>Train_Station</code> handles Many-to-Many routing.</p>
    </div>
  </div>
</div>

<!-- PAGE 5: TROUBLESHOOTING & FAQ -->
<div class="page">
  <h2>6. Troubleshooting & Frequently Asked Questions</h2>

  <table>
    <thead>
      <tr>
        <th>Symptom / Question</th>
        <th>Root Cause</th>
        <th>Resolution</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><strong>Port 3000 is occupied</strong></td>
        <td>Another service or zombie Node process is running on port 3000.</td>
        <td>Run on port 3005: <code>npx next dev -p 3005</code> or terminate the process using <code>npx kill-port 3000</code>.</td>
      </tr>
      <tr>
        <td><strong>'node' is not recognized</strong></td>
        <td>Node.js is not installed or not added to system <code>PATH</code>.</td>
        <td>Install Node.js 18+ from <a href="https://nodejs.org/">https://nodejs.org/</a> and restart your terminal.</td>
      </tr>
      <tr>
        <td><strong>Database tables missing</strong></td>
        <td>First-time initialization was interrupted.</td>
        <td>Delete the <code>/data</code> folder and re-launch the application. The system will recreate all tables, triggers, and seed data.</td>
      </tr>
      <tr>
        <td><strong>Can I connect to Supabase or Neon?</strong></td>
        <td>Yes, standard PostgreSQL connection strings are fully supported.</td>
        <td>Set <code>DATABASE_URL="postgresql://user:pass@host:5432/db"</code> in <code>.env.local</code>.</td>
      </tr>
      <tr>
        <td><strong>Is a payment gateway required?</strong></td>
        <td>No, this is an academic capstone.</td>
        <td>Payments are recorded realistically in the <code>Payment</code> SQL table without external credit card processing.</td>
      </tr>
    </tbody>
  </table>

  <h2>7. Verification & Quality Checklist</h2>
  <div style="font-size: 9pt; line-height: 1.8;">
    <div>&#10003; <strong>PostgreSQL 16 Engine:</strong> Active and fully ACID compliant.</div>
    <div>&#10003; <strong>Primary & Foreign Keys:</strong> Strictly enforced across all 6 tables.</div>
    <div>&#10003; <strong>Duplicate Seat Prevention:</strong> Enforced by composite UNIQUE constraint.</div>
    <div>&#10003; <strong>PL/pgSQL Trigger:</strong> Automatically logs INSERT and UPDATE actions to <code>Reservation_Audit</code>.</div>
    <div>&#10003; <strong>Compiled Views:</strong> <code>Passenger_Reservation_View</code> queries successfully.</div>
    <div>&#10003; <strong>One-Click Launcher:</strong> <code>START_RAILWAY_SYSTEM.bat</code> launches seamlessly.</div>
    <div>&#10003; <strong>Responsive Design:</strong> Tested across 375px, 768px, 1024px, and 1440px viewports.</div>
  </div>

  <div style="margin-top: 30px; text-align: center; border-top: 1px solid #e5e7eb; padding-top: 15px; font-size: 8.5pt; color: #71717a;">
    Railway Management System &bull; Lead Developer: <strong>Vikas Yadav</strong> &bull; Indian Railways DBMS Capstone
  </div>
</div>

</body>
</html>
"""

    with open('docs/guide_temp.html', 'w', encoding='utf-8') as f:
        f.write(html_content)

    print('Compiling high-fidelity expanded Setup Guide PDF using Playwright Chromium...')
    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page()
        page.goto(f"file:///{os.path.abspath('docs/guide_temp.html')}")
        
        pdf_path = os.path.abspath('docs/SETUP_GUIDE.pdf')
        page.pdf(
            path=pdf_path,
            format='A4',
            print_background=True,
            margin={'top': '14mm', 'bottom': '14mm', 'left': '14mm', 'right': '14mm'}
        )
        print(f'Successfully generated docs PDF: {pdf_path}')

        root_pdf_path = os.path.abspath('SETUP_GUIDE.pdf')
        page.pdf(
            path=root_pdf_path,
            format='A4',
            print_background=True,
            margin={'top': '14mm', 'bottom': '14mm', 'left': '14mm', 'right': '14mm'}
        )
        print(f'Successfully generated root PDF: {root_pdf_path}')

        browser.close()

if __name__ == '__main__':
    generate_pdf()
