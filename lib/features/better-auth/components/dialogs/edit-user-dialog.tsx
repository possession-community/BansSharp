import { zodResolver } from "@hookform/resolvers/zod";
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
  FormDescription,
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
import { Switch } from "~/lib/components/ui/switch";
import { Textarea } from "~/lib/components/ui/textarea";
import { editUser } from "~/lib/functions/better-auth/users";
import { useUserTable } from "../../context/user-table-context";
import { useRouter } from "@tanstack/react-router";

const formSchema = z.object({
  role: z.string().nullable(),
  banned: z.boolean().nullable(),
  banReason: z.string().nullable(),
  banExpires: z.string().nullable(),
});

export function EditUserDialog() {
  const { currentUser, dialogOpen, setDialogOpen, refreshUsers } = useUserTable();
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      role: currentUser?.role || null,
      banned: currentUser?.banned || false,
      banReason: currentUser?.banReason || null,
      banExpires: currentUser?.banExpires || null,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!currentUser) return;

    try {
      // Create a data object with only the fields that have changed
      const data = {
        id: currentUser.id,
        name: currentUser.name,
        email: currentUser.email,
        role: values.role !== currentUser.role ? values.role : currentUser.role,
        banned: values.banned !== currentUser.banned ? values.banned : currentUser.banned,
        banReason:
          values.banned && values.banReason !== currentUser.banReason
            ? values.banReason
            : currentUser.banReason,
        banExpires:
          values.banned && values.banExpires !== currentUser.banExpires
            ? values.banExpires
            : currentUser.banExpires,
      };

      await editUser({
        data,
      });

      toast.success("The user has been updated successfully.");

      setDialogOpen(null);
      router.invalidate({ sync: true });
      refreshUsers();
    } catch (error) {
      toast.error("Failed to update user. Please try again.");
    }
  }

  return (
    <Dialog
      open={dialogOpen === "edit-user"}
      onOpenChange={(open) => !open && setDialogOpen(null)}
    >
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit User</DialogTitle>
          <DialogDescription>Update user information and permissions.</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Role</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value || undefined}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a role" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="user">User</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="root">Root</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>User role determines permissions.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="banned"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Banned</FormLabel>
                    <FormDescription>
                      Ban this user from accessing the system.
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value || false}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            {form.watch("banned") && (
              <>
                <FormField
                  control={form.control}
                  name="banReason"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ban Reason</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Reason for banning this user"
                          className="resize-none"
                          {...field}
                          value={field.value || ""}
                          onChange={(e) => field.onChange(e.target.value)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="banExpires"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ban Expires</FormLabel>
                      <FormControl>
                        <Input
                          type="datetime-local"
                          {...field}
                          value={field.value || ""}
                          onChange={(e) => field.onChange(e.target.value)}
                        />
                      </FormControl>
                      <FormDescription>Leave empty for permanent ban.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}
            <DialogFooter>
              <Button type="submit">Save changes</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
