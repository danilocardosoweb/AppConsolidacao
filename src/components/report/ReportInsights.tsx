
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Lightbulb, Award, AlertTriangle, Target, TrendingUp, Users, Calendar, Star } from 'lucide-react';

interface ReportInsightsProps {
  selectedMonth: number;
  selectedYear: number;
}

const ReportInsights: React.FC<ReportInsightsProps> = ({ selectedMonth, selectedYear }) => {
  const months = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];

  const insights = [
    {
      type: 'achievement',
      icon: Award,
      title: 'Meta Superada!',
      description: 'Alcançamos 118% da meta mensal de visitantes, com destaque para o crescimento de novos membros.',
      impact: 'Alto',
      color: 'from-green-500 to-green-600'
    },
    {
      type: 'opportunity',
      icon: Lightbulb,
      title: 'Oportunidade de Crescimento',
      description: 'Domingos pela manhã apresentam 40% mais visitantes. Considerar programação especial.',
      impact: 'Médio',
      color: 'from-blue-500 to-blue-600'
    },
    {
      type: 'attention',
      icon: AlertTriangle,
      title: 'Ponto de Atenção',
      description: 'Queda de 15% nas visitas de terça-feira. Investigar possíveis causas.',
      impact: 'Baixo',
      color: 'from-orange-500 to-orange-600'
    },
    {
      type: 'trend',
      icon: TrendingUp,
      title: 'Tendência Positiva',
      description: 'Crescimento consistente de 18% nos últimos 3 meses indica momentum sustentável.',
      impact: 'Alto',
      color: 'from-purple-500 to-purple-600'
    }
  ];

  const recommendations = [
    {
      category: 'Engajamento',
      icon: Users,
      title: 'Programa de Mentoria',
      description: 'Implementar sistema de mentoria para novos visitantes aumentaria retenção em 25%.',
      priority: 'Alta',
      effort: 'Médio'
    },
    {
      category: 'Eventos',
      icon: Calendar,
      title: 'Eventos Especiais',
      description: 'Organizar eventos temáticos mensais para manter o engajamento alto.',
      priority: 'Média',
      effort: 'Alto'
    },
    {
      category: 'Comunicação',
      icon: Target,
      title: 'Newsletter Semanal',
      description: 'Criar comunicação regular para manter visitantes informados e engajados.',
      priority: 'Média',
      effort: 'Baixo'
    }
  ];

  const keyFindings = [
    {
      finding: 'Pico de visitação',
      detail: 'Domingos às 10h concentram 35% dos visitantes semanais',
      actionable: true
    },
    {
      finding: 'Faixa etária predominante',
      detail: '26-35 anos representa 35% do total de visitantes',
      actionable: true
    },
    {
      finding: 'Taxa de retorno',
      detail: '64% dos visitantes retornam dentro de 30 dias',
      actionable: false
    },
    {
      finding: 'Sazonalidade',
      detail: 'Crescimento de 23% comparado ao mesmo período do ano anterior',
      actionable: false
    }
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Alta': return 'text-red-600 bg-red-50';
      case 'Média': return 'text-orange-600 bg-orange-50';
      case 'Baixa': return 'text-green-600 bg-green-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'Alto': return 'text-green-600 bg-green-50';
      case 'Médio': return 'text-orange-600 bg-orange-50';
      case 'Baixo': return 'text-blue-600 bg-blue-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-playfair font-bold gradient-text mb-2">
          Insights & Recomendações
        </h2>
        <p className="text-gray-600">
          Análise inteligente dos dados de {months[selectedMonth]} {selectedYear}
        </p>
      </div>

      {/* Key Insights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {insights.map((insight, index) => (
          <Card key={index} className="hover-lift animate-scale-in" style={{ animationDelay: `${index * 100}ms` }}>
            <CardHeader className="pb-3">
              <div className="flex items-center space-x-3">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${insight.color} flex items-center justify-center`}>
                  <insight.icon className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <CardTitle className="text-lg font-semibold text-gray-800">
                    {insight.title}
                  </CardTitle>
                  <div className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getImpactColor(insight.impact)}`}>
                    Impacto {insight.impact}
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 leading-relaxed">
                {insight.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recommendations */}
      <Card className="glass-effect hover-lift">
        <CardHeader>
          <CardTitle className="text-xl font-semibold gradient-text flex items-center space-x-2">
            <Star className="w-6 h-6" />
            <span>Recomendações Estratégicas</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recommendations.map((rec, index) => (
              <div key={index} className="p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                    <rec.icon className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-gray-800">{rec.title}</h3>
                      <div className="flex space-x-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(rec.priority)}`}>
                          {rec.priority}
                        </span>
                        <span className="px-2 py-1 rounded-full text-xs font-medium text-gray-600 bg-gray-100">
                          Esforço: {rec.effort}
                        </span>
                      </div>
                    </div>
                    <p className="text-gray-600 text-sm mb-2">{rec.description}</p>
                    <div className="text-xs text-blue-600 font-medium">
                      Categoria: {rec.category}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Key Findings */}
      <Card className="glass-effect hover-lift">
        <CardHeader>
          <CardTitle className="text-xl font-semibold gradient-text">
            Principais Descobertas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            {keyFindings.map((finding, index) => (
              <div key={index} className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-800 mb-1">
                      {finding.finding}
                    </h4>
                    <p className="text-gray-600 text-sm">
                      {finding.detail}
                    </p>
                  </div>
                  {finding.actionable && (
                    <div className="ml-2">
                      <span className="inline-block w-2 h-2 bg-green-500 rounded-full"></span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-4 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl">
            <div className="flex items-center space-x-2 mb-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm font-medium text-green-700">Acionável</span>
            </div>
            <p className="text-sm text-gray-600">
              Insights marcados podem ser transformados em ações concretas para melhorar os resultados.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Action Plan */}
      <Card className="glass-effect hover-lift">
        <CardHeader>
          <CardTitle className="text-xl font-semibold gradient-text">
            Plano de Ação para o Próximo Mês
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid md:grid-cols-3 gap-4">
              <div className="p-4 border-l-4 border-green-500 bg-green-50">
                <h4 className="font-semibold text-green-800 mb-2">Curto Prazo (1-2 semanas)</h4>
                <ul className="text-sm text-green-700 space-y-1">
                  <li>• Implementar newsletter semanal</li>
                  <li>• Analisar queda nas terças-feiras</li>
                  <li>• Otimizar horários de domingo</li>
                </ul>
              </div>
              
              <div className="p-4 border-l-4 border-orange-500 bg-orange-50">
                <h4 className="font-semibold text-orange-800 mb-2">Médio Prazo (3-4 semanas)</h4>
                <ul className="text-sm text-orange-700 space-y-1">
                  <li>• Lançar programa de mentoria</li>
                  <li>• Planejar evento temático</li>
                  <li>• Criar conteúdo para jovens adultos</li>
                </ul>
              </div>
              
              <div className="p-4 border-l-4 border-blue-500 bg-blue-50">
                <h4 className="font-semibold text-blue-800 mb-2">Longo Prazo (1-3 meses)</h4>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• Expandir programação semanal</li>
                  <li>• Implementar sistema de feedback</li>
                  <li>• Desenvolver app móvel</li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReportInsights;
