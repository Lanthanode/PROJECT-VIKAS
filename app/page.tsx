'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import BookingModal from '@/components/BookingModal';
import { 
  Train, ArrowRight, MapPin, Calendar, Clock, CheckCircle2, 
  Search, ShieldCheck, Database, RefreshCw, Ticket, ExternalLink,
  ChevronRight, Building2, Terminal
} from 'lucide-react';

export default function HomePage() {
  const [stats, setStats] = useState({
    activeTrains: 5,
    stations: 6,
    passengers: 9,
    confirmedBookings: 6,
    totalRevenue: 8350,
  });

  const [trains, setTrains] = useState<any[]>([]);
  const [stations, setStations] = useState<any[]>([]);
  const [recentBookings, setRecentBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Booking Modal State
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [selectedTrainForBooking, setSelectedTrainForBooking] = useState<number | undefined>(undefined);

  // DBMS Live Demo Runner State
  const [activeDemo, setActiveDemo] = useState<string>('simple');
  const [demoResult, setDemoResult] = useState<any>(null);
  const [runningDemo, setRunningDemo] = useState(false);

  // Load all live database records
  const loadDatabaseData = async () => {
    setLoading(true);
    try {
      const [statsRes, trainsRes, stationsRes, bookingsRes] = await Promise.all([
        fetch('/api/stats').then((r) => r.json()),
        fetch('/api/trains').then((r) => r.json()),
        fetch('/api/stations').then((r) => r.json()),
        fetch('/api/reservations?limit=6').then((r) => r.json()),
      ]);

      if (statsRes.success) setStats(statsRes.data);
      if (trainsRes.success) setTrains(trainsRes.data);
      if (stationsRes.success) setStations(stationsRes.data);
      if (bookingsRes.success) setRecentBookings(bookingsRes.data);
    } catch (err) {
      console.error('Failed to load database records:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDatabaseData();
    runDemoQuery('simple');
  }, []);

  const runDemoQuery = async (key: string) => {
    setActiveDemo(key);
    setRunningDemo(true);
    try {
      const res = await fetch('/api/sql', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ demoKey: key }),
      });
      const data = await res.json();
      if (data.success) {
        setDemoResult(data);
      }
    } catch (err) {
      console.error('Demo query failed:', err);
    } finally {
      setRunningDemo(false);
    }
  };

  const handleOpenBooking = (trainId?: number) => {
    setSelectedTrainForBooking(trainId);
    setIsBookingOpen(true);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar onOpenBookingModal={() => handleOpenBooking(1001)} />

      {/* ==================================================================== */}
      {/* HERO SECTION matching PDF Page 6 Screenshot 1                        */}
      {/* ==================================================================== */}
      <section className="relative overflow-hidden pt-8 pb-16 lg:pt-14 lg:pb-24 border-b border-stone-200/60 bg-[#fafaf7]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Hero Content */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* Badge matching PDF */}
              <div className="inline-flex items-center gap-2">
                <span className="text-[11px] font-bold tracking-[0.2em] text-emerald-800 uppercase">
                  SMART • SIMPLE • CONNECTED
                </span>
              </div>

              {/* Title matching PDF */}
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-stone-900 leading-[1.08]">
                Travel made <br />
                <span className="text-emerald-950">simpler.</span>
              </h1>

              {/* Subtitle matching PDF */}
              <p className="text-lg sm:text-xl text-stone-600 max-w-xl font-normal leading-relaxed">
                A modern railway reservation interface for managing passengers, trains, stations, bookings and payments.
              </p>

              {/* Action Buttons matching PDF */}
              <div className="pt-2 flex flex-wrap items-center gap-4">
                <button
                  onClick={() => handleOpenBooking(1001)}
                  className="px-7 py-3.5 rounded-2xl bg-railway-900 hover:bg-railway-800 active:scale-95 text-white text-base font-semibold shadow-lg shadow-railway-950/20 transition-all flex items-center gap-2.5 cursor-pointer"
                >
                  <Search className="w-4 h-4 text-emerald-300" />
                  <span>Search & Book</span>
                </button>

                <Link
                  href="/trains"
                  className="px-6 py-3.5 rounded-2xl text-stone-800 hover:text-railway-900 hover:bg-stone-200/60 text-base font-semibold transition-all flex items-center gap-2"
                >
                  <span>Explore Trains</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              {/* Capstone Identification Tag */}
              <div className="pt-4 flex items-center gap-3 text-xs text-stone-500 font-medium">
                <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-100/70 text-emerald-900">
                  <Database className="w-3.5 h-3.5 text-emerald-700" />
                  PostgreSQL Real DBMS
                </span>
                <span>•</span>
                <span>Rahul Sharma Sample Active</span>
                <span>•</span>
                <span className="font-mono text-emerald-700">Triggers Enabled</span>
              </div>

            </div>

            {/* Right Hero Boarding Pass / Ticket matching PDF Page 6 */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="w-full max-w-md bg-gradient-to-br from-[#0e261d] via-[#123629] to-[#0a1e16] rounded-3xl p-7 text-white shadow-2xl shadow-railway-950/35 border border-emerald-900/60 relative overflow-hidden transition-transform hover:-translate-y-1 duration-300">
                
                {/* Glow effects */}
                <div className="absolute -top-24 -right-24 w-48 h-48 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />
                <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-[#d9e944]/10 rounded-full blur-2xl pointer-events-none" />

                {/* Top Row: Brand & Status Badge */}
                <div className="flex justify-between items-center pb-6 border-b border-emerald-800/40">
                  <div className="flex items-center gap-2">
                    <Train className="w-4 h-4 text-emerald-400" />
                    <span className="text-[11px] font-bold tracking-widest uppercase text-emerald-200">
                      RAILWAYMS
                    </span>
                  </div>
                  <span className="px-3 py-1 rounded-full text-[11px] font-bold tracking-wider bg-[#d9e944] text-[#0e261d] uppercase shadow-sm">
                    CONFIRMED
                  </span>
                </div>

                {/* Route Visual: DEL to BOM */}
                <div className="py-6 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-semibold text-emerald-400 uppercase tracking-widest block">
                      FROM
                    </span>
                    <span className="text-3xl font-extrabold tracking-tight text-white block mt-0.5">
                      DEL
                    </span>
                    <span className="text-xs text-stone-300 font-medium block">
                      Delhi
                    </span>
                  </div>

                  {/* Route line with dots */}
                  <div className="flex-1 px-4 flex flex-col items-center">
                    <div className="w-full flex items-center justify-center relative">
                      <div className="h-[2px] w-full bg-emerald-700/60" />
                      <div className="w-2.5 h-2.5 rounded-full bg-[#d9e944] absolute left-0 ring-4 ring-[#0e261d]" />
                      <div className="w-2 h-2 rounded-full bg-emerald-400 absolute" />
                      <div className="w-2.5 h-2.5 rounded-full bg-[#d9e944] absolute right-0 ring-4 ring-[#0e261d]" />
                    </div>
                    <span className="text-[10px] text-emerald-300/80 font-mono mt-1.5">Direct Route</span>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] font-semibold text-emerald-400 uppercase tracking-widest block">
                      TO
                    </span>
                    <span className="text-3xl font-extrabold tracking-tight text-white block mt-0.5">
                      BOM
                    </span>
                    <span className="text-xs text-stone-300 font-medium block">
                      Mumbai
                    </span>
                  </div>
                </div>

                {/* Bottom Ticket Row: Train, Date, Seat matching PDF */}
                <div className="pt-6 border-t border-emerald-800/40 grid grid-cols-3 gap-2 text-xs">
                  <div>
                    <span className="text-[10px] font-semibold text-stone-400 uppercase tracking-wider block">
                      TRAIN
                    </span>
                    <span className="font-bold text-stone-100 text-sm mt-0.5 block">
                      1001
                    </span>
                  </div>
                  <div className="text-center">
                    <span className="text-[10px] font-semibold text-stone-400 uppercase tracking-wider block">
                      DATE
                    </span>
                    <span className="font-bold text-stone-100 text-sm mt-0.5 block">
                      15 Sep 2026
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] font-semibold text-stone-400 uppercase tracking-wider block">
                      SEAT
                    </span>
                    <span className="font-bold text-[#d9e944] text-sm mt-0.5 block font-mono">
                      A1-10
                    </span>
                  </div>
                </div>

                {/* Passenger detail snippet */}
                <div className="mt-4 pt-3 border-t border-emerald-900/50 flex justify-between items-center text-[11px] text-stone-400">
                  <span>Passenger: <strong className="text-stone-200">Rahul Sharma (101)</strong></span>
                  <span className="font-mono text-emerald-400">₹1,500 • UPI</span>
                </div>

              </div>
            </div>

          </div>
        </div>

        {/* ================================================================== */}
        {/* STATS BANNER matching PDF Page 6 (Dark Green Bar)                   */}
        {/* ================================================================== */}
        <div className="mt-12 bg-railway-900 text-white py-8 border-y border-railway-950">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              
              <div className="space-y-1">
                <span className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                  {stats.activeTrains}
                </span>
                <p className="text-xs sm:text-sm font-medium text-emerald-300/80">
                  Active Trains
                </p>
              </div>

              <div className="space-y-1">
                <span className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                  {stats.stations}
                </span>
                <p className="text-xs sm:text-sm font-medium text-emerald-300/80">
                  Stations
                </p>
              </div>

              <div className="space-y-1">
                <span className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                  {stats.passengers}
                </span>
                <p className="text-xs sm:text-sm font-medium text-emerald-300/80">
                  Passengers
                </p>
              </div>

              <div className="space-y-1">
                <span className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                  {stats.confirmedBookings}
                </span>
                <p className="text-xs sm:text-sm font-medium text-emerald-300/80">
                  Confirmed Bookings
                </p>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* ==================================================================== */}
      {/* AVAILABLE TRAINS SECTION matching PDF Page 6 Screenshot 2            */}
      {/* ==================================================================== */}
      <section id="trains" className="py-16 bg-[#fafaf7]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
            <div>
              <span className="text-[11px] font-bold tracking-[0.2em] text-emerald-800 uppercase block mb-1">
                SCHEDULE
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-stone-900">
                Available trains
              </h2>
            </div>

            <div className="flex items-center gap-3">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100/80 text-emerald-900 border border-emerald-200">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Live Demo Data
              </span>
              <Link 
                href="/trains" 
                className="text-xs font-semibold text-railway-800 hover:text-railway-950 flex items-center gap-1"
              >
                <span>View all schedule</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Train Cards matching PDF Page 6 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {trains.slice(0, 3).map((train) => (
              <div 
                key={train.train_id}
                className="bg-white rounded-3xl p-7 shadow-card-soft border border-stone-200/80 hover:shadow-lg hover:border-emerald-300 transition-all flex flex-col justify-between"
              >
                <div>
                  <span className="text-[10px] font-bold tracking-wider text-stone-400 uppercase">
                    TRAIN {train.train_id}
                  </span>
                  <h3 className="text-xl font-bold text-stone-900 mt-1">
                    {train.train_name}
                  </h3>

                  {/* Route Timeline */}
                  <div className="mt-6 flex items-center justify-between">
                    <div>
                      <span className="text-2xl font-black text-stone-900 block">
                        {train.source.substring(0, 3).toUpperCase()}
                      </span>
                      <span className="text-xs text-stone-500 mt-0.5 block">
                        {train.departure_time} • {train.source}
                      </span>
                    </div>

                    <div className="flex-1 px-3 flex flex-col items-center">
                      <div className="w-full border-t-2 border-dashed border-stone-300" />
                    </div>

                    <div className="text-right">
                      <span className="text-2xl font-black text-stone-900 block">
                        {train.destination.substring(0, 3).toUpperCase()}
                      </span>
                      <span className="text-xs text-stone-500 mt-0.5 block">
                        {train.arrival_time} • {train.destination}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-8 pt-4 border-t border-stone-100 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-stone-400 block uppercase">Base Fare</span>
                    <span className="text-base font-bold text-emerald-800">₹{parseFloat(train.base_fare).toFixed(2)}</span>
                  </div>
                  <button
                    onClick={() => handleOpenBooking(train.train_id)}
                    className="px-4 py-2 rounded-xl bg-railway-900 hover:bg-railway-800 text-white text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <Ticket className="w-3.5 h-3.5 text-emerald-300" />
                    <span>Book Ticket</span>
                  </button>
                </div>

              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ==================================================================== */}
      {/* MAJOR STATIONS SECTION matching PDF Page 7 Screenshot 1              */}
      {/* ==================================================================== */}
      <section id="stations" className="py-16 bg-[#f5f5f0] border-y border-stone-200/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="mb-8">
            <span className="text-[11px] font-bold tracking-[0.2em] text-emerald-800 uppercase block mb-1">
              NETWORK
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-stone-900">
              Major stations
            </h2>
          </div>

          {/* Station Cards matching PDF Page 7 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {stations.slice(0, 4).map((station, idx) => {
              const icons = [Building2, Building2, MapPin, Building2];
              const IconComp = icons[idx % icons.length];
              return (
                <div
                  key={station.station_id}
                  className="bg-white rounded-3xl p-6 shadow-sm border border-stone-200/80 hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div className="space-y-4">
                    <div className="w-10 h-10 rounded-2xl bg-stone-100 text-railway-800 flex items-center justify-center">
                      <IconComp className="w-5 h-5 text-emerald-700" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-stone-900">
                        {station.station_name}
                      </h3>
                      <p className="text-xs text-stone-500 mt-0.5">
                        Station {station.station_id} • {station.location}
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 pt-3 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500">
                    <span className="font-mono uppercase font-semibold text-emerald-800">{station.station_code}</span>
                    <span>{station.connected_trains || 2} Connected Trains</span>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* ==================================================================== */}
      {/* RECENT BOOKINGS TABLE matching PDF Page 7 & 8 Screenshots            */}
      {/* ==================================================================== */}
      <section id="bookings" className="py-16 bg-[#fafaf7]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
            <div>
              <span className="text-[11px] font-bold tracking-[0.2em] text-emerald-800 uppercase block mb-1">
                RESERVATIONS
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-stone-900">
                Recent bookings
              </h2>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={loadDatabaseData}
                className="px-3 py-1.5 rounded-xl border border-stone-200 bg-white hover:bg-stone-50 text-xs font-semibold text-stone-700 flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
                <span>Sync PostgreSQL</span>
              </button>
              <Link 
                href="/bookings" 
                className="text-xs font-semibold text-railway-800 hover:text-railway-950 flex items-center gap-1"
              >
                <span>View all bookings</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Table matching PDF Page 7 & 8 */}
          <div className="bg-white rounded-3xl shadow-sm border border-stone-200/80 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-[#fafaf8] border-b border-stone-200/80 text-[11px] font-bold tracking-wider text-stone-500 uppercase">
                  <tr>
                    <th scope="col" className="px-6 py-4">PASSENGER</th>
                    <th scope="col" className="px-6 py-4">TRAIN</th>
                    <th scope="col" className="px-6 py-4">SEAT</th>
                    <th scope="col" className="px-6 py-4">JOURNEY DATE</th>
                    <th scope="col" className="px-6 py-4">STATUS</th>
                    <th scope="col" className="px-6 py-4">PAYMENT</th>
                    <th scope="col" className="px-6 py-4 text-right">ACTION</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {recentBookings.map((b) => (
                    <tr key={b.reservation_id} className="hover:bg-stone-50/70 transition-colors">
                      <td className="px-6 py-4 font-semibold text-stone-900">
                        {b.passenger_name}
                        {b.pnr && (
                          <span className="block text-[11px] font-normal font-mono text-stone-400 mt-0.5">
                            {b.pnr}
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-stone-700">
                        {b.train_name}
                      </td>
                      <td className="px-6 py-4 font-mono font-medium text-stone-800">
                        {b.seat_number}
                      </td>
                      <td className="px-6 py-4 text-stone-600">
                        {b.journey_date}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${
                          b.reservation_status === 'Confirmed'
                            ? 'bg-emerald-100 text-emerald-800'
                            : b.reservation_status === 'Cancelled'
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}>
                          {b.reservation_status}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-medium text-stone-800">
                        ₹{parseFloat(b.payment_amount).toLocaleString('en-IN')} • {b.payment_mode}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Link
                          href={`/pnr?pnr=${b.pnr || b.reservation_id}`}
                          className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-800 hover:text-emerald-950 bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-lg transition-colors"
                        >
                          <span>Ticket</span>
                          <ExternalLink className="w-3 h-3" />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </section>

      {/* ==================================================================== */}
      {/* INTERACTIVE DBMS CAPSTONE SHOWCASE (FOR EXAMINERS / VIVA)            */}
      {/* ==================================================================== */}
      <section className="py-16 bg-stone-900 text-white border-t border-stone-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950 border border-emerald-700/60 text-xs font-semibold text-emerald-300 uppercase tracking-wider mb-2">
                <Terminal className="w-3.5 h-3.5" />
                <span>DBMS Viva Demonstration Engine</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
                Live SQL Query Execution
              </h2>
              <p className="text-sm text-stone-400 mt-1 max-w-2xl">
                Demonstrates the exact queries from the capstone PDF (Simple, Nested, JOIN, View, and Audit Trigger) executed live against PostgreSQL.
              </p>
            </div>

            <Link
              href="/dbms-lab"
              className="px-5 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center gap-2 self-start md:self-auto transition-colors shadow-md"
            >
              <Database className="w-4 h-4" />
              <span>Full DBMS Lab & Console</span>
            </Link>
          </div>

          {/* Query Selector Tabs */}
          <div className="flex flex-wrap gap-2 pb-4 border-b border-stone-800">
            {[
              { key: 'simple', label: '1. Simple Query (Age > 20)' },
              { key: 'nested', label: '2. Nested Subquery (IN)' },
              { key: 'join', label: '3. Two-Table JOIN' },
              { key: 'view', label: '4. Passenger_Reservation_View' },
              { key: 'audit', label: '5. Trigger: Reservation_Audit' },
              { key: 'complex_revenue', label: '6. Complex Aggregation & GROUP BY' },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => runDemoQuery(tab.key)}
                className={`px-4 py-2 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                  activeDemo === tab.key
                    ? 'bg-emerald-600 text-white font-semibold shadow-md'
                    : 'bg-stone-800 text-stone-400 hover:bg-stone-700 hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Results Box */}
          {demoResult && (
            <div className="mt-6 bg-stone-950 rounded-2xl border border-stone-800 p-6 space-y-4 font-mono text-xs">
              
              <div>
                <span className="text-emerald-400 font-semibold block text-sm">
                  {demoResult.title}
                </span>
                <p className="text-stone-400 font-sans text-xs mt-1">
                  {demoResult.description}
                </p>
              </div>

              {/* SQL Query Snippet */}
              <div className="p-4 rounded-xl bg-black/60 border border-stone-800/80 text-emerald-300 overflow-x-auto">
                <pre>{demoResult.sql}</pre>
              </div>

              {/* Data Table */}
              <div>
                <div className="flex justify-between items-center text-stone-400 mb-2">
                  <span>Results Returned: <strong className="text-white">{demoResult.data?.length || 0} rows</strong></span>
                  <span className="text-emerald-400">PostgreSQL Status: 200 OK</span>
                </div>

                <div className="max-h-60 overflow-y-auto rounded-xl border border-stone-800/80">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-stone-900 text-stone-400 sticky top-0 uppercase">
                      <tr>
                        {demoResult.data?.[0] && Object.keys(demoResult.data[0]).map((col) => (
                          <th key={col} className="px-4 py-2 border-b border-stone-800">{col}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-900 bg-black/30">
                      {demoResult.data?.map((row: any, i: number) => (
                        <tr key={i} className="hover:bg-stone-800/50">
                          {Object.values(row).map((val: any, j: number) => (
                            <td key={j} className="px-4 py-2 text-stone-200">
                              {typeof val === 'object' && val !== null ? JSON.stringify(val) : String(val)}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

        </div>
      </section>

      {/* Booking Modal */}
      <BookingModal
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        preSelectedTrainId={selectedTrainForBooking}
        onBookingSuccess={() => {
          loadDatabaseData();
        }}
      />
    </div>
  );
}
