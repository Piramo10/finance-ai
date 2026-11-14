import { FastifyInstance } from "fastify";

import { FinancialGoalController } from "../controllers/financial-goal-controller";
import { authenticate } from "../middlewares/auth-middleware";

export async function financialGoalRoutes(app: FastifyInstance) {
  const financialGoalController = new FinancialGoalController();

  app.addHook("preHandler", authenticate);

  app.get("/goals", (request, reply) =>
    financialGoalController.list(request, reply),
  );

  app.post("/goals", (request, reply) =>
    financialGoalController.create(request, reply),
  );

  app.patch("/goals/:id", (request, reply) =>
    financialGoalController.updateAmount(request, reply),
  );

  app.delete("/goals/:id", (request, reply) =>
    financialGoalController.delete(request, reply),
  );
}
