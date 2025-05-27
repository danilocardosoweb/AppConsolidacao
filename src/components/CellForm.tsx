import React, { useState } from 'react';
import { ArrowLeft, User, Phone, MapPin, Calendar, Check, Users, Clock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface CellFormProps {
  onNavigate: (view: string) => void;
}

const CellForm: React.FC<CellFormProps> = ({ onNavigate }) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    nomeLider: '',
    geracao: '',
    cep: '',
    diaSemana: '',
    horario: '',
    bairro: '',
    cidade: '',
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleCepChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const cep = e.target.value.replace(/\D/g, ''); // Remove caracteres não numéricos
    handleInputChange('cep', cep);

    if (cep.length === 8) {
      try {
        const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
        const data = await response.json();

        if (data.erro) {
          toast({
            title: "CEP não encontrado",
            description: "Por favor, verifique o CEP digitado.",
            variant: "destructive",
          });
          setFormData(prev => ({ ...prev, bairro: '', cidade: '' }));
        } else {
          setFormData(prev => ({
            ...prev,
            bairro: data.bairro || '',
            cidade: data.localidade || '',
          }));
        }
      } catch (error) {
        console.error('Erro ao buscar CEP:', error);
        toast({
          title: "Erro na busca de CEP",
          description: "Não foi possível buscar o endereço. Tente novamente.",
          variant: "destructive",
        });
        setFormData(prev => ({ ...prev, bairro: '', cidade: '' }));
      }
    }
    else {
      setFormData(prev => ({ ...prev, bairro: '', cidade: '' }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    console.log('Dados da célula:', formData);

    // TODO: Implementar envio dos dados para o Supabase

    toast({
      title: "Célula cadastrada com sucesso! 🎉",
      description: `${formData.nomeLider} agora lidera uma célula.`,}
    );

    // Reset form
    setFormData({
      nomeLider: '',
      geracao: '',
      cep: '',
      diaSemana: '',
      horario: '',
      bairro: '',
      cidade: '',
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="px-6 py-4">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => onNavigate('dashboard')}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-2xl font-playfair font-bold text-gray-900">Cadastro de Célula</h1>
              <p className="text-gray-600">Preencha os dados da nova célula</p>
            </div>
          </div>
        </div>
      </header>

      <div className="p-6">
        <div className="max-w-2xl mx-auto">
          {/* Form */}
          <div className="bg-white rounded-2xl shadow-xl border p-8 animate-scale-in">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-playfair font-bold gradient-text mb-2">
                  Dados da Célula
                </h2>
                <p className="text-gray-600">Informações essenciais para o cadastro</p>
              </div>

              {/* Nome do Líder */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nome do Líder *
                </label>
                <input
                  type="text"
                  required
                  value={formData.nomeLider}
                  onChange={(e) => handleInputChange('nomeLider', e.target.value)}
                  className="input-church"
                  placeholder="Nome completo do líder"
                />
              </div>

              {/* Geração */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Geração *
                </label>
                <select
                  required
                  value={formData.geracao}
                  onChange={(e) => handleInputChange('geracao', e.target.value)}
                  className="input-church"
                >
                  <option value="">Selecione</option>
                  <option value="Atos">Atos</option>
                  <option value="Efraim">Efraim</option>
                  <option value="Israel">Israel</option>
                  <option value="José">José</option>
                  <option value="Josué">Josué</option>
                  <option value="Kairós">Kairós</option>
                  <option value="Levi">Levi</option>
                  <option value="Moriah">Moriah</option>
                  <option value="Rafah">Rafah</option>
                  <option value="Samuel">Samuel</option>
                  <option value="Zion">Zion</option>
                  <option value="Zoe">Zoe</option>
                  <option value="Prs Noboyoki e Samara">Prs Noboyoki e Samara</option>
                  <option value="Vida Nova Amanda">Vida Nova Amanda</option>
                  <option value="Vida Nova Socoro">Vida Nova Socoro</option>
                  <option value="Outras Igrejas">Outras Igrejas</option>
                </select>
              </div>

              {/* CEP */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  CEP da Célula
                </label>
                <input
                  type="text"
                  value={formData.cep}
                  onChange={handleCepChange}
                  className="input-church"
                  placeholder="CEP da casa (Opcional)"
                />
              </div>

              {/* Bairro */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bairro
                </label>
                <input
                  type="text"
                  value={formData.bairro}
                  onChange={(e) => handleInputChange('bairro', e.target.value)}
                  className="input-church"
                  placeholder="Bairro (Preenchido automaticamente pelo CEP)"
                  disabled
                />
              </div>

              {/* Cidade */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cidade *
                </label>
                <input
                  type="text"
                  required
                  value={formData.cidade}
                  onChange={(e) => handleInputChange('cidade', e.target.value)}
                  className="input-church"
                  placeholder="Cidade (Preenchido automaticamente pelo CEP)"
                  disabled
                />
              </div>

              {/* Dia da Célula */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Dia da Célula *
                </label>
                <select
                  required
                  value={formData.diaSemana}
                  onChange={(e) => handleInputChange('diaSemana', e.target.value)}
                  className="input-church"
                >
                  <option value="">Selecione</option>
                  <option value="Segunda-feira">Segunda-feira</option>
                  <option value="Terça-feira">Terça-feira</option>
                  <option value="Quarta-feira">Quarta-feira</option>
                  <option value="Quinta-feira">Quinta-feira</option>
                  <option value="Sexta-feira">Sexta-feira</option>
                  <option value="Sábado">Sábado</option>
                  <option value="Domingo">Domingo</option>
                </select>
              </div>

              {/* Horário da Célula */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Horário da Célula *
                </label>
                <input
                  type="time"
                  required
                  value={formData.horario}
                  onChange={(e) => handleInputChange('horario', e.target.value)}
                  className="input-church"
                />
              </div>

              {/* Submit Button */}
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="btn-church text-lg px-8 py-4 flex items-center space-x-3"
                >
                  <Check className="w-6 h-6" />
                  <span>Cadastrar Célula</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CellForm; 