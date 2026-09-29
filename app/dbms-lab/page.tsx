'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import { 
  Database, Play, Terminal, CheckCircle2, AlertCircle, 
  Table, GitFork, Eye, Zap, Layers, RefreshCw, Loader2, Sparkles, BookOpen 
} from 'lucide-react';

export default function DbmsLabPage() {
  const [activeTab, setActiveTab] = useState<'demos' | 'custom' | 'schema' | 'audit'>('demos');
  const [selectedDemoKey, setSelectedDemoKey] = useState<string>('simple');
  const [customSql, setCustomSql] = useState<string>('SELECT * FROM Train WHERE Base_Fare > 1000;');
  const [queryResult, setQueryResult] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);

  const demoQueries = [
    {
      key: 'simple',
      title: 'Simple SELECT Query with Filter',
      category: 'Selection & Projection',
      description: 'Filters passengers older than 20 years. Directly implements PDF Page 3 example.',
      sql: 'SELECT * FROM Passenger WHERE Age > 20;'
    },
    {
      key: 'nested',
      title: 'Nested Query with IN Subquery',
      category: 'Subqueries',
      description: 'Finds passengers who have made at least one reservation. Directly implements PDF Page 3 example.',
      sql: 'SELECT Name FROM Passenger WHERE Passenger_ID IN (SELECT Passenger_ID FROM Reservation);'
    },
    {
      key: 'join',
      title: 'Two-Table Relational INNER JOIN',
      category: 'Joins',
      description: 'Combines Passenger and Reservation tables on Primary-Foreign Key match. Directly implements PDF Page 3 example.',
      sql: `SELECT P.Name, R.Reservation_ID, R.Seat_Number 
FROM Passenger P 
JOIN Reservation R ON P.Passenger_ID = R.Passenger_ID;`
    },
    {
      key: 'view',
      title: 'Querying SQL View (Passenger_Reservation_View)',
      category: 'Views',
      description: 'Accesses pre-compiled relational abstraction view. Directly implements PDF Page 3 example.',
      sql: 'SELECT * FROM Passenger_Reservation_View;'
    },
    {
      key: 'audit',
      title: 'Database Trigger Audit Trail (Reservation_Audit)',
      category: 'Triggers',
      description: 'Inspects rows generated automatically by trg_reservation_audit after reservation actions. Directly implements PDF Page 4 example.',
      sql: 'SELECT * FROM Reservation_Audit ORDER BY Audit_ID DESC;'
    },
    {
      key: 'complex_revenue',
      title: 'Analytical Aggregation (COUNT, SUM, GROUP BY)',
      category: 'Complex Queries',
      description: 'Calculates total passengers, confirmed count, and revenue per train.',
      sql: `SELECT 
    T.Train_ID,
    T.Train_Name,
    COUNT(R.Reservation_ID) AS Total_Bookings,
    COUNT(CASE WHEN R.Reservation_Status = 'Confirmed' THEN 1 END) AS Confirmed_Bookings,
    COALESCE(SUM(Pay.Amount), 0.00) AS Total_Revenue
FROM Train T
LEFT JOIN Reservation R ON T.Train_ID = R.Train_ID
LEFT JOIN Payment Pay ON R.Payment_ID = Pay.Payment_ID
GROUP BY T.Train_ID, T.Train_Name
ORDER BY Total_Revenue DESC;`
    }
  ];

  const runSelectedDemo = async (key: string) => {
    setSelectedDemoKey(key);
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/sql', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ demoKey: key }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to execute query');
      }
      setQueryResult(data);
    } catch (err: any) {
      setError(err.message || 'Execution error');
      setQueryResult(null);
    } finally {
      setLoading(false);
    }
  };

  const runCustomQuery = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/sql', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ customSql }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to execute custom SQL');
      }
      setQueryResult(data);
    } catch (err: any) {
      setError(err.message || 'Execution error');
      setQueryResult(null);
    } finally {
      setLoading(false);
    }
  };

  const loadAuditLogs = async () => {
    try {
      const res = await fetch('/api/audit');
      const data = await res.json();
      if (data.success) {
        setAuditLogs(data.data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    runSelectedDemo('simple');
    loadAuditLogs();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-[#fafaf7]">
      <Navbar />

      {/* Header Banner */}
      <div className="bg-railway-900 text-white py-12 border-b border-railway-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950 border border-emerald-700/60 text-xs font-semibold text-emerald-300 uppercase tracking-wider mb-2">
                <Database className="w-3.5 h-3.5" />
                <span>DBMS Capstone Viva & Lab</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                Relational SQL Engine & Query Explorer
              </h1>
              <p className="text-stone-300 text-sm mt-1 max-w-2xl">
                Execute and verify all academic DBMS operations described in the capstone PDF against real PostgreSQL tables.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <span className="px-3 py-1 rounded-xl bg-white/10 text-emerald-300 border border-white/20 text-xs font-mono">
                PostgreSQL 16 Engine Active
              </span>
            </div>
          </div>

          {/* Navigation Sub-Tabs */}
          <div className="flex flex-wrap gap-2 mt-8 pt-4 border-t border-railway-800">
            {[
              { id: 'demos', label: 'PDF Demonstration Queries', icon: Play },
              { id: 'custom', label: 'Interactive SQL Console', icon: Terminal },
              { id: 'audit', label: 'Trigger Audit Trail (Reservation_Audit)', icon: Zap },
              { id: 'schema', label: 'Relational Schema & Constraints', icon: Layers },
            ].map((tab) => {
              const IconComp = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id as any);
                    if (tab.id === 'audit') loadAuditLogs();
                  }}
                  className={`px-4 py-2.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 cursor-pointer ${
                    activeTab === tab.id
                      ? 'bg-[#d9e944] text-railway-950 shadow-md font-bold'
                      : 'bg-white/10 text-stone-300 hover:bg-white/20 hover:text-white'
                  }`}
                >
                  <IconComp className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex-1 w-full space-y-8">
        
        {/* ================================================================== */}
        {/* TAB 1: PDF DEMONSTRATION QUERIES                                   */}
        {/* ================================================================== */}
        {activeTab === 'demos' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Left: Query List */}
            <div className="lg:col-span-4 space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-2">
                Select Capstone Query
              </h3>
              {demoQueries.map((demo) => (
                <div
                  key={demo.key}
                  onClick={() => runSelectedDemo(demo.key)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                    selectedDemoKey === demo.key
                      ? 'bg-emerald-50 border-emerald-400 shadow-sm'
                      : 'bg-white border-stone-200/80 hover:bg-stone-50 hover:border-stone-300'
                  }`}
                >
                  <div className="flex justify-between items-center text-[10px] font-bold text-emerald-800 uppercase tracking-wider">
                    <span>{demo.category}</span>
                    {selectedDemoKey === demo.key && (
                      <span className="w-2 h-2 rounded-full bg-emerald-600 animate-ping" />
                    )}
                  </div>
                  <h4 className="text-sm font-bold text-stone-900 mt-1">
                    {demo.title}
                  </h4>
                  <p className="text-xs text-stone-500 mt-1 line-clamp-2">
                    {demo.description}
                  </p>
                </div>
              ))}
            </div>

            {/* Right: Execution Console & Results */}
            <div className="lg:col-span-8 space-y-6">
              
              {/* Query Details Card */}
              {queryResult && (
                <div className="bg-white rounded-3xl p-6 shadow-sm border border-stone-200/80 space-y-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800">
                        Executed Query Details
                      </span>
                      <h3 className="text-xl font-bold text-stone-900 mt-0.5">
                        {queryResult.title}
                      </h3>
                      <p className="text-xs text-stone-600 mt-1">
                        {queryResult.description}
                      </p>
                    </div>

                    <button
                      onClick={() => runSelectedDemo(selectedDemoKey)}
                      disabled={loading}
                      className="px-3.5 py-1.5 rounded-xl bg-railway-900 hover:bg-railway-800 text-white text-xs font-semibold shadow-sm transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
                      <span>Re-Execute</span>
                    </button>
                  </div>

                  {/* SQL Code Block */}
                  <div className="rounded-2xl bg-stone-950 p-4 font-mono text-xs text-emerald-400 border border-stone-800 shadow-inner overflow-x-auto">
                    <div className="text-[10px] text-stone-500 uppercase tracking-widest pb-1 border-b border-stone-800 mb-2 font-sans font-bold">
                      PostgreSQL DML / Query
                    </div>
                    <pre>{queryResult.sql}</pre>
                  </div>

                  {/* Results Count & Data Table */}
                  <div>
                    <div className="flex justify-between items-center py-2 text-xs text-stone-500">
                      <span>Records Returned: <strong className="text-stone-900">{queryResult.data?.length || 0} rows</strong></span>
                      <span className="text-emerald-700 font-medium">✓ Engine: PostgreSQL</span>
                    </div>

                    <div className="rounded-2xl border border-stone-200 overflow-hidden overflow-x-auto shadow-sm">
                      <table className="w-full text-left text-xs">
                        <thead className="bg-[#fafaf8] border-b border-stone-200 text-stone-700 uppercase font-semibold">
                          <tr>
                            {queryResult.data?.[0] && Object.keys(queryResult.data[0]).map((col) => (
                              <th key={col} className="px-4 py-3">{col}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-stone-100 bg-white">
                          {queryResult.data?.map((row: any, i: number) => (
                            <tr key={i} className="hover:bg-stone-50/80 transition-colors">
                              {Object.values(row).map((val: any, j: number) => (
                                <td key={j} className="px-4 py-3 font-mono text-stone-800">
                                  {val === null ? (
                                    <span className="text-stone-400 italic">NULL</span>
                                  ) : typeof val === 'object' ? (
                                    JSON.stringify(val)
                                  ) : (
                                    String(val)
                                  )}
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

          </div>
        )}

        {/* ================================================================== */}
        {/* TAB 2: INTERACTIVE CUSTOM SQL CONSOLE                              */}
        {/* ================================================================== */}
        {activeTab === 'custom' && (
          <div className="space-y-6">
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-stone-200/80 space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-bold text-stone-900">
                    Live SQL Terminal
                  </h3>
                  <p className="text-xs text-stone-500">
                    Type and execute queries directly against the live database tables: Passenger, Train, Station, Payment, Reservation, Train_Station.
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => { setCustomSql('SELECT * FROM Passenger_Reservation_View;'); }}
                    className="text-xs font-mono text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-lg hover:bg-emerald-100"
                  >
                    View Query
                  </button>
                  <button
                    onClick={() => { setCustomSql('SELECT * FROM Reservation_Audit ORDER BY Audit_ID DESC;'); }}
                    className="text-xs font-mono text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-lg hover:bg-emerald-100"
                  >
                    Audit Query
                  </button>
                </div>
              </div>

              <form onSubmit={runCustomQuery} className="space-y-3">
                <textarea
                  rows={4}
                  value={customSql}
                  onChange={(e) => setCustomSql(e.target.value)}
                  className="w-full p-4 rounded-2xl bg-stone-950 text-emerald-400 font-mono text-xs border border-stone-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  placeholder="SELECT * FROM ..."
                />
                <div className="flex justify-between items-center">
                  <span className="text-[11px] text-stone-400">
                    Tip: Use SELECT, JOIN, GROUP BY, or WHERE queries.
                  </span>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-6 py-2.5 rounded-xl bg-railway-900 hover:bg-railway-800 text-white text-xs font-semibold shadow-md flex items-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4 text-emerald-300" />}
                    <span>Run Query</span>
                  </button>
                </div>
              </form>

              {error && (
                <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-mono flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-600 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              {queryResult && (
                <div className="pt-4 border-t border-stone-100">
                  <div className="flex justify-between items-center mb-2 text-xs text-stone-500">
                    <span>Rows Returned: <strong className="text-stone-900">{queryResult.data?.length || 0}</strong></span>
                    <span className="text-emerald-700">Execution: Success</span>
                  </div>

                  <div className="rounded-2xl border border-stone-200 overflow-hidden overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-[#fafaf8] border-b border-stone-200 text-stone-700 uppercase font-semibold">
                        <tr>
                          {queryResult.data?.[0] && Object.keys(queryResult.data[0]).map((col) => (
                            <th key={col} className="px-4 py-3">{col}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-stone-100 bg-white">
                        {queryResult.data?.map((row: any, i: number) => (
                          <tr key={i} className="hover:bg-stone-50">
                            {Object.values(row).map((val: any, j: number) => (
                              <td key={j} className="px-4 py-3 font-mono text-stone-800">
                                {String(val)}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ================================================================== */}
        {/* TAB 3: TRIGGER AUDIT TRAIL                                         */}
        {/* ================================================================== */}
        {activeTab === 'audit' && (
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-stone-200/80 space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800">
                  AUTOMATED TRIGGER AUDITING
                </span>
                <h3 className="text-2xl font-bold text-stone-900 mt-0.5">
                  Reservation_Audit Log
                </h3>
                <p className="text-xs text-stone-500 mt-1 max-w-xl">
                  This table is populated automatically by the PostgreSQL database trigger (<code>trg_reservation_audit</code>) whenever a reservation is inserted, updated, or cancelled.
                </p>
              </div>

              <button
                onClick={loadAuditLogs}
                className="px-3.5 py-1.5 rounded-xl border border-stone-200 hover:bg-stone-50 text-xs font-semibold text-stone-700 flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Refresh Audit Logs</span>
              </button>
            </div>

            <div className="rounded-2xl border border-stone-200 overflow-hidden overflow-x-auto shadow-sm">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#fafaf8] border-b border-stone-200 text-stone-700 uppercase font-semibold">
                  <tr>
                    <th scope="col" className="px-4 py-3">AUDIT ID</th>
                    <th scope="col" className="px-4 py-3">RESERVATION ID</th>
                    <th scope="col" className="px-4 py-3">TRIGGER ACTION</th>
                    <th scope="col" className="px-4 py-3">ACTION TIME</th>
                    <th scope="col" className="px-4 py-3">AUDIT DETAILS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 bg-white">
                  {auditLogs.map((log) => (
                    <tr key={log.audit_id} className="hover:bg-stone-50">
                      <td className="px-4 py-3 font-mono font-bold text-stone-900">
                        #{log.audit_id}
                      </td>
                      <td className="px-4 py-3 font-mono font-semibold text-emerald-800">
                        RES-{log.reservation_id}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          log.action.includes('CREATED')
                            ? 'bg-emerald-100 text-emerald-800'
                            : log.action.includes('CANCELLED')
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}>
                          {log.action}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-stone-600 font-mono text-[11px]">
                        {log.action_time}
                      </td>
                      <td className="px-4 py-3 text-stone-700 font-sans text-xs">
                        {log.details}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ================================================================== */}
        {/* TAB 4: RELATIONAL SCHEMA & CONSTRAINTS                             */}
        {/* ================================================================== */}
        {activeTab === 'schema' && (
          <div className="space-y-6">
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-stone-200/80 space-y-4">
              <h3 className="text-xl font-bold text-stone-900">
                Database Relational Architecture & Constraints
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                As required by the capstone PDF, the relational schema models entities and relationships using strict primary keys, foreign keys, CHECK constraints, UNIQUE indexes, and DEFAULT clauses.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                {[
                  {
                    table: 'Passenger',
                    pk: 'Passenger_ID (SERIAL)',
                    fk: 'None',
                    constraints: 'Age CHECK(Age > 0 AND Age <= 120), Gender CHECK(Gender IN (...)), Phone_Number UNIQUE NOT NULL'
                  },
                  {
                    table: 'Train',
                    pk: 'Train_ID (INT)',
                    fk: 'None',
                    constraints: 'Train_Name NOT NULL, Source NOT NULL, Destination NOT NULL, CHECK(Source <> Destination)'
                  },
                  {
                    table: 'Station',
                    pk: 'Station_ID (INT)',
                    fk: 'None',
                    constraints: 'Station_Name NOT NULL, Location NOT NULL, Station_Code UNIQUE'
                  },
                  {
                    table: 'Payment',
                    pk: 'Payment_ID (SERIAL)',
                    fk: 'None',
                    constraints: 'Amount CHECK(Amount >= 0), Payment_Mode CHECK(IN (...)), Payment_Status CHECK(IN (...))'
                  },
                  {
                    table: 'Reservation',
                    pk: 'Reservation_ID (SERIAL)',
                    fk: 'Passenger_ID → Passenger, Train_ID → Train, Payment_ID → Payment',
                    constraints: 'UNIQUE(Train_ID, Journey_Date, Seat_Number) prevents duplicate bookings; PNR UNIQUE'
                  },
                  {
                    table: 'Train_Station',
                    pk: 'Composite: (Train_ID, Station_ID)',
                    fk: 'Train_ID → Train, Station_ID → Station',
                    constraints: 'Stop_Sequence CHECK(> 0), Halt_Minutes CHECK(>= 0)'
                  },
                  {
                    table: 'Reservation_Audit',
                    pk: 'Audit_ID (SERIAL)',
                    fk: 'Reservation_ID',
                    constraints: 'Populated strictly by PL/pgSQL Trigger trg_reservation_audit'
                  }
                ].map((item) => (
                  <div key={item.table} className="p-4 rounded-2xl bg-stone-50 border border-stone-200 text-xs space-y-1.5">
                    <div className="flex justify-between items-center">
                      <strong className="text-sm text-stone-900 font-bold">{item.table}</strong>
                      <span className="font-mono text-[10px] text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full font-semibold">Table</span>
                    </div>
                    <div><span className="text-stone-500">Primary Key:</span> <code className="text-emerald-800 font-mono font-semibold">{item.pk}</code></div>
                    <div><span className="text-stone-500">Foreign Keys:</span> <span className="text-stone-800">{item.fk}</span></div>
                    <div><span className="text-stone-500">Integrity Constraints:</span> <span className="text-stone-700 font-mono text-[11px] block mt-0.5">{item.constraints}</span></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
