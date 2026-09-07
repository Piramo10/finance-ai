import Fastify from "fastify";
import cors from "@fastify/cors";
import { AppError } from "./utils/app-error";
import { authRoutes } from "./routes/auth-routes";
import { transactionRoutes } from "./routes/transaction-routes";

const app = Fastify();

app.register(cors, {
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
});

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

app.register(authRoutes);
app.register(transactionRoutes);

app.get("/health", async () => {
  return { status: "ok", message: "API Finance AI está online!" };
});

const start = async () => {
  try {
    await app.listen({ port: 3001, host: "0.0.0.0" });
    console.log("Server running at http://localhost:3001");
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

start();
