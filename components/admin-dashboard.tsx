"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type AdminArticle = {
  id: string;
  title: string;
  slug: string;
  summary: string;
  lead?: string;
  body_markdown?: string;
  category: string;
  sport: string;
  status: string;
  priority_score?: number;
  risk_level?: string;
  why_it_matters?: string;
  source_name?: string;
  source_url?: string;
  image_url?: string;
  image_alt?: string;
  is_featured?: boolean;
  editor_locked?: boolean;
  image_focus_x?: number;
  image_focus_y?: number;
  published_at?: string;
  updated_at?: string;
};

type PortalSettings = {
  automation_enabled: boolean;
  article_interval_hours: number;
  articles_per_day: number;
  articles_per_hour: number;
  articles_per_run: number;
  generation_start_hour: number;
  generation_end_hour: number;
  article_model: string;
  radar_enabled: boolean;
  radar_interval_minutes: number;
  radar_model: string;
  auto_approve_enabled: boolean;
  minimum_priority: number;
};

const defaultSettings: PortalSettings = {
  automation_enabled: true,
  article_interval_hours: 6,
  articles_per_day: 2,
  articles_per_hour: 1,
  articles_per_run: 1,
  generation_start_hour: 8,
  generation_end_hour: 23,
  article_model: "gpt-5.4-mini",
  radar_enabled: true,
  radar_interval_minutes: 120,
  radar_model: "gpt-5.4-mini",
  auto_approve_enabled: true,
  minimum_priority: 3
};

const emptyArticle: Partial<AdminArticle> = {
  title: "", summary: "", lead: "", body_markdown: "", category: "news", sport: "multi_sport",
  status: "draft", priority_score: 3, risk_level: "low", why_it_matters: "",
  source_name: "Sporto Radaras", source_url: "", image_url: "", image_alt: "",
  is_featured: false, editor_locked: true, image_focus_x: 50, image_focus_y: 30
};

export function AdminDashboard() {
  const router = useRouter();
  const [tab, setTab] = useState<"articles" | "editor" | "settings" | "account">("articles");
  const [articles, setArticles] = useState<AdminArticle[]>([]);
  const [draft, setDraft] = useState<Partial<AdminArticle>>(emptyArticle);
  const [settings, setSettings] = useState<PortalSettings | null>(null);
  const [settingsError, setSettingsError] = useState("");
  const [message, setMessage] = useState("Kraunama…");
  const [busy, setBusy] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");

  async function load() {
    let me: Response | null = null;
    // A fresh deployment can briefly cold-start the auth route. Retry before
    // treating the visitor as logged out, so the panel does not flash and vanish.
    for (let attempt = 0; attempt < 3; attempt += 1) {
      try {
        me = await fetch(`/api/admin/me?ts=${Date.now()}`, { cache: "no-store" });
        if (me.ok) break;
      } catch { /* retry */ }
      await new Promise((resolve) => window.setTimeout(resolve, 350 * (attempt + 1)));
    }
    if (!me?.ok) { router.replace("/admin/login?error=session"); return; }
    const [articleResponse, settingsResponse] = await Promise.all([
      fetch("/api/admin/articles", { cache: "no-store" }),
      fetch("/api/admin/settings", { cache: "no-store" })
    ]);
    if (articleResponse.ok) setArticles(await articleResponse.json());
    if (settingsResponse.ok) {
      const values = await settingsResponse.json();
      const saved = Array.isArray(values) ? values[0] : values;
      setSettings({ ...defaultSettings, ...(saved || {}) });
      setSettingsError(saved ? "" : "Nustatymų eilutės dar nebuvo – išsaugant ji bus sukurta automatiškai.");
    } else {
      const error = await settingsResponse.json().catch(() => ({}));
      setSettings({ ...defaultSettings });
      setSettingsError(error.message || error.error || "Nepavyko pasiekti automatikos nustatymų lentelės.");
    }
    setMessage("");
  }

  useEffect(() => {
    load();
    const keepAlive = window.setInterval(() => fetch("/api/admin/me", { cache: "no-store" }), 45 * 60 * 1000);
    return () => window.clearInterval(keepAlive);
  }, []);

  function editArticle(article?: AdminArticle) {
    setDraft(article ? { ...article } : { ...emptyArticle });
    setTab("editor");
  }

  function field(name: keyof AdminArticle, value: unknown) {
    setDraft((current) => ({ ...current, [name]: value }));
  }

  async function saveArticle(event?: FormEvent, nextStatus?: string) {
    event?.preventDefault();
    setBusy(true);
    setMessage("");
    const payload = { ...draft, status: nextStatus || draft.status, current_body: draft.body_markdown, current_image: draft.image_url };
    const response = await fetch(draft.id ? `/api/admin/articles/${draft.id}` : "/api/admin/articles", {
      method: draft.id ? "PATCH" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) setMessage(data.error || "Išsaugoti nepavyko.");
    else {
      setMessage(nextStatus === "published" ? "Straipsnis publikuotas." : "Straipsnis išsaugotas.");
      if (Array.isArray(data) && data[0]) setDraft(data[0]);
      await load();
    }
    setBusy(false);
  }

  async function saveSettings(event: FormEvent) {
    event.preventDefault();
    if (!settings) return;
    setBusy(true);
    const response = await fetch("/api/admin/settings", {
      method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(settings)
    });
    const data = await response.json().catch(() => ({}));
    if (response.ok) {
      const saved = Array.isArray(data) ? data[0] : data;
      if (saved) setSettings({ ...defaultSettings, ...saved });
      setSettingsError("");
      setMessage("Automatikos nustatymai išsaugoti.");
    } else {
      setSettingsError(data.message || data.error || "Nustatymų išsaugoti nepavyko.");
      setMessage("Nustatymų išsaugoti nepavyko.");
    }
    setBusy(false);
  }

  async function logout() {
    await fetch("/api/admin/session", { method: "DELETE" });
    router.replace("/admin/login");
  }

  async function changePassword(event: FormEvent) {
    event.preventDefault();
    if (newPassword !== confirmNewPassword) { setMessage("Slaptažodžiai nesutampa."); return; }
    setBusy(true);
    const response = await fetch("/api/admin/password", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ password: newPassword }) });
    const data = await response.json().catch(() => ({}));
    setMessage(response.ok ? "Slaptažodis pakeistas." : (data.error || "Slaptažodžio pakeisti nepavyko."));
    if (response.ok) { setNewPassword(""); setConfirmNewPassword(""); }
    setBusy(false);
  }

  return (
    <main className="admin-shell">
      <header className="admin-header">
        <div><span className="admin-eyebrow">Sporto Radaras</span><h1>Valdymo centras</h1></div>
        <div className="admin-header-actions"><a href="/" target="_blank">Atidaryti portalą</a><button onClick={logout}>Atsijungti</button></div>
      </header>

      <nav className="admin-tabs">
        <button className={tab === "articles" ? "active" : ""} onClick={() => setTab("articles")}>Straipsniai</button>
        <button className={tab === "editor" ? "active" : ""} onClick={() => editArticle()}>Naujas straipsnis</button>
        <button className={tab === "settings" ? "active" : ""} onClick={() => setTab("settings")}>Automatika</button>
        <button className={tab === "account" ? "active" : ""} onClick={() => setTab("account")}>Paskyra</button>
      </nav>
      {message ? <div className="admin-notice">{message}</div> : null}

      {tab === "articles" ? (
        <section className="admin-panel">
          <div className="admin-panel-head"><div><h2>Visi straipsniai</h2><p>AI ir rankiniai įrašai vienoje vietoje.</p></div><button className="admin-primary" onClick={() => editArticle()}>+ Naujas</button></div>
          <div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>Antraštė</th><th>Būsena</th><th>Prioritetas</th><th>Data</th><th /></tr></thead><tbody>
            {articles.map((article) => <tr key={article.id}><td><strong>{article.title}</strong><small>{article.sport} · {article.source_name}</small></td><td><span className={`admin-status ${article.status}`}>{article.status}</span></td><td>{article.priority_score || 3}/5</td><td>{article.published_at ? new Date(article.published_at).toLocaleString("lt-LT") : "Juodraštis"}</td><td><button onClick={() => editArticle(article)}>Redaguoti</button></td></tr>)}
          </tbody></table></div>
        </section>
      ) : null}

      {tab === "editor" ? (
        <form className="admin-panel admin-editor" onSubmit={(event) => saveArticle(event)}>
          <div className="admin-panel-head"><div><h2>{draft.id ? "Redaguoti straipsnį" : "Naujas straipsnis"}</h2><p>Redaktoriaus užrakintas įrašas automatikos nebus perrašytas.</p></div><div className="admin-save-actions"><button type="submit" disabled={busy}>Išsaugoti</button>{draft.id ? <button type="button" className="admin-primary" disabled={busy} onClick={() => saveArticle(undefined, "published")}>Publikuoti</button> : null}</div></div>
          <div className="admin-form-grid">
            <label className="wide">Antraštė<input value={draft.title || ""} onChange={(e) => field("title", e.target.value)} required /></label>
            <label className="wide">Santrauka<textarea rows={3} value={draft.summary || ""} onChange={(e) => field("summary", e.target.value)} required /></label>
            <label className="wide">Lead tekstas<textarea rows={3} value={draft.lead || ""} onChange={(e) => field("lead", e.target.value)} /></label>
            <label className="wide">Straipsnio tekstas<textarea className="admin-body-input" rows={16} value={draft.body_markdown || ""} onChange={(e) => field("body_markdown", e.target.value)} /></label>
            <label>Sporto šaka<input value={draft.sport || ""} onChange={(e) => field("sport", e.target.value)} /></label>
            <label>Kategorija<input value={draft.category || ""} onChange={(e) => field("category", e.target.value)} /></label>
            <label>Prioritetas<select value={draft.priority_score || 3} onChange={(e) => field("priority_score", Number(e.target.value))}>{[1,2,3,4,5].map((n) => <option key={n} value={n}>{n}/5</option>)}</select></label>
            <label>Rizika<select value={draft.risk_level || "low"} onChange={(e) => field("risk_level", e.target.value)}><option value="low">Žema</option><option value="medium">Vidutinė</option><option value="high">Aukšta</option></select></label>
            <label className="wide">Kodėl tai svarbu?<textarea rows={3} value={draft.why_it_matters || ""} onChange={(e) => field("why_it_matters", e.target.value)} /></label>
            <label className="wide">Nuotraukos URL<input type="url" value={draft.image_url || ""} onChange={(e) => field("image_url", e.target.value)} /></label>
            <label className="wide">Nuotraukos aprašymas<input value={draft.image_alt || ""} onChange={(e) => field("image_alt", e.target.value)} /></label>
            <label>Nuotraukos fokusas horizontaliai: {draft.image_focus_x ?? 50}%<input type="range" min="0" max="100" value={draft.image_focus_x ?? 50} onChange={(e) => field("image_focus_x", Number(e.target.value))} /></label>
            <label>Nuotraukos fokusas vertikaliai: {draft.image_focus_y ?? 30}%<input type="range" min="0" max="100" value={draft.image_focus_y ?? 30} onChange={(e) => field("image_focus_y", Number(e.target.value))} /></label>
            <label>Šaltinis<input value={draft.source_name || ""} onChange={(e) => field("source_name", e.target.value)} /></label>
            <label>Šaltinio URL<input type="url" value={draft.source_url || ""} onChange={(e) => field("source_url", e.target.value)} /></label>
            <label className="admin-check"><input type="checkbox" checked={Boolean(draft.is_featured)} onChange={(e) => field("is_featured", e.target.checked)} /> Rodyti tarp pagrindinių</label>
            <label className="admin-check"><input type="checkbox" checked={draft.editor_locked !== false} onChange={(e) => field("editor_locked", e.target.checked)} /> Apsaugoti nuo automatikos</label>
          </div>
        </form>
      ) : null}

      {tab === "settings" && settings ? (
        <form className="admin-panel" onSubmit={saveSettings}>
          <div className="admin-panel-head"><div><h2>Automatikos nustatymai</h2><p>Trigeriai tikrina dažniau, bet vykdo darbus pagal šiuos limitus.</p></div><button className="admin-primary" disabled={busy}>Išsaugoti</button></div>
          {settingsError ? <div className="admin-warning"><strong>Nustatymų būsena</strong><span>{settingsError}</span></div> : null}
          <div className="admin-form-grid">
            <label className="admin-check"><input type="checkbox" checked={settings.automation_enabled} onChange={(e) => setSettings({...settings, automation_enabled:e.target.checked})} /> Generuoti straipsnius automatiškai</label>
            <label>Generavimo intervalas (val.)<input type="number" min="1" max="24" value={settings.article_interval_hours} onChange={(e) => setSettings({...settings, article_interval_hours:Number(e.target.value)})} /></label>
            <label>Straipsnių per dieną<input type="number" min="0" max="50" value={settings.articles_per_day} onChange={(e) => setSettings({...settings, articles_per_day:Number(e.target.value)})} /></label>
            <label>Straipsnių per valandą<input type="number" min="0" max="10" value={settings.articles_per_hour} onChange={(e) => setSettings({...settings, articles_per_hour:Number(e.target.value)})} /></label>
            <label>Straipsnių vienu paleidimu<input type="number" min="1" max="10" value={settings.articles_per_run} onChange={(e) => setSettings({...settings, articles_per_run:Number(e.target.value)})} /></label>
            <label>Generuoti nuo (val.)<input type="number" min="0" max="23" value={settings.generation_start_hour} onChange={(e) => setSettings({...settings, generation_start_hour:Number(e.target.value)})} /></label>
            <label>Generuoti iki (val.)<input type="number" min="0" max="23" value={settings.generation_end_hour} onChange={(e) => setSettings({...settings, generation_end_hour:Number(e.target.value)})} /></label>
            <label>Straipsnių AI modelis<select value={settings.article_model} onChange={(e) => setSettings({...settings, article_model:e.target.value})}><option value="gpt-5.4-mini">GPT-5.4 mini</option><option value="gpt-5.4">GPT-5.4</option></select></label>
            <label className="admin-check"><input type="checkbox" checked={settings.radar_enabled} onChange={(e) => setSettings({...settings, radar_enabled:e.target.checked})} /> Sporto radaras įjungtas</label>
            <label>Radaro intervalas (min.)<input type="number" min="15" step="15" max="360" value={settings.radar_interval_minutes} onChange={(e) => setSettings({...settings, radar_interval_minutes:Number(e.target.value)})} /></label>
            <label className="admin-check"><input type="checkbox" checked={settings.auto_approve_enabled} onChange={(e) => setSettings({...settings, auto_approve_enabled:e.target.checked})} /> Saugus automatinis patvirtinimas</label>
            <label>Minimalus prioritetas<input type="number" min="1" max="5" value={settings.minimum_priority} onChange={(e) => setSettings({...settings, minimum_priority:Number(e.target.value)})} /></label>
          </div>
        </form>
      ) : null}

      {tab === "account" ? (
        <form className="admin-panel admin-editor" onSubmit={changePassword}>
          <div className="admin-panel-head"><div><h2>Paskyros saugumas</h2><p>Keiskite administratoriaus slaptažodį kada panorėję.</p></div></div>
          <div className="admin-form-grid">
            <label>Naujas slaptažodis<input type="password" minLength={12} value={newPassword} onChange={(event) => setNewPassword(event.target.value)} required /></label>
            <label>Pakartokite slaptažodį<input type="password" minLength={12} value={confirmNewPassword} onChange={(event) => setConfirmNewPassword(event.target.value)} required /></label>
          </div>
          <div className="admin-save-actions"><button className="admin-primary" disabled={busy}>Išsaugoti naują slaptažodį</button></div>
        </form>
      ) : null}
    </main>
  );
}
