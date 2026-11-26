"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/lib/api";
import { EstrelasNota, EstrelasFixas } from "@/components/Estrelas";
import Resenha from "@/components/Resenha";

const STATUS = [
  { valor: "desejado", rotulo: "Desejado" },
  { valor: "jogando", rotulo: "Jogando" },
  { valor: "zerado", rotulo: "Zerado" },
];

export default function PaginaJogo() {
  const { id } = useParams();
  const { user, loading: carregandoUser } = useAuth();

  const [jogo, setJogo] = useState(null);
  const [resenhas, setResenhas] = useState([]);
  const [nota, setNota] = useState(0);
  const [comentario, setComentario] = useState("");
  const [ocupado, setOcupado] = useState(false);
  const [erro, setErro] = useState("");
  const [aviso, setAviso] = useState("");

  const carregar = useCallback(async () => {
    try {
      const [d, r] = await Promise.all([
        api(`/jogos/${id}`),
        api(`/avaliacoes/jogo/${id}?comentarios=1&limite=30`),
      ]);
      setJogo(d.jogo);
      setResenhas(r.avaliacoes);
      setNota(d.jogo.minhaAvaliacao?.nota ?? 0);
      setComentario(d.jogo.minhaAvaliacao?.comentario ?? "");
    } catch (err) {
      setErro(err.message);
    }
  }, [id]);

  useEffect(() => {
    if (!carregandoUser) carregar();
  }, [carregandoUser, user?.id, carregar]);

  async function executar(acao, mensagem) {
    setErro("");
    setAviso("");
    setOcupado(true);
    try {
      await acao();
      if (mensagem) setAviso(mensagem);
      await carregar();
    } catch (err) {
      setErro(err.detalhes?.[0]?.mensagem ?? err.message);
    } finally {
      setOcupado(false);
    }
  }

  const salvarAvaliacao = (n, texto) =>
    executar(
      () => api("/avaliacoes", { method: "POST", body: { jogoId: id, nota: n, comentario: texto } }),
      "Avaliação salva!"
    );

  function clicarEstrela(n) {
    setNota(n);
    salvarAvaliacao(n, comentario);
  }

  function enviarComentario(e) {
    e.preventDefault();
    if (!nota) {
      setErro("Escolha uma nota (estrelas) antes de comentar.");
      return;
    }
    salvarAvaliacao(nota, comentario);
  }

  const removerAvaliacao = () =>
    executar(() => api(`/avaliacoes/jogo/${id}`, { method: "DELETE" }), "Avaliação removida.");

  function mudarStatus(novo) {
    return executar(async () => {
      if (novo === jogo.meuStatus) {
        await api(`/biblioteca/${id}`, { method: "DELETE" });
        return;
      }
      if (!jogo.meuStatus) {
        await api("/biblioteca", { method: "POST", body: { jogoId: id } });
      }
      if (novo !== "desejado" || jogo.meuStatus) {
        await api(`/biblioteca/${id}`, { method: "PATCH", body: { status: novo } });
      }
    });
  }

  if (!jogo) return erro ? <div className="alerta">{erro}</div> : <p className="muted">Carregando...</p>;

  const maior = Math.max(1, ...Object.values(jogo.distribuicao));

  return (
    <div className="jogo-layout">
      <aside className="jogo-capa">
        <img src={jogo.image} alt={jogo.name} />
      </aside>

      <section className="jogo-info">
        <h1>
          {jogo.name} {jogo.anoLancamento && <span className="ano">{jogo.anoLancamento}</span>}
        </h1>

        <div className="generos">
          {jogo.generos.map((g) => (
            <Link key={g.id} href={`/jogos?genero=${encodeURIComponent(g.name)}`} className="tag">
              {g.name}
            </Link>
          ))}
        </div>

        <p className="descricao">
          {jogo.descricaoPt ?? jogo.descricao ?? "Sem descrição disponível."}
        </p>

        <div className="secao-cab"><h2>Avaliações</h2></div>
        {resenhas.length === 0 && <p className="muted">Ainda não há comentários para este jogo.</p>}
        <div className="resenhas">
          {resenhas.map((r) => <Resenha key={r.id} avaliacao={r} />)}
        </div>
      </section>

      <aside className="jogo-painel">
        {!carregandoUser && !user && (
          <div className="painel">
            <p>Entre para avaliar e adicionar este jogo à sua biblioteca.</p>
            <Link href="/login" className="btn btn-green btn-block">Entrar</Link>
          </div>
        )}

        {user && (
          <div className="painel">
            <div className="status-botoes">
              {STATUS.map((s) => (
                <button
                  key={s.valor}
                  disabled={ocupado}
                  className={jogo.meuStatus === s.valor ? "status-btn ativo" : "status-btn"}
                  onClick={() => mudarStatus(s.valor)}
                >
                  {s.rotulo}
                </button>
              ))}
            </div>

            <p className="painel-titulo">{nota ? "Sua nota" : "Dê sua nota"}</p>
            <EstrelasNota valor={nota} onChange={clicarEstrela} disabled={ocupado} />

            <form onSubmit={enviarComentario}>
              <textarea
                value={comentario}
                onChange={(e) => setComentario(e.target.value)}
                placeholder="Escreva um comentário (opcional)..."
                maxLength={2000}
                rows={4}
              />
              <button className="btn btn-green btn-block" disabled={ocupado}>Salvar comentário</button>
            </form>

            {jogo.minhaAvaliacao && (
              <button className="btn-link" onClick={removerAvaliacao}>Remover minha avaliação</button>
            )}
            {aviso && <p className="aviso">{aviso}</p>}
            {erro && <div className="alerta">{erro}</div>}
          </div>
        )}

        <div className="painel">
          <p className="painel-titulo">Avaliações</p>
          <div className="nota-media">
            <span className="nota-grande">
              {jogo.totalAvaliacoes > 0 ? Number(jogo.notaMedia).toFixed(1) : "—"}
            </span>
            <div>
              <EstrelasFixas valor={jogo.notaMedia} />
              <div className="muted">{jogo.totalAvaliacoes} avaliação(ões)</div>
            </div>
          </div>

          <div className="hist">
            {[5, 4, 3, 2, 1].map((n) => (
              <div key={n} className="hist-linha">
                <span>{n}★</span>
                <div className="hist-trilho">
                  <div className="hist-barra" style={{ width: `${(jogo.distribuicao[n] / maior) * 100}%` }} />
                </div>
                <span className="muted">{jogo.distribuicao[n]}</span>
              </div>
            ))}
          </div>
        </div>
      </aside>
    </div>
  );
}