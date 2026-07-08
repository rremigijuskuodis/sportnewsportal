"use client";

import { FormEvent, useState } from "react";

export function AdminLogin() {
  const [email, setEmail] = useState("r.remigijus.kuodis@gmail.com");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(event: FormEvent) {
    event.preventDefault();
    setBusy(true);
    setMessage("");
    const response = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email })
    });
    const data = await response.json().catch(() => ({}));
    setMessage(response.ok ? "Prisijungimo nuoroda išsiųsta. Patikrinkite el. paštą." : data.error || "Nepavyko prisijungti.");
    setBusy(false);
  }

  return (
    <main className="admin-login-shell">
      <section className="admin-login-card">
        <span className="admin-eyebrow">Sporto redakcija</span>
        <h1>Administravimas</h1>
        <p>Įveskite patvirtintą administratoriaus el. paštą. Atsiųsime vienkartinę saugią prisijungimo nuorodą.</p>
        <form onSubmit={submit}>
          <label>
            El. paštas
            <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} required />
          </label>
          <button type="submit" disabled={busy}>{busy ? "Siunčiama…" : "Atsiųsti prisijungimo nuorodą"}</button>
        </form>
        {message ? <p className="admin-message">{message}</p> : null}
        <a href="/">← Grįžti į portalą</a>
      </section>
    </main>
  );
}

