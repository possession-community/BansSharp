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
import { getSteamPlayerName } from "~/lib/functions/simple-admin/steam";
import { addWarn, editWarn } from "~/lib/functions/simple-admin/warn";
import { useSimpleAdmin } from "../../context/simple-admin-context";
import { Warn } from "../../data/schema";

const warnFormSchema = z.object({
  playerName: z.string().nullable(),
  playerSteamid: z.string().min(1, "Require a valid SteamID"),
  reason: z.string().min(1, "Require a reason"),
  duration: z.coerce.number().int().min(1, "Duration must be a positive number"),
  serverId: z.coerce.number().nullable(),
});

type WarnFormValues = z.infer<typeof warnFormSchema>;

const durationOptions = [
  { value: 86400, label: "1 day" },
  { value: 259200, label: "3 days" },
  { value: 604800, label: "1 week" },
  { value: 1209600, label: "2 weeks" },
  { value: 2592000, label: "1 month" },
];

interface SimpleAdminWarnDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentWarn?: Warn;
}

export function SimpleAdminWarnDialog({
  open,
  onOpenChange,
  currentWarn,
}: SimpleAdminWarnDialogProps) {
  const { setActiveTab } = useSimpleAdmin();
  const isEdit = !!currentWarn;
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
  const form = useForm<WarnFormValues>({
    resolver: zodResolver(warnFormSchema),
    defaultValues: {
      playerName: currentWarn?.player_name || null,
      playerSteamid: currentWarn?.player_steamid || "",
      reason: currentWarn?.reason || "",
      duration: currentWarn?.duration || 86400,
      serverId: currentWarn?.server_id || null,
    },
  });

  async function onSubmit(values: WarnFormValues) {
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
      if (isEdit && currentWarn) {
        await editWarn({
          data: {
            id: currentWarn.id,
            playerName: name,
            playerSteamid: values.playerSteamid,
            reason: values.reason,
            duration: values.duration,
            serverId: values.serverId,
          },
        });
        toast.success("Updated WARN successfully");
        router.invalidate({ sync: true });
      } else {
        await addWarn({
          data: {
            playerName: name,
            playerSteamid: values.playerSteamid,
            adminSteamid: user?.steamId || "Console",
            adminName: user?.name || "Console",
            reason: values.reason,
            duration: values.duration,
            serverId: values.serverId,
          },
        });
        toast.success("Added WARN successfully");
        router.invalidate({ sync: true });
      }

      onOpenChange(false);
      setActiveTab("warns");
    } catch (error) {
      toast.error(
        `Failed to add or update WARN: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit WARN" : "New WARN"}</DialogTitle>
          <DialogDescription>
            {isEdit ? "Edit player's WARN" : "Add a new WARN for a player"}
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
              name="reason"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Reason</FormLabel>
                  <FormMessage />
                  <FormControl>
                    <Textarea placeholder="warn reason" {...field} />
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
