'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';

const responses: Record<string, string> = {
  appointment: 'Friday has 4:00 PM and 5:30 PM available. Choose a slot and HANDLE will confirm it.',
  lead: 'Lead captured. HANDLE tagged the request as high intent and queued a follow-up.',
  refund: 'Refund request identified. HANDLE prepared the case for human approval.',
};

export default function DemoPage() {
  const [input, setInput] = useState('I need to book an appointment.');
  const [reply, setReply] = useState('Which day works for you?');
  const [busy, setBusy] = useState(false);
  const intent = useMemo(() => input.toLowerCase().includes('refund') ? 'refund' : input.toLowerCase().includes('lead') ? 'lead' : 'appointment', [input]);

  function run() {
    setBusy(true);
    window.setTimeout(() => { setReply(responses[intent]); setBusy(false); }, 260);
  }

  return <main className="hx-site" style={{minHeight:'100vh',padding:'120px 6vw 60px'}}>
    <nav className="hx-nav"><Link href="/" className="hx-logo">HANDLE<span>•</span></Link><div className="hx-nav-actions"><Link href="/login" className="hx-login">LOG IN</Link><Link href="/signup" className="hx-cta">START FREE ↗</Link></div></nav>
    <div style={{maxWidth:1000,margin:'0 auto'}}>
      <div className="hx-eyebrow">HANDLE / INTERACTIVE DEMO</div>
      <h1 className="hx-title" style={{fontSize:'clamp(60px,10vw,130px)'}}>SEE IT <em>HANDLE</em>.</h1>
      <p style={{maxWidth:650,color:'#9a9a91',fontSize:18,lineHeight:1.6}}>This is a deterministic public simulation. Type a realistic business request and watch the operating layer respond.</p>
      <section style={{marginTop:40,border:'1px solid rgba(255,255,255,.11)',background:'#090909',padding:24}}>
        <div style={{borderBottom:'1px solid rgba(255,255,255,.11)',paddingBottom:18,color:'#77776f',fontSize:10,letterSpacing:'.14em'}}>SIMULATED WORKSPACE</div>
        <div style={{minHeight:260,padding:'28px 0'}}><div style={{display:'flex',justifyContent:'flex-end'}}><div style={{padding:16,maxWidth:600,border:'1px solid rgba(255,255,255,.1)'}}>{input}</div></div><div style={{marginTop:22,maxWidth:680,padding:18,border:'1px solid rgba(233,255,98,.18)',background:'rgba(233,255,98,.04)'}}>{busy ? 'HANDLE is routing the request…' : reply}</div></div>
        <div style={{display:'flex',gap:10,flexWrap:'wrap'}}><input value={input} onChange={(e)=>setInput(e.target.value)} aria-label="Business request" style={{flex:1,minWidth:240,minHeight:48,padding:'0 14px',background:'#0d0d0d',border:'1px solid rgba(255,255,255,.14)',color:'#fff'}}/><button onClick={run} className="hx-cta" disabled={busy}>{busy ? 'RUNNING…' : 'RUN HANDLE ↗'}</button></div>
      </section>
    </div>
  </main>;
}
