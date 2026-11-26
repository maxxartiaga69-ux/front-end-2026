import Link from "next/link";
import Avatar from "./Avatar";
import { EstrelasFixas } from "./Estrelas";

export default function Resenha({ avaliacao, mostrarJogo = false, mostrarUsuario = false }) {
  const { jogo, usuario } = avaliacao;

  return (
    <article className="resenha">
      {mostrarJogo && jogo && (
        <Link href={`/jogo/${jogo.id}`} className="resenha-poster">
          <img src={jogo.image} alt={jogo.name} loading="lazy" />
        </Link>
      )}
      {!mostrarJogo && usuario && <Avatar usuario={usuario} tamanho={40} />}

      <div className="resenha-corpo">
        <div className="resenha-topo">
          {mostrarJogo && jogo && (
            <Link href={`/jogo/${jogo.id}`} className="resenha-titulo">{jogo.name}</Link>
          )}
          {mostrarUsuario && usuario && (
            <span className="muted">
              por <Link href={`/u/${usuario.username}`} className="link">@{usuario.username}</Link>
            </span>
          )}
          {!mostrarJogo && usuario && (
            <Link href={`/u/${usuario.username}`} className="resenha-titulo">@{usuario.username}</Link>
          )}
          <EstrelasFixas valor={avaliacao.nota} />
          <span className="muted data">
            {new Date(avaliacao.createdAt).toLocaleDateString("pt-BR")}
          </span>
        </div>
        {avaliacao.comentario && <p className="resenha-texto">{avaliacao.comentario}</p>}
      </div>
    </article>
  );
}