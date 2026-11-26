export default function Avatar({ usuario, tamanho = 32 }) {
  return (
    <span className="avatar" style={{ "--av": `${tamanho}px` }}>
      {usuario?.avatar ? (
        <img src={usuario.avatar} alt={usuario.name} />
      ) : (
        <span>{usuario?.name?.[0]?.toUpperCase() ?? "?"}</span>
      )}
    </span>
  );
}