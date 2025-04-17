import { createFileRoute } from "@tanstack/react-router";
import BadRequestError from "~/lib/features/errors/bad-request-error";

export const Route = createFileRoute("/(errors)/400")({
  component: BadRequestError,
});
