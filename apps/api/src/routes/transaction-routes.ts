import { FastifyInstance } from "fastify";
import { TransactionController } from "../controllers/transaction-controller";
import { authenticate } from "../middlewares/auth-middleware";

export async function transactionRoutes(app: FastifyInstance) {
  const transactionController = new TransactionController();

  // Protege todas as rotas abaixo
  app.addHook("preHandler", authenticate);

  // ESSA LINHA PRECISA ESTAR AQUI:
  app.get("/dashboard", (req, res) =>
    transactionController.getDashboard(req, res),
  );

  app.get("/transactions", (req, res) => transactionController.list(req, res));
  app.post("/transactions", (req, res) =>
    transactionController.create(req, res),
  );
  app.delete("/transactions/:id", (req, res) =>
    transactionController.delete(req, res),
  );
}
