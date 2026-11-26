import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import Header from "@/components/Header";

const inter = Inter({ subsets: ["latin"], variable: "--fonte" });

export const metadata = {
  title: "Diário Gamer",
  description: "Pesquise, organize e avalie seus jogos.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body className={inter.variable}>
        <AuthProvider>
          <Header />
          <main className="container">{children}</main>
          <footer className="footer">
            Diário Gamer · Projeto de TCC · Dados de jogos por{" "}
            <a href="https://rawg.io" target="_blank" rel="noreferrer">RAWG</a>
          </footer>
        </AuthProvider>
      </body>
    </html>
  );
}