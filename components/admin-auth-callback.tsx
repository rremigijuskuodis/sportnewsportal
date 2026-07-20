"use client";

import { useEffect, useState } from "react";

export function AdminAuthCallback() {
  const [message, setMessage] = useState("Tikrinama prisijungimo nuoroda…");

  useEffect(() => {
    const params = new URLSearchParams(window.location.hash.replace(/^#/, ""));
    const access_token = params.get("access_token");
    const refresh_token = params.get("refresh_token");
    const expires_in = Number(params.get("expires_in") || 3600);
    if (!access_token || !refresh_token) {
      setMessage("Prisijungimo nuoroda netinkama arba nebegalioja.");
      return;
    }

    fetch("/api/admin/session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ access_token, refresh_token, expires_in })
    }).then(async (response) => {
      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        setMessage(data.error || "Prisijungti nepavyko.");
        return;
      }
      window.history.replaceState({}, "", "/admin/auth/callback");
      window.location.assign("/admin");
    }).catch(() => {
      setMessage("Nepavyko išsaugoti prisijungimo. Pabandykite dar kartą.");
    });
  }, []);

  return <main className="admin-login-shell"><section className="admin-login-card"><h1>{message}</h1></section></main>;
}
