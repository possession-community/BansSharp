import React, { createContext, useContext, useState } from "react";
import { User } from "~/lib/functions/better-auth/users";

type DialogType = "edit-user" | null;

interface UserTableContextType {
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
  dialogOpen: DialogType;
  setDialogOpen: (dialog: DialogType) => void;
  refreshUsers: () => void;
  refreshTrigger: number;
}

const UserTableContext = createContext<UserTableContextType | undefined>(undefined);

export function UserTableProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [dialogOpen, setDialogOpen] = useState<DialogType>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const refreshUsers = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  return (
    <UserTableContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        dialogOpen,
        setDialogOpen,
        refreshUsers,
        refreshTrigger,
      }}
    >
      {children}
    </UserTableContext.Provider>
  );
}

export function useUserTable() {
  const context = useContext(UserTableContext);
  if (context === undefined) {
    throw new Error("useUserTable must be used within a UserTableProvider");
  }
  return context;
}
