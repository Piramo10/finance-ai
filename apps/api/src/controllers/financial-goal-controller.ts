import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";

import { FinancialGoalService } from "../services/financial-goal-service";
import { AppError } from "../utils/app-error";

const createFinancialGoalSchema = z.object({
  title: z.string().min(2, "O título deve ter pelo menos 2 caracteres."),
  targetAmount: z
    .number()
    .positive("O valor objetivo deve ser maior que zero."),
  currentAmount: z.number().min(0).optional(),
  deadline: z.string().optional(),
  icon: z.string().optional(),
});

const updateFinancialGoalAmountSchema = z.object({
  currentAmount: z.number().min(0, "O valor atual não pode ser negativo."),
});

export class FinancialGoalController {
  private financialGoalService = new FinancialGoalService();

  async list(request: FastifyRequest, reply: FastifyReply) {
    const { user } = request as any;

    const goals = await this.financialGoalService.listMyGoals(user.id);

    return reply.status(200).send(goals);
  }

  async create(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { user } = request as any;

      const data = createFinancialGoalSchema.parse(request.body);

      const deadline = data.deadline ? new Date(data.deadline) : undefined;

      if (deadline && Number.isNaN(deadline.getTime())) {
        throw new AppError("Data limite inválida.", 400);
      }

      const goal = await this.financialGoalService.createGoal(user.id, {
        ...data,
        deadline,
      });

      return reply.status(201).send(goal);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return reply.status(400).send({
          errors: error.errors,
        });
      }

      throw error;
    }
  }

  async updateAmount(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { user } = request as any;
      const { id } = request.params as { id: string };

      const { currentAmount } = updateFinancialGoalAmountSchema.parse(
        request.body,
      );

      const result = await this.financialGoalService.updateGoalAmount(
        id,
        user.id,
        currentAmount,
      );

      return reply.status(200).send(result);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return reply.status(400).send({
          errors: error.errors,
        });
      }

      throw error;
    }
  }

  async delete(request: FastifyRequest, reply: FastifyReply) {
    const { user } = request as any;
    const { id } = request.params as { id: string };

    const result = await this.financialGoalService.deleteGoal(id, user.id);

    return reply.status(200).send(result);
  }
}
