const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  const swaps = await prisma.swap.findMany()
  console.log(swaps)
}

main().catch(e => console.error(e))
