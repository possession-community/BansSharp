import { createFileRoute, redirect } from "@tanstack/react-router";
import SettingsAccount from "~/lib/features/settings/account";

export const Route = createFileRoute("/_app/(admin)/settings/")({
  component: SettingsAccount,
});
