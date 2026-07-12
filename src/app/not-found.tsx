import Link from "next/link";

export default function NotFound() {
  return (
    <main className="launch-page">
      <section className="system-state state-error" style={{ margin: "10vh auto", maxWidth: 880 }}>
        <span className="system-state-icon" aria-hidden="true">!</span>
        <div>
          <h1>Portal not found</h1>
          <p>The requested demonstration route does not exist. No protected information was exposed.</p>
          <Link className="launch-primary" href="/">Return to portal directory</Link>
        </div>
      </section>
    </main>
  );
}
