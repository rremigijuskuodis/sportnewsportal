"use client";

import Script from "next/script";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

type ConsentChoice = "accepted" | "declined" | null;

declare global {
  interface Window {
    dataLayer: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

const measurementId = process.env.NEXT_PUBLIC_GA_ID?.trim();
const consentKey = "sporto-radaras-analytics-consent";

export function GoogleAnalytics() {
  const pathname = usePathname();
  const [consent, setConsent] = useState<ConsentChoice>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!measurementId) return;
    const saved = window.localStorage.getItem(consentKey);
    setConsent(saved === "accepted" || saved === "declined" ? saved : null);
    setReady(true);
  }, []);

  useEffect(() => {
    if (consent !== "accepted" || !window.gtag || !measurementId) return;
    window.gtag("config", measurementId, { page_path: pathname });
  }, [consent, pathname]);

  if (!measurementId || !ready) return null;

  const choose = (choice: Exclude<ConsentChoice, null>) => {
    window.localStorage.setItem(consentKey, choice);
    setConsent(choice);
  };

  return (
    <>
      {consent === "accepted" ? (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`}
            strategy="afterInteractive"
          />
          <Script id="google-analytics" strategy="afterInteractive">
            {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
window.gtag = gtag;
gtag('js', new Date());
gtag('consent', 'default', {
  analytics_storage: 'granted',
  ad_storage: 'denied',
  ad_user_data: 'denied',
  ad_personalization: 'denied'
});
gtag('config', '${measurementId}', { anonymize_ip: true });`}
          </Script>
        </>
      ) : null}

      {consent === null ? (
        <aside className="cookie-banner" aria-label="Privatumo pasirinkimas">
          <div>
            <strong>Privatumo pasirinkimas</strong>
            <p>
              Su jūsų sutikimu naudosime „Google Analytics“, kad suprastume, kurios sporto
              temos skaitomos. Reklaminiai slapukai nenaudojami.
            </p>
          </div>
          <div className="cookie-actions">
            <button type="button" className="ghost-link" onClick={() => choose("declined")}>
              Tik būtini
            </button>
            <button type="button" className="primary-link" onClick={() => choose("accepted")}>
              Sutinku
            </button>
          </div>
        </aside>
      ) : null}
    </>
  );
}

