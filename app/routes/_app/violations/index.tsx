import { createFileRoute } from "@tanstack/react-router";
import { Violations } from "~/lib/features/violations";
import { getViolations } from "~/lib/functions/violations";

export const Route = createFileRoute("/_app/violations/")({
  beforeLoad: async () => {},
  loader: async ({ context }) => {
    const violations = await getViolations();
    return {
      violationsData: violations,
      user: context.user,
    };
  },
  component: ({ useLoaderData }) => {
    const { violationsData } = Route.useLoaderData();
    return <Violations data={violationsData} />;
  },
});
