'use client';

import React, { useState, useEffect } from 'react';
import { X, CheckCircle2, AlertCircle, Train, Calendar, User, Phone, CreditCard, Sparkles, ArrowRight, Loader2 } from 'lucide-react';
import confetti from 'canvas-confetti';
import Link from 'next/link';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  preSelectedTrainId?: number;
  onBookingSuccess?: () => void;
}

export default function BookingModal({
  isOpen,
  onClose,
  preSelectedTrainId,
  onBookingSuccess,
}: BookingModalProps) {
  const [trains, setTrains] = useState<any[]>([]);
  const [stations, setStations] = useState<any[]>([]);
  const [loadingTrains, setLoadingTrains] = useState(false);

  // Form states
  const [name, setName] = useState('');
  const [age, setAge] = useState('21');
  const [gender, setGender] = useState<'Male' | 'Female' | 'Other'>('Male');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [fromStation, setFromStation] = useState('Delhi');
  const [toStation, setToStation] = useState('Mumbai');
  const [journeyDate, setJourneyDate] = useState('2026-09-15');
  const [selectedTrainId, setSelectedTrainId] = useState<string>('1001');
  const [seatPreference, setSeatPreference] = useState<'auto' | 'manual'>('auto');
  const [seatNumber, setSeatNumber] = useState('');
  const [occupiedSeats, setOccupiedSeats] = useState<string[]>([]);
  const [paymentMode, setPaymentMode] = useState<'UPI' | 'Card' | 'Net Banking'>('UPI');

  // Submission state
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [bookingResult, setBookingResult] = useState<any | null>(null);

  // Fetch trains and stations on load
  useEffect(() => {
    if (!isOpen) return;

    setLoadingTrains(true);
    Promise.all([
      fetch('/api/trains').then((r) => r.json()),
      fetch('/api/stations').then((r) => r.json()),
    ])
      .then(([trainsData, stationsData]) => {
        if (trainsData.success) {
          setTrains(trainsData.data);
          if (preSelectedTrainId) {
            setSelectedTrainId(preSelectedTrainId.toString());
            const t = trainsData.data.find((x: any) => x.train_id === preSelectedTrainId);
            if (t) {
              setFromStation(t.source);
              setToStation(t.destination);
            }
          }
        }
        if (stationsData.success) {
          setStations(stationsData.data);
        }
      })
      .catch((err) => console.error('Failed to load initial form data:', err))
      .finally(() => setLoadingTrains(false));
  }, [isOpen, preSelectedTrainId]);

  // Fetch occupied seats when train or date changes
  useEffect(() => {
    if (!selectedTrainId || !journeyDate) return;
    fetch(`/api/seats?trainId=${selectedTrainId}&date=${journeyDate}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.success) {
          setOccupiedSeats(data.data || []);
        }
      })
      .catch(() => setOccupiedSeats([]));
  }, [selectedTrainId, journeyDate]);

  // Auto-filter trains matching From/To selection
  const matchingTrains = trains.filter(
    (t) =>
      (!fromStation || t.source.toLowerCase().includes(fromStation.toLowerCase())) &&
      (!toStation || t.destination.toLowerCase().includes(toStation.toLowerCase()))
  );

  const selectedTrain = trains.find((t) => t.train_id === parseInt(selectedTrainId)) || trains[0];
  const fare = selectedTrain ? parseFloat(selectedTrain.base_fare || '1500') : 1500;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      const payload = {
        name,
        age: parseInt(age),
        gender,
        phoneNumber,
        trainId: parseInt(selectedTrainId),
        journeyDate,
        seatNumber: seatPreference === 'manual' && seatNumber ? seatNumber : undefined,
        paymentMode,
        amount: fare,
      };

      const res = await fetch('/api/reservations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to complete reservation');
      }

      setBookingResult(data.data);

      // Trigger celebratory confetti!
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#103B2B', '#22C55E', '#D9E944', '#0F766E']
        });
      } catch (err) {
        // ignore
      }

      if (onBookingSuccess) {
        onBookingSuccess();
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred during booking.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleReset = () => {
    setBookingResult(null);
    setError(null);
    setName('');
    setPhoneNumber('');
    setSeatNumber('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/60 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-xl bg-[#fdfdfc] rounded-3xl shadow-2xl border border-stone-200 overflow-hidden my-8"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Top Header matching PDF Page 8 */}
        <div className="px-8 pt-8 pb-4 flex items-center justify-between border-b border-stone-100">
          <div>
            <span className="text-[11px] font-bold tracking-widest text-emerald-800 uppercase">
              NEW RESERVATION
            </span>
            <h2 className="text-2xl font-bold tracking-tight text-stone-900 mt-0.5">
              Book your journey
            </h2>
          </div>
          <button
            onClick={handleReset}
            className="p-2 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded-full transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-8">
          
          {/* SUCCESS SCREEN */}
          {bookingResult ? (
            <div className="space-y-6 text-center animate-in zoom-in-95 duration-200">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div>
                <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 uppercase tracking-wide">
                  Confirmed in Database
                </span>
                <h3 className="text-2xl font-bold text-stone-900 mt-2">
                  Reservation Successful!
                </h3>
                <p className="text-sm text-stone-500 mt-1">
                  Ticket has been issued and stored in PostgreSQL with automated audit logging.
                </p>
              </div>

              {/* Boarding Pass Preview */}
              <div className="bg-gradient-to-br from-railway-900 to-railway-950 rounded-2xl p-6 text-white text-left shadow-lg relative overflow-hidden">
                <div className="flex justify-between items-center pb-4 border-b border-white/10">
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-emerald-300 font-semibold">PNR NUMBER</span>
                    <p className="font-mono text-xl font-bold tracking-wider text-white">{bookingResult.pnr}</p>
                  </div>
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#d9e944] text-railway-950 uppercase">
                    CONFIRMED
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4 py-4 border-b border-white/10 text-xs">
                  <div>
                    <span className="text-stone-400 block">PASSENGER</span>
                    <span className="font-semibold text-stone-100 text-sm">{bookingResult.passengerName}</span>
                  </div>
                  <div>
                    <span className="text-stone-400 block">TRAIN</span>
                    <span className="font-semibold text-stone-100 text-sm">{bookingResult.trainName} ({bookingResult.trainId})</span>
                  </div>
                  <div>
                    <span className="text-stone-400 block">ROUTE</span>
                    <span className="font-semibold text-stone-100 text-sm">{bookingResult.source} → {bookingResult.destination}</span>
                  </div>
                  <div>
                    <span className="text-stone-400 block">JOURNEY DATE & SEAT</span>
                    <span className="font-semibold text-emerald-300 text-sm">{bookingResult.journeyDate} • Seat {bookingResult.seatNumber}</span>
                  </div>
                  <div>
                    <span className="text-stone-400 block">PAYMENT MODE</span>
                    <span className="font-semibold text-stone-100">{bookingResult.paymentMode}</span>
                  </div>
                  <div>
                    <span className="text-stone-400 block">AMOUNT PAID</span>
                    <span className="font-semibold text-emerald-400 text-sm">₹{bookingResult.paymentAmount}</span>
                  </div>
                </div>

                <div className="pt-3 text-[10px] text-stone-400 flex items-center justify-between">
                  <span>Audit Trigger: Logged in Reservation_Audit</span>
                  <span>PostgreSQL ID: #{bookingResult.reservationId}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <Link
                  href={`/pnr?pnr=${bookingResult.pnr}`}
                  onClick={handleReset}
                  className="flex-1 py-3 px-4 rounded-xl bg-railway-900 text-white font-medium text-sm flex items-center justify-center gap-2 hover:bg-railway-800 transition-colors shadow-md"
                >
                  <span>View Full Digital Ticket</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <button
                  onClick={handleReset}
                  className="py-3 px-5 rounded-xl border border-stone-200 text-stone-700 text-sm font-medium hover:bg-stone-50 transition-colors"
                >
                  Book Another Ticket
                </button>
              </div>

            </div>
          ) : (
            /* BOOKING FORM matching PDF Page 8 */
            <form onSubmit={handleSubmit} className="space-y-5">
              
              {/* Error Alert */}
              {error && (
                <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 flex items-start gap-3 text-rose-800 text-sm animate-in fade-in">
                  <AlertCircle className="w-5 h-5 flex-shrink-0 text-rose-600 mt-0.5" />
                  <div>
                    <strong className="font-semibold">Booking Error: </strong>
                    {error}
                  </div>
                </div>
              )}

              {/* Passenger Name Field */}
              <div>
                <label className="block text-sm font-semibold text-stone-800 mb-1.5">
                  Passenger Name
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rahul Sharma or Muskaan Khoja"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-railway-800 focus:border-transparent text-stone-900 text-sm placeholder:text-stone-400 transition-all bg-white"
                  />
                  <User className="absolute right-3.5 top-3.5 w-4 h-4 text-stone-400 pointer-events-none" />
                </div>
              </div>

              {/* Age, Gender & Phone Number */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Age
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="120"
                    required
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-railway-800 text-stone-900 text-sm bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Gender
                  </label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value as any)}
                    className="w-full px-3 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-railway-800 text-stone-900 text-sm bg-white"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="10-digit mobile"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-railway-800 text-stone-900 text-sm bg-white"
                  />
                </div>
              </div>

              {/* From & To Stations matching PDF Page 8 */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-stone-800 mb-1.5">
                    From
                  </label>
                  <select
                    value={fromStation}
                    onChange={(e) => setFromStation(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-railway-800 text-stone-900 text-sm bg-white"
                  >
                    <option value="Delhi">Delhi</option>
                    <option value="Mumbai">Mumbai</option>
                    <option value="Chandigarh">Chandigarh</option>
                    <option value="Pune">Pune</option>
                    <option value="Varanasi">Varanasi</option>
                    <option value="Ahmedabad">Ahmedabad</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-stone-800 mb-1.5">
                    To
                  </label>
                  <select
                    value={toStation}
                    onChange={(e) => setToStation(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-railway-800 text-stone-900 text-sm bg-white"
                  >
                    <option value="Mumbai">Mumbai</option>
                    <option value="Delhi">Delhi</option>
                    <option value="Chandigarh">Chandigarh</option>
                    <option value="Pune">Pune</option>
                    <option value="Varanasi">Varanasi</option>
                    <option value="Ahmedabad">Ahmedabad</option>
                  </select>
                </div>
              </div>

              {/* Journey Date & Train matching PDF Page 8 */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-stone-800 mb-1.5">
                    Journey Date
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      required
                      value={journeyDate}
                      onChange={(e) => setJourneyDate(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-railway-800 text-stone-900 text-sm bg-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-stone-800 mb-1.5">
                    Train
                  </label>
                  <select
                    value={selectedTrainId}
                    onChange={(e) => setSelectedTrainId(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-railway-800 text-stone-900 text-sm bg-white"
                  >
                    {trains.map((t) => (
                      <option key={t.train_id} value={t.train_id}>
                        {t.train_id} — {t.train_name} ({t.source} → {t.destination})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Seat Selection */}
              <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-stone-700 uppercase tracking-wider">
                    Seat Assignment
                  </label>
                  <div className="flex items-center gap-3 text-xs">
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="radio"
                        name="seatPref"
                        checked={seatPreference === 'auto'}
                        onChange={() => setSeatPreference('auto')}
                        className="text-railway-900 focus:ring-railway-800"
                      />
                      <span className="text-stone-700">Auto (Next Available)</span>
                    </label>
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="radio"
                        name="seatPref"
                        checked={seatPreference === 'manual'}
                        onChange={() => setSeatPreference('manual')}
                        className="text-railway-900 focus:ring-railway-800"
                      />
                      <span className="text-stone-700">Select Specific</span>
                    </label>
                  </div>
                </div>

                {seatPreference === 'manual' ? (
                  <div className="pt-2">
                    <input
                      type="text"
                      placeholder="e.g. A1-10 or B2-15"
                      value={seatNumber}
                      onChange={(e) => setSeatNumber(e.target.value.toUpperCase())}
                      className="w-full px-3 py-2 rounded-xl border border-stone-300 text-sm uppercase font-mono"
                    />
                    <p className="text-[11px] text-stone-500 mt-1">
                      Currently booked seats on this date: {occupiedSeats.length > 0 ? occupiedSeats.join(', ') : 'None yet (All available)'}
                    </p>
                  </div>
                ) : (
                  <p className="text-xs text-stone-600">
                    System will automatically allocate an optimal vacant seat (e.g. A1-10, B1-04) during transaction.
                  </p>
                )}
              </div>

              {/* Payment Mode matching PDF Page 8 */}
              <div>
                <label className="block text-sm font-semibold text-stone-800 mb-1.5">
                  Payment Mode
                </label>
                <select
                  value={paymentMode}
                  onChange={(e) => setPaymentMode(e.target.value as any)}
                  className="w-full px-4 py-3 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-railway-800 text-stone-900 text-sm bg-white"
                >
                  <option value="UPI">UPI (Google Pay, PhonePe, Paytm)</option>
                  <option value="Card">Credit / Debit Card</option>
                  <option value="Net Banking">Net Banking</option>
                </select>
                <div className="flex justify-between items-center mt-2 px-1 text-xs text-stone-500">
                  <span>Ticket Fare: <strong className="text-stone-900 font-bold">₹{fare.toFixed(2)}</strong></span>
                  <span className="text-emerald-700 font-medium">✓ Instant SQL Confirmation</span>
                </div>
              </div>

              {/* Submit Button matching PDF Page 8 */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-4 rounded-xl bg-railway-900 hover:bg-railway-800 active:scale-[0.99] text-white text-base font-semibold shadow-lg shadow-railway-950/25 transition-all flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Writing to Database & Triggering Audit...</span>
                    </>
                  ) : (
                    <span>Confirm Reservation</span>
                  )}
                </button>
              </div>

            </form>
          )}

        </div>

      </div>
    </div>
  );
}
