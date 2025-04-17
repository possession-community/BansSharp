import React, { createContext, useContext, useState } from "react";
import useDialogState from "~/lib/hooks/use-dialog-state";
import { Admin, Ban, Group, Mute, Warn } from "../data/schema";

export type AdminTab = "bans" | "mutes" | "warns" | "admins" | "groups";

export type SimpleAdminDialogType =
  | "add-ban"
  | "edit-ban"
  | "unban"
  | "add-mute"
  | "edit-mute"
  | "unmute"
  | "add-warn"
  | "edit-warn"
  | "add-admin"
  | "edit-admin"
  | "delete-admin"
  | "add-group"
  | "edit-group"
  | "delete-group";

interface SimpleAdminContextType {
  activeTab: AdminTab;
  setActiveTab: (tab: AdminTab) => void;

  open: SimpleAdminDialogType | null;
  setOpen: (dialog: SimpleAdminDialogType | null) => void;

  currentBan: Ban | null;
  setCurrentBan: React.Dispatch<React.SetStateAction<Ban | null>>;

  currentMute: Mute | null;
  setCurrentMute: React.Dispatch<React.SetStateAction<Mute | null>>;

  currentWarn: Warn | null;
  setCurrentWarn: React.Dispatch<React.SetStateAction<Warn | null>>;

  currentAdmin: Admin | null;
  setCurrentAdmin: React.Dispatch<React.SetStateAction<Admin | null>>;

  currentGroup: Group | null;
  setCurrentGroup: React.Dispatch<React.SetStateAction<Group | null>>;

  isLoading: boolean;
}

const SimpleAdminContext = createContext<SimpleAdminContextType | null>(null);

interface SimpleAdminProviderProps {
  children: React.ReactNode;
  initialTab?: AdminTab;
}

export function SimpleAdminProvider({
  children,
  initialTab = "bans",
}: SimpleAdminProviderProps) {
  const [activeTab, setActiveTab] = useState<AdminTab>(initialTab);

  const [open, setOpen] = useDialogState<SimpleAdminDialogType>(null);

  const [currentBan, setCurrentBan] = useState<Ban | null>(null);
  const [currentMute, setCurrentMute] = useState<Mute | null>(null);
  const [currentWarn, setCurrentWarn] = useState<Warn | null>(null);
  const [currentAdmin, setCurrentAdmin] = useState<Admin | null>(null);
  const [currentGroup, setCurrentGroup] = useState<Group | null>(null);

  const [isLoading, setIsLoading] = useState(false);

  const value = {
    activeTab,
    setActiveTab,
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
    isLoading,
  };

  return (
    <SimpleAdminContext.Provider value={value}>{children}</SimpleAdminContext.Provider>
  );
}

export function useSimpleAdmin() {
  const context = useContext(SimpleAdminContext);

  if (!context) {
    throw new Error("useSimpleAdmin must be used within an SimpleAdminProvider");
  }

  return context;
}
