'use client';

import React, { useEffect, useRef } from 'react';
import Icon from '@/components/ui/AppIcon';

const steps = [
  {
    num: '01',
    icon: 'ClipboardDocumentListIcon' as const,
    title: 'Pilih Paket',
    desc: 'Pilih ukuran paket — Isi 3, 6, 10, 16, atau 25. Tersedia varian Ori, Spicy, dan dengan Topping Keju.',
  },
  {
    num: '02',
    icon: 'ShoppingCartIcon' as const,
    title: 'Isi Form Order',
    desc: 'Isi nama, nomor WhatsApp, alamat, dan pesanan di form pemesanan. Cepat dan mudah, kurang dari 2 menit.',
  },
  {
    num: '03',
    icon: 'ChatBubbleLeftEllipsisIcon' as const,
    title: 'Konfirmasi via WhatsApp',
    desc: 'Pesananmu langsung diteruskan ke WhatsApp kami. Konfirmasi dan detail pembayaran akan dikirim dalam 5 menit.',
  },
  {
    num: '04',
    icon: 'TruckIcon' as const,
    title: 'Dimsum Siap Dinikmati',
    desc: 'Dimsum disiapkan segar dan dikirim ke alamatmu. Nikmati selagi hangat dengan chili oil yang sudah disertakan.',
  },
];

export default function CaraOrderSection() {
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
      { threshold: 0.08 }
    );
    const elements = sectionRef.current?.querySelectorAll('.reveal');
    elements?.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <section id="cara-order" ref={sectionRef} className="py-20 md:py-28 border-t border-[#E0CDA0] relative overflow-hidden bg-[#FFF8E1]">
      {/* Decorative bg number */}
      <div className="absolute top-10 right-6 md:right-14 opacity-[0.035] font-extrabold text-[10rem] md:text-[14rem] leading-none text-[#D32F2F] pointer-events-none select-none">
        HOW
      </div>
      <div className="absolute -bottom-10 -left-10 w-[300px] h-[300px] bg-[#FDD835]/15 rounded-full blur-[80px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 md:px-10 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">

          {/* Left — header + CTA */}
          <div className="lg:col-span-4 lg:sticky lg:top-32">
            <div className="reveal">
              <span className="text-xs font-bold uppercase tracking-[0.3em] text-[#D32F2F] mb-3 block">Cara Pesan</span>
              <h2 className="text-4xl md:text-5xl font-extrabold leading-tight tracking-tight text-[#1A1A1A] mb-6">
                Pesan dalam <br />
                <span className="text-red-gradient">4 Langkah</span>
                <br />
                <span className="text-[#1A1A1A]/20 font-light">Mudah.</span>
              </h2>
              <p className="text-[#1A1A1A]/55 text-base leading-relaxed mb-8">
                Dari pilih paket sampai dimsum tiba di tanganmu — semua bisa dilakukan lewat HP.
              </p>

              <div className="flex flex-col gap-3">
                <a
                  href="#order"
                  className="flex items-center justify-center gap-2 px-7 py-4 bg-[#D32F2F] text-white font-bold text-sm rounded-full hover:bg-[#B71C1C] transition-all duration-200 animate-pulse-glow shadow-lg shadow-[#D32F2F]/20 w-full sm:w-auto"
                >
                  <Icon name="ShoppingCartIcon" size={18} />
                  Pesan Sekarang
                </a>
                <a
                  href="https://wa.me/6287784451075?text=Halo%20Hepi%20Dimsum%2C%20saya%20mau%20order"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 px-7 py-4 border-2 border-[#1A1A1A]/12 text-[#1A1A1A] font-semibold text-sm rounded-full hover:border-[#D32F2F] hover:text-[#D32F2F] transition-all duration-200 w-full sm:w-auto bg-white"
                >
                  <Icon name="ChatBubbleLeftEllipsisIcon" size={18} />
                  Order via WhatsApp
                </a>
              </div>
            </div>
          </div>

          {/* Right — steps */}
          <div className="lg:col-span-8 flex flex-col gap-4">
            {steps.map((step, i) => (
              <div
                key={step.num}
                className="group flex items-start gap-6 p-6 md:p-7 bg-white border border-[#E0CDA0] rounded-2xl hover:border-[#D32F2F]/30 hover:shadow-lg hover:shadow-[#D32F2F]/5 transition-all duration-300 reveal card-shadow"
                style={{ transitionDelay: `${i * 0.12}s` }}
              >
                {/* Number + icon */}
                <div className="flex flex-col items-center gap-3 shrink-0">
                  <div className="w-14 h-14 rounded-2xl bg-[#D32F2F]/8 border border-[#D32F2F]/15 flex items-center justify-center group-hover:bg-[#D32F2F] group-hover:border-[#D32F2F] transition-all duration-300">
                    <Icon
                      name={step.icon}
                      size={24}
                      className="text-[#D32F2F] group-hover:text-white transition-colors duration-300"
                    />
                  </div>
                  <span className="text-xs font-black text-[#1A1A1A]/20 tracking-widest">{step.num}</span>
                </div>

                {/* Content */}
                <div className="flex-1 pt-1">
                  <h3 className="text-[#1A1A1A] text-xl font-bold mb-2 group-hover:translate-x-1 transition-transform duration-300">
                    {step.title}
                  </h3>
                  <p className="text-[#1A1A1A]/50 text-[15px] leading-relaxed">{step.desc}</p>
                </div>

                {/* Arrow */}
                <div className="shrink-0 mt-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <Icon name="ArrowRightIcon" size={20} className="text-[#D32F2F]" />
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}
