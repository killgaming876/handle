'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

const items = [
  ['Overview','/dashboard'],['Inbox','/dashboard/inbox'],['HANDLE','/dashboard/handle'],['Knowledge','/dashboard/knowledge'],['Workflows','/dashboard/workflows'],['Connections','/dashboard/connections'],['Analytics','/dashboard/analytics'],['Activity','/dashboard/activity'],['Billing','/dashboard/billing'],['Settings','/dashboard/settings'],
];

export function DashboardShell({ children, active = 'Overview' }: { children: React.ReactNode; active?: string }) {
  const [email, setEmail] = useState('Demo workspace');
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (!supabase) { setChecked(true); return; }
    supabase.auth.getUser().then(({ data }) => {
      if (data.user?.email) setEmail(data.user.email);
      setChecked(true);
    });
  }, []);

  async function signOut() {
    await supabase?.auth.signOut();
    window.location.href = `${process.env.NEXT_PUBLIC_BASE_PATH || '/handle'}/`;
  }

  if (!checked) return <div className="auth-loading"><div className="loading-mark">HANDLE</div><div className="loading-line" /></div>;

  return <div className="dashboard">
    <aside className="sidebar">
      <div className="side-brand"><Link className="wordmark" href="/">HANDLE</Link><span className="badge live">LIVE</span></div>
      <nav className="side-nav">{items.map(([label,href])=><Link key={label} href={href} className={'side-link '+(active===label?'active':'')}>{label}</Link>)}</nav>
      <div className="workspace"><strong>{email}</strong><div className="muted" style={{marginTop:4}}>Northstar Demo · Starter</div><button className="text-button" onClick={signOut}>Sign out</button><Link href="/" className="muted" style={{display:'inline-block',marginTop:10}}>← Marketing site</Link></div>
    </aside>
    <section className="dash-main">
      <header className="dash-top"><div><div className="eyebrow">WORKSPACE / {active.toUpperCase()}</div><h1 className="dash-title">{active}</h1></div><div className="navactions"><span className="badge live">HANDLE ONLINE</span><button className="btn">Help</button><button className="btn dark">Invite</button></div></header>
      <div className="dash-content">{children}</div>
    </section>
  </div>;
}
