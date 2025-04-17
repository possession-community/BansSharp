import { ScrollArea } from "~/lib/components/ui/scroll-area";
import { Separator } from "~/lib/components/ui/separator";

interface ContentSectionProps {
  title: string;
  desc: string;
  children: React.JSX.Element;
  className?: string;
}

export default function ContentSection({
  title,
  desc,
  children,
  className,
}: ContentSectionProps) {
  return (
    <div className={`flex flex-1 flex-col ${className || ""}`}>
      <div className="flex-none">
        <h3 className="text-lg font-medium">{title}</h3>
        <p className="text-sm text-muted-foreground">{desc}</p>
      </div>
      <Separator className="my-4 flex-none" />
      <ScrollArea className="faded-bottom -mx-4 flex-1 scroll-smooth px-4 md:pb-16">
        <div className="-mx-1 px-1.5 max-w-8/10">{children}</div>
      </ScrollArea>
    </div>
  );
}
