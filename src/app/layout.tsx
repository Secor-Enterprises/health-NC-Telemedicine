import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Secor HealthConnect",
  description: "Northern Cape telemedicine demonstration portal",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
