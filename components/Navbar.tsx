'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Train, Menu, X, Database, Ticket, ShieldCheck, MapPin, ListFilter } from 'lucide-react';

interface NavbarProps {
  onOpenBookingModal?: () => void;
}

export default function Navbar({ onOpenBookingModal }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Trains', href: '/trains' },
    { name: 'Stations', href: '/stations' },
    { name: 'Bookings', href: '/bookings' },
    { name: 'PNR Status', href: '/pnr' },
    { name: 'DBMS Lab', href: '/dbms-lab' },
    { name: 'Admin', href: '/admin' },
    { name: 'About', href: '/about' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-stone-200/80 bg-[#fbfbfa]/90 backdrop-blur-md transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo matching PDF Page 6 */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-railway-800 to-railway-950 flex items-center justify-center text-white shadow-md shadow-railway-900/20 group-hover:scale-105 transition-transform">
              <Train className="w-5 h-5 text-emerald-300" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold tracking-tight text-stone-900">
                Railway<span className="text-emerald-700">MS</span>
              </span>
              <span className="text-[10px] font-semibold tracking-wider text-stone-500 uppercase">
                Management System
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'text-railway-900 font-semibold bg-emerald-50'
                      : 'text-stone-600 hover:text-railway-900 hover:bg-stone-100/60'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* Right Action: Book Ticket Button */}
          <div className="hidden sm:flex items-center gap-3">
            {onOpenBookingModal ? (
              <button
                onClick={onOpenBookingModal}
                className="px-5 py-2.5 rounded-xl bg-railway-900 hover:bg-railway-800 text-white text-sm font-medium shadow-md shadow-railway-950/20 transition-all hover:shadow-lg active:scale-95 flex items-center gap-2"
              >
                <Ticket className="w-4 h-4 text-emerald-300" />
                <span>Book Ticket</span>
              </button>
            ) : (
              <Link
                href="/trains"
                className="px-5 py-2.5 rounded-xl bg-railway-900 hover:bg-railway-800 text-white text-sm font-medium shadow-md shadow-railway-950/20 transition-all hover:shadow-lg active:scale-95 flex items-center gap-2"
              >
                <Ticket className="w-4 h-4 text-emerald-300" />
                <span>Book Ticket</span>
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-stone-700 hover:bg-stone-100 focus:outline-none"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-stone-200 bg-[#fbfbfa] px-4 pt-3 pb-6 space-y-2 shadow-lg animate-in slide-in-from-top duration-200">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className={`block px-3 py-2.5 rounded-lg text-base font-medium ${
                pathname === link.href
                  ? 'bg-emerald-50 text-railway-900 font-semibold'
                  : 'text-stone-700 hover:bg-stone-100'
              }`}
            >
              {link.name}
            </Link>
          ))}
          <div className="pt-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                if (onOpenBookingModal) onOpenBookingModal();
              }}
              className="w-full py-3 rounded-xl bg-railway-900 text-white font-medium text-center flex items-center justify-center gap-2"
            >
              <Ticket className="w-4 h-4 text-emerald-300" />
              <span>Book Ticket</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
