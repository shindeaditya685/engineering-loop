import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ChatBot from "@/components/ChatBot";

export const metadata: Metadata = {
  title: "Engineering Loop — India's #1 MTech Admission Counseling Platform",
  description:
    "Get expert guidance for GATE preparation, IIT/NIT MTech admissions, college selection, cutoff analysis, and scholarship support. Trusted by 500+ students.",
  keywords:
    "GATE, MTech, IIT, NIT, admission counseling, CCMT, cutoff, engineering",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-noise bg-grid min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 pt-16 lg:pt-20">{children}</main>
        <Footer />
        <ChatBot />
      </body>
    </html>
  );
}
