import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "~/lib/components/ui/button";
import { Checkbox } from "~/lib/components/ui/checkbox";
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
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/lib/components/ui/form";
import { Input } from "~/lib/components/ui/input";
import { ScrollArea } from "~/lib/components/ui/scroll-area";
import { getServers } from "~/lib/functions/simple-admin/admin";
import { addGroup, editGroup } from "~/lib/functions/simple-admin/group";
import { useSimpleAdmin } from "../../context/simple-admin-context";
import { Group } from "../../data/schema";

const groupFormSchema = z.object({
  name: z.string().min(1, "Group name is required"),
  immunity: z.coerce.number().int().min(0, "Immunity must be a positive number"),
  flags: z.string().nullable(),
  serverIds: z.array(z.number()).optional(),
});

type GroupFormValues = z.infer<typeof groupFormSchema>;

interface SimpleAdminGroupDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentGroup?: Group;
}

export function SimpleAdminGroupDialog({
  open,
  onOpenChange,
  currentGroup,
}: SimpleAdminGroupDialogProps) {
  const { setActiveTab } = useSimpleAdmin();
  const isEdit = !!currentGroup;
  const router = useRouter();
  const [servers, setServers] = useState<{ id: number | null; hostname: string }[]>([]);

  // Available flags for selection
  const availableFlags = [
    { value: "a", label: "Reserved slot access" },
    { value: "b", label: "Generic admin" },
    { value: "c", label: "Kick players" },
    { value: "d", label: "Ban players" },
    { value: "e", label: "Unban players" },
    { value: "f", label: "Slay players" },
    { value: "g", label: "Change map" },
    { value: "h", label: "Change cvars" },
    { value: "i", label: "Execute configs" },
    { value: "j", label: "Special chat privileges" },
    { value: "k", label: "Start votes" },
    { value: "l", label: "Set password" },
    { value: "m", label: "RCON commands" },
    { value: "n", label: "Enable cheats" },
    { value: "o", label: "Custom flag 1" },
    { value: "p", label: "Custom flag 2" },
    { value: "q", label: "Custom flag 3" },
    { value: "r", label: "Custom flag 4" },
    { value: "s", label: "Custom flag 5" },
    { value: "t", label: "Custom flag 6" },
    { value: "z", label: "Root access" },
  ];

  // Fetch servers
  useEffect(() => {
    const fetchServers = async () => {
      try {
        const serverList = await getServers();
        setServers(serverList);
      } catch (error) {
        toast.error("Failed to fetch servers");
      }
    };

    fetchServers();
  }, []);

  const formatFlags = (flags: string[] | undefined): string | null => {
    if (!flags || flags.length === 0) return null;
    return flags.join(",");
  };

  const form = useForm<GroupFormValues>({
    resolver: zodResolver(groupFormSchema),
    defaultValues: {
      name: currentGroup?.name || "",
      immunity: currentGroup?.immunity || 0,
      flags: currentGroup?.flags ? formatFlags(currentGroup.flags) : null,
      serverIds: currentGroup?.serverIds || [],
    },
  });

  async function onSubmit(values: GroupFormValues) {
    try {
      const flagsArray = values.flags ? values.flags.split(",").map(f => f.trim()).filter(Boolean) : [];
      
      if (isEdit && currentGroup) {
        await editGroup({
          data: {
            id: currentGroup.id,
            name: values.name,
            immunity: values.immunity,
            flags: flagsArray,
            serverIds: values.serverIds || [],
          },
        });
        toast.success("Updated group successfully");
        router.invalidate({ sync: true });
      } else {
        await addGroup({
          data: {
            name: values.name,
            immunity: values.immunity,
            flags: flagsArray,
            serverIds: values.serverIds || [],
          },
        });
        toast.success("Added group successfully");
        router.invalidate({ sync: true });
      }

      onOpenChange(false);
      setActiveTab("groups");
    } catch (error) {
      toast.error("Failed to add or update group");
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit Group" : "Add Group"}</DialogTitle>
          <DialogDescription>
            {isEdit ? "Edit existing group" : "Add a new group"}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-2">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Group Name</FormLabel>
                  <FormMessage />
                  <FormControl>
                    <Input placeholder="Group name" {...field} />
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
              name="flags"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Permission Flags (Optional, comma-separated)</FormLabel>
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
              name="serverIds"
              render={() => (
                <FormItem>
                  <FormLabel>Servers</FormLabel>
                  <FormDescription>
                    Select the servers this group will have access to
                  </FormDescription>
                  <ScrollArea className="h-[200px] rounded-md border p-4">
                    <div className="grid grid-cols-1 gap-2">
                      {servers
                        .filter((server) => server.id !== null) // Filter out the "ALL" option
                        .map((server) => (
                          <FormField
                            key={server.id}
                            control={form.control}
                            name="serverIds"
                            render={({ field }) => {
                              return (
                                <FormItem
                                  key={server.id}
                                  className="flex flex-row items-start space-x-3 space-y-0"
                                >
                                  <FormControl>
                                    <Checkbox
                                      checked={field.value?.includes(server.id as number)}
                                      onCheckedChange={(checked) => {
                                        const currentServers = field.value || [];
                                        return checked
                                          ? field.onChange([...currentServers, server.id])
                                          : field.onChange(
                                              currentServers.filter(
                                                (id) => id !== server.id,
                                              ),
                                            );
                                      }}
                                    />
                                  </FormControl>
                                  <FormLabel className="font-normal">
                                    {server.hostname}
                                  </FormLabel>
                                </FormItem>
                              );
                            }}
                          />
                        ))}
                    </div>
                  </ScrollArea>
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
