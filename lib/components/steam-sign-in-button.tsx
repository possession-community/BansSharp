import { IconBrandSteam } from "@tabler/icons-react";
import { Button } from "../components/ui/button";
import authClient from "../utils/auth-client";

interface SteamSignInButtonProps {
  className?: string;
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
}

/**
 * Steam認証を使用してサインインするためのボタン
 */
export function SteamSignInButton({
  className,
  variant = "default",
  size = "default",
}: SteamSignInButtonProps) {
  const handleSignIn = async () => {
    await authClient.signInWithSteam();
  };

  return (
    <Button className={className} variant={variant} size={size} onClick={handleSignIn}>
      <IconBrandSteam className="mr-2 h-4 w-4" />
      Steamでサインイン
    </Button>
  );
}
