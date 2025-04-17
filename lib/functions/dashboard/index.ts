import { createServerFn } from "@tanstack/react-start";
import { and, count, desc, gte, lt, sql } from "drizzle-orm";
import { Server } from "../../features/simple-admin/data/schema";
import { db } from "../../server/db";
import { saAdmins, saBans, saMutes, saServers } from "../../server/schema";

// Steam API response interfaces
interface SteamServerInfo {
  addr: string;
  gameport: number;
  steamid: string;
  name: string;
  appid: number;
  gamedir: string;
  version: string;
  product: string;
  region: number;
  players: number;
  max_players: number;
  bots: number;
  map: string;
  secure: boolean;
  dedicated: boolean;
  os: string;
  gametype: string;
}

interface SteamServerListResponse {
  response: {
    servers: SteamServerInfo[];
  };
}

// Fetch server info from Steam API
async function fetchServerInfoFromSteam(
  address: string,
): Promise<SteamServerInfo | null> {
  try {
    const apiKey = process.env.STEAM_API_KEY;
    if (!apiKey) {
      console.error("Steam API key not set");
      return null;
    }

    const url = `https://api.steampowered.com/IGameServersService/GetServerList/v1/?key=${apiKey}&filter=addr\\${address}`;
    const response = await fetch(url);

    if (!response.ok) {
      console.error(`Steam API error: ${response.status} ${response.statusText}`);
      return null;
    }

    const data = (await response.json()) as SteamServerListResponse;

    if (!data.response?.servers?.length) {
      return null;
    }

    return data.response.servers[0];
  } catch (error) {
    console.error("Error fetching server info from Steam:", error);
    return null;
  }
}

// Get total servers count
export const getTotalServers = createServerFn({ method: "GET" }).handler(async () => {
  return await db.transaction(async (tx) => {
    const result = await tx.select({ count: count() }).from(saServers);
    return result[0].count;
  });
});

// Get total violations count (BANs + MUTEs)
export const getTotalViolations = createServerFn({ method: "GET" }).handler(async () => {
  return await db.transaction(async (tx) => {
    const bansCount = await tx.select({ count: count() }).from(saBans);
    const mutesCount = await tx.select({ count: count() }).from(saMutes);

    return bansCount[0].count + mutesCount[0].count;
  });
});

// Get total admins count
export const getTotalAdmins = createServerFn({ method: "GET" }).handler(async () => {
  return await db.transaction(async (tx) => {
    const result = await tx.select({ count: count() }).from(saAdmins);
    return result[0].count;
  });
});

// Get monthly violations data (BANs + MUTEs)
export const getMonthlyViolations = createServerFn({ method: "GET" }).handler(
  async () => {
    return await db.transaction(async (tx) => {
      // Get current year
      const currentYear = new Date().getFullYear();

      // Create an array to hold monthly data
      const monthlyData = [];

      // For each month in the current year
      for (let month = 0; month < 12; month++) {
        const startDate = new Date(currentYear, month, 1);
        const endDate = new Date(currentYear, month + 1, 0);

        // Get bans count for this month
        const bansCount = await tx
          .select({ count: count() })
          .from(saBans)
          .where(and(gte(saBans.created, startDate), lt(saBans.created, endDate)));

        // Get mutes count for this month
        const mutesCount = await tx
          .select({ count: count() })
          .from(saMutes)
          .where(and(gte(saMutes.created, startDate), lt(saMutes.created, endDate)));

        // Add to monthly data
        monthlyData.push({
          name: startDate.toLocaleString("default", { month: "short" }),
          total: bansCount[0].count + mutesCount[0].count,
        });
      }

      return monthlyData;
    });
  },
);

// Import the fetchSteamPlayerInfo function
import { fetchSteamPlayerInfo } from "../simple-admin/steam";

// Get recent top 5 violators (players with recent BANs or MUTEs)
export const getRecentViolators = createServerFn({ method: "GET" }).handler(async () => {
  return await db.transaction(async (tx) => {
    // Get recent bans
    const recentBans = await tx
      .select({
        playerName: saBans.playerName,
        playerSteamid: saBans.playerSteamid,
        created: saBans.created,
        type: sql<string>`'ban'`.as("type"),
        status: saBans.status,
      })
      .from(saBans)
      .orderBy(desc(saBans.created))
      .limit(5);

    // Get recent mutes
    const recentMutes = await tx
      .select({
        playerName: saMutes.playerName,
        playerSteamid: saMutes.playerSteamid,
        created: saMutes.created,
        type: sql<string>`'mute'`.as("type"),
        status: saMutes.status,
      })
      .from(saMutes)
      .orderBy(desc(saMutes.created))
      .limit(5);

    // Combine and sort by created date
    const combined = [...recentBans, ...recentMutes]
      .sort((a, b) => b.created.getTime() - a.created.getTime())
      .slice(0, 5);

    // Fetch Steam avatar for each violator
    const violatorsWithAvatars = await Promise.all(
      combined.map(async (item) => {
        let avatarUrl = null;

        if (item.playerSteamid) {
          try {
            const steamInfo = await fetchSteamPlayerInfo(item.playerSteamid);
            if (steamInfo) {
              avatarUrl = steamInfo.avatar;
            }
          } catch (error) {
            console.error(
              `Error fetching Steam avatar for ${item.playerSteamid}:`,
              error,
            );
          }
        }

        return {
          playerName: item.playerName || "Unknown",
          playerSteamid: item.playerSteamid || "",
          type: item.type,
          status: item.status,
          created: item.created.toISOString(),
          avatarUrl,
        };
      }),
    );

    return violatorsWithAvatars;
  });
});

// Get all servers with real-time info from Steam API
export const getServers = createServerFn({ method: "GET" }).handler(async () => {
  return await db.transaction(async (tx) => {
    const servers = await tx
      .select({
        id: saServers.id,
        hostname: saServers.hostname,
        address: saServers.address,
      })
      .from(saServers);

    // Fetch real-time info from Steam API for each server
    const serversWithInfo = await Promise.all(
      servers.map(async (server) => {
        const steamInfo = await fetchServerInfoFromSteam(server.address);
        const isOnline = steamInfo !== null;

        return {
          id: server.id,
          hostname: steamInfo?.name || server.hostname || "Unknown",
          address: server.address,
          mapName: steamInfo?.map || "Unknown",
          playerCount: steamInfo?.players || 0,
          maxPlayers: steamInfo?.max_players || 0,
          isOnline: isOnline,
        };
      }),
    );

    return serversWithInfo as Server[];
  });
});
