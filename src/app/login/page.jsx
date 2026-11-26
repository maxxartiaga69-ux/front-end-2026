"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function Login() {
  const { login } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [enviando, setEnviando] = useState(false);

  async function enviar(e) {
    e.preventDefault();
    setErro("");
    setEnviando(true);
    try {
      await login(email, senha);
      router.push("/biblioteca");
    } catch (err) {
      setErro(err.message);
    } finally {
      setEnviando(false);
    }
  }

  return (
    <form className="card form" onSubmit={enviar}>
      <h1>Entrar</h1>

      <label>E-mail</label>
      <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />

      <label>Senha</label>
      <input type="password" value={senha} onChange={(e) => setSenha(e.target.value)} required />

      {erro && <div className="alerta">{erro}</div>}

      <button className="btn btn-green btn-block" disabled={enviando}>
        {enviando ? "Entrando..." : "Entrar"}
      </button>

      <p className="rodape muted">
        Não tem conta? <Link href="/cadastro">Criar conta</Link>
      </p>
    </form>
  );
}