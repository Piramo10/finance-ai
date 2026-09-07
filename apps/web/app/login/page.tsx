"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import axios from "axios";
import {
  ArrowRight,
  BarChart3,
  CheckCircle2,
  Eye,
  EyeOff,
  LoaderCircle,
  LockKeyhole,
  Mail,
  Sparkles,
  WalletCards,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { api } from "@/services/api";

type LoginResponse = {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
};

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");
    setIsLoading(true);

    try {
      const { data } = await api.post<LoginResponse>("/auth/login", {
        email,
        password,
      });

      localStorage.setItem("finance-token", data.token);
      localStorage.setItem("finance-user", JSON.stringify(data.user));

      router.push("/");
    } catch (caughtError) {
      setError(
        axios.isAxiosError(caughtError)
          ? (caughtError.response?.data?.message ??
              "Não foi possível entrar. Tente novamente.")
          : "Ocorreu um erro inesperado.",
      );
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white lg:grid lg:grid-cols-2">
      <section className="relative hidden overflow-hidden bg-gradient-to-br from-emerald-500 via-emerald-600 to-teal-950 p-12 lg:flex lg:flex-col lg:justify-between">
        <div className="absolute -left-24 -top-24 size-80 rounded-full bg-emerald-300/20 blur-3xl" />
        <div className="absolute -bottom-32 -right-24 size-96 rounded-full bg-cyan-300/20 blur-3xl" />

        <Link
          href="/"
          className="relative flex items-center gap-3 text-xl font-bold"
        >
          <span className="grid size-10 place-items-center rounded-xl bg-white text-emerald-600 shadow-lg">
            <WalletCards className="size-5" />
          </span>
          Finance AI
        </Link>

        <div className="relative mx-auto w-full max-w-md">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-sm text-emerald-50">
            <Sparkles className="size-4" />
            Inteligência para suas finanças
          </div>

          <h1 className="text-5xl font-bold leading-tight tracking-tight">
            Seu dinheiro merece mais clareza.
          </h1>

          <p className="mt-6 text-lg leading-8 text-emerald-50/80">
            Organize transações, acompanhe seus objetivos e tome decisões
            melhores com o Finance AI.
          </p>

          <div className="mt-10 space-y-4">
            <p className="flex items-center gap-3 text-emerald-50">
              <CheckCircle2 className="size-5 text-emerald-200" />
              Visão completa de receitas e despesas
            </p>

            <p className="flex items-center gap-3 text-emerald-50">
              <CheckCircle2 className="size-5 text-emerald-200" />
              Controle por categorias e metas
            </p>

            <p className="flex items-center gap-3 text-emerald-50">
              <CheckCircle2 className="size-5 text-emerald-200" />
              Recursos inteligentes em breve
            </p>
          </div>
        </div>

        <div className="relative flex items-center gap-3 text-sm text-emerald-100/70">
          <BarChart3 className="size-4" />
          Organização financeira começa com um passo.
        </div>
      </section>

      <section className="flex min-h-screen items-center justify-center bg-slate-50 px-5 py-10 text-slate-950">
        <div className="w-full max-w-md">
          <Link
            href="/"
            className="mb-12 flex items-center justify-center gap-2 text-lg font-bold lg:hidden"
          >
            <span className="grid size-9 place-items-center rounded-xl bg-emerald-600 text-white">
              <WalletCards className="size-5" />
            </span>
            Finance AI
          </Link>

          <div className="mb-8">
            <p className="text-sm font-semibold text-emerald-600">
              BEM-VINDO DE VOLTA
            </p>

            <h2 className="mt-2 text-3xl font-bold tracking-tight">
              Entre na sua conta
            </h2>

            <p className="mt-3 text-slate-500">
              Continue acompanhando sua vida financeira.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label
                htmlFor="email"
                className="text-sm font-semibold text-slate-700"
              >
                E-mail
              </label>

              <div className="relative">
                <Mail className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                <Input
                  id="email"
                  type="email"
                  autoComplete="email"
                  placeholder="voce@email.com"
                  className="h-12 border-slate-200 bg-white !pl-10 focus-visible:ring-emerald-600 autofill:bg-white autofill:text-slate-950"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="text-sm font-semibold text-slate-700"
                >
                  Senha
                </label>

                <button
                  type="button"
                  className="text-xs font-medium text-emerald-700 hover:text-emerald-800"
                >
                  Esqueci minha senha
                </button>
              </div>

              <div className="relative">
                <LockKeyhole className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />

                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="Sua senha"
                  className="h-12 border-slate-200 bg-white !pl-10 !pr-10 focus-visible:ring-emerald-600 autofill:bg-white autofill:text-slate-950"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  required
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
                  aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                >
                  {showPassword ? (
                    <EyeOff className="size-4" />
                  ) : (
                    <Eye className="size-4" />
                  )}
                </button>
              </div>
            </div>

            {error && (
              <p
                role="alert"
                className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm font-medium text-red-600"
              >
                {error}
              </p>
            )}

            <Button
              type="submit"
              disabled={isLoading}
              className="h-12 w-full bg-emerald-600 text-base hover:bg-emerald-700"
            >
              {isLoading ? (
                <>
                  <LoaderCircle className="size-4 animate-spin" />
                  Entrando...
                </>
              ) : (
                <>
                  Entrar na conta
                  <ArrowRight className="size-4" />
                </>
              )}
            </Button>
          </form>

          <div className="my-8 flex items-center gap-3">
            <div className="h-px flex-1 bg-slate-200" />
            <span className="text-xs text-slate-400">ou</span>
            <div className="h-px flex-1 bg-slate-200" />
          </div>

          <p className="text-center text-sm text-slate-600">
            Ainda não possui uma conta?{" "}
            <Link
              href="/cadastro"
              className="font-semibold text-emerald-700 hover:text-emerald-800"
            >
              Criar conta grátis
            </Link>
          </p>
        </div>
      </section>
    </main>
  );
}
