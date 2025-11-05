import { ReactNode } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 via-green-50 to-amber-50">
      {/* Swamp pattern background */}
      <div className="fixed inset-0 opacity-5 pointer-events-none overflow-hidden">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M10,10 Q30,50 10,90 Q50,70 90,90 Q70,50 90,10 Q50,30 10,10 Z' fill='%2365a30d' opacity='0.2'/%3E%3Cpath d='M20,20 Q40,55 20,85 Q55,65 85,85 Q65,55 85,20 Q55,40 20,20 Z' fill='%23525252' opacity='0.15'/%3E%3C/svg%3E")`,
          backgroundSize: '150px 150px',
        }} />
      </div>

      <div className="relative z-10 flex flex-col min-h-screen">
        <Header />
        <main className="flex-1">
          {children}
        </main>
        <Footer />
      </div>
    </div>
  );
}

