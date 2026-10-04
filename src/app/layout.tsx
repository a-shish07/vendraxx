import type { Metadata } from "next";
import "./globals.css";
import AppProvider from "../App";
import SiteShell from "../components/SiteShell";

export const metadata: Metadata = {
  title: "Vendrax",
  description: "Vendrax online store",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <AppProvider>
          <SiteShell>{children}</SiteShell>
        </AppProvider>
      </body>
    </html>
  );
}
