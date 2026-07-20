"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export function AdminLogin() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(event: FormEvent) {
    event.preventDefault();
    setBusy(true);
    setMessage("");

    const response = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password })
    });

    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      setMessage(data.error || "Nepavyko prisijungti.");
      setBusy(false);
      return;
    }

    router.replace("/admin");
    router.refresh();
  }

  return (
    <main className="admin-login-shell">
      <section className="admin-login-card">
        <span className="admin-eyebrow">Sporto Radaras</span>
        <h1>Administravimas</h1>
        <p>Įveskite administratoriaus slaptažodį.</p>
        <form onSubmit={submit}>
          <label>
            Slaptazodis
            <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} autoComplete="current-password" required />
          </label>
          <button type="submit" disabled={busy}>{busy ? "Jungiamasi..." : "Prisijungti"}</button>
        </form>
        {message ? <p className="admin-message">{message}</p> : null}
        <a href="/">← Grizti i portala</a>
      </section>
    </main>
  );
}
