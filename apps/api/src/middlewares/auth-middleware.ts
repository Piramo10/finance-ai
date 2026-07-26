import { FastifyRequest, FastifyReply } from "fastify";
import jwt from "jsonwebtoken";
import { AppError } from "../utils/app-error";

const SECRET = process.env.JWT_SECRET || "super-secret-key-finance-ai";

export async function authenticate(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const authHeader = request.headers.authorization;

  if (!authHeader) {
    throw new AppError("Token não fornecido", 401);
  }

  // O formato esperado é "Bearer TOKEN_AQUI"
  const parts = authHeader.split(" ");

  if (parts.length !== 2) {
    throw new AppError("Token mal formatado", 401);
  }

  const [scheme, token] = parts;

  if (scheme !== "Bearer") {
    throw new AppError("Token inválido", 401);
  }

  try {
    const decoded = jwt.verify(token, SECRET) as { userId: string };

    // Injetamos o userId na requisição para que os controllers possam usar
    // @ts-ignore (estamos estendendo o tipo do Fastify dinamicamente
    request.user = { id: decoded.userId };
  } catch (err) {
    throw new AppError("Token expirado ou inválido", 401);
  }
}
