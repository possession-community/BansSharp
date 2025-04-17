import { z } from "zod";

// Group schema
export const groupSchema = z.object({
  id: z.number(),
  name: z.string(),
  immunity: z.number(),
  created: z.string(),
  flags: z.array(z.string()).optional(),
  serverIds: z.array(z.number()).optional(),
});
export type Group = z.infer<typeof groupSchema>;
export const groupListSchema = z.array(groupSchema);

const banStatusSchema = z.union([
  z.literal("ACTIVE"),
  z.literal("UNBANNED"),
  z.literal("EXPIRED"),
]);
export type BanStatus = z.infer<typeof banStatusSchema>;

const muteTypeSchema = z.union([
  z.literal("GAG"),
  z.literal("MUTE"),
  z.literal("SILENCE"),
]);
export type MuteType = z.infer<typeof muteTypeSchema>;

const muteStatusSchema = z.union([
  z.literal("ACTIVE"),
  z.literal("UNMUTED"),
  z.literal("EXPIRED"),
]);
export type MuteStatus = z.infer<typeof muteStatusSchema>;

const warnStatusSchema = z.union([z.literal("ACTIVE"), z.literal("EXPIRED")]);
export type WarnStatus = z.infer<typeof warnStatusSchema>;

export const banSchema = z.object({
  id: z.number(),
  player_name: z.string().nullable(),
  player_steamid: z.string(),
  player_ip: z.string().nullable(),
  admin_steamid: z.string(),
  admin_name: z.string(),
  reason: z.string(),
  duration: z.number(),
  ends: z.string().nullable(),
  created: z.string(),
  server_id: z.number().nullable(),
  unban_id: z.number().nullable(),
  status: banStatusSchema,
});
export type Ban = z.infer<typeof banSchema>;

export const muteSchema = z.object({
  id: z.number(),
  player_name: z.string().nullable(),
  player_steamid: z.string(),
  admin_steamid: z.string(),
  admin_name: z.string(),
  reason: z.string(),
  duration: z.number(),
  passed: z.number().nullable(),
  ends: z.string().nullable(),
  created: z.string(),
  type: muteTypeSchema,
  server_id: z.number().nullable(),
  unmute_id: z.number().nullable(),
  status: muteStatusSchema,
});
export type Mute = z.infer<typeof muteSchema>;

export const warnSchema = z.object({
  id: z.number(),
  player_name: z.string().nullable(),
  player_steamid: z.string(),
  admin_steamid: z.string(),
  admin_name: z.string(),
  reason: z.string(),
  duration: z.number(),
  ends: z.string(),
  created: z.string(),
  server_id: z.number().nullable(),
  status: warnStatusSchema,
});
export type Warn = z.infer<typeof warnSchema>;

export const adminSchema = z.object({
  id: z.number(),
  player_name: z.string().nullable(),
  player_steamid: z.string(),
  flags: z.string().nullable(),
  immunity: z.number(),
  server_id: z.number().nullable(),
  ends: z.string().nullable(),
  created: z.string(),
  group_id: z.number().nullable(),
});
export type Admin = z.infer<typeof adminSchema>;

// Server schema
export const serverSchema = z.object({
  id: z.number(),
  hostname: z.string().nullable(),
  address: z.string(),
  mapName: z.string().nullable(),
  playerCount: z.number().nullable(),
  maxPlayers: z.number().optional(),
  isOnline: z.boolean().optional(),
});
export type Server = z.infer<typeof serverSchema>;
export const serverListSchema = z.array(serverSchema);

export const banListSchema = z.array(banSchema);
export const muteListSchema = z.array(muteSchema);
export const warnListSchema = z.array(warnSchema);
export const adminListSchema = z.array(adminSchema);
