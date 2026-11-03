import React, { useMemo, useState } from 'react';
import {
  LayoutDashboard, Building2, Users, ClipboardList, Boxes, Wallet, Settings,
  Search, Bell, Plus, ArrowUpRight, ArrowDownRight, MoreHorizontal, Menu,
  X, LogOut, HardHat, CalendarDays, CheckCircle2, Clock3, CircleDollarSign,
  TrendingUp, FileText, ChevronDown, MapPin, Mail, Phone, Sparkles, ShieldCheck
} from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid, PieChart, Pie, Cell } from 'recharts';

const initialProjects = [
  { id: 1, name: 'Rosewood Residences', client: 'Ayesha Malik', location: 'New York, NY', status: 'In Progress', progress: 72, budget: 480000, spent: 345600, due: 'Dec 18, 2026' },
  { id: 2, name: 'The Marlowe Offices', client: 'Marlowe Group', location: 'Brooklyn, NY', status: 'Planning', progress: 24, budget: 720000, spent: 172800, due: 'Feb 12, 2027' },
  { id: 3, name: 'Parkline Renovation', client: 'Daniel Brooks', location: 'Queens, NY', status: 'In Progress', progress: 58, budget: 195000, spent: 113100, due: 'Nov 29, 2026' },
  { id: 4, name: 'Willow Creek Villas', client: 'Willow Creek LLC', location: 'Long Island, NY', status: 'Completed', progress: 100, budget: 360000, spent: 342000, due: 'Oct 20, 2026' }
];
const initialClients = [
  { id: 1, name: 'Ayesha Malik', company: 'Rosewood Properties', email: 'ayesha@example.com', phone: '+1 212 555 0184', projects: 2 },
  { id: 2, name: 'Marlowe Group', company: 'Marlowe Group LLC', email: 'projects@marlowe.com', phone: '+1 718 555 0112', projects: 1 },
  { id: 3, name: 'Daniel Brooks', company: 'DB Holdings', email: 'daniel@example.com', phone: '+1 917 555 0140', projects: 1 }
];
const initialTasks = [
  { id: 1, title: 'Approve foundation inspection', project: 'Rosewood Residences', owner: 'James Carter', due: 'Today', status: 'In Progress' },
  { id: 2, title: 'Order electrical materials', project: 'The Marlowe Offices', owner: 'Olivia Reed', due: 'Nov 06', status: 'Pending' },
  { id: 3, title: 'Finalize interior finish list', project: 'Parkline Renovation', owner: 'Noah Williams', due: 'Nov 08', status: 'Completed' }
];
const spendData = [
  { month: 'May', income: 42, expense: 28 }, { month: 'Jun', income: 55, expense: 35 },
  { month: 'Jul', income: 48, expense: 31 }, { month: 'Aug', income: 68, expense: 42 },
  { month: 'Sep', income: 61, expense: 39 }, { month: 'Oct', income: 82, expense: 51 }
];
const palette = ['#641d36', '#e7a9c0', '#d7c2ca'];
const money = n => '$' + Number(n).toLocaleString('en-US');

function App() {
  const [page, setPage] = useState('Overview');
  const [mobileOpen, setMobileOpen] = useState(false);
  const [projects, setProjects] = useState(initialProjects);
  const [clients, setClients] = useState(initialClients);
  const [tasks, setTasks] = useState(initialTasks);
  const [query, setQuery] = useState('');
  const [showProject, setShowProject] = useState(false);
  const [showClient, setShowClient] = useState(false);
  const [toast, setToast] = useState('');
  const [demoUser, setDemoUser] = useState({ name: 'Sawaira Ijaz', role: 'Administrator' });
  const [loggedIn, setLoggedIn] = useState(true);
  const [projectForm, setProjectForm] = useState({ name: '', client: '', location: '', budget: '' });
  const [clientForm, setClientForm] = useState({ name: '', company: '', email: '', phone: '' });
  const [filter, setFilter] = useState('All');

  const notify = msg => { setToast(msg); setTimeout(() => setToast(''), 2600); };
  const filteredProjects = useMemo(() => projects.filter(p => `${p.name} ${p.client} ${p.location}`.toLowerCase().includes(query.toLowerCase()) && (filter === 'All' || p.status === filter)), [projects, query, filter]);
  const nav = [
    { label: 'WORKSPACE', items: [{ name: 'Overview', icon: LayoutDashboard }, { name: 'Projects', icon: Building2 }, { name: 'Tasks', icon: ClipboardList }, { name: 'Clients', icon: Users }] },
    { label: 'MANAGEMENT', items: [{ name: 'Inventory', icon: Boxes }, { name: 'Finance', icon: Wallet }] },
    { label: 'SYSTEM', items: [{ name: 'Settings', icon: Settings }] }
  ];
  const addProject = async e => {
    e.preventDefault();
    if (!projectForm.name.trim() || !projectForm.client.trim() || Number(projectForm.budget) <= 0) return notify('Please complete the required fields.');
    const item = { ...projectForm, id: Date.now(), budget: Number(projectForm.budget), spent: 0, status: 'Planning', progress: 0, due: 'To be scheduled' };
    setProjects([item, ...projects]); setShowProject(false); setProjectForm({ name: '', client: '', location: '', budget: '' }); notify('Project added to this demo workspace.');
    try { const token = localStorage.getItem('kc_token'); if (token) await fetch('/api/projects', { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify(item) }); } catch {}
  };
  const addClient = e => {
    e.preventDefault();
    if (!clientForm.name.trim() || !clientForm.email.includes('@')) return notify('Enter a client name and valid email.');
    setClients([{ ...clientForm, id: Date.now(), projects: 0 }, ...clients]); setShowClient(false); setClientForm({ name: '', company: '', email: '', phone: '' }); notify('Client added successfully.');
  };
  const removeProject = id => { setProjects(projects.filter(p => p.id !== id)); notify('Project removed from demo data.'); };
  const completeTask = id => setTasks(tasks.map(t => t.id === id ? { ...t, status: 'Completed' } : t));

  if (!loggedIn) return <div className="login-screen"><div className="login-card"><div className="brand-mark"><HardHat size={25}/></div><p className="eyebrow">KASHIF CONSTRUCTIONS</p><h1>Welcome back.</h1><p className="muted">Sign in to your business workspace.</p><label>Email address</label><input defaultValue="admin@kashifconstructions.com" type="email"/><label>Password</label><input defaultValue="demo-password" type="password"/><button className="primary wide" onClick={() => setLoggedIn(true)}>Sign in to workspace</button><small>Demo preview · Authentication API is available after deployment configuration.</small></div></div>;

  return <div className="app-shell">
    <aside className={`sidebar ${mobileOpen ? 'open' : ''}`}>
      <div className="brand"><div className="brand-mark"><HardHat size={23}/></div><div><strong>KASHIF</strong><span>CONSTRUCTIONS</span></div><button className="mobile-close" onClick={() => setMobileOpen(false)}><X/></button></div>
      <div className="workspace-chip"><span className="live-dot"></span><span>Business workspace</span><ChevronDown size={14}/></div>
      {nav.map(group => <div className="nav-group" key={group.label}><p>{group.label}</p>{group.items.map(item => <button key={item.name} className={`nav-item ${page === item.name ? 'active' : ''}`} onClick={() => {setPage(item.name);setMobileOpen(false);}}><item.icon size={18}/><span>{item.name}</span>{item.name === 'Tasks' && <b className="nav-count">{tasks.filter(t=>t.status!=='Completed').length}</b>}</button>)}</div>)}
      <div className="sidebar-bottom"><div className="help-card"><Sparkles size={17}/><b>Build with clarity</b><span>Keep every project moving forward.</span></div><div className="user-mini"><div className="avatar">SI</div><div><b>{demoUser.name}</b><span>{demoUser.role}</span></div><button title="Sign out" onClick={() => setLoggedIn(false)}><LogOut size={16}/></button></div></div>
    </aside>
    {mobileOpen && <div className="scrim" onClick={() => setMobileOpen(false)}></div>}
    <main className="main-area">
      <header className="topbar"><button className="menu-toggle" onClick={() => setMobileOpen(true)}><Menu/></button><div className="breadcrumb">Workspace <span>/</span> <b>{page}</b></div><div className="top-actions"><div className="searchbox"><Search size={16}/><input placeholder="Search anything..." value={query} onChange={e=>setQuery(e.target.value)}/><kbd>⌘ K</kbd></div><button className="icon-btn notification" onClick={()=>notify('You are all caught up.')}><Bell size={18}/><i></i></button><div className="top-avatar">SI</div></div></header>
      <div className="content">
        {page === 'Overview' && <Overview projects={projects} tasks={tasks} clients={clients} onNavigate={setPage} onAdd={()=>setShowProject(true)} />}
        {page === 'Projects' && <section><div className="page-heading"><div><p className="eyebrow">PROJECT CONTROL</p><h1>Projects <span className="count-pill">{projects.length}</span></h1><p className="muted">Track delivery, budgets and project milestones.</p></div><button className="primary" onClick={()=>setShowProject(true)}><Plus size={17}/> New project</button></div><div className="toolbar"><div className="filter-tabs">{['All','In Progress','Planning','Completed'].map(s=><button className={filter===s?'selected':''} onClick={()=>setFilter(s)} key={s}>{s}</button>)}</div><span className="muted small">{filteredProjects.length} projects shown</span></div><div className="project-grid">{filteredProjects.map(p=><ProjectCard key={p.id} p={p} onDelete={()=>removeProject(p.id)}/>)}</div>{filteredProjects.length===0&&<Empty title="No matching projects" text="Try another search or filter."/>}</section>}
        {page === 'Tasks' && <section><div className="page-heading"><div><p className="eyebrow">TEAM EXECUTION</p><h1>Tasks & milestones</h1><p className="muted">Keep responsibilities clear and deadlines visible.</p></div><button className="primary" onClick={()=>notify('Task creation form can be connected to the tasks API.') }><Plus size={17}/> Add task</button></div><div className="panel"><div className="panel-head"><div><h3>Task board</h3><p className="muted">Your team’s latest assignments</p></div><span className="status-soft">{tasks.filter(t=>t.status!=='Completed').length} open</span></div><div className="task-list">{tasks.map(t=><div className="task-row" key={t.id}><div className={`task-check ${t.status==='Completed'?'done':''}`} onClick={()=>completeTask(t.id)}>{t.status==='Completed'&&<CheckCircle2 size={16}/>}</div><div className="task-main"><b>{t.title}</b><span>{t.project} · {t.owner}</span></div><span className="task-due"><CalendarDays size={14}/>{t.due}</span><Status status={t.status}/></div>)}</div></div></section>}
        {page === 'Clients' && <section><div className="page-heading"><div><p className="eyebrow">RELATIONSHIP MANAGEMENT</p><h1>Clients</h1><p className="muted">A clear view of your client relationships.</p></div><button className="primary" onClick={()=>setShowClient(true)}><Plus size={17}/> Add client</button></div><div className="client-grid">{clients.map(c=><div className="client-card" key={c.id}><div className="client-top"><div className="client-avatar">{c.name.split(' ').map(x=>x[0]).join('').slice(0,2)}</div><button className="dots" onClick={()=>notify('Client profile actions opened.')}><MoreHorizontal/></button></div><h3>{c.name}</h3><p className="muted">{c.company}</p><div className="client-contact"><span><Mail size={14}/>{c.email}</span><span><Phone size={14}/>{c.phone}</span></div><div className="client-foot"><span>{c.projects} active / linked projects</span><ArrowUpRight size={16}/></div></div>)}</div></section>}
        {page === 'Inventory' && <section><div className="page-heading"><div><p className="eyebrow">MATERIALS & EQUIPMENT</p><h1>Inventory</h1><p className="muted">Monitor essential site materials and stock levels.</p></div><button className="primary" onClick={()=>notify('Inventory item form is ready for API integration.')}><Plus size={17}/> Add item</button></div><div className="panel"><div className="panel-head"><div><h3>Stock overview</h3><p className="muted">Illustrative sample inventory</p></div><span className="status-soft">Live demo data</span></div><table><thead><tr><th>ITEM</th><th>CATEGORY</th><th>AVAILABLE</th><th>REORDER LEVEL</th><th>STATUS</th></tr></thead><tbody>{[['Portland cement','Building materials','240 bags','100 bags','Healthy'],['Steel reinforcement','Structural','1,250 kg','500 kg','Healthy'],['Ceramic tiles','Finishing','68 boxes','80 boxes','Low stock'],['Electrical cable','Electrical','14 rolls','20 rolls','Low stock']].map(r=><tr key={r[0]}>{r.map((v,i)=><td key={i}>{i===4?<span className={`stock ${v==='Healthy'?'healthy':'low'}`}>{v}</span>:v}</td>)}</tr>)}</tbody></table></div></section>}
        {page === 'Finance' && <section><div className="page-heading"><div><p className="eyebrow">FINANCIAL VISIBILITY</p><h1>Finance</h1><p className="muted">Understand project cash flow and budget health.</p></div><button className="secondary" onClick={()=>notify('Export is available after connecting live financial records.')}><FileText size={16}/> Export report</button></div><div className="stats-grid"><Stat icon={CircleDollarSign} label="Total project budget" value="$1.75M" trend="+8.4%" positive/><Stat icon={Wallet} label="Recorded expenses" value="$973.5K" trend="+4.2%" positive/><Stat icon={TrendingUp} label="Estimated margin" value="18.6%" trend="+2.1%" positive/></div><div className="panel chart-panel"><div className="panel-head"><div><h3>Income & expenses</h3><p className="muted">Monthly overview · USD thousands</p></div></div><SpendChart/></div></section>}
        {page === 'Settings' && <section><div className="page-heading"><div><p className="eyebrow">PREFERENCES</p><h1>Workspace settings</h1><p className="muted">Manage your business workspace profile.</p></div></div><div className="panel settings-panel"><div className="settings-icon"><ShieldCheck/></div><div><h3>Security & access</h3><p className="muted">Authentication is handled by protected API routes. Admin and team permissions can be managed through role-based access.</p><div className="setting-line"><span>Signed in as</span><b>{demoUser.name}</b></div><div className="setting-line"><span>Workspace role</span><b>Administrator</b></div><div className="setting-line"><span>Environment</span><b>Demo preview</b></div><button className="secondary" onClick={()=>notify('Security settings are configured through deployment environment variables.')}>Review security setup</button></div></div></section>}
      </div>
      <footer className="footer"><span>© 2026 Kashif Constructions</span><span>Designed for better building. <b>●</b> Business Suite v1.0</span></footer>
    </main>
    {showProject&&<Modal title="Create a project" close={()=>setShowProject(false)}><form onSubmit={addProject} className="modal-form"><label>Project name *</label><input required value={projectForm.name} onChange={e=>setProjectForm({...projectForm,name:e.target.value})} placeholder="e.g. Riverside Apartments"/><label>Client *</label><input required value={projectForm.client} onChange={e=>setProjectForm({...projectForm,client:e.target.value})} placeholder="Client or company name"/><label>Location</label><input value={projectForm.location} onChange={e=>setProjectForm({...projectForm,location:e.target.value})} placeholder="City, State"/><label>Budget (USD) *</label><input required min="1" type="number" value={projectForm.budget} onChange={e=>setProjectForm({...projectForm,budget:e.target.value})} placeholder="250000"/><button className="primary wide">Create project</button></form></Modal>}
    {showClient&&<Modal title="Add a client" close={()=>setShowClient(false)}><form onSubmit={addClient} className="modal-form"><label>Client name *</label><input required value={clientForm.name} onChange={e=>setClientForm({...clientForm,name:e.target.value})} placeholder="Full name"/><label>Company</label><input value={clientForm.company} onChange={e=>setClientForm({...clientForm,company:e.target.value})} placeholder="Company name"/><label>Email *</label><input required type="email" value={clientForm.email} onChange={e=>setClientForm({...clientForm,email:e.target.value})} placeholder="name@company.com"/><label>Phone</label><input value={clientForm.phone} onChange={e=>setClientForm({...clientForm,phone:e.target.value})} placeholder="+1 ..."/><button className="primary wide">Save client</button></form></Modal>}
    {toast&&<div className="toast"><CheckCircle2 size={17}/>{toast}</div>}
  </div>;
}

function Overview({projects,tasks,clients,onNavigate,onAdd}) {
  const active=projects.filter(p=>p.status==='In Progress').length;
  return <section><div className="welcome-row"><div><p className="eyebrow">MONDAY, NOVEMBER 03, 2026</p><h1>Good afternoon, Sawaira <span>✦</span></h1><p className="muted">Here’s what’s happening across your construction business.</p></div><button className="primary" onClick={onAdd}><Plus size={17}/> New project</button></div>
    <div className="stats-grid"><Stat icon={Building2} label="Total projects" value={projects.length.toString()} trend="+2 this month" positive/><Stat icon={ClipboardList} label="Active projects" value={active.toString()} trend="On track" positive/><Stat icon={Users} label="Total clients" value={clients.length.toString()} trend="+1 this month" positive/><Stat icon={Wallet} label="Portfolio value" value={money(projects.reduce((a,p)=>a+p.budget,0))} trend="+12.8%" positive/></div>
    <div className="overview-grid"><div className="panel chart-panel"><div className="panel-head"><div><h3>Cash flow overview</h3><p className="muted">Income vs expenses · USD thousands</p></div><button className="select-lite">Last 6 months <ChevronDown size={14}/></button></div><SpendChart/></div><div className="panel"><div className="panel-head"><div><h3>Project distribution</h3><p className="muted">By current status</p></div><button className="dots" onClick={()=>onNavigate('Projects')}><MoreHorizontal/></button></div><div className="donut-wrap"><ResponsiveContainer width="100%" height={175}><PieChart><Pie data={[{name:'In Progress',value:projects.filter(p=>p.status==='In Progress').length},{name:'Planning',value:projects.filter(p=>p.status==='Planning').length},{name:'Completed',value:projects.filter(p=>p.status==='Completed').length}]} dataKey="value" innerRadius={52} outerRadius={72} paddingAngle={4}>{palette.map((c,i)=><Cell key={i} fill={c}/>)}</Pie><Tooltip/></PieChart></ResponsiveContainer><div className="donut-center"><b>{projects.length}</b><span>Projects</span></div></div><div className="legend">{[['In Progress',palette[0]],['Planning',palette[1]],['Completed',palette[2]]].map(([n,c])=><div key={n}><i style={{background:c}}></i>{n}</div>)}</div></div></div>
    <div className="bottom-grid"><div className="panel"><div className="panel-head"><div><h3>Recent projects</h3><p className="muted">Your active construction pipeline</p></div><button className="text-btn" onClick={()=>onNavigate('Projects')}>View all <ArrowUpRight size={15}/></button></div><div className="recent-projects">{projects.slice(0,3).map(p=><div className="recent-row" key={p.id}><div className="project-icon"><Building2 size={18}/></div><div className="recent-info"><b>{p.name}</b><span>{p.client} · {p.location}</span><div className="progress-track"><i style={{width:p.progress+'%'}}></i></div></div><div className="recent-percent">{p.progress}%</div><Status status={p.status}/></div>)}</div></div><div className="panel"><div className="panel-head"><div><h3>Priority tasks</h3><p className="muted">What needs attention next</p></div><button className="text-btn" onClick={()=>onNavigate('Tasks')}>All tasks <ArrowUpRight size={15}/></button></div><div className="priority-list">{tasks.slice(0,3).map(t=><div className="priority-item" key={t.id}><div className="priority-icon"><Clock3 size={16}/></div><div><b>{t.title}</b><span>{t.project}</span></div><Status status={t.status}/></div>)}</div></div></div>
  </section>;
}
function Stat({icon:Icon,label,value,trend,positive}) { return <div className="stat-card"><div className="stat-top"><span>{label}</span><div className="stat-icon"><Icon size={18}/></div></div><strong>{value}</strong><div className={`trend ${positive?'up':''}`}><ArrowUpRight size={14}/>{trend}</div></div>; }
function Status({status}) { const cls=status==='Completed'?'completed':status==='Planning'?'planning':status==='Pending'?'pending':'progress'; return <span className={`status ${cls}`}><i></i>{status}</span>; }
function SpendChart() { return <div className="chart"><ResponsiveContainer width="100%" height="100%"><AreaChart data={spendData} margin={{top:10,right:8,left:-20,bottom:0}}><defs><linearGradient id="incomeFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#641d36" stopOpacity={0.18}/><stop offset="100%" stopColor="#641d36" stopOpacity={0}/></linearGradient></defs><CartesianGrid stroke="#f0e9ec" vertical={false}/><XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill:'#9b8d93',fontSize:11}}/><YAxis axisLine={false} tickLine={false} tick={{fill:'#9b8d93',fontSize:11}}/><Tooltip contentStyle={{border:'1px solid #f0e4e9',borderRadius:12,fontSize:12}}/><Area type="monotone" dataKey="income" stroke="#641d36" strokeWidth={2.5} fill="url(#incomeFill)"/><Area type="monotone" dataKey="expense" stroke="#e6a6bd" strokeWidth={2.5} fill="transparent"/></AreaChart></ResponsiveContainer></div>; }
function ProjectCard({p,onDelete}) { return <div className="project-card"><div className="project-card-top"><div className="project-icon large"><Building2 size={20}/></div><button className="dots" onClick={onDelete} title="Remove from demo"><MoreHorizontal/></button></div><div className="project-title"><h3>{p.name}</h3><Status status={p.status}/></div><p className="muted"><Users size={14}/>{p.client}</p><p className="muted"><MapPin size={14}/>{p.location}</p><div className="project-progress-label"><span>Project completion</span><b>{p.progress}%</b></div><div className="progress-track"><i style={{width:p.progress+'%'}}></i></div><div className="project-meta"><div><span>Budget</span><b>{money(p.budget)}</b></div><div><span>Spent</span><b>{money(p.spent)}</b></div></div><div className="project-due"><CalendarDays size={14}/>Due {p.due}</div></div>; }
function Modal({title,close,children}) { return <div className="modal-backdrop" onMouseDown={close}><div className="modal" onMouseDown={e=>e.stopPropagation()}><div className="modal-head"><h2>{title}</h2><button className="icon-btn" onClick={close}><X size={19}/></button></div>{children}</div></div>; }
function Empty({title,text}) { return <div className="empty"><Building2 size={28}/><b>{title}</b><span>{text}</span></div>; }
export default App;