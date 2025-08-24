import { PrismaClient } from '@prisma/client';
import { User } from "./generated/prisma/index.d.ts"

const prisma = new PrismaClient();

await prisma.user.create({
    data: {
        name: 'Jonas'
    }
});