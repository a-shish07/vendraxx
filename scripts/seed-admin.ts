import "dotenv/config";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import User from "../src/models/User";

const MONGODB_URI = process.env.MONGODB_URI;

const ADMIN_NAME = process.env.ADMIN_NAME || "Vendrax Admin";
const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

async function main() {
  if (!MONGODB_URI) {
    throw new Error("MONGODB_URI is not configured");
  }

  if (!ADMIN_EMAIL) {
    throw new Error("ADMIN_EMAIL is not configured");
  }

  if (!ADMIN_PASSWORD) {
    throw new Error("ADMIN_PASSWORD is not configured");
  }

  await mongoose.connect(MONGODB_URI);
  console.log("SEED URI DB:", mongoose.connection.name);
console.log("SEED HOST:", mongoose.connection.host);

  const passwordHash = await bcrypt.hash(ADMIN_PASSWORD, 12);

  const existingUser = await User.findOne({
    email: ADMIN_EMAIL.toLowerCase(),
  });

  console.log("SEED DB:", mongoose.connection.name);
console.log("SEED COLLECTION:", User.collection.name);

  if (existingUser) {
    existingUser.name = ADMIN_NAME;
    existingUser.passwordHash = passwordHash;
    existingUser.role = "ADMIN";

    await existingUser.save();

    const verifyUser = await User.findOne({
  email: ADMIN_EMAIL.toLowerCase(),
})
  .select("+passwordHash email role");

console.log("VERIFY AFTER SAVE:", {
  email: verifyUser?.email,
  role: verifyUser?.role,
  hasPasswordHash: typeof verifyUser?.passwordHash === "string",
  passwordHashLength: verifyUser?.passwordHash?.length,
});

console.log("SEEDED USER:", {
  email: existingUser.email,
  role: existingUser.role,
  hasPasswordHash: typeof existingUser.passwordHash === "string",
  passwordHashLength: existingUser.passwordHash?.length,
});
  } else {
    await User.create({
      name: ADMIN_NAME,
      email: ADMIN_EMAIL.toLowerCase(),
      passwordHash,
      role: "ADMIN",
    });

    console.log(`Admin account created: ${ADMIN_EMAIL}`);
  }

  await mongoose.disconnect();
}

main()
  .then(() => {
    process.exit(0);
  })
  .catch(async (error) => {
    console.error("Failed to seed admin:", error);

    try {
      await mongoose.disconnect();
    } catch {}

    process.exit(1);
  });