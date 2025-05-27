import React, { useState } from 'react';
import { ArrowLeft, Calendar, TrendingUp, Users, Download, Filter, RefreshCw, Eye, BarChart3, PieChart, LineChart, MapPin } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import ReportCharts from './report/ReportCharts';
import ReportMetrics from './report/ReportMetrics';
import ReportComparison from './report/ReportComparison';
import ReportInsights from './report/ReportInsights';
import ReportMap from './report/ReportMap';

interface MonthlyReportProps {
  onNavigate: (view: string) => void;
}

const MonthlyReport: React.FC<MonthlyReportProps> = ({ onNavigate }) => {
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [isGenerating, setIsGenerating] = useState(false);

  const months = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => currentYear - i);

  const handleGenerateReport = async () => {
    setIsGenerating(true);
    // Simular geração de relatório
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsGenerating(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => onNavigate('dashboard')}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-2xl font-playfair font-bold text-gray-900">
                  Relatório Mensal
                </h1>
                <p className="text-gray-600">
                  Análise detalhada de {months[selectedMonth]} {selectedYear}
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              {/* Month/Year Selector */}
              <div className="flex items-center space-x-2">
                <select
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
                  className="input-church text-sm"
                >
                  {months.map((month, index) => (
                    <option key={index} value={index}>{month}</option>
                  ))}
                </select>
                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                  className="input-church text-sm"
                >
                  {years.map(year => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
              </div>

              <button
                onClick={handleGenerateReport}
                disabled={isGenerating}
                className="btn-church flex items-center space-x-2"
              >
                {isGenerating ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <Download className="w-4 h-4" />
                )}
                <span>{isGenerating ? 'Gerando...' : 'Exportar'}</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="p-6">
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 lg:w-[750px]">
            <TabsTrigger value="overview" className="flex items-center space-x-2 text-gray-800">
              <BarChart3 className="w-4 h-4" />
              <span>Visão Geral</span>
            </TabsTrigger>
            <TabsTrigger value="charts" className="flex items-center space-x-2 text-gray-800">
              <LineChart className="w-4 h-4" />
              <span>Gráficos</span>
            </TabsTrigger>
            <TabsTrigger value="map" className="flex items-center space-x-2 text-gray-800">
              <MapPin className="w-4 h-4" />
              <span>Mapa</span>
            </TabsTrigger>
            <TabsTrigger value="comparison" className="flex items-center space-x-2 text-gray-800">
              <TrendingUp className="w-4 h-4" />
              <span>Comparativo</span>
            </TabsTrigger>
            <TabsTrigger value="insights" className="flex items-center space-x-2 text-gray-800">
              <Eye className="w-4 h-4" />
              <span>Insights</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <ReportMetrics selectedMonth={selectedMonth} selectedYear={selectedYear} />
          </TabsContent>

          <TabsContent value="charts" className="space-y-6">
            <ReportCharts selectedMonth={selectedMonth} selectedYear={selectedYear} />
          </TabsContent>

          <TabsContent value="map" className="space-y-6">
            <ReportMap selectedMonth={selectedMonth} selectedYear={selectedYear} />
          </TabsContent>

          <TabsContent value="comparison" className="space-y-6">
            <ReportComparison selectedMonth={selectedMonth} selectedYear={selectedYear} />
          </TabsContent>

          <TabsContent value="insights" className="space-y-6">
            <ReportInsights selectedMonth={selectedMonth} selectedYear={selectedYear} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default MonthlyReport;
