import { faker } from "@faker-js/faker";
import { Admin, Ban, Group, Mute, Warn } from "./schema";

function generateSteamID(): string {
  return `76561198#########0:${faker.number.int({ min: 0, max: 1 })}:${faker.number.int({ min: 10000000, max: 99999999 })}`;
}

export const bans: Ban[] = Array.from({ length: 15 }, (_, index) => {
  const duration = faker.helpers.arrayElement([
    0, 3600, 86400, 604800, 2592000, 31536000,
  ]);
  const created = faker.date.past().toISOString();
  const ends =
    duration === 0
      ? null
      : new Date(new Date(created).getTime() + duration * 1000).toISOString();
  const status = faker.helpers.arrayElement(["ACTIVE", "UNBANNED", "EXPIRED"] as const);

  return {
    id: index + 1,
    player_name: faker.internet.userName(),
    player_steamid: generateSteamID(),
    player_ip: faker.internet.ipv4(),
    admin_steamid: generateSteamID(),
    admin_name: faker.internet.userName(),
    reason: faker.helpers.arrayElement([
      "Cheating",
      "Spamming",
      "Trolling",
      "Griefing",
      "Others",
    ]),
    duration,
    ends,
    created,
    server_id: faker.number.int({ min: 1, max: 5 }),
    unban_id: status === "UNBANNED" ? faker.number.int({ min: 1, max: 10 }) : null,
    status,
  };
});

export const mutes: Mute[] = Array.from({ length: 15 }, (_, index) => {
  const duration = faker.helpers.arrayElement([0, 3600, 86400, 604800, 2592000]);
  const created = faker.date.past().toISOString();
  const ends =
    duration === 0
      ? null
      : new Date(new Date(created).getTime() + duration * 1000).toISOString();
  const status = faker.helpers.arrayElement(["ACTIVE", "UNMUTED", "EXPIRED"] as const);

  return {
    id: index + 1,
    player_name: faker.internet.userName(),
    player_steamid: generateSteamID(),
    admin_steamid: generateSteamID(),
    admin_name: faker.internet.userName(),
    reason: faker.helpers.arrayElement([
      "Spamming",
      "Louder music",
      "Bad words",
      "Others",
    ]),
    duration,
    passed: faker.number.int({ min: 0, max: duration }),
    ends,
    created,
    type: faker.helpers.arrayElement(["GAG", "MUTE", "SILENCE"] as const),
    server_id: faker.number.int({ min: 1, max: 5 }),
    unmute_id: status === "UNMUTED" ? faker.number.int({ min: 1, max: 10 }) : null,
    status,
  };
});

export const warns: Warn[] = Array.from({ length: 15 }, (_, index) => {
  const duration = faker.helpers.arrayElement([86400, 604800, 2592000]);
  const created = faker.date.past().toISOString();
  const ends = new Date(new Date(created).getTime() + duration * 1000).toISOString();
  const status = faker.helpers.arrayElement(["ACTIVE", "EXPIRED"] as const);

  return {
    id: index + 1,
    player_name: faker.internet.userName(),
    player_steamid: generateSteamID(),
    admin_steamid: generateSteamID(),
    admin_name: faker.internet.userName(),
    reason: faker.helpers.arrayElement(["Trool", "Spam", "Others"]),
    duration,
    ends,
    created,
    server_id: faker.number.int({ min: 1, max: 5 }),
    status,
  };
});

export const admins: Admin[] = Array.from({ length: 10 }, (_, index) => {
  const duration = faker.helpers.arrayElement([0, 2592000, 31536000]);
  const created = faker.date.past().toISOString();
  const ends =
    duration === 0
      ? null
      : new Date(new Date(created).getTime() + duration * 1000).toISOString();

  return {
    id: index + 1,
    player_name: faker.internet.userName(),
    player_steamid: generateSteamID(),
    flags: faker.helpers.arrayElement(["a", "b", "c", "d", "z"]),
    immunity: faker.number.int({ min: 0, max: 100 }),
    server_id: faker.helpers.arrayElement([null, 1, 2, 3, 4, 5]),
    ends,
    created,
    group_id: faker.helpers.arrayElement([null, 1, 2, 3]),
  };
});

export const groups: Group[] = Array.from({ length: 5 }, (_, index) => {
  return {
    id: index + 1,
    name: faker.helpers.arrayElement([
      "Administrator",
      "Moderator",
      "VIP",
      "Helper",
      "Developer",
      "Owner",
      "Supporter",
    ]),
    immunity: faker.number.int({ min: 0, max: 100 }),
    created: faker.date.past().toISOString(),
  };
});
