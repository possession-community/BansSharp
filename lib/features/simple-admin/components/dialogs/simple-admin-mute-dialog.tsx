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
import { addMute, editMute } from "~/lib/functions/simple-admin/mute";
import { getSteamPlayerName } from "~/lib/functions/simple-admin/steam";
import { useSimpleAdmin } from "../../context/simple-admin-context";
import { Mute, MuteType } from "../../data/schema";

const muteFormSchema = z.object({
  playerName: z.string().nullable(),
  playerSteamid: z.string().min(1, "Require a valid SteamID"),
  reason: z.string().min(1, "Require a reason"),
  duration: z.coerce.number().int().min(0, "Duration must be a positive number"),
  type: z.enum(["GAG", "MUTE", "SILENCE"]),
  serverId: z.coerce.number().nullable(),
});

type MuteFormValues = z.infer<typeof muteFormSchema>;

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

const muteTypeOptions = [
  { value: "GAG", label: "Gag (Chat)" },
  { value: "MUTE", label: "Mute (Voice)" },
  { value: "SILENCE", label: "Silence (Chat & Voice)" },
];

interface SimpleAdminMuteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentMute?: Mute;
}

export function SimpleAdminMuteDialog({
  open,
  onOpenChange,
  currentMute,
}: SimpleAdminMuteDialogProps) {
  const { setActiveTab } = useSimpleAdmin();
  const isEdit = !!currentMute;
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

  const form = useForm<MuteFormValues>({
    resolver: zodResolver(muteFormSchema),
    defaultValues: {
      playerName: currentMute?.player_name || null,
      playerSteamid: currentMute?.player_steamid || "",
      reason: currentMute?.reason || "",
      duration: currentMute?.duration || 0,
      type: (currentMute?.type as MuteType) || "GAG",
      serverId: currentMute?.server_id || null,
    },
  });

  async function onSubmit(values: MuteFormValues) {
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
      if (isEdit && currentMute) {
        await editMute({
          data: {
            id: currentMute.id,
            playerName: name,
            playerSteamid: values.playerSteamid,
            reason: values.reason,
            duration: values.duration,
            type: values.type,
            serverId: values.serverId,
          },
        });
        toast.success("Updated MUTE successfully");
        router.invalidate({ sync: true });
      } else {
        await addMute({
          data: {
            playerName: name,
            playerSteamid: values.playerSteamid,
            adminSteamid: user?.steamId || "Console",
            adminName: user?.name || "Console",
            reason: values.reason,
            duration: values.duration,
            type: values.type,
            serverId: values.serverId,
          },
        });
        toast.success("Added MUTE successfully");
        router.invalidate({ sync: true });
      }

      onOpenChange(false);
      setActiveTab("mutes");
    } catch (error) {
      toast.error(
        `Failed to add or update MUTE: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit MUTE" : "New MUTE"}</DialogTitle>
          <DialogDescription>
            {isEdit ? "Edit player's MUTE" : "Add a new MUTE for a player"}
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
                    <Textarea placeholder="mute reason" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mute Type</FormLabel>
                  <FormMessage />
                  <Select
                    onValueChange={(value) => field.onChange(value as MuteType)}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select mute type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {muteTypeOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
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
