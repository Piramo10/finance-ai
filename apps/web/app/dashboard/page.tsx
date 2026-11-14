"use client";
import { FinancialGoalsPanel } from "@/components/goals/financial-goals-panel";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowDownRight,
  ArrowLeftRight,
  ArrowRight,
  ArrowUpRight,
  BarChart3,
  Bell,
  Bot,
  ChevronDown,
  CreditCard,
  Home,
  Layers3,
  Lightbulb,
  LogOut,
  Plus,
  Settings,
  Tags,
  TrendingUp,
  WalletCards,
} from "lucide-react";
import { AuthGuard } from "@/components/auth/auth-guard";
import { NewTransactionDialog } from "@/components/transactions/new-transaction-dialog";
import { api } from "@/services/api";

type User = { id: string; name: string; email: string };
type DashboardData = {
  balance: number;
  income: number;
  expense: number;
  categories: unknown[];
};
type Transaction = {
  id: string;
  description: string;
  amount: number | string;
  date: string;
  type: "INCOME" | "EXPENSE";
  categoryId: string;
  category?: { id: string; name: string; color?: string | null };
};
type CategoryTotal = {
  name: string;
  amount: number;
  color: string;
  percent: number;
};

const COLORS = [
  "#297cf6",
  "#10c98c",
  "#f9a51a",
  "#9061e8",
  "#34c9dc",
  "#7486a1",
];

function money(value: number | string) {
  return Number(value).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

function shortDate(value: string) {
  return new Date(value).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function NavItem({
  label,
  icon: Icon,
  active,
}: {
  label: string;
  icon: typeof Home;
  active?: boolean;
}) {
  return (
    <button
      type="button"
      className={`flex h-12 w-full items-center gap-4 rounded-xl px-4 text-sm font-medium transition ${active ? "bg-emerald-400/15 text-emerald-300 ring-1 ring-emerald-300/20" : "text-slate-300 hover:bg-slate-800/60 hover:text-white"}`}
    >
      <Icon className="size-5" />
      {label}
    </button>
  );
}

function SideBar() {
  return (
    <aside className="sticky top-0 hidden h-screen w-[268px] border-r border-[#1a2d47] bg-[#061426] p-5 lg:relative lg:block">
      <div className="flex h-12 items-center gap-3 px-3">
        <TrendingUp className="size-8 text-emerald-400" />
        <h1 className="text-2xl font-bold tracking-tight text-white">
          Finance <span className="text-emerald-400">AI</span>
        </h1>
      </div>
      <nav className="mt-9 space-y-2">
        <NavItem label="Dashboard" icon={Home} active />
        <NavItem label="Transações" icon={ArrowLeftRight} />
        <NavItem label="Contas" icon={CreditCard} />
        <NavItem label="Categorias" icon={Tags} />
        <NavItem label="Relatórios" icon={BarChart3} />
        <NavItem label="Configurações" icon={Settings} />
      </nav>
      <div className="absolute bottom-14 left-5 right-5 rounded-2xl border border-[#1d3858] bg-[#091a31] p-5">
        <span className="grid size-11 place-items-center rounded-xl bg-cyan-400/15 text-cyan-300">
          <Bot className="size-5" />
        </span>
        <p className="mt-4 font-semibold text-white">Finance AI</p>
        <p className="mt-1 text-sm leading-5 text-[#94afd2]">
          Seus dados, suas decisões.
          <br />
          Com a ajuda da inteligência.
        </p>
      </div>
    </aside>
  );
}

function StatCard({
  title,
  value,
  foot,
  tone,
  icon: Icon,
}: {
  title: string;
  value: string;
  foot: string;
  tone: "green" | "pink" | "purple";
  icon: typeof WalletCards;
}) {
  const styles = {
    green: "bg-emerald-400/20 text-emerald-300",
    pink: "bg-rose-400/20 text-rose-300",
    purple: "bg-violet-400/20 text-violet-300",
  };
  return (
    <section className="min-h-[134px] rounded-xl border border-[#223b5e] bg-[#0b192c] p-5">
      <div className="flex items-start gap-4">
        <span
          className={`grid size-11 shrink-0 place-items-center rounded-xl ${styles[tone]}`}
        >
          <Icon className="size-5" />
        </span>
        <div>
          <p className="text-sm font-medium text-slate-300">{title}</p>
          <strong className="mt-2 block text-2xl text-white">{value}</strong>
          <p
            className={`mt-2 text-xs ${tone === "pink" ? "text-rose-400" : tone === "purple" ? "text-slate-400" : "text-emerald-400"}`}
          >
            {foot}
          </p>
        </div>
      </div>
    </section>
  );
}

function DashboardContent() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [summary, setSummary] = useState<DashboardData | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [transactionType, setTransactionType] = useState<"INCOME" | "EXPENSE">(
    "EXPENSE",
  );
  const [refresh, setRefresh] = useState(0);

  useEffect(() => {
    const saved = localStorage.getItem("finance-user");
    if (saved) setUser(JSON.parse(saved));
  }, []);
  useEffect(() => {
    Promise.all([
      api.get<DashboardData>("/dashboard"),
      api.get<Transaction[]>("/transactions"),
    ])
      .then(([dashboard, transactionList]) => {
        setSummary(dashboard.data);
        setTransactions(transactionList.data);
      })
      .catch((error) => console.error("Erro ao carregar dashboard:", error));
  }, [refresh]);

  const categories = useMemo<CategoryTotal[]>(() => {
    const map = new Map<
      string,
      { name: string; amount: number; color?: string | null }
    >();
    transactions
      .filter((item) => item.type === "EXPENSE")
      .forEach((item) => {
        const old = map.get(item.categoryId) ?? {
          name: item.category?.name ?? "Sem categoria",
          amount: 0,
          color: item.category?.color,
        };
        old.amount += Number(item.amount);
        map.set(item.categoryId, old);
      });
    const total = [...map.values()].reduce((sum, item) => sum + item.amount, 0);
    return [...map.values()]
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 6)
      .map((item, index) => ({
        ...item,
        color: item.color ?? COLORS[index],
        percent: total ? Math.round((item.amount / total) * 100) : 0,
      }));
  }, [transactions]);

  const donut = useMemo(() => {
    if (!categories.length) return "conic-gradient(#263d5d 0 100%)";
    let point = 0;
    return `conic-gradient(${categories
      .map((item) => {
        const from = point;
        point += item.percent;
        return `${item.color} ${from}% ${point}%`;
      })
      .join(", ")})`;
  }, [categories]);

  function logout() {
    localStorage.removeItem("finance-token");
    localStorage.removeItem("finance-user");
    router.replace("/login");
  }

  function openTransactionDialog(type: "INCOME" | "EXPENSE" = "EXPENSE") {
    setTransactionType(type);
    setDialogOpen(true);
  }

  return (
    <div className="min-h-screen bg-[#020b18] font-sans text-slate-100">
      <div className="lg:grid lg:grid-cols-[268px_minmax(0,1fr)]">
        <SideBar />
        <main className="min-w-0">
          <header className="relative flex h-[73px] items-center border-b border-[#1a2d47] px-6 lg:px-10">
            <p className="text-xl font-bold lg:hidden">
              Finance <span className="text-emerald-400">AI</span>
            </p>
            <div className="absolute right-6 flex items-center gap-5 lg:right-10">
              <button
                type="button"
                aria-label="Notificações"
                className="relative text-slate-200"
              >
                <Bell className="size-5" />
                <i className="absolute -right-0.5 top-0 size-2 rounded-full bg-emerald-400" />
              </button>
              <div className="hidden items-center gap-3 sm:flex">
                <span className="grid size-9 place-items-center rounded-full bg-[#263a59] text-xs font-semibold">
                  {" "}
                  {user?.name?.slice(0, 2).toUpperCase() ?? "US"}{" "}
                </span>
                <span className="text-sm text-slate-200">
                  {user?.name ?? "Usuário"}
                </span>
                <ChevronDown className="size-4 text-slate-400" />
              </div>
              <button
                type="button"
                onClick={logout}
                aria-label="Sair"
                className="text-slate-400 hover:text-rose-300"
              >
                <LogOut className="size-5" />
              </button>
            </div>
          </header>

          <div className="mx-auto max-w-[1280px] px-5 py-6 lg:px-9">
            <section>
              <h2 className="text-3xl font-bold tracking-tight text-white">
                Olá, {user?.name?.split(" ")[0] ?? "usuário"} 👋
              </h2>
              <p className="mt-1 text-slate-300">
                Aqui está um resumo da sua vida financeira.
              </p>
            </section>
            <section className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              <StatCard
                title="Saldo total"
                value={money(summary?.balance ?? 0)}
                foot="↑ 12% em relação ao mês passado"
                tone="green"
                icon={WalletCards}
              />
              <StatCard
                title="Receitas"
                value={money(summary?.income ?? 0)}
                foot="↑ 18% em relação ao mês passado"
                tone="green"
                icon={TrendingUp}
              />
              <StatCard
                title="Despesas"
                value={money(summary?.expense ?? 0)}
                foot="↓ 6% em relação ao mês passado"
                tone="pink"
                icon={ArrowDownRight}
              />
              <StatCard
                title="Total de categorias"
                value={String(summary?.categories.length ?? 0)}
                foot="Categorias ativas"
                tone="purple"
                icon={Layers3}
              />
            </section>

            <section className="mt-5 grid gap-5 xl:grid-cols-[1.45fr_0.94fr_0.94fr]">
              <article className="min-h-0 rounded-xl border border-[#223b5e] bg-[#09182b] p-4 sm:p-5">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h3 className="text-lg font-semibold text-white">
                      Fluxo de caixa
                    </h3>
                    <p className="text-sm text-slate-300">
                      Receitas e despesas dos últimos 6 meses
                    </p>
                  </div>
                  <div className="flex gap-5 text-xs">
                    <span className="flex items-center gap-2">
                      <i className="size-2.5 rounded-full bg-emerald-400" />
                      Receitas
                    </span>
                    <span className="flex items-center gap-2">
                      <i className="size-2.5 rounded-full bg-rose-400" />
                      Despesas
                    </span>
                  </div>
                </div>
                <svg
                  viewBox="0 0 540 265"
                  className="mt-4 h-[210px] w-full sm:h-[230px] xl:h-[245px]"
                  role="img"
                  aria-label="Fluxo de caixa ilustrativo"
                >
                  {[30, 80, 130, 180, 230].map((y) => (
                    <line
                      key={y}
                      x1="70"
                      x2="520"
                      y1={y}
                      y2={y}
                      stroke="#193150"
                    />
                  ))}
                  {[
                    "R$ 10.000",
                    "R$ 7.500",
                    "R$ 5.000",
                    "R$ 2.500",
                    "R$ 0",
                  ].map((label, index) => (
                    <text
                      key={label}
                      x="0"
                      y={35 + index * 50}
                      fill="#b4c7e2"
                      fontSize="12"
                    >
                      {label}
                    </text>
                  ))}
                  <path
                    d="M70 165 C115 145 130 128 160 130 S220 116 250 125 S320 138 350 100 S415 80 430 95 S475 120 520 88 L520 230 L70 230Z"
                    fill="url(#income)"
                    opacity=".35"
                  />
                  <path
                    d="M70 190 C110 178 125 165 160 170 S210 155 250 172 S315 184 350 150 S405 142 430 155 S480 170 520 152 L520 230 L70 230Z"
                    fill="url(#expense)"
                    opacity=".35"
                  />
                  <path
                    d="M70 165 C115 145 130 128 160 130 S220 116 250 125 S320 138 350 100 S415 80 430 95 S475 120 520 88"
                    fill="none"
                    stroke="#21d69b"
                    strokeWidth="2"
                  />
                  <path
                    d="M70 190 C110 178 125 165 160 170 S210 155 250 172 S315 184 350 150 S405 142 430 155 S480 170 520 152"
                    fill="none"
                    stroke="#fb5c86"
                    strokeWidth="2"
                  />
                  {[
                    ["70", "165"],
                    ["160", "130"],
                    ["250", "125"],
                    ["350", "100"],
                    ["430", "95"],
                    ["520", "88"],
                  ].map(([cx, cy]) => (
                    <circle key={cx} cx={cx} cy={cy} r="4" fill="#21d69b" />
                  ))}
                  {[
                    ["70", "190"],
                    ["160", "170"],
                    ["250", "172"],
                    ["350", "150"],
                    ["430", "155"],
                    ["520", "152"],
                  ].map(([cx, cy]) => (
                    <circle key={cx} cx={cx} cy={cy} r="4" fill="#fb5c86" />
                  ))}
                  {["Abr", "Mai", "Jun", "Jul", "Ago", "Set"].map(
                    (label, index) => (
                      <text
                        key={label}
                        x={70 + index * 90}
                        y="255"
                        textAnchor="middle"
                        fill="#b4c7e2"
                        fontSize="12"
                      >
                        {label}
                      </text>
                    ),
                  )}
                  <defs>
                    <linearGradient id="income" x1="0" x2="0" y1="0" y2="1">
                      <stop stopColor="#21d69b" />
                      <stop offset="1" stopColor="#21d69b" stopOpacity="0" />
                    </linearGradient>
                    <linearGradient id="expense" x1="0" x2="0" y1="0" y2="1">
                      <stop stopColor="#fb5c86" />
                      <stop offset="1" stopColor="#fb5c86" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                </svg>
              </article>

              <article className="min-h-[372px] rounded-xl border border-[#223b5e] bg-[#09182b] p-5">
                <h3 className="text-lg font-semibold text-white">
                  Despesas por categoria
                </h3>
                <div
                  className="relative mx-auto mt-4 grid size-40 place-items-center rounded-full"
                  style={{ background: donut }}
                >
                  <div className="grid size-28 place-items-center rounded-full bg-[#09182b] text-center">
                    <strong className="text-base">
                      {money(summary?.expense ?? 0)}
                    </strong>
                    <span className="text-[11px] text-slate-300">
                      Total de despesas
                    </span>
                  </div>
                </div>
                <div className="mt-4 space-y-2">
                  {categories.length ? (
                    categories.map((item) => (
                      <div
                        key={item.name}
                        className="grid grid-cols-[1fr_36px_76px] items-center gap-2 text-xs"
                      >
                        <span className="flex items-center gap-2 truncate">
                          <i
                            className="size-2.5 shrink-0 rounded-full"
                            style={{ backgroundColor: item.color }}
                          />
                          {item.name}
                        </span>
                        <span className="text-right">{item.percent}%</span>
                        <span className="text-right text-slate-300">
                          {money(item.amount)}
                        </span>
                      </div>
                    ))
                  ) : (
                    <p className="pt-8 text-center text-sm text-slate-400">
                      Sem despesas registradas.
                    </p>
                  )}
                </div>
              </article>

              <article className="min-h-[372px] rounded-xl border border-[#223b5e] bg-[#09182b] p-5">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-white">
                    Transações recentes
                  </h3>
                  <button className="flex items-center gap-1 text-xs text-sky-400">
                    Ver todas <ArrowRight className="size-3" />
                  </button>
                </div>
                <div className="mt-4 space-y-2">
                  {transactions.slice(0, 5).map((item) => {
                    const income = item.type === "INCOME";
                    return (
                      <div
                        key={item.id}
                        className="flex items-center gap-3 py-1"
                      >
                        <span
                          className={`grid size-9 place-items-center rounded-lg ${income ? "bg-emerald-400/15 text-emerald-300" : "bg-rose-400/15 text-rose-300"}`}
                        >
                          {income ? (
                            <ArrowUpRight className="size-4" />
                          ) : (
                            <ArrowDownRight className="size-4" />
                          )}
                        </span>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium">
                            {item.description}
                          </p>
                          <p className="text-xs text-slate-400">
                            {item.category?.name ?? "Sem categoria"}
                          </p>
                        </div>
                        <div
                          className={`text-right text-xs font-semibold ${income ? "text-emerald-400" : "text-rose-300"}`}
                        >
                          {income ? "+" : "-"} {money(item.amount)}
                          <p className="mt-1 font-normal text-slate-400">
                            {shortDate(item.date)}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                  {!transactions.length && (
                    <p className="pt-20 text-center text-sm text-slate-400">
                      Nenhuma transação encontrada.
                    </p>
                  )}
                </div>
              </article>
            </section>

            <section className="mt-5 grid gap-5 xl:grid-cols-[1.05fr_1.05fr_0.82fr]">
              <article className="rounded-xl border border-[#223b5e] bg-[#09182b] p-5">
                <button
                  type="button"
                  onClick={() => openTransactionDialog()}
                  className="flex w-full items-center gap-3 text-left"
                >
                  <span className="grid size-11 place-items-center rounded-full bg-emerald-400/20 text-emerald-300">
                    <Plus className="size-5" />
                  </span>
                  <div>
                    <h3 className="font-semibold">Adicionar transação</h3>
                    <p className="text-sm text-slate-300">
                      Registre uma nova movimentação financeira
                    </p>
                  </div>
                </button>
                <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
                  <button
                    type="button"
                    onClick={() => openTransactionDialog("INCOME")}
                    className="rounded-xl bg-emerald-500/10 p-4 text-xs text-emerald-300 transition hover:bg-emerald-500/20"
                  >
                    <ArrowDownRight className="mx-auto mb-2 size-5" />
                    Receita
                  </button>
                  <button
                    type="button"
                    onClick={() => openTransactionDialog("EXPENSE")}
                    className="rounded-xl bg-rose-500/10 p-4 text-xs text-rose-300 transition hover:bg-rose-500/20"
                  >
                    <ArrowUpRight className="mx-auto mb-2 size-5" />
                    Despesa
                  </button>
                  <button
                    type="button"
                    disabled
                    className="cursor-not-allowed rounded-xl bg-sky-500/10 p-4 text-xs text-sky-300/50"
                  >
                    <ArrowLeftRight className="mx-auto mb-2 size-5" />
                    Em breve
                  </button>
                  <button
                    type="button"
                    disabled
                    className="cursor-not-allowed rounded-xl bg-violet-500/10 p-4 text-xs text-violet-300/50"
                  >
                    <CreditCard className="mx-auto mb-2 size-5" />
                    Em breve
                  </button>
                </div>
              </article>
              <FinancialGoalsPanel />
              <article className="rounded-xl border border-violet-500/70 bg-gradient-to-br from-[#171f69] to-[#28104c] p-5">
                <div className="flex items-center gap-3">
                  <span className="grid size-10 place-items-center rounded-xl bg-violet-300/15">
                    <Lightbulb className="size-5 text-violet-200" />
                  </span>
                  <h3 className="font-semibold">Insights do Finance AI</h3>
                </div>
                <p className="mt-5 text-sm leading-6 text-slate-100">
                  Você está construindo uma boa visão das suas finanças.
                  Continue assim!
                </p>
                <button className="mt-5 rounded-lg border border-cyan-300/30 bg-cyan-400/15 px-5 py-2 text-sm text-cyan-100">
                  Ver mais insights{" "}
                  <ArrowRight className="ml-2 inline size-4" />
                </button>
              </article>
            </section>
            <footer className="mt-6 flex flex-wrap items-center gap-x-10 gap-y-3 border-t border-[#1a2d47] py-5 text-xs text-slate-400">
              <span className="font-semibold text-slate-200">Turborepo</span>
              <span>Next.js</span>
              <span>React</span>
              <span>TypeScript</span>
              <span>Fastify</span>
              <span>Prisma</span>
              <span>PostgreSQL</span>
              <span className="ml-auto text-emerald-300">
                ↗ Tecnologia a favor das suas finanças.
              </span>
            </footer>
          </div>
        </main>
      </div>
      <NewTransactionDialog
        open={dialogOpen}
        initialType={transactionType}
        onOpenChange={setDialogOpen}
        onSuccess={() => setRefresh((current) => current + 1)}
      />
    </div>
  );
}

function Goal({
  title,
  value,
  percent,
  width,
}: {
  title: string;
  value: string;
  percent: string;
  width: string;
}) {
  return (
    <div>
      <div className="flex justify-between text-sm">
        <div>
          <p className="text-slate-200">{title}</p>
          <p className="mt-1 text-xs text-slate-300">{value}</p>
        </div>
        <span className="text-slate-300">{percent}</span>
      </div>
      <div className="mt-2 h-2 overflow-hidden rounded-full bg-[#183456]">
        <div className={`h-full rounded-full bg-cyan-400 ${width}`} />
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <AuthGuard>
      <DashboardContent />
    </AuthGuard>
  );
}
