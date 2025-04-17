import { useQuery } from "@tanstack/react-query";
import { Avatar, AvatarFallback, AvatarImage } from "~/lib/components/ui/avatar";
import { getRecentViolators } from "~/lib/functions/dashboard";

export function RecentSales() {
  // Fetch recent violators data
  const { data, isLoading, error } = useQuery({
    queryKey: ["recentViolators"],
    queryFn: () => getRecentViolators(),
  });

  // If loading, show a loading state
  if (isLoading) {
    return (
      <div className="flex h-[300px] items-center justify-center">
        <p className="text-muted-foreground">Loading data...</p>
      </div>
    );
  }

  // If error, show an error state
  if (error) {
    return (
      <div className="flex h-[300px] items-center justify-center">
        <p className="text-destructive">Failed to load data</p>
      </div>
    );
  }

  // If no data, show a message
  if (!data || data.length === 0) {
    return (
      <div className="flex h-[300px] items-center justify-center">
        <p className="text-muted-foreground">No recent violations</p>
      </div>
    );
  }

  // Helper function to get status color
  const getStatusColor = (status: string, type: string) => {
    switch (status) {
      case "ACTIVE":
        return "bg-red-500/10 text-red-500";
      case "UNBANNED":
      case "UNMUTED":
        return "bg-green-500/10 text-green-500";
      case "EXPIRED":
        return "bg-amber-500/10 text-amber-500";
      default:
        return "bg-gray-500/10 text-gray-500";
    }
  };

  // Helper function to get type color
  const getTypeColor = (type: string) => {
    return type === "ban"
      ? "bg-destructive/10 text-destructive"
      : "bg-amber-500/10 text-amber-500";
  };

  return (
    <div className="space-y-8">
      {data.map((violator, index) => {
        // Get initials for avatar fallback
        const initials = violator.playerName
          ? violator.playerName
              .split(" ")
              .map((n) => n[0])
              .join("")
              .toUpperCase()
              .substring(0, 2)
          : "UN";

        return (
          <div key={index} className="flex items-center gap-4">
            <Avatar className="h-9 w-9">
              <AvatarImage
                src={violator.avatarUrl || `/avatars/0${(index % 5) + 1}.png`}
                alt="Avatar"
              />
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
            <div className="flex flex-1 flex-wrap items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium leading-none">{violator.playerName}</p>
                <p className="text-sm text-muted-foreground">{violator.playerSteamid}</p>
              </div>
              <div className="flex flex-col items-end gap-1">
                <span
                  className={`rounded-full px-2 py-1 text-xs ${getTypeColor(violator.type)}`}
                >
                  {violator.type.toUpperCase()}
                </span>
                <span
                  className={`rounded-full px-2 py-1 text-xs ${getStatusColor(violator.status, violator.type)}`}
                >
                  {violator.status}
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
