import type { Metadata } from "next";
import { AdminAuthFragmentBridge } from "@/components/admin-auth-fragment-bridge";
import "./globals.css";

export const metadata: Metadata = {
  title: "Sporto redakcija",
  description:
    "Lietuvos sporto naujienų portalas: svarbiausios temos, sporto radaras, analizės ir renginių signalai.",
  metadataBase: new URL("https://naujienos.sicenterhub.com"),
  openGraph: {
    title: "Sporto redakcija",
    description: "Švaresnis ir greitesnis Lietuvos sporto naujienų portalas su gyvu Sporto radaru.",
    url: "https://naujienos.sicenterhub.com",
    siteName: "Sporto redakcija",
    type: "website"
  },
  robots: {
    index: true,
    follow: true
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="lt">
      <body>
        <AdminAuthFragmentBridge />
        {children}
      </body>
    </html>
  );
}
