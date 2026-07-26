import { FastifyInstance } from "fastify";
import { AuthController } from "../controllers/auth-controller";

export async function authRoutes(app: FastifyInstance) {
  const authController = new AuthController();

  // Rota de Cadastro: POST /auth/register
  app.post("/auth/register", (req, res) => authController.register(req, res));

  // Rota de Login: POST /auth/login
  app.post("/auth/login", (req, res) => authController.login(req, res));
}
