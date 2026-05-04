'use client';

import React, { useState, useEffect } from 'react';
import Icon from '@/components/ui/AppIcon';

export default function WhatsAppFAB() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 300);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <a
      href="https://wa.me/6287784451075?text=Halo%20Hepi%20Dimsum%2C%20saya%20mau%20order"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat WhatsApp Hepi Dimsum"
      className={`fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-[#25D366] flex items-center justify-center shadow-xl shadow-black/20 hover:scale-110 transition-all duration-300 ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
      }`}
    >
      <Icon name="ChatBubbleLeftEllipsisIcon" size={26} className="text-white" />
      <span className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-20" />
    </a>
  );
}
