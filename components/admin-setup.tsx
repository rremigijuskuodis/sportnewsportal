"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export function AdminSetup() {
  const router = useRouter();
  const [activationCode, setActivationCode] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(event: FormEvent) {
    event.preventDefault();
    if (password !== confirmPassword) { setMessage("Slaptažodžiai nesutampa."); return; }
    setBusy(true); setMessage("");
    const response = await fetch("/api/admin/bootstrap", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ activationCode, password }) });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) { setMessage(data.error || "Aktyvuoti nepavyko."); setBusy(false); return; }
    if (data.requiresEmailConfirmation) {
      setMessage("Paskyra sukurta. Patvirtinkite laišką, kurį gavote į r.remigijus.kuodis@gmail.com, ir tada prisijunkite.");
      setBusy(false);
      return;
    }
    router.replace("/admin/login");
  }

  return <main className="admin-login-shell"><section className="admin-login-card">
    <span className="admin-eyebrow">Sporto Radaras</span><h1>Aktyvuoti administravimą</h1>
    <p>Nustatykite savo administratoriaus slaptažodį.</p>
    <form onSubmit={submit}>
      <label>Aktyvavimo kodas<input value={activationCode} onChange={(event) => setActivationCode(event.target.value)} required /></label>
      <label>Naujas slaptažodis<input type="password" minLength={12} value={password} onChange={(event) => setPassword(event.target.value)} required /></label>
      <label>Pakartokite slaptažodį<input type="password" minLength={12} value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} required /></label>
      <button type="submit" disabled={busy}>{busy ? "Aktyvuojama..." : "Sukurti paskyrą"}</button>
    </form>
    {message ? <p className="admin-message">{message}</p> : null}
    <a href="/admin/login">← Grįžti į prisijungimą</a>
  </section></main>;
}
