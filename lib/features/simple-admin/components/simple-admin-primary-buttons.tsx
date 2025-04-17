"use no memo";

import { AlertTriangle, Ban, ShieldPlus, Users, VolumeX } from "lucide-react";
import { Button } from "~/lib/components/ui/button";
import { useSimpleAdmin } from "../context/simple-admin-context";

export function SimpleAdminPrimaryButtons() {
  const { activeTab, setOpen } = useSimpleAdmin();

  const renderButton = () => {
    switch (activeTab) {
      case "bans":
        return (
          <Button
            onClick={() => {
              setOpen("add-ban");
            }}
          >
            <Ban className="mr-2 h-4 w-4" />
            Add Ban
          </Button>
        );
      case "mutes":
        return (
          <Button onClick={() => setOpen("add-mute")}>
            <VolumeX className="mr-2 h-4 w-4" />
            Add Mute
          </Button>
        );
      case "warns":
        return (
          <Button onClick={() => setOpen("add-warn")}>
            <AlertTriangle className="mr-2 h-4 w-4" />
            Add Warn
          </Button>
        );
      case "admins":
        return (
          <Button onClick={() => setOpen("add-admin")}>
            <ShieldPlus className="mr-2 h-4 w-4" />
            Add Admin
          </Button>
        );
      case "groups":
        return (
          <Button onClick={() => setOpen("add-group")}>
            <Users className="mr-2 h-4 w-4" />
            Add Group
          </Button>
        );
      default:
        return null;
    }
  };

  return <div className="flex items-center gap-2">{renderButton()}</div>;
}
