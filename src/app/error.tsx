"use client";

export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <html lang="en">
      <body>
        <main className="launch-page">
          <section className="system-state state-error" role="alert" style={{ margin: "10vh auto", maxWidth: 880 }}>
            <span className="system-state-icon" aria-hidden="true">!</span>
            <div>
              <h1>Secor HealthConnect could not continue</h1>
              <p>The demonstration encountered an unexpected error. No stack trace or protected information is displayed.</p>
              <button type="button" onClick={reset}>Retry safely</button>
            </div>
          </section>
        </main>
      </body>
    </html>
  );
}
