import { createServerFn } from "@tanstack/react-start";
import { eq } from "drizzle-orm";
import { db } from "../../server/db";
import { user } from "../../server/schema/auth.schema";
import { rootOnlyFunction } from "~/lib/middleware/auth-guard";

export type User = {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  image: string | null;
  createdAt: string;
  updatedAt: string;
  role: string | null;
  banned: boolean | null;
  banReason: string | null;
  banExpires: string | null;
  steamId: string | null;
  steamVerified: boolean | null;
};

type EditUserRequest = {
  id: string;
  name: string;
  email: string;
  role: string | null;
  banned: boolean | null;
  banReason: string | null;
  banExpires: string | null;
};

export const getUsers = createServerFn({ method: "GET" })
  .middleware([rootOnlyFunction])
  .handler(async () => {
    return await db.transaction(async (tx) => {
      const users = await tx.select().from(user);

      return users.map((u) => ({
        id: u.id,
        name: u.name,
        email: u.email,
        emailVerified: u.emailVerified,
        image: u.image,
        createdAt: u.createdAt.toISOString(),
        updatedAt: u.updatedAt.toISOString(),
        role: u.role,
        banned: u.banned,
        banReason: u.banReason,
        banExpires: u.banExpires?.toISOString() || null,
        steamId: u.steamId,
        steamVerified: u.steamVerified,
      }));
    });
  });

export const editUser = createServerFn({ method: "GET" })
  .middleware([rootOnlyFunction])
  .validator((data: EditUserRequest) => data)
  .handler(async ({ data }) => {
    return await db.transaction(async (tx) => {
      const userExists = await tx
        .select({ id: user.id })
        .from(user)
        .where(eq(user.id, data.id));

      if (userExists.length === 0) {
        throw new Error(`User with ID ${data.id} does not exist`);
      }

      // Prepare update data with only the fields that were provided
      const updateData: Record<string, any> = {
        updatedAt: new Date(), // Always update the updatedAt timestamp
      };

      // Only include fields that were explicitly provided
      if (data.name !== undefined) updateData.name = data.name;
      if (data.email !== undefined) updateData.email = data.email;
      if (data.role !== undefined) updateData.role = data.role;
      if (data.banned !== undefined) updateData.banned = data.banned;
      if (data.banReason !== undefined) updateData.banReason = data.banReason;
      if (data.banExpires !== undefined) {
        updateData.banExpires = data.banExpires ? new Date(data.banExpires) : null;
      }

      await tx.update(user).set(updateData).where(eq(user.id, data.id));

      return data.id;
    });
  });
