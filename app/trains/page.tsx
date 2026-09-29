'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import BookingModal from '@/components/BookingModal';
import { Train, Search, Calendar, MapPin, Clock, Ticket, ArrowRight, Filter } from 'lucide-react';

export default function TrainsPage() {
  const [trains, setTrains] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [date, setDate] = useState('2026-09-15');

  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [selectedTrainId, setSelectedTrainId] = useState<number | undefined>(undefined);

  const fetchTrains = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (from) params.set('from', from);
      if (to) params.set('to', to);

      const res = await fetch(`/api/trains?${params.toString()}`);
      const data = await res.json();
      if (data.success) {
        setTrains(data.data);
      }
    } catch (err) {
      console.error('Failed to fetch trains:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrains();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchTrains();
  };

  const handleBook = (trainId: number) => {
    setSelectedTrainId(trainId);
    setIsBookingOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#fafaf7]">
      <Navbar onOpenBookingModal={() => handleBook(1001)} />

      {/* Header Banner */}
      <div className="bg-railway-900 text-white py-12 border-b border-railway-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <span className="text-[11px] font-bold tracking-[0.2em] text-emerald-400 uppercase block mb-1">
            INDIAN RAILWAYS NETWORK
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Train Schedule & Availability
          </h1>
          <p className="text-stone-300 text-sm mt-1 max-w-xl">
            Live database records querying the Train and Train_Station tables with real-time seat tracking.
          </p>

          {/* Search Filter Bar */}
          <form onSubmit={handleSearch} className="mt-8 bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/15 grid grid-cols-1 sm:grid-cols-4 gap-3 text-stone-900">
            <div>
              <label className="block text-[10px] font-semibold text-emerald-300 uppercase tracking-wider mb-1">
                From Station
              </label>
              <input
                type="text"
                placeholder="e.g. Delhi"
                value={from}
                onChange={(e) => setFrom(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-[10px] font-semibold text-emerald-300 uppercase tracking-wider mb-1">
                To Station
              </label>
              <input
                type="text"
                placeholder="e.g. Mumbai"
                value={to}
                onChange={(e) => setTo(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-[10px] font-semibold text-emerald-300 uppercase tracking-wider mb-1">
                Journey Date
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div className="flex items-end">
              <button
                type="submit"
                className="w-full py-2.5 px-4 rounded-xl bg-[#d9e944] hover:bg-[#cbe034] text-railway-950 text-sm font-bold shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Search className="w-4 h-4" />
                <span>Search Trains</span>
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Main Trains List */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex-1 w-full">
        <div className="flex justify-between items-center mb-6">
          <p className="text-sm font-medium text-stone-600">
            Showing <strong className="text-stone-900">{trains.length}</strong> matching trains in PostgreSQL
          </p>
          <div className="flex items-center gap-2 text-xs text-stone-500">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>Real-time DB query</span>
          </div>
        </div>

        {loading ? (
          <div className="py-20 text-center text-stone-500">
            <Train className="w-8 h-8 animate-bounce mx-auto text-railway-800 mb-2" />
            <p className="text-sm">Fetching trains from database...</p>
          </div>
        ) : trains.length === 0 ? (
          <div className="py-20 text-center bg-white rounded-3xl border border-stone-200 p-8">
            <Train className="w-12 h-12 mx-auto text-stone-300 mb-3" />
            <h3 className="text-lg font-bold text-stone-800">No trains found</h3>
            <p className="text-sm text-stone-500 mt-1">Try searching for Delhi → Mumbai or clearing filters.</p>
            <button
              onClick={() => { setFrom(''); setTo(''); fetchTrains(); }}
              className="mt-4 px-4 py-2 rounded-xl bg-railway-900 text-white text-xs font-semibold"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {trains.map((train) => (
              <div
                key={train.train_id}
                className="bg-white rounded-3xl p-6 shadow-sm border border-stone-200/80 hover:shadow-md hover:border-emerald-300 transition-all flex flex-col md:flex-row md:items-center justify-between gap-6"
              >
                {/* Train Info */}
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-stone-100 text-stone-700 font-mono">
                      #{train.train_id}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 text-emerald-800">
                      Superfast Express
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-stone-900">
                    {train.train_name}
                  </h3>
                  <p className="text-xs text-stone-500">
                    Capacity: {train.total_seats || 60} Seats • Runs Daily
                  </p>
                </div>

                {/* Route Visualizer */}
                <div className="flex items-center gap-6 md:gap-10">
                  <div>
                    <span className="text-xs font-semibold text-stone-400 block uppercase">Departure</span>
                    <span className="text-2xl font-black text-stone-900 font-mono">{train.departure_time}</span>
                    <span className="text-xs font-medium text-stone-600 block">{train.source}</span>
                  </div>

                  <div className="flex flex-col items-center">
                    <span className="text-[10px] text-stone-400 font-mono mb-1">Direct</span>
                    <div className="w-24 sm:w-32 border-t-2 border-dashed border-stone-300 relative">
                      <Train className="w-4 h-4 text-emerald-700 absolute -top-2 left-1/2 -translate-x-1/2 bg-white px-0.5" />
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-xs font-semibold text-stone-400 block uppercase">Arrival</span>
                    <span className="text-2xl font-black text-stone-900 font-mono">{train.arrival_time}</span>
                    <span className="text-xs font-medium text-stone-600 block">{train.destination}</span>
                  </div>
                </div>

                {/* Pricing & Booking CTA */}
                <div className="flex md:flex-col items-center md:items-end justify-between border-t md:border-t-0 pt-4 md:pt-0 border-stone-100 gap-3">
                  <div className="text-left md:text-right">
                    <span className="text-[10px] text-stone-400 uppercase block">Base Fare</span>
                    <span className="text-xl font-extrabold text-emerald-900">
                      ₹{parseFloat(train.base_fare).toFixed(2)}
                    </span>
                  </div>

                  <button
                    onClick={() => handleBook(train.train_id)}
                    className="px-5 py-2.5 rounded-xl bg-railway-900 hover:bg-railway-800 text-white text-xs font-semibold shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <Ticket className="w-3.5 h-3.5 text-emerald-300" />
                    <span>Book Ticket</span>
                  </button>
                </div>

              </div>
            ))}
          </div>
        )}
      </div>

      <BookingModal
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        preSelectedTrainId={selectedTrainId}
        onBookingSuccess={() => fetchTrains()}
      />
    </div>
  );
}
