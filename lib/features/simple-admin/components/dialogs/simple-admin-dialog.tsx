import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "@tanstack/react-router";
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
import { addAdmin, editAdmin } from "~/lib/functions/simple-admin/admin";
import { getSteamPlayerName } from "~/lib/functions/simple-admin/steam";
import { useSimpleAdmin } from "../../context/simple-admin-context";
import { Admin } from "../../data/schema";

const adminFormSchema = z.object({
  playerName: z.string().nullable(),
  playerSteamid: z.string().min(1, "Require a valid SteamID"),
  flags: z.string().nullable(),
  immunity: z.coerce.number().int().min(0, "Immunity must be a positive number"),
  serverId: z.coerce.number().nullable(),
  groupId: z.coerce.number().nullable(),
  duration: z.coerce.number().int().min(0, "Duration must be a positive number"),
});

type AdminFormValues = z.infer<typeof adminFormSchema>;

const durationOptions = [
  { value: 0, label: "Permanent" },
  { value: 86400, label: "1 day" },
  { value: 604800, label: "1 week" },
  { value: 2592000, label: "1 month" },
  { value: 31536000, label: "1 year" },
];

interface SimpleAdminDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentAdmin?: Admin;
}

export function SimpleAdminDialog({
  open,
  onOpenChange,
  currentAdmin,
}: SimpleAdminDialogProps) {
  const { setActiveTab } = useSimpleAdmin();
  const isEdit = !!currentAdmin;
  const router = useRouter();

  const form = useForm<AdminFormValues>({
    resolver: zodResolver(adminFormSchema),
    defaultValues: {
      playerName: currentAdmin?.player_name || null,
      playerSteamid: currentAdmin?.player_steamid || "",
      flags: currentAdmin?.flags || null,
      immunity: currentAdmin?.immunity || 0,
      serverId: currentAdmin?.server_id || null,
      groupId: currentAdmin?.group_id || null,
      duration: currentAdmin
        ? currentAdmin.ends
          ? Math.floor(
              (new Date(currentAdmin.ends).getTime() -
                new Date(currentAdmin.created).getTime()) /
                1000,
            )
          : 0
        : 0,
    },
  });

  async function onSubmit(values: AdminFormValues) {
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
      if (isEdit && currentAdmin) {
        await editAdmin({
          data: {
            id: currentAdmin.id,
            playerName: name,
            playerSteamid: values.playerSteamid,
            flags: values.flags,
            immunity: values.immunity,
            serverId: values.serverId,
            groupId: values.groupId,
            duration: values.duration,
          },
        });
        toast.success("Updated admin successfully");
        router.invalidate({ sync: true });
      } else {
        await addAdmin({
          data: {
            playerName: name,
            playerSteamid: values.playerSteamid,
            flags: values.flags,
            immunity: values.immunity,
            serverId: values.serverId,
            groupId: values.groupId,
            duration: values.duration,
          },
        });
        toast.success("Added admin successfully");
        router.invalidate({ sync: true });
      }

      onOpenChange(false);
      setActiveTab("admins");
    } catch (error) {
      toast.error("Failed to add or update admin");
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit Admin" : "Add Admin"}</DialogTitle>
          <DialogDescription>
            {isEdit ? "Edit existing admin" : "Add a new admin"}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-2">
            <FormField
              control={form.control}
              name="playerName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Player Name (Optional)</FormLabel>
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
              name="flags"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Permission Flags (Optional,comma-separated)</FormLabel>
                  <FormMessage />
                  <FormControl>
                    <Input
                      placeholder="@css/f1,@css/f2..."
                      {...field}
                      value={field.value || ""}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="immunity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Immunity Level</FormLabel>
                  <FormMessage />
                  <FormControl>
                    <Input
                      type="number"
                      min={0}
                      max={100}
                      placeholder="0-100"
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="serverId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Server ID (Optional)</FormLabel>
                  <FormMessage />
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Server ID"
                      {...field}
                      value={field.value === null ? "" : field.value}
                      onChange={(e) => {
                        const value =
                          e.target.value === "" ? null : parseInt(e.target.value);
                        field.onChange(value);
                      }}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="groupId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Group ID (Optional)</FormLabel>
                  <FormMessage />
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Group ID"
                      {...field}
                      value={field.value === null ? "" : field.value}
                      onChange={(e) => {
                        const value =
                          e.target.value === "" ? null : parseInt(e.target.value);
                        field.onChange(value);
                      }}
                    />
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
