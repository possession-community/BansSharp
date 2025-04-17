import { createServerFn } from "@tanstack/react-start";
import { eq } from "drizzle-orm";
import { BanStatus } from "~/lib/features/simple-admin/data/schema";
import { db } from "../../server/db";
import { saAdmins, saBans, saServers, saUnbans } from "../../server/schema";
import { adminOnlyFunction } from "~/lib/middleware/auth-guard";

type AddBanRequest = {
  playerName: string | null;
  playerSteamid: string;
  playerIp: string | null;
  adminSteamid: string;
  adminName: string;
  reason: string;
  duration: number;
  serverId: number | null;
};
export const addBan = createServerFn({ method: "GET" })
  .middleware([adminOnlyFunction])
  .validator((data: AddBanRequest) => data)
  .handler(async ({ data }) => {
    return await db.transaction(async (tx) => {
      const adminExists = await tx
        .select({ playerSteamid: saAdmins.playerSteamid })
        .from(saAdmins)
        .where(eq(saAdmins.playerSteamid, data.adminSteamid));

      if (adminExists.length === 0) {
        throw new Error(`Admin with SteamID ${data.adminSteamid} does not exist`);
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

      const ends =
        data.duration === 0 ? null : new Date(Date.now() + data.duration * 1000);

      const result = await tx
        .insert(saBans)
        .values({
          playerName: data.playerName,
          playerSteamid: data.playerSteamid,
          playerIp: data.playerIp,
          adminSteamid: data.adminSteamid,
          adminName: data.adminName,
          reason: data.reason,
          duration: data.duration,
          ends,
          status: "ACTIVE",
          serverId: data.serverId,
        })
        .$returningId();

      return result[0];
    });
  });

type EditBanRequest = {
  id: number;
  playerName: string | null;
  playerSteamid: string;
  playerIp: string | null;
  reason: string;
  duration: number;
  serverId: number | null;
};

export const editBan = createServerFn({ method: "GET" })
  .middleware([adminOnlyFunction])
  .validator((data: EditBanRequest) => data)
  .handler(async ({ data }) => {
    return await db.transaction(async (tx) => {
      const banExists = await tx
        .select({ id: saBans.id })
        .from(saBans)
        .where(eq(saBans.id, data.id));

      if (banExists.length === 0) {
        throw new Error(`Ban with ID ${data.id} does not exist`);
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

      const ends =
        data.duration === 0 ? null : new Date(Date.now() + data.duration * 1000);

      await tx
        .update(saBans)
        .set({
          playerName: data.playerName,
          playerSteamid: data.playerSteamid,
          playerIp: data.playerIp,
          reason: data.reason,
          duration: data.duration,
          ends,
          serverId: data.serverId,
        })
        .where(eq(saBans.id, data.id));

      return data.id;
    });
  });

type UnbanPlayerRequest = {
  banId: number;
  adminId: number;
  reason: string;
};

export const unbanPlayer = createServerFn({ method: "GET" })
  .middleware([adminOnlyFunction])
  .validator((data: UnbanPlayerRequest) => data)
  .handler(async ({ data }) => {
    return await db.transaction(async (tx) => {
      const banExists = await tx
        .select({ id: saBans.id })
        .from(saBans)
        .where(eq(saBans.id, data.banId));

      if (banExists.length === 0) {
        throw new Error(`Ban with ID ${data.banId} does not exist`);
      }

      const adminExists = await tx
        .select({ id: saAdmins.id })
        .from(saAdmins)
        .where(eq(saAdmins.id, data.adminId));

      if (adminExists.length === 0) {
        throw new Error(`Admin with ID ${data.adminId} does not exist`);
      }

      const unbanResult = await tx
        .insert(saUnbans)
        .values({
          banId: data.banId,
          adminId: data.adminId,
          reason: data.reason,
        })
        .$returningId();

      const unbanId = unbanResult[0].id;

      const result = await tx
        .update(saBans)
        .set({
          status: "UNBANNED",
          unbanId,
        })
        .where(eq(saBans.id, data.banId));

      return result[0];
    });
  });

export const getBans = createServerFn({ method: "GET" })
  .middleware([adminOnlyFunction])
    .handler(async () => {
    return await db.transaction(async (tx) => {
      const bans = await tx.select().from(saBans);

      return bans.map((ban) => ({
        id: ban.id,
        player_name: ban.playerName,
        player_steamid: ban.playerSteamid || "",
        player_ip: ban.playerIp || "",
        admin_steamid: ban.adminSteamid,
        admin_name: ban.adminName,
        reason: ban.reason,
        duration: ban.duration,
        ends: ban.ends?.toISOString() || null,
        created: ban.created.toISOString(),
        server_id: ban.serverId,
        unban_id: ban.unbanId,
        status: ban.status as BanStatus,
      }));
    });
  });
