import Link from 'next/link';

const items = [
  ['Overview','/dashboard'],['Inbox','/dashboard/inbox'],['HANDLE','/dashboard/handle'],['Knowledge','/dashboard/knowledge'],['Workflows','/dashboard/workflows'],['Connections','/dashboard/connections'],['Analytics','/dashboard/analytics'],['Activity','/dashboard/activity'],['Billing','/dashboard/billing'],['Settings','/dashboard/settings'],
];

export function DashboardShell({ children, active = 'Overview' }: { children: React.ReactNode; active?: string }) {
  return <div className="dashboard">
    <aside className="sidebar">
      <div className="side-brand"><Link className="wordmark" href="/">HANDLE</Link><span className="badge live">LIVE</span></div>
      <nav className="side-nav">{items.map(([label,href])=><Link key={label} href={href} className={'side-link '+(active===label?'active':'')}>{label}</Link>)}</nav>
      <div className="workspace"><strong>Northstar Demo</strong><div className="muted" style={{marginTop:4}}>Starter workspace</div><Link href="/" className="muted" style={{display:'inline-block',marginTop:10}}>← Marketing site</Link></div>
    </aside>
    <section className="dash-main">
      <header className="dash-top"><div><div className="eyebrow">WORKSPACE / {active.toUpperCase()}</div><h1 className="dash-title">{active}</h1></div><div className="navactions"><span className="badge live">HANDLE ONLINE</span><button className="btn">Help</button><button className="btn dark">Invite</button></div></header>
      <div className="dash-content">{children}</div>
    </section>
  </div>;
}
