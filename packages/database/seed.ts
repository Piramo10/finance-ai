import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Semeando categorias iniciais...");

  const categories = [
    { name: "Alimentação", color: "#EF4444", icon: "utensils" },
    { name: "Lazer", color: "#3B82F6", icon: "gamepad" },
    { name: "Transporte", color: "#F59E0B", icon: "car" },
    { name: "Saúde", color: "#10B981", icon: "heart" },
    { name: "Moradia", color: "#8B5CF6", icon: "home" },
  ];

  for (const cat of categories) {
    await prisma.category.upsert({
      where: { name: cat.name },
      update: {},
      create: cat,
    });
  }

  console.log("✅ Categorias criadas com sucesso!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
