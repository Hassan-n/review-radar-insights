
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { Link } from "react-router-dom";

interface PageHeaderProps {
  title: string;
  description?: string;
  actions?: React.ReactNode;
  backLink?: string;
  className?: string;
}

export function PageHeader({
  title,
  description,
  actions,
  backLink,
  className,
}: PageHeaderProps) {
  return (
    <div className={cn("mb-6", className)}>
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            {backLink && (
              <Button asChild variant="ghost" size="icon" className="h-8 w-8">
                <Link to={backLink}>
                  <ChevronLeft className="h-4 w-4" />
                </Link>
              </Button>
            )}
            <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
          </div>
          {description && (
            <p className="text-sm text-muted-foreground">{description}</p>
          )}
        </div>
        {actions && <div className="flex items-center gap-2">{actions}</div>}
      </div>
    </div>
  );
}
