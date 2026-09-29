'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import BookingModal from '@/components/BookingModal';
import Link from 'next/link';
import { 
  Ticket, Search, RefreshCw, AlertCircle, CheckCircle2, 
  ExternalLink, Ban, Loader2, Filter 
} from 'lucide-react';

export default function BookingsPage() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [cancellingId, setCancellingId] = useState<string | null>(null);
  const [actionMessage, setActionMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const [isBookingOpen, setIsBookingOpen] = useState(false);

  const loadBookings = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/reservations?limit=100');
      const data = await res.json();
      if (data.success) {
        setBookings(data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBookings();
  }, []);

  const handleCancelBooking = async (pnrOrId: string, passengerName: string) => {
    if (!confirm(`Are you sure you want to cancel the reservation for ${passengerName} (${pnrOrId})? This will free the seat and trigger an audit entry.`)) {
      return;
    }

    setCancellingId(pnrOrId);
    setActionMessage(null);

    try {
      const res = await fetch(`/api/reservations/${pnrOrId}/cancel`, {
        method: 'POST',
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to cancel reservation');
      }

      setActionMessage({
        type: 'success',
        text: `Reservation ${pnrOrId} successfully cancelled. Seat has been made available and logged in Reservation_Audit.`,
      });

      // Reload bookings
      await loadBookings();
    } catch (err: any) {
      setActionMessage({
        type: 'error',
        text: err.message || 'Failed to cancel reservation.',
      });
    } finally {
      setCancellingId(null);
    }
  };

  const filteredBookings = bookings.filter((b) => {
    const q = search.toLowerCase();
    return (
      b.passenger_name?.toLowerCase().includes(q) ||
      b.pnr?.toLowerCase().includes(q) ||
      b.train_name?.toLowerCase().includes(q) ||
      b.seat_number?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="min-h-screen flex flex-col bg-[#fafaf7]">
      <Navbar onOpenBookingModal={() => setIsBookingOpen(true)} />

      {/* Header Banner */}
      <div className="bg-railway-900 text-white py-12 border-b border-railway-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-[11px] font-bold tracking-[0.2em] text-emerald-400 uppercase block mb-1">
                PASSENGER TRANSACTIONS
              </span>
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                Reservation & Booking Records
              </h1>
              <p className="text-stone-300 text-sm mt-1 max-w-xl">
                Queried from Reservation joined with Passenger, Train, and Payment tables. Supports live cancellation and PNR retrieval.
              </p>
            </div>

            <button
              onClick={() => setIsBookingOpen(true)}
              className="px-5 py-2.5 rounded-xl bg-[#d9e944] hover:bg-[#cbe034] text-railway-950 text-sm font-bold shadow-md transition-all flex items-center gap-2 self-start sm:self-auto cursor-pointer"
            >
              <Ticket className="w-4 h-4" />
              <span>Book New Ticket</span>
            </button>
          </div>

          {/* Search Filter */}
          <div className="mt-8 max-w-lg">
            <div className="relative">
              <input
                type="text"
                placeholder="Search by Passenger Name, PNR, Train, or Seat..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white text-stone-900 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-md"
              />
              <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Table Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex-1 w-full">
        
        {/* Action Alert */}
        {actionMessage && (
          <div className={`p-4 rounded-2xl mb-6 flex items-start gap-3 text-sm animate-in fade-in ${
            actionMessage.type === 'success' 
              ? 'bg-emerald-50 border border-emerald-200 text-emerald-800' 
              : 'bg-rose-50 border border-rose-200 text-rose-800'
          }`}>
            {actionMessage.type === 'success' ? (
              <CheckCircle2 className="w-5 h-5 flex-shrink-0 text-emerald-600 mt-0.5" />
            ) : (
              <AlertCircle className="w-5 h-5 flex-shrink-0 text-rose-600 mt-0.5" />
            )}
            <div>{actionMessage.text}</div>
          </div>
        )}

        <div className="flex justify-between items-center mb-6">
          <p className="text-sm font-medium text-stone-600">
            Total Records: <strong className="text-stone-900">{filteredBookings.length}</strong>
          </p>
          <button
            onClick={loadBookings}
            className="px-3 py-1.5 rounded-xl border border-stone-200 bg-white hover:bg-stone-50 text-xs font-semibold text-stone-700 flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh Table</span>
          </button>
        </div>

        {/* Table Container */}
        <div className="bg-white rounded-3xl shadow-sm border border-stone-200/80 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-[#fafaf8] border-b border-stone-200/80 text-[11px] font-bold tracking-wider text-stone-500 uppercase">
                <tr>
                  <th scope="col" className="px-6 py-4">PNR / ID</th>
                  <th scope="col" className="px-6 py-4">PASSENGER</th>
                  <th scope="col" className="px-6 py-4">TRAIN & ROUTE</th>
                  <th scope="col" className="px-6 py-4">SEAT</th>
                  <th scope="col" className="px-6 py-4">JOURNEY DATE</th>
                  <th scope="col" className="px-6 py-4">STATUS</th>
                  <th scope="col" className="px-6 py-4">PAYMENT</th>
                  <th scope="col" className="px-6 py-4 text-right">ACTIONS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {filteredBookings.map((b) => (
                  <tr key={b.reservation_id} className="hover:bg-stone-50/70 transition-colors">
                    <td className="px-6 py-4 font-mono font-bold text-stone-900">
                      {b.pnr || `RES-${b.reservation_id}`}
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-semibold text-stone-900 block">{b.passenger_name}</span>
                      <span className="text-xs text-stone-400 font-mono block">{b.phone_number}</span>
                    </td>
                    <td className="px-6 py-4 text-stone-700">
                      <span className="font-medium block text-stone-900">{b.train_name}</span>
                      <span className="text-xs text-stone-500 block">{b.source} → {b.destination}</span>
                    </td>
                    <td className="px-6 py-4 font-mono font-semibold text-emerald-800">
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
                    <td className="px-6 py-4 text-right space-x-2">
                      <Link
                        href={`/pnr?pnr=${b.pnr || b.reservation_id}`}
                        className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-800 hover:text-emerald-950 bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-lg transition-colors"
                      >
                        <span>Ticket</span>
                        <ExternalLink className="w-3 h-3" />
                      </Link>

                      {b.reservation_status === 'Confirmed' && (
                        <button
                          onClick={() => handleCancelBooking(b.pnr || b.reservation_id, b.passenger_name)}
                          disabled={cancellingId === (b.pnr || b.reservation_id)}
                          className="inline-flex items-center gap-1 text-xs font-semibold text-rose-700 hover:text-rose-900 bg-rose-50 hover:bg-rose-100 px-3 py-1.5 rounded-lg transition-colors disabled:opacity-50 cursor-pointer"
                        >
                          {cancellingId === (b.pnr || b.reservation_id) ? (
                            <Loader2 className="w-3 h-3 animate-spin" />
                          ) : (
                            <Ban className="w-3 h-3" />
                          )}
                          <span>Cancel</span>
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      <BookingModal
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        onBookingSuccess={() => loadBookings()}
      />
    </div>
  );
}
