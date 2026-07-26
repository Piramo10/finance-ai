import { TransactionRepository } from "../repositories/transaction-repository";
import { AppError } from "../utils/app-error";

export class TransactionService {
  private transactionRepository = new TransactionRepository();

  async listMyTransactions(userId: string) {
    return await this.transactionRepository.findManyByUserId(userId);
  }

  async createTransaction(userId: string, data: any) {
    const formattedDate = data.date ? new Date(data.date) : new Date();
    if (isNaN(formattedDate.getTime())) {
      throw new AppError("Formato de data inválido", 400);
    }

    return await this.transactionRepository.create({
      ...data,
      userId,
      date: formattedDate,
    });
  }

  async deleteTransaction(transactionId: string, userId: string) {
    const deleted = await this.transactionRepository.delete(
      transactionId,
      userId,
    );
    if (!deleted) throw new AppError("Transação não encontrada", 404);
    return { message: "Transação deletada com sucesso" };
  }

  // ESTA É A FUNÇÃO QUE ESTAVA FALTANDO:
  async getDashboardData(userId: string) {
    const totals = await this.transactionRepository.getTotalsByUserId(userId);
    const categoryTotals =
      await this.transactionRepository.getTotalsByCategory(userId);

    const income = totals.find((t) => t.type === "INCOME")?._sum.amount || 0;
    const expense = totals.find((t) => t.type === "EXPENSE")?._sum.amount || 0;
    const balance = Number(income) - Number(expense);

    return {
      balance,
      income: Number(income),
      expense: Number(expense),
      categories: categoryTotals.map((cat) => ({
        categoryId: cat.categoryId,
        total: Number(cat._sum.amount),
      })),
    };
  }
}
