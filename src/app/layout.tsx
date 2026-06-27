import type { Metadata } from "next";
import { Outfit, Playfair_Display } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: "Rencana Tuhan Studio (RTS) — Premium Creative Studio & Production House",
  description: "RTS adalah studio kreatif dan production house profesional yang menghadirkan video showreel, film pendek sinematik, animasi 2D/3D, dan branding visual premium. Hubungi kami untuk konsultasi project.",
  keywords: ["creative studio", "production house", "film production", "animasi 3D", "motion graphic", "Rencana Tuhan Studio", "RTS"],
  openGraph: {
    title: "Rencana Tuhan Studio — Premium Creative Studio & Production House",
    description: "Creating Stories Through Visual. RTS menghadirkan produksi film, animasi, dan motion graphic berkualitas internasional.",
    type: "website",
    locale: "id_ID",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      className={`${outfit.variable} ${playfair.variable} h-full antialiased`}
      style={{ colorScheme: "light" }}
      suppressHydrationWarning
    >
      <body
        className="min-h-full bg-[#F9FAFB] text-[#0F172A] font-sans selection:bg-[#0033A0] selection:text-white flex flex-col"
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}
