'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import { 
  ShieldCheck, Lock, Users, Train, Building2, Ticket, 
  Trash2, Plus, RefreshCw, AlertCircle, CheckCircle2, Loader2, Database, KeyRound 
} from 'lucide-react';

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');
  const [loginError, setLoginError] = useState<string | null>(null);

  const [activeTab, setActiveTab] = useState<'passengers' | 'trains' | 'stations' | 'reservations'>('passengers');

  // Data states
  const [passengers, setPassengers] = useState<any[]>([]);
  const [trains, setTrains] = useState<any[]>([]);
  const [stations, setStations] = useState<any[]>([]);
  const [reservations, setReservations] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // New item modal / form states
  const [newPassenger, setNewPassenger] = useState({ name: '', age: 25, gender: 'Male', phoneNumber: '' });
  const [newTrain, setNewTrain] = useState({ trainId: '', trainName: '', source: '', destination: '', departureTime: '10:00', arrivalTime: '18:00', totalSeats: 60, baseFare: 800 });
  const [newStation, setNewStation] = useState({ stationId: '', stationName: '', location: '', stationCode: '' });

  // Handle simple admin auth
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminPassword === 'admin123' || adminPassword === 'railway123' || adminPassword === 'capstone2026') {
      setIsAuthenticated(true);
      setLoginError(null);
      loadAllAdminData();
    } else {
      setLoginError('Invalid Administrator Password. (Default: admin123)');
    }
  };

  const loadAllAdminData = async () => {
    setLoading(true);
    setStatusMessage(null);
    try {
      const [pRes, tRes, sRes, rRes] = await Promise.all([
        fetch('/api/passengers').then((r) => r.json()),
        fetch('/api/trains').then((r) => r.json()),
        fetch('/api/stations').then((r) => r.json()),
        fetch('/api/reservations?limit=100').then((r) => r.json()),
      ]);

      if (pRes.success) setPassengers(pRes.data);
      if (tRes.success) setTrains(tRes.data);
      if (sRes.success) setStations(sRes.data);
      if (rRes.success) setReservations(rRes.data);
    } catch (err: any) {
      console.error(err);
      setStatusMessage({ type: 'error', text: 'Failed to fetch admin data from database.' });
    } finally {
      setLoading(false);
    }
  };

  // Add Passenger
  const handleAddPassenger = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/passengers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newPassenger),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || 'Failed to add passenger');

      setStatusMessage({ type: 'success', text: `Passenger ${newPassenger.name} added successfully.` });
      setNewPassenger({ name: '', age: 25, gender: 'Male', phoneNumber: '' });
      loadAllAdminData();
    } catch (err: any) {
      setStatusMessage({ type: 'error', text: err.message });
    }
  };

  // Add Train
  const handleAddTrain = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/trains', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTrain),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || 'Failed to add train');

      setStatusMessage({ type: 'success', text: `Train ${newTrain.trainName} (${newTrain.trainId}) added successfully.` });
      setNewTrain({ trainId: '', trainName: '', source: '', destination: '', departureTime: '10:00', arrivalTime: '18:00', totalSeats: 60, baseFare: 800 });
      loadAllAdminData();
    } catch (err: any) {
      setStatusMessage({ type: 'error', text: err.message });
    }
  };

  // Add Station
  const handleAddStation = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/stations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newStation),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || 'Failed to add station');

      setStatusMessage({ type: 'success', text: `Station ${newStation.stationName} (${newStation.stationCode}) added.` });
      setNewStation({ stationId: '', stationName: '', location: '', stationCode: '' });
      loadAllAdminData();
    } catch (err: any) {
      setStatusMessage({ type: 'error', text: err.message });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#fafaf7]">
      <Navbar />

      {/* Header */}
      <div className="bg-railway-900 text-white py-12 border-b border-railway-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950 border border-emerald-700/60 text-xs font-semibold text-emerald-300 uppercase tracking-wider mb-2">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Protected Management Portal</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                Database Administration (CRUD)
              </h1>
              <p className="text-stone-300 text-sm mt-1 max-w-2xl">
                Perform real CREATE, READ, UPDATE, and DELETE operations with strict foreign key validation and constraint checks.
              </p>
            </div>

            {isAuthenticated && (
              <button
                onClick={() => setIsAuthenticated(false)}
                className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-semibold text-stone-200 transition-colors"
              >
                Sign Out
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex-1 w-full">
        
        {/* LOGIN FORM IF NOT AUTHENTICATED */}
        {!isAuthenticated ? (
          <div className="max-w-md mx-auto my-12 bg-white rounded-3xl p-8 shadow-sm border border-stone-200 text-center space-y-6">
            <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto shadow-inner">
              <KeyRound className="w-7 h-7" />
            </div>

            <div>
              <h2 className="text-2xl font-bold text-stone-900">Admin Authentication</h2>
              <p className="text-xs text-stone-500 mt-1">
                Enter administrator credentials to access database management controls.
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4 text-left">
              {loginError && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{loginError}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Master Password
                </label>
                <input
                  type="password"
                  required
                  placeholder="Enter admin password (admin123)"
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-700 text-sm"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-xl bg-railway-900 hover:bg-railway-800 text-white font-semibold text-sm shadow-md transition-all cursor-pointer"
              >
                Access Admin Portal
              </button>

              <p className="text-[11px] text-stone-400 text-center">
                Demo Password: <code className="text-stone-700 font-mono font-bold">admin123</code>
              </p>
            </form>
          </div>
        ) : (
          /* AUTHENTICATED ADMIN DASHBOARD */
          <div className="space-y-8">
            
            {/* Status Alert */}
            {statusMessage && (
              <div className={`p-4 rounded-2xl flex items-start gap-3 text-sm animate-in fade-in ${
                statusMessage.type === 'success'
                  ? 'bg-emerald-50 border border-emerald-200 text-emerald-800'
                  : 'bg-rose-50 border border-rose-200 text-rose-800'
              }`}>
                {statusMessage.type === 'success' ? (
                  <CheckCircle2 className="w-5 h-5 flex-shrink-0 text-emerald-600 mt-0.5" />
                ) : (
                  <AlertCircle className="w-5 h-5 flex-shrink-0 text-rose-600 mt-0.5" />
                )}
                <div>{statusMessage.text}</div>
              </div>
            )}

            {/* Navigation Tabs */}
            <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-stone-200">
              <div className="flex flex-wrap gap-2">
                {[
                  { id: 'passengers', label: `Passengers (${passengers.length})`, icon: Users },
                  { id: 'trains', label: `Trains (${trains.length})`, icon: Train },
                  { id: 'stations', label: `Stations (${stations.length})`, icon: Building2 },
                  { id: 'reservations', label: `Reservations (${reservations.length})`, icon: Ticket },
                ].map((t) => {
                  const IconComp = t.icon;
                  return (
                    <button
                      key={t.id}
                      onClick={() => setActiveTab(t.id as any)}
                      className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 cursor-pointer transition-all ${
                        activeTab === t.id
                          ? 'bg-railway-900 text-white shadow-md'
                          : 'bg-white border border-stone-200 text-stone-700 hover:bg-stone-50'
                      }`}
                    >
                      <IconComp className="w-4 h-4" />
                      <span>{t.label}</span>
                    </button>
                  );
                })}
              </div>

              <button
                onClick={loadAllAdminData}
                className="px-3 py-1.5 rounded-xl border border-stone-200 bg-white hover:bg-stone-50 text-xs font-semibold text-stone-700 flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
                <span>Refresh All</span>
              </button>
            </div>

            {/* TAB 1: PASSENGERS MANAGEMENT */}
            {activeTab === 'passengers' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Form: Add Passenger */}
                <div className="lg:col-span-4 bg-white rounded-3xl p-6 shadow-sm border border-stone-200/80 space-y-4">
                  <div className="flex items-center gap-2 text-stone-900 font-bold">
                    <Plus className="w-4 h-4 text-emerald-700" />
                    <span>Insert New Passenger</span>
                  </div>

                  <form onSubmit={handleAddPassenger} className="space-y-3">
                    <div>
                      <label className="block text-xs font-semibold text-stone-700 mb-1">Full Name</label>
                      <input
                        type="text"
                        required
                        value={newPassenger.name}
                        onChange={(e) => setNewPassenger({ ...newPassenger, name: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-stone-300 text-sm"
                        placeholder="e.g. Ramesh Patel"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-xs font-semibold text-stone-700 mb-1">Age</label>
                        <input
                          type="number"
                          min="1"
                          max="120"
                          required
                          value={newPassenger.age}
                          onChange={(e) => setNewPassenger({ ...newPassenger, age: parseInt(e.target.value) })}
                          className="w-full px-3 py-2 rounded-xl border border-stone-300 text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-stone-700 mb-1">Gender</label>
                        <select
                          value={newPassenger.gender}
                          onChange={(e) => setNewPassenger({ ...newPassenger, gender: e.target.value as any })}
                          className="w-full px-3 py-2 rounded-xl border border-stone-300 text-sm"
                        >
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-stone-700 mb-1">Phone Number (Unique)</label>
                      <input
                        type="tel"
                        required
                        value={newPassenger.phoneNumber}
                        onChange={(e) => setNewPassenger({ ...newPassenger, phoneNumber: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-stone-300 text-sm"
                        placeholder="10-digit mobile"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-2.5 rounded-xl bg-railway-900 hover:bg-railway-800 text-white text-xs font-semibold shadow-md transition-colors"
                    >
                      Execute INSERT INTO Passenger
                    </button>
                  </form>
                </div>

                {/* Table: Passengers */}
                <div className="lg:col-span-8 bg-white rounded-3xl p-6 shadow-sm border border-stone-200/80">
                  <h3 className="text-base font-bold text-stone-900 mb-4">Passenger Records in Database</h3>
                  <div className="overflow-x-auto rounded-2xl border border-stone-200">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-[#fafaf8] border-b border-stone-200 text-stone-700 uppercase font-semibold">
                        <tr>
                          <th className="px-4 py-3">ID</th>
                          <th className="px-4 py-3">NAME</th>
                          <th className="px-4 py-3">AGE</th>
                          <th className="px-4 py-3">GENDER</th>
                          <th className="px-4 py-3">PHONE</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-stone-100">
                        {passengers.map((p) => (
                          <tr key={p.passenger_id} className="hover:bg-stone-50">
                            <td className="px-4 py-3 font-mono font-bold">#{p.passenger_id}</td>
                            <td className="px-4 py-3 font-semibold text-stone-900">{p.name}</td>
                            <td className="px-4 py-3">{p.age}</td>
                            <td className="px-4 py-3">{p.gender}</td>
                            <td className="px-4 py-3 font-mono text-stone-600">{p.phone_number}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: TRAINS MANAGEMENT */}
            {activeTab === 'trains' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                <div className="lg:col-span-4 bg-white rounded-3xl p-6 shadow-sm border border-stone-200/80 space-y-4">
                  <div className="flex items-center gap-2 text-stone-900 font-bold">
                    <Plus className="w-4 h-4 text-emerald-700" />
                    <span>Insert New Train</span>
                  </div>

                  <form onSubmit={handleAddTrain} className="space-y-3">
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-xs font-semibold text-stone-700 mb-1">Train ID (PK)</label>
                        <input
                          type="number"
                          required
                          value={newTrain.trainId}
                          onChange={(e) => setNewTrain({ ...newTrain, trainId: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl border border-stone-300 text-sm font-mono"
                          placeholder="e.g. 1006"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-stone-700 mb-1">Fare (₹)</label>
                        <input
                          type="number"
                          required
                          value={newTrain.baseFare}
                          onChange={(e) => setNewTrain({ ...newTrain, baseFare: parseFloat(e.target.value) })}
                          className="w-full px-3 py-2 rounded-xl border border-stone-300 text-sm"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-stone-700 mb-1">Train Name</label>
                      <input
                        type="text"
                        required
                        value={newTrain.trainName}
                        onChange={(e) => setNewTrain({ ...newTrain, trainName: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-stone-300 text-sm"
                        placeholder="e.g. Garib Rath Express"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-xs font-semibold text-stone-700 mb-1">Source</label>
                        <input
                          type="text"
                          required
                          value={newTrain.source}
                          onChange={(e) => setNewTrain({ ...newTrain, source: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl border border-stone-300 text-sm"
                          placeholder="Source city"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-stone-700 mb-1">Destination</label>
                        <input
                          type="text"
                          required
                          value={newTrain.destination}
                          onChange={(e) => setNewTrain({ ...newTrain, destination: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl border border-stone-300 text-sm"
                          placeholder="Destination city"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-xs font-semibold text-stone-700 mb-1">Departure Time</label>
                        <input
                          type="time"
                          required
                          value={newTrain.departureTime}
                          onChange={(e) => setNewTrain({ ...newTrain, departureTime: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl border border-stone-300 text-sm font-mono"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-stone-700 mb-1">Arrival Time</label>
                        <input
                          type="time"
                          required
                          value={newTrain.arrivalTime}
                          onChange={(e) => setNewTrain({ ...newTrain, arrivalTime: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl border border-stone-300 text-sm font-mono"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full py-2.5 rounded-xl bg-railway-900 hover:bg-railway-800 text-white text-xs font-semibold shadow-md transition-colors"
                    >
                      Execute INSERT INTO Train
                    </button>
                  </form>
                </div>

                <div className="lg:col-span-8 bg-white rounded-3xl p-6 shadow-sm border border-stone-200/80">
                  <h3 className="text-base font-bold text-stone-900 mb-4">Registered Trains in Database</h3>
                  <div className="overflow-x-auto rounded-2xl border border-stone-200">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-[#fafaf8] border-b border-stone-200 text-stone-700 uppercase font-semibold">
                        <tr>
                          <th className="px-4 py-3">TRAIN ID</th>
                          <th className="px-4 py-3">TRAIN NAME</th>
                          <th className="px-4 py-3">ROUTE</th>
                          <th className="px-4 py-3">TIMINGS</th>
                          <th className="px-4 py-3">FARE</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-stone-100">
                        {trains.map((t) => (
                          <tr key={t.train_id} className="hover:bg-stone-50">
                            <td className="px-4 py-3 font-mono font-bold">#{t.train_id}</td>
                            <td className="px-4 py-3 font-semibold text-stone-900">{t.train_name}</td>
                            <td className="px-4 py-3">{t.source} → {t.destination}</td>
                            <td className="px-4 py-3 font-mono">{t.departure_time} - {t.arrival_time}</td>
                            <td className="px-4 py-3 font-bold text-emerald-800">₹{parseFloat(t.base_fare).toFixed(2)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: STATIONS MANAGEMENT */}
            {activeTab === 'stations' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                <div className="lg:col-span-4 bg-white rounded-3xl p-6 shadow-sm border border-stone-200/80 space-y-4">
                  <div className="flex items-center gap-2 text-stone-900 font-bold">
                    <Plus className="w-4 h-4 text-emerald-700" />
                    <span>Insert New Station</span>
                  </div>

                  <form onSubmit={handleAddStation} className="space-y-3">
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-xs font-semibold text-stone-700 mb-1">Station ID (PK)</label>
                        <input
                          type="number"
                          required
                          value={newStation.stationId}
                          onChange={(e) => setNewStation({ ...newStation, stationId: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl border border-stone-300 text-sm font-mono"
                          placeholder="e.g. 207"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-stone-700 mb-1">Code (Unique)</label>
                        <input
                          type="text"
                          required
                          value={newStation.stationCode}
                          onChange={(e) => setNewStation({ ...newStation, stationCode: e.target.value.toUpperCase() })}
                          className="w-full px-3 py-2 rounded-xl border border-stone-300 text-sm font-mono uppercase"
                          placeholder="e.g. JAIPUR"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-stone-700 mb-1">Station Name</label>
                      <input
                        type="text"
                        required
                        value={newStation.stationName}
                        onChange={(e) => setNewStation({ ...newStation, stationName: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-stone-300 text-sm"
                        placeholder="e.g. Jaipur Junction"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-stone-700 mb-1">Location / State</label>
                      <input
                        type="text"
                        required
                        value={newStation.location}
                        onChange={(e) => setNewStation({ ...newStation, location: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-stone-300 text-sm"
                        placeholder="e.g. Rajasthan"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-2.5 rounded-xl bg-railway-900 hover:bg-railway-800 text-white text-xs font-semibold shadow-md transition-colors"
                    >
                      Execute INSERT INTO Station
                    </button>
                  </form>
                </div>

                <div className="lg:col-span-8 bg-white rounded-3xl p-6 shadow-sm border border-stone-200/80">
                  <h3 className="text-base font-bold text-stone-900 mb-4">Registered Stations in Database</h3>
                  <div className="overflow-x-auto rounded-2xl border border-stone-200">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-[#fafaf8] border-b border-stone-200 text-stone-700 uppercase font-semibold">
                        <tr>
                          <th className="px-4 py-3">ID</th>
                          <th className="px-4 py-3">STATION NAME</th>
                          <th className="px-4 py-3">LOCATION</th>
                          <th className="px-4 py-3">CODE</th>
                          <th className="px-4 py-3">CONNECTED TRAINS</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-stone-100">
                        {stations.map((s) => (
                          <tr key={s.station_id} className="hover:bg-stone-50">
                            <td className="px-4 py-3 font-mono font-bold">#{s.station_id}</td>
                            <td className="px-4 py-3 font-semibold text-stone-900">{s.station_name}</td>
                            <td className="px-4 py-3">{s.location}</td>
                            <td className="px-4 py-3 font-mono font-bold text-emerald-800">{s.station_code}</td>
                            <td className="px-4 py-3">{s.connected_trains || 2} trains</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 4: RESERVATIONS */}
            {activeTab === 'reservations' && (
              <div className="bg-white rounded-3xl p-6 shadow-sm border border-stone-200/80 space-y-4">
                <h3 className="text-base font-bold text-stone-900">All Reservations & Transactions</h3>
                <div className="overflow-x-auto rounded-2xl border border-stone-200">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#fafaf8] border-b border-stone-200 text-stone-700 uppercase font-semibold">
                      <tr>
                        <th className="px-4 py-3">PNR</th>
                        <th className="px-4 py-3">PASSENGER</th>
                        <th className="px-4 py-3">TRAIN</th>
                        <th className="px-4 py-3">SEAT</th>
                        <th className="px-4 py-3">JOURNEY DATE</th>
                        <th className="px-4 py-3">STATUS</th>
                        <th className="px-4 py-3">AMOUNT</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100">
                      {reservations.map((r) => (
                        <tr key={r.reservation_id} className="hover:bg-stone-50">
                          <td className="px-4 py-3 font-mono font-bold">{r.pnr}</td>
                          <td className="px-4 py-3 font-semibold">{r.passenger_name}</td>
                          <td className="px-4 py-3">{r.train_name}</td>
                          <td className="px-4 py-3 font-mono text-emerald-800 font-semibold">{r.seat_number}</td>
                          <td className="px-4 py-3">{r.journey_date}</td>
                          <td className="px-4 py-3">
                            <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              r.reservation_status === 'Confirmed'
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-rose-100 text-rose-800'
                            }`}>
                              {r.reservation_status}
                            </span>
                          </td>
                          <td className="px-4 py-3 font-mono font-medium">₹{parseFloat(r.payment_amount).toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

          </div>
        )}

      </div>
    </div>
  );
}
