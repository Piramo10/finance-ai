import { FinancialGoalRepository } from "../repositories/financial-goal-repository";
import { AppError } from "../utils/app-error";

type CreateFinancialGoalData = {
  title: string;
  targetAmount: number;
  currentAmount?: number;
  deadline?: Date;
  icon?: string;
};

export class FinancialGoalService {
  private financialGoalRepository = new FinancialGoalRepository();

  async listMyGoals(userId: string) {
    const goals = await this.financialGoalRepository.findManyByUserId(userId);

    return goals.map((goal) => {
      const targetAmount = Number(goal.targetAmount);
      const currentAmount = Number(goal.currentAmount);

      return {
        ...goal,
        targetAmount,
        currentAmount,
        progressPercentage: Math.min(
          100,
          Math.round((currentAmount / targetAmount) * 100),
        ),
      };
    });
  }

  async createGoal(userId: string, data: CreateFinancialGoalData) {
    if (data.targetAmount <= 0) {
      throw new AppError(
        "O valor objetivo da meta deve ser maior que zero.",
        400,
      );
    }

    if (
      data.currentAmount !== undefined &&
      data.currentAmount > data.targetAmount
    ) {
      throw new AppError(
        "O valor atual não pode ser maior que o valor objetivo.",
        400,
      );
    }

    return this.financialGoalRepository.create({
      ...data,
      userId,
    });
  }

  async updateGoalAmount(
    goalId: string,
    userId: string,
    currentAmount: number,
  ) {
    if (currentAmount < 0) {
      throw new AppError("O valor atual não pode ser negativo.", 400);
    }

    const result = await this.financialGoalRepository.updateAmount(
      goalId,
      userId,
      currentAmount,
    );

    if (result.count === 0) {
      throw new AppError("Meta não encontrada.", 404);
    }

    return { message: "Valor da meta atualizado com sucesso." };
  }

  async deleteGoal(goalId: string, userId: string) {
    const result = await this.financialGoalRepository.delete(goalId, userId);

    if (result.count === 0) {
      throw new AppError("Meta não encontrada.", 404);
    }

    return { message: "Meta removida com sucesso." };
  }
}
