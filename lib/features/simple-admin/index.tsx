import { getRouteApi } from "@tanstack/react-router";
import { AlertTriangle, Ban, ShieldAlert, Volume2 } from "lucide-react";
import { Main } from "~/lib/components/layout/main";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/lib/components/ui/tabs";
import { SimpleAdminDialogs } from "./components/simple-admin-dialogs";
import { SimpleAdminPrimaryButtons } from "./components/simple-admin-primary-buttons";
import { SimpleAdminTable } from "./components/simple-admin-table";
import { SimpleAdminProvider, useSimpleAdmin } from "./context/simple-admin-context";

function SimpleAdminContent() {
  const { activeTab, setActiveTab } = useSimpleAdmin();
  const routeApi = getRouteApi("/_app/(admin)/simple-admin");
  const { user } = routeApi.useLoaderData();
  const isAdmin = user?.role === "root";

  /*
  React.useEffect(() => {
    if (!isAdmin && activeTab === "admins") {
      setActiveTab("bans");
    }
  }, [isAdmin, activeTab, setActiveTab]);
  */

  return (
    <>
      <Main>
        <div className="mb-2 flex flex-wrap items-center justify-between space-y-2">
          <div className="flex items-center">
            <h2 className="text-1xl font-bold tracking-tight">SimpleAdmin</h2>
          </div>
          <SimpleAdminPrimaryButtons />
        </div>

        <Tabs
          defaultValue="bans"
          value={activeTab}
          onValueChange={(value) => setActiveTab(value as any)}
          className="w-full"
        >
          <TabsList className="mb-4">
            <TabsTrigger value="bans" className="flex items-center">
              <Ban className="mr-2 h-4 w-4" />
              BAN
            </TabsTrigger>
            <TabsTrigger value="mutes" className="flex items-center">
              <Volume2 className="mr-2 h-4 w-4" />
              Mute
            </TabsTrigger>
            <TabsTrigger value="warns" className="flex items-center">
              <AlertTriangle className="mr-2 h-4 w-4" />
              Warn
            </TabsTrigger>
            {isAdmin && (
              <TabsTrigger value="admins" className="flex items-center">
                <ShieldAlert className="mr-2 h-4 w-4" />
                Admin
              </TabsTrigger>
            )}
          </TabsList>

          <TabsContent value={activeTab} className="mt-0">
            <div className="-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-x-12 lg:space-y-0">
              <SimpleAdminTable whichTable="" />
            </div>
          </TabsContent>
        </Tabs>
      </Main>

      <SimpleAdminDialogs />
    </>
  );
}

export default function SimpleAdmin() {
  return (
    <SimpleAdminProvider>
      <SimpleAdminContent />
    </SimpleAdminProvider>
  );
}
