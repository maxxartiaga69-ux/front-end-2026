"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { api } from "@/lib/api";
import Avatar from "@/components/Avatar";
import CardJogo from "@/components/CardJogo";
import Resenha from "@/components/Resenha";

const FILTROS = [
  { valor: "", rotulo: "Todos" },
  { valor: "jogando", rotulo: "Jogando" },
  { valor: "zerado", rotulo: "Zerado" },
  { valor: "desejado", rotulo: "Desejado" },
];

export default function Perfil() {
  const { username } = useParams();
  const [usuario, setUsuario] = useState(null);
  const [stats, setStats] = useState(null);
  const [avaliacoes, setAvaliacoes] = useState([]);
  const [biblioteca, setBiblioteca] = useState([]);
  const [aba, setAba] = useState("avaliacoes");
  const [status, setStatus] = useState("");
  const [erro, setErro] = useState("");

  useEffect(() => {
    Promise.all([api(`/usuarios/${username}`), api(`/avaliacoes/usuario/${username}?limite=30`)])
      .then(([u, a]) => {
        setUsuario(u.usuario);
        setStats(u.estatisticas);
        setAvaliacoes(a.avaliacoes);
      })
      .catch((err) => setErro(err.message));
  }, [username]);

  useEffect(() => {
    const query = status ? `?status=${status}` : "";
    api(`/usuarios/${username}/biblioteca${query}`)
      .then((d) => setBiblioteca(d.jogos))
      .catch(() => setBiblioteca([]));
  }, [username, status]);

  if (erro) return <div className="alerta">{erro}</div>;
  if (!usuario) return <p className="muted">Carregando...</p>;

  const numeros = [
    { rotulo: "Avaliados", valor: stats.avaliacoes },
    { rotulo: "Zerados", valor: stats.biblioteca.zerado },
    { rotulo: "Jogando", valor: stats.biblioteca.jogando },
    { rotulo: "Desejados", valor: stats.biblioteca.desejado },
    { rotulo: "Nota média", valor: stats.avaliacoes ? stats.notaMedia.toFixed(1) : "—" },
  ];

  return (
    <section>
      <div className="perfil">
        <Avatar usuario={usuario} tamanho={96} />
        <div>
          <h1>{usuario.name}</h1>
          <p className="muted">
            @{usuario.username} · membro desde {new Date(usuario.createdAt).toLocaleDateString("pt-BR")}
          </p>
        </div>
      </div>

      <div className="stats">
        {numeros.map((n) => (
          <div key={n.rotulo} className="stat">
            <strong>{n.valor}</strong>
            <span>{n.rotulo}</span>
          </div>
        ))}
      </div>

      <div className="abas">
        <button className={aba === "avaliacoes" ? "aba ativa" : "aba"} onClick={() => setAba("avaliacoes")}>
          Avaliações
        </button>
        <button className={aba === "biblioteca" ? "aba ativa" : "aba"} onClick={() => setAba("biblioteca")}>
          Biblioteca
        </button>
      </div>

      {aba === "avaliacoes" && (
        <div className="resenhas">
          {avaliacoes.length === 0 && <p className="muted">Nenhuma avaliação ainda.</p>}
          {avaliacoes.map((a) => <Resenha key={a.id} avaliacao={a} mostrarJogo />)}
        </div>
      )}

      {aba === "biblioteca" && (
        <>
          <div className="chips">
            {FILTROS.map((f) => (
              <button
                key={f.valor}
                className={status === f.valor ? "chip ativo" : "chip"}
                onClick={() => setStatus(f.valor)}
              >
                {f.rotulo}
              </button>
            ))}
          </div>
          {biblioteca.length === 0 && <p className="muted">Nenhum jogo aqui.</p>}
          <div className="grade">
            {biblioteca.map((item) => <CardJogo key={item.id} jogo={item.jogo} />)}
          </div>
        </>
      )}
    </section>
  );
}