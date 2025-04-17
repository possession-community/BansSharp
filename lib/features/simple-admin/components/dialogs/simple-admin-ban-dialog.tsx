import { zodResolver } from "@hookform/resolvers/zod";
import { getRouteApi, useRouter } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "~/lib/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/lib/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/lib/components/ui/form";
import { Input } from "~/lib/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/lib/components/ui/select";
import { Textarea } from "~/lib/components/ui/textarea";
import { getServers } from "~/lib/functions/simple-admin/admin";
import { addBan, editBan } from "~/lib/functions/simple-admin/ban";
import { getSteamPlayerName } from "~/lib/functions/simple-admin/steam";
import { useSimpleAdmin } from "../../context/simple-admin-context";
import { Ban } from "../../data/schema";

const banFormSchema = z.object({
  playerName: z.string().nullable(),
  playerSteamid: z.string().min(1, "Require a valid SteamID"),
  playerIp: z.string().nullable(),
  reason: z.string().min(1, "Require a reason"),
  duration: z.coerce.number().int().min(0, "Duration must be a positive number"),
  serverId: z.coerce.number().nullable(),
});

type BanFormValues = z.infer<typeof banFormSchema>;

const durationOptions = [
  { value: 0, label: "Permenent" },
  { value: 1800, label: "30 mins" },
  { value: 3600, label: "1 hours" },
  { value: 10800, label: "3 hours" },
  { value: 21600, label: "6 hours" },
  { value: 43200, label: "12 hours" },
  { value: 86400, label: "1 days" },
  { value: 259200, label: "3 days" },
  { value: 604800, label: "1 week" },
  { value: 2592000, label: "1 month" },
  { value: 31536000, label: "1 year" },
];

interface SimpleAdminBanDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentBan?: Ban;
}

export function SimpleAdminBanDialog({
  open,
  onOpenChange,
  currentBan,
}: SimpleAdminBanDialogProps) {
  const { setActiveTab } = useSimpleAdmin();
  const isEdit = !!currentBan;
  const router = useRouter();
  const routeApi = getRouteApi("/_app/(admin)/simple-admin");
  const { user } = routeApi.useLoaderData();
  const [serverOptions, setServerOptions] = useState<
    { value: number | null; label: string }[]
  >([]);

  useEffect(() => {
    const fetchServers = async () => {
      try {
        const servers = await getServers({});
        setServerOptions(
          servers.map((server) => ({
            value: server.id,
            label: server.hostname,
          })),
        );
      } catch (error) {
        console.error("Failed to fetch servers:", error);
        toast.error("Failed to load servers");
      }
    };

    fetchServers();
  }, []);

  const form = useForm<BanFormValues>({
    resolver: zodResolver(banFormSchema),
    defaultValues: {
      playerName: currentBan?.player_name || null,
      playerSteamid: currentBan?.player_steamid || "",
      playerIp: currentBan?.player_ip || "",
      reason: currentBan?.reason || "",
      duration: currentBan?.duration || 0,
      serverId: currentBan?.server_id || null,
    },
  });

  async function onSubmit(values: BanFormValues) {
    try {
      let name;
      try {
        name = !values.playerName
          ? await getSteamPlayerName({ data: values.playerSteamid })
          : values.playerName;
        name = name || "Unknown";
      } catch (error) {
        name = "Unknown";
      }
      if (isEdit && currentBan) {
        await editBan({
          data: {
            id: currentBan.id,
            playerName: name,
            playerSteamid: values.playerSteamid,
            playerIp: values.playerIp,
            reason: values.reason,
            duration: values.duration,
            serverId: values.serverId,
          },
        });
        toast.success("Updated BAN successfully");
        router.invalidate({ sync: true });
      } else {
        await addBan({
          data: {
            playerName: name,
            playerSteamid: values.playerSteamid,
            playerIp: values.playerIp,
            adminSteamid: user?.steamId || "Console",
            adminName: user?.name || "Console",
            reason: values.reason,
            duration: values.duration,
            serverId: values.serverId,
          },
        });
        toast.success("Added BAN successfully");
        router.invalidate({ sync: true });
      }

      onOpenChange(false);
      setActiveTab("bans");
    } catch (error) {
      toast.error(
        `Failed to add or update BAN: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit BAN" : "New BAN"}</DialogTitle>
          <DialogDescription>
            {isEdit ? "Edit player's BAN" : "Add a new BAN for a player"}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-2">
            <FormField
              control={form.control}
              name="playerName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Player(Optional)</FormLabel>
                  <FormMessage />
                  <FormControl>
                    <Input
                      placeholder="Player name"
                      {...field}
                      value={field.value || ""}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="playerSteamid"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>SteamID</FormLabel>
                  <FormMessage />
                  <FormControl>
                    <Input placeholder="76561198#########" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="playerIp"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>IP Address(Optional)</FormLabel>
                  <FormMessage />
                  <FormControl>
                    <Input
                      placeholder="xxx.xxx.xxx.xxx"
                      {...field}
                      value={field.value || ""}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="reason"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Reason</FormLabel>
                  <FormMessage />
                  <FormControl>
                    <Textarea placeholder="ban reason" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="duration"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Duration</FormLabel>
                  <FormMessage />
                  <Select
                    onValueChange={(value) => field.onChange(parseInt(value))}
                    defaultValue={field.value.toString()}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select duration" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {durationOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value.toString()}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="serverId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Server</FormLabel>
                  <FormMessage />
                  <Select
                    onValueChange={(value) =>
                      field.onChange(value === "null" ? null : parseInt(value))
                    }
                    defaultValue={field.value === null ? "null" : field.value.toString()}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select server" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {serverOptions.map((option) => (
                        <SelectItem
                          key={option.value === null ? "null" : option.value.toString()}
                          value={option.value === null ? "null" : option.value.toString()}
                        >
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />

            <DialogFooter className="pt-4">
              <Button variant="outline" onClick={() => onOpenChange(false)} type="button">
                Cancel
              </Button>
              <Button type="submit">{isEdit ? "Edit" : "Add"}</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
