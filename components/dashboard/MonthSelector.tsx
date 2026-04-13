'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface MonthSelectorProps {
  month: number;
  year: number;
}

export function MonthSelector({ month, year }: MonthSelectorProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const navigate = (newMonth: number, newYear: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('month', String(newMonth));
    params.set('year', String(newYear));
    router.push(`/dashboard?${params.toString()}`);
  };

  const prev = () => {
    if (month === 1) navigate(12, year - 1);
    else navigate(month - 1, year);
  };

  const next = () => {
    if (month === 12) navigate(1, year + 1);
    else navigate(month + 1, year);
  };

  const date = new Date(year, month - 1, 1);
  const label = format(date, "MMMM 'de' yyyy", { locale: ptBR });

  return (
    <div className="flex items-center gap-2">
      <Button variant="outline" size="icon" onClick={prev}>
        <ChevronLeft className="h-4 w-4" />
      </Button>
      <span className="text-sm font-medium capitalize min-w-[160px] text-center">
        {label}
      </span>
      <Button variant="outline" size="icon" onClick={next}>
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
}
