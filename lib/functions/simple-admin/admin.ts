import { createServerFn } from "@tanstack/react-start";
import { eq } from "drizzle-orm";
import { db } from "../../server/db";
import {
  saAdmins,
  saAdminsFlags,
  saGroups,
  saServers,
  saUnbans,
  saUnmutes,
} from "../../server/schema";
import { rootOnlyFunction } from "~/lib/middleware/auth-guard";

export const getServers = createServerFn({ method: "GET" }).handler(async () => {
  return await db.transaction(async (tx) => {
    const servers = await tx.select().from(saServers);

    return [
      { id: null, hostname: "ALL" },
      ...servers.map((server) => ({
        id: server.id,
        hostname: server.hostname || `Server ${server.id}`,
      })),
    ];
  });
});

type AddAdminRequest = {
  playerName: string | null;
  playerSteamid: string;
  flags: string | null;
  immunity: number;
  serverId: number | null;
  groupId: number | null;
  duration: number;
};

export const addAdmin = createServerFn({ method: "GET" })
  .middleware([rootOnlyFunction])
  .validator((data: AddAdminRequest) => data)
  .handler(async ({ data }) => {
    return await db.transaction(async (tx) => {
      if (data.serverId !== null) {
        const serverExists = await tx
          .select({ id: saServers.id })
          .from(saServers)
          .where(eq(saServers.id, data.serverId));

        if (serverExists.length === 0) {
          throw new Error(`Server with ID ${data.serverId} does not exist`);
        }
      }

      if (data.groupId !== null) {
        const groupExists = await tx
          .select({ id: saGroups.id })
          .from(saGroups)
          .where(eq(saGroups.id, data.groupId));

        if (groupExists.length === 0) {
          throw new Error(`Group with ID ${data.groupId} does not exist`);
        }
      }

      const ends =
        data.duration === 0 ? null : new Date(Date.now() + data.duration * 1000);

      const result = await tx
        .insert(saAdmins)
        .values({
          playerName: data.playerName,
          playerSteamid: data.playerSteamid,
          flags: data.flags,
          immunity: data.immunity,
          serverId: data.serverId,
          groupId: data.groupId,
          ends,
        })
        .$returningId();

      const adminId = result[0].id;

      if (data.flags && data.flags.trim() !== "") {
        const flagsArray = data.flags.split(",");

        for (const flag of flagsArray) {
          if (flag.trim() !== "") {
            await tx.insert(saAdminsFlags).values({
              adminId,
              flag,
            });
          }
        }
      }

      return adminId;
    });
  });

type EditAdminRequest = {
  id: number;
  playerName: string | null;
  playerSteamid: string;
  flags: string | null;
  immunity: number;
  serverId: number | null;
  groupId: number | null;
  duration: number;
};

export const editAdmin = createServerFn({ method: "GET" })
  .middleware([rootOnlyFunction])
  .validator((data: EditAdminRequest) => data)
  .handler(async ({ data }) => {
    return await db.transaction(async (tx) => {
      const adminExists = await tx
        .select({ id: saAdmins.id, flags: saAdmins.flags })
        .from(saAdmins)
        .where(eq(saAdmins.id, data.id));

      if (adminExists.length === 0) {
        throw new Error(`Admin with ID ${data.id} does not exist`);
      }

      if (data.serverId !== null) {
        const serverExists = await tx
          .select({ id: saServers.id })
          .from(saServers)
          .where(eq(saServers.id, data.serverId));

        if (serverExists.length === 0) {
          throw new Error(`Server with ID ${data.serverId} does not exist`);
        }
      }

      if (data.groupId !== null) {
        const groupExists = await tx
          .select({ id: saGroups.id })
          .from(saGroups)
          .where(eq(saGroups.id, data.groupId));

        if (groupExists.length === 0) {
          throw new Error(`Group with ID ${data.groupId} does not exist`);
        }
      }

      const ends =
        data.duration === 0 ? null : new Date(Date.now() + data.duration * 1000);

      await tx
        .update(saAdmins)
        .set({
          playerName: data.playerName,
          playerSteamid: data.playerSteamid,
          flags: data.flags,
          immunity: data.immunity,
          serverId: data.serverId,
          groupId: data.groupId,
          ends,
        })
        .where(eq(saAdmins.id, data.id));

      const oldFlags = adminExists[0].flags || "";
      const newFlags = data.flags || "";

      if (oldFlags !== newFlags) {
        await tx.delete(saAdminsFlags).where(eq(saAdminsFlags.adminId, data.id));

        if (newFlags.trim() !== "") {
          const flagsArray = newFlags.split(",");

          for (const flag of flagsArray) {
            if (flag.trim() !== "") {
              await tx.insert(saAdminsFlags).values({
                adminId: data.id,
                flag,
              });
            }
          }
        }
      }

      return data.id;
    });
  });

export const getAdmins = createServerFn({ method: "GET" })
  .middleware([rootOnlyFunction])
  .handler(async () => {
    return await db.transaction(async (tx) => {
      const admins = await tx.select().from(saAdmins);

      return admins.map((admin) => ({
        id: admin.id,
        player_name: admin.playerName,
        player_steamid: admin.playerSteamid,
        flags: admin.flags,
        immunity: admin.immunity,
        server_id: admin.serverId,
        ends: admin.ends?.toISOString() || null,
        created: admin.created.toISOString(),
        group_id: admin.groupId,
      }));
    });
  });

export const deleteAdmin = createServerFn({ method: "GET" })
  .middleware([rootOnlyFunction])
  .validator((data: { id: number }) => data)
  .handler(async ({ data }) => {
    return await db.transaction(async (tx) => {
      const adminExists = await tx
        .select({ id: saAdmins.id })
        .from(saAdmins)
        .where(eq(saAdmins.id, data.id));

      if (adminExists.length === 0) {
        throw new Error(`Admin with ID ${data.id} does not exist`);
      }

      // Delete admin flags
      await tx.delete(saAdminsFlags).where(eq(saAdminsFlags.adminId, data.id));

      // Update unbans to set adminId to 0 (default)
      await tx.update(saUnbans).set({ adminId: 0 }).where(eq(saUnbans.adminId, data.id));

      // Update unmutes to set adminId to 0 (default)
      await tx
        .update(saUnmutes)
        .set({ adminId: 0 })
        .where(eq(saUnmutes.adminId, data.id));

      // Delete the admin
      await tx.delete(saAdmins).where(eq(saAdmins.id, data.id));

      return data.id;
    });
  });
