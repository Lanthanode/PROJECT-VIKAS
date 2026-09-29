import React from 'react';
import Link from 'next/link';
import { Train, Database, Shield, BookOpen, ExternalLink, Code } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-stone-900 text-stone-300 border-t border-stone-800 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Col 1: Project Identity */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-railway-800 flex items-center justify-center text-emerald-400">
                <Train className="w-5 h-5" />
              </div>
              <span className="text-xl font-bold text-white tracking-tight">RailwayMS</span>
            </div>
            <p className="text-sm text-stone-400 leading-relaxed">
              Database Management System (DBMS) Capstone Project based on the Indian Railways Passenger Reservation workflow.
            </p>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/60 border border-emerald-800 text-xs text-emerald-400 font-medium">
              <Database className="w-3.5 h-3.5" />
              <span>PostgreSQL 16 Relational Engine</span>
            </div>
          </div>

          {/* Col 2: DBMS Architecture */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider">DBMS Architecture</h3>
            <p className="text-sm text-stone-400 leading-relaxed">
              Designed as a normalized relational database supporting ACID transactions, foreign keys, triggers, views, and integrity constraints.
            </p>
            <div className="text-xs text-stone-500 font-mono">
              Engine: PostgreSQL 16 Relational
            </div>
          </div>

          {/* Col 3: DBMS Features */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider">DBMS Concepts</h3>
            <ul className="space-y-1.5 text-sm text-stone-400">
              <li><Link href="/dbms-lab" className="hover:text-emerald-400 transition-colors">Relational Schema & DDL</Link></li>
              <li><Link href="/dbms-lab" className="hover:text-emerald-400 transition-colors">Integrity Constraints & Foreign Keys</Link></li>
              <li><Link href="/dbms-lab" className="hover:text-emerald-400 transition-colors">PL/pgSQL Trigger & Audit Log</Link></li>
              <li><Link href="/dbms-lab" className="hover:text-emerald-400 transition-colors">Passenger_Reservation_View</Link></li>
              <li><Link href="/dbms-lab" className="hover:text-emerald-400 transition-colors">Complex Queries & JOINs</Link></li>
            </ul>
          </div>

          {/* Col 4: Quick Links */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider">System Navigation</h3>
            <ul className="space-y-1.5 text-sm text-stone-400">
              <li><Link href="/trains" className="hover:text-emerald-400 transition-colors">Available Trains Schedule</Link></li>
              <li><Link href="/stations" className="hover:text-emerald-400 transition-colors">Major Network Stations</Link></li>
              <li><Link href="/bookings" className="hover:text-emerald-400 transition-colors">Recent Bookings</Link></li>
              <li><Link href="/pnr" className="hover:text-emerald-400 transition-colors">PNR Status & Cancellation</Link></li>
              <li><Link href="/admin" className="hover:text-emerald-400 transition-colors">Admin Portal & Database CRUD</Link></li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-6 border-t border-stone-800 text-xs text-stone-500 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© 2026 RailwayMS — Academic DBMS Capstone Project. Real-life scenario: Indian Railways.</p>
          <div className="flex items-center gap-4">
            <span className="text-stone-400">Academic Demo System (Simulated Payments)</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
