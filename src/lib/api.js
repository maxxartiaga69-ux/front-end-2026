const BACKEND_DICA =
  "Confira se o back end está rodando (npm run dev na pasta meutcc, porta 3333) e se o BACKEND_URL do .env.local está certo.";

export async function api(path, { method = "GET", body } = {}) {
  let res;

  try {
    res = await fetch(`/api${path}`, {
      method,
      headers: body ? { "Content-Type": "application/json" } : undefined,
      body: body ? JSON.stringify(body) : undefined,
      credentials: "include",
    });
  } catch {
    throw new Error(
      "Sem conexão com o servidor do site. Verifique se o front (npm run dev) está rodando."
    );
  }

  const texto = await res.text();
  let data = {};
  try {
    data = texto ? JSON.parse(texto) : {};
  } catch {
    // resposta que não é JSON (ex.: o proxy não achou o back end)
  }

  if (!res.ok) {
    let mensagem = data.error;

    if (!mensagem) {
      if (res.status >= 500) {
        mensagem = `Não foi possível falar com o back end (erro ${res.status}). ${BACKEND_DICA}`;
      } else if (res.status === 404) {
        mensagem = `Rota não encontrada (erro 404): ${method} ${path}. ${BACKEND_DICA}`;
      } else {
        mensagem = `Erro ${res.status} ao chamar ${method} ${path}.`;
      }
    }

    const err = new Error(mensagem);
    err.status = res.status;
    err.detalhes = data.detalhes;
    throw err;
  }

  return data;
}