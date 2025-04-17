import {
  IconAlertTriangle,
  IconBan,
  IconCheck,
  IconClock,
  IconMicrophone,
  IconMicrophoneOff,
  IconShield,
  IconUserOff,
  IconVolumeOff,
} from "@tabler/icons-react";
import { BanStatus, MuteStatus, WarnStatus } from "./schema";

export const banStatusStyles = new Map<BanStatus, string>([
  [
    "ACTIVE",
    "bg-destructive/10 dark:bg-destructive/50 text-destructive dark:text-primary border-destructive/10",
  ],
  ["UNBANNED", "bg-teal-100/30 text-teal-900 dark:text-teal-200 border-teal-200"],
  ["EXPIRED", "bg-neutral-300/40 border-neutral-300"],
]);

export const muteStatusStyles = new Map<MuteStatus, string>([
  [
    "ACTIVE",
    "bg-destructive/10 dark:bg-destructive/50 text-destructive dark:text-primary border-destructive/10",
  ],
  ["UNMUTED", "bg-teal-100/30 text-teal-900 dark:text-teal-200 border-teal-200"],
  ["EXPIRED", "bg-neutral-300/40 border-neutral-300"],
]);

export const warnStatusStyles = new Map<WarnStatus, string>([
  ["ACTIVE", "bg-amber-100/30 text-amber-900 dark:text-amber-200 border-amber-200"],
  ["EXPIRED", "bg-neutral-300/40 border-neutral-300"],
]);

export const banStatusInfo = [
  {
    value: "ACTIVE",
    label: "active",
    description: "",
    icon: IconBan,
  },
  {
    value: "UNBANNED",
    label: "unbanned",
    description: "",
    icon: IconCheck,
  },
  {
    value: "EXPIRED",
    label: "expired",
    description: "",
    icon: IconClock,
  },
] as const;

export const muteTypeInfo = [
  {
    value: "GAG",
    label: "gag",
    description: "",
    icon: IconUserOff,
  },
  {
    value: "MUTE",
    label: "mute",
    description: "",
    icon: IconMicrophoneOff,
  },
  {
    value: "SILENCE",
    label: "full",
    description: "",
    icon: IconVolumeOff,
  },
] as const;

export const muteStatusInfo = [
  {
    value: "ACTIVE",
    label: "active",
    description: "",
    icon: IconMicrophoneOff,
  },
  {
    value: "UNMUTED",
    label: "unmuted",
    description: "",
    icon: IconMicrophone,
  },
  {
    value: "EXPIRED",
    label: "expired",
    description: "",
    icon: IconClock,
  },
] as const;

export const warnStatusInfo = [
  {
    value: "ACTIVE",
    label: "active",
    description: "",
    icon: IconAlertTriangle,
  },
  {
    value: "EXPIRED",
    label: "expired",
    description: "",
    icon: IconClock,
  },
] as const;

export const adminTypeInfo = [
  {
    value: "admin",
    label: "admin",
    description: "",
    icon: IconShield,
  },
  {
    value: "group",
    label: "group",
    description: "",
    icon: IconShield,
  },
] as const;

export function formatDuration(seconds: number): string {
  if (seconds === 0) {
    return "Permanent";
  }

  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const months = Math.floor(days / 30);
  const years = Math.floor(months / 12);

  if (years > 0) {
    return `${years} years`;
  } else if (months > 0) {
    return `${months} months`;
  } else if (days > 0) {
    return `${days} days`;
  } else if (hours > 0) {
    return `${hours} hours`;
  } else if (minutes > 0) {
    return `${minutes} minutes`;
  } else {
    return `${seconds} seconds`;
  }
}
