"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/lib/api";

const ABAS = [
  { valor: "", rotulo: "Todos" },
  { valor: "jogando", rotulo: "Jogando" },
  { valor: "zerado", rotulo: "Zerado" },
  { valor: "desejado", rotulo: "Desejado" },
];

export default function Biblioteca() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [status, setStatus] = useState("");
  const [jogos, setJogos] = useState([]);
  const [erro, setErro] = useState("");

  const carregar = useCallback(async () => {
    try {
      const query = status ? `?status=${status}` : "";
      const data = await api(`/biblioteca${query}`);
      setErro("");
      setJogos(data.jogos);
    } catch (err) {
      setErro(err.message);
    }
  }, [status]);

  useEffect(() => {
    if (!loading && !user) router.push("/login");
  }, [loading, user, router]);

  useEffect(() => {
    if (user) carregar();
  }, [user, carregar]);

  async function mudarStatus(jogoId, novo) {
    await api(`/biblioteca/${jogoId}`, { method: "PATCH", body: { status: novo } });
    carregar();
  }

  async function remover(jogoId) {
    await api(`/biblioteca/${jogoId}`, { method: "DELETE" });
    carregar();
  }

  if (loading || !user) return <p className="muted">Carregando...</p>;

  return (
    <section>
      <h1>Minha biblioteca</h1>

      <div className="abas">
        {ABAS.map((aba) => (
          <button
            key={aba.valor}
            className={status === aba.valor ? "aba ativa" : "aba"}
            onClick={() => setStatus(aba.valor)}
          >
            {aba.rotulo}
          </button>
        ))}
      </div>

      {erro && <div className="alerta">{erro}</div>}

      {jogos.length === 0 && !erro && (
        <div className="vazio">
          <h2>Nenhum jogo aqui ainda</h2>
          <p className="muted">
            Abra a página de um jogo em <Link href="/jogos" className="link">Jogos</Link> e escolha Desejado, Jogando ou Zerado.
          </p>
        </div>
      )}

      <div className="grade">
        {jogos.map((item) => (
          <article key={item.id} className="item-biblioteca">
            <Link href={`/jogo/${item.jogoId}`} className="poster" title={item.jogo.name}>
              <img src={item.jogo.image} alt={item.jogo.name} loading="lazy" />
              <span className="poster-info"><strong>{item.jogo.name}</strong></span>
            </Link>
            <select value={item.status} onChange={(e) => mudarStatus(item.jogoId, e.target.value)}>
              <option value="desejado">Desejado</option>
              <option value="jogando">Jogando</option>
              <option value="zerado">Zerado</option>
            </select>
            <button className="btn-link" onClick={() => remover(item.jogoId)}>Remover</button>
          </article>
        ))}
      </div>
    </section>
  );
}