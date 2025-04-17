import "dotenv/config";
import { eq } from "drizzle-orm";
import { db } from "../server/db";
import { user } from "../server/schema";

/**
 * Change the role of a user.
 * @param email User's email address
 * @param role Role to set (e.g., "admin", "user")
 */
async function changeUserRole(email: string, role: string) {
  try {
    // Check environment variable
    const connectionString = process.env.DATABASE_URL || import.meta.env.DATABASE_URL;
    if (!connectionString) {
      throw new Error("DATABASE_URL environment variable is not set");
    }

    const users = await db.query.user.findMany({
      where: (user, { eq }) => eq(user.email, email),
    });

    if (users.length === 0) {
      console.error(`User not found: ${email}`);
      return;
    }

    const foundUser = users[0];
    console.log(`Current user information:`, {
      id: foundUser.id,
      email: foundUser.email,
      role: foundUser.role,
    });

    await db.update(user).set({ role }).where(eq(user.id, foundUser.id));

    console.log(`Changed role of user ${email} to ${role}.`);

    const updatedUsers = await db.query.user.findMany({
      where: (user, { eq }) => eq(user.id, foundUser.id),
    });

    if (updatedUsers.length > 0) {
      console.log(`Updated user information:`, {
        id: updatedUsers[0].id,
        email: updatedUsers[0].email,
        role: updatedUsers[0].role,
      });
    }
  } catch (err) {
    console.error("An error occurred:", err);
  } finally {
    process.exit(0);
  }
}

if (process.argv.length < 4) {
  console.error("Usage: npx tsx change-user-role.ts <email> <role>");
  console.error("Example: npx tsx change-user-role.ts user@example.com admin");
  process.exit(1);
}

const email = process.argv[2];
const role = process.argv[3];

changeUserRole(email, role);
