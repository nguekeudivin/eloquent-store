import type { Metadata } from "next";
import "./globals.css";
import { Sidebar } from "@/components/Sidebar";

import { Source_Sans_3 } from "next/font/google";
import TopBar from "@/components/dashboard/TopBar";

const sourceSans = Source_Sans_3({
  weight: ["200", "400", "500", "600", "700", "800", "900"],
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Maximals",
  description: "Maximals",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={sourceSans.className}>
        <div className="bg-gray-100 min-h-screen">
          <div className="fixed left-0 top-0 w-[115px] lg:w-[280px] h-screen">
            <div className="bg-white rounded-md h-screen p-4">
              <Sidebar />
            </div>
          </div>
          <main className="pl-[115px] lg:pl-[280px] pb-24">
            <TopBar />
            <div className="p-8">{children}</div>
          </main>
        </div>
      </body>
    </html>
  );
}
