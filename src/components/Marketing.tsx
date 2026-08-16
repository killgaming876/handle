import Link from 'next/link';

const connectors = ['WhatsApp','Instagram','Messenger','Gmail','Outlook','Calendar','Calendly','Shopify','WooCommerce','Stripe','Razorpay','HubSpot'];

export function Marketing() {
  return (
    <main>
      <nav className="nav">
        <Link className="wordmark" href="/">HANDLE</Link>
        <div className="navlinks">
          <a className="navlink" href="#system">Product</a><a className="navlink" href="#workflows">Workflows</a><a className="navlink" href="#connections">Connections</a><a className="navlink" href="#pricing">Pricing</a>
        </div>
        <div className="navactions"><Link className="navlink" href="/dashboard">Log in</Link><Link className="btn dark" href="/dashboard">Start free</Link></div>
      </nav>

      <section className="container hero">
        <div className="hero-copy">
          <div className="eyebrow hero-kicker">BUSINESS OPERATING SYSTEM / HANDLE</div>
          <h1 className="display"><span>WE</span><span className="serif">HANDLE</span><span>IT.</span></h1>
          <p className="hero-sub">A single system for customer conversations, repetitive work and everyday business operations.</p>
          <div className="hero-actions"><Link className="btn dark" href="/dashboard">START FREE</Link><a className="btn" href="#demo">SEE HOW IT WORKS</a></div>
          <p className="eyebrow" style={{marginTop:28}}>ONE SURFACE. MANY SYSTEMS.</p>
        </div>
        <div className="hero-board" aria-label="HANDLE operating surface visual">
          <div className="signal"/><div className="node one"/><div className="node two"/><div className="node three"/>
          <div className="floating-card card-a"><div className="eyebrow">CONVERSATION</div><strong>Move my appointment to tomorrow.</strong><p className="muted">Calendar check → 3 slots found</p></div>
          <div className="floating-card card-b"><div className="eyebrow">WORKFLOW</div><strong>Lead → CRM → WhatsApp</strong><div className="flow"><span className="flow-node">Qualify</span><span className="flow-arrow">→</span><span className="flow-node">Follow up</span></div></div>
          <div className="floating-card card-c"><div className="eyebrow">TODAY / OPERATIONS</div><strong>37 hrs saved</strong><p className="muted">87% of conversations resolved automatically.</p></div>
        </div>
      </section>

      <section id="system" className="section section-dark"><div className="container split"><div><div className="eyebrow">THE PROBLEM</div><h2 className="section-title">TOO<br/>MANY<br/><span className="serif">TABS.</span></h2><div className="yellow-line"/></div><div><p style={{fontSize:22,lineHeight:1.45,maxWidth:620}}>Messages, calendars, CRM records, orders and payments were never designed to feel like one system. HANDLE turns the disconnected work into one coherent operating surface.</p><div className="tabs-grid" style={{marginTop:34}}>{['WhatsApp','Email','Calendar','CRM','Shop','Payments'].map(x=><div key={x} className="mini-panel"><div className="eyebrow">SEPARATE TOOL</div><h4>{x}</h4><span className="muted">Another tab. Another login. Another handoff.</span></div>)}</div><h3 style={{fontSize:40,letterSpacing:'-.05em',marginTop:50}}>ONE SYSTEM.</h3></div></div></section>

      <section id="demo" className="section"><div className="container"><div className="eyebrow">CONVERSATIONS → ACTIONS</div><h2 className="section-title">ANSWERS ARE<br/><span className="serif">ONLY THE BEGINNING.</span></h2><div className="demo-wrap" style={{marginTop:44}}><div className="chat"><div className="eyebrow">LIVE PRODUCT STORY</div><div className="bubble customer">Can you move my appointment to tomorrow?</div><div className="bubble handle">I can help with that. I’ll check availability.</div><div className="bubble handle">Tomorrow at 4:30 PM is available. Shall I book it?</div><div className="bubble customer">Yes, please.</div><div className="bubble handle">Done. Your appointment is confirmed.</div></div><div className="timeline"><div className="eyebrow">ACTION TIMELINE</div>{['UNDERSTOOD REQUEST','CALENDAR CHECKED','4:30 PM AVAILABLE','BOOKING CREATED','CONFIRMATION SENT'].map((x,i)=><div key={x} className="step"><strong>{String(i+1).padStart(2,'0')} / {x}</strong><span style={{color:i===4?'#e9b949':'#aaa'}}>HANDLE LOOP</span></div>)}</div></div></div></section>

      <section className="section section-stone"><div className="container split"><div><div className="eyebrow">THE MEMORY</div><h2 className="section-title">YOUR BUSINESS.<br/><span className="serif">REMEMBERED.</span></h2></div><div className="editorial-card"><div className="eyebrow">KNOWLEDGE BASE</div><div className="table" style={{marginTop:14}}><table className="table"><thead><tr><th>Source</th><th>Type</th><th>Status</th></tr></thead><tbody>{[['Pricing.pdf','PDF','Ready'],['Menu.pdf','PDF','Ready'],['Website','URL','Synced'],['FAQ.csv','CSV','Ready'],['Policy.docx','DOC','Review']].map(r=><tr key={r[0]}><td>{r[0]}</td><td>{r[1]}</td><td><span className="badge">{r[2]}</span></td></tr>)}</tbody></table></div><div style={{marginTop:24,padding:18,background:'#eee9df',borderRadius:16}}><div className="eyebrow">ASK HANDLE</div><strong>What is our cancellation policy?</strong><p className="muted">Source found in Policy.docx · confidence 98%</p></div></div></div></section>

      <section id="connections" className="section"><div className="container"><div className="eyebrow">THE CONNECTIONS</div><h2 className="section-title">ONE HANDLE.<br/><span className="serif">MANY SYSTEMS.</span></h2><div className="connectors">{connectors.map((x,i)=><div key={x} className="connector"><div className="connector-top"><strong>{x}</strong><span className="status-dot"/></div><p className="muted" style={{fontSize:12}}>{i%3===0?'Connected':'Ready to connect'}</p></div>)}</div></div></section>

      <section id="workflows" className="section section-dark"><div className="container"><div className="eyebrow">THE WORKFLOWS</div><h2 className="section-title">FROM LEAD<br/><span className="serif">TO FOLLOW-UP.</span></h2><div className="editorial-card" style={{marginTop:42,background:'#f7f3ea'}}><div className="flow"><span className="flow-node"><b>NEW LEAD</b><br/><small className="muted">Instagram DM</small></span><span className="flow-arrow">→</span><span className="flow-node"><b>QUALIFY</b><br/><small className="muted">AI decision</small></span><span className="flow-arrow">→</span><span className="flow-node"><b>CRM</b><br/><small className="muted">Create contact</small></span><span className="flow-arrow">→</span><span className="flow-node"><b>WHATSAPP</b><br/><small className="muted">Follow up</small></span><span className="flow-arrow">→</span><span className="flow-node"><b>CALENDAR</b><br/><small className="muted">Book call</small></span></div></div></div></section>

      <section className="section"><div className="container split"><div><div className="eyebrow">THE HUMAN</div><h2 className="section-title">AUTOMATION DOESN’T MEAN<br/><span className="serif">LOSING CONTROL.</span></h2></div><div className="editorial-card"><div className="eyebrow">ESCALATION</div><h3 style={{fontSize:28}}>A customer asks for a refund outside policy.</h3><div className="step"><strong>HANDLE ACTIVE</strong><span className="muted">Issue identified</span></div><div className="step"><strong>APPROVAL REQUIRED</strong><span className="muted">Refund exceeds configured threshold</span></div><div className="step"><strong>HUMAN ACTIVE</strong><span className="muted">Staff takes over with full context</span></div></div></div></section>

      <section className="section section-stone"><div className="container"><div className="eyebrow">THE RESULT</div><h2 className="section-title">SHOW ME WHAT<br/><span className="serif">HANDLE DID.</span></h2><div className="metric-grid" style={{marginTop:38}}><div className="metric"><strong>37</strong><span>hours saved · example</span></div><div className="metric"><strong>87%</strong><span>resolved automatically · example</span></div><div className="metric"><strong>214</strong><span>leads captured · example</span></div></div></div></section>

      <section id="pricing" className="section"><div className="container"><div className="eyebrow">PRICING</div><h2 className="section-title">SERIOUS AUTOMATION.<br/><span className="serif">WITHOUT THE ENTERPRISE BILL.</span></h2><div className="pricing" style={{marginTop:44}}>{[['Starter','$9','For a single business'],['Growth','$29','For growing operations'],['Pro','$79','For advanced teams']].map((p,i)=><div className={'price-card '+(i===1?'featured':'')} key={p[0]}><div className="eyebrow">{p[0]}</div><div className="price">{p[1]}<span style={{fontSize:15}}>/mo</span></div><p className="muted" style={{color:i===1?'#aaa':undefined}}>{p[2]}</p><Link className="btn" style={{marginTop:18,display:'inline-block',borderColor:i===1?'#f5f3ee':undefined,color:i===1?'#f5f3ee':undefined}} href="/dashboard">START FREE</Link></div>)}</div></div></section>

      <section className="section section-dark"><div className="container" style={{textAlign:'center'}}><div className="eyebrow">THE LAST SCREEN</div><h2 className="display" style={{margin:'20px 0 28px'}}>WE <span className="serif">HANDLE</span> IT.</h2><p style={{fontSize:20,color:'#b7b2a8'}}>Business has better things to do.</p><Link className="btn yellow" style={{marginTop:24,display:'inline-block'}} href="/dashboard">START FREE</Link></div></section>

      <footer className="footer"><div className="container"><div style={{display:'flex',justifyContent:'space-between',gap:30,flexWrap:'wrap'}}><div><div className="display" style={{fontSize:64}}>HANDLE</div><p className="muted" style={{color:'#8f8a81'}}>Business has better things to do.</p></div><div style={{display:'flex',gap:38,fontSize:13}}><div><div className="eyebrow" style={{color:'#8f8a81'}}>PRODUCT</div><p>Inbox</p><p>Workflows</p><p>Connections</p></div><div><div className="eyebrow" style={{color:'#8f8a81'}}>COMPANY</div><p>Security</p><p>Pricing</p><p>Privacy</p></div></div></div><div style={{marginTop:60,borderTop:'1px solid rgba(245,243,238,.12)',paddingTop:18,fontSize:12,color:'#77736b'}}>© 2026 HANDLE. WE HANDLE IT.</div></div></footer>
    </main>
  );
}
