import { useState, useEffect, useRef } from "react";

const uid = () => Math.random().toString(36).slice(2, 9);

const DEMO_USERS = [
  { id: "u1", name: "Alex Morgan", email: "alex@unfoldcro.com", password: "admin123", role: "Admin", avatar: "AM", color: "#1A1A1A" },
  { id: "u2", name: "Priya Sharma", email: "priya@unfoldcro.com", password: "pass", role: "Developer", avatar: "PS", color: "#2D8C3C" },
  { id: "u3", name: "Jordan Lee", email: "jordan@unfoldcro.com", password: "pass", role: "Designer", avatar: "JL", color: "#6B4CE6" },
  { id: "u4", name: "Sam Wilson", email: "sam@unfoldcro.com", password: "pass", role: "Marketing", avatar: "SW", color: "#E6651A" },
  { id: "u5", name: "Casey Park", email: "casey@unfoldcro.com", password: "pass", role: "Developer", avatar: "CP", color: "#1A7FE6" },
];

const DEMO_TASKS = [
  { id: uid(), title: "Redesign landing page hero section", description: "Update hero with new CRO patterns", assignee: "u3", priority: "high", status: "in-progress", due: "2026-02-28", createdBy: "u1" },
  { id: uid(), title: "Fix authentication token refresh bug", description: "Token expires prematurely on mobile", assignee: "u2", priority: "high", status: "todo", due: "2026-02-27", createdBy: "u1" },
  { id: uid(), title: "Write Q1 marketing report", description: "Include conversion metrics and A/B test results", assignee: "u4", priority: "medium", status: "in-progress", due: "2026-03-01", createdBy: "u1" },
  { id: uid(), title: "Set up CI/CD pipeline for staging", description: "Automate deployment to staging env", assignee: "u5", priority: "medium", status: "done", due: "2026-02-25", createdBy: "u1" },
  { id: uid(), title: "User research interviews — batch 2", description: "5 interviews with enterprise users", assignee: "u3", priority: "low", status: "todo", due: "2026-03-05", createdBy: "u1" },
  { id: uid(), title: "API rate limiting implementation", description: "Add rate limiting middleware", assignee: "u2", priority: "high", status: "todo", due: "2026-03-02", createdBy: "u1" },
  { id: uid(), title: "Social media content calendar", description: "Plan March social content", assignee: "u4", priority: "low", status: "done", due: "2026-02-24", createdBy: "u1" },
  { id: uid(), title: "Database migration script review", description: "Review and test migration scripts", assignee: "u5", priority: "medium", status: "in-progress", due: "2026-02-28", createdBy: "u1" },
];

const STATUS_CFG = {
  "todo": { label: "To Do", bg: "#F5F5F5", fg: "#666", ring: "#CCC" },
  "in-progress": { label: "In Progress", bg: "#FFF8E6", fg: "#C48A00", ring: "#E6A516" },
  "done": { label: "Done", bg: "#EEFBE6", fg: "#2D8C3C", ring: "#2D8C3C" },
};
const PRIO_CFG = {
  high: { label: "High", color: "#DC2626", bg: "#FEF2F2" },
  medium: { label: "Medium", color: "#C48A00", bg: "#FFF8E6" },
  low: { label: "Low", color: "#888", bg: "#F5F5F5" },
};

export default function App() {
  const [user, setUser] = useState(null);
  const [view, setView] = useState("login");
  const [team, setTeam] = useState(DEMO_USERS);
  const [tasks, setTasks] = useState(DEMO_TASKS);
  const [modal, setModal] = useState(null);
  const [fMember, setFMember] = useState("all");
  const [fStatus, setFStatus] = useState("all");
  const [collapsed, setCollapsed] = useState(false);

  if (!user) return <Login team={team} onLogin={(u) => { setUser(u); setView("dashboard"); }} />;

  const navItems = [
    { key: "dashboard", label: "DASHBOARD", ico: "⬡" },
    { key: "tasks", label: "TASKS", ico: "☰" },
    { key: "team", label: "TEAM", ico: "◎" },
  ];

  return (
    <div style={css.shell}>
      <style>{GCSS}</style>

      {/* ── SIDEBAR ── */}
      <div style={{ ...css.side, width: collapsed ? 68 : 240 }}>
        <div style={css.sideBrand}>
          <div style={css.logoMark}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <path d="M13 3L4 14h7l-2 7 9-11h-7l2-7z" fill="#1A1A1A" />
            </svg>
          </div>
          {!collapsed && <span style={css.brandName}>unfoldcro</span>}
        </div>

        <button onClick={() => setCollapsed(!collapsed)} style={css.collapseBtn}>
          {collapsed ? "›" : "‹"}
        </button>

        <nav style={css.nav}>
          {navItems.map((n) => (
            <button
              key={n.key}
              onClick={() => setView(n.key)}
              className="side-btn"
              style={{
                ...css.sideBtn,
                ...(view === n.key ? css.sideBtnOn : {}),
                justifyContent: collapsed ? "center" : "flex-start",
                padding: collapsed ? "11px 0" : "11px 18px",
              }}
            >
              <span style={{ fontSize: 16, width: 24, textAlign: "center", flexShrink: 0, opacity: view === n.key ? 1 : 0.5 }}>{n.ico}</span>
              {!collapsed && <span>{n.label}</span>}
            </button>
          ))}
        </nav>

        <div style={css.sideFooter}>
          <div style={{ ...css.sideUser, justifyContent: collapsed ? "center" : "flex-start" }}>
            <div style={{ ...css.av32, background: user.color, color: "#fff" }}>{user.avatar}</div>
            {!collapsed && (
              <div style={{ overflow: "hidden" }}>
                <div style={css.sideUName}>{user.name}</div>
                <div style={css.sideURole}>{user.role}</div>
              </div>
            )}
          </div>
          <button
            onClick={() => { setUser(null); setView("login"); }}
            className="side-btn"
            style={{ ...css.sideBtn, color: "#DC2626", justifyContent: collapsed ? "center" : "flex-start", padding: collapsed ? "11px 0" : "11px 18px" }}
          >
            <span style={{ fontSize: 14, width: 24, textAlign: "center" }}>⏻</span>
            {!collapsed && <span style={{ fontSize: 12 }}>SIGN OUT</span>}
          </button>
        </div>
      </div>

      {/* ── CONTENT ── */}
      <div style={css.content}>
        {view === "dashboard" && <Dashboard tasks={tasks} team={team} user={user} />}
        {view === "tasks" && (
          <Tasks tasks={tasks} setTasks={setTasks} team={team} user={user} modal={modal} setModal={setModal} fMember={fMember} setFMember={setFMember} fStatus={fStatus} setFStatus={setFStatus} />
        )}
        {view === "team" && <Team team={team} setTeam={setTeam} tasks={tasks} user={user} setModal={setModal} />}
      </div>

      {modal && <Modal modal={modal} close={() => setModal(null)} tasks={tasks} setTasks={setTasks} team={team} setTeam={setTeam} user={user} />}
    </div>
  );
}

/* ════════════════════════ LOGIN ════════════════════════ */
function Login({ team, onLogin }) {
  const [email, setEmail] = useState("alex@unfoldcro.com");
  const [pass, setPass] = useState("admin123");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  const go = () => {
    setErr(""); setLoading(true);
    setTimeout(() => {
      const u = team.find((m) => m.email === email && m.password === pass);
      if (u) onLogin(u); else setErr("Invalid email or password.");
      setLoading(false);
    }, 500);
  };

  return (
    <div style={css.loginWrap}>
      <style>{GCSS}</style>

      {/* Left panel */}
      <div style={css.loginLeft}>
        <div style={css.loginLeftInner}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 56 }}>
            <div style={css.logoMark}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <path d="M13 3L4 14h7l-2 7 9-11h-7l2-7z" fill="#1A1A1A" />
              </svg>
            </div>
            <span style={{ fontFamily: "var(--heading)", fontSize: 22, fontWeight: 800, color: "#1A1A1A", letterSpacing: "-0.04em" }}>unfoldcro</span>
          </div>

          <h1 style={css.loginH1}>
            Manage your team.<br />
            <span style={{ color: "#1A1A1A", background: "linear-gradient(120deg, #D6F5A0 0%, #B8E986 100%)", padding: "2px 8px", borderRadius: 4 }}>Ship faster together.</span>
          </h1>
          <p style={css.loginP}>Assign tasks, track progress, and keep everyone aligned — one platform for your entire workflow.</p>

          {/* Features */}
          <div style={css.featureList}>
            {["Real-time task tracking", "Team workload overview", "Priority-based allocation", "Progress analytics"].map((f, i) => (
              <div key={i} style={css.featureItem}>
                <span style={css.featureCheck}>✓</span>
                <span>{f}</span>
              </div>
            ))}
          </div>

          <div style={css.credBox}>
            <span style={css.credLabel}>DEMO LOGIN</span>
            <code style={css.credCode}>alex@unfoldcro.com / admin123</code>
          </div>
        </div>

        {/* Decorative dots */}
        <div style={css.dotPattern} />
      </div>

      {/* Right panel */}
      <div style={css.loginRight}>
        <div className="anim-up" style={css.loginCard}>
          <h2 style={css.cardH2}>Welcome back</h2>
          <p style={css.cardSub}>Sign in to your workspace</p>

          {err && <div style={css.errBox}>{err}</div>}

          <label style={css.lbl}>EMAIL ADDRESS</label>
          <input value={email} onChange={(e) => setEmail(e.target.value)} onKeyDown={(e) => e.key === "Enter" && go()} placeholder="you@unfoldcro.com" style={css.inp} />

          <label style={{ ...css.lbl, marginTop: 18 }}>PASSWORD</label>
          <input type="password" value={pass} onChange={(e) => setPass(e.target.value)} onKeyDown={(e) => e.key === "Enter" && go()} placeholder="••••••••" style={css.inp} />

          <button onClick={go} disabled={loading} className="login-btn" style={css.loginBtn}>
            {loading ? "Signing in..." : "SIGN IN"}
          </button>

          <p style={css.loginHint}>Each team member can log in with their credentials.</p>
        </div>
      </div>
    </div>
  );
}

/* ════════════════════════ DASHBOARD ════════════════════════ */
function Dashboard({ tasks, team, user }) {
  const cards = [
    { label: "Total Tasks", val: tasks.length, color: "#1A1A1A", bg: "#F7F7F7" },
    { label: "To Do", val: tasks.filter((t) => t.status === "todo").length, color: "#666", bg: "#F5F5F5" },
    { label: "In Progress", val: tasks.filter((t) => t.status === "in-progress").length, color: "#C48A00", bg: "#FFF8E6" },
    { label: "Completed", val: tasks.filter((t) => t.status === "done").length, color: "#2D8C3C", bg: "#EEFBE6" },
  ];
  const pct = tasks.length ? Math.round((tasks.filter((t) => t.status === "done").length / tasks.length) * 100) : 0;

  return (
    <div className="anim-up" style={css.page}>
      <div style={css.pgHead}>
        <div>
          <h1 style={css.pgTitle}>Dashboard</h1>
          <p style={css.pgSub}>Welcome back, <span style={{ color: "#1A1A1A", fontWeight: 600 }}>{user.name.split(" ")[0]}</span></p>
        </div>
        <div style={css.pgDate}>{new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })}</div>
      </div>

      {/* Overall progress */}
      <div style={css.progressCard}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <span style={{ fontSize: 14, color: "#888", fontWeight: 500 }}>Overall Completion</span>
          <span style={{ fontSize: 32, fontWeight: 800, color: "#1A1A1A", fontFamily: "var(--heading)" }}>{pct}%</span>
        </div>
        <div style={css.progTrack}>
          <div style={{ ...css.progFill, width: `${pct}%` }} />
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 10, fontSize: 12, color: "#AAA" }}>
          <span>{tasks.filter(t => t.status === "done").length} of {tasks.length} tasks complete</span>
          <span>{100 - pct}% remaining</span>
        </div>
      </div>

      {/* Stat cards */}
      <div style={css.statGrid}>
        {cards.map((c, i) => (
          <div key={i} className="anim-up stat-card" style={{ ...css.statCard, animationDelay: `${i * 0.07}s`, borderLeft: `3px solid ${c.color}` }}>
            <div style={{ fontSize: 12, color: "#999", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 12 }}>{c.label}</div>
            <div style={{ fontSize: 40, fontWeight: 800, color: c.color, fontFamily: "var(--heading)", lineHeight: 1 }}>{c.val}</div>
          </div>
        ))}
      </div>

      {/* Team workload */}
      <h2 style={css.secTitle}>Team Workload</h2>
      <div style={css.wlGrid}>
        {team.map((m, i) => {
          const mt = tasks.filter((t) => t.assignee === m.id);
          const dn = mt.filter((t) => t.status === "done").length;
          const ip = mt.filter((t) => t.status === "in-progress").length;
          const p = mt.length ? Math.round((dn / mt.length) * 100) : 0;
          return (
            <div key={m.id} className="anim-up stat-card" style={{ ...css.wlCard, animationDelay: `${i * 0.06}s` }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 18 }}>
                <div style={{ ...css.av40, background: m.color, color: "#fff" }}>{m.avatar}</div>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 700, color: "#1A1A1A" }}>{m.name}</div>
                  <div style={{ fontSize: 12, color: "#999" }}>{m.role}</div>
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                <div style={css.progTrackSm}>
                  <div style={{ height: "100%", width: `${p}%`, background: m.color, borderRadius: 4, transition: "width 0.5s ease" }} />
                </div>
                <span style={{ fontSize: 13, color: "#1A1A1A", fontWeight: 700, minWidth: 36, textAlign: "right" }}>{p}%</span>
              </div>
              <div style={{ display: "flex", gap: 16, fontSize: 12, color: "#999" }}>
                <span style={{ display: "flex", alignItems: "center", gap: 4 }}><span style={{ width: 6, height: 6, borderRadius: "50%", background: "#CCC", display: "inline-block" }} />{mt.length - dn - ip} todo</span>
                <span style={{ display: "flex", alignItems: "center", gap: 4 }}><span style={{ width: 6, height: 6, borderRadius: "50%", background: "#E6A516", display: "inline-block" }} />{ip} active</span>
                <span style={{ display: "flex", alignItems: "center", gap: 4 }}><span style={{ width: 6, height: 6, borderRadius: "50%", background: "#2D8C3C", display: "inline-block" }} />{dn} done</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ════════════════════════ TASKS ════════════════════════ */
function Tasks({ tasks, setTasks, team, user, modal, setModal, fMember, setFMember, fStatus, setFStatus }) {
  const cycle = (id) => {
    const order = ["todo", "in-progress", "done"];
    setTasks((p) => p.map((t) => t.id === id ? { ...t, status: order[(order.indexOf(t.status) + 1) % 3] } : t));
  };
  const del = (id) => setTasks((p) => p.filter((t) => t.id !== id));

  const filtered = tasks.filter((t) => (fMember === "all" || t.assignee === fMember) && (fStatus === "all" || t.status === fStatus));

  return (
    <div className="anim-up" style={css.page}>
      <div style={css.pgHead}>
        <div>
          <h1 style={css.pgTitle}>Tasks</h1>
          <p style={css.pgSub}>{filtered.length} task{filtered.length !== 1 && "s"}</p>
        </div>
        <button onClick={() => setModal({ type: "new-task" })} className="btn-primary" style={css.btnPrimary}>+ New Task</button>
      </div>

      {/* Filters */}
      <div style={css.filterBar}>
        <div style={css.fGroup}>
          <span style={css.fLabel}>Member</span>
          <select value={fMember} onChange={(e) => setFMember(e.target.value)} style={css.fSelect}>
            <option value="all">All Members</option>
            {team.map((m) => <option key={m.id} value={m.id}>{m.name}</option>)}
          </select>
        </div>
        <div style={css.fGroup}>
          <span style={css.fLabel}>Status</span>
          <select value={fStatus} onChange={(e) => setFStatus(e.target.value)} style={css.fSelect}>
            <option value="all">All Status</option>
            {Object.entries(STATUS_CFG).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
          </select>
        </div>
      </div>

      {/* Table */}
      <div style={css.tblWrap}>
        <div style={css.tblHead}>
          <div style={{ flex: 1 }}>TASK</div>
          <div style={{ width: 110 }}>ASSIGNEE</div>
          <div style={{ width: 100 }}>STATUS</div>
          <div style={{ width: 80 }}>PRIORITY</div>
          <div style={{ width: 90 }}>DUE DATE</div>
          <div style={{ width: 36 }} />
        </div>
        {filtered.length === 0 && <div style={css.tblEmpty}>No tasks match the current filters.</div>}
        {filtered.map((t) => {
          const m = team.find((u) => u.id === t.assignee);
          const st = STATUS_CFG[t.status];
          const pr = PRIO_CFG[t.priority];
          const overdue = t.status !== "done" && new Date(t.due) < new Date();
          return (
            <div key={t.id} className="tbl-row" style={css.tblRow}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: "#1A1A1A", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{t.title}</div>
                {t.description && <div style={{ fontSize: 12, color: "#AAA", marginTop: 2, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{t.description}</div>}
              </div>
              <div style={{ width: 110, display: "flex", alignItems: "center", gap: 8 }}>
                {m && <div style={{ ...css.av22, background: m.color, color: "#fff" }}>{m.avatar}</div>}
                <span style={{ fontSize: 12, color: "#666", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{m?.name.split(" ")[0]}</span>
              </div>
              <div style={{ width: 100 }}>
                <button onClick={() => cycle(t.id)} className="st-btn" style={{ ...css.stBtn, background: st.bg, color: st.fg, borderColor: st.ring }}>
                  {st.label}
                </button>
              </div>
              <div style={{ width: 80 }}>
                <span style={{ fontSize: 12, fontWeight: 600, color: pr.color, background: pr.bg, padding: "3px 10px", borderRadius: 4 }}>{pr.label}</span>
              </div>
              <div style={{ width: 90, fontSize: 12, color: overdue ? "#DC2626" : "#999", fontWeight: overdue ? 600 : 400 }}>
                {new Date(t.due).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
              </div>
              <div style={{ width: 36 }}>
                <button onClick={() => del(t.id)} className="x-btn" style={css.xBtn}>×</button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ════════════════════════ TEAM ════════════════════════ */
function Team({ team, setTeam, tasks, user, setModal }) {
  const rm = (id) => { if (id !== user.id) setTeam((p) => p.filter((m) => m.id !== id)); };

  return (
    <div className="anim-up" style={css.page}>
      <div style={css.pgHead}>
        <div>
          <h1 style={css.pgTitle}>Team</h1>
          <p style={css.pgSub}>{team.length} member{team.length !== 1 && "s"}</p>
        </div>
        <button onClick={() => setModal({ type: "add-member" })} className="btn-primary" style={css.btnPrimary}>+ Add Member</button>
      </div>

      <div style={css.tmGrid}>
        {team.map((m, i) => {
          const mt = tasks.filter((t) => t.assignee === m.id);
          const dn = mt.filter((t) => t.status === "done").length;
          const rate = mt.length ? Math.round((dn / mt.length) * 100) : 0;
          return (
            <div key={m.id} className="anim-up stat-card" style={{ ...css.tmCard, animationDelay: `${i * 0.06}s` }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
                  <div style={{ ...css.av48, background: m.color, color: "#fff" }}>{m.avatar}</div>
                  <div>
                    <div style={{ fontSize: 16, fontWeight: 700, color: "#1A1A1A" }}>{m.name}</div>
                    <div style={{ fontSize: 13, color: "#999", fontWeight: 500 }}>{m.role}</div>
                    <div style={{ fontSize: 12, color: "#CCC", marginTop: 2 }}>{m.email}</div>
                  </div>
                </div>
                {m.id !== user.id && <button onClick={() => rm(m.id)} className="x-btn" style={css.xBtn}>×</button>}
              </div>
              <div style={css.tmStats}>
                <div style={css.tmStat}>
                  <span style={css.tmStatV}>{mt.length}</span>
                  <span style={css.tmStatL}>TASKS</span>
                </div>
                <div style={css.tmStat}>
                  <span style={css.tmStatV}>{dn}</span>
                  <span style={css.tmStatL}>DONE</span>
                </div>
                <div style={css.tmStat}>
                  <span style={{ ...css.tmStatV, color: rate > 0 ? "#2D8C3C" : "#CCC" }}>{rate}%</span>
                  <span style={css.tmStatL}>RATE</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ════════════════════════ MODAL ════════════════════════ */
function Modal({ modal, close, tasks, setTasks, team, setTeam, user }) {
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [assignee, setAssignee] = useState(team[0]?.id || "");
  const [prio, setPrio] = useState("medium");
  const [due, setDue] = useState("2026-03-01");
  const [mName, setMName] = useState("");
  const [mEmail, setMEmail] = useState("");
  const [mRole, setMRole] = useState("Developer");

  const addTask = () => {
    if (!title.trim()) return;
    setTasks((p) => [{ id: uid(), title: title.trim(), description: desc.trim(), assignee, priority: prio, status: "todo", due, createdBy: user.id }, ...p]);
    close();
  };

  const addMember = () => {
    if (!mName.trim() || !mEmail.trim()) return;
    const ini = mName.trim().split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2);
    const cols = ["#1A1A1A", "#2D8C3C", "#6B4CE6", "#E6651A", "#1A7FE6", "#DC2626", "#0EA5E9"];
    setTeam((p) => [...p, { id: uid(), name: mName.trim(), email: mEmail.trim(), password: "pass", role: mRole, avatar: ini, color: cols[Math.floor(Math.random() * cols.length)] }]);
    close();
  };

  return (
    <div style={css.overlay} onClick={close}>
      <div className="anim-up" style={css.modal} onClick={(e) => e.stopPropagation()}>
        {modal.type === "new-task" && (
          <>
            <h3 style={css.mTitle}>New Task</h3>
            <label style={css.lbl}>TITLE</label>
            <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="What needs to be done?" style={css.inp} autoFocus />
            <label style={{ ...css.lbl, marginTop: 16 }}>DESCRIPTION</label>
            <input value={desc} onChange={(e) => setDesc(e.target.value)} placeholder="Brief description (optional)" style={css.inp} />
            <div style={{ display: "flex", gap: 14, marginTop: 16 }}>
              <div style={{ flex: 1 }}>
                <label style={css.lbl}>ASSIGN TO</label>
                <select value={assignee} onChange={(e) => setAssignee(e.target.value)} style={css.inp}>
                  {team.map((m) => <option key={m.id} value={m.id}>{m.name}</option>)}
                </select>
              </div>
              <div style={{ flex: 1 }}>
                <label style={css.lbl}>PRIORITY</label>
                <select value={prio} onChange={(e) => setPrio(e.target.value)} style={css.inp}>
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
              </div>
            </div>
            <label style={{ ...css.lbl, marginTop: 16 }}>DUE DATE</label>
            <input type="date" value={due} onChange={(e) => setDue(e.target.value)} style={css.inp} />
            <div style={css.mActions}>
              <button onClick={close} style={css.btnGhost}>Cancel</button>
              <button onClick={addTask} className="btn-primary" style={css.btnPrimary}>Create Task</button>
            </div>
          </>
        )}
        {modal.type === "add-member" && (
          <>
            <h3 style={css.mTitle}>Add Team Member</h3>
            <label style={css.lbl}>FULL NAME</label>
            <input value={mName} onChange={(e) => setMName(e.target.value)} placeholder="Jane Doe" style={css.inp} autoFocus />
            <label style={{ ...css.lbl, marginTop: 16 }}>EMAIL</label>
            <input value={mEmail} onChange={(e) => setMEmail(e.target.value)} placeholder="jane@unfoldcro.com" style={css.inp} />
            <label style={{ ...css.lbl, marginTop: 16 }}>ROLE</label>
            <select value={mRole} onChange={(e) => setMRole(e.target.value)} style={css.inp}>
              {["Admin", "Developer", "Designer", "Marketing", "Manager", "QA"].map((r) => <option key={r}>{r}</option>)}
            </select>
            <div style={css.mActions}>
              <button onClick={close} style={css.btnGhost}>Cancel</button>
              <button onClick={addMember} className="btn-primary" style={css.btnPrimary}>Add Member</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

/* ════════════════════════ GLOBAL CSS ════════════════════════ */
const GCSS = `
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;0,9..40,800&family=Space+Mono:wght@400;700&display=swap');
:root {
  --heading: 'DM Sans', sans-serif;
  --body: 'DM Sans', sans-serif;
  --mono: 'Space Mono', monospace;
}
* { box-sizing: border-box; margin: 0; padding: 0; }
body { background: #FAFAFA; }
::selection { background: #1A1A1A; color: #fff; }
input:focus, select:focus { outline: none; border-color: #1A1A1A !important; }
::-webkit-scrollbar { width: 5px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb { background: #DDD; border-radius: 6px; }
.side-btn:hover { background: rgba(0,0,0,0.04) !important; }
.tbl-row:hover { background: #FAFAFA !important; }
.tbl-row .x-btn { opacity: 0; }
.tbl-row:hover .x-btn { opacity: 1; }
.st-btn { cursor: pointer; transition: all 0.15s; border: 1px solid; font-family: var(--body); }
.st-btn:hover { filter: brightness(0.92); }
.btn-primary:hover { background: #333 !important; }
.login-btn:hover { background: #333 !important; }
.stat-card { transition: box-shadow 0.2s ease, transform 0.2s ease; }
.stat-card:hover { box-shadow: 0 4px 20px rgba(0,0,0,0.06); transform: translateY(-1px); }
.x-btn { transition: opacity 0.2s; }
@keyframes animUp {
  from { opacity: 0; transform: translateY(14px); }
  to { opacity: 1; transform: translateY(0); }
}
.anim-up { animation: animUp 0.45s ease forwards; opacity: 0; }
`;

/* ════════════════════════ STYLES ════════════════════════ */
const css = {
  shell: { display: "flex", minHeight: "100vh", background: "#FAFAFA", fontFamily: "var(--body)", color: "#666" },

  /* Sidebar */
  side: { background: "#FFFFFF", borderRight: "1px solid #EBEBEB", display: "flex", flexDirection: "column", flexShrink: 0, transition: "width 0.25s ease", overflow: "hidden" },
  sideBrand: { display: "flex", alignItems: "center", gap: 10, padding: "24px 18px 20px", whiteSpace: "nowrap" },
  logoMark: { width: 32, height: 32, borderRadius: 8, background: "#D6F5A0", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 },
  brandName: { fontFamily: "var(--heading)", fontSize: 18, fontWeight: 800, color: "#1A1A1A", letterSpacing: "-0.04em" },
  collapseBtn: { alignSelf: "flex-end", marginRight: 12, background: "none", border: "none", color: "#CCC", fontSize: 18, cursor: "pointer", padding: "2px 6px" },
  nav: { flex: 1, display: "flex", flexDirection: "column", gap: 2, padding: "4px 8px" },
  sideBtn: { display: "flex", alignItems: "center", gap: 10, padding: "11px 18px", borderRadius: 8, border: "none", background: "transparent", color: "#999", fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "var(--body)", whiteSpace: "nowrap", width: "100%", transition: "all 0.15s", letterSpacing: "0.08em" },
  sideBtnOn: { background: "#F5F5F5", color: "#1A1A1A" },
  sideFooter: { padding: "12px 8px 16px", borderTop: "1px solid #EBEBEB" },
  sideUser: { display: "flex", alignItems: "center", gap: 10, padding: "8px 12px", marginBottom: 4 },
  sideUName: { fontSize: 13, fontWeight: 700, color: "#1A1A1A", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" },
  sideURole: { fontSize: 11, color: "#AAA" },

  /* Avatars */
  av22: { width: 22, height: 22, borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, fontWeight: 700, flexShrink: 0 },
  av32: { width: 32, height: 32, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, flexShrink: 0 },
  av40: { width: 40, height: 40, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, flexShrink: 0 },
  av48: { width: 48, height: 48, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15, fontWeight: 700, flexShrink: 0 },

  /* Content */
  content: { flex: 1, overflow: "auto", padding: "36px 44px", minWidth: 0 },
  page: {},
  pgHead: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 32 },
  pgTitle: { fontFamily: "var(--heading)", fontSize: 28, fontWeight: 800, color: "#1A1A1A", letterSpacing: "-0.03em" },
  pgSub: { fontSize: 14, color: "#AAA", marginTop: 4 },
  pgDate: { fontSize: 12, color: "#999", fontWeight: 500, padding: "8px 16px", background: "#fff", borderRadius: 8, border: "1px solid #EBEBEB", letterSpacing: "0.02em" },

  /* Progress */
  progressCard: { background: "#fff", border: "1px solid #EBEBEB", borderRadius: 14, padding: "24px 28px", marginBottom: 24 },
  progTrack: { height: 8, background: "#F0F0F0", borderRadius: 8, overflow: "hidden" },
  progFill: { height: "100%", background: "linear-gradient(90deg, #1A1A1A, #444)", borderRadius: 8, transition: "width 0.7s ease" },
  progTrackSm: { flex: 1, height: 5, background: "#F0F0F0", borderRadius: 4, overflow: "hidden" },

  /* Stats */
  statGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 14, marginBottom: 40 },
  statCard: { background: "#fff", border: "1px solid #EBEBEB", borderRadius: 14, padding: "24px 24px" },

  /* Workload */
  secTitle: { fontSize: 18, fontWeight: 800, color: "#1A1A1A", fontFamily: "var(--heading)", marginBottom: 16, letterSpacing: "-0.02em" },
  wlGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 14 },
  wlCard: { background: "#fff", border: "1px solid #EBEBEB", borderRadius: 14, padding: 22 },

  /* Tasks */
  filterBar: { display: "flex", gap: 16, marginBottom: 20, flexWrap: "wrap" },
  fGroup: { display: "flex", alignItems: "center", gap: 8 },
  fLabel: { fontSize: 11, color: "#AAA", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em" },
  fSelect: { background: "#fff", border: "1px solid #EBEBEB", borderRadius: 8, padding: "8px 14px", color: "#1A1A1A", fontSize: 13, fontFamily: "var(--body)", cursor: "pointer" },
  tblWrap: { background: "#fff", border: "1px solid #EBEBEB", borderRadius: 14, overflow: "hidden" },
  tblHead: { display: "flex", alignItems: "center", gap: 12, padding: "14px 24px", borderBottom: "1px solid #EBEBEB", fontSize: 11, fontWeight: 700, color: "#AAA", textTransform: "uppercase", letterSpacing: "0.08em" },
  tblRow: { display: "flex", alignItems: "center", gap: 12, padding: "16px 24px", borderBottom: "1px solid #F5F5F5", fontSize: 14, transition: "background 0.12s" },
  tblEmpty: { padding: 48, textAlign: "center", color: "#CCC", fontSize: 14 },
  stBtn: { padding: "4px 14px", borderRadius: 6, fontSize: 11, fontWeight: 700, letterSpacing: "0.02em" },
  xBtn: { width: 28, height: 28, borderRadius: 7, border: "1px solid #FEE2E2", background: "#FEF2F2", color: "#DC2626", fontSize: 16, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" },

  /* Team */
  tmGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 14 },
  tmCard: { background: "#fff", border: "1px solid #EBEBEB", borderRadius: 14, padding: 24 },
  tmStats: { display: "flex", gap: 28, marginTop: 20, paddingTop: 18, borderTop: "1px solid #F5F5F5" },
  tmStat: { display: "flex", flexDirection: "column", gap: 2 },
  tmStatV: { fontSize: 22, fontWeight: 800, color: "#1A1A1A", fontFamily: "var(--heading)" },
  tmStatL: { fontSize: 10, color: "#BBB", letterSpacing: "0.1em", fontWeight: 600 },

  /* Buttons */
  btnPrimary: { padding: "10px 24px", borderRadius: 8, border: "none", background: "#1A1A1A", color: "#fff", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "var(--body)", whiteSpace: "nowrap", letterSpacing: "0.04em", transition: "background 0.2s" },
  btnGhost: { padding: "10px 20px", borderRadius: 8, border: "1px solid #EBEBEB", background: "transparent", color: "#999", fontSize: 13, fontWeight: 500, cursor: "pointer", fontFamily: "var(--body)" },

  /* Inputs */
  lbl: { display: "block", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "#AAA", marginBottom: 6 },
  inp: { width: "100%", background: "#FAFAFA", border: "1px solid #EBEBEB", borderRadius: 8, padding: "11px 14px", color: "#1A1A1A", fontSize: 14, fontFamily: "var(--body)", transition: "border-color 0.2s" },

  /* Modal */
  overlay: { position: "fixed", inset: 0, background: "rgba(0,0,0,0.3)", backdropFilter: "blur(8px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100, padding: 20 },
  modal: { background: "#fff", border: "1px solid #EBEBEB", borderRadius: 20, padding: 32, width: "100%", maxWidth: 480, boxShadow: "0 24px 48px rgba(0,0,0,0.12)" },
  mTitle: { fontFamily: "var(--heading)", fontSize: 22, fontWeight: 800, color: "#1A1A1A", marginBottom: 24, letterSpacing: "-0.02em" },
  mActions: { display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 28 },

  /* Login */
  loginWrap: { display: "flex", minHeight: "100vh", fontFamily: "var(--body)", color: "#666" },
  loginLeft: { flex: 1, background: "#FFFFFF", display: "flex", flexDirection: "column", justifyContent: "center", padding: "60px 56px", position: "relative", overflow: "hidden" },
  loginLeftInner: { position: "relative", zIndex: 2 },
  dotPattern: { position: "absolute", inset: 0, opacity: 0.4, backgroundImage: "radial-gradient(circle, #E0E0E0 1px, transparent 1px)", backgroundSize: "24px 24px", zIndex: 1 },
  loginH1: { fontFamily: "var(--heading)", fontSize: 44, fontWeight: 800, color: "#1A1A1A", lineHeight: 1.15, letterSpacing: "-0.04em" },
  loginP: { fontSize: 16, color: "#999", marginTop: 16, lineHeight: 1.7, maxWidth: 440 },
  featureList: { display: "flex", flexDirection: "column", gap: 10, marginTop: 32 },
  featureItem: { display: "flex", alignItems: "center", gap: 10, fontSize: 14, color: "#666" },
  featureCheck: { width: 22, height: 22, borderRadius: 6, background: "#EEFBE6", color: "#2D8C3C", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, flexShrink: 0 },
  credBox: { marginTop: 36, background: "#F7F7F7", border: "1px solid #EBEBEB", borderRadius: 10, padding: "14px 18px", display: "inline-block" },
  credLabel: { display: "block", fontSize: 10, fontWeight: 700, color: "#1A1A1A", textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 6 },
  credCode: { fontSize: 13, color: "#999", fontFamily: "var(--mono)" },
  loginRight: { width: 460, background: "#FAFAFA", display: "flex", alignItems: "center", justifyContent: "center", padding: 40, borderLeft: "1px solid #EBEBEB" },
  loginCard: { width: "100%", maxWidth: 340 },
  cardH2: { fontFamily: "var(--heading)", fontSize: 26, fontWeight: 800, color: "#1A1A1A", letterSpacing: "-0.03em" },
  cardSub: { fontSize: 14, color: "#AAA", marginTop: 4, marginBottom: 28 },
  errBox: { background: "#FEF2F2", border: "1px solid #FEE2E2", borderRadius: 8, padding: "10px 14px", color: "#DC2626", fontSize: 13, marginBottom: 16 },
  loginBtn: { width: "100%", padding: "13px 0", borderRadius: 8, border: "none", background: "#1A1A1A", color: "#fff", fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "var(--body)", marginTop: 24, letterSpacing: "0.06em", transition: "background 0.2s" },
  loginHint: { textAlign: "center", fontSize: 12, color: "#CCC", marginTop: 20 },
};
