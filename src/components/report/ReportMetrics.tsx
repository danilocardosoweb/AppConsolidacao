import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Users, UserPlus, Calendar, TrendingUp, UserCheck, Clock, Heart, Target } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';

interface ReportMetricsProps {
  selectedMonth: number;
  selectedYear: number;
}

const ReportMetrics: React.FC<ReportMetricsProps> = ({ selectedMonth, selectedYear }) => {
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [novos, setNovos] = useState(0);
  const [recorrentes, setRecorrentes] = useState(0);
  const [retencao, setRetencao] = useState(0);
  const [frequencia, setFrequencia] = useState(0);
  const [engajamento, setEngajamento] = useState(0); // Placeholder
  const [tempoMedio, setTempoMedio] = useState('1h 45m'); // Placeholder
  const [crescimento, setCrescimento] = useState(0);
  const [crescimentoPercent, setCrescimentoPercent] = useState(0);
  const [novosPercent, setNovosPercent] = useState(0);

  useEffect(() => {
    async function fetchMetrics() {
      setLoading(true);
      // Buscar todos os visitantes com suas visitas
      const { data: all, error } = await supabase
        .from('visitors')
        .select('id, created_at, visit_count');
      if (error) return;
      setTotal(all.length);

      // Filtrar por mês/ano selecionado
      const visitantesMes = all.filter(v => {
        const d = new Date(v.created_at);
        return d.getMonth() === selectedMonth && d.getFullYear() === selectedYear;
      });

      // Novos visitantes: primeira visita no mês
      setNovos(visitantesMes.length);

      // Calcular visitantes recorrentes e taxa de retenção
      const visitantesUnicos = new Set(visitantesMes.map(v => v.id));
      const visitantesRecorrentes = visitantesMes.filter(v => v.visit_count > 1).length;
      
      setRecorrentes(visitantesRecorrentes);
      
      // Taxa de retenção = (visitantes recorrentes / total de visitantes únicos) * 100
      const taxaRetencao = visitantesUnicos.size > 0 
        ? Math.round((visitantesRecorrentes / visitantesUnicos.size) * 100) 
        : 0;
      setRetencao(taxaRetencao);

      // Frequência média: total de visitas / número de visitantes únicos
      const totalVisitas = visitantesMes.reduce((acc, v) => acc + v.visit_count, 0);
      const frequenciaMedia = visitantesUnicos.size > 0 
        ? Number((totalVisitas / visitantesUnicos.size).toFixed(1))
        : 0;
      setFrequencia(frequenciaMedia);

      // Engajamento: mock 87%
      setEngajamento(87);

      // Tempo médio: mock 1h 45m
      setTempoMedio('1h 45m');

      // Crescimento: comparação com mês anterior
      const mesAnterior = selectedMonth === 0 ? 11 : selectedMonth - 1;
      const anoMesAnterior = selectedMonth === 0 ? selectedYear - 1 : selectedYear;
      const visitantesMesAnterior = all.filter(v => {
        const d = new Date(v.created_at);
        return d.getMonth() === mesAnterior && d.getFullYear() === anoMesAnterior;
      });
      
      setCrescimento(visitantesMes.length - visitantesMesAnterior.length);
      setCrescimentoPercent(visitantesMesAnterior.length > 0 
        ? Math.round(((visitantesMes.length - visitantesMesAnterior.length) / visitantesMesAnterior.length) * 100) 
        : 100);
      setNovosPercent(visitantesMesAnterior.length > 0 
        ? Math.round(((visitantesMes.length - visitantesMesAnterior.length) / visitantesMesAnterior.length) * 100) 
        : 100);
      
      setLoading(false);
    }
    fetchMetrics();
  }, [selectedMonth, selectedYear]);

  const months = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];

  const metrics = [
    {
      title: 'Total de Visitantes',
      value: loading ? '-' : total.toLocaleString('pt-BR'),
      change: loading ? '-' : `${crescimentoPercent >= 0 ? '+' : ''}${crescimentoPercent}%`,
      changeType: crescimentoPercent >= 0 ? 'positive' : 'negative',
      icon: Users,
      color: 'from-blue-500 to-blue-600',
      description: 'Em relação ao mês anterior'
    },
    {
      title: 'Novos Visitantes',
      value: loading ? '-' : novos.toLocaleString('pt-BR'),
      change: loading ? '-' : `${novosPercent >= 0 ? '+' : ''}${novosPercent}%`,
      changeType: novosPercent >= 0 ? 'positive' : 'negative',
      icon: UserPlus,
      color: 'from-green-500 to-green-600',
      description: 'Primeira visita no mês'
    },
    {
      title: 'Visitantes Recorrentes',
      value: loading ? '-' : recorrentes.toLocaleString('pt-BR'),
      change: loading ? '-' : '+12%', // mock
      changeType: 'positive',
      icon: UserCheck,
      color: 'from-purple-500 to-purple-600',
      description: 'Retornaram este mês'
    },
    {
      title: 'Taxa de Retenção',
      value: loading ? '-' : `${retencao}%`,
      change: loading ? '-' : '+5%', // mock
      changeType: 'positive',
      icon: Target,
      color: 'from-orange-500 to-orange-600',
      description: 'Visitantes que retornaram'
    },
    {
      title: 'Frequência Média',
      value: loading ? '-' : `${frequencia}x`,
      change: loading ? '-' : '+0.4', // mock
      changeType: 'positive',
      icon: Calendar,
      color: 'from-pink-500 to-pink-600',
      description: 'Visitas por pessoa'
    },
    {
      title: 'Engajamento',
      value: loading ? '-' : `${engajamento}%`,
      change: loading ? '-' : '+7%', // mock
      changeType: 'positive',
      icon: Heart,
      color: 'from-red-500 to-red-600',
      description: 'Participação em atividades'
    },
    {
      title: 'Tempo Médio',
      value: loading ? '-' : tempoMedio,
      change: loading ? '-' : '+15m', // mock
      changeType: 'positive',
      icon: Clock,
      color: 'from-indigo-500 to-indigo-600',
      description: 'Duração das visitas'
    },
    {
      title: 'Crescimento',
      value: loading ? '-' : `${crescimento >= 0 ? '+' : ''}${crescimentoPercent}%`,
      change: loading ? '-' : '+3%', // mock
      changeType: crescimentoPercent >= 0 ? 'positive' : 'negative',
      icon: TrendingUp,
      color: 'from-cyan-500 to-cyan-600',
      description: 'Crescimento mensal'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-playfair font-bold gradient-text mb-2">
          Métricas de {months[selectedMonth]} {selectedYear}
        </h2>
        <p className="text-gray-600">
          Análise completa do desempenho e engajamento dos visitantes
        </p>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric, index) => (
          <Card key={metric.title} className="hover-lift animate-scale-in" style={{ animationDelay: `${index * 100}ms` }}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                {metric.title}
              </CardTitle>
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${metric.color} flex items-center justify-center`}>
                <metric.icon className="w-6 h-6 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900 mb-1">
                {metric.value}
              </div>
              <div className="flex items-center space-x-2">
                <span className={`text-sm font-medium ${
                  metric.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {metric.change}
                </span>
                <span className="text-xs text-gray-500">
                  {metric.description}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Summary Card */}
      <Card className="glass-effect hover-lift">
        <CardHeader>
          <CardTitle className="text-xl font-semibold gradient-text">
            Resumo Executivo
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl">
              <div className="text-2xl font-bold text-blue-600 mb-1">{loading ? '-' : total}</div>
              <div className="text-sm text-gray-600">Total de Visitantes</div>
              <div className="text-xs text-green-600 font-medium">{loading ? '-' : `+${crescimentoPercent}% vs mês anterior`}</div>
            </div>
            <div className="text-center p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl">
              <div className="text-2xl font-bold text-green-600 mb-1">{loading ? '-' : `${novosPercent}%`}</div>
              <div className="text-sm text-gray-600">Novos Visitantes</div>
              <div className="text-xs text-green-600 font-medium">Meta: 30%</div>
            </div>
            <div className="text-center p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl">
              <div className="text-2xl font-bold text-purple-600 mb-1">{loading ? '-' : `${retencao}%`}</div>
              <div className="text-sm text-gray-600">Taxa de Retenção</div>
              <div className="text-xs text-green-600 font-medium">Acima da meta</div>
            </div>
          </div>
          
          <div className="pt-4 border-t border-gray-200">
            <p className="text-gray-700 leading-relaxed">
              <strong className="text-gray-900">Destaque do mês:</strong> Observamos um crescimento significativo 
              de {loading ? '-' : `${crescimentoPercent}%`} no número total de visitantes, com destaque para o aumento de {loading ? '-' : `${novosPercent}%`} em novos visitantes. 
              A taxa de retenção de {loading ? '-' : `${retencao}%`} indica um forte engajamento da comunidade, superando nossa meta mensal de 60%.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReportMetrics;
