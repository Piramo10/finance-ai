import { FastifyInstance } from "fastify";
import { TransactionController } from "../controllers/transaction-controller";
import { authenticate } from "../middlewares/auth-middleware";

export async function transactionRoutes(app: FastifyInstance) {
  const transactionController = new TransactionController();

  app.addHook("preHandler", authenticate);

  app.get("/dashboard", (req, res) =>
    transactionController.getDashboard(req, res),
  );

  app.get("/categories", (req, res) =>
    transactionController.listCategories(req, res),
  );

  app.get("/transactions", (req, res) => transactionController.list(req, res));

  app.post("/transactions", (req, res) =>
    transactionController.create(req, res),
  );

  app.delete("/transactions/:id", (req, res) =>
    transactionController.delete(req, res),
  );
}
