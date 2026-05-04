'use client';

import React, { useEffect, useRef } from 'react';
import AppImage from '@/components/ui/AppImage';
import Icon from '@/components/ui/AppIcon';

export default function HeroSection() {
  const bgRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      if (bgRef.current) bgRef.current.style.transform = `translateY(${y * 0.3}px)`;
      if (cardRef.current) cardRef.current.style.transform = `translateY(${y * 0.1}px)`;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <section className="relative w-full min-h-screen overflow-hidden flex items-center bg-black">

      {/* ── Background photo (parallax) ── */}
      <div ref={bgRef} className="absolute inset-0 z-0 will-change-transform scale-110">
        <AppImage
          src="/assets/images/product.jpg"
          alt="Dimsum Mentai Hepi Dimsum"
          fill
          priority
          className="object-cover animate-cinematic opacity-0"
          sizes="100vw"
        />
        {/* Layered overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/55 to-black/25" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/30 to-black/10" />
        {/* Red atmospheric glow */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[700px] h-[280px] bg-[#D32F2F]/12 blur-[120px] rounded-full" />
        <div className="absolute top-1/4 left-1/4 w-[400px] h-[200px] bg-[#FDD835]/5 blur-[100px] rounded-full" />
      </div>

      {/* Decorative checkered strip — top */}
      <div className="absolute top-0 left-0 right-0 h-1.5 checkered-pattern opacity-70 z-10" />

      {/* Content */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-10 pt-28 pb-16 md:pt-32 md:pb-24">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-6 items-center">

          {/* ── Left — Headline ── */}
          <div className="md:col-span-6 lg:col-span-7 flex flex-col">

            {/* Label */}
            <div className="flex items-center gap-3 mb-6 animate-slide-up delay-300">
              <span className="h-px w-8 bg-[#FDD835]" />
              <span className="text-xs font-bold uppercase tracking-[0.3em] text-[#FDD835]">Dimsum Mentai Pilihan</span>
            </div>

            {/* Headline */}
            <h1 className="font-extrabold leading-[0.88] tracking-tight text-white mb-0">
              <span className="block text-[16vw] md:text-[7.5rem] lg:text-[9rem] animate-slide-up delay-500 drop-shadow-2xl">
                HEPI
              </span>
              <div className="flex items-baseline gap-3 -mt-1 md:-mt-4 animate-slide-up delay-700">
                <span className="text-[16vw] md:text-[7.5rem] lg:text-[9rem] text-[#FDD835] font-extrabold drop-shadow-2xl">
                  DIM
                </span>
                <span className="text-[16vw] md:text-[7.5rem] lg:text-[9rem] text-white/25 font-light italic drop-shadow-2xl">
                  SUM
                </span>
              </div>
            </h1>

            {/* Variant badges */}
            <div className="flex flex-wrap items-center gap-2 mt-6 mb-6 animate-slide-up delay-1000">
              {['Ori', 'Spicy', 'Keju'].map((v) => (
                <span
                  key={v}
                  className="px-4 py-1.5 rounded-full bg-white/12 backdrop-blur-sm text-white text-xs font-bold tracking-wide border border-white/20">
                  {v}
                </span>
              ))}
              <span className="px-4 py-1.5 rounded-full bg-[#D32F2F] text-white text-xs font-bold tracking-wide shadow-md">
                + Chili Oil
              </span>
            </div>

            {/* Sub-copy */}
            <p className="text-white/75 text-base md:text-lg leading-relaxed max-w-md mb-8 animate-slide-up delay-1200">
              Dimsum kukus homemade dengan saus mentai pilihan. Tersedia 5 pilihan paket — mulai dari yang buat sendiri sampai buat keluarga.
            </p>

            {/* CTA row */}
            <div className="flex flex-col sm:flex-row gap-3 animate-slide-up delay-1500">
              <a
                href="#order"
                className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-8 py-4 bg-[#D32F2F] text-white font-bold text-sm rounded-full hover:bg-[#B71C1C] transition-all duration-200 animate-pulse-glow shadow-lg shadow-[#D32F2F]/40">
                <Icon name="ShoppingCartIcon" size={18} />
                Pesan Sekarang
              </a>
              <a
                href="#menu"
                className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-8 py-4 border border-white/25 text-white font-semibold text-sm rounded-full hover:bg-white/10 transition-all duration-200 backdrop-blur-sm">
                Lihat Menu
                <Icon name="ArrowRightIcon" size={16} />
              </a>
            </div>

            {/* Stats row — BESAR */}
            <div className="flex items-center gap-8 mt-8 pt-8 border-t border-white/12 animate-slide-up delay-1800">
              {[
                { label: 'Paket', value: '5+' },
                { label: 'Rating', value: '4.9★' },
                { label: 'Pelanggan', value: '1K+' },
              ].map((s) => (
                <div key={s.label}>
                  <span className="block text-[10px] uppercase tracking-widest text-white/40 mb-1">{s.label}</span>
                  <span className="text-3xl md:text-4xl font-black text-white leading-none">{s.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* ── Right — Product Photo Card ── */}
          <div className="md:col-span-6 lg:col-span-5 flex justify-center md:justify-end animate-slide-up delay-600">
            <div className="relative w-full max-w-[460px]">

              {/* Outer glow */}
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-[#FDD835]/20 via-[#D32F2F]/15 to-transparent blur-2xl -m-6 pointer-events-none" />

              {/* Checkered frame border */}
              <div className="absolute -inset-3 rounded-[28px] checkered-pattern opacity-30 pointer-events-none" />

              {/* Photo container */}
              <div ref={cardRef} className="relative rounded-3xl overflow-hidden shadow-2xl will-change-transform border-4 border-white/90">
                <AppImage
                  src="/assets/images/product.jpg"
                  alt="Dimsum Mentai Hepi Dimsum — kukus dengan saus mentai pilihan"
                  width={560}
                  height={440}
                  className="w-full h-[280px] sm:h-[340px] md:h-[400px] object-cover"
                />
                {/* Gradient at bottom for badges */}
                <div className="absolute bottom-0 left-0 right-0 h-28 bg-gradient-to-t from-black/70 to-transparent" />
                {/* Bottom badges */}
                <div className="absolute bottom-5 left-5 right-5 flex items-center justify-between z-10">
                  <div className="px-4 py-2 rounded-xl bg-white/90 backdrop-blur-sm shadow-md">
                    <p className="text-[10px] text-[#1A1A1A]/50 uppercase tracking-wider font-medium">Produk Unggulan</p>
                    <p className="text-sm font-black text-[#D32F2F] leading-tight">Dimsum Mentai</p>
                  </div>
                  <div className="px-4 py-2 rounded-xl bg-[#D32F2F] shadow-md text-center">
                    <p className="text-[10px] text-white/80 uppercase tracking-wider font-medium">Mulai dari</p>
                    <p className="text-sm font-black text-white leading-tight">Rp 15K</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-slide-up delay-2200 z-10">
        <span className="text-[10px] uppercase tracking-widest text-white/35">Scroll</span>
        <div className="w-px h-10 bg-gradient-to-b from-white/40 to-transparent" />
      </div>

      {/* Decorative checkered strip — bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-1.5 checkered-pattern opacity-70 z-10" />
    </section>
  );
}
