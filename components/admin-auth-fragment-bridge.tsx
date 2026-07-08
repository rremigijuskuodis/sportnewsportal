"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export function AdminAuthFragmentBridge() {
  const router = useRouter();
  const [isSigningIn, setIsSigningIn] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.hash.replace(/^#/, ""));
    const access_token = params.get("access_token");
    const refresh_token = params.get("refresh_token");

    if (!access_token || !refresh_token) return;

    const expires_in = Number(params.get("expires_in") || 3600);
    setIsSigningIn(true);
    window.history.replaceState({}, "", window.location.pathname + window.location.search);

    fetch("/api/admin/session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ access_token, refresh_token, expires_in })
    }).then(async (response) => {
      if (!response.ok) {
        setIsSigningIn(false);
        router.replace("/admin/login?error=invalid_link");
        return;
      }

      router.replace("/admin");
      router.refresh();
    });
  }, [router]);

  if (!isSigningIn) return null;

  return (
    <div className="admin-auth-overlay" role="status" aria-live="polite">
      <div className="admin-login-card">
        <h1>Jungiama prie administravimo…</h1>
        <p>Prisijungimo nuoroda tikrinama.</p>
      </div>
    </div>
  );
}
