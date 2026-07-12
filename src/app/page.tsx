"use client";

import { useMemo, useState } from "react";
import { dashboards, languages, roles, type Role } from "@/lib/demo-data";

function Icon({ name }: { name: string }) {
  const symbols: Record<string, string> = {
    home: "⌂",
    calendar: "◫",
    patient: "✚",
    messages: "✦",
    report: "▥",
    shield: "◇",
    bell: "●",
    search: "⌕",
  };

  return <span aria-hidden="true">{symbols[name] ?? "•"}</span>;
}

export default function Home() {
  const [role, setRole] = useState<Role>("doctor");
  const [language, setLanguage] = useState("English");
  const [toast, setToast] = useState<string | null>(null);
  const dashboard = useMemo(() => dashboards[role], [role]);

  function runAction(action: string) {
    setToast(`${action} opened in demonstration mode.`);
    window.setTimeout(() => setToast(null), 2400);
  }

  return (
    <main className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-mark">S</div>
          <div>
            <strong>Secor HealthConnect</strong>
            <span>Northern Cape</span>
          </div>
        </div>

        <nav aria-label="Primary navigation">
          {[
            ["home", "Overview"],
            ["calendar", "Appointments"],
            ["patient", "Patients"],
            ["messages", "Collaboration"],
            ["report", "Analytics"],
            ["shield", "Security"],
          ].map(([icon, label], index) => (
            <button className={index === 0 ? "nav-item active" : "nav-item"} key={label}>
              <Icon name={icon} /> <span>{label}</span>
            </button>
          ))}
        </nav>

        <div className="sidebar-foot">
          <div className="network-status">
            <span className="status-dot" />
            <div>
              <strong>Network healthy</strong>
              <small>9 facilities connected</small>
            </div>
          </div>
          <small>Synthetic demonstration data only</small>
        </div>
      </aside>

      <section className="workspace">
        <header className="topbar">
          <label className="search">
            <Icon name="search" />
            <input aria-label="Search" placeholder="Search patients, facilities or records" />
          </label>
          <div className="topbar-actions">
            <select value={language} onChange={(event) => setLanguage(event.target.value)} aria-label="Language">
              {languages.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
            <button className="icon-button" aria-label="Notifications">
              <Icon name="bell" />
            </button>
            <div className="avatar">RM</div>
          </div>
        </header>

        <div className="content">
          <section className="hero">
            <div>
              <span className="eyebrow">{dashboard.eyebrow}</span>
              <h1>{dashboard.title}</h1>
              <p>{dashboard.description}</p>
            </div>
            <div className="role-picker">
              <label htmlFor="role">Demo role</label>
              <select id="role" value={role} onChange={(event) => setRole(event.target.value as Role)}>
                {roles.map((item) => (
                  <option value={item.id} key={item.id}>
                    {item.label}
                  </option>
                ))}
              </select>
            </div>
          </section>

          <section className="metrics" aria-label="Key metrics">
            {dashboard.metrics.map((metric) => (
              <article className="metric-card" key={metric.label}>
                <span>{metric.label}</span>
                <strong>{metric.value}</strong>
                <small>{metric.change}</small>
              </article>
            ))}
          </section>

          <section className="main-grid">
            <article className="panel queue-panel">
              <div className="panel-head">
                <div>
                  <span className="eyebrow">Live workflow</span>
                  <h2>{dashboard.queueTitle}</h2>
                </div>
                <button className="text-button">View all</button>
              </div>
              <div className="queue">
                {dashboard.queue.map((item) => (
                  <button className="queue-row" key={item.name} onClick={() => runAction(`Open ${item.name}`)}>
                    <span className="queue-avatar">{item.name.slice(0, 2).toUpperCase()}</span>
                    <span className="queue-copy">
                      <strong>{item.name}</strong>
                      <small>{item.detail}</small>
                    </span>
                    <span className={`badge ${item.status.toLowerCase().replace(" ", "-")}`}>{item.status}</span>
                  </button>
                ))}
              </div>
            </article>

            <article className="panel action-panel">
              <div className="panel-head">
                <div>
                  <span className="eyebrow">Quick actions</span>
                  <h2>Continue your work</h2>
                </div>
              </div>
              <div className="action-list">
                {dashboard.actions.map((action, index) => (
                  <button className={index === 0 ? "action primary" : "action"} onClick={() => runAction(action)} key={action}>
                    <span>{action}</span>
                    <b>→</b>
                  </button>
                ))}
              </div>
              <div className="integration-strip">
                <span>Entra ID</span>
                <span>Azure SQL</span>
                <span>Teams</span>
                <span>WhatsApp</span>
                <span>FHIR R4</span>
              </div>
            </article>
          </section>

          <section className="lower-grid">
            <article className="panel map-card">
              <div className="panel-head">
                <div>
                  <span className="eyebrow">Facility network</span>
                  <h2>Northern Cape coverage</h2>
                </div>
              </div>
              <div className="map">
                {["Upington", "Kuruman", "De Aar", "Springbok", "Calvinia", "Prieska"].map((place, index) => (
                  <span className={`map-pin pin-${index + 1}`} key={place}>
                    {place}
                  </span>
                ))}
                <div className="map-road road-1" />
                <div className="map-road road-2" />
              </div>
            </article>
            <article className="panel compliance">
              <div className="panel-head">
                <div>
                  <span className="eyebrow">Trust centre</span>
                  <h2>Security posture</h2>
                </div>
              </div>
              {[
                ["POPIA controls", "Configured"],
                ["MFA coverage", "100%"],
                ["Audit events", "Streaming"],
                ["Azure SQL RLS", "Validated"],
              ].map(([label, value]) => (
                <div className="compliance-row" key={label}>
                  <span>{label}</span>
                  <strong>{value}</strong>
                </div>
              ))}
            </article>
          </section>
        </div>
      </section>

      {toast && (
        <div role="status" className="toast">
          {toast}
        </div>
      )}
    </main>
  );
}
