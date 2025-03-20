
import React from 'react';
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";

type PageHeaderProps = {
  title: string;
  description?: string;
  actions?: React.ReactNode;
  className?: string;
};

const PageHeader = ({ title, description, actions, className }: PageHeaderProps) => {
  return (
    <div className={cn("flex flex-col space-y-2 md:space-y-4", className)}>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl md:text-3xl font-semibold tracking-tight animate-slide-up">
            {title}
          </h1>
          {description && (
            <p className="text-muted-foreground animate-slide-up animation-delay-100">
              {description}
            </p>
          )}
        </div>
        {actions && (
          <div className="flex flex-wrap items-center gap-2 animate-fade-in">{actions}</div>
        )}
      </div>
      <Separator className="animate-fade-in" />
    </div>
  );
};

export default PageHeader;
