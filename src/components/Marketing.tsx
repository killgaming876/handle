'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';

const connectors = ['WhatsApp','Instagram','Messenger','Gmail','Outlook','Calendar','Calendly','Shopify','WooCommerce','Stripe','Razorpay','HubSpot','Salesforce','Zoho','Google Drive','Website'];
const demoSteps = [
  ['UNDERSTAND', 'Intent detected: appointment request.'],
  ['RETRIEVE', 'Booking policy + availability context loaded.'],
  ['DECIDE', 'Tomorrow 4:30 PM matches business rules.'],
  ['ACT', 'Calendar booking prepared in sandbox.'],
  ['CONFIRM', 'Customer receives a clear confirmation.'],
];

export function Marketing() {
  const [demoMessage, setDemoMessage] = useState('Can you book me tomorrow at 4:30?');
  const [demoRunning, setDemoRunning] = useState(false);
  const [demoStep, setDemoStep] = useState(4);
  const [scroll, setScroll] = useState(0);
  const [activeConnector, setActiveConnector] = useState('WhatsApp');

  useEffect(() => {
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setScroll(max > 0 ? Math.min(1, window.scrollY / max) : 0);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const activeAction = useMemo(() => demoSteps[Math.min(demoStep, demoSteps.length - 1)], [demoStep]);

  function runDemo() {
    setDemoRunning(true);
    setDemoStep(0);
    let step = 0;
    const timer = window.setInterval(() => {
      step += 1;
      setDemoStep(step);
      if (step >= demoSteps.length - 1) {
        window.clearInterval(timer);
        setDemoRunning(false);
      }
    }, 680);
  }

  return (
    <main>
      <div className="scroll-progress"><span style={{transform:`scaleX(${scroll})`}} /></div>
      <nav className="nav">
        <Link className="wordmark" href="/">HANDLE</Link>
        <div className="navlinks">
          <a className="navlink" href="#system">Product</a>
          <a className="navlink" href="#demo">How it works</a>
          <a className="navlink" href="#connections">Integrations</a>
          <a className="navlink" href="#pricing">Pricing</a>
        </div>
        <div className="navactions"><Link className="navlink" href="/login">Log in</Link><Link className="btn dark" href="/signup">Start free</Link></div>
      </nav>

      <section className="container hero">
        <div className="hero-copy reveal-in">
          <div className="eyebrow hero-kicker">BUSINESS OPERATING SYSTEM / HANDLE</div>
          <h1 className="display"><span>WE</span><span className="serif">HANDLE</span><span>IT.</span></h1>
          <p className="hero-sub">Your customers. Your conversations. Your repetitive work. One system that connects the tools and handles the work that keeps repeating.</p>
          <div className="hero-actions"><Link className="btn dark" href="/signup">START FREE</Link><a className="btn" href="#demo">SEE HANDLE WORK</a></div>
          <div className="hero-proof"><span className="proof-dot" /> Demo mode available · no paid API required</div>
          <p className="eyebrow" style={{marginTop:26}}>ONE SURFACE. MANY SYSTEMS.</p>
        </div>
        <div className="hero-board interactive-board" aria-label="HANDLE operating surface visual">
          <div className="board-label">HANDLE LOOP <span>LIVE SYSTEM MAP</span></div>
          <div className="board-core"><div className="core-ring ring-one"/><div className="core-ring ring-two"/><div className="core-word">HANDLE</div><div className="core-pulse"/></div>
          <div className="signal signal-one"/><div className="signal signal-two"/>
          <div className="node one"/><div className="node two"/><div className="node three"/>
          <div className="floating-card card-a"><div className="eyebrow">CUSTOMER</div><strong>{demoMessage}</strong><div className="micro-status"><span className="status-dot"/> {activeAction[0].toLowerCase()}</div></div>
          <div className="floating-card card-b"><div className="eyebrow">ACTION</div><strong>Calendar → 4:30 PM</strong><div className="flow"><span className="flow-node">Check</span><span className="flow-arrow">→</span><span className="flow-node">Book</span></div></div>
          <div className="floating-card card-c"><div className="eyebrow">SYSTEM HEALTH</div><strong>Everything connected.</strong><p className="muted">Knowledge · Inbox · Calendar · CRM</p></div>
          <div className="board-footer"><span>INPUT</span><i>→</i><span>UNDERSTAND</span><i>→</i><span>ACT</span><i>→</i><span>CONFIRM</span></div>
        </div>
      </section>

      <section id="system" className="section section-dark">
        <div className="container split">
          <div><div className="eyebrow">THE PROBLEM</div><h2 className="section-title">TOO<br/>MANY<br/><span className="serif">TABS.</span></h2><div className="yellow-line"/></div>
          <div>
            <p className="lead-copy">WhatsApp, email, calendars, CRM, commerce and payments all carry pieces of the same customer journey. HANDLE turns the fragmented work into one coherent operating surface.</p>
            <div className="tabs-grid" style={{marginTop:34}}>{['WhatsApp','Email','Calendar','CRM','Shop','Payments'].map((x,i)=><div key={x} className="mini-panel dark-panel" style={{transform:`translateY(${i%2 ? 10 : 0}px)`}}><div className="eyebrow">SEPARATE TOOL</div><h4>{x}</h4><span className="muted">Another login. Another handoff.</span></div>)}</div>
            <h3 className="giant-line">ONE SYSTEM.</h3>
          </div>
        </div>
      </section>

      <section id="demo" className="section">
        <div className="container">
          <div className="eyebrow">THE HANDLE LOOP</div>
          <h2 className="section-title">FROM MESSAGE<br/><span className="serif">TO ACTION.</span></h2>
          <div className="live-demo" style={{marginTop:44}}>
            <div className="demo-chat">
              <div className="demo-header"><div><strong>Customer simulation</strong><span>DEMO MODE · SANDBOX</span></div><span className="badge live">ONLINE</span></div>
              <div className="demo-message customer">{demoMessage}</div>
              <div className="demo-message handle">I can handle that. I’ll check the business calendar and rules.</div>
              <div className="demo-message handle">Tomorrow at 4:30 PM is available.</div>
              <div className="demo-message customer">Perfect. Book it.</div>
              <div className="demo-input"><input value={demoMessage} onChange={(e)=>setDemoMessage(e.target.value)} aria-label="Demo customer message" /><button className="btn dark" onClick={runDemo} disabled={demoRunning}>{demoRunning ? 'Running…' : 'Run HANDLE'}</button></div>
            </div>
            <div className="demo-action-panel">
              <div className="eyebrow">ACTION TIMELINE</div>
              {demoSteps.map(([title,text],i)=><div key={title} className={'demo-step '+(i<=demoStep?'active':'')}><div className="step-index">0{i+1}</div><div><strong>{title}</strong><p>{text}</p></div><span className="step-dot" /></div>)}
              <div className="demo-result"><span className="status-dot"/> {activeAction[0]} · {activeAction[1]}</div>
            </div>
          </div>
        </div>
      </section>

      <section className="section section-stone">
        <div className="container split">
          <div><div className="eyebrow">THE MEMORY</div><h2 className="section-title">YOUR BUSINESS.<br/><span className="serif">REMEMBERED.</span></h2><p className="lead-copy dark-text">Bring in your website, policies, catalogues, FAQs and documents. Review what HANDLE learned before it goes live.</p></div>
          <div className="editorial-card knowledge-stack">
            <div className="eyebrow">KNOWLEDGE BASE · 5 SOURCES</div>
            <div className="knowledge-files">{['Pricing.pdf','Menu.pdf','Website','FAQ.csv','Policy.docx'].map((x,i)=><div key={x} className="knowledge-file"><span className="file-index">0{i+1}</span><strong>{x}</strong><span className="badge">{i===2?'SYNCED':'READY'}</span></div>)}</div>
            <div className="knowledge-query"><div className="eyebrow">ASK HANDLE</div><strong>What is our cancellation policy?</strong><p className="muted">Policy.docx · source-linked · confidence 98%</p></div>
          </div>
        </div>
      </section>

      <section id="connections" className="section">
        <div className="container">
          <div className="eyebrow">THE CONNECTIONS</div>
          <h2 className="section-title">ONE HANDLE.<br/><span className="serif">MANY SYSTEMS.</span></h2>
          <div className="connection-stage">
            <div className="connection-center"><div className="connection-core">HANDLE</div><span>CONNECTED OPERATING LAYER</span></div>
            {connectors.map((x,i)=><button key={x} className={'connection-node node-'+(i%8)+' '+(activeConnector===x?'selected':'')} onMouseEnter={()=>setActiveConnector(x)} onFocus={()=>setActiveConnector(x)} onClick={()=>setActiveConnector(x)}><strong>{x}</strong><small>{activeConnector===x ? 'CONNECTED · LIVE PREVIEW' : 'READY'}</small></button>)}
          </div>
        </div>
      </section>

      <section id="workflows" className="section section-dark">
        <div className="container">
          <div className="eyebrow">THE WORKFLOWS</div>
          <h2 className="section-title">WORK THAT<br/><span className="serif">MOVES ITSELF.</span></h2>
          <div className="workflow-story">
            {['NEW LEAD','QUALIFY','CREATE CRM','FOLLOW UP','BOOK CALL'].map((x,i)=><div key={x} className="workflow-story-step"><div className="workflow-node-number">0{i+1}</div><strong>{x}</strong><span>{['Instagram DM','AI decision','Contact created','WhatsApp','Calendar'][i]}</span></div>)}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container split">
          <div><div className="eyebrow">THE HUMAN</div><h2 className="section-title">AUTOMATION DOESN’T MEAN<br/><span className="serif">LOSING CONTROL.</span></h2><p className="lead-copy dark-text">HANDLE can pause, ask for approval or hand the conversation to a person. Important decisions stay understandable and auditable.</p></div>
          <div className="handoff-card"><div className="handoff-top"><span className="badge">ESCALATION</span><span className="eyebrow">REFUND · ₹3,500</span></div><h3>Approval required.</h3><p>A refund request falls outside the business rule.</p><div className="handoff-flow"><div><span className="status-dot"/> HANDLE ACTIVE</div><i>→</i><div className="highlight">HUMAN ACTIVE</div></div><div className="handoff-actions"><button className="btn dark">Take over</button><button className="btn">Review context</button></div></div>
        </div>
      </section>

      <section className="section section-stone">
        <div className="container">
          <div className="eyebrow">THE RESULT</div>
          <h2 className="section-title">SHOW ME WHAT<br/><span className="serif">HANDLE DID.</span></h2>
          <div className="metric-grid result-metrics" style={{marginTop:38}}><div className="metric"><strong>37</strong><span>hours saved · example</span></div><div className="metric"><strong>87%</strong><span>resolved automatically · example</span></div><div className="metric"><strong>214</strong><span>leads captured · example</span></div></div>
        </div>
      </section>

      <section id="pricing" className="section">
        <div className="container"><div className="eyebrow">PRICING</div><h2 className="section-title">SERIOUS AUTOMATION.<br/><span className="serif">WITHOUT THE ENTERPRISE BILL.</span></h2><div className="pricing" style={{marginTop:44}}>{[['Starter','$9','One business · essential automation'],['Growth','$29','Growing operations · more workflows'],['Pro','$79','Advanced teams · larger scale']].map((p,i)=><div className={'price-card '+(i===1?'featured':'')} key={p[0]}><div className="eyebrow">{p[0]}</div><div className="price">{p[1]}<span style={{fontSize:15}}>/mo</span></div><p className="muted" style={{color:i===1?'#aaa':undefined}}>{p[2]}</p><div className="price-list"><span>✓ HANDLE inbox</span><span>✓ Knowledge sources</span><span>✓ Workflow engine</span><span>✓ Usage visibility</span></div><Link className="btn" style={{marginTop:18,display:'inline-block',borderColor:i===1?'#f5f3ee':undefined,color:i===1?'#f5f3ee':undefined}} href="/signup">START FREE</Link></div>)}</div></div>
      </section>

      <section className="section section-dark final-section"><div className="container" style={{textAlign:'center'}}><div className="eyebrow">THE LAST SCREEN</div><h2 className="display" style={{margin:'20px 0 28px'}}>WE <span className="serif">HANDLE</span> IT.</h2><p className="final-copy">Give your business fewer repetitive tasks and more room to grow.</p><div className="hero-actions" style={{justifyContent:'center'}}><Link className="btn yellow" href="/signup">START FREE</Link><Link className="btn light-outline" href="/login">TRY HANDLE</Link></div></div></section>

      <footer className="footer"><div className="container"><div className="footer-main"><div><div className="display footer-logo">HANDLE</div><p className="muted" style={{color:'#8f8a81'}}>Business has better things to do.</p></div><div className="footer-links"><div><div className="eyebrow" style={{color:'#8f8a81'}}>PRODUCT</div><Link href="/dashboard/inbox">Inbox</Link><Link href="/dashboard/workflows">Workflows</Link><Link href="/dashboard/connections">Connections</Link></div><div><div className="eyebrow" style={{color:'#8f8a81'}}>COMPANY</div><a href="#pricing">Pricing</a><a href="#connections">Integrations</a><a href="#system">Security</a></div></div></div><div className="footer-bottom">© 2026 HANDLE · WE HANDLE IT.</div></div></footer>
    </main>
  );
}
