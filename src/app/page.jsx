"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/lib/api";
import CardJogo from "@/components/CardJogo";
import Resenha from "@/components/Resenha";

function Secao({ titulo, href, children }) {
  return (
    <section className="secao">
      <div className="secao-cab">
        <h2>{titulo}</h2>
        {href && <Link href={href}>Mais</Link>}
      </div>
      {children}
    </section>
  );
}

export default function Home() {
  const { user, loading } = useAuth();
  const [populares, setPopulares] = useState([]);
  const [recentes, setRecentes] = useState([]);
  const [resenhas, setResenhas] = useState([]);
  const [erro, setErro] = useState("");

  useEffect(() => {
    Promise.all([
      api("/jogos?ordem=populares&limite=6"),
      api("/jogos?ordem=recentes&limite=6"),
      api("/avaliacoes/recentes?limite=6"),
    ])
      .then(([a, b, c]) => {
        setPopulares(a.jogos);
        setRecentes(b.jogos);
        setResenhas(c.avaliacoes);
      })
      .catch((err) => setErro(err.message));
  }, []);

  const capa = populares[0]?.image;

  return (
    <>
      {!loading && !user ? (
        <section
          className="hero"
          style={capa ? { backgroundImage: `linear-gradient(180deg, rgba(0,0,0,.45), #000 96%), url("${capa}")` } : undefined}
        >
          <h1>Registre os jogos que você zerou.</h1>
          <p>Avalie, organize sua biblioteca e descubra o que outros jogadores estão jogando.</p>
          <div className="hero-acoes">
            <Link href="/cadastro" className="btn btn-green btn-lg">Comece agora, é grátis</Link>
            <Link href="/jogos" className="btn btn-ghost btn-lg">Explorar jogos</Link>
          </div>
        </section>
      ) : (
        !loading && (
          <p className="boas-vindas">
            Bem-vindo de volta, <Link href={`/u/${user.username}`}>{user.username}</Link>. Veja o que os jogadores estão avaliando...
          </p>
        )
      )}

      {erro && <div className="alerta">{erro}</div>}

      {populares.length > 0 && (
        <Secao titulo="Populares" href="/jogos?ordem=populares">
          <div className="grade">
            {populares.map((j) => <CardJogo key={j.id} jogo={j} />)}
          </div>
        </Secao>
      )}

      {recentes.length > 0 && (
        <Secao titulo="Lançamentos recentes" href="/jogos?ordem=recentes">
          <div className="grade">
            {recentes.map((j) => <CardJogo key={j.id} jogo={j} />)}
          </div>
        </Secao>
      )}

      {resenhas.length > 0 && (
        <Secao titulo="Avaliações recentes">
          <div className="resenhas">
            {resenhas.map((r) => (
              <Resenha key={r.id} avaliacao={r} mostrarJogo mostrarUsuario />
            ))}
          </div>
        </Secao>
      )}

      {!erro && populares.length === 0 && (
        <div className="vazio">
          <h2>Nenhum jogo cadastrado ainda</h2>
          <p className="muted">Rode <code>npm run seed</code> no back end para importar os jogos.</p>
        </div>
      )}
    </>
  );
}