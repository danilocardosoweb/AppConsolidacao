import React, { useState, useEffect } from 'react';
import { ArrowLeft, Users, UserCheck, Calendar, TrendingUp, Plus, Search, Filter, Settings, Download, FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import StatsCard from './StatsCard';
import VisitorTable from './VisitorTable';
import { supabase } from '@/integrations/supabase/client';

interface Visitor {
  id: string;
  name?: string;
  contact?: string;
  location?: string;
  registration_date?: string;
  status?: string;
  is_new_visitor: boolean;
  // Adicione outros campos conforme necessário
}

interface DashboardProps {
  onNavigate: (view: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onNavigate }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [visitorToDelete, setVisitorToDelete] = useState<Visitor | null>(null);
  const [showConfirmDeleteModal, setShowConfirmDeleteModal] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [filters, setFilters] = useState({
    genero: '',
    cidade: '',
    faixaEtaria: '',
    status: ''
  });
  const { toast } = useToast();
  const navigate = useNavigate();
  const [totalVisitantes, setTotalVisitantes] = useState(0);
  const [visitantesHoje, setVisitantesHoje] = useState(0);
  const [visitantesMes, setVisitantesMes] = useState(0);
  const [crescimento, setCrescimento] = useState(0);
  const [crescimentoPercent, setCrescimentoPercent] = useState(0);

  // Verifica se o hook foi inicializado corretamente
  if (!toast) {
    console.error('useToast hook not initialized correctly');
  }
  
  if (!navigate) {
    console.error('useNavigate hook not initialized correctly');
  }

  useEffect(() => {
    async function fetchStats() {
      // Buscar todos os visitantes
      const { data: all, error: allError } = await supabase
        .from('visitors')
        .select('id, created_at');
      if (allError) return;
      setTotalVisitantes(all.length);

      // Visitantes Hoje
      const hoje = new Date();
      const hojeStr = hoje.toISOString().slice(0, 10);
      const visitantesHojeCount = all.filter(v => v.created_at.slice(0, 10) === hojeStr).length;
      setVisitantesHoje(visitantesHojeCount);

      // Visitantes Este Mês
      const mesAtual = hoje.getMonth();
      const anoAtual = hoje.getFullYear();
      const visitantesMesCount = all.filter(v => {
        const d = new Date(v.created_at);
        return d.getMonth() === mesAtual && d.getFullYear() === anoAtual;
      }).length;
      setVisitantesMes(visitantesMesCount);

      // Visitantes Mês Anterior
      const mesAnterior = mesAtual === 0 ? 11 : mesAtual - 1;
      const anoMesAnterior = mesAtual === 0 ? anoAtual - 1 : anoAtual;
      const visitantesMesAnterior = all.filter(v => {
        const d = new Date(v.created_at);
        return d.getMonth() === mesAnterior && d.getFullYear() === anoMesAnterior;
      }).length;

      // Crescimento absoluto e percentual
      setCrescimento(visitantesMesCount - visitantesMesAnterior);
      setCrescimentoPercent(visitantesMesAnterior > 0 ? Math.round(((visitantesMesCount - visitantesMesAnterior) / visitantesMesAnterior) * 100) : 100);
    }
    fetchStats();
  }, []);

  // Função para visualizar os detalhes de um visitante
  const handleViewVisitor = (visitor: Visitor) => {
    // Navega para a página de visualização do visitante
    onNavigate(`visitor/${visitor.id}`);
  };

  // Função para editar um visitante
  const handleEditVisitor = (visitor: Visitor) => {
    // Navega para a página de edição do visitante
    onNavigate(`edit-visitor/${visitor.id}`);
  };

  // Função para solicitar confirmação de exclusão
  const requestDeleteConfirmation = (visitor: Visitor) => {
    setVisitorToDelete(visitor);
    setShowConfirmDeleteModal(true);
  };

  // Função para cancelar a exclusão
  const cancelDelete = () => {
    setVisitorToDelete(null);
    setShowConfirmDeleteModal(false);
  };

  // Função para excluir um visitante
  const handleDeleteVisitor = async () => {
    if (!visitorToDelete) return;

    try {
      const { error } = await supabase
        .from('visitors')
        .delete()
        .eq('id', visitorToDelete.id);

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Visitante excluído com sucesso!",
      });

      // Fechar modal e limpar estado
      setVisitorToDelete(null);
      setShowConfirmDeleteModal(false);

      // Recarrega a página ou atualiza a lista diretamente
      // Por enquanto, recarrega a página. Podemos melhorar isso depois.
      window.location.reload();
    } catch (error) {
      console.error('Erro ao excluir visitante:', error);
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao excluir o visitante.",
        variant: "destructive",
      });
      // Fechar modal em caso de erro também
      setVisitorToDelete(null);
      setShowConfirmDeleteModal(false);
    }
  };

  const stats = [
    {
      title: 'Total de Visitantes',
      value: totalVisitantes.toLocaleString('pt-BR'),
      icon: Users,
      trend: '',
      trendUp: true,
      color: 'from-blue-500 to-blue-600'
    },
    {
      title: 'Visitantes Hoje',
      value: visitantesHoje.toLocaleString('pt-BR'),
      icon: UserCheck,
      trend: '',
      trendUp: true,
      color: 'from-green-500 to-green-600'
    },
    {
      title: 'Este Mês',
      value: visitantesMes.toLocaleString('pt-BR'),
      icon: Calendar,
      trend: '',
      trendUp: crescimento >= 0,
      color: 'from-purple-500 to-purple-600'
    },
    {
      title: 'Crescimento',
      value: `${crescimento >= 0 ? '+' : ''}${crescimentoPercent}%`,
      icon: TrendingUp,
      trend: '',
      trendUp: crescimentoPercent >= 0,
      color: 'from-orange-500 to-orange-600'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => onNavigate('home')}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-2xl font-playfair font-bold text-gray-900">Dashboard</h1>
                <p className="text-gray-600">Gerencie visitantes e visualize estatísticas</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => onNavigate('monthly-report')}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-600 hover:text-church-primary"
                title="Relatório Mensal"
              >
                <FileText className="w-5 h-5" />
              </button>
              <button
                onClick={() => onNavigate('export')}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-600 hover:text-church-primary"
                title="Exportar Dados"
              >
                <Download className="w-5 h-5" />
              </button>
              <button
                onClick={() => onNavigate('settings')}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-600 hover:text-church-primary"
              >
                <Settings className="w-5 h-5" />
              </button>
              <button
                onClick={() => onNavigate('register')}
                className="btn-church flex items-center space-x-2"
              >
                <Plus className="w-5 h-5" />
                <span>Novo Visitante</span>
              </button>
              <button
                onClick={() => onNavigate('cells-register')}
                className="btn-church flex items-center space-x-2"
              >
                <Plus className="w-5 h-5" />
                <span>Cadastrar Célula</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="p-6 space-y-8">
        {/* Stats Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <div key={stat.title} className="animate-scale-in" style={{ animationDelay: `${index * 100}ms` }}>
              <StatsCard {...stat} />
            </div>
          ))}
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-2xl shadow-sm border p-6">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Lista de Visitantes</h2>
            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Buscar visitantes..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-church-primary/50 focus:border-church-primary w-full sm:w-64"
                />
              </div>
              <button
                className="flex items-center space-x-2 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                onClick={() => setShowFilterModal(true)}
              >
                <Filter className="w-4 h-4" />
                <span>Filtros</span>
              </button>
            </div>
          </div>

          {/* Visitors Table */}
          <VisitorTable
            searchTerm={searchTerm}
            filters={filters}
            onView={handleViewVisitor}
            onEdit={handleEditVisitor}
            onDelete={requestDeleteConfirmation}
          />
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-6">
          <div 
            onClick={() => onNavigate('monthly-report')}
            className="bg-gradient-to-r from-church-primary to-church-secondary rounded-2xl p-6 text-white hover-lift cursor-pointer"
          >
            <h3 className="text-lg font-semibold mb-2">Relatório Mensal</h3>
            <p className="text-white/90 mb-4">Análises detalhadas com insights inteligentes</p>
            <button className="bg-white/20 px-4 py-2 rounded-lg hover:bg-white/30 transition-colors">
              Visualizar Relatório
            </button>
          </div>

          <div 
            onClick={() => onNavigate('export')}
            className="bg-gradient-to-r from-green-500 to-green-600 rounded-2xl p-6 text-white hover-lift cursor-pointer"
          >
            <h3 className="text-lg font-semibold mb-2">Exportar Dados</h3>
            <p className="text-white/90 mb-4">Baixe os dados em formato Excel, CSV ou PDF</p>
            <button className="bg-white/20 px-4 py-2 rounded-lg hover:bg-white/30 transition-colors">
              Exportar
            </button>
          </div>

          <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl p-6 text-white hover-lift cursor-pointer">
            <h3 className="text-lg font-semibold mb-2">Configurações</h3>
            <p className="text-white/90 mb-4">Personalize campos e notificações</p>
            <button 
              onClick={() => onNavigate('settings')}
              className="bg-white/20 px-4 py-2 rounded-lg hover:bg-white/30 transition-colors"
            >
              Configurar
            </button>
          </div>
        </div>
      </div>

      {/* Confirmation Modal for Delete */}
      {showConfirmDeleteModal && visitorToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-lg p-6 max-w-sm mx-auto shadow-lg">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Confirmar Exclusão</h3>
            <p className="text-sm text-gray-600 mb-6">
              Tem certeza que deseja excluir o visitante <span className="font-medium">{visitorToDelete.name}</span>? Esta ação não pode ser desfeita.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={cancelDelete}
                className="px-4 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleDeleteVisitor}
                className="px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700 transition-colors"
              >
                Excluir
              </button>
            </div>
          </div>
        </div>
      )}

      {showFilterModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-xl p-8 shadow-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Filtrar Visitantes</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Gênero</label>
                <select
                  className="input-church w-full"
                  value={filters.genero}
                  onChange={e => setFilters(f => ({ ...f, genero: e.target.value }))}
                >
                  <option value="">Todos</option>
                  <option value="Masculino">Masculino</option>
                  <option value="Feminino">Feminino</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Cidade</label>
                <input
                  className="input-church w-full"
                  value={filters.cidade}
                  onChange={e => setFilters(f => ({ ...f, cidade: e.target.value }))}
                  placeholder="Digite a cidade"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Faixa Etária</label>
                <select
                  className="input-church w-full"
                  value={filters.faixaEtaria}
                  onChange={e => setFilters(f => ({ ...f, faixaEtaria: e.target.value }))}
                >
                  <option value="">Todas</option>
                  <option value="Criança">Criança</option>
                  <option value="Adolescente">Adolescente</option>
                  <option value="Jovem">Jovem</option>
                  <option value="Adulto">Adulto</option>
                  <option value="Melhor idade">Melhor idade</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Status</label>
                <select
                  className="input-church w-full"
                  value={filters.status}
                  onChange={e => setFilters(f => ({ ...f, status: e.target.value }))}
                >
                  <option value="">Todos</option>
                  <option value="Novo">Novo</option>
                  <option value="Retornou">Retornou</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => {
                  setFilters({ genero: '', cidade: '', faixaEtaria: '', status: '' });
                  setShowFilterModal(false);
                }}
                className="px-4 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Limpar
              </button>
              <button
                onClick={() => setShowFilterModal(false)}
                className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition-colors"
              >
                Aplicar
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default Dashboard;
