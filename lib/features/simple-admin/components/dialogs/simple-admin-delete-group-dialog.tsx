import { useRouter } from "@tanstack/react-router";
import React from "react";
import { toast } from "sonner";
import { Button } from "~/lib/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/lib/components/ui/dialog";
import { deleteGroup } from "~/lib/functions/simple-admin/group";
import { useSimpleAdmin } from "../../context/simple-admin-context";
import { Group } from "../../data/schema";

interface SimpleAdminDeleteGroupDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentGroup: Group;
}

export function SimpleAdminDeleteGroupDialog({
  open,
  onOpenChange,
  currentGroup,
}: SimpleAdminDeleteGroupDialogProps): React.ReactNode {
  const { setActiveTab } = useSimpleAdmin();
  const router = useRouter();

  async function handleDelete() {
    try {
      await deleteGroup({
        data: {
          id: currentGroup.id,
        },
      });
      toast.success("Group deleted successfully");
      router.invalidate({ sync: true });
      onOpenChange(false);
      setActiveTab("groups");
    } catch (error) {
      toast.error("Failed to delete group");
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Delete Group</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete the group "{currentGroup.name}"?
          </DialogDescription>
        </DialogHeader>
        <DialogDescription className="text-destructive">
          This action cannot be undone. This will permanently delete the group and remove
          all associated permissions.
        </DialogDescription>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={handleDelete}>
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
