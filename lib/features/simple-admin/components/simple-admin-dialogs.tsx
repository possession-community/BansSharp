"use no memo";

import { useSimpleAdmin } from "../context/simple-admin-context";
import { SimpleAdminBanDialog } from "./dialogs/simple-admin-ban-dialog";
import { SimpleAdminDeleteAdminDialog } from "./dialogs/simple-admin-delete-admin-dialog";
import { SimpleAdminDeleteGroupDialog } from "./dialogs/simple-admin-delete-group-dialog";
import { SimpleAdminDialog } from "./dialogs/simple-admin-dialog";
import { SimpleAdminGroupDialog } from "./dialogs/simple-admin-group-dialog";
import { SimpleAdminMuteDialog } from "./dialogs/simple-admin-mute-dialog";
import { SimpleAdminUnbanDialog } from "./dialogs/simple-admin-unban-dialog";
import { SimpleAdminUnmuteDialog } from "./dialogs/simple-admin-unmute-dialog";
import { SimpleAdminWarnDialog } from "./dialogs/simple-admin-warn-dialog";

export function SimpleAdminDialogs() {
  const {
    open,
    setOpen,
    currentBan,
    setCurrentBan,
    currentMute,
    setCurrentMute,
    currentWarn,
    setCurrentWarn,
    currentAdmin,
    setCurrentAdmin,
    currentGroup,
    setCurrentGroup,
  } = useSimpleAdmin();

  return (
    <>
      <SimpleAdminBanDialog
        key="add-ban"
        open={open === "add-ban"}
        onOpenChange={() => {
          setOpen(null);
        }}
      />

      {currentBan && (
        <>
          <SimpleAdminBanDialog
            key={`edit-ban-${currentBan.id}`}
            open={open === "edit-ban"}
            onOpenChange={() => {
              setOpen(null);
              setTimeout(() => {
                setCurrentBan(null);
              }, 300);
            }}
            currentBan={currentBan}
          />

          <SimpleAdminUnbanDialog
            key={`unban-${currentBan.id}`}
            open={open === "unban"}
            onOpenChange={() => {
              setOpen(null);
              setTimeout(() => {
                setCurrentBan(null);
              }, 300);
            }}
            currentBan={currentBan}
          />
        </>
      )}

      <SimpleAdminMuteDialog
        key="add-mute"
        open={open === "add-mute"}
        onOpenChange={() => {
          setOpen(null);
        }}
      />

      {currentMute && (
        <>
          <SimpleAdminMuteDialog
            key={`edit-mute-${currentMute.id}`}
            open={open === "edit-mute"}
            onOpenChange={() => {
              setOpen(null);
              setTimeout(() => {
                setCurrentMute(null);
              }, 300);
            }}
            currentMute={currentMute}
          />

          <SimpleAdminUnmuteDialog
            key={`unmute-${currentMute.id}`}
            open={open === "unmute"}
            onOpenChange={() => {
              setOpen(null);
              setTimeout(() => {
                setCurrentMute(null);
              }, 300);
            }}
            currentMute={currentMute}
          />
        </>
      )}

      <SimpleAdminWarnDialog
        key="add-warn"
        open={open === "add-warn"}
        onOpenChange={() => {
          setOpen(null);
        }}
      />

      {currentWarn && (
        <SimpleAdminWarnDialog
          key={`edit-warn-${currentWarn.id}`}
          open={open === "edit-warn"}
          onOpenChange={() => {
            setOpen(null);
            setTimeout(() => {
              setCurrentWarn(null);
            }, 300);
          }}
          currentWarn={currentWarn}
        />
      )}

      <SimpleAdminDialog
        key="add-admin"
        open={open === "add-admin"}
        onOpenChange={() => {
          setOpen(null);
        }}
      />

      {currentAdmin && (
        <>
          <SimpleAdminDialog
            key={`edit-admin-${currentAdmin.id}`}
            open={open === "edit-admin"}
            onOpenChange={() => {
              setOpen(null);
              setTimeout(() => {
                setCurrentAdmin(null);
              }, 300);
            }}
            currentAdmin={currentAdmin}
          />

          <SimpleAdminDeleteAdminDialog
            key={`delete-admin-${currentAdmin.id}`}
            open={open === "delete-admin"}
            onOpenChange={() => {
              setOpen(null);
              setTimeout(() => {
                setCurrentAdmin(null);
              }, 300);
            }}
            currentAdmin={currentAdmin}
          />
        </>
      )}

      <SimpleAdminGroupDialog
        key="add-group"
        open={open === "add-group"}
        onOpenChange={() => {
          setOpen(null);
        }}
      />

      {currentGroup && (
        <>
          <SimpleAdminGroupDialog
            key={`edit-group-${currentGroup.id}`}
            open={open === "edit-group"}
            onOpenChange={() => {
              setOpen(null);
              setTimeout(() => {
                setCurrentGroup(null);
              }, 300);
            }}
            currentGroup={currentGroup}
          />

          <SimpleAdminDeleteGroupDialog
            key={`delete-group-${currentGroup.id}`}
            open={open === "delete-group"}
            onOpenChange={() => {
              setOpen(null);
              setTimeout(() => {
                setCurrentGroup(null);
              }, 300);
            }}
            currentGroup={currentGroup}
          />
        </>
      )}
    </>
  );
}
