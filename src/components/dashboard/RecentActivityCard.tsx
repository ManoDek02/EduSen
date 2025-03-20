
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { MoreHorizontal } from 'lucide-react';
import { cn } from '@/lib/utils';

type ActivityItem = {
  id: string;
  user: {
    name: string;
    avatar?: string;
    role: string;
  };
  action: string;
  target: string;
  timestamp: string;
};

type RecentActivityCardProps = {
  activities: ActivityItem[];
  className?: string;
};

const RecentActivityCard = ({ activities, className }: RecentActivityCardProps) => {
  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-medium">Activités récentes</CardTitle>
          <Button variant="ghost" size="icon">
            <MoreHorizontal className="h-4 w-4" />
            <span className="sr-only">Plus d'options</span>
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <ul className="divide-y">
          {activities.map((activity, index) => (
            <li 
              key={activity.id} 
              className={cn(
                "px-6 py-3 transition-colors hover:bg-muted/40",
                index === 0 && "animate-slide-down animation-delay-150",
                index === 1 && "animate-slide-down animation-delay-300",
                index === 2 && "animate-slide-down animation-delay-450"
              )}
            >
              <div className="flex items-start gap-4">
                <Avatar className="mt-1 h-8 w-8">
                  <AvatarImage src={activity.user.avatar} />
                  <AvatarFallback className="bg-primary/10 text-primary text-xs">
                    {activity.user.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-1">
                  <p className="text-sm">
                    <span className="font-medium">{activity.user.name}</span>{' '}
                    <span className="text-muted-foreground">{activity.action}</span>{' '}
                    <span className="font-medium">{activity.target}</span>
                  </p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span>{activity.timestamp}</span>
                    <Separator orientation="vertical" className="h-3" />
                    <span>{activity.user.role}</span>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
};

export default RecentActivityCard;
