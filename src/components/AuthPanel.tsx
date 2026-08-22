'use client';

import { useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || '';

type Mode = 'signup' | 'login';

export function AuthPanel({ mode = 'signup' }: { mode?: Mode }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [forgot, setForgot] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [success, setSuccess] = useState('');

  const passwordError = password.length > 0 && password.length < 8 ? 'Password needs at least 8 characters.' : '';

  async function google() {
    setMessage('');
    setSuccess('');
    setLoading(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}${BASE_PATH}/dashboard` },
    });
    if (error) setMessage(error.message);
    setLoading(false);
  }

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setMessage('');
    setSuccess('');
    if (!email || (forgot ? false : !password)) return setMessage('Enter the required fields.');
    if (!forgot && password.length < 8) return setMessage('Password needs at least 8 characters.');

    setLoading(true);
    try {
      if (forgot) {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}${BASE_PATH}/login?reset=1`,
        });
        if (error) throw error;
        setSuccess('Password reset instructions sent. Check your inbox.');
      } else if (mode === 'signup') {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: { data: { full_name: name } },
        });
        if (error) throw error;
        if (data.session) window.location.assign(`${BASE_PATH}/dashboard`);
        else setSuccess('Account created. Check your inbox to confirm your email, then continue to HANDLE.');
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw new Error('Email or password is incorrect.');
        window.location.assign(`${BASE_PATH}/dashboard`);
      }
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Authentication failed. Try again.');
    } finally {
      setLoading(false);
    }
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
      <section className="auth-panel" aria-labelledby="auth-title">
        <div className="auth-panel-inner">
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',gap:12}}>
            <Link href="/" className="auth-logo">HANDLE</Link>
            <span className="badge live">LIVE AUTH</span>
          </div>
          <div className="eyebrow">THE BUSINESS OPERATING SYSTEM</div>
          <h1 id="auth-title">{forgot ? 'Reset access.' : mode === 'signup' ? 'Start handling.' : 'Welcome back.'}</h1>
          <p className="auth-sub">One operating layer for customer conversations, business knowledge and repetitive work.</p>

          {!forgot && <button className="google-button" onClick={google} disabled={loading} aria-label="Continue with Google">
            <span className="google-mark">G</span>{loading ? 'Connecting…' : 'Continue with Google'}
          </button>}
          {!forgot && <div className="auth-divider"><span>or use email</span></div>}

          <form className="auth-form" onSubmit={submit} noValidate>
            {mode === 'signup' && !forgot && <label>Name<input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" autoComplete="name" /></label>}
            <label>Email address<input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@business.com" autoComplete="email" /></label>
            {!forgot && <label>Password<div className="password-wrap"><input required minLength={8} type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="At least 8 characters" autoComplete={mode === 'signup' ? 'new-password' : 'current-password'} />
              <button type="button" className="password-toggle" onClick={() => setShowPassword((value) => !value)} aria-label={showPassword ? 'Hide password' : 'Show password'}>{showPassword ? 'Hide' : 'Show'}</button>
            </div>{passwordError && <span className="field-error">{passwordError}</span>}</label>}
            <button className="btn dark auth-submit" disabled={loading}>{loading ? 'Working…' : forgot ? 'Send reset link' : mode === 'signup' ? 'Create workspace' : 'Log in'}</button>
          </form>

          {message && <div className="auth-message" role="alert">{message}</div>}
          {success && <div className="auth-success" role="status"><div className="success-dot" /><strong>{success}</strong></div>}

          {!forgot && <button type="button" className="auth-forgot" onClick={() => { setForgot(true); setMessage(''); setSuccess(''); }}>Forgot password?</button>}
          {forgot && <button type="button" className="auth-forgot" onClick={() => { setForgot(false); setMessage(''); setSuccess(''); }}>← Back to login</button>}
          <p className="auth-legal">By continuing, you agree to the HANDLE Terms and Privacy Policy.</p>
          <div className="auth-switch">{!forgot && (mode === 'signup' ? <>Already have a workspace? <Link href="/login">Log in</Link></> : <>New to HANDLE? <Link href="/signup">Create an account</Link></>)}</div>
          <Link href="/" className="back-home">← Back to HANDLE</Link>
        </div>
      </section>
    </main>
  );
}
