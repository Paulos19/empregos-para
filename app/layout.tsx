import type { Metadata } from "next";
import { Inter, Montserrat, Roboto } from "next/font/google";
import "./globals.css";
import { TopNavBar } from "./components/TopNavBar";

const montserrat = Montserrat({ subsets: ["latin"],
  weight: ['400', '700'],
 });

export const metadata: Metadata = {
  title: "Empregos Pará",
  description: "Crie seu currículo aqui!",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-br">
      <body className={montserrat.className}>
        <TopNavBar />
        {children}
      </body>
    </html>
  );
}
