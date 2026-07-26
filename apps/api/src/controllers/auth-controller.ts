import { FastifyRequest, FastifyReply } from "fastify";
import { AuthService } from "../services/auth-service";
import { z } from "zod";
import { AppError } from "../utils/app-error";

const registerSchema = z.object({
  name: z.string().min(3, "O nome deve ter pelo menos 3 caracteres"),
  email: z.string().email("E-mail inválido"),
  password: z.string().min(6, "A senha deve ter pelo menos 6 caracteres"),
});

const loginSchema = z.object({
  email: z.string().email("E-mail inválido"),
  password: z.string().min(1, "A senha é obrigatória"),
});

export class AuthController {
  private authService = new AuthService();

  async register(request: FastifyRequest, reply: FastifyReply) {
    try {
      const data = registerSchema.parse(request.body);
      const user = await this.authService.register(data);
      return reply.status(201).send(user);
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        return reply.status(400).send({ errors: error.errors });
      }
      throw error;
    }
  }

  async login(request: FastifyRequest, reply: FastifyReply) {
    try {
      const data = loginSchema.parse(request.body);
      const result = await this.authService.login(data);
      return reply.status(200).send(result);
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        return reply.status(400).send({ errors: error.errors });
      }
      throw error;
    }
  }
}
