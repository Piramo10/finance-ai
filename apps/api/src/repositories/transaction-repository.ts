import { prisma } from "../lib/prisma";
import { Transaction } from "@prisma/client";

export class TransactionRepository {
  async findManyByUserId(userId: string): Promise<Transaction[]> {
    return prisma.transaction.findMany({
      where: { userId },
      orderBy: { date: "desc" },
      include: { category: true },
    });
  }

  async create(data: any): Promise<Transaction> {
    return prisma.transaction.create({ data });
  }

  async delete(id: string, userId: string) {
    return prisma.transaction.delete({
      where: { id, userId },
    });
  }

  async getTotalsByUserId(userId: string) {
    return prisma.transaction.groupBy({
      by: ["type"],
      where: { userId },
      _sum: { amount: true },
    });
  }

  async getTotalsByCategory(userId: string) {
    return prisma.transaction.groupBy({
      by: ["categoryId"],
      where: { userId, type: "EXPENSE" },
      _sum: { amount: true },
    });
  }
}
