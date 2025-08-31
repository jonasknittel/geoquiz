import { PrismaClient} from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    await prisma.map.deleteMany();

    await prisma.map.create({
        data: {
            name: 'Österreich Bundesländer',
            directory: 'Bundesländer_AT',
        }
  });
}

main()
  .then(() => console.log("Seeded data"))
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })