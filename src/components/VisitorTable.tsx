import React, { useState, useEffect } from 'react';
import { Eye, Edit, Trash2, Mail, Phone, MapPin, Users } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

// Interface para representar um visitante
export interface Visitor {
  id: string;
  name: string;
  address: string;
  created_at: string;
  metadata: {
    telefone?: string;
    cidade?: string;
    bairro?: string;
    genero?: string;
    faixa_etaria?: string;
    como_conheceu?: string;
    nome_pessoa_convidou?: string;
    nome_consolidador?: string;
    observacoes?: string;
    geracaoAmigoConvidou?: string;
  };
  visit_count: number;
  is_new_visitor: boolean;
  status?: string;
}

interface VisitorTableProps {
  searchTerm: string;
  filters?: {
    genero: string;
    cidade: string;
    faixaEtaria: string;
    status: string;
  };
  onView?: (visitor: Visitor) => void;
  onEdit?: (visitor: Visitor) => void;
  onDelete?: (visitor: Visitor) => void;
}

const VisitorTable: React.FC<VisitorTableProps> = ({
  searchTerm,
  filters = { genero: '', cidade: '', faixaEtaria: '', status: '' },
  onView = () => {},
  onEdit = () => {},
  onDelete = () => {}
}) => {
  const [visitors, setVisitors] = useState<Visitor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Buscar visitantes do Supabase
  useEffect(() => {
    const fetchVisitors = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('visitors')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Erro ao buscar visitantes:', error);
          setError('Erro ao carregar visitantes. Tente novamente mais tarde.');
          return;
        }


        setVisitors(data || []);
      } catch (err) {
        console.error('Erro inesperado:', err);
        setError('Ocorreu um erro inesperado ao carregar os dados.');
      } finally {
        setLoading(false);
      }
    };

    fetchVisitors();
  }, []);

  // Filtrar visitantes com base no termo de busca
  const filteredVisitors = visitors.filter(visitor => {
    if (!searchTerm &&
        !filters.genero &&
        !filters.cidade &&
        !filters.faixaEtaria &&
        !filters.status) return true;

    const searchLower = searchTerm.toLowerCase();
    const matchesSearch =
      visitor.name.toLowerCase().includes(searchLower) ||
      visitor.metadata?.telefone?.toLowerCase().includes(searchLower) ||
      visitor.metadata?.cidade?.toLowerCase().includes(searchLower) ||
      visitor.metadata?.bairro?.toLowerCase().includes(searchLower);

    const matchesGenero = !filters.genero || visitor.metadata?.genero === filters.genero;
    const matchesCidade = !filters.cidade || (visitor.metadata?.cidade || '').toLowerCase().includes(filters.cidade.toLowerCase());
    const matchesFaixa = !filters.faixaEtaria || visitor.metadata?.faixa_etaria === filters.faixaEtaria;
    const matchesStatus = !filters.status ||
      (filters.status === 'Novo' && visitor.is_new_visitor) ||
      (filters.status === 'Retornou' && !visitor.is_new_visitor);

    return matchesSearch && matchesGenero && matchesCidade && matchesFaixa && matchesStatus;
  });

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'Novo':
        return 'bg-blue-100 text-blue-800';
      case 'Pendente':
        return 'bg-yellow-100 text-yellow-800';
      case 'Contatado':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (isNew: boolean) => {
    return isNew ? 'Novo' : 'Retornou';
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-church-primary"></div>
        <span className="ml-2">Carregando visitantes...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border-l-4 border-red-400 p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (filteredVisitors.length === 0) {
    return (
      <div className="text-center py-12">
        <svg
          className="mx-auto h-12 w-12 text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
        <h3 className="mt-2 text-sm font-medium text-gray-900">Nenhum visitante encontrado</h3>
        <p className="mt-1 text-sm text-gray-500">
          {searchTerm ? 'Nenhum resultado para a busca. Tente novamente.' : 'Ainda não há visitantes cadastrados.'}
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Nome
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Contato
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Localização
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Geração
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Data do Cadastro
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Dia da Semana
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ações
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredVisitors.map((visitor) => {
              const diasSemana = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
              const diaSemana = diasSemana[new Date(visitor.created_at).getDay()];
              return (
                <tr key={visitor.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                        <Users className="h-5 w-5 text-indigo-500" />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{visitor.name}</div>
                        <div className="text-sm text-gray-500">
                          {visitor.metadata?.genero && `${visitor.metadata.genero} • `}
                          {visitor.metadata?.faixa_etaria}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-col space-y-1">
                      {visitor.metadata?.telefone && (
                        <div className="flex items-center text-sm text-gray-900">
                          <Phone className="h-4 w-4 mr-2 text-gray-400" />
                          {visitor.metadata.telefone}
                        </div>
                      )}
                      {visitor.metadata?.como_conheceu && (
                        <div className="flex items-center text-sm text-gray-500">
                          <Users className="h-4 w-4 mr-2 text-gray-400" />
                          {visitor.metadata.como_conheceu}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-col space-y-1">
                      <div className="flex items-center text-sm text-gray-900">
                        <MapPin className="h-4 w-4 mr-2 text-gray-400 flex-shrink-0" />
                        <span>{visitor.metadata?.bairro || 'N/A'}</span>
                      </div>
                      <div className="text-sm text-gray-500 ml-6">
                        {visitor.metadata?.cidade || 'N/A'}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {visitor.metadata?.geracaoAmigoConvidou || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(visitor.created_at)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {diaSemana}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(visitor.status)}`}>
                      {visitor.status || 'Novo'}
                    </span>
                    <div className="text-xs text-gray-500 mt-1">
                      {visitor.visit_count} {visitor.visit_count === 1 ? 'visita' : 'visitas'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <button 
                        onClick={() => onView(visitor)}
                        className="text-church-primary hover:text-church-secondary p-1 rounded-lg hover:bg-church-primary/10 transition-colors"
                        title="Visualizar"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => onEdit(visitor)}
                        className="text-blue-600 hover:text-blue-800 p-1 rounded-lg hover:bg-blue-50 transition-colors"
                        title="Editar"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => onDelete(visitor)}
                        className="text-red-600 hover:text-red-800 p-1 rounded-lg hover:bg-red-50 transition-colors"
                        title="Excluir"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Exporta o componente
export default VisitorTable;
