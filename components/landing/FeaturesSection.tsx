import { BarChart3, Download, Lock, PieChart, Search, Smartphone } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const features = [
  {
    icon: BarChart3,
    title: 'Dashboard Visual',
    description:
      'Veja seu saldo, receitas e despesas em cards e gráficos claros. Controle financeiro de verdade.',
  },
  {
    icon: PieChart,
    title: 'Gráficos por Categoria',
    description:
      'Entenda para onde vai seu dinheiro com gráfico de pizza por categoria de despesa.',
  },
  {
    icon: Search,
    title: 'Filtros e Busca',
    description:
      'Filtre por mês, ano e categoria. Busque transações por descrição com instantaneidade.',
  },
  {
    icon: Download,
    title: 'Exportar CSV',
    description:
      'Exporte suas transações filtradas em CSV compatível com Excel para análises avançadas.',
  },
  {
    icon: Lock,
    title: 'Dados Seguros',
    description:
      'Autenticação com Supabase e Row Level Security: seus dados nunca são acessados por outros.',
  },
  {
    icon: Smartphone,
    title: '100% Responsivo',
    description:
      'Acesse do celular ou computador. Interface adaptada para qualquer tamanho de tela.',
  },
];

export function FeaturesSection() {
  return (
    <section className="py-20 px-4 bg-white">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-3">
          Tudo que você precisa
        </h2>
        <p className="text-muted-foreground text-center mb-12">
          Simples, rápido e sem curva de aprendizado
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map(({ icon: Icon, title, description }) => (
            <Card key={title} className="border-0 shadow-sm">
              <CardHeader className="pb-2">
                <div className="bg-primary/10 w-10 h-10 rounded-lg flex items-center justify-center mb-3">
                  <Icon className="h-5 w-5 text-primary" />
                </div>
                <CardTitle className="text-base">{title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
