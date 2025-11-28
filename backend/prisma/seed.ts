import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;

  if (!email || !password) {
    console.log("Admin email/password missing in .env");
    return;
  }

  const existing = await prisma.user.findUnique({
    where: { email },
  });

  if (!existing) {
    const hashed = await bcrypt.hash(password, 10);

    await prisma.user.create({
      data: {
        email,
        password: hashed,
        role: "ADMIN",
      },
    });

    console.log("Admin user created");
  } else {
    console.log("Admin already exists");
  }
}

main()
  .catch((e) => console.error(e))
  .finally(() => prisma.$disconnect());
