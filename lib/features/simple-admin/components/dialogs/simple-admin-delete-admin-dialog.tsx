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
import { deleteAdmin } from "~/lib/functions/simple-admin/admin";
import { useSimpleAdmin } from "../../context/simple-admin-context";
import { Admin } from "../../data/schema";

interface SimpleAdminDeleteAdminDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentAdmin: Admin;
}

export function SimpleAdminDeleteAdminDialog({
  open,
  onOpenChange,
  currentAdmin,
}: SimpleAdminDeleteAdminDialogProps): React.ReactNode {
  const { setActiveTab } = useSimpleAdmin();
  const router = useRouter();

  async function handleDelete() {
    try {
      await deleteAdmin({
        data: {
          id: currentAdmin.id,
        },
      });
      toast.success("Admin deleted successfully");
      router.invalidate({ sync: true });
      onOpenChange(false);
      setActiveTab("admins");
    } catch (error) {
      toast.error("Failed to delete admin");
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Delete Admin</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete the admin "
            {currentAdmin.player_name || currentAdmin.player_steamid}"?
          </DialogDescription>
        </DialogHeader>
        <DialogDescription className="text-destructive">
          This action cannot be undone. This will permanently delete the admin and update
          all related records.
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
