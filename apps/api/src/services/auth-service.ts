import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { UserRepository } from "../repositories/user-repository";
import { AppError } from "../utils/app-error";

const SECRET = process.env.JWT_SECRET || "super-secret-key-finance-ai";

export class AuthService {
  private userRepository = new UserRepository();

  async register(data: any) {
    const userExists = await this.userRepository.findByEmail(data.email);
    if (userExists) {
      throw new AppError("Este e-mail já está em uso", 400);
    }

    // Criptografando a senha
    const hashedPassword = await bcrypt.hash(data.password, 10);

    const user = await this.userRepository.create({
      ...data,
      password: hashedPassword,
    });

    // Removemos a senha do retorno por segurança
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async login(data: any) {
    const user = await this.userRepository.findByEmail(data.email);
    if (!user) {
      throw new AppError("Credenciais inválidas", 401);
    }

    const passwordMatch = await bcrypt.compare(data.password, user.password);
    if (!passwordMatch) {
      throw new AppError("Credenciais inválidas", 401);
    }

    const token = jwt.sign({ userId: user.id }, SECRET, { expiresIn: "7d" });

    return {
      user: { id: user.id, name: user.name, email: user.email },
      token,
    };
  }
}
