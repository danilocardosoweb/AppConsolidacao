import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface ReportChartsProps {
  selectedMonth: number;
  selectedYear: number;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: { color: string; dataKey: string; value: number }[];
  label?: string;
}

const ReportCharts: React.FC<ReportChartsProps> = ({ selectedMonth, selectedYear }) => {
  const [loading, setLoading] = useState(true);
  const [dailyVisitors, setDailyVisitors] = useState([]);
  const [ageGroups, setAgeGroups] = useState([]);
  const [weeklyComparison, setWeeklyComparison] = useState([]);
  const [monthlyTrend, setMonthlyTrend] = useState([]);
  const [performance, setPerformance] = useState({
    peakDay: '-',
    peakValue: '-',
    avg: '-',
    minDay: '-',
    minValue: '-',
    trend: '-',
    trendPercent: '-'
  });

  useEffect(() => {
    async function fetchCharts() {
      setLoading(true);
      // Buscar todos os visitantes
      const { data: all, error } = await supabase
        .from('visitors')
        .select('id, created_at, metadata');
      if (error) return;

      // --- Visitantes por Dia ---
      const diasNoMes = new Date(selectedYear, selectedMonth + 1, 0).getDate();
      const daily = Array.from({ length: diasNoMes }, (_, i) => ({ day: String(i + 1), visitors: 0, newVisitors: 0 }));
      const idsNovos = new Set();
      all.forEach(v => {
        const d = new Date(v.created_at);
        if (d.getMonth() === selectedMonth && d.getFullYear() === selectedYear) {
          const dia = d.getDate() - 1;
          daily[dia].visitors += 1;
          // Considera como novo se for a primeira visita do id no mês
          if (!idsNovos.has(v.id)) {
            daily[dia].newVisitors += 1;
            idsNovos.add(v.id);
          }
        }
      });
      setDailyVisitors(daily);

      // --- Distribuição por Idade ---
      const grupos = {
        '18-25': 0,
        '26-35': 0,
        '36-45': 0,
        '46-55': 0,
        '56+': 0
      };
      all.forEach(v => {
        if (v.metadata && v.metadata.faixa_etaria) {
          if (grupos[v.metadata.faixa_etaria] !== undefined) {
            grupos[v.metadata.faixa_etaria]++;
          } else if (v.metadata.faixa_etaria === '56+' || v.metadata.faixa_etaria === '56+') {
            grupos['56+']++;
          }
        }
      });
      setAgeGroups([
        { name: '18-25', value: grupos['18-25'], color: '#9BC8EF' },
        { name: '26-35', value: grupos['26-35'], color: '#7BB3E8' },
        { name: '36-45', value: grupos['36-45'], color: '#5B9EE1' },
        { name: '46-55', value: grupos['46-55'], color: '#3B89DA' },
        { name: '56+', value: grupos['56+'], color: '#1B74D3' },
      ]);

      // --- Comparativo Semanal ---
      function getWeeks(year, month) {
        const weeks = [0, 0, 0, 0];
        all.forEach(v => {
          const d = new Date(v.created_at);
          if (d.getMonth() === month && d.getFullYear() === year) {
            const week = Math.floor((d.getDate() - 1) / 7);
            weeks[week]++;
          }
        });
        return weeks;
      }
      const weeksCurrent = getWeeks(selectedYear, selectedMonth);
      const mesAnterior = selectedMonth === 0 ? 11 : selectedMonth - 1;
      const anoMesAnterior = selectedMonth === 0 ? selectedYear - 1 : selectedYear;
      const weeksPrevious = getWeeks(anoMesAnterior, mesAnterior);
      setWeeklyComparison([
        { week: 'Sem 1', current: weeksCurrent[0], previous: weeksPrevious[0] },
        { week: 'Sem 2', current: weeksCurrent[1], previous: weeksPrevious[1] },
        { week: 'Sem 3', current: weeksCurrent[2], previous: weeksPrevious[2] },
        { week: 'Sem 4', current: weeksCurrent[3], previous: weeksPrevious[3] },
      ]);

      // --- Tendência Mensal ---
      const meses = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const trend = meses.map((m, i) => {
        const count = all.filter(v => {
          const d = new Date(v.created_at);
          return d.getMonth() === i && d.getFullYear() === selectedYear;
        }).length;
        return { month: m, visitors: count };
      });
      setMonthlyTrend(trend);

      // --- Performance ---
      const max = daily.reduce((acc, cur) => cur.visitors > acc.visitors ? cur : acc, { day: '-', visitors: 0 });
      const min = daily.reduce((acc, cur) => (cur.visitors < acc.visitors && cur.visitors > 0) ? cur : acc, { day: '-', visitors: Infinity });
      const avg = daily.reduce((acc, cur) => acc + cur.visitors, 0) / daily.length;
      const trendPercent = weeksPrevious.reduce((acc, cur, i) => acc + (weeksCurrent[i] - cur), 0) / (weeksPrevious.reduce((a, b) => a + b, 0) || 1) * 100;
      setPerformance({
        peakDay: max.day,
        peakValue: max.visitors,
        avg: avg.toFixed(1),
        minDay: min.day,
        minValue: min.visitors === Infinity ? 0 : min.visitors,
        trend: trendPercent > 0 ? 'Crescente' : 'Decrescente',
        trendPercent: `${trendPercent.toFixed(1)}%`
      });
      setLoading(false);
    }
    fetchCharts();
  }, [selectedMonth, selectedYear]);

  const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-semibold">{`Dia ${label}`}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ color: entry.color }}>
              {`${entry.dataKey === 'visitors' ? 'Total' : 'Novos'}: ${entry.value}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-playfair font-bold gradient-text mb-2">
          Análise Gráfica
        </h2>
        <p className="text-gray-600">
          Visualizações detalhadas dos dados de visitação
        </p>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Daily Visitors Trend */}
        <Card className="hover-lift">
          <CardHeader>
            <CardTitle className="text-lg font-semibold gradient-text">
              Visitantes por Dia
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={dailyVisitors}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="day" stroke="#666" />
                <YAxis stroke="#666" />
                <Tooltip content={<CustomTooltip />} />
                <Area 
                  type="monotone" 
                  dataKey="visitors" 
                  stroke="#9BC8EF" 
                  fill="#9BC8EF" 
                  fillOpacity={0.3}
                  strokeWidth={3}
                />
                <Area 
                  type="monotone" 
                  dataKey="newVisitors" 
                  stroke="#7BB3E8" 
                  fill="#7BB3E8" 
                  fillOpacity={0.5}
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Age Groups */}
        <Card className="hover-lift">
          <CardHeader>
            <CardTitle className="text-lg font-semibold gradient-text">
              Distribuição por Idade
            </CardTitle>
          </CardHeader>
          <CardContent>
            {ageGroups.filter(g => g.value > 0).length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={ageGroups.filter(g => g.value > 0)}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {ageGroups.filter(g => g.value > 0).map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-center text-gray-400 py-20">Nenhum dado de faixa etária disponível.</div>
            )}
          </CardContent>
        </Card>

        {/* Weekly Comparison */}
        <Card className="hover-lift">
          <CardHeader>
            <CardTitle className="text-lg font-semibold gradient-text">
              Comparativo Semanal
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={weeklyComparison}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="week" stroke="#666" />
                <YAxis stroke="#666" />
                <Tooltip />
                <Legend />
                <Bar dataKey="current" name="Mês Atual" fill="#9BC8EF" radius={[4, 4, 0, 0]} />
                <Bar dataKey="previous" name="Mês Anterior" fill="#7BB3E8" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Monthly Trend */}
        <Card className="hover-lift">
          <CardHeader>
            <CardTitle className="text-lg font-semibold gradient-text">
              Tendência Mensal
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" stroke="#666" />
                <YAxis stroke="#666" />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="visitors" 
                  stroke="#9BC8EF" 
                  strokeWidth={4}
                  dot={{ fill: '#9BC8EF', strokeWidth: 2, r: 6 }}
                  activeDot={{ r: 8, stroke: '#9BC8EF', strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Performance Summary */}
      <Card className="glass-effect hover-lift">
        <CardHeader>
          <CardTitle className="text-xl font-semibold gradient-text">
            Análise de Performance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-4 gap-6">
            <div className="text-center p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl">
              <div className="text-xl font-bold text-blue-600 mb-1">Pico</div>
              <div className="text-sm text-gray-600">Dia {String(performance.peakDay)}</div>
              <div className="text-xs text-gray-500">{performance.peakValue} visitantes</div>
            </div>
            <div className="text-center p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl">
              <div className="text-xl font-bold text-green-600 mb-1">Média</div>
              <div className="text-sm text-gray-600">{performance.avg}/dia</div>
              <div className="text-xs text-gray-500">Crescimento {performance.trendPercent}</div>
            </div>
            <div className="text-center p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl">
              <div className="text-xl font-bold text-purple-600 mb-1">Menor</div>
              <div className="text-sm text-gray-600">Dia {String(performance.minDay)}</div>
              <div className="text-xs text-gray-500">{performance.minValue} visitantes</div>
            </div>
            <div className="text-center p-4 bg-gradient-to-r from-orange-50 to-yellow-50 rounded-xl">
              <div className="text-xl font-bold text-orange-600 mb-1">Tendência</div>
              <div className="text-sm text-gray-600">{performance.trend}</div>
              <div className="text-xs text-gray-500">{performance.trendPercent}</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReportCharts;
