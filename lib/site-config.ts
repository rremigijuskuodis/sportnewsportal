const legacyHosts = new Set([
  "naujienos.sicenterhub.com",
  "news-portal-ten-psi.vercel.app"
]);

function normalizeSiteUrl(value?: string) {
  const fallback = "https://www.sportoradaras.lt";
  if (!value) return fallback;

  try {
    const parsed = new URL(value.trim());
    if (legacyHosts.has(parsed.hostname)) return fallback;
    return parsed.origin;
  } catch {
    return fallback;
  }
}

export const siteConfig = {
  name: "Sporto Radaras",
  title: "Sporto Radaras – Lietuvos sporto naujienos",
  description:
    "Aktualios Lietuvos ir pasaulio sporto naujienos, rezultatai, analizės ir gyvas trumpų žinių radaras.",
  url: normalizeSiteUrl(process.env.NEXT_PUBLIC_SITE_URL),
  logoPath: "/brand/sporto-radaras-logo.png",
  publisher: "VšĮ Sporto inovacijų centras",
  publisherCode: "307709669",
  contactEmail: "remigijus@sicenterhub.com",
  phone: "+37069093370"
} as const;

