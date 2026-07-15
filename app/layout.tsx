import type { Metadata } from "next";
import { AdminAuthFragmentBridge } from "@/components/admin-auth-fragment-bridge";
import { GoogleAnalytics } from "@/components/google-analytics";
import { siteConfig } from "@/lib/site-config";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: siteConfig.title,
    template: `%s | ${siteConfig.name}`
  },
  description: siteConfig.description,
  metadataBase: new URL(siteConfig.url),
  applicationName: siteConfig.name,
  authors: [{ name: siteConfig.name, url: siteConfig.url }],
  creator: siteConfig.name,
  publisher: siteConfig.publisher,
  category: "sports",
  openGraph: {
    title: siteConfig.title,
    description: siteConfig.description,
    url: siteConfig.url,
    siteName: siteConfig.name,
    locale: "lt_LT",
    type: "website",
    images: [{ url: siteConfig.logoPath, alt: siteConfig.name }]
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.title,
    description: siteConfig.description,
    images: [siteConfig.logoPath]
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || undefined
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1
    }
  }
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const organizationJsonLd = {
    "@context": "https://schema.org",
    "@type": "NewsMediaOrganization",
    name: siteConfig.name,
    url: siteConfig.url,
    logo: `${siteConfig.url}${siteConfig.logoPath}`,
    parentOrganization: {
      "@type": "Organization",
      name: siteConfig.publisher,
      identifier: siteConfig.publisherCode
    },
    contactPoint: {
      "@type": "ContactPoint",
      email: siteConfig.contactEmail,
      telephone: siteConfig.phone,
      contactType: "redakcija"
    },
    publishingPrinciples: `${siteConfig.url}/redakcijos-principai`
  };

  return (
    <html lang="lt">
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationJsonLd).replace(/</g, "\\u003c")
          }}
        />
        <AdminAuthFragmentBridge />
        {children}
        <GoogleAnalytics />
      </body>
    </html>
  );
}
