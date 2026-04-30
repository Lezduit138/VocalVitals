import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '../ui/Button';
import { Activity, Menu, X, LogOut } from 'lucide-react';
import { useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { logoutUser } from '../../services/authService';
import { useStore } from '../../store';
import { cn } from '../../utils/cn';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const isOffline = useStore((state) => state.isOffline);
  const [user, setUser] = useState(null);

  useEffect(() => {
    import('../../lib/firebase').then(({ auth }) => {
      const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
        setUser(currentUser);
      });
      return () => unsubscribe();
    });
  }, []);

  const handleLogout = async () => {
    await logoutUser();
    setIsOpen(false);
    navigate('/login');
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Analyze', path: '/analyze' },
    { name: 'Doctors', path: '/doctors' },
    { name: 'Conditions', path: '/conditions' },
  ];

  return (
    <nav className="sticky top-0 z-40 w-full backdrop-blur-md bg-background/80 border-b border-white/5 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center relative overflow-hidden">
              <Activity className="w-6 h-6 text-primary relative z-10" />
              <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full group-hover:scale-150 transition-transform duration-500"></div>
            </div>
            <span className="font-display text-2xl tracking-wide text-white">VOCALVITALS</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-primary",
                  location.pathname === link.path ? "text-primary" : "text-text-muted"
                )}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <div className="flex items-center space-x-2 mr-4">
              <span className="relative flex h-3 w-3">
                <span className={cn("animate-ping absolute inline-flex h-full w-full rounded-full opacity-75", isOffline ? "bg-warning" : "bg-success")}></span>
                <span className={cn("relative inline-flex rounded-full h-3 w-3", isOffline ? "bg-warning" : "bg-success")}></span>
              </span>
              <span className="text-xs text-text-muted">{isOffline ? 'Offline' : 'Live'}</span>
            </div>
            {user ? (
               <Button variant="ghost" size="sm" onClick={handleLogout} className="text-danger hover:text-danger hover:bg-danger/10">
                 <LogOut className="w-4 h-4 mr-2" /> Logout
               </Button>
            ) : (
               <Link to="/login">
                 <Button variant="ghost" size="sm">Log in</Button>
               </Link>
            )}
            <Link to="/analyze">
              <Button size="sm">Start Analysis</Button>
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-text-muted hover:text-white focus:outline-none p-2"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-surface border-b border-white/5 absolute w-full shadow-2xl">
          <div className="px-4 pt-2 pb-6 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={cn(
                  "block px-3 py-3 rounded-xl text-base font-medium",
                  location.pathname === link.path ? "bg-primary/10 text-primary" : "text-text hover:bg-white/5"
                )}
              >
                {link.name}
              </Link>
            ))}
            <div className="pt-4 mt-4 border-t border-white/5 flex flex-col space-y-3">
              {user ? (
                <Button variant="ghost" onClick={handleLogout} className="w-full text-danger border border-danger/20">Logout</Button>
              ) : (
                <Link to="/login" onClick={() => setIsOpen(false)}>
                  <Button variant="secondary" className="w-full">Log in</Button>
                </Link>
              )}
              <Link to="/analyze" onClick={() => setIsOpen(false)}>
                <Button className="w-full">Start Analysis</Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
