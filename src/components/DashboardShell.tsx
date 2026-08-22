'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

const items = [
  ['Overview','/dashboard'],['Inbox','/dashboard/inbox'],['HANDLE','/dashboard/handle'],['Knowledge','/dashboard/knowledge'],['Workflows','/dashboard/workflows'],['Connections','/dashboard/connections'],['Analytics','/dashboard/analytics'],['Activity','/dashboard/activity'],['Billing','/dashboard/billing'],['Settings','/dashboard/settings'],
];

export function DashboardShell({ children, active = 'Overview' }: { children: React.ReactNode; active?: string }) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'checking' | 'ready' | 'redirecting'>('checking');

  useEffect(() => {
    let mounted = true;
    supabase.auth.getUser().then(({ data }) => {
      if (!mounted) return;
      if (!data.user) {
        setStatus('redirecting');
        window.location.replace(`/login?next=${encodeURIComponent(window.location.pathname)}`);
        return;
      }
      setEmail(data.user.email ?? 'HANDLE workspace');
      setStatus('ready');
    });
    return () => { mounted = false; };
  }, []);

  async function signOut() {
    await supabase.auth.signOut();
    window.location.href = '/';
  }

  if (status !== 'ready') return <div className="auth-loading" aria-live="polite"><div className="loading-mark">HANDLE</div><div className="loading-line" /><div className="muted">{status === 'redirecting' ? 'Opening login…' : 'Checking workspace…'}</div></div>;

  return <div className="dashboard">
    <aside className="sidebar">
      <div className="side-brand"><Link className="wordmark" href="/">HANDLE</Link><span className="badge live">LIVE</span></div>
      <nav className="side-nav" aria-label="Workspace navigation">{items.map(([label,href])=><Link key={label} href={href} className={'side-link '+(active===label?'active':'')}>{label}</Link>)}</nav>
      <div className="workspace"><strong>{email}</strong><div className="muted" style={{marginTop:4}}>HANDLE Workspace</div><button className="text-button" onClick={signOut}>Sign out</button><Link href="/" className="muted" style={{display:'inline-block',marginTop:10}}>← Marketing site</Link></div>
    </aside>
    <section className="dash-main">
      <header className="dash-top"><div><div className="eyebrow">WORKSPACE / {active.toUpperCase()}</div><h1 className="dash-title">{active}</h1></div><div className="navactions"><span className="badge live">HANDLE ONLINE</span><Link href="/demo" className="btn">Help</Link><Link href="/dashboard/connections" className="btn dark">Connect</Link></div></header>
      <div className="dash-content">{children}</div>
    </section>
  </div>;
}
