'use client';

import { useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || '/handle';

export function AuthPanel({ mode = 'signup' }: { mode?: 'signup' | 'login' }) {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [demoMode] = useState(!supabase);

  async function google() {
    setMessage('');
    if (!supabase) {
      setMessage('Demo mode is active. Connect Supabase to enable real Google authentication.');
      return;
    }
    setLoading(true);
    const redirectTo = `${window.location.origin}${BASE_PATH}/dashboard`;
    const { error } = await supabase.auth.signInWithOAuth({ provider: 'google', options: { redirectTo } });
    if (error) setMessage(error.message);
    setLoading(false);
  }

  async function emailAuth(event: React.FormEvent) {
    event.preventDefault();
    setMessage('');
    if (!supabase) {
      setSent(true);
      setMessage('Demo mode: no email was sent. Add Supabase credentials to enable live auth.');
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.signInWithOtp({ email, options: { emailRedirectTo: `${window.location.origin}${BASE_PATH}/dashboard` } });
    if (error) setMessage(error.message); else setSent(true);
    setLoading(false);
  }

  return (
    <main className="auth-page">
      <div className="auth-art" aria-hidden="true">
        <div className="auth-grid" />
        <div className="auth-wordmark">HANDLE<span className="wordmark-dot">◼</span></div>
        <div className="auth-signal-line" />
        <div className="auth-orbit orbit-a" />
        <div className="auth-orbit orbit-b" />
        <div className="auth-quote">WORK IN MOTION.</div>
      </div>
      <section className="auth-panel">
        <div className="auth-panel-inner">
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',gap:12}}>
            <Link href="/" className="auth-logo">HANDLE</Link>
            <span className="badge live">{demoMode ? 'DEMO MODE' : 'LIVE AUTH'}</span>
          </div>
          <div className="eyebrow">THE BUSINESS OPERATING SYSTEM</div>
          <h1>{mode === 'signup' ? 'Start handling.' : 'Welcome back.'}</h1>
          <p className="auth-sub">One operating layer for customer conversations, business knowledge and repetitive work.</p>
          <button className="google-button" onClick={google} disabled={loading}>
            <span className="google-mark">G</span>{loading ? 'Connecting…' : 'Continue with Google'}
          </button>
          <div className="auth-divider"><span>or use email</span></div>
          {sent ? (
            <div className="auth-success"><div className="success-dot" /><strong>{demoMode ? 'Demo sign-in ready.' : 'Check your inbox.'}</strong><span>{demoMode ? 'The interface is fully interactive; live auth is disabled for this deployment.' : `We sent a secure sign-in link to ${email}.`}</span></div>
          ) : (
            <form className="auth-form" onSubmit={emailAuth}>
              <label>Email address<input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@business.com" /></label>
              <button className="btn dark auth-submit" disabled={loading}>{loading ? 'Sending…' : mode === 'signup' ? 'Create workspace' : 'Send sign-in link'}</button>
            </form>
          )}
          {message && <div className="auth-message">{message}</div>}
          <p className="auth-legal">By continuing, you agree to the HANDLE Terms and Privacy Policy.</p>
          <div className="auth-switch">{mode === 'signup' ? <>Already have a workspace? <Link href="/login">Log in</Link></> : <>New to HANDLE? <Link href="/signup">Create an account</Link></>}</div>
          <Link href="/" className="back-home">← Back to HANDLE</Link>
        </div>
      </section>
    </main>
  );
}
