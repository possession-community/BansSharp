import { useQuery } from "@tanstack/react-query";
import { Server as ServerIcon, ShieldX } from "lucide-react";
import { Main } from "~/lib/components/layout/main";
import { Button } from "~/lib/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/lib/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/lib/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/lib/components/ui/tabs";
import {
  getServers,
  getTotalAdmins,
  getTotalServers,
  getTotalViolations,
} from "~/lib/functions/dashboard";
import { Overview } from "./components/overview";
import { RecentSales } from "./components/recent-violations";

export default function Dashboard() {
  // Fetch dashboard stats
  const { data: totalServers = 0 } = useQuery({
    queryKey: ["totalServers"],
    queryFn: () => getTotalServers(),
  });

  const { data: totalViolations = 0 } = useQuery({
    queryKey: ["totalViolations"],
    queryFn: () => getTotalViolations(),
  });

  const { data: totalAdmins = 0 } = useQuery({
    queryKey: ["totalAdmins"],
    queryFn: () => getTotalAdmins(),
  });

  // Fetch servers data
  const { data: servers = [] } = useQuery({
    queryKey: ["servers"],
    queryFn: () => getServers(),
  });

  return (
    <>
      {/* ===== Main ===== */}
      <Main>
        <div className="mb-2 flex items-center justify-between space-y-2">
          <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        </div>
        <Tabs orientation="vertical" defaultValue="overview" className="space-y-4">
          <div className="w-full overflow-x-auto pb-2">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="servers">Servers</TabsTrigger>
            </TabsList>
          </div>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-4">
            {/* Stats Cards */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {/* Total Servers Card */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Servers</CardTitle>
                  <ServerIcon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{totalServers}</div>
                  <p className="text-xs text-muted-foreground">Registered servers</p>
                </CardContent>
              </Card>

              {/* Total Violations Card */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Violations</CardTitle>
                  <ShieldX className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{totalViolations}</div>
                  <p className="text-xs text-muted-foreground">Bans / Muted</p>
                </CardContent>
              </Card>

              {/* Total Admins Card */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Admins</CardTitle>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    className="h-4 w-4 text-muted-foreground"
                  >
                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
                  </svg>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{totalAdmins}</div>
                  <p className="text-xs text-muted-foreground">Registered admins</p>
                </CardContent>
              </Card>
            </div>

            {/* Charts and Recent Violations */}
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-7">
              {/* Monthly Violations Chart */}
              <Card className="col-span-1 lg:col-span-4">
                <CardHeader>
                  <CardTitle>Monthly Violations</CardTitle>
                  <CardDescription>Number of bans and mutes per month</CardDescription>
                </CardHeader>
                <CardContent className="pl-2">
                  <Overview />
                </CardContent>
              </Card>

              {/* Recent Violations */}
              <Card className="col-span-1 lg:col-span-3">
                <CardHeader>
                  <CardTitle>Recent Violations</CardTitle>
                  <CardDescription>Latest player bans and mutes</CardDescription>
                </CardHeader>
                <CardContent>
                  <RecentSales />
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Servers Tab */}
          <TabsContent value="servers" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Servers</CardTitle>
                <CardDescription>List of all registered game servers</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Server Name</TableHead>
                        <TableHead>IP:Port</TableHead>
                        <TableHead>Map</TableHead>
                        <TableHead>Players</TableHead>
                        <TableHead className="text-center">Connect</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {servers.length > 0 ? (
                        servers.map((server) => (
                          <TableRow key={server.hostname}>
                            <TableCell>{server.hostname || "Unknown"}</TableCell>
                            <TableCell>{server.address}</TableCell>
                            <TableCell>{server.mapName || "Unknown"}</TableCell>
                            <TableCell>
                              {server.isOnline
                                ? `${server.playerCount !== null ? server.playerCount : 0} / ${server.maxPlayers || 0}`
                                : "Offline"}
                            </TableCell>
                            <TableCell className="text-center">
                              <Button
                                variant="outline"
                                size="sm"
                                disabled={!server.isOnline}
                              >
                                <a
                                  href={
                                    server.isOnline
                                      ? `steam://connect/${server.address}`
                                      : "#"
                                  }
                                  className={
                                    !server.isOnline
                                      ? "pointer-events-none opacity-50"
                                      : ""
                                  }
                                >
                                  Connect
                                </a>
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={5} className="h-24 text-center">
                            No servers found.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </Main>
    </>
  );
}
