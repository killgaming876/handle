import { DashboardShell } from '@/components/DashboardShell';

const rows = [
  ['Maya Sharma','WhatsApp','Can you move my appointment?','2m','HANDLE'],
  ['Arjun Mehta','Instagram','Looking for your pricing','8m','HANDLE'],
  ['Sarah Khan','Website','I need help with my order','16m','Human'],
  ['Rohan Kapoor','Email','Following up on the consultation','28m','HANDLE'],
];

export default function Dashboard() {
  return <DashboardShell><div className="overview-grid">
    {[['1,842','Conversations handled'],['87%','Resolved automatically'],['32h','Estimated hours saved'],['214','Leads captured']].map(x=><div className="stat-card" key={x[1]}><div className="num">{x[0]}</div><div className="label">{x[1]}</div></div>)}
  </div>
  <div className="page-grid">
    <section className="panel"><div className="panel-head"><div><div className="panel-title">Recent conversations</div><div className="muted" style={{fontSize:12}}>Unified across your connected channels</div></div><a className="btn" href="/dashboard/inbox">Open inbox</a></div><table className="table"><thead><tr><th>Customer</th><th>Channel</th><th>Message</th><th>Age</th><th>Owner</th></tr></thead><tbody>{rows.map(r=><tr key={r[0]}>{r.map((c,i)=><td key={i}>{i===4?<span className="badge">{c}</span>:c}</td>)}</tr>)}</tbody></table></section>
    <section className="panel"><div className="panel-head"><div><div className="panel-title">System briefing</div><div className="muted" style={{fontSize:12}}>What needs attention today</div></div></div>{['WhatsApp connection healthy','3 leads waiting for follow-up','1 approval required · ₹3,500 refund','Knowledge source Policy.docx needs review'].map((x,i)=><div className="action-item" key={x}><strong>{String(i+1).padStart(2,'0')}</strong> &nbsp; {x}</div>)}</section>
  </div>
  <div className="page-grid">
    <section className="panel"><div className="panel-head"><div><div className="panel-title">Activity</div><div className="muted" style={{fontSize:12}}>Signals across HANDLE</div></div></div><div className="chart">{[55,78,46,93,68,82,74,100,88,62,94,76].map((h,i)=><div className="bar" key={i} style={{height:`${h}%`}} />)}</div></section>
    <section className="panel"><div className="panel-head"><div className="panel-title">Upcoming</div><span className="badge">TODAY</span></div>{['11:30 · Maya Salon consultation','14:00 · Apex Realty follow-up','16:30 · Northstar Fitness trial'].map(x=><div className="action-item" key={x}>{x}</div>)}</section>
  </div></DashboardShell>;
}
