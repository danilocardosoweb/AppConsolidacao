import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { TrendingUp, TrendingDown, ArrowRight, Calendar, Users, Target } from 'lucide-react';

interface ReportComparisonProps {
  selectedMonth: number;
  selectedYear: number;
}

const ReportComparison: React.FC<ReportComparisonProps> = ({ selectedMonth, selectedYear }) => {
  const months = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];

  const previousMonth = selectedMonth === 0 ? 11 : selectedMonth - 1;
  const previousYear = selectedMonth === 0 ? selectedYear - 1 : selectedYear;

  const [comparisons, setComparisons] = useState([]);
  const [yearComparison, setYearComparison] = useState([]);
  const [cumulativeGrowth, setCumulativeGrowth] = useState({ percent: 0, value: 0 });

  useEffect(() => {
    async function fetchComparisons() {
      // Buscar todos os visitantes
      const { data: all, error } = await supabase
        .from('visitors')
        .select('id, created_at, visit_count, metadata');
      if (error) return;

      // --- Mensal ---
      function getMonthData(year: number, month: number) {
        const visitors = all.filter(v => {
          const d = new Date(v.created_at);
          return d.getMonth() === month && d.getFullYear() === year;
        });
        const total = visitors.length;
        const novos = new Set(visitors.map(v => v.id)).size;
        const recorrentes = visitors.filter(v => v.visit_count > 1).length;
        const retencao = novos > 0 ? Math.round((recorrentes / novos) * 100) : 0;
        const totalVisitas = visitors.reduce((acc, v) => acc + v.visit_count, 0);
        const freq = novos > 0 ? Number((totalVisitas / novos).toFixed(1)) : 0;
        // Placeholders para engajamento e tempo médio
        const engajamento = 87;
        const tempoMedio = 105;
        return { total, novos, recorrentes, retencao, freq, engajamento, tempoMedio };
      }
      const atual = getMonthData(selectedYear, selectedMonth);
      const anterior = getMonthData(previousYear, previousMonth);

      setComparisons([
        {
          metric: 'Total de Visitantes',
          current: atual.total,
          previous: anterior.total,
          change: anterior.total > 0 ? ((atual.total - anterior.total) / anterior.total) * 100 : 100,
          unit: '',
          icon: Users,
          color: 'blue'
        },
        {
          metric: 'Novos Visitantes',
          current: atual.novos,
          previous: anterior.novos,
          change: anterior.novos > 0 ? ((atual.novos - anterior.novos) / anterior.novos) * 100 : 100,
          unit: '',
          icon: Users,
          color: 'green'
        },
        {
          metric: 'Taxa de Retenção',
          current: atual.retencao,
          previous: anterior.retencao,
          change: anterior.retencao > 0 ? (atual.retencao - anterior.retencao) : atual.retencao,
          unit: '%',
          icon: Target,
          color: 'purple'
        },
        {
          metric: 'Frequência Média',
          current: atual.freq,
          previous: anterior.freq,
          change: anterior.freq > 0 ? ((atual.freq - anterior.freq) / anterior.freq) * 100 : 100,
          unit: 'x',
          icon: Calendar,
          color: 'orange'
        },
        {
          metric: 'Engajamento',
          current: atual.engajamento,
          previous: anterior.engajamento,
          change: anterior.engajamento > 0 ? ((atual.engajamento - anterior.engajamento) / anterior.engajamento) * 100 : 100,
          unit: '%',
          icon: TrendingUp,
          color: 'pink'
        },
        {
          metric: 'Tempo Médio (min)',
          current: atual.tempoMedio,
          previous: anterior.tempoMedio,
          change: anterior.tempoMedio > 0 ? ((atual.tempoMedio - anterior.tempoMedio) / anterior.tempoMedio) * 100 : 100,
          unit: 'min',
          icon: Calendar,
          color: 'indigo'
        }
      ]);

      // --- Anual ---
      function getYearRangeData(year: number, startMonth: number, endMonth: number) {
        return all.filter(v => {
          const d = new Date(v.created_at);
          return d.getFullYear() === year && d.getMonth() >= startMonth && d.getMonth() <= endMonth;
        }).length;
      }
      const anoAtual = selectedYear;
      const anoAnterior = selectedYear - 1;
      const visitantesAtual = getYearRangeData(anoAtual, 0, 5); // Jan-Jun
      const visitantesAnterior = getYearRangeData(anoAnterior, 0, 5);
      setYearComparison([
        { period: `Jan-Jun ${anoAtual}`, visitors: visitantesAtual, growth: visitantesAnterior > 0 ? ((visitantesAtual - visitantesAnterior) / visitantesAnterior) * 100 : 100 },
        { period: `Jan-Jun ${anoAnterior}`, visitors: visitantesAnterior, growth: 0 },
      ]);
      setCumulativeGrowth({
        percent: visitantesAnterior > 0 ? ((visitantesAtual - visitantesAnterior) / visitantesAnterior) * 100 : 100,
        value: visitantesAtual - visitantesAnterior
      });
    }
    fetchComparisons();
  }, [selectedMonth, selectedYear]);

  const getColorClasses = (color: string) => {
    const colors = {
      blue: 'from-blue-500 to-blue-600 text-blue-600 bg-blue-50',
      green: 'from-green-500 to-green-600 text-green-600 bg-green-50',
      purple: 'from-purple-500 to-purple-600 text-purple-600 bg-purple-50',
      orange: 'from-orange-500 to-orange-600 text-orange-600 bg-orange-50',
      pink: 'from-pink-500 to-pink-600 text-pink-600 bg-pink-50',
      indigo: 'from-indigo-500 to-indigo-600 text-indigo-600 bg-indigo-50',
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-playfair font-bold gradient-text mb-2">
          Análise Comparativa
        </h2>
        <p className="text-gray-600">
          {months[selectedMonth]} {selectedYear} vs {months[previousMonth]} {previousYear}
        </p>
      </div>

      {/* Monthly Comparison Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {comparisons.map((item, index) => {
          const colorClasses = getColorClasses(item.color);
          const isPositive = item.change > 0;
          
          return (
            <Card key={item.metric} className="hover-lift animate-scale-in" style={{ animationDelay: `${index * 100}ms` }}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium text-gray-600">
                    {item.metric}
                  </CardTitle>
                  <div className={`w-10 h-10 rounded-lg bg-gradient-to-r ${colorClasses.split(' ').slice(0, 2).join(' ')} flex items-center justify-center`}>
                    <item.icon className="w-5 h-5 text-white" />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold text-gray-900">
                      {item.current}{item.unit}
                    </div>
                    <div className="text-sm text-gray-500">
                      Atual
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-gray-400" />
                  <div>
                    <div className="text-lg font-semibold text-gray-700">
                      {item.previous}{item.unit}
                    </div>
                    <div className="text-sm text-gray-500">
                      Anterior
                    </div>
                  </div>
                </div>
                
                <div className={`flex items-center justify-center p-2 rounded-lg ${colorClasses.split(' ').slice(-1)[0]}`}>
                  {isPositive ? (
                    <TrendingUp className={`w-4 h-4 mr-1 ${colorClasses.split(' ')[2]}`} />
                  ) : (
                    <TrendingDown className="w-4 h-4 mr-1 text-red-600" />
                  )}
                  <span className={`font-semibold ${isPositive ? colorClasses.split(' ')[2] : 'text-red-600'}`}>
                    {isPositive ? '+' : ''}{item.change.toFixed(1)}%
                  </span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Year over Year Comparison */}
      <Card className="glass-effect hover-lift">
        <CardHeader>
          <CardTitle className="text-xl font-semibold gradient-text">
            Comparativo Anual
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-8">
            {yearComparison.map((year, index) => (
              <div key={year.period} className="space-y-4">
                <div className="text-center">
                  <h3 className="text-lg font-semibold text-gray-800">
                    {year.period}
                  </h3>
                  <div className="text-3xl font-bold gradient-text">
                    {year.visitors.toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-600">visitantes</div>
                </div>
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-xl">
                  <div className="flex items-center justify-center space-x-2">
                    <TrendingUp className="w-5 h-5 text-green-600" />
                    <span className="font-semibold text-green-600">
                      +{year.growth.toFixed(1)}% crescimento
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="text-center">
              <div className="text-lg font-semibold text-gray-800 mb-2">
                Crescimento Acumulado
              </div>
              <div className="flex items-center justify-center space-x-4">
                <div className="text-2xl font-bold text-green-600">+{cumulativeGrowth.percent.toFixed(1)}%</div>
                <div className="text-gray-600">vs ano anterior</div>
              </div>
              <p className="text-sm text-gray-600 mt-2">
                Representando {cumulativeGrowth.value} visitantes adicionais comparado ao mesmo período do ano passado
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Performance Insights */}
      <div className="grid md:grid-cols-3 gap-6">
        <Card className="glass-effect hover-lift">
          <CardContent className="p-6 text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <TrendingUp className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Tendência Positiva
            </h3>
            <p className="text-gray-600 text-sm">
              Crescimento consistente em todas as métricas principais
            </p>
          </CardContent>
        </Card>

        <Card className="glass-effect hover-lift">
          <CardContent className="p-6 text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Engajamento Alto
            </h3>
            <p className="text-gray-600 text-sm">
              Taxa de retenção acima da média do setor
            </p>
          </CardContent>
        </Card>

        <Card className="glass-effect hover-lift">
          <CardContent className="p-6 text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Target className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Metas Superadas
            </h3>
            <p className="text-gray-600 text-sm">
              Todos os objetivos mensais foram atingidos
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ReportComparison;
