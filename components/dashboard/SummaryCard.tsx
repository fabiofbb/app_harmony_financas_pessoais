import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatBRL } from '@/lib/utils/currency';
import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

interface SummaryCardProps {
  title: string;
  value: number;
  icon: LucideIcon;
  colorClass: string;
  bgClass: string;
}

export function SummaryCard({
  title,
  value,
  icon: Icon,
  colorClass,
  bgClass,
}: SummaryCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <div className={cn('p-2 rounded-full', bgClass)}>
          <Icon className={cn('h-4 w-4', colorClass)} />
        </div>
      </CardHeader>
      <CardContent>
        <p className={cn('text-2xl font-bold', colorClass)}>{formatBRL(value)}</p>
      </CardContent>
    </Card>
  );
}
