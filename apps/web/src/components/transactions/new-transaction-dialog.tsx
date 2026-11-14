"use client";

import { useEffect, useState } from "react";
import { api } from "@/services/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type Category = {
  id: string;
  name: string;
  icon?: string | null;
  color?: string | null;
  type: "INCOME" | "EXPENSE";
};

type NewTransactionDialogProps = {
  open: boolean;
  initialType?: "INCOME" | "EXPENSE";
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
};

export function NewTransactionDialog({
  open,
  initialType = "EXPENSE",
  onOpenChange,
  onSuccess,
}: NewTransactionDialogProps) {
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState<"INCOME" | "EXPENSE">("EXPENSE");
  const [categoryId, setCategoryId] = useState("");
  const [date, setDate] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (open) {
      setType(initialType);
    }
  }, [open, initialType]);

  useEffect(() => {
    if (!open) {
      return;
    }

    async function loadCategories() {
      try {
        setIsLoadingCategories(true);
        setError("");
        setCategoryId("");

        const { data } = await api.get<Category[]>(`/categories?type=${type}`);

        setCategories(data);

        if (data.length > 0) {
          setCategoryId(data[0].id);
        }
      } catch (error) {
        console.error("Erro ao carregar categorias:", error);
        setCategories([]);
        setCategoryId("");
        setError("Não foi possível carregar as categorias.");
      } finally {
        setIsLoadingCategories(false);
      }
    }

    loadCategories();
  }, [open, type]);

  function resetForm() {
    setDescription("");
    setAmount("");
    setType("EXPENSE");
    setCategoryId("");
    setDate("");
    setCategories([]);
    setError("");
  }

  function handleClose() {
    resetForm();
    onOpenChange(false);
  }

  function handleTypeChange(event: React.ChangeEvent<HTMLSelectElement>) {
    setType(event.target.value as "INCOME" | "EXPENSE");
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      setIsSubmitting(true);
      setError("");

      await api.post("/transactions", {
        description,
        amount: Number(amount),
        type,
        categoryId,
        ...(date ? { date } : {}),
      });

      resetForm();
      onOpenChange(false);
      onSuccess?.();
    } catch (error) {
      console.error("Erro ao criar transação:", error);
      setError("Não foi possível criar a transação.");
    } finally {
      setIsSubmitting(false);
    }
  }

  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="flex items-center justify-between gap-4">
            <CardTitle>Nova transação</CardTitle>

            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleClose}
            >
              Fechar
            </Button>
          </div>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label
                htmlFor="description"
                className="text-sm font-medium text-slate-700"
              >
                Descrição
              </label>

              <input
                id="description"
                type="text"
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                placeholder="Ex: Supermercado"
                required
                minLength={2}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-emerald-500"
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="amount"
                className="text-sm font-medium text-slate-700"
              >
                Valor
              </label>

              <input
                id="amount"
                type="number"
                step="0.01"
                min="0.01"
                value={amount}
                onChange={(event) => setAmount(event.target.value)}
                placeholder="0,00"
                required
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-emerald-500"
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="type"
                className="text-sm font-medium text-slate-700"
              >
                Tipo
              </label>

              <select
                id="type"
                value={type}
                onChange={handleTypeChange}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-emerald-500"
              >
                <option value="EXPENSE">Despesa</option>
                <option value="INCOME">Receita</option>
              </select>
            </div>

            <div className="space-y-2">
              <label
                htmlFor="category"
                className="text-sm font-medium text-slate-700"
              >
                Categoria
              </label>

              <select
                id="category"
                value={categoryId}
                onChange={(event) => setCategoryId(event.target.value)}
                required
                disabled={isLoadingCategories || categories.length === 0}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-emerald-500 disabled:opacity-50"
              >
                <option value="">
                  {isLoadingCategories
                    ? "Carregando categorias..."
                    : categories.length === 0
                      ? "Nenhuma categoria disponível"
                      : "Selecione uma categoria"}
                </option>

                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label
                htmlFor="date"
                className="text-sm font-medium text-slate-700"
              >
                Data
              </label>

              <input
                id="date"
                type="date"
                value={date}
                onChange={(event) => setDate(event.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-emerald-500"
              />
            </div>

            {error && <p className="text-sm text-red-600">{error}</p>}

            <div className="flex justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={isSubmitting}
              >
                Cancelar
              </Button>

              <Button
                type="submit"
                disabled={
                  isSubmitting || isLoadingCategories || categories.length === 0
                }
              >
                {isSubmitting ? "Salvando..." : "Salvar transação"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
