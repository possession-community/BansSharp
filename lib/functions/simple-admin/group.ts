import { createServerFn } from "@tanstack/react-start";
import { eq } from "drizzle-orm";
import { db } from "../../server/db";
import { saGroups, saGroupsFlags, saGroupsServers } from "../../server/schema";
import { adminOnlyFunction, rootOnlyFunction } from "~/lib/middleware/auth-guard";

export const getGroups = createServerFn({ method: "GET" })
  .middleware([rootOnlyFunction])
    .handler(async () => {
    return await db.transaction(async (tx) => {
      const groups = await tx.select().from(saGroups);
      const result = [];

      for (const group of groups) {
        // Get flags for this group
        const flags = await tx
          .select({ flag: saGroupsFlags.flag })
          .from(saGroupsFlags)
          .where(eq(saGroupsFlags.groupId, group.id));

        // Get servers for this group
        const servers = await tx
          .select({
            serverId: saGroupsServers.serverId,
          })
          .from(saGroupsServers)
          .where(eq(saGroupsServers.groupId, group.id));

        result.push({
          id: group.id,
          name: group.name,
          immunity: group.immunity,
          created: new Date().toISOString(), // Placeholder since there's no created field in the schema
          flags: flags.map((f) => f.flag),
          serverIds: servers
            .map((s) => s.serverId)
            .filter((id): id is number => id !== null),
        });
      }

      return result;
    });
  });

type AddGroupRequest = {
  name: string;
  immunity: number;
  flags?: string[];
  serverIds?: number[];
};

export const addGroup = createServerFn({ method: "GET" })
  .middleware([rootOnlyFunction])
  .validator((data: AddGroupRequest) => data)
  .handler(async ({ data }) => {
    return await db.transaction(async (tx) => {
      // Insert the group
      const result = await tx
        .insert(saGroups)
        .values({
          name: data.name,
          immunity: data.immunity,
        })
        .$returningId();

      const groupId = result[0].id;

      // Insert flags if provided
      if (data.flags && data.flags.length > 0) {
        await tx.insert(saGroupsFlags).values(
          data.flags.map((flag) => ({
            groupId: groupId,
            flag,
          })),
        );
      }

      // Insert server assignments if provided
      if (data.serverIds && data.serverIds.length > 0) {
        await tx.insert(saGroupsServers).values(
          data.serverIds.map((serverId) => ({
            groupId: groupId,
            serverId,
          })),
        );
      }

      return groupId;
    });
  });

type EditGroupRequest = {
  id: number;
  name: string;
  immunity: number;
  flags?: string[];
  serverIds?: number[];
};

export const editGroup = createServerFn({ method: "GET" })
  .middleware([rootOnlyFunction])
  .validator((data: EditGroupRequest) => data)
  .handler(async ({ data }) => {
    return await db.transaction(async (tx) => {
      const groupExists = await tx
        .select({ id: saGroups.id })
        .from(saGroups)
        .where(eq(saGroups.id, data.id));

      if (groupExists.length === 0) {
        throw new Error(`Group with ID ${data.id} does not exist`);
      }

      // Update the group
      await tx
        .update(saGroups)
        .set({
          name: data.name,
          immunity: data.immunity,
        })
        .where(eq(saGroups.id, data.id));

      // Update flags if provided
      if (data.flags) {
        // Delete existing flags
        await tx.delete(saGroupsFlags).where(eq(saGroupsFlags.groupId, data.id));

        // Insert new flags
        if (data.flags.length > 0) {
          await tx.insert(saGroupsFlags).values(
            data.flags.map((flag) => ({
              groupId: data.id,
              flag,
            })),
          );
        }
      }

      // Update server assignments if provided
      if (data.serverIds) {
        // Delete existing server assignments
        await tx.delete(saGroupsServers).where(eq(saGroupsServers.groupId, data.id));

        // Insert new server assignments
        if (data.serverIds.length > 0) {
          await tx.insert(saGroupsServers).values(
            data.serverIds.map((serverId) => ({
              groupId: data.id,
              serverId,
            })),
          );
        }
      }

      return data.id;
    });
  });

export const deleteGroup = createServerFn({ method: "GET" })
  .middleware([rootOnlyFunction])
  .validator((data: { id: number }) => data)
  .handler(async ({ data }) => {
    return await db.transaction(async (tx) => {
      const groupExists = await tx
        .select({ id: saGroups.id })
        .from(saGroups)
        .where(eq(saGroups.id, data.id));

      if (groupExists.length === 0) {
        throw new Error(`Group with ID ${data.id} does not exist`);
      }

      // Delete flags
      await tx.delete(saGroupsFlags).where(eq(saGroupsFlags.groupId, data.id));

      // Delete server assignments
      await tx.delete(saGroupsServers).where(eq(saGroupsServers.groupId, data.id));

      // Delete the group
      await tx.delete(saGroups).where(eq(saGroups.id, data.id));

      return data.id;
    });
  });
