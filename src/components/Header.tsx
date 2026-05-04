'use client';

import React, { useState, useEffect } from 'react';
import AppLogo from '@/components/ui/AppLogo';
import Icon from '@/components/ui/AppIcon';
import Link from 'next/link';

const navLinks = [
  { label: 'Menu', href: '#menu' },
  { label: 'Testimoni', href: '#testimoni' },
  { label: 'Cara Order', href: '#cara-order' },
  { label: 'Kontak', href: '#kontak' },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  const handleNavClick = () => setMenuOpen(false);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? 'py-3 bg-[#FFF8E1]/95 backdrop-blur-xl border-b border-[#E0CDA0] shadow-md shadow-black/5'
            : 'py-5 bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-10 flex items-center justify-between">

          {/* Logo + Brand */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <AppLogo
              size={38}
              className="transition-transform duration-300 group-hover:scale-105"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            />
            <span className={`font-extrabold text-lg tracking-tight hidden sm:block transition-colors duration-500 ${
              scrolled ? 'text-[#1A1A1A]' : 'text-white drop-shadow-md'
            }`}>
              Hepi Dimsum
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className={`hidden md:flex items-center gap-1 px-5 py-2 rounded-full backdrop-blur-md transition-all duration-500 ${
            scrolled
              ? 'border border-[#E0CDA0] bg-white/80 shadow-sm'
              : 'border border-white/20 bg-white/10'
          }`}>
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.18em] rounded-full transition-all duration-200 ${
                  scrolled
                    ? 'text-[#1A1A1A]/55 hover:text-[#D32F2F] hover:bg-[#D32F2F]/6'
                    : 'text-white/75 hover:text-white hover:bg-white/10'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* CTA */}
          <div className="hidden md:flex items-center gap-3">
            <a
              href="#order"
              className="px-6 py-2.5 bg-[#D32F2F] text-white text-xs font-bold uppercase tracking-wider rounded-full hover:bg-[#B71C1C] transition-all duration-200 animate-pulse-glow shadow-md shadow-[#D32F2F]/30"
            >
              Pesan Sekarang
            </a>
          </div>

          {/* Mobile Hamburger */}
          <button
            className={`md:hidden w-10 h-10 flex items-center justify-center rounded-full border transition-all duration-300 ${
              scrolled
                ? 'border-[#E0CDA0] bg-white text-[#1A1A1A] shadow-sm'
                : 'border-white/25 bg-white/10 text-white backdrop-blur-sm'
            }`}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={menuOpen ? 'Tutup menu' : 'Buka menu'}
          >
            <Icon name={menuOpen ? 'XMarkIcon' : 'Bars3Icon'} size={20} />
          </button>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 z-40 bg-[#FFF8E1]/97 backdrop-blur-2xl flex flex-col items-center justify-center gap-8 transition-all duration-300 ${
          menuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        {/* Checkered accent top + bottom */}
        <div className="absolute top-0 left-0 right-0 h-2 checkered-pattern opacity-80" />
        <div className="absolute bottom-0 left-0 right-0 h-2 checkered-pattern opacity-80" />

        {navLinks.map((link, i) => (
          <Link
            key={link.href}
            href={link.href}
            onClick={handleNavClick}
            className="text-3xl font-black text-[#1A1A1A] hover:text-[#D32F2F] transition-colors tracking-tight"
            style={{ transitionDelay: `${i * 60}ms` }}
          >
            {link.label}
          </Link>
        ))}
        <a
          href="#order"
          onClick={handleNavClick}
          className="mt-4 px-10 py-4 bg-[#D32F2F] text-white font-bold text-base rounded-full hover:bg-[#B71C1C] transition-colors shadow-lg"
        >
          Pesan Sekarang
        </a>
      </div>
    </>
  );
}
