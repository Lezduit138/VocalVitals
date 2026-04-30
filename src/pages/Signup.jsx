import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Activity } from 'lucide-react';
import { registerWithEmail, loginWithGoogle } from '../services/authService';

export default function Signup() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ firstName: '', lastName: '', email: '', password: '' });
  const [errorText, setErrorText] = useState('');

  const handleSignup = async (e) => {
    e.preventDefault();
    setErrorText('');
    try {
      const displayName = `${formData.firstName} ${formData.lastName}`.trim();
      await registerWithEmail(formData.email, formData.password, displayName);
      navigate('/'); // redirects to dashboard
    } catch (err) {
      if (err.code === 'auth/email-already-in-use') {
        setErrorText("User already exists. Please sign in");
      } else {
        setErrorText("Failed to create account."); 
      }
    }
  };

  const handleGoogleSignup = async () => {
    setErrorText('');
    try {
      await loginWithGoogle();
      navigate('/');
    } catch (err) {
      if (err.code === 'auth/popup-closed-by-user') {
        setErrorText('Google sign-up was cancelled.');
      } else {
        setErrorText('Failed to sign up with Google.');
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-background relative overflow-hidden">
      
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[100px] translate-x-1/3 -translate-y-1/3 pointer-events-none"></div>

      <Card className="w-full max-w-md z-10 glass">
        <CardContent className="p-8">
          
          <div className="text-center mb-8">
            <Link to="/" className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 mb-4 group hover:bg-primary/20 transition-colors">
              <Activity className="w-6 h-6 text-primary group-hover:scale-110 transition-transform" />
            </Link>
            <h2 className="text-3xl font-display text-white">Create an Account</h2>
            <p className="text-text-muted mt-2">Create your VocalVitals account</p>
          </div>

          {errorText && <div className="text-red-500 text-sm mb-4 bg-red-500/10 p-3 rounded">{errorText}</div>}

          <form className="space-y-6" onSubmit={handleSignup}>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-text-muted mb-2">First Name</label>
                <input 
                  type="text" 
                  required
                  className="w-full bg-surface border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-colors"
                  value={formData.firstName}
                  onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-muted mb-2">Last Name</label>
                <input 
                  type="text" 
                  required
                  className="w-full bg-surface border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-colors"
                  value={formData.lastName}
                  onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-text-muted mb-2">Email Address</label>
              <input 
                type="email" 
                required
                className="w-full bg-surface border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-colors"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-text-muted mb-2">Password</label>
              <input 
                type="password" 
                required
                className="w-full bg-surface border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-colors"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
              />
            </div>

            <Button type="submit" className="w-full">Create Account</Button>
          </form>

          <div className="mt-6 flex items-center justify-between">
            <div className="border-t border-white/10 flex-grow"></div>
            <span className="px-4 text-xs text-text-muted uppercase tracking-wider">or</span>
            <div className="border-t border-white/10 flex-grow"></div>
          </div>

          <div className="mt-6">
            <Button variant="secondary" className="w-full" type="button" onClick={handleGoogleSignup}>
              <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24" fill="currentColor">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Sign up with Google
            </Button>
          </div>

          <p className="mt-8 text-center text-sm text-text-muted">
            Already have an account?{' '}
            <Link to="/login" className="text-primary hover:underline font-medium">Log in</Link>
          </p>
          
        </CardContent>
      </Card>
    </div>
  );
}
