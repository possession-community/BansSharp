import { createServerFn } from "@tanstack/react-start";
import { eq } from "drizzle-orm";
import { MuteStatus, MuteType } from "~/lib/features/simple-admin/data/schema";
import { db } from "../../server/db";
import { saAdmins, saMutes, saServers, saUnmutes } from "../../server/schema";
import { adminOnlyFunction } from "~/lib/middleware/auth-guard";

type AddMuteRequest = {
  playerName: string | null;
  playerSteamid: string;
  adminSteamid: string;
  adminName: string;
  reason: string;
  duration: number;
  type: MuteType;
  serverId: number | null;
};

export const addMute = createServerFn({ method: "GET" })
  .middleware([adminOnlyFunction])
  .validator((data: AddMuteRequest) => data)
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
        .insert(saMutes)
        .values({
          playerName: data.playerName,
          playerSteamid: data.playerSteamid,
          adminSteamid: data.adminSteamid,
          adminName: data.adminName,
          reason: data.reason,
          duration: data.duration,
          ends,
          type: data.type,
          status: "ACTIVE",
          serverId: data.serverId,
        })
        .$returningId();

      return result[0];
    });
  });

type EditMuteRequest = {
  id: number;
  playerName: string | null;
  playerSteamid: string;
  reason: string;
  duration: number;
  type: MuteType;
  serverId: number | null;
};

export const editMute = createServerFn({ method: "GET" })
  .middleware([adminOnlyFunction])
  .validator((data: EditMuteRequest) => data)
  .handler(async ({ data }) => {
    return await db.transaction(async (tx) => {
      const muteExists = await tx
        .select({ id: saMutes.id })
        .from(saMutes)
        .where(eq(saMutes.id, data.id));

      if (muteExists.length === 0) {
        throw new Error(`Mute with ID ${data.id} does not exist`);
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
        .update(saMutes)
        .set({
          playerName: data.playerName,
          playerSteamid: data.playerSteamid,
          reason: data.reason,
          duration: data.duration,
          ends,
          type: data.type,
          serverId: data.serverId,
        })
        .where(eq(saMutes.id, data.id));

      return data.id;
    });
  });

type UnmutePlayerRequest = {
  muteId: number;
  adminId: number;
  reason: string;
};

export const unmutePlayer = createServerFn({ method: "GET" })
  .middleware([adminOnlyFunction])
  .validator((data: UnmutePlayerRequest) => data)
  .handler(async ({ data }) => {
    return await db.transaction(async (tx) => {
      const muteExists = await tx
        .select({ id: saMutes.id })
        .from(saMutes)
        .where(eq(saMutes.id, data.muteId));

      if (muteExists.length === 0) {
        throw new Error(`Mute with ID ${data.muteId} does not exist`);
      }

      const adminExists = await tx
        .select({ id: saAdmins.id })
        .from(saAdmins)
        .where(eq(saAdmins.id, data.adminId));

      if (adminExists.length === 0) {
        throw new Error(`Admin with ID ${data.adminId} does not exist`);
      }

      const unmuteResult = await tx
        .insert(saUnmutes)
        .values({
          muteId: data.muteId,
          adminId: data.adminId,
          reason: data.reason,
        })
        .$returningId();

      const unmuteId = unmuteResult[0].id;

      const result = await tx
        .update(saMutes)
        .set({
          status: "UNMUTED",
          unmuteId,
        })
        .where(eq(saMutes.id, data.muteId));

      return result[0];
    });
  });

export const getMutes = createServerFn({ method: "GET" })
  .middleware([adminOnlyFunction])
  .handler(async () => {
    return await db.transaction(async (tx) => {
      const mutes = await tx.select().from(saMutes);

      return mutes.map((mute) => ({
        id: mute.id,
        player_name: mute.playerName,
        player_steamid: mute.playerSteamid || "",
        admin_steamid: mute.adminSteamid,
        admin_name: mute.adminName,
        reason: mute.reason,
        duration: mute.duration,
        passed: mute.passed,
        ends: mute.ends?.toISOString() || null,
        created: mute.created.toISOString(),
        type: mute.type as MuteType,
        server_id: mute.serverId,
        unmute_id: mute.unmuteId,
        status: mute.status as MuteStatus,
      }));
    });
  });
