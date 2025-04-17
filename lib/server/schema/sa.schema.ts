import { relations } from "drizzle-orm";
import {
  bigint,
  int,
  mysqlEnum,
  mysqlTable,
  text,
  timestamp,
  uniqueIndex,
  varchar,
} from "drizzle-orm/mysql-core";

export const saServers = mysqlTable("sa_servers", {
  id: int("id").primaryKey().autoincrement(),
  hostname: varchar("hostname", { length: 128 }),
  rconPassword: varchar("rcon_password", { length: 128 }),
  address: varchar("address", { length: 64 }).notNull().unique(),
});

export const saGroups = mysqlTable("sa_groups", {
  id: int("id").primaryKey().autoincrement(),
  name: varchar("name", { length: 255 }).notNull(),
  immunity: int("immunity").notNull().default(0),
});

export const saAdmins = mysqlTable("sa_admins", {
  id: int("id").primaryKey().autoincrement(),
  playerName: varchar("player_name", { length: 128 }),
  playerSteamid: varchar("player_steamid", { length: 64 }).notNull(),
  flags: text("flags"),
  immunity: int("immunity").notNull().default(0),
  serverId: int("server_id"),
  ends: timestamp("ends"),
  created: timestamp("created").notNull().defaultNow(),
  groupId: int("group_id"),
});

export const saAdminsRelations = relations(saAdmins, ({ one }) => ({
  server: one(saServers, {
    fields: [saAdmins.serverId],
    references: [saServers.id],
  }),
  group: one(saGroups, {
    fields: [saAdmins.groupId],
    references: [saGroups.id],
  }),
}));

export const saAdminsFlags = mysqlTable("sa_admins_flags", {
  id: int("id").primaryKey().autoincrement(),
  adminId: int("admin_id").notNull(),
  flag: varchar("flag", { length: 64 }).notNull(),
});

export const saAdminsFlagsRelations = relations(saAdminsFlags, ({ one }) => ({
  admin: one(saAdmins, {
    fields: [saAdminsFlags.adminId],
    references: [saAdmins.id],
  }),
}));

export const saGroupsFlags = mysqlTable("sa_groups_flags", {
  id: int("id").primaryKey().autoincrement(),
  groupId: int("group_id").notNull(),
  flag: varchar("flag", { length: 64 }).notNull(),
});

export const saGroupsFlagsRelations = relations(saGroupsFlags, ({ one }) => ({
  group: one(saGroups, {
    fields: [saGroupsFlags.groupId],
    references: [saGroups.id],
  }),
}));

export const saGroupsServers = mysqlTable("sa_groups_servers", {
  id: int("id").primaryKey().autoincrement(),
  groupId: int("group_id").notNull(),
  serverId: int("server_id"),
});

export const saGroupsServersRelations = relations(saGroupsServers, ({ one }) => ({
  group: one(saGroups, {
    fields: [saGroupsServers.groupId],
    references: [saGroups.id],
  }),
  server: one(saServers, {
    fields: [saGroupsServers.serverId],
    references: [saServers.id],
  }),
}));

export const saUnbans = mysqlTable("sa_unbans", {
  id: int("id").primaryKey().autoincrement(),
  banId: int("ban_id").notNull(),
  adminId: int("admin_id").notNull().default(0),
  reason: varchar("reason", { length: 255 }).notNull().default("Unknown"),
  date: timestamp("date").notNull().defaultNow(),
});

export const saUnmutes = mysqlTable("sa_unmutes", {
  id: int("id").primaryKey().autoincrement(),
  muteId: int("mute_id").notNull(),
  adminId: int("admin_id").notNull().default(0),
  reason: varchar("reason", { length: 255 }).notNull().default("Unknown"),
  date: timestamp("date").notNull().defaultNow(),
});

export const saBans = mysqlTable("sa_bans", {
  id: int("id").primaryKey().autoincrement(),
  playerName: varchar("player_name", { length: 128 }),
  playerSteamid: varchar("player_steamid", { length: 64 }),
  playerIp: varchar("player_ip", { length: 128 }),
  adminSteamid: varchar("admin_steamid", { length: 64 }).notNull(),
  adminName: varchar("admin_name", { length: 128 }).notNull(),
  reason: varchar("reason", { length: 255 }).notNull(),
  duration: int("duration").notNull(),
  ends: timestamp("ends"),
  created: timestamp("created").notNull().defaultNow(),
  serverId: int("server_id"),
  unbanId: int("unban_id"),
  status: mysqlEnum("status", ["ACTIVE", "UNBANNED", "EXPIRED", ""])
    .notNull()
    .default("ACTIVE"),
});

export const saMutes = mysqlTable("sa_mutes", {
  id: int("id").primaryKey().autoincrement(),
  playerName: varchar("player_name", { length: 128 }),
  playerSteamid: varchar("player_steamid", { length: 64 }).notNull(),
  adminSteamid: varchar("admin_steamid", { length: 64 }).notNull(),
  adminName: varchar("admin_name", { length: 128 }).notNull(),
  reason: varchar("reason", { length: 255 }).notNull(),
  duration: int("duration").notNull(),
  passed: int("passed"),
  ends: timestamp("ends"),
  created: timestamp("created").notNull().defaultNow(),
  type: mysqlEnum("type", ["GAG", "MUTE", "SILENCE", ""]).notNull().default("GAG"),
  serverId: int("server_id"),
  unmuteId: int("unmute_id"),
  status: mysqlEnum("status", ["ACTIVE", "UNMUTED", "EXPIRED", ""])
    .notNull()
    .default("ACTIVE"),
});

export const saBansRelations = relations(saBans, ({ one }) => ({
  server: one(saServers, {
    fields: [saBans.serverId],
    references: [saServers.id],
  }),
  unban: one(saUnbans, {
    fields: [saBans.unbanId],
    references: [saUnbans.id],
  }),
}));

export const saUnbansRelations = relations(saUnbans, ({ one }) => ({
  ban: one(saBans, {
    fields: [saUnbans.banId],
    references: [saBans.id],
  }),
  admin: one(saAdmins, {
    fields: [saUnbans.adminId],
    references: [saAdmins.id],
  }),
}));

export const saMutesRelations = relations(saMutes, ({ one }) => ({
  server: one(saServers, {
    fields: [saMutes.serverId],
    references: [saServers.id],
  }),
  unmute: one(saUnmutes, {
    fields: [saMutes.unmuteId],
    references: [saUnmutes.id],
  }),
}));

export const saUnmutesRelations = relations(saUnmutes, ({ one }) => ({
  mute: one(saMutes, {
    fields: [saUnmutes.muteId],
    references: [saMutes.id],
  }),
  admin: one(saAdmins, {
    fields: [saUnmutes.adminId],
    references: [saAdmins.id],
  }),
}));

export const saWarns = mysqlTable("sa_warns", {
  id: int("id").primaryKey().autoincrement(),
  playerName: varchar("player_name", { length: 128 }),
  playerSteamid: varchar("player_steamid", { length: 64 }).notNull(),
  adminSteamid: varchar("admin_steamid", { length: 64 }).notNull(),
  adminName: varchar("admin_name", { length: 128 }).notNull(),
  reason: varchar("reason", { length: 255 }).notNull(),
  duration: int("duration").notNull(),
  ends: timestamp("ends").notNull(),
  created: timestamp("created").notNull().defaultNow(),
  serverId: int("server_id"),
  status: mysqlEnum("status", ["ACTIVE", "EXPIRED", ""]).notNull().default("ACTIVE"),
});

export const saWarnsRelations = relations(saWarns, ({ one }) => ({
  server: one(saServers, {
    fields: [saWarns.serverId],
    references: [saServers.id],
  }),
}));

export const saPlayersIps = mysqlTable(
  "sa_players_ips",
  {
    id: int("id").primaryKey().autoincrement(),
    steamid: bigint("steamid", { mode: "number" }).notNull(),
    address: varchar("address", { length: 64 }).notNull(),
    usedAt: timestamp("used_at").notNull().defaultNow(),
  },
  (table) => [uniqueIndex("steamid_address_idx").on(table.steamid, table.address)],
);
