import { Link } from 'react-router-dom';
import { Activity } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-white/5 bg-background pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8 mb-12">
          
          <div className="col-span-1 md:col-span-2">
            <Link to="/" className="flex items-center space-x-3 mb-6">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <Activity className="w-5 h-5 text-primary" />
              </div>
              <span className="font-display text-xl tracking-wide text-white">VOCALVITALS</span>
            </Link>
            <p className="text-text-muted max-w-sm mb-6 leading-relaxed">
              AI-powered acoustic analysis bridging the gap in pediatric care. 
              Safely, securely, and completely offline-ready for anywhere operation.
            </p>
            <div className="flex space-x-4">
              <button className="text-text-muted hover:text-white transition-colors">Twitter</button>
              <button className="text-text-muted hover:text-white transition-colors">GitHub</button>
              <button className="text-text-muted hover:text-white transition-colors">LinkedIn</button>
            </div>
          </div>

          <div>
            <h4 className="font-medium text-white mb-6 tracking-wider text-sm uppercase">Platform</h4>
            <ul className="space-y-4">
              <li><Link to="/analyze" className="text-text-muted hover:text-primary transition-colors">Start Analysis</Link></li>
              <li><Link to="/doctors" className="text-text-muted hover:text-primary transition-colors">Find a Doctor</Link></li>
              <li><Link to="/conditions" className="text-text-muted hover:text-primary transition-colors">Condition Library</Link></li>
              <li><Link to="/settings" className="text-text-muted hover:text-primary transition-colors">Settings & PWA</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-medium text-white mb-6 tracking-wider text-sm uppercase">Legal & Help</h4>
            <ul className="space-y-4">
              <li><Link to="#" className="text-text-muted hover:text-primary transition-colors">Privacy Policy</Link></li>
              <li><Link to="#" className="text-text-muted hover:text-primary transition-colors">Terms of Service</Link></li>
              <li><Link to="#" className="text-text-muted hover:text-primary transition-colors">Data Security</Link></li>
              <li><Link to="#" className="text-text-muted hover:text-primary transition-colors">Contact Support</Link></li>
            </ul>
          </div>

        </div>
        
        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between">
          <p className="text-sm text-text-muted mb-4 md:mb-0">
            &copy; {new Date().getFullYear()} VocalVitals. All rights reserved. Not a diagnostic tool.
          </p>
          <div className="flex items-center space-x-2 text-sm text-text-muted bg-surface-elevated px-3 py-1.5 rounded-full">
            <span className="w-2 h-2 rounded-full bg-success animate-pulse"></span>
            <span>Offline Ready</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
