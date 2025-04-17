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
import { Textarea } from "~/lib/components/ui/textarea";
import { unbanPlayer } from "~/lib/functions/simple-admin/ban";
import { Ban } from "../../data/schema";

const UnbanFormSchema = z.object({
  reason: z.string().optional(),
});

type UnBanFormValues = z.infer<typeof UnbanFormSchema>;

interface SimpleAdminUnbanDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentBan: Ban;
}

export function SimpleAdminUnbanDialog({
  open,
  onOpenChange,
  currentBan,
}: SimpleAdminUnbanDialogProps) {
  const router = useRouter();

  const form = useForm<UnBanFormValues>({
    resolver: zodResolver(UnbanFormSchema),
    defaultValues: {
      reason: "",
    },
  });

  async function onSubmit(values: UnBanFormValues) {
    try {
      await unbanPlayer({
        data: {
          banId: currentBan.id,
          adminId: 0,
          reason: values.reason || "",
        },
      });
      toast.success("Unban successfully");
      router.invalidate({ sync: true });

      onOpenChange(false);
    } catch (error) {
      toast.error("Failed to add or update BAN");
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Unban</DialogTitle>
          <DialogDescription>
            Unban "{currentBan.player_name || currentBan.player_steamid}" ?
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-2">
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

            <DialogFooter className="pt-4">
              <Button variant="outline" onClick={() => onOpenChange(false)} type="button">
                Cancel
              </Button>
              <Button type="submit">Unban</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
