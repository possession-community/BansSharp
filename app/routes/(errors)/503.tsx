import { createFileRoute } from "@tanstack/react-router";
import MaintenanceError from "~/lib/features/errors/maintenance-error";

export const Route = createFileRoute("/(errors)/503")({
  component: MaintenanceError,
});
