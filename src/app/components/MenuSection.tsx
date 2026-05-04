'use client';

import React, { useEffect, useRef } from 'react';
import AppImage from '@/components/ui/AppImage';
import Icon from '@/components/ui/AppIcon';

const packages = [
  { id: 1, num: '3',  label: 'Isi 3',  priceBase: 'Rp 15K', priceKeju: 'Rp 16K', featured: false },
  { id: 2, num: '6',  label: 'Isi 6',  priceBase: 'Rp 28K', priceKeju: 'Rp 30K', featured: false },
  { id: 3, num: '10', label: 'Isi 10', priceBase: 'Rp 48K', priceKeju: 'Rp 51K', featured: true  },
  { id: 4, num: '16', label: 'Isi 16', priceBase: 'Rp 78K', priceKeju: 'Rp 81K+', featured: false },
];

function PackageCard({ pkg, delay }: { pkg: typeof packages[0]; delay: string }) {
  return (
    <div
      className={`md:col-span-3 group relative rounded-2xl overflow-hidden h-[190px] md:h-[210px] cursor-pointer transition-all duration-300 hover:-translate-y-1 ${
        pkg.featured
          ? 'bg-[#FFF3CC] border-2 border-[#FDD835]/70 shadow-md hover:shadow-xl hover:shadow-[#FDD835]/20'
          : 'bg-white border border-[#D4B896] shadow-sm hover:shadow-xl hover:border-[#D32F2F]/30'
      }`}
    >
      {/* Watermark number */}
      <span
        className={`absolute -right-4 bottom-0 text-[110px] md:text-[130px] font-black leading-none pointer-events-none select-none transition-opacity duration-300 group-hover:opacity-[0.07] ${
          pkg.featured ? 'text-[#D32F2F]/[0.07]' : 'text-[#1A1A1A]/[0.05]'
        }`}
      >
        {pkg.num}
      </span>

      <div className="relative z-10 h-full flex flex-col justify-between p-5">
        {/* Top */}
        <div className="flex items-start justify-between">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#D32F2F] mb-1">Ori / Spicy</p>
            <h3 className="text-[28px] font-black text-[#1A1A1A] leading-none">{pkg.label}</h3>
          </div>
          {pkg.featured && (
            <span className="text-[10px] font-black uppercase tracking-wide text-[#D32F2F] bg-[#D32F2F]/10 px-2.5 py-1 rounded-full">
              Laris
            </span>
          )}
        </div>

        {/* Prices */}
        <div className="space-y-2 pt-3 border-t border-[#E8D5B0]/70">
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-[#1A1A1A]/45">Tanpa Topping</span>
            <span className={`text-base font-black ${pkg.featured ? 'text-[#D32F2F]' : 'text-[#D32F2F]'}`}>
              {pkg.priceBase}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-[#1A1A1A]/45">+ Topping Keju</span>
            <span className="text-sm font-semibold text-[#1A1A1A]/55">{pkg.priceKeju}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function MenuSection() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08, rootMargin: '0px 0px -5% 0px' }
    );
    const elements = sectionRef?.current?.querySelectorAll('.reveal');
    elements?.forEach((el) => observer?.observe(el));
    return () => observer?.disconnect();
  }, []);

  return (
    <section id="menu" ref={sectionRef} className="py-20 md:py-28 relative overflow-hidden bg-[#FFF8E1]">
      <div className="absolute top-1/3 right-0 w-[500px] h-[400px] bg-[#D32F2F]/4 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[300px] bg-[#FDD835]/8 blur-[100px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 md:px-10 relative z-10">

        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-14 gap-6 reveal">
          <div>
            <span className="text-xs font-bold uppercase tracking-[0.3em] text-[#D32F2F] mb-3 block">Menu Kami</span>
            <h2 className="text-4xl md:text-6xl font-extrabold leading-tight tracking-tight text-[#1A1A1A]">
              Pilih Paket <br />
              <span className="text-[#1A1A1A]/20 font-light">Favoritmu.</span>
            </h2>
          </div>
          <a
            href="#order"
            className="flex items-center gap-2 text-sm font-semibold text-[#D32F2F] hover:text-[#B71C1C] border-b border-[#D32F2F]/40 hover:border-[#B71C1C] pb-1 transition-all duration-200">
            Pesan Sekarang
            <Icon name="ArrowRightIcon" size={16} />
          </a>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-5">

          {/* Featured photo card — col-span-6 row-span-2 */}
          <div
            className="md:col-span-6 md:row-span-2 group relative rounded-2xl overflow-hidden cursor-pointer h-[300px] md:h-auto reveal border border-[#E0CDA0] hover:-translate-y-1 transition-all duration-300 hover:shadow-xl hover:shadow-black/10"
            style={{ transitionDelay: '0.05s' }}>

            <div className="absolute inset-0">
              <AppImage
                src="/assets/images/product.jpg"
                alt="Dimsum Mentai Hepi Dimsum"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-700"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            </div>

            <div className="absolute top-5 left-5 z-10 flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-[#D32F2F] text-white text-[10px] font-bold uppercase tracking-wider shadow">
                Mentai
              </span>
              <span className="px-3 py-1 rounded-full bg-[#FDD835] text-[#1A1A1A] text-[10px] font-bold uppercase tracking-wider shadow">
                + Chili Oil
              </span>
            </div>

            <div className="absolute bottom-0 left-0 right-0 p-6 z-10">
              <h3 className="text-white text-2xl md:text-3xl font-black tracking-tight mb-2">Dimsum Mentai</h3>
              <p className="text-white/65 text-sm mb-4 leading-relaxed">
                Dimsum kukus dengan saus mentai premium. Varian{' '}
                <span className="font-bold text-white">Ori</span>,{' '}
                <span className="font-bold text-[#FF7F7F]">Spicy</span>, dan{' '}
                <span className="font-bold text-[#FDD835]">Keju</span>.
              </p>
              <div className="flex items-center justify-between border-t border-white/12 pt-4">
                <div>
                  <span className="text-[10px] uppercase tracking-widest text-white/45">Harga mulai</span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-[#FDD835] font-black text-2xl">Rp 15K</span>
                    <span className="text-white/35 text-xs">/ Isi 3</span>
                  </div>
                </div>
                <a
                  href="#order"
                  className="flex items-center gap-1.5 px-5 py-2.5 bg-[#D32F2F] text-white text-xs font-bold rounded-full hover:bg-[#B71C1C] transition-colors shadow-lg">
                  <Icon name="PlusIcon" size={14} />
                  Pesan
                </a>
              </div>
            </div>
          </div>

          {/* Package cards */}
          {packages.map((pkg, i) => (
            <PackageCard key={pkg.id} pkg={pkg} delay={`${(i + 1) * 0.1}s`} />
          ))}

          {/* Isi 25 — full width banner */}
          <div
            className="md:col-span-12 group relative rounded-2xl overflow-hidden cursor-pointer reveal hover:-translate-y-1 transition-all duration-300"
            style={{ transitionDelay: '0.55s' }}>

            <div className="absolute inset-0 bg-gradient-to-r from-[#D32F2F] via-[#C62828] to-[#B71C1C]" />
            <div className="absolute inset-0 checkered-pattern opacity-[0.06]" />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[120px] font-black text-white/[0.06] leading-none pointer-events-none select-none hidden md:block">
              25
            </span>

            <div className="relative z-10 flex flex-col md:flex-row md:items-center px-6 py-5 md:px-10 md:py-0 md:h-[160px] gap-4 md:gap-10">

              {/* Title row — on mobile: title + pesan button side by side */}
              <div className="flex items-start justify-between md:block shrink-0">
                <div>
                  <p className="text-white/60 text-[10px] uppercase tracking-widest font-medium mb-1">Paket Terbesar</p>
                  <h3 className="text-white font-black text-3xl md:text-5xl leading-none">Isi 25</h3>
                  <p className="text-white/50 text-xs mt-1">Ori / Spicy</p>
                </div>
                <a
                  href="#order"
                  className="md:hidden flex items-center gap-1.5 px-4 py-2 bg-white text-[#D32F2F] text-[11px] font-black rounded-full hover:bg-[#FFF8E1] transition-colors shadow-lg shrink-0 ml-4">
                  <Icon name="ShoppingCartIcon" size={13} />
                  Pesan
                </a>
              </div>

              <div className="w-px h-14 bg-white/15 hidden md:block shrink-0" />

              {/* Prices — 2-col grid on mobile, flex-wrap on desktop */}
              <div className="grid grid-cols-2 md:flex md:flex-wrap flex-1 gap-x-6 gap-y-3">
                {[
                  { label: 'Tanpa Topping', price: 'Rp 118K' },
                  { label: 'Topping Keju ½', price: 'Rp 123K' },
                  { label: 'Topping Keju Full', price: 'Rp 125K' },
                  { label: 'Box Packaging', price: '+ Rp 5K' },
                ].map((item) => (
                  <div key={item.label}>
                    <span className="text-[10px] text-white/45 uppercase tracking-wider block leading-none mb-0.5">{item.label}</span>
                    <span className="text-base md:text-lg font-black text-[#FDD835]">{item.price}</span>
                  </div>
                ))}
              </div>

              <a
                href="#order"
                className="hidden md:flex items-center gap-2 px-6 py-3 bg-white text-[#D32F2F] text-xs font-black rounded-full hover:bg-[#FFF8E1] transition-colors shrink-0 shadow-lg">
                <Icon name="ShoppingCartIcon" size={15} />
                Pesan
              </a>
            </div>
          </div>

        </div>

        {/* Bottom notes */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3 reveal" style={{ transitionDelay: '0.6s' }}>
          {[
            'Semua paket sudah termasuk Chili Oil',
            'Isi 16 & 25: tersedia Box Packaging',
            'Tersedia Ori, Spicy & Keju',
          ].map((item) => (
            <div key={item} className="flex items-center gap-2 px-4 py-2 bg-white rounded-full border border-[#E0CDA0] shadow-sm">
              <Icon name="CheckCircleIcon" size={13} className="text-[#D32F2F]" variant="solid" />
              <span className="text-[11px] font-semibold text-[#1A1A1A]/55">{item}</span>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
