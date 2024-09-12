import { Prisma, PrismaClient } from "@prisma/client";
import config from "../config";

import bycrypt from "bcryptjs";

const prisma = new PrismaClient();
let admin = {
  name: "Admin",
  email: "admin@gmail.com",
  password: config.superAdminPassword,
  role: "ADMIN",
  isAdmin: true,
};

const seedSuperAdmin = async () => {
  admin.password = await bycrypt.hash(admin.password, 10);
//   console.table(admin)
  const isSuperAdminExists = await prisma.user.findFirst({
    where:{
        email:"admin@gmail.com"
    }
  });
  if (!isSuperAdminExists) {
    await prisma.user.create({
      data: admin,
    });
  }
};

export default seedSuperAdmin;
