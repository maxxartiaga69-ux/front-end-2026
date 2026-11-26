import Link from "next/link";
import { EstrelasFixas } from "./Estrelas";

export default function CardJogo({ jogo }) {
  return (
    <Link href={`/jogo/${jogo.id}`} className="poster" title={jogo.name}>
      <img src={jogo.image} alt={jogo.name} loading="lazy" />
      <span className="poster-info">
        <strong>{jogo.name}</strong>
        {jogo.totalAvaliacoes > 0 && <EstrelasFixas valor={jogo.notaMedia} />}
      </span>
    </Link>
  );
}