"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import Avatar from "./Avatar";

export default function Header() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const [menu, setMenu] = useState(false);
  const [busca, setBusca] = useState("");

  function buscar(e) {
    e.preventDefault();
    const q = busca.trim();
    if (!q) return;
    router.push(`/jogos?q=${encodeURIComponent(q)}`);
  }

  async function sair() {
    setMenu(false);
    await logout();
    router.push("/");
  }

  return (
    <header className="header">
      <div className="container header-inner">
        <Link href="/" className="logo">
          <span className="logo-marca">DG</span>
          <span className="logo-texto">Diário Gamer</span>
        </Link>

        <nav className="nav">
          {!loading && !user && (
            <>
              <Link href="/login">Entrar</Link>
              <Link href="/cadastro">Criar conta</Link>
            </>
          )}

          {!loading && user && (
            <div className="menu">
              <button className="menu-btn" onClick={() => setMenu(!menu)}>
                <Avatar usuario={user} tamanho={26} />
                <span>{user.username}</span>
                <span className="seta">▾</span>
              </button>
              {menu && (
                <div className="menu-lista">
                  <Link href={`/u/${user.username}`} onClick={() => setMenu(false)}>Perfil</Link>
                  <Link href="/biblioteca" onClick={() => setMenu(false)}>Minha biblioteca</Link>
                  <button onClick={sair}>Sair</button>
                </div>
              )}
            </div>
          )}

          <Link href="/jogos">Jogos</Link>
          {!loading && user && <Link href="/biblioteca" className="so-desktop">Biblioteca</Link>}

          <form className="busca" onSubmit={buscar}>
            <input
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              placeholder="Buscar jogos"
              aria-label="Buscar jogos"
            />
          </form>

          {!loading && user && (
            <Link href="/jogos" className="btn btn-green btn-sm">+ Avaliar</Link>
          )}
        </nav>
      </div>
    </header>
  );
}