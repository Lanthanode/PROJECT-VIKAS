'use client';

import React from 'react';
import Navbar from '@/components/Navbar';
import { 
  Database, BookOpen, ShieldCheck, CheckCircle2, 
  Layers, Terminal, Award, FileText, ArrowRight 
} from 'lucide-react';
import Link from 'next/link';

export default function AboutPage() {
  const vivaTopics = [
    {
      q: 'Why is a Relational Database (RDBMS) used for Railway Management?',
      a: 'Railway operations require strict ACID compliance (Atomicity, Consistency, Isolation, Durability) to prevent race conditions such as duplicate seat allocation, lost payment records, and orphan records. A relational database enforces integrity at the storage layer via Primary Keys, Foreign Keys, and CHECK constraints.'
    },
    {
      q: 'What is the purpose of the Train_Station bridge table?',
      a: 'The relationship between Trains and Stations is Many-to-Many (M:N)—a train visits multiple stations, and a station is served by multiple trains. In relational database normalization, an M:N relationship cannot be modeled directly with a single foreign key without data redundancy, so the Train_Station bridge entity resolves it into two 1:M relationships with a composite primary key (Train_ID, Station_ID).'
    },
    {
      q: 'How does the system prevent duplicate seat bookings?',
      a: 'The system enforces a composite UNIQUE constraint at the SQL table level: CONSTRAINT unique_train_journey_seat UNIQUE (Train_ID, Journey_Date, Seat_Number). Even if concurrent transactions attempt to book the same seat simultaneously, PostgreSQL rejects the second insertion with a duplicate key violation.'
    },
    {
      q: 'What does the database trigger (trg_reservation_audit) do?',
      a: 'Whenever a row is INSERTED, UPDATED, or DELETED in the Reservation table, the trigger automatically invokes the PL/pgSQL function trg_fn_reservation_audit(). This writes a permanent audit record into the Reservation_Audit table with the action type, previous status, new status, and exact timestamp without requiring application-level boilerplate.'
    },
    {
      q: 'What is the advantage of using Views like Passenger_Reservation_View?',
      a: 'Views provide logical data independence, simplify complex multi-table joins for frontend queries, and provide security by restricting direct table access while exposing only the necessary columns.'
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#fafaf7]">
      <Navbar />

      {/* Header Banner */}
      <div className="bg-railway-900 text-white py-14 border-b border-railway-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <span className="text-[11px] font-bold tracking-[0.2em] text-emerald-400 uppercase block mb-1">
            DBMS CAPSTONE PROJECT SPECIFICATION
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight">
            Railway Management System
          </h1>
          <p className="text-stone-300 text-base mt-2 max-w-2xl leading-relaxed">
            Real-Life Scenario: Indian Railways Passenger Reservation. Designed, modeled, and implemented with complete relational database integrity.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex-1 w-full space-y-12">
        
        {/* System Workflow */}
        <section className="bg-white rounded-3xl p-8 shadow-sm border border-stone-200/80 space-y-6">
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-emerald-700" />
            <h2 className="text-2xl font-bold text-stone-900">System Workflow (PDF Specification)</h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-center">
            {[
              { step: '1', title: 'Passenger', desc: 'Inputs traveler details' },
              { step: '2', title: 'Searches Train', desc: 'Queries source & dest' },
              { step: '3', title: 'Selects Train', desc: 'Chooses active train' },
              { step: '4', title: 'Reservation', desc: 'Assigns unique seat' },
              { step: '5', title: 'Makes Payment', desc: 'Records transaction' },
              { step: '6', title: 'Confirmation', desc: 'Issues PNR & triggers audit' },
            ].map((s) => (
              <div key={s.step} className="p-4 rounded-2xl bg-stone-50 border border-stone-200/80 space-y-1">
                <span className="w-6 h-6 rounded-full bg-railway-900 text-white font-mono text-xs font-bold inline-flex items-center justify-center">
                  {s.step}
                </span>
                <h4 className="text-sm font-bold text-stone-900 mt-1">{s.title}</h4>
                <p className="text-[11px] text-stone-500">{s.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Academic Viva Reference Q&A */}
        <section className="bg-white rounded-3xl p-8 shadow-sm border border-stone-200/80 space-y-6">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-emerald-700" />
            <h2 className="text-2xl font-bold text-stone-900">Academic Viva Reference Guide</h2>
          </div>
          <p className="text-xs text-stone-500">
            Core theoretical explanations for external examiners and viva evaluations.
          </p>

          <div className="space-y-4 pt-2">
            {vivaTopics.map((item, idx) => (
              <div key={idx} className="p-5 rounded-2xl bg-[#fafaf8] border border-stone-200/80 space-y-2">
                <h3 className="text-sm font-bold text-stone-900 flex items-start gap-2">
                  <span className="font-mono text-emerald-800">Q{idx + 1}:</span>
                  <span>{item.q}</span>
                </h3>
                <p className="text-xs text-stone-700 leading-relaxed pl-6">
                  {item.a}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Action Link */}
        <div className="flex justify-between items-center p-6 rounded-3xl bg-railway-900 text-white shadow-lg">
          <div>
            <h3 className="text-lg font-bold">Ready to test the database?</h3>
            <p className="text-xs text-stone-300">Run queries, view triggers, and examine sample data live in the lab.</p>
          </div>
          <Link
            href="/dbms-lab"
            className="px-5 py-2.5 rounded-xl bg-[#d9e944] text-railway-950 font-bold text-xs shadow-md hover:bg-[#cde235] transition-all flex items-center gap-1.5"
          >
            <span>Open DBMS Lab</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

      </div>
    </div>
  );
}
