"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  demoJourney,
  integrations,
  languages,
  portalHref,
  portals,
  roleIds,
  type RoleId,
  type SystemState,
} from "@/lib/healthconnect";

const stateCopy: Record<SystemState, { title: string; description: string; action: string }> = {
  ready: { title: "Portal ready", description: "Synthetic demonstration data is available.", action: "Continue" },
  loading: { title: "Loading portal", description: "Keeping the current context visible while data is prepared.", action: "Wait" },
  empty: { title: "No records available", description: "There are no synthetic records for this view.", action: "Return to overview" },
  error: { title: "We could not load this view", description: "No protected information is shown. Reference HC-DEMO-001.", action: "Retry" },
  offline: { title: "You are offline", description: "Video and connected actions are unavailable. Draft work remains local to this demonstration session.", action: "Reconnect" },
  degraded: { title: "Limited connectivity", description: "Lower-bandwidth actions remain available while video and large files are deferred.", action: "Use low-bandwidth mode" },
  "permission-denied": { title: "Access not permitted", description: "This demonstration role cannot access the selected function.", action: "Return safely" },
};

function initials(value: string): string {
  return value
    .split(" ")
    .slice(0, 2)
    .map((item) => item[0])
    .join("")
    .toUpperCase();
}

function IntegrationBadge({ name, state }: { name: string; state: string }) {
  return (
    <span className={`integration-badge integration-${state.toLowerCase()}`}>
      <span aria-hidden="true">●</span> {name}: {state}
    </span>
  );
}

export function PortalExperience({ initialRole }: { initialRole: RoleId }) {
  const [role, setRole] = useState<RoleId>(initialRole);
  const [language, setLanguage] = useState<(typeof languages)[number]>("English");
  const [systemState, setSystemState] = useState<SystemState>("ready");
  const [notice, setNotice] = useState<string | null>(null);
  const [showNotifications, setShowNotifications] = useState(false);
  const portal = useMemo(() => portals[role], [role]);

  function announce(message: string) {
    setNotice(message);
    window.setTimeout(() => setNotice(null), 3200);
  }

  function runAction(action: string) {
    announce(`${action} opened in synthetic demonstration mode. No production transaction was performed.`);
  }

  function changeRole(nextRole: RoleId) {
    setRole(nextRole);
    setSystemState("ready");
    setShowNotifications(false);
    window.history.replaceState({}, "", portalHref(nextRole));
  }

  return (
    <main className="portal-shell">
      <a className="skip-link" href="#portal-content">Skip to portal content</a>

      <aside className="portal-sidebar" aria-label="Portal navigation">
        <Link className="portal-brand" href="/">
          <span className="portal-brand-mark" aria-hidden="true">S</span>
          <span>
            <strong>Secor HealthConnect</strong>
            <small>Northern Cape demonstration</small>
          </span>
        </Link>

        <div className="role-context">
          <span className="eyebrow inverse">Current workspace</span>
          <strong>{portal.label}</strong>
          <small>Demo access only</small>
        </div>

        <nav className="portal-nav" aria-label={`${portal.shortLabel} navigation`}>
          {portal.navigation.map((item, index) => (
            <button
              type="button"
              className={index === 0 ? "portal-nav-item active" : "portal-nav-item"}
              key={item}
              onClick={() => announce(`${item} selected for ${portal.shortLabel}.`)}
            >
              <span aria-hidden="true">{index === 0 ? "◆" : "◇"}</span>
              <span>{item}</span>
            </button>
          ))}
        </nav>

        <div className="sidebar-disclosure">
          <strong>Synthetic demonstration</strong>
          <span>No real patient information</span>
          <span>Not for clinical decisions</span>
        </div>
      </aside>

      <section className="portal-workspace">
        <header className="portal-topbar">
          <label className="portal-search">
            <span aria-hidden="true">⌕</span>
            <input aria-label="Search synthetic records" placeholder="Search synthetic patients, facilities or records" />
          </label>

          <div className="portal-topbar-actions">
            <label className="compact-field">
              <span className="sr-only">Interface language</span>
              <select value={language} onChange={(event) => setLanguage(event.target.value as (typeof languages)[number])}>
                {languages.map((item) => <option key={item}>{item}</option>)}
              </select>
            </label>
            <button
              type="button"
              className="icon-control"
              aria-label="Open notifications"
              aria-expanded={showNotifications}
              onClick={() => setShowNotifications((value) => !value)}
            >
              <span aria-hidden="true">●</span>
            </button>
            <button type="button" className="account-control" onClick={() => announce("Account menu opened in demonstration mode.")}>
              RM
              <span className="sr-only">Open account menu</span>
            </button>
          </div>

          {showNotifications && (
            <section className="notification-popover" aria-label="Notifications">
              <strong>Demonstration notifications</strong>
              <p>Two synthetic workflow updates require review.</p>
              <button type="button" onClick={() => setShowNotifications(false)}>Close</button>
            </section>
          )}
        </header>

        <div className="portal-content" id="portal-content">
          <section className="portal-hero">
            <div>
              <span className="eyebrow">{portal.eyebrow}</span>
              <h1>{portal.title}</h1>
              <p>{portal.description}</p>
            </div>
            <div className="hero-controls">
              <label>
                <span>Demo role</span>
                <select value={role} onChange={(event) => changeRole(event.target.value as RoleId)}>
                  {roleIds.map((item) => <option value={item} key={item}>{portals[item].shortLabel}</option>)}
                </select>
              </label>
              <label>
                <span>System state</span>
                <select value={systemState} onChange={(event) => setSystemState(event.target.value as SystemState)}>
                  {Object.keys(stateCopy).map((item) => <option value={item} key={item}>{item}</option>)}
                </select>
              </label>
            </div>
          </section>

          <section className="integration-summary" aria-label="Integration status">
            {integrations.map((integration) => <IntegrationBadge key={integration.name} name={integration.name} state={integration.state} />)}
          </section>

          {systemState !== "ready" ? (
            <section className={`system-state state-${systemState}`} role={systemState === "error" ? "alert" : "status"}>
              <span className="system-state-icon" aria-hidden="true">!</span>
              <div>
                <h2>{stateCopy[systemState].title}</h2>
                <p>{stateCopy[systemState].description}</p>
                <button type="button" onClick={() => setSystemState("ready")}>{stateCopy[systemState].action}</button>
              </div>
            </section>
          ) : (
            <>
              <section className="metric-grid" aria-label="Portal metrics">
                {portal.metrics.map((metric) => (
                  <article className="metric-card" key={metric.label}>
                    <span>{metric.label}</span>
                    <strong>{metric.value}</strong>
                    <small className={`metric-${metric.tone ?? "neutral"}`}>{metric.context}</small>
                  </article>
                ))}
              </section>

              <section className="portal-primary-grid">
                <article className="surface-panel">
                  <div className="panel-heading">
                    <div>
                      <span className="eyebrow">Active workflow</span>
                      <h2>{portal.queueTitle}</h2>
                    </div>
                    <button type="button" className="text-action" onClick={() => announce("Full queue opened in demonstration mode.")}>View all</button>
                  </div>
                  <div className="work-queue">
                    {portal.queue.map((item) => (
                      <button type="button" className="work-row" key={item.id} onClick={() => runAction(`Open ${item.title}`)}>
                        <span className="work-avatar" aria-hidden="true">{initials(item.title)}</span>
                        <span className="work-copy">
                          <strong>{item.title}</strong>
                          <small>{item.detail}</small>
                        </span>
                        <span className={`status-badge priority-${item.priority ?? "routine"}`}>{item.status}</span>
                      </button>
                    ))}
                  </div>
                </article>

                <article className="surface-panel">
                  <div className="panel-heading">
                    <div>
                      <span className="eyebrow">Quick actions</span>
                      <h2>Continue your work</h2>
                    </div>
                  </div>
                  <div className="quick-actions">
                    {portal.actions.map((action, index) => (
                      <button type="button" className={index === 0 ? "quick-action primary" : "quick-action"} key={action} onClick={() => runAction(action)}>
                        <span>{action}</span><span aria-hidden="true">→</span>
                      </button>
                    ))}
                  </div>
                  {portal.clinicalNote && <p className="clinical-disclosure"><strong>Clinical safety:</strong> {portal.clinicalNote}</p>}
                </article>
              </section>

              <section className="portal-secondary-grid">
                <article className="surface-panel journey-panel">
                  <div className="panel-heading">
                    <div>
                      <span className="eyebrow">End-to-end demonstration</span>
                      <h2>Cross-role care journey</h2>
                    </div>
                  </div>
                  <ol className="journey-list">
                    {demoJourney.map((step, index) => (
                      <li key={step.label} className={step.role === role ? "current" : ""}>
                        <Link href={portalHref(step.role)}>
                          <span>{index + 1}</span>
                          <strong>{step.label}</strong>
                          <small>{step.action}</small>
                        </Link>
                      </li>
                    ))}
                  </ol>
                </article>

                <article className="surface-panel">
                  <div className="panel-heading">
                    <div>
                      <span className="eyebrow">Accessibility</span>
                      <h2>Inclusive access</h2>
                    </div>
                  </div>
                  <dl className="assurance-list">
                    <div><dt>Language</dt><dd>{language}</dd></div>
                    <div><dt>SASL</dt><dd>Interpreter workflow represented</dd></div>
                    <div><dt>Keyboard</dt><dd>Logical focus and visible controls</dd></div>
                    <div><dt>Connectivity</dt><dd>Offline and degraded states available</dd></div>
                  </dl>
                </article>
              </section>
            </>
          )}
        </div>
      </section>

      {notice && <div className="portal-toast" role="status" aria-live="polite">{notice}</div>}
    </main>
  );
}
