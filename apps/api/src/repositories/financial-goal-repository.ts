import { prisma } from "../lib/prisma";

type CreateFinancialGoalData = {
  title: string;
  targetAmount: number;
  currentAmount?: number;
  deadline?: Date;
  icon?: string;
  userId: string;
};

export class FinancialGoalRepository {
  async findManyByUserId(userId: string) {
    return prisma.financialGoal.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });
  }

  async create(data: CreateFinancialGoalData) {
    return prisma.financialGoal.create({
      data,
    });
  }

  async updateAmount(id: string, userId: string, currentAmount: number) {
    return prisma.financialGoal.updateMany({
      where: {
        id,
        userId,
      },
      data: {
        currentAmount,
      },
    });
  }

  async delete(id: string, userId: string) {
    return prisma.financialGoal.deleteMany({
      where: {
        id,
        userId,
      },
    });
  }
}
