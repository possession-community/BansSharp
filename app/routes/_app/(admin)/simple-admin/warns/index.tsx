import { createFileRoute } from "@tanstack/react-router";
import { AlertTriangle } from "lucide-react";
import { Main } from "~/lib/components/layout/main";
import { SimpleAdminDialogs } from "~/lib/features/simple-admin/components/simple-admin-dialogs";
import { SimpleAdminPrimaryButtons } from "~/lib/features/simple-admin/components/simple-admin-primary-buttons";
import { SimpleAdminTable } from "~/lib/features/simple-admin/components/simple-admin-table";
import { SimpleAdminProvider } from "~/lib/features/simple-admin/context/simple-admin-context";
import { getWarns } from "~/lib/functions/simple-admin/warn";

function WarnsContent() {
  return (
    <>
      <Main>
        <div className="mb-2 flex flex-wrap items-center justify-between space-y-2">
          <div className="flex items-center">
            <AlertTriangle className="mr-2 h-5 w-5" />
            <h2 className="text-1xl font-bold tracking-tight">Warns</h2>
          </div>
          <SimpleAdminPrimaryButtons />
        </div>

        <div className="-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-x-12 lg:space-y-0">
          <SimpleAdminTable whichTable="warns" />
        </div>
      </Main>

      <SimpleAdminDialogs />
    </>
  );
}

export const Route = createFileRoute("/_app/(admin)/simple-admin/warns/")({
  beforeLoad: async () => {},
  loader: async ({ context }) => {
    const warns = await getWarns();
    return {
      warnsData: warns,
      user: context.user,
    };
  },
  component: () => (
    <SimpleAdminProvider initialTab="warns">
      <WarnsContent />
    </SimpleAdminProvider>
  ),
});
