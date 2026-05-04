'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import AppImage from '@/components/ui/AppImage';
import Icon from '@/components/ui/AppIcon';

const menuOptions = [
  { id: 'isi3',  label: 'Isi 3',  price: 'Rp 15.000' },
  { id: 'isi6',  label: 'Isi 6',  price: 'Rp 28.000' },
  { id: 'isi10', label: 'Isi 10', price: 'Rp 48.000' },
  { id: 'isi16', label: 'Isi 16', price: 'Rp 78.000' },
  { id: 'isi25', label: 'Isi 25', price: 'Rp 118.000' },
];

const varianOptions = ['Ori', 'Spicy', 'Keju'];

type FormState = {
  nama: string;
  telepon: string;
  alamat: string;
  paket: string[];
  varian: string[];
  chilioil: boolean;
  catatan: string;
  buktiFile: File | null;
  buktiPreview: string | null;
};

const initialForm: FormState = {
  nama: '',
  telepon: '',
  alamat: '',
  paket: [],
  varian: [],
  chilioil: true,
  catatan: '',
  buktiFile: null,
  buktiPreview: null,
};

// Upload via internal proxy route → server meneruskan ke catbox.moe (bebas CORS)
async function uploadToCatbox(file: File): Promise<string | null> {
  try {
    const fd = new FormData();
    fd.append('file', file);
    const res = await fetch('/api/upload', { method: 'POST', body: fd });
    if (!res.ok) return null;
    const data = await res.json();
    return typeof data.url === 'string' && data.url.startsWith('https://') ? data.url : null;
  } catch {
    return null;
  }
}

export default function OrderFormSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [form, setForm] = useState<FormState>(initialForm);
  const [submitted, setSubmitted] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'done' | 'error'>('idle');
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);
  const [showFallbackModal, setShowFallbackModal] = useState(false);

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
      { threshold: 0.06 }
    );
    sectionRef.current?.querySelectorAll('.reveal').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    return () => {
      if (form.buktiPreview) URL.revokeObjectURL(form.buktiPreview);
    };
  }, [form.buktiPreview]);

  const togglePaket = (id: string) =>
    setForm((prev) => ({
      ...prev,
      paket: prev.paket.includes(id) ? prev.paket.filter((p) => p !== id) : [...prev.paket, id],
    }));

  const toggleVarian = (v: string) =>
    setForm((prev) => ({
      ...prev,
      varian: prev.varian.includes(v) ? prev.varian.filter((x) => x !== v) : [...prev.varian, v],
    }));

  const handleFileChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      if (form.buktiPreview) URL.revokeObjectURL(form.buktiPreview);
      setForm((prev) => ({ ...prev, buktiFile: file, buktiPreview: URL.createObjectURL(file) }));
      setUploadedUrl(null);
      // Upload segera saat file dipilih — supaya URL sudah siap waktu submit
      setUploadStatus('uploading');
      const url = await uploadToCatbox(file);
      setUploadedUrl(url);
      setUploadStatus(url ? 'done' : 'error');
    },
    [form.buktiPreview]
  );

  const removeBukti = () => {
    if (form.buktiPreview) URL.revokeObjectURL(form.buktiPreview);
    setForm((prev) => ({ ...prev, buktiFile: null, buktiPreview: null }));
    setUploadStatus('idle');
    setUploadedUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // Sepenuhnya synchronous — window.open dipanggil langsung dalam user gesture
  // Upload sudah selesai sebelumnya (eager upload saat file dipilih)
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const paketStr = form.paket
      .map((id) => {
        const pkg = menuOptions.find((m) => m.id === id);
        return `  - ${pkg?.label} (${pkg?.price})`;
      })
      .join('\n');

    const lines = [
      `Halo Hepi Dimsum! Saya mau order 😊`,
      ``,
      `Nama     : ${form.nama}`,
      `Telepon  : ${form.telepon}`,
      `Alamat   : ${form.alamat}`,
      ``,
      `Paket:`,
      paketStr,
      ``,
      `Varian   : ${form.varian.join(' & ')}`,
      `Chili Oil: ${form.chilioil ? 'Ya (termasuk)' : 'Tidak'}`,
      form.catatan ? `Catatan  : ${form.catatan}` : null,
      uploadedUrl
        ? `\n🧾 Bukti pembayaran:\n${uploadedUrl}`
        : form.buktiFile
        ? `\n📎 Bukti pembayaran menyusul di chat ini.`
        : null,
    ]
      .filter((l) => l !== null)
      .join('\n');

    // window.open dipanggil synchronous dalam event handler — tidak diblokir browser
    window.open(`https://wa.me/6287784451075?text=${encodeURIComponent(lines)}`, '_blank');

    if (form.buktiFile && !uploadedUrl) {
      setShowFallbackModal(true);
    } else {
      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 6000);
    }
  };

  const isUploadPending = form.buktiFile !== null && uploadStatus === 'uploading';
  const canSubmit = form.paket.length > 0 && form.varian.length > 0 && !isUploadPending;

  return (
    <>
      <section id="order" ref={sectionRef} className="py-20 md:py-28 border-t border-[#E0CDA0] relative overflow-hidden bg-[#FFF8E1]">
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-[#D32F2F]/4 blur-[100px] rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 md:px-10 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">

            {/* ── Left info ── */}
            <div className="lg:col-span-5 reveal">
              <span className="text-xs font-bold uppercase tracking-[0.3em] text-[#D32F2F] mb-3 block">Form Pemesanan</span>
              <h2 className="text-4xl md:text-5xl font-extrabold leading-tight tracking-tight text-[#1A1A1A] mb-6">
                Pesan <span className="text-red-gradient">Sekarang,</span>
                <br />
                <span className="text-[#1A1A1A]/20 font-light">Nikmati Nanti.</span>
              </h2>
              <p className="text-[#1A1A1A]/55 text-base leading-relaxed mb-8">
                Isi form di samping dan pesananmu akan langsung dikirim ke WhatsApp kami.
              </p>

              {/* Info cards */}
              <div className="flex flex-col gap-3 mb-8">
                {[
                  { icon: 'ClockIcon' as const, label: 'Jam Operasional', value: 'Setiap Hari, 09.00 – 21.00 WIB' },
                  { icon: 'DevicePhoneMobileIcon' as const, label: 'WhatsApp', value: '087784451075' },
                  { icon: 'CreditCardIcon' as const, label: 'Pembayaran', value: 'Transfer Bank · QRIS · COD' },
                ].map((info) => (
                  <div key={info.label} className="flex items-start gap-4 p-4 bg-white border border-[#E0CDA0] rounded-xl card-shadow">
                    <div className="w-10 h-10 rounded-xl bg-[#D32F2F]/8 flex items-center justify-center shrink-0">
                      <Icon name={info.icon} size={18} className="text-[#D32F2F]" />
                    </div>
                    <div>
                      <p className="text-[#1A1A1A]/40 text-[11px] uppercase tracking-wider mb-0.5">{info.label}</p>
                      <p className="text-[#1A1A1A] text-sm font-semibold">{info.value}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* QRIS */}
              <div className="bg-white border border-[#E0CDA0] rounded-2xl p-5 card-shadow mb-6">
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#D32F2F] mb-4">Bayar via QRIS</p>
                <div className="flex flex-col sm:flex-row items-center gap-5">
                  <div className="w-44 h-44 rounded-xl overflow-hidden border border-[#E0CDA0] shrink-0 bg-white flex items-center justify-center shadow-sm">
                    <AppImage
                      src="/assets/images/qris.jpg"
                      alt="QRIS Hepi Dimsum"
                      width={176}
                      height={176}
                      className="object-contain"
                    />
                  </div>
                  <div className="w-full text-center sm:text-left">
                    <p className="text-sm font-bold text-[#1A1A1A] mb-1">HEPI DIMSUM QR</p>
                    <p className="text-xs text-[#1A1A1A]/45 mb-1">NMID: ID1025457055297</p>
                    <p className="text-xs text-[#1A1A1A]/40 leading-relaxed mb-4">
                      Scan dengan e-wallet atau mobile banking apapun.
                    </p>
                    <a
                      href="/assets/images/qris.jpg"
                      download="QRIS-HepiDimsum.jpg"
                      className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#FFF8E1] border border-[#E0CDA0] rounded-full text-xs font-bold text-[#D32F2F] hover:bg-[#FFECB3] hover:border-[#FDD835] transition-all duration-200"
                    >
                      <Icon name="ArrowDownTrayIcon" size={13} />
                      Download QRIS
                    </a>
                  </div>
                </div>
              </div>

              {/* WA direct */}
              <a
                href="https://wa.me/6287784451075?text=Halo%20Hepi%20Dimsum%2C%20saya%20mau%20order"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 px-7 py-4 bg-[#25D366] text-white font-bold text-sm rounded-full hover:bg-[#1da851] transition-all duration-200 wa-btn shadow-lg shadow-[#25D366]/25"
              >
                <Icon name="ChatBubbleLeftEllipsisIcon" size={20} />
                Chat WhatsApp Langsung
              </a>
            </div>

            {/* ── Right form ── */}
            <div className="lg:col-span-7 reveal" style={{ transitionDelay: '0.15s' }}>
              <div className="bg-white border border-[#E0CDA0] rounded-2xl p-7 md:p-9 card-shadow-lg">

                {submitted ? (
                  <div className="flex flex-col items-center justify-center py-16 gap-4 text-center">
                    <div className="w-16 h-16 rounded-full bg-[#25D366]/15 flex items-center justify-center">
                      <Icon name="CheckCircleIcon" size={36} className="text-[#25D366]" variant="solid" />
                    </div>
                    <h3 className="text-[#1A1A1A] text-2xl font-bold">Pesanan Terkirim!</h3>
                    <p className="text-[#1A1A1A]/50 max-w-sm">
                      WhatsApp sudah terbuka dengan detail pesananmu. Kami akan segera konfirmasi.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                      <h3 className="text-[#1A1A1A] text-xl font-bold">Detail Pesananmu</h3>
                      <p className="text-[#1A1A1A]/40 text-sm mt-1">
                        Semua field wajib diisi kecuali catatan dan bukti bayar.
                      </p>
                    </div>

                    {/* Nama */}
                    <div>
                      <label className="block text-xs font-semibold text-[#1A1A1A]/50 uppercase tracking-wider mb-2">
                        Nama Lengkap
                      </label>
                      <input
                        type="text" required
                        placeholder="Contoh: Budi Santoso"
                        value={form.nama}
                        onChange={(e) => setForm({ ...form, nama: e.target.value })}
                        className="form-input w-full bg-[#FDF5E0] border border-[#E0CDA0] rounded-xl px-4 py-3.5 text-[#1A1A1A] text-sm placeholder:text-[#1A1A1A]/25 transition-all duration-200"
                      />
                    </div>

                    {/* Telepon */}
                    <div>
                      <label className="block text-xs font-semibold text-[#1A1A1A]/50 uppercase tracking-wider mb-2">
                        Nomor WhatsApp
                      </label>
                      <input
                        type="tel" required
                        placeholder="08xxxxxxxxxx"
                        value={form.telepon}
                        onChange={(e) => setForm({ ...form, telepon: e.target.value })}
                        className="form-input w-full bg-[#FDF5E0] border border-[#E0CDA0] rounded-xl px-4 py-3.5 text-[#1A1A1A] text-sm placeholder:text-[#1A1A1A]/25 transition-all duration-200"
                      />
                    </div>

                    {/* Alamat */}
                    <div>
                      <label className="block text-xs font-semibold text-[#1A1A1A]/50 uppercase tracking-wider mb-2">
                        Alamat Pengiriman
                      </label>
                      <textarea
                        required rows={2}
                        placeholder="Jl. ..., RT/RW, Kelurahan, Kota"
                        value={form.alamat}
                        onChange={(e) => setForm({ ...form, alamat: e.target.value })}
                        className="form-input w-full bg-[#FDF5E0] border border-[#E0CDA0] rounded-xl px-4 py-3.5 text-[#1A1A1A] text-sm placeholder:text-[#1A1A1A]/25 transition-all duration-200 resize-none"
                      />
                    </div>

                    {/* Pilih Paket — multi */}
                    <div>
                      <label className="block text-xs font-semibold text-[#1A1A1A]/50 uppercase tracking-wider mb-1">
                        Pilih Paket{' '}
                        <span className="normal-case text-[#1A1A1A]/30 font-normal tracking-normal">
                          — bisa pilih lebih dari satu
                        </span>
                      </label>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-2">
                        {menuOptions.map((item) => {
                          const selected = form.paket.includes(item.id);
                          return (
                            <button
                              key={item.id} type="button"
                              onClick={() => togglePaket(item.id)}
                              className={`relative text-left px-4 py-3 rounded-xl border text-xs font-medium transition-all duration-200 ${
                                selected
                                  ? 'border-[#D32F2F] bg-[#D32F2F]/8 ring-1 ring-[#D32F2F]/20'
                                  : 'border-[#E0CDA0] bg-[#FDF5E0] text-[#1A1A1A]/60 hover:border-[#D32F2F]/40'
                              }`}
                            >
                              {selected && (
                                <span className="absolute top-2 right-2 w-4 h-4 rounded-full bg-[#D32F2F] flex items-center justify-center">
                                  <Icon name="CheckIcon" size={10} className="text-white" />
                                </span>
                              )}
                              <span className="font-bold text-[#1A1A1A]">{item.label}</span>
                              <span className="block text-[10px] mt-0.5 text-[#1A1A1A]/40">{item.price}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Pilih Varian — multi */}
                    <div>
                      <label className="block text-xs font-semibold text-[#1A1A1A]/50 uppercase tracking-wider mb-1">
                        Varian{' '}
                        <span className="normal-case text-[#1A1A1A]/30 font-normal tracking-normal">
                          — bisa pilih lebih dari satu
                        </span>
                      </label>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {varianOptions.map((v) => {
                          const selected = form.varian.includes(v);
                          return (
                            <button
                              key={v} type="button"
                              onClick={() => toggleVarian(v)}
                              className={`flex items-center gap-2 px-5 py-2.5 rounded-full border text-xs font-bold transition-all duration-200 ${
                                selected
                                  ? 'border-[#D32F2F] bg-[#D32F2F] text-white shadow-md shadow-[#D32F2F]/20'
                                  : 'border-[#E0CDA0] bg-[#FDF5E0] text-[#1A1A1A]/60 hover:border-[#D32F2F]/50'
                              }`}
                            >
                              {selected && <Icon name="CheckIcon" size={12} className="text-white" />}
                              {v}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Chili Oil toggle */}
                    <div>
                      <label className="block text-xs font-semibold text-[#1A1A1A]/50 uppercase tracking-wider mb-2">
                        Chili Oil
                      </label>
                      <button
                        type="button"
                        onClick={() => setForm((prev) => ({ ...prev, chilioil: !prev.chilioil }))}
                        className={`flex items-center gap-3 px-5 py-3 rounded-xl border text-sm font-semibold transition-all duration-200 ${
                          form.chilioil
                            ? 'border-[#D32F2F] bg-[#D32F2F]/8 text-[#D32F2F]'
                            : 'border-[#E0CDA0] bg-[#FDF5E0] text-[#1A1A1A]/45'
                        }`}
                      >
                        <span
                          className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                            form.chilioil ? 'border-[#D32F2F] bg-[#D32F2F]' : 'border-[#E0CDA0]'
                          }`}
                        >
                          {form.chilioil && <Icon name="CheckIcon" size={11} className="text-white" />}
                        </span>
                        🌶️ Sertakan Chili Oil
                        <span className="ml-auto text-[10px] text-[#1A1A1A]/35 font-normal">(sudah termasuk)</span>
                      </button>
                    </div>

                    {/* Catatan */}
                    <div>
                      <label className="block text-xs font-semibold text-[#1A1A1A]/50 uppercase tracking-wider mb-2">
                        Catatan{' '}
                        <span className="normal-case font-normal text-[#1A1A1A]/30 tracking-normal">(opsional)</span>
                      </label>
                      <textarea
                        rows={2}
                        placeholder="Topping keju full, box packaging, extra chili oil, dll."
                        value={form.catatan}
                        onChange={(e) => setForm({ ...form, catatan: e.target.value })}
                        className="form-input w-full bg-[#FDF5E0] border border-[#E0CDA0] rounded-xl px-4 py-3.5 text-[#1A1A1A] text-sm placeholder:text-[#1A1A1A]/25 transition-all duration-200 resize-none"
                      />
                    </div>

                    {/* Bukti Pembayaran */}
                    <div>
                      <label className="block text-xs font-semibold text-[#1A1A1A]/50 uppercase tracking-wider mb-2">
                        Bukti Pembayaran{' '}
                        <span className="normal-case font-normal text-[#1A1A1A]/30 tracking-normal">(Maksimal Ukuran File 200 MB)</span>
                      </label>

                      {form.buktiPreview ? (
                        <div className="relative rounded-xl overflow-hidden border border-[#E0CDA0] bg-[#FDF5E0]">
                          <img
                            src={form.buktiPreview}
                            alt="Bukti pembayaran"
                            className="w-full max-h-48 object-contain"
                          />
                          {/* Status badge */}
                          {uploadStatus === 'uploading' && (
                            <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center gap-2">
                              <div className="w-8 h-8 rounded-full border-2 border-white border-t-transparent animate-spin" />
                              <span className="text-white text-xs font-semibold">Mengupload…</span>
                            </div>
                          )}
                          <button
                            type="button"
                            onClick={removeBukti}
                            className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/50 flex items-center justify-center hover:bg-black/70 transition-colors"
                          >
                            <Icon name="XMarkIcon" size={14} className="text-white" />
                          </button>
                          <div className="px-4 py-2 bg-[#FDF5E0] border-t border-[#E0CDA0] flex items-center justify-between">
                            <p className="text-[11px] text-[#1A1A1A]/50 flex items-center gap-1.5 truncate">
                              <Icon name="PaperClipIcon" size={11} />
                              <span className="truncate">{form.buktiFile?.name}</span>
                            </p>
                            {uploadStatus === 'done' && (
                              <span className="text-[10px] text-[#25D366] font-bold flex items-center gap-1 shrink-0">
                                <Icon name="CheckCircleIcon" size={11} variant="solid" />
                                URL siap
                              </span>
                            )}
                          </div>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="w-full flex flex-col items-center justify-center gap-2 py-7 rounded-xl border-2 border-dashed border-[#E0CDA0] bg-[#FDF5E0] hover:border-[#D32F2F]/40 hover:bg-[#FFF8E1] transition-all duration-200 text-[#1A1A1A]/40 hover:text-[#D32F2F]"
                        >
                          <Icon name="PhotoIcon" size={24} />
                          <span className="text-xs font-semibold">Upload bukti transfer / QRIS</span>
                          <span className="text-[10px]">JPG, PNG, WEBP — maks. 10MB</span>
                        </button>
                      )}
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleFileChange}
                      />
                      <p className="text-[10px] text-[#1A1A1A]/35 mt-2 leading-relaxed">
                        Foto akan diupload otomatis dan link-nya akan dimasukkan langsung ke pesan WhatsApp.
                      </p>
                    </div>

                    <button
                      type="submit"
                      disabled={!canSubmit}
                      className="w-full flex items-center justify-center gap-2.5 px-8 py-4 bg-[#D32F2F] text-white font-bold text-base rounded-full hover:bg-[#B71C1C] disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200 animate-pulse-glow shadow-lg shadow-[#D32F2F]/20"
                    >
                      {isUploadPending ? (
                        <>
                          <div className="w-5 h-5 rounded-full border-2 border-white border-t-transparent animate-spin" />
                          Mengupload bukti pembayaran…
                        </>
                      ) : (
                        <>
                          <Icon name="ShoppingCartIcon" size={20} />
                          Pesan Sekarang via WhatsApp
                        </>
                      )}
                    </button>
                    <p className="text-center text-xs text-[#1A1A1A]/30">
                      Dengan menekan tombol, kamu setuju dengan syarat &amp; ketentuan kami.
                    </p>
                  </form>
                )}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── Fallback modal bila upload gagal ── */}
      {showFallbackModal && form.buktiPreview && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setShowFallbackModal(false)}
        >
          <div
            className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <h4 className="font-bold text-[#1A1A1A] text-base">Lampirkan Bukti Bayar</h4>
                <p className="text-xs text-[#1A1A1A]/50 mt-0.5">Upload otomatis gagal — kirim manual</p>
              </div>
              <button
                onClick={() => {
                  setShowFallbackModal(false);
                  setSubmitted(true);
                  setTimeout(() => setSubmitted(false), 6000);
                }}
                className="w-8 h-8 rounded-full bg-[#F5E6C3] flex items-center justify-center hover:bg-[#E0CDA0] transition-colors"
              >
                <Icon name="XMarkIcon" size={16} className="text-[#1A1A1A]" />
              </button>
            </div>

            <div className="flex items-start gap-3 p-3 bg-[#FFF8E1] rounded-xl border border-[#E0CDA0] mb-4">
              <span className="text-xl leading-none mt-0.5">💬</span>
              <p className="text-xs text-[#1A1A1A]/65 leading-relaxed">
                WhatsApp sudah terbuka. Ketuk ikon <strong>📎 lampiran</strong> lalu kirim foto ini ke chat Hepi Dimsum.
              </p>
            </div>

            <div className="rounded-xl overflow-hidden border border-[#E0CDA0] mb-4">
              <img
                src={form.buktiPreview}
                alt="Bukti pembayaran"
                className="w-full max-h-52 object-contain bg-[#FDF5E0]"
              />
            </div>

            <div className="flex gap-2">
              <a
                href={form.buktiPreview}
                download={form.buktiFile?.name ?? 'bukti-pembayaran.jpg'}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-[#D32F2F] text-white text-xs font-bold rounded-full hover:bg-[#B71C1C] transition-colors"
              >
                <Icon name="ArrowDownTrayIcon" size={13} />
                Download Foto
              </a>
              <button
                onClick={() => {
                  setShowFallbackModal(false);
                  setSubmitted(true);
                  setTimeout(() => setSubmitted(false), 6000);
                }}
                className="flex-1 py-2.5 border border-[#E0CDA0] text-xs font-semibold text-[#1A1A1A]/60 rounded-full hover:bg-[#FFF8E1] transition-colors"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
