import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { Lock, AlertCircle } from 'lucide-react';

export default function AdminLogin() {
  const { session, loading } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!loading && session) {
      navigate('/admin/calendar', { replace: true });
    }
  }, [session, loading, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    const { error: authError } = await supabase.auth.signInWithPassword({ email, password });

    if (authError) {
      setError(authError.message);
      setSubmitting(false);
    } else {
      navigate('/admin/calendar', { replace: true });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gym-black flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-bee-yellow border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div
      className="min-h-screen bg-gym-black flex items-center justify-center px-4"
      style={{ paddingTop: 80 }}
    >
      {/* Background text */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden" aria-hidden="true">
        <span
          className="font-display text-white opacity-[0.02] leading-none whitespace-nowrap"
          style={{ fontSize: 'clamp(80px, 20vw, 260px)' }}
        >
          ADMIN
        </span>
      </div>

      <div className="relative w-full max-w-md">
        {/* Top accent bar */}
        <div className="h-1 bg-bee-yellow w-full" />

        <div className="bg-gym-charcoal border border-gym-charcoal-light p-8 md:p-10">
          {/* Header */}
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-bee-yellow flex items-center justify-center shrink-0">
              <Lock size={18} className="text-gym-black" />
            </div>
            <div>
              <h1 className="font-display text-2xl text-white uppercase leading-none">Admin Login</h1>
              <p className="font-heading text-xs text-gray-600 uppercase tracking-widest mt-0.5">Killer Bees Clinton</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="font-heading text-xs uppercase tracking-widest text-gray-500 block mb-2">
                Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full bg-gym-black border border-gym-charcoal-light text-white font-body text-sm px-4 py-3 focus:outline-none focus:border-bee-yellow transition-colors placeholder-gray-700"
                placeholder="admin@killerbees.com"
                autoComplete="email"
              />
            </div>

            <div>
              <label className="font-heading text-xs uppercase tracking-widest text-gray-500 block mb-2">
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full bg-gym-black border border-gym-charcoal-light text-white font-body text-sm px-4 py-3 focus:outline-none focus:border-bee-yellow transition-colors"
                placeholder="••••••••"
                autoComplete="current-password"
              />
            </div>

            {error && (
              <div className="flex items-start gap-3 bg-gym-red/10 border border-gym-red/30 px-4 py-3">
                <AlertCircle size={16} className="text-gym-red shrink-0 mt-0.5" />
                <p className="font-body text-sm text-red-400">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full font-heading font-bold uppercase tracking-widest bg-bee-yellow text-gym-black border-2 border-bee-yellow px-6 py-3 text-sm hover:bg-bee-yellow-bright hover:border-bee-yellow-bright transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? 'Signing in…' : 'Sign In'}
            </button>
          </form>
        </div>

        {/* Bottom accent bar */}
        <div className="h-1 bg-gym-red w-full" />
      </div>
    </div>
  );
}
