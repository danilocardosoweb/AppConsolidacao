import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { ArrowLeft } from 'lucide-react';
import { Visitor } from './VisitorTable';

interface VisitorDetailsProps {
  id: string;
  onNavigate: (view: string) => void;
}

const VisitorDetails: React.FC<VisitorDetailsProps> = ({ id, onNavigate }) => {
  const [visitor, setVisitor] = useState<Visitor | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchVisitor = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('visitors')
        .select('*')
        .eq('id', id)
        .single();
      if (error) {
        setError('Erro ao buscar visitante.');
      } else {
        setVisitor(data);
      }
      setLoading(false);
    };
    fetchVisitor();
  }, [id]);

  if (loading) return <div className="p-8 text-center">Carregando visitante...</div>;
  if (error || !visitor) return <div className="p-8 text-center text-red-600">{error || 'Visitante não encontrado.'}</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <header className="bg-white shadow-sm border-b">
        <div className="px-6 py-4 flex items-center space-x-4">
          <button onClick={() => onNavigate('dashboard')} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-2xl font-bold text-gray-900">Detalhes do Visitante</h1>
        </div>
      </header>
      <div className="max-w-xl mx-auto bg-white rounded-xl shadow-md p-8 mt-8">
        <h2 className="text-xl font-semibold mb-4">{visitor.name}</h2>
        <div className="mb-2"><b>Gênero:</b> {visitor.metadata?.genero || '-'}</div>
        <div className="mb-2"><b>Telefone:</b> {visitor.metadata?.telefone || '-'}</div>
        <div className="mb-2"><b>Cidade:</b> {visitor.metadata?.cidade || '-'}</div>
        <div className="mb-2"><b>Bairro:</b> {visitor.metadata?.bairro || '-'}</div>
        <div className="mb-2"><b>Faixa Etária:</b> {visitor.metadata?.faixa_etaria || '-'}</div>
        <div className="mb-2"><b>Como conheceu:</b> {visitor.metadata?.como_conheceu || '-'}</div>
        <div className="mb-2"><b>Nome do Amigo que Convidou:</b> {visitor.metadata?.nome_pessoa_convidou || '-'}</div>
        <div className="mb-2"><b>Nome do Consolidador:</b> {visitor.metadata?.nome_consolidador || '-'}</div>
        <div className="mb-2"><b>Observações do Consolidador:</b> {visitor.metadata?.observacoes || '-'}</div>
        <div className="mb-2"><b>Data de cadastro:</b> {new Date(visitor.created_at).toLocaleString('pt-BR')}</div>
        <div className="mb-2"><b>Status:</b> {visitor.status || 'Novo'}</div>
        <div className="mb-2"><b>Visitas:</b> {visitor.visit_count}</div>
        <button onClick={() => onNavigate('dashboard')} className="mt-6 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Voltar</button>
      </div>
    </div>
  );
};

export default VisitorDetails; 