"use client";

import { useState } from "react";

export function AdminRecovery() {
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  async function sendRecovery() {
    setBusy(true); setMessage("");
    const response = await fetch("/api/admin/recovery", { method: "POST" });
    const data = await response.json().catch(() => ({}));
    setMessage(response.ok ? "Laiškas išsiųstas į r.remigijus.kuodis@gmail.com. Atidarykite jį ir paspauskite atkūrimo nuorodą." : (data.error || "Laiško išsiųsti nepavyko."));
    setBusy(false);
  }
  return <main className="admin-login-shell"><section className="admin-login-card">
    <span className="admin-eyebrow">Sporto Radaras</span><h1>Atkurti slaptažodį</h1>
    <p>Į jūsų administratoriaus el. paštą išsiųsime saugią atkūrimo nuorodą.</p>
    <button onClick={sendRecovery} disabled={busy}>{busy ? "Siunčiama..." : "Siųsti atkūrimo laišką"}</button>
    {message ? <p className="admin-message">{message}</p> : null}
    <a href="/admin/login">← Grįžti į prisijungimą</a>
  </section></main>;
}
