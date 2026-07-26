import Fastify from "fastify";
import { AppError } from "./utils/app-error";
import { authRoutes } from "./routes/auth-routes";
import { transactionRoutes } from "./routes/transaction-routes";

// DECLARAÇÃO ÚNICA DO APP (SÓ PODE EXISTIR UMA VEZ)
const app = Fastify();

// 1. Middleware de Tratamento Global de Erros
app.setErrorHandler((error, request, reply) => {
  if (error instanceof AppError) {
    return reply.status(error.statusCode).send({
      status: "error",
      message: error.message,
    });
  }

  console.error(error);

  return reply.status(500).send({
    status: "error",
    message: "Internal server error",
  });
});

// 2. Registro de Rotas
app.register(authRoutes);
app.register(transactionRoutes);

// Rota de teste simples (Health Check)
app.get("/health", async () => {
  return { status: "ok", message: "API Finance AI está online!" };
});

const start = async () => {
  try {
    await app.listen({ port: 3001, host: "0.0.0.0" });
    console.log(" Server running at http://localhost:3001");
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

start();
