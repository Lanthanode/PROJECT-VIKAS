'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import BookingModal from '@/components/BookingModal';
import { MapPin, Building2, Train, Search, ArrowRight, ShieldCheck } from 'lucide-react';

export default function StationsPage() {
  const [stations, setStations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [isBookingOpen, setIsBookingOpen] = useState(false);

  useEffect(() => {
    fetch('/api/stations')
      .then((r) => r.json())
      .then((data) => {
        if (data.success) {
          setStations(data.data);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const filteredStations = stations.filter(
    (s) =>
      s.station_name.toLowerCase().includes(search.toLowerCase()) ||
      s.location.toLowerCase().includes(search.toLowerCase()) ||
      s.station_code.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen flex flex-col bg-[#fafaf7]">
      <Navbar onOpenBookingModal={() => setIsBookingOpen(true)} />

      {/* Header Banner */}
      <div className="bg-railway-900 text-white py-12 border-b border-railway-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <span className="text-[11px] font-bold tracking-[0.2em] text-emerald-400 uppercase block mb-1">
            NETWORK TOPOLOGY
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Major Railway Stations
          </h1>
          <p className="text-stone-300 text-sm mt-1 max-w-xl">
            Sourced directly from the Station master table and connected through the Train_Station bridge entity.
          </p>

          {/* Quick Search */}
          <div className="mt-6 max-w-md">
            <div className="relative">
              <input
                type="text"
                placeholder="Search station by name, city, or code..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white text-stone-900 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-md"
              />
              <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
            </div>
          </div>
        </div>
      </div>

      {/* Grid Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex-1 w-full">
        <div className="flex justify-between items-center mb-6">
          <p className="text-sm font-medium text-stone-600">
            Registered Stations: <strong className="text-stone-900">{filteredStations.length}</strong>
          </p>
          <span className="text-xs text-stone-500 font-mono">Entity: Station & Train_Station</span>
        </div>

        {loading ? (
          <div className="py-20 text-center text-stone-500">
            <Building2 className="w-8 h-8 animate-bounce mx-auto text-railway-800 mb-2" />
            <p className="text-sm">Loading station catalog...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredStations.map((station) => (
              <div
                key={station.station_id}
                className="bg-white rounded-3xl p-7 shadow-sm border border-stone-200/80 hover:shadow-md hover:border-emerald-300 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex justify-between items-start">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-800 flex items-center justify-center font-bold">
                      <Building2 className="w-6 h-6 text-emerald-700" />
                    </div>
                    <span className="font-mono text-sm font-black px-2.5 py-1 rounded-lg bg-stone-100 text-stone-800 tracking-wider">
                      {station.station_code}
                    </span>
                  </div>

                  <h3 className="text-2xl font-bold text-stone-900 mt-4">
                    {station.station_name}
                  </h3>
                  <p className="text-sm text-stone-500 flex items-center gap-1.5 mt-1">
                    <MapPin className="w-4 h-4 text-emerald-700" />
                    <span>Location: {station.location}</span>
                  </p>
                </div>

                <div className="mt-8 pt-4 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500">
                  <span>Station ID: #{station.station_id}</span>
                  <span className="font-semibold text-emerald-800">
                    {station.connected_trains || 2} Connected Trains
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <BookingModal
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
      />
    </div>
  );
}
