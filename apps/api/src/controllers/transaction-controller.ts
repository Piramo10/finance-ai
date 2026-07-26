import { FastifyRequest, FastifyReply } from "fastify";
import { TransactionService } from "../services/transaction-service";
import { z } from "zod";

const createTransactionSchema = z.object({
  description: z.string().min(2, "Descrição muito curta"),
  amount: z.number().gt(0, "O valor deve ser maior que zero"),
  type: z.enum(["INCOME", "EXPENSE"]),
  categoryId: z.string().min(1, "ID de categoria é obrigatório"),
  date: z.string().optional(),
});

export class TransactionController {
  private transactionService = new TransactionService();

  async list(request: FastifyRequest, reply: FastifyReply) {
    const { user } = request as any;
    const transactions = await this.transactionService.listMyTransactions(
      user.id,
    );
    return reply.status(200).send(transactions);
  }

  async create(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { user } = request as any;
      const data = createTransactionSchema.parse(request.body);
      const transaction = await this.transactionService.createTransaction(
        user.id,
        data,
      );
      return reply.status(201).send(transaction);
    } catch (error: any) {
      if (error instanceof z.ZodError)
        return reply.status(400).send({ errors: error.errors });
      throw error;
    }
  }

  async delete(request: FastifyRequest, reply: FastifyReply) {
    const { user } = request as any;
    const { id } = request.params as { id: string };
    const result = await this.transactionService.deleteTransaction(id, user.id);
    return reply.status(200).send(result);
  }

  async getDashboard(request: FastifyRequest, reply: FastifyReply) {
    const { user } = request as any;
    const dashboardData = await this.transactionService.getDashboardData(
      user.id,
    );
    return reply.status(200).send(dashboardData);
  }
}
