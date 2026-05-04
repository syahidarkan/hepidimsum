'use client';

import React, { useEffect, useRef } from 'react';
import Icon from '@/components/ui/AppIcon';

const testimonials = [
  {
    id: 1,
    name: 'Dewi Rahayu',
    location: 'Jakarta Selatan',
    initials: 'DR',
    color: '#D32F2F',
    rating: 5,
    text: 'Dimsum mentai-nya enak banget! Sausnya nempel sempurna dan pas banget di lidah. Udah 3x order dan gak bosen-bosen. Yang spicy juga juara!',
    dish: 'Dimsum Mentai Spicy · Isi 10',
    date: '2 hari lalu',
  },
  {
    id: 2,
    name: 'Budi Santoso',
    location: 'Tangerang',
    initials: 'BS',
    color: '#1565C0',
    rating: 5,
    text: 'Order buat makan siang kantor, cepet banget datengnya dan masih hangat. Chili oil-nya nambah banget ke rasa. Recommended untuk yang suka pedas!',
    dish: 'Dimsum Mentai Ori · Isi 6',
    date: '5 hari lalu',
  },
  {
    id: 3,
    name: 'Sari Wulandari',
    location: 'Bekasi',
    initials: 'SW',
    color: '#6A1B9A',
    rating: 5,
    text: 'Yang versi keju-nya wajib coba! Mentai + keju meleleh = perfecto. Beli Isi 16 buat keluarga langsung habis dalam hitungan menit.',
    dish: 'Dimsum Mentai Keju · Isi 16',
    date: '1 minggu lalu',
  },
  {
    id: 4,
    name: 'Reza Firmansyah',
    location: 'Depok',
    initials: 'RF',
    color: '#2E7D32',
    rating: 5,
    text: 'Pesan Isi 25 buat arisan keluarga, semua pada suka! Harga terjangkau tapi kualitas gak murahan. Box packaging-nya juga rapi. Pasti repeat order.',
    dish: 'Dimsum Mentai Ori · Isi 25',
    date: '2 minggu lalu',
  },
];

function StarRating({ count }: { count: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Icon
          key={i}
          name="StarIcon"
          variant={i < count ? 'solid' : 'outline'}
          size={14}
          className={i < count ? 'text-[#FDD835]' : 'text-[#1A1A1A]/15'}
        />
      ))}
    </div>
  );
}

export default function TestimoniSection() {
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
    <section id="testimoni" ref={sectionRef} className="py-20 md:py-28 border-t border-[#E0CDA0] relative overflow-hidden bg-[#FFF8E1]">
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[#FDD835]/12 blur-[100px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 md:px-10 relative z-10">

        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-14 gap-6 reveal">
          <div>
            <span className="text-xs font-bold uppercase tracking-[0.3em] text-[#D32F2F] mb-3 block">Kata Mereka</span>
            <h2 className="text-4xl md:text-6xl font-extrabold leading-tight tracking-tight text-[#1A1A1A]">
              Pelanggan <br />
              <span className="text-[#1A1A1A]/20 font-light">Setia Kami.</span>
            </h2>
          </div>
          <div className="flex flex-col items-start md:items-end gap-1">
            <div className="flex items-center gap-2">
              <StarRating count={5} />
              <span className="text-[#D32F2F] font-black text-2xl">4.9</span>
            </div>
            <span className="text-[#1A1A1A]/40 text-sm">dari 1.000+ ulasan</span>
          </div>
        </div>

        {/* Testimonial grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {testimonials.map((t, i) => (
            <div
              key={t.id}
              className="group relative bg-white border border-[#E0CDA0] rounded-2xl p-7 hover:border-[#D32F2F]/25 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-[#D32F2F]/8 reveal overflow-hidden card-shadow"
              style={{ transitionDelay: `${i * 0.1}s` }}
            >
              {/* Top accent line */}
              <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#D32F2F] via-[#FDD835] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              <div className="relative z-10">
                {/* Top row */}
                <div className="flex items-start justify-between mb-5">
                  <div className="flex items-center gap-4">
                    {/* Avatar with initials */}
                    <div
                      className="w-12 h-12 rounded-full flex items-center justify-center text-white font-black text-sm shrink-0 shadow-sm"
                      style={{ backgroundColor: t.color }}
                    >
                      {t.initials}
                    </div>
                    <div>
                      <p className="text-[#1A1A1A] font-semibold text-base">{t.name}</p>
                      <p className="text-[#1A1A1A]/40 text-xs flex items-center gap-1 mt-0.5">
                        <Icon name="MapPinIcon" size={11} />
                        {t.location}
                      </p>
                    </div>
                  </div>
                  <StarRating count={t.rating} />
                </div>

                {/* Quote */}
                <p className="text-[#1A1A1A]/70 text-[15px] leading-relaxed mb-5">
                  &ldquo;{t.text}&rdquo;
                </p>

                {/* Footer */}
                <div className="flex items-center justify-between border-t border-[#E0CDA0] pt-4">
                  <span className="text-xs text-[#D32F2F] font-semibold flex items-center gap-1.5">
                    <Icon name="CheckCircleIcon" size={13} variant="solid" />
                    {t.dish}
                  </span>
                  <span className="text-xs text-[#1A1A1A]/30">{t.date}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
