'use client';

import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatBRL } from '@/lib/utils/currency';

interface CategoryData {
  category: string;
  value: number;
  color: string;
}

interface ExpensePieChartProps {
  data: CategoryData[];
}

export function ExpensePieChart({ data }: ExpensePieChartProps) {
  if (data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Despesas por Categoria</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-[280px]">
          <p className="text-muted-foreground text-sm">Nenhuma despesa no período</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Despesas por Categoria</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={280}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={90}
              dataKey="value"
              nameKey="category"
              paddingAngle={2}
            >
              {data.map((entry, index) => (
                <Cell key={index} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value) => [formatBRL(Number(value)), 'Valor']}
              contentStyle={{ borderRadius: '8px', fontSize: '12px' }}
            />
            <Legend
              formatter={(value) => (
                <span className="text-xs">{value}</span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
