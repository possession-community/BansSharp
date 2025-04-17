import { useEffect, useRef, useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "~/lib/components/ui/popover";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "~/lib/components/ui/tooltip";
import { cn } from "~/lib/utils";

interface Props {
  children: React.ReactNode;
  className?: string;
  contentClassName?: string;
  truncateChars?: number;
}

export default function LongText({
  children,
  className = "",
  contentClassName = "",
  truncateChars,
}: Props) {
  if (typeof children === "string" && truncateChars) {
    const shouldTruncate = children.length > truncateChars;
    const truncated = shouldTruncate
      ? children.substring(0, truncateChars) + "…"
      : children;
    if (!shouldTruncate)
      return <div className={cn("truncate", className)}>{children}</div>;

    return (
      <>
        <div className="hidden sm:block">
          <TooltipProvider delayDuration={0}>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className={cn("truncate", className)}>{truncated}</div>
              </TooltipTrigger>
              <TooltipContent>
                <p className={contentClassName}>{children}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <div className="sm:hidden">
          <Popover>
            <PopoverTrigger asChild>
              <div className={cn("truncate", className)}>{truncated}</div>
            </PopoverTrigger>
            <PopoverContent className={cn("w-fit", contentClassName)}>
              <p>{children}</p>
            </PopoverContent>
          </Popover>
        </div>
      </>
    );
  }

  const ref = useRef<HTMLDivElement>(null);
  const [isOverflown, setIsOverflown] = useState(false);

  useEffect(() => {
    if (checkOverflow(ref.current)) {
      setIsOverflown(true);
      return;
    }

    setIsOverflown(false);
  }, []);

  if (!isOverflown)
    return (
      <div ref={ref} className={cn("truncate", className)}>
        {children}
      </div>
    );

  return (
    <>
      <div className="hidden sm:block">
        <TooltipProvider delayDuration={0}>
          <Tooltip>
            <TooltipTrigger asChild>
              <div ref={ref} className={cn("truncate", className)}>
                {children}
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p className={contentClassName}>{children}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      <div className="sm:hidden">
        <Popover>
          <PopoverTrigger asChild>
            <div ref={ref} className={cn("truncate", className)}>
              {children}
            </div>
          </PopoverTrigger>
          <PopoverContent className={cn("w-fit", contentClassName)}>
            <p>{children}</p>
          </PopoverContent>
        </Popover>
      </div>
    </>
  );
}

const checkOverflow = (textContainer: HTMLDivElement | null) => {
  if (textContainer) {
    return (
      textContainer.offsetHeight < textContainer.scrollHeight ||
      textContainer.offsetWidth < textContainer.scrollWidth
    );
  }
  return false;
};
