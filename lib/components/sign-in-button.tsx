import { IconBrandSteam } from "@tabler/icons-react";
import { Button } from "./ui/button";

export default function SignInButton() {
  return (
    <a href="/api/auth/sign-in/steam">
      <Button variant={"outline"}>
        <IconBrandSteam />
      </Button>
    </a>
  );
}
