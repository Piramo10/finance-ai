"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowDownRight,
  ArrowUpRight,
  LogOut,
  Plus,
  WalletCards,
} from "lucide-react";

import { AuthGuard } from "@/components/auth/auth-guard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type User = {
  id: string;
  name: string;
  email: string;
};

function DashboardContent() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem("finance-user");

    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  function handleLogout() {
    localStorage.removeItem("finance-token");
    localStorage.removeItem("finance-user");
    router.replace("/login");
  }

  return (
    <main className="min-h-screen bg-slate-50 text-slate-950">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <div className="flex items-center gap-3 font-bold">
            <span className="grid size-9 place-items-center rounded-xl bg-emerald-600 text-white">
              <WalletCards className="size-5" />
            </span>
            Finance AI
          </div>

          <div className="flex items-center gap-4">
            <p className="hidden text-sm text-slate-600 sm:block">
              Olá,{" "}
              <span className="font-semibold">{user?.name ?? "usuário"}</span>
            </p>

            <Button variant="outline" size="sm" onClick={handleLogout}>
              <LogOut className="size-4" />
              Sair
            </Button>
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-6 py-10">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-emerald-600">
              VISÃO GERAL
            </p>
            <h1 className="mt-1 text-3xl font-bold tracking-tight">
              Seu resumo financeiro
            </h1>
            <p className="mt-2 text-slate-500">
              Os valores reais serão conectados à API no próximo passo.
            </p>
          </div>

          <Button>
            <Plus className="size-4" />
            Nova transação
          </Button>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-slate-500">
                Saldo atual
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">R$ 0,00</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex-row items-center justify-between space-y-0">
              <CardTitle className="text-sm font-medium text-slate-500">
                Receitas
              </CardTitle>
              <ArrowUpRight className="size-5 text-emerald-600" />
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-emerald-600">R$ 0,00</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex-row items-center justify-between space-y-0">
              <CardTitle className="text-sm font-medium text-slate-500">
                Despesas
              </CardTitle>
              <ArrowDownRight className="size-5 text-red-500" />
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-red-600">R$ 0,00</p>
            </CardContent>
          </Card>
        </div>
      </section>
    </main>
  );
}

export default function DashboardPage() {
  return (
    <AuthGuard>
      <DashboardContent />
    </AuthGuard>
  );
}
