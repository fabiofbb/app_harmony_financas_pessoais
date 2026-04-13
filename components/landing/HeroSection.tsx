import Link from 'next/link';
import { TrendingUp } from 'lucide-react';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-indigo-50 via-white to-blue-50 py-20 px-4">
      <div className="max-w-4xl mx-auto text-center">
        <div className="flex items-center justify-center gap-2 mb-6">
          <div className="bg-primary rounded-xl p-2.5">
            <TrendingUp className="h-8 w-8 text-white" />
          </div>
          <span className="text-2xl font-bold">Harmony</span>
        </div>

        <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
          Controle suas finanças
          <span className="text-primary block">com harmonia</span>
        </h1>

        <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-10">
          Registre receitas e despesas, visualize seu saldo em tempo real e tome
          decisões financeiras mais inteligentes — tudo em um só lugar.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/register" className={cn(buttonVariants({ size: 'lg' }))}>
            Começar grátis
          </Link>
          <Link href="/login" className={cn(buttonVariants({ size: 'lg', variant: 'outline' }))}>
            Já tenho conta
          </Link>
        </div>
      </div>
    </section>
  );
}
