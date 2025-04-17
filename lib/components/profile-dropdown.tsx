import { useRouter } from "@tanstack/react-router";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "~/lib/components/ui/avatar";
import { Button } from "~/lib/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/lib/components/ui/dropdown-menu";
import authClient from "../utils/auth-client";

export function ProfileDropdown({ user }) {
  const router = useRouter();
  const avatarUrl = user?.image || "/avatars/01.png";

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarImage src={avatarUrl} alt="@shadcn" />
            <AvatarFallback>{user?.name || ""}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user?.name || "No Name"}</p>
            <p className="text-xs leading-none text-muted-foreground">{user?.steamId}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={async () => {
            await authClient.signOut({
              fetchOptions: {
                onSuccess: () => {
                  toast.success("Signed out successfully");
                  router.navigate({ to: "/" });
                },
                onError: () => {
                  toast.error("Failed to sign out");
                },
              },
            });
          }}
        >
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
