import React from 'react';
import dynamic from 'next/dynamic';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const HeroSection = dynamic(() => import('@/app/components/HeroSection'));
const MenuSection = dynamic(() => import('@/app/components/MenuSection'));
const TestimoniSection = dynamic(() => import('@/app/components/TestimoniSection'));
const CaraOrderSection = dynamic(() => import('@/app/components/CaraOrderSection'));
const OrderFormSection = dynamic(() => import('@/app/components/OrderFormSection'));
const WhatsAppFAB = dynamic(() => import('@/app/components/WhatsAppFAB'));

export default function HomePage() {
  return (
    <div className="relative min-h-screen bg-background text-foreground overflow-x-hidden">
      {/* Decorative vertical lines */}
      <div className="vert-lines">
        <div className="vert-line" />
        <div className="vert-line hidden md:block" />
        <div className="vert-line hidden md:block" />
        <div className="vert-line" />
      </div>

      <Header />
      <main>
        <HeroSection />
        <MenuSection />
        <TestimoniSection />
        <CaraOrderSection />
        <OrderFormSection />
      </main>
      <Footer />
      <WhatsAppFAB />
    </div>
  );
}