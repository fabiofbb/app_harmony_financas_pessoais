import { HeroSection } from '@/components/landing/HeroSection';
import { FeaturesSection } from '@/components/landing/FeaturesSection';
import { CTASection } from '@/components/landing/CTASection';

export default function LandingPage() {
  return (
    <main>
      <HeroSection />
      <FeaturesSection />
      <CTASection />
      <footer className="py-6 text-center text-sm text-muted-foreground border-t">
        © {new Date().getFullYear()} Harmony Finanças Pessoais. Feito com Next.js e Supabase.
      </footer>
    </main>
  );
}
