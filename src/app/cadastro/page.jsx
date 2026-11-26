"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function Cadastro() {
  const { register } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState({ name: "", username: "", email: "", senha: "" });
  const [erros, setErros] = useState([]);
  const [enviando, setEnviando] = useState(false);

  const mudar = (campo) => (e) => setForm({ ...form, [campo]: e.target.value });

  async function enviar(e) {
    e.preventDefault();
    setErros([]);
    setEnviando(true);
    try {
      await register(form);
      router.push("/biblioteca");
    } catch (err) {
      setErros(err.detalhes?.map((d) => d.mensagem) ?? [err.message]);
    } finally {
      setEnviando(false);
    }
  }

  return (
    <form className="card form" onSubmit={enviar}>
      <h1>Criar conta</h1>

      <label>Nome</label>
      <input value={form.name} onChange={mudar("name")} required />

      <label>Username</label>
      <input value={form.username} onChange={mudar("username")} required />
      <span className="dica">Letras minúsculas, números e _ (3 a 30 caracteres).</span>

      <label>E-mail</label>
      <input type="email" value={form.email} onChange={mudar("email")} required />

      <label>Senha</label>
      <input type="password" value={form.senha} onChange={mudar("senha")} required />
      <span className="dica">Mínimo de 8 caracteres.</span>

      {erros.length > 0 && (
        <div className="alerta">
          {erros.length === 1 ? (
            erros[0]
          ) : (
            <ul>{erros.map((m, i) => <li key={i}>{m}</li>)}</ul>
          )}
        </div>
      )}

      <button className="btn btn-green btn-block" disabled={enviando}>
        {enviando ? "Criando..." : "Criar conta"}
      </button>

      <p className="rodape muted">
        Já tem conta? <Link href="/login">Entrar</Link>
      </p>
    </form>
  );
}