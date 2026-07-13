export default function Loading() {
  return (
    <main className="launch-page" aria-busy="true">
      <section className="system-state state-loading" role="status" style={{ margin: "10vh auto", maxWidth: 880 }}>
        <span className="system-state-icon" aria-hidden="true">…</span>
        <div>
          <h1>Preparing Secor HealthConnect</h1>
          <p>Loading the synthetic demonstration workspace. No production clinical system is being accessed.</p>
        </div>
      </section>
    </main>
  );
}
