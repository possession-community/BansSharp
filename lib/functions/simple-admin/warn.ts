import { createServerFn } from "@tanstack/react-start";
import { eq } from "drizzle-orm";
import { WarnStatus } from "~/lib/features/simple-admin/data/schema";
import { db } from "../../server/db";
import { saAdmins, saServers, saWarns } from "../../server/schema";
import { adminOnlyFunction } from "~/lib/middleware/auth-guard";

type AddWarnRequest = {
  playerName: string | null;
  playerSteamid: string;
  adminSteamid: string;
  adminName: string;
  reason: string;
  duration: number;
  serverId: number | null;
};

export const addWarn = createServerFn({ method: "GET" })
  .middleware([adminOnlyFunction])
  .validator((data: AddWarnRequest) => data)
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

      const ends = new Date(Date.now() + data.duration * 1000);

      const result = await tx
        .insert(saWarns)
        .values({
          playerName: data.playerName,
          playerSteamid: data.playerSteamid,
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

type EditWarnRequest = {
  id: number;
  playerName: string | null;
  playerSteamid: string;
  reason: string;
  duration: number;
  serverId: number | null;
};

export const editWarn = createServerFn({ method: "GET" })
  .middleware([adminOnlyFunction])
  .validator((data: EditWarnRequest) => data)
  .handler(async ({ data }) => {
    return await db.transaction(async (tx) => {
      const warnExists = await tx
        .select({ id: saWarns.id })
        .from(saWarns)
        .where(eq(saWarns.id, data.id));

      if (warnExists.length === 0) {
        throw new Error(`Warn with ID ${data.id} does not exist`);
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

      const ends = new Date(Date.now() + data.duration * 1000);

      await tx
        .update(saWarns)
        .set({
          playerName: data.playerName,
          playerSteamid: data.playerSteamid,
          reason: data.reason,
          duration: data.duration,
          ends,
          serverId: data.serverId,
        })
        .where(eq(saWarns.id, data.id));

      return data.id;
    });
  });

export const getWarns = createServerFn({ method: "GET" })
  .middleware([adminOnlyFunction])
  .handler(async () => {
    return await db.transaction(async (tx) => {
      const warns = await tx.select().from(saWarns);

      return warns.map((warn) => ({
        id: warn.id,
        player_name: warn.playerName,
        player_steamid: warn.playerSteamid || "",
        admin_steamid: warn.adminSteamid,
        admin_name: warn.adminName,
        reason: warn.reason,
        duration: warn.duration,
        ends: warn.ends.toISOString(),
        created: warn.created.toISOString(),
        server_id: warn.serverId,
        status: warn.status as WarnStatus,
      }));
    });
  });
