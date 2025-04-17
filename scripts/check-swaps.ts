import { prisma } from "@/app/api/lib/prisma";

async function main() {
  const swaps = await prisma.swap.findMany();
  console.log(swaps);
}

main().finally(() => prisma.$disconnect());
