import { createServerFn } from "@tanstack/react-start";
import { BanStatus, MuteStatus, MuteType } from "~/lib/features/simple-admin/data/schema";
import { db } from "../../server/db";
import { saBans, saMutes } from "../../server/schema";

export const getViolations = createServerFn({ method: "GET" }).handler(async () => {
  return await db.transaction(async (tx) => {
    const bans = await tx.select().from(saBans);
    const mutes = await tx.select().from(saMutes);

    const banData = bans.map((ban) => ({
      type: "ban" as const,
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

    const muteData = mutes.map((mute) => ({
      type: "mute" as const,
      id: mute.id,
      player_name: mute.playerName,
      player_steamid: mute.playerSteamid || "",
      admin_steamid: mute.adminSteamid,
      admin_name: mute.adminName,
      reason: mute.reason,
      duration: mute.duration,
      ends: mute.ends?.toISOString() || null,
      created: mute.created.toISOString(),
      server_id: mute.serverId,
      unmute_id: mute.unmuteId,
      status: mute.status as MuteStatus,
      mute_type: mute.type as MuteType,
    }));

    return [...banData, ...muteData];
  });
});
