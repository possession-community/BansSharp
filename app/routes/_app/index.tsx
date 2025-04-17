import { createFileRoute } from "@tanstack/react-router";
import Dashboard from "~/lib/features/dashboard";

export const Route = createFileRoute("/_app/")({
  component: Dashboard,
});
