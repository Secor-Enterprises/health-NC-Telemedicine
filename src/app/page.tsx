import Link from "next/link";
import { integrations, portalHref, portals, roleIds } from "@/lib/healthconnect";

export default function HomePage() {
  return (
    <main className="launch-page">
      <header className="launch-header">
        <div className="portal-brand">
          <span className="portal-brand-mark" aria-hidden="true">S</span>
          <span>
            <strong>Secor HealthConnect</strong>
            <small>Northern Cape digital-health demonstration</small>
          </span>
        </div>
        <a className="launch-link" href="https://github.com/Secor-Enterprises/health-NC-Telemedicine">View repository</a>
      </header>

      <section className="launch-hero">
        <div>
          <span className="eyebrow">Enterprise telemedicine platform</span>
          <h1>Connecting rural healthcare through governed digital workflows.</h1>
          <p>
            Explore seven responsive role portals, a cross-role care journey and explicit Azure, Entra,
            Teams, WhatsApp and FHIR integration boundaries using synthetic demonstration data only.
          </p>
          <div className="launch-actions">
            <Link className="launch-primary" href={portalHref("patient")}>Start patient journey</Link>
            <Link className="launch-secondary" href={portalHref("doctor")}>Open clinical workspace</Link>
          </div>
        </div>
        <aside className="launch-assurance" aria-label="Demonstration boundaries">
          <strong>Demonstration boundaries</strong>
          <ul>
            <li>Synthetic data only</li>
            <li>No production clinical transactions</li>
            <li>Integrations clearly labelled as mocked</li>
            <li>Clinical decisions remain human-reviewed</li>
          </ul>
        </aside>
      </section>

      <section className="portal-directory" aria-labelledby="portal-directory-title">
        <div className="section-heading">
          <span className="eyebrow">Role-based access</span>
          <h2 id="portal-directory-title">Choose a portal</h2>
          <p>Role switching is provided for stakeholder demonstrations. It is not an authorization control.</p>
        </div>
        <div className="portal-card-grid">
          {roleIds.map((role, index) => {
            const portal = portals[role];
            return (
              <Link className="portal-launch-card" href={portalHref(role)} key={role}>
                <span className="portal-number" aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
                <span className="eyebrow">{portal.eyebrow}</span>
                <h3>{portal.label}</h3>
                <p>{portal.description}</p>
                <span className="card-action">Open portal <span aria-hidden="true">→</span></span>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="launch-integrations" aria-labelledby="integration-title">
        <div className="section-heading">
          <span className="eyebrow">Architecture boundary</span>
          <h2 id="integration-title">Integration readiness</h2>
        </div>
        <div className="integration-card-grid">
          {integrations.map((integration) => (
            <article className="integration-card" key={integration.name}>
              <span className="status-badge priority-routine">{integration.state}</span>
              <h3>{integration.name}</h3>
              <p>{integration.detail}</p>
            </article>
          ))}
        </div>
      </section>

      <footer className="launch-footer">
        <span>Secor HealthConnect · Synthetic demonstration</span>
        <span>GitHub Pages is not a production healthcare environment.</span>
      </footer>
    </main>
  );
}
