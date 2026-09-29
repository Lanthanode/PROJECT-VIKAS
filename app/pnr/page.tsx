'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Navbar from '@/components/Navbar';
import BookingModal from '@/components/BookingModal';
import { 
  Search, Train, Ticket, Calendar, Clock, MapPin, 
  CheckCircle2, Ban, Printer, AlertCircle, Loader2, ArrowLeft 
} from 'lucide-react';
import Link from 'next/link';

function PnrContent() {
  const searchParams = useSearchParams();
  const initialPnr = searchParams.get('pnr') || '';

  const [pnrInput, setPnrInput] = useState(initialPnr);
  const [booking, setBooking] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cancelling, setCancelling] = useState(false);
  const [cancelMessage, setCancelMessage] = useState<string | null>(null);

  const [isBookingOpen, setIsBookingOpen] = useState(false);

  const fetchPnr = async (queryPnr: string) => {
    if (!queryPnr.trim()) return;

    setLoading(true);
    setError(null);
    setCancelMessage(null);

    try {
      const res = await fetch(`/api/pnr/${encodeURIComponent(queryPnr.trim())}`);
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'No booking record found for this PNR/ID.');
      }

      setBooking(data.data);
    } catch (err: any) {
      setError(err.message || 'Failed to search PNR.');
      setBooking(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialPnr) {
      fetchPnr(initialPnr);
    }
  }, [initialPnr]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchPnr(pnrInput);
  };

  const handleCancel = async () => {
    if (!booking) return;
    if (!confirm(`Are you sure you want to cancel PNR ${booking.pnr}?`)) return;

    setCancelling(true);
    try {
      const res = await fetch(`/api/reservations/${booking.pnr}/cancel`, {
        method: 'POST',
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Cancellation failed');
      }

      setCancelMessage(`Reservation ${booking.pnr} has been cancelled successfully.`);
      // Refresh booking
      await fetchPnr(booking.pnr);
    } catch (err: any) {
      setError(err.message || 'Failed to cancel.');
    } finally {
      setCancelling(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#fafaf7]">
      <Navbar onOpenBookingModal={() => setIsBookingOpen(true)} />

      {/* Header Banner */}
      <div className="bg-railway-900 text-white py-12 border-b border-railway-950 print:hidden">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <span className="text-[11px] font-bold tracking-[0.2em] text-emerald-400 uppercase block">
            PASSENGER NAME RECORD
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Check PNR Status & Digital Ticket
          </h1>
          <p className="text-stone-300 text-sm max-w-lg mx-auto">
            Retrieve your live PostgreSQL reservation record by entering your PNR number or Reservation ID.
          </p>

          {/* Search Form */}
          <form onSubmit={handleSearch} className="pt-4 max-w-md mx-auto flex gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                required
                placeholder="e.g. PNR-260915-401 or 401"
                value={pnrInput}
                onChange={(e) => setPnrInput(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-2xl bg-white text-stone-900 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono shadow-md uppercase"
              />
              <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 rounded-2xl bg-[#d9e944] hover:bg-[#cbe034] text-railway-950 font-bold text-sm shadow-md transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-60"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <span>Search</span>}
            </button>
          </form>

          {/* Sample PNR tags for quick testing */}
          <div className="flex flex-wrap justify-center items-center gap-2 pt-2 text-xs text-stone-400">
            <span>Quick Try:</span>
            {['PNR-260915-401', 'PNR-260915-402', 'PNR-260918-403'].map((sample) => (
              <button
                key={sample}
                type="button"
                onClick={() => {
                  setPnrInput(sample);
                  fetchPnr(sample);
                }}
                className="font-mono text-emerald-300 hover:text-white underline cursor-pointer"
              >
                {sample}
              </button>
            ))}
          </div>

        </div>
      </div>

      {/* Ticket Container */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex-1 w-full">
        
        {error && (
          <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 flex items-start gap-3 text-rose-800 text-sm mb-6 animate-in fade-in">
            <AlertCircle className="w-5 h-5 flex-shrink-0 text-rose-600 mt-0.5" />
            <div>
              <strong className="font-semibold">Lookup Error: </strong>
              {error}
            </div>
          </div>
        )}

        {cancelMessage && (
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-start gap-3 text-emerald-800 text-sm mb-6 animate-in fade-in">
            <CheckCircle2 className="w-5 h-5 flex-shrink-0 text-emerald-600 mt-0.5" />
            <div>{cancelMessage}</div>
          </div>
        )}

        {loading && (
          <div className="py-20 text-center text-stone-500">
            <Loader2 className="w-8 h-8 animate-spin mx-auto text-railway-800 mb-2" />
            <p className="text-sm">Querying database for PNR details...</p>
          </div>
        )}

        {booking && !loading && (
          <div className="space-y-6 animate-in zoom-in-95 duration-200">
            
            {/* Action Bar */}
            <div className="flex justify-between items-center print:hidden">
              <Link 
                href="/bookings"
                className="text-xs font-semibold text-stone-600 hover:text-stone-900 flex items-center gap-1.5"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to Bookings</span>
              </Link>

              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrint}
                  className="px-4 py-2 rounded-xl bg-white border border-stone-200 hover:bg-stone-50 text-xs font-semibold text-stone-700 flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Ticket</span>
                </button>

                {booking.reservation_status === 'Confirmed' && (
                  <button
                    onClick={handleCancel}
                    disabled={cancelling}
                    className="px-4 py-2 rounded-xl bg-rose-50 border border-rose-200 hover:bg-rose-100 text-xs font-semibold text-rose-700 flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
                  >
                    {cancelling ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Ban className="w-3.5 h-3.5" />}
                    <span>Cancel Ticket</span>
                  </button>
                )}
              </div>
            </div>

            {/* BOARDING PASS DIGITAL TICKET */}
            <div className="bg-white rounded-3xl border border-stone-200/90 shadow-xl overflow-hidden relative">
              
              {/* Top Boarding Pass Header */}
              <div className="bg-gradient-to-r from-railway-900 via-railway-800 to-railway-900 text-white p-6 sm:p-8 flex justify-between items-start sm:items-center flex-col sm:flex-row gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <Train className="w-5 h-5 text-emerald-300" />
                    <span className="font-bold tracking-wider text-xs uppercase text-emerald-200">
                      INDIAN RAILWAYS PASSENGER TICKET
                    </span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight mt-1 text-white">
                    {booking.train_name}
                  </h2>
                  <span className="text-xs text-stone-300 font-mono">
                    Train No: #{booking.train_id} • Superfast AC
                  </span>
                </div>

                <div className="text-left sm:text-right">
                  <span className="text-[10px] text-stone-400 uppercase tracking-widest block">PNR NUMBER</span>
                  <span className="font-mono text-xl sm:text-2xl font-black text-[#d9e944] tracking-wider block">
                    {booking.pnr}
                  </span>
                  <span className={`inline-block mt-1 px-3 py-0.5 rounded-full text-xs font-bold uppercase ${
                    booking.reservation_status === 'Confirmed'
                      ? 'bg-emerald-100 text-emerald-900'
                      : 'bg-rose-100 text-rose-900'
                  }`}>
                    {booking.reservation_status}
                  </span>
                </div>
              </div>

              {/* Journey Route Visual */}
              <div className="p-6 sm:p-8 border-b border-dashed border-stone-200 bg-[#fafaf8]">
                <div className="grid grid-cols-3 gap-4 items-center">
                  <div>
                    <span className="text-xs font-semibold text-stone-400 uppercase">Boarding Station</span>
                    <span className="text-2xl sm:text-3xl font-black text-stone-900 block mt-0.5">
                      {booking.source.substring(0, 3).toUpperCase()}
                    </span>
                    <span className="text-sm font-semibold text-stone-800 block">{booking.source}</span>
                    <span className="text-xs text-stone-500 font-mono mt-1 block">Departure: {booking.departure_time}</span>
                  </div>

                  <div className="flex flex-col items-center">
                    <span className="text-[11px] font-mono text-emerald-800 font-semibold mb-1">CONFIRMED</span>
                    <div className="w-full flex items-center justify-center relative">
                      <div className="h-[2px] w-full bg-stone-300" />
                      <div className="w-3 h-3 rounded-full bg-emerald-600 absolute" />
                    </div>
                    <span className="text-[10px] text-stone-400 mt-1">{booking.journey_date}</span>
                  </div>

                  <div className="text-right">
                    <span className="text-xs font-semibold text-stone-400 uppercase">Destination</span>
                    <span className="text-2xl sm:text-3xl font-black text-stone-900 block mt-0.5">
                      {booking.destination.substring(0, 3).toUpperCase()}
                    </span>
                    <span className="text-sm font-semibold text-stone-800 block">{booking.destination}</span>
                    <span className="text-xs text-stone-500 font-mono mt-1 block">Arrival: {booking.arrival_time}</span>
                  </div>
                </div>
              </div>

              {/* Passenger & Seat Details */}
              <div className="p-6 sm:p-8 grid grid-cols-2 sm:grid-cols-4 gap-6">
                <div>
                  <span className="text-xs text-stone-400 uppercase font-semibold block">Passenger</span>
                  <span className="text-base font-bold text-stone-900 block mt-0.5">{booking.passenger_name}</span>
                  <span className="text-xs text-stone-500">{booking.age} yrs • {booking.gender}</span>
                </div>

                <div>
                  <span className="text-xs text-stone-400 uppercase font-semibold block">Assigned Seat</span>
                  <span className="text-2xl font-black text-emerald-800 font-mono block mt-0.5">{booking.seat_number}</span>
                  <span className="text-xs text-stone-500">Coach {booking.seat_number.split('-')[0] || 'A1'}</span>
                </div>

                <div>
                  <span className="text-xs text-stone-400 uppercase font-semibold block">Payment Mode</span>
                  <span className="text-base font-bold text-stone-900 block mt-0.5">{booking.payment_mode}</span>
                  <span className="text-xs text-emerald-700 font-medium">Status: {booking.payment_status}</span>
                </div>

                <div>
                  <span className="text-xs text-stone-400 uppercase font-semibold block">Total Fare</span>
                  <span className="text-2xl font-black text-stone-900 block mt-0.5">₹{parseFloat(booking.payment_amount).toFixed(2)}</span>
                  <span className="text-[11px] text-stone-400">All Taxes Included</span>
                </div>
              </div>

              {/* Footer Audit Bar */}
              <div className="px-6 py-4 bg-stone-100 border-t border-stone-200 flex flex-col sm:flex-row justify-between items-center text-xs text-stone-500 gap-2 font-mono">
                <span>TXN: {booking.transaction_ref || 'INTERNAL-TXN-001'}</span>
                <span>Database ID: #{booking.reservation_id} • Logged via PostgreSQL Trigger</span>
              </div>

            </div>

          </div>
        )}

      </div>

      <BookingModal
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        onBookingSuccess={() => {
          if (booking) fetchPnr(booking.pnr);
        }}
      />
    </div>
  );
}

export default function PnrPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-railway-800" />
      </div>
    }>
      <PnrContent />
    </Suspense>
  );
}
