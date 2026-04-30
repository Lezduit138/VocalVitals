import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import OfflineBanner from './OfflineBanner';
import { useLocation } from 'react-router-dom';
import { useEffect } from 'react';

export default function Layout() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <div className="min-h-screen flex flex-col relative w-full overflow-x-hidden">
      <OfflineBanner />
      <Navbar />
      <main className="flex-grow pt-8 pb-16 w-full">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
