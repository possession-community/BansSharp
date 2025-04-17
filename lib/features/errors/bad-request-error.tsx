import { useNavigate, useRouter } from "@tanstack/react-router";
import { Button } from "~/lib/components/ui/button";

export default function BadRequestError() {
  const navigate = useNavigate();
  const { history } = useRouter();
  return (
    <div className="h-svh">
      <div className="m-auto flex h-full w-full flex-col items-center justify-center gap-2">
        <h1 className="text-[7rem] font-bold leading-tight">400</h1>
        <span className="font-medium">Bad Request</span>
        <p className="text-center text-muted-foreground">
          The server cannot process the request <br />
          due to invalid syntax or missing parameters.
        </p>
        <div className="mt-6 flex gap-4">
          <Button variant="outline" onClick={() => history.go(-1)}>
            Go Back
          </Button>
          <Button onClick={() => navigate({ to: "/" })}>Back to Home</Button>
        </div>
      </div>
    </div>
  );
}