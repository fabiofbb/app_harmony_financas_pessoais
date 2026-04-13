import Link from 'next/link';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export function CTASection() {
  return (
    <section className="py-20 px-4 bg-primary text-primary-foreground">
      <div className="max-w-2xl mx-auto text-center">
        <h2 className="text-3xl font-bold mb-4">
          Pronto para começar?
        </h2>
        <p className="text-primary-foreground/80 mb-8">
          Crie sua conta grátis e comece a controlar suas finanças hoje mesmo.
        </p>
        <Link href="/register" className={cn(buttonVariants({ size: 'lg', variant: 'secondary' }))}>
          Criar conta grátis
        </Link>
      </div>
    </section>
  );
}
