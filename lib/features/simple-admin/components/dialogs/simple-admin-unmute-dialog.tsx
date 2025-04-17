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
import { unmutePlayer } from "~/lib/functions/simple-admin/mute";
import { Mute } from "../../data/schema";

const UnmuteFormSchema = z.object({
  reason: z.string().optional(),
});

type UnmuteFormValues = z.infer<typeof UnmuteFormSchema>;

interface SimpleAdminUnmuteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentMute: Mute;
}

export function SimpleAdminUnmuteDialog({
  open,
  onOpenChange,
  currentMute,
}: SimpleAdminUnmuteDialogProps) {
  const router = useRouter();

  const form = useForm<UnmuteFormValues>({
    resolver: zodResolver(UnmuteFormSchema),
    defaultValues: {
      reason: "",
    },
  });

  async function onSubmit(values: UnmuteFormValues) {
    try {
      await unmutePlayer({
        data: {
          muteId: currentMute.id,
          adminId: 0,
          reason: values.reason || "",
        },
      });
      toast.success("Unmute successfully");
      router.invalidate({ sync: true });

      onOpenChange(false);
    } catch (error) {
      toast.error("Failed to unmute player");
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Unmute</DialogTitle>
          <DialogDescription>
            Unmute "{currentMute.player_name || currentMute.player_steamid}" ?
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
                    <Textarea placeholder="unmute reason" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />

            <DialogFooter className="pt-4">
              <Button variant="outline" onClick={() => onOpenChange(false)} type="button">
                Cancel
              </Button>
              <Button type="submit">Unmute</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
