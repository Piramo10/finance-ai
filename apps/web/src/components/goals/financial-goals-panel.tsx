"use client";

import { FormEvent, useEffect, useState } from "react";
import { Plus, Target, X } from "lucide-react";

import { api } from "@/services/api";

type FinancialGoal = {
  id: string;
  title: string;
  targetAmount: number;
  currentAmount: number;
  progressPercentage: number;
  deadline?: string | null;
};

function formatCurrency(value: number) {
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

export function FinancialGoalsPanel() {
  const [goals, setGoals] = useState<FinancialGoal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [refreshGoals, setRefreshGoals] = useState(0);

  const [title, setTitle] = useState("");
  const [targetAmount, setTargetAmount] = useState("");
  const [currentAmount, setCurrentAmount] = useState("0");
  const [deadline, setDeadline] = useState("");

  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [goalBeingUpdated, setGoalBeingUpdated] = useState<string | null>(null);
  const [amountToAdd, setAmountToAdd] = useState("");
  const [isUpdatingAmount, setIsUpdatingAmount] = useState(false);

  useEffect(() => {
    async function loadGoals() {
      try {
        setIsLoading(true);

        const { data } = await api.get<FinancialGoal[]>("/goals");

        setGoals(data);
      } catch (error) {
        console.error("Erro ao carregar metas:", error);
      } finally {
        setIsLoading(false);
      }
    }

    loadGoals();
  }, [refreshGoals]);

  function resetForm() {
    setTitle("");
    setTargetAmount("");
    setCurrentAmount("0");
    setDeadline("");
    setError("");
  }

  function closeDialog() {
    resetForm();
    setIsDialogOpen(false);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const target = Number(targetAmount);
    const current = Number(currentAmount);

    if (title.trim().length < 2) {
      setError("Digite um nome para a meta.");
      return;
    }

    if (target <= 0) {
      setError("O valor objetivo deve ser maior que zero.");
      return;
    }

    if (current < 0 || current > target) {
      setError(
        "O valor atual deve ser maior ou igual a zero e menor que o objetivo.",
      );
      return;
    }

    try {
      setIsSubmitting(true);
      setError("");

      await api.post("/goals", {
        title: title.trim(),
        targetAmount: target,
        currentAmount: current,
        ...(deadline ? { deadline } : {}),
      });

      closeDialog();
      setRefreshGoals((currentValue) => currentValue + 1);
    } catch (error) {
      console.error("Erro ao criar meta:", error);
      setError("Não foi possível criar a meta. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleAddAmount(
    event: FormEvent<HTMLFormElement>,
    goal: FinancialGoal,
  ) {
    event.preventDefault();

    const amount = Number(amountToAdd);

    if (amount <= 0) {
      setError("Informe um valor maior que zero.");
      return;
    }

    const updatedAmount = Math.min(
      goal.currentAmount + amount,
      goal.targetAmount,
    );

    try {
      setIsUpdatingAmount(true);
      setError("");

      await api.patch(`/goals/${goal.id}`, {
        currentAmount: updatedAmount,
      });

      setGoalBeingUpdated(null);
      setAmountToAdd("");
      setRefreshGoals((currentValue) => currentValue + 1);
    } catch (error) {
      console.error("Erro ao atualizar meta:", error);
      setError("Não foi possível atualizar o valor da meta.");
    } finally {
      setIsUpdatingAmount(false);
    }
  }

  return (
    <>
      <article className="rounded-xl border border-[#223b5e] bg-[#09182b] p-5">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="grid size-10 place-items-center rounded-xl bg-cyan-400/15 text-cyan-300">
              <Target className="size-5" />
            </span>

            <h3 className="font-semibold text-white">Metas financeiras</h3>
          </div>

          <button
            type="button"
            onClick={() => setIsDialogOpen(true)}
            className="inline-flex items-center gap-1 text-xs text-sky-400 transition hover:text-sky-300"
          >
            <Plus className="size-3" />
            Nova meta
          </button>
        </div>

        <div className="mt-5 space-y-5">
          {isLoading ? (
            <p className="text-sm text-slate-400">Carregando metas...</p>
          ) : goals.length === 0 ? (
            <div className="rounded-lg border border-dashed border-[#294564] p-4">
              <p className="text-sm text-slate-400">
                Você ainda não criou nenhuma meta financeira.
              </p>

              <button
                type="button"
                onClick={() => setIsDialogOpen(true)}
                className="mt-3 text-sm font-medium text-cyan-300 hover:text-cyan-200"
              >
                Criar primeira meta
              </button>
            </div>
          ) : (
            goals.map((goal) => (
              <div key={goal.id}>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-medium text-slate-200">
                      {goal.title}
                    </p>

                    <p className="mt-1 text-xs text-slate-400">
                      {formatCurrency(goal.currentAmount)} de{" "}
                      {formatCurrency(goal.targetAmount)}
                    </p>
                  </div>

                  <span className="text-sm text-slate-300">
                    {goal.progressPercentage}%
                  </span>
                </div>

                <div className="mt-2 h-2 overflow-hidden rounded-full bg-[#183456]">
                  <div
                    className="h-full rounded-full bg-cyan-400 transition-all"
                    style={{ width: `${goal.progressPercentage}%` }}
                  />
                </div>

                {goalBeingUpdated === goal.id ? (
                  <form
                    onSubmit={(event) => handleAddAmount(event, goal)}
                    className="mt-3 rounded-lg border border-[#294564] bg-[#061426] p-3"
                  >
                    <label
                      htmlFor="goal-amount"
                      className="text-xs text-slate-300"
                    >
                      Quanto você deseja adicionar?
                    </label>

                    <div className="mt-2 flex gap-2">
                      <input
                        id="goal-amount"
                        type="number"
                        min="0.01"
                        step="0.01"
                        autoFocus
                        value={amountToAdd}
                        onChange={(event) => setAmountToAdd(event.target.value)}
                        placeholder="0,00"
                        className="min-w-0 flex-1 rounded-md border border-[#294564] bg-[#09182b] px-3 py-2 text-sm text-white outline-none focus:border-cyan-400"
                      />

                      <button
                        type="submit"
                        disabled={isUpdatingAmount}
                        className="rounded-md bg-cyan-400 px-3 py-2 text-xs font-semibold text-slate-950 disabled:opacity-60"
                      >
                        {isUpdatingAmount ? "Salvando..." : "Salvar"}
                      </button>
                    </div>

                    {error && (
                      <p className="mt-2 text-xs text-rose-300">{error}</p>
                    )}

                    <button
                      type="button"
                      onClick={() => {
                        setGoalBeingUpdated(null);
                        setAmountToAdd("");
                        setError("");
                      }}
                      className="mt-2 text-xs text-slate-400 hover:text-white"
                    >
                      Cancelar
                    </button>
                  </form>
                ) : (
                  <button
                    type="button"
                    disabled={goal.progressPercentage >= 100}
                    onClick={() => {
                      setGoalBeingUpdated(goal.id);
                      setAmountToAdd("");
                      setError("");
                    }}
                    className="mt-3 text-xs font-medium text-cyan-300 transition hover:text-cyan-200 disabled:cursor-not-allowed disabled:text-slate-500"
                  >
                    {goal.progressPercentage >= 100
                      ? "Meta concluída"
                      : "Adicionar valor"}
                  </button>
                )}
              </div>
            ))
          )}
        </div>
      </article>

      {isDialogOpen && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/70 p-4">
          <div className="w-full max-w-md rounded-2xl border border-[#294564] bg-[#09182b] p-6 shadow-2xl">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-semibold text-white">
                  Nova meta financeira
                </h2>

                <p className="mt-1 text-sm text-slate-400">
                  Defina um objetivo e acompanhe sua evolução.
                </p>
              </div>

              <button
                type="button"
                onClick={closeDialog}
                className="text-slate-400 transition hover:text-white"
                aria-label="Fechar"
              >
                <X className="size-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div>
                <label
                  htmlFor="goal-title"
                  className="text-sm font-medium text-slate-200"
                >
                  Nome da meta
                </label>

                <input
                  id="goal-title"
                  value={title}
                  onChange={(event) => setTitle(event.target.value)}
                  placeholder="Ex: Reserva de emergência"
                  className="mt-2 w-full rounded-lg border border-[#294564] bg-[#061426] px-3 py-2.5 text-sm text-white outline-none placeholder:text-slate-500 focus:border-cyan-400"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="goal-target"
                    className="text-sm font-medium text-slate-200"
                  >
                    Valor objetivo
                  </label>

                  <input
                    id="goal-target"
                    type="number"
                    min="0.01"
                    step="0.01"
                    value={targetAmount}
                    onChange={(event) => setTargetAmount(event.target.value)}
                    placeholder="10000"
                    className="mt-2 w-full rounded-lg border border-[#294564] bg-[#061426] px-3 py-2.5 text-sm text-white outline-none placeholder:text-slate-500 focus:border-cyan-400"
                  />
                </div>

                <div>
                  <label
                    htmlFor="goal-current"
                    className="text-sm font-medium text-slate-200"
                  >
                    Valor já guardado
                  </label>

                  <input
                    id="goal-current"
                    type="number"
                    min="0"
                    step="0.01"
                    value={currentAmount}
                    onChange={(event) => setCurrentAmount(event.target.value)}
                    className="mt-2 w-full rounded-lg border border-[#294564] bg-[#061426] px-3 py-2.5 text-sm text-white outline-none placeholder:text-slate-500 focus:border-cyan-400"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="goal-deadline"
                  className="text-sm font-medium text-slate-200"
                >
                  Data limite <span className="text-slate-500">(opcional)</span>
                </label>

                <input
                  id="goal-deadline"
                  type="date"
                  value={deadline}
                  onChange={(event) => setDeadline(event.target.value)}
                  className="mt-2 w-full rounded-lg border border-[#294564] bg-[#061426] px-3 py-2.5 text-sm text-white outline-none focus:border-cyan-400"
                />
              </div>

              {error && <p className="text-sm text-rose-300">{error}</p>}

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={closeDialog}
                  disabled={isSubmitting}
                  className="rounded-lg px-4 py-2 text-sm text-slate-300 transition hover:bg-slate-800"
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="rounded-lg bg-cyan-400 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isSubmitting ? "Salvando..." : "Criar meta"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
