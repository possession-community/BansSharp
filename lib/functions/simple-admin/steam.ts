import { createServerFn } from "@tanstack/react-start";

interface SteamPlayerSummary {
  steamid: string;
  personaname: string;
  profileurl: string;
  avatar: string;
  avatarmedium: string;
  avatarfull: string;
  personastate: number;
  communityvisibilitystate: number;
  profilestate: number;
  lastlogoff: number;
  commentpermission: number;
  realname?: string;
  primaryclanid?: string;
  timecreated?: number;
  personastateflags?: number;
  loccountrycode?: string;
  locstatecode?: string;
  loccityid?: number;
}

interface SteamPlayerSummariesResponse {
  response: {
    players: SteamPlayerSummary[];
  };
}

/**
 * Fetches player information from Steam API using SteamID
 */
export async function fetchSteamPlayerInfo(
  steamId: string,
): Promise<SteamPlayerSummary | null> {
  if (!steamId || !process.env.STEAM_API_KEY) {
    return null;
  }

  try {
    const url = new URL(
      "https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/",
    );
    url.searchParams.append("key", process.env.STEAM_API_KEY || "");
    url.searchParams.append("steamids", steamId);

    const response = await fetch(url.toString());

    if (!response.ok) {
      throw new Error(`Steam API error: ${response.status} ${response.statusText}`);
    }

    const data = (await response.json()) as SteamPlayerSummariesResponse;

    if (!data.response?.players?.length) {
      return null;
    }

    return data.response.players[0];
  } catch (error) {
    console.error("Error fetching Steam player info:", error);
    return null;
  }
}

/**
 * Gets player information from Steam API using SteamID (server function)
 */
export const getSteamPlayerInfo = createServerFn({ method: "GET" })
  .validator((steamId: string) => steamId)
  .handler(async ({ data: steamId }) => {
    return await fetchSteamPlayerInfo(steamId);
  });

/**
 * Gets player name from Steam API using SteamID (server function)
 */
export const getSteamPlayerName = createServerFn({ method: "GET" })
  .validator((steamId: string) => steamId)
  .handler(async ({ data: steamId }) => {
    const playerInfo = await fetchSteamPlayerInfo(steamId);
    return playerInfo?.personaname || null;
  });
