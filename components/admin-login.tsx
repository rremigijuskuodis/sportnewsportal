"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export function AdminLogin() {
  const router = useRouter();
  const [email, setEmail] = useState("r.remigijus.kuodis@gmail.com");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("error") === "invalid_link") {
      setMessage("Prisijungimo nuoroda nebegalioja. Junkites slaptazodziu.");
    }
  }, []);

  async function submit(event: FormEvent) {
    event.preventDefault();
    setBusy(true);
    setMessage("");

    const response = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
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
        <p>Prisijunkite el. pastu ir slaptazodziu. Taip administravimo panele veiks stabiliai ir nereikes laukti vienkartiniu nuorodu.</p>
        <form onSubmit={submit}>
          <label>
            El. pastas
            <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} autoComplete="username" required />
          </label>
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
