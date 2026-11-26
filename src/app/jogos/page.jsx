"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { api } from "@/lib/api";
import CardJogo from "@/components/CardJogo";

const ORDENS = [
  { valor: "populares", rotulo: "Populares" },
  { valor: "nota", rotulo: "Melhor avaliados" },
  { valor: "recentes", rotulo: "Mais recentes" },
  { valor: "nome", rotulo: "Nome (A-Z)" },
];

function Conteudo() {
  const router = useRouter();
  const params = useSearchParams();

  const q = params.get("q") ?? "";
  const genero = params.get("genero") ?? "";
  const ordem = params.get("ordem") ?? "populares";
  const pagina = Number(params.get("pagina") ?? 1);

  const [dados, setDados] = useState(null);
  const [generos, setGeneros] = useState([]);
  const [erro, setErro] = useState("");

  useEffect(() => {
    api("/jogos/generos").then((d) => setGeneros(d.generos)).catch(() => {});
  }, []);

  useEffect(() => {
    const query = new URLSearchParams({ ordem, pagina, limite: 24 });
    if (genero) query.set("genero", genero);
    if (q) query.set("q", q);

    api(`${q ? "/jogos/buscar" : "/jogos"}?${query}`)
      .then((d) => {
        setErro("");
        setDados(d);
      })
      .catch((err) => setErro(err.message));
  }, [q, genero, ordem, pagina]);

  function ir(novos) {
    const proximo = new URLSearchParams(params.toString());
    for (const [k, v] of Object.entries(novos)) {
      if (v) proximo.set(k, v);
      else proximo.delete(k);
    }
    router.push(`/jogos?${proximo}`);
  }

  return (
    <section>
      <h1>{q ? `Resultados para "${q}"` : "Jogos"}</h1>

      <div className="filtros">
        <select value={genero} onChange={(e) => ir({ genero: e.target.value, pagina: "" })}>
          <option value="">Todos os gêneros</option>
          {generos.map((g) => <option key={g.id} value={g.name}>{g.name}</option>)}
        </select>

        <select value={ordem} onChange={(e) => ir({ ordem: e.target.value, pagina: "" })}>
          {ORDENS.map((o) => <option key={o.valor} value={o.valor}>{o.rotulo}</option>)}
        </select>

        {dados && <span className="muted">{dados.total} jogo(s)</span>}
      </div>

      {erro && <div className="alerta">{erro}</div>}

      {dados && dados.jogos.length === 0 && (
        <div className="vazio"><h2>Nenhum jogo encontrado</h2></div>
      )}

      <div className="grade">
        {dados?.jogos.map((j) => <CardJogo key={j.id} jogo={j} />)}
      </div>

      {dados && dados.totalPaginas > 1 && (
        <div className="paginacao">
          <button className="btn btn-ghost" disabled={pagina <= 1} onClick={() => ir({ pagina: String(pagina - 1) })}>
            ← Anterior
          </button>
          <span className="muted">Página {pagina} de {dados.totalPaginas}</span>
          <button className="btn btn-ghost" disabled={pagina >= dados.totalPaginas} onClick={() => ir({ pagina: String(pagina + 1) })}>
            Próxima →
          </button>
        </div>
      )}
    </section>
  );
}

export default function JogosPage() {
  return (
    <Suspense fallback={<p className="muted">Carregando...</p>}>
      <Conteudo />
    </Suspense>
  );
}