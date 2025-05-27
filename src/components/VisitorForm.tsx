import React, { FC, useState, useEffect, useRef } from 'react';
import { ArrowLeft, User, Phone, MapPin, Calendar, Check, Users, Heart, Text, Info, Hash, Home, Layers, BookOpen, MessageSquare, FileText } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Toaster } from '@/components/ui/toaster';
import { supabase } from '@/integrations/supabase/client';

interface VisitorFormProps {
  onNavigate: (view: string) => void;
  id?: string;
}

const VisitorForm: FC<VisitorFormProps> = ({ onNavigate, id }) => {
  const { toast } = useToast();
  
  // Estado para armazenar os dados do formulário
  const [formData, setFormData] = useState({
    nomeCompletoVisitante: '',
    genero: '',
    cep: '',
    bairro: '',
    cidade: '',
    faixaEtaria: '',
    geracaoAmigoConvidou: '',
    telefone: '',
    comoConheceu: '',
    nomePessoaConvidou: '',
    nomeConsolidador: '',
    observacoesConsolidador: '',
    status: 'Novo',
  });
  
  // Estados para o autocompletar de cidades
  interface Cidade {
    id: number;
    nome: string;
    microrregiao?: {
      mesorregiao?: {
        UF?: {
          sigla: string;
        };
      };
    };
    municipio?: {
      microrregiao?: {
        mesorregiao?: {
          UF?: {
            sigla: string;
          };
        };
      };
      uf?: {
        sigla: string;
      };
      nome?: string;
    };
    uf?: {
      sigla: string;
    };
  }

  const [cities, setCities] = useState<Cidade[]>([]);
  const [neighborhoods, setNeighborhoods] = useState<string[]>([]);
  
  const [showCityDropdown, setShowCityDropdown] = useState(false);
  
  // Efeito para monitorar alterações no estado cities
  useEffect(() => {
    console.log('Estado cities atualizado. Total de cidades:', cities.length);
    if (cities.length > 0) {
      console.log('Há cidades disponíveis. Atualizando showCityDropdown para true');
      setShowCityDropdown(true);
    } else {
      console.log('Nenhuma cidade disponível. Atualizando showCityDropdown para false');
      setShowCityDropdown(false);
    }
  }, [cities]);
  
  // Efeito para verificar a posição e visibilidade do dropdown quando ele for exibido
  useEffect(() => {
    if (showCityDropdown && dropdownRef.current) {
      // Aguarda um momento para garantir que o DOM foi atualizado
      const timeoutId = setTimeout(() => {
        const dropdown = dropdownRef.current;
        if (dropdown) {
          const rect = dropdown.getBoundingClientRect();
          console.log('Posição do dropdown (useEffect):', {
            top: rect.top,
            left: rect.left,
            width: rect.width,
            height: rect.height,
            isInViewport: rect.top >= 0 && 
                          rect.left >= 0 && 
                          rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) && 
                          rect.right <= (window.innerWidth || document.documentElement.clientWidth)
          });
          
          // Verifica se o dropdown está visível
          const style = window.getComputedStyle(dropdown);
          console.log('Estilos do dropdown:', {
            display: style.display,
            visibility: style.visibility,
            opacity: style.opacity,
            position: style.position,
            zIndex: style.zIndex
          });
        }
      }, 100);
      
      return () => clearTimeout(timeoutId);
    }
  }, [showCityDropdown]);
  
  // Efeito para depurar mudanças no estado showCityDropdown
  useEffect(() => {
    console.log('Estado showCityDropdown alterado para:', showCityDropdown);
  }, [showCityDropdown]);
  const [showNeighborhoodDropdown, setShowNeighborhoodDropdown] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingNeighborhood, setIsLoadingNeighborhood] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [neighborhoodError, setNeighborhoodError] = useState<string | null>(null);
  
  // Refs
  const cityInputRef = useRef<HTMLInputElement>(null);
  const neighborhoodInputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const neighborhoodDropdownRef = useRef<HTMLDivElement>(null);
  const [focusedCityIndex, setFocusedCityIndex] = useState<number>(-1);
  const cityOptionsRef = useRef<HTMLDivElement[]>([]);
  
  // Lista de bairros por cidade
  const cityNeighborhoods: Record<string, string[]> = {
    // São Paulo - SP
    'São Paulo - SP': ['Jardins', 'Moema', 'Itaim Bibi', 'Vila Olímpia', 'Pinheiros', 'Vila Madalena', 'Bela Vista', 'Consolação', 'Paraíso', 'Vila Mariana'],
    // Rio de Janeiro - RJ
    'Rio de Janeiro - RJ': ['Copacabana', 'Ipanema', 'Leblon', 'Barra da Tijuca', 'Botafogo', 'Flamengo', 'Laranjeiras', 'Tijuca', 'Jardim Botânico', 'Gávea'],
    // Belo Horizonte - MG
    'Belo Horizonte - MG': ['Savassi', 'Lourdes', 'Funcionários', 'Santo Antônio', 'Sion', 'Cidade Nova', 'Coração Eucarístico', 'Gutierrez', 'São Pedro', 'Santa Efigênia'],
    // Porto Alegre - RS
    'Porto Alegre - RS': ['Moinhos de Vento', 'Bela Vista', 'Petrópolis', 'Bom Fim', 'Tristeza', 'Menino Deus', 'Cidade Baixa', 'Rio Branco', 'Auxiliadora'],
    // Salvador - BA
    'Salvador - BA': ['Barra', 'Ondina', 'Pituba', 'Rio Vermelho', 'Stella Maris', 'Itaigara', 'Caminho das Árvores', 'Horto Florestal', 'Graça', 'Garcia']
  };
  
  // Estado para armazenar os bairros filtrados por cidade
  const [filteredNeighborhoods, setFilteredNeighborhoods] = useState<string[]>([]);
  
  
  // Limpa o índice focado quando o dropdown é fechado
  useEffect(() => {
    if (!showCityDropdown) {
      setFocusedCityIndex(-1);
    }
  }, [showCityDropdown]);
  
  // Fechar os dropdowns quando clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      console.log('Clique fora detectado. Verificando se foi fora do dropdown de cidades...');
      
      // Verifica se o clique foi fora do dropdown de cidades
      const cityInput = cityInputRef.current;
      const dropdown = dropdownRef.current;
      
      if (dropdown && cityInput && 
          !dropdown.contains(event.target as Node) && 
          !cityInput.contains(event.target as Node)) {
        console.log('Clique fora do dropdown de cidades. Fechando...');
        setShowCityDropdown(false);
      }
      
      // Verifica se o clique foi fora do dropdown de bairros
      const neighborhoodInput = neighborhoodInputRef.current;
      const neighborhoodDropdown = neighborhoodDropdownRef.current;
      
      if (neighborhoodDropdown && neighborhoodInput && 
          !neighborhoodDropdown.contains(event.target as Node) && 
          !neighborhoodInput.contains(event.target as Node)) {
        console.log('Clique fora do dropdown de bairros. Fechando...');
        setShowNeighborhoodDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Efeito para rolar até a cidade focada
  useEffect(() => {
    if (focusedCityIndex >= 0 && cityOptionsRef.current[focusedCityIndex]) {
      cityOptionsRef.current[focusedCityIndex].scrollIntoView({
        behavior: 'smooth',
        block: 'nearest'
      });
    }
  }, [focusedCityIndex]);
  
  // Buscar cidades quando o texto da cidade mudar
  useEffect(() => {
    const fetchCities = async () => {
      const searchTerm = formData.cidade.trim();
      console.log('Iniciando busca de cidades para o termo:', searchTerm);
      setSearchError(null);
      
      // Se o campo estiver vazio ou com menos de 3 caracteres, não faz a busca
      if (!searchTerm || searchTerm.length < 3) {
        console.log('Termo de busca muito curto, limpando cidades');
        setCities([]);
        setShowCityDropdown(false);
        return;
      }

      console.log('Iniciando carregamento de cidades...');
      setIsLoading(true);
      
      try {
        console.log('Buscando cidades para o termo:', searchTerm);
        // Usando a API de localidades que é mais confiável
        const response = await fetch(
          `https://servicodados.ibge.gov.br/api/v1/localidades/municipios`
        );
        
        if (!response.ok) {
          throw new Error(`Erro na requisição: ${response.status} ${response.statusText}`);
        }
        
        const allCities = await response.json();
        console.log('Resposta bruta da API (primeiros 2 itens):', JSON.stringify(allCities.slice(0, 2), null, 2));
        
        if (!Array.isArray(allCities)) {
          console.error('Resposta da API não é um array:', allCities);
          throw new Error('Formato de resposta inesperado da API');
        }
        
        // Filtra as cidades localmente
        const filteredCities = allCities
          .filter((city: any) => {
            if (!city || typeof city !== 'object' || !city.nome) {
              console.log('Cidade inválida ignorada:', city);
              return false;
            }
            const nomeCidade = city.nome.toLowerCase();
            const termoBusca = searchTerm.toLowerCase();
            const incluiTermo = nomeCidade.includes(termoBusca);
            console.log(`Verificando cidade: ${nomeCidade}, inclui '${termoBusca}': ${incluiTermo}`);
            return incluiTermo;
          })
          .map((city: any) => {
            // Extrai a sigla do estado de diferentes locais possíveis na resposta
            let ufSigla = '';
            
            // Tenta obter a sigla do estado de diferentes maneiras
            if (city.microrregiao?.mesorregiao?.UF?.sigla) {
              ufSigla = city.microrregiao.mesorregiao.UF.sigla;
            } else if (city.municipio?.microrregiao?.mesorregiao?.UF?.sigla) {
              ufSigla = city.municipio.microrregiao.mesorregiao.UF.sigla;
            } else if (city.uf?.sigla) {
              ufSigla = city.uf.sigla;
            } else if (city.municipio?.uf?.sigla) {
              ufSigla = city.municipio.uf.sigla;
            }
            
            console.log(`Mapeando cidade: ${city.nome} (ID: ${city.id}), UF: ${ufSigla || 'não encontrada'}`);
            
            return {
              id: city.id,
              nome: city.nome,
              microrregiao: city.microrregiao || city.municipio?.microrregiao,
              uf: ufSigla ? { sigla: ufSigla } : undefined
            };
          })
          .slice(0, 10);
        
        console.log('Cidades filtradas:', filteredCities);
        setCities(filteredCities);
        
        // Só mostra o dropdown se encontrou cidades
        const shouldShowDropdown = filteredCities.length > 0;
        console.log('Resultado da busca - Cidades encontradas:', filteredCities.length, 'Mostrar dropdown?', shouldShowDropdown);
        
        // Atualiza o estado de forma síncrona para evitar problemas de concorrência
        setCities(filteredCities);
        
        // Força uma atualização de estado separada para garantir que o dropdown seja mostrado
        setTimeout(() => {
          console.log('Atualizando showCityDropdown para:', shouldShowDropdown);
          setShowCityDropdown(shouldShowDropdown);
          
          if (shouldShowDropdown) {
            console.log('Dropdown deve estar visível agora');
            setSearchError(null);
          } else {
            console.log('Nenhuma cidade encontrada para o termo:', searchTerm);
            setSearchError('Nenhuma cidade encontrada. Tente outro termo de busca.');
          }
        }, 0);
      } catch (error) {
        console.error('Erro ao buscar cidades:', error);
        const errorMessage = error instanceof Error ? error.message : 'Ocorreu um erro ao buscar as cidades';
        setSearchError(errorMessage);
        setCities([]);
        setShowCityDropdown(false);
      } finally {
        setIsLoading(false);
      }
    };
    
    const timer = setTimeout(() => {
      fetchCities();
    }, 500); // Aumentei o delay para evitar buscas desnecessárias
    
    return () => clearTimeout(timer);
  }, [formData.cidade]);
  
  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Atualiza a busca de bairros em tempo real
    if (field === 'bairro' && value.length >= 2) {
      searchNeighborhoods(value);
    } else if (field === 'bairro') {
      setNeighborhoods([]);
      setShowNeighborhoodDropdown(false);
    }
    
    // Se o campo for cidade, mostrar o dropdown apenas se houver texto
    if (field === 'cidade') {
      setShowCityDropdown(value.length >= 3);
    }
  };
  
  const handleCitySelect = (city: Cidade, index: number = -1) => {
    console.log('Cidade selecionada:', city);
    
    // Extrai a sigla do estado de diferentes locais possíveis na resposta
    let ufSigla = '';
    
    // Tenta obter a sigla do estado de diferentes maneiras
    if (city.microrregiao?.mesorregiao?.UF?.sigla) {
      ufSigla = city.microrregiao.mesorregiao.UF.sigla;
    } else if (city.uf?.sigla) {
      ufSigla = city.uf.sigla;
    } else if (city.municipio?.uf?.sigla) {
      ufSigla = city.municipio.uf.sigla;
    } else if (city.municipio?.microrregiao?.mesorregiao?.UF?.sigla) {
      ufSigla = city.municipio.microrregiao.mesorregiao.UF.sigla;
    }
    
    console.log('Sigla do estado encontrada:', ufSigla || 'não encontrada');
    
    const cidadeFormatada = ufSigla ? `${city.nome} - ${ufSigla}` : city.nome;
    console.log('Cidade formatada:', cidadeFormatada);
    
    setFormData(prev => ({
      ...prev,
      cidade: cidadeFormatada,
      bairro: '' // Limpa o bairro ao selecionar nova cidade
    }));
    
    setNeighborhoods([]);
    setFilteredNeighborhoods([]);
    setShowNeighborhoodDropdown(false);
    setShowCityDropdown(false);
    setFocusedCityIndex(-1);
    
    // Foca no campo de bairro após selecionar a cidade
    setTimeout(() => {
      neighborhoodInputRef.current?.focus();
    }, 0);
  };
  
  // Manipulador de teclas para navegação no dropdown de cidades
  const handleCityKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showCityDropdown || cities.length === 0) return;
    
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        const nextIndex = focusedCityIndex < cities.length - 1 ? focusedCityIndex + 1 : 0;
        setFocusedCityIndex(nextIndex);
        // Rola a opção para a visualização
        cityOptionsRef.current[nextIndex]?.scrollIntoView({ block: 'nearest' });
        break;
        
      case 'ArrowUp':
        e.preventDefault();
        const prevIndex = focusedCityIndex > 0 ? focusedCityIndex - 1 : cities.length - 1;
        setFocusedCityIndex(prevIndex);
        // Rola a opção para a visualização
        cityOptionsRef.current[prevIndex]?.scrollIntoView({ block: 'nearest' });
        break;
        
      case 'Enter':
        e.preventDefault();
        if (focusedCityIndex >= 0 && focusedCityIndex < cities.length) {
          handleCitySelect(cities[focusedCityIndex], focusedCityIndex);
        }
        break;
        
      case 'Escape':
        setShowCityDropdown(false);
        setFocusedCityIndex(-1);
        break;
    }
  };
  
  // Atualiza a lista de refs das opções de cidade
  const setCityOptionRef = (element: HTMLDivElement | null, index: number) => {
    if (element) {
      cityOptionsRef.current[index] = element;
    }
  };
  
  const handleCityInputFocus = () => {
    if (formData.cidade.length >= 3) {
      setShowCityDropdown(true);
    }
  };
  
  const handleNeighborhoodInputFocus = () => {
    if (formData.cidade && formData.bairro.length >= 2) {
      searchNeighborhoods(formData.bairro);
      setShowNeighborhoodDropdown(true);
    }
  };
  
  const searchNeighborhoods = (searchTerm: string) => {
    if (!formData.cidade || !searchTerm || searchTerm.length < 2) {
      setNeighborhoods([]);
      setFilteredNeighborhoods([]);
      setShowNeighborhoodDropdown(false);
      return;
    }
    
    // Extrai apenas o nome da cidade (remove o estado)
    const cityName = formData.cidade.split(' - ')[0];
    
    // Encontra a chave correta no objeto cityNeighborhoods
    const cityKey = Object.keys(cityNeighborhoods).find(key => 
      key.startsWith(cityName)
    );
    
    setIsLoadingNeighborhood(true);
    setNeighborhoodError(null);
    
    try {
      // Simula um pequeno atraso para parecer uma busca assíncrona
      setTimeout(() => {
        // Obtém os bairros da cidade atual ou um array vazio se não houver bairros para a cidade
        const cityNeighborhoodsList = cityKey ? cityNeighborhoods[cityKey] : [];
        
        // Filtra os bairros baseado no termo de busca
        const filtered = cityNeighborhoodsList.filter(neighborhood =>
          neighborhood.toLowerCase().includes(searchTerm.toLowerCase())
        );
        
        setNeighborhoods(filtered);
        setFilteredNeighborhoods(filtered);
        setShowNeighborhoodDropdown(true);
        setIsLoadingNeighborhood(false);
      }, 300);
    } catch (error) {
      console.error('Erro ao buscar bairros:', error);
      setNeighborhoodError('Erro ao carregar bairros');
      setNeighborhoods([]);
      setFilteredNeighborhoods([]);
      setIsLoadingNeighborhood(false);
    }
  };
  
  const handleNeighborhoodSelect = (neighborhood: string) => {
    setFormData(prev => ({
      ...prev,
      bairro: neighborhood
    }));
    setShowNeighborhoodDropdown(false);
  };
  
  const handleNeighborhoodChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      bairro: value
    }));
    
    // Só busca bairros se já tiver uma cidade selecionada
    if (formData.cidade && value.length >= 2) {
      searchNeighborhoods(value);
    } else {
      setNeighborhoods([]);
      setFilteredNeighborhoods([]);
      setShowNeighborhoodDropdown(false);
    }
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
    } else {
      setFormData(prev => ({ ...prev, bairro: '', cidade: '' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Validação básica do telefone
    const phoneRegex = /^\(?\d{2}\)?\s?\d{4,5}-?\d{4}$/;
    if (formData.telefone && !phoneRegex.test(formData.telefone)) {
      toast({
        title: "Erro de validação",
        description: "Por favor, insira um número de telefone válido (ex: (DD) 99999-9999 ou (DD) 9999-9999).",
        variant: "destructive",
      });
      return;
    }
    try {
      const visitorData = {
        name: formData.nomeCompletoVisitante,
        address: `${formData.bairro}, ${formData.cidade}`,
        lat: 0,
        lng: 0,
        visit_count: 1,
        is_new_visitor: true,
        distance: 0,
        status: formData.status,
        metadata: {
          genero: formData.genero,
          cep: formData.cep,
          bairro: formData.bairro,
          cidade: formData.cidade,
          faixa_etaria: formData.faixaEtaria,
          geracao_amigo_convidou: formData.geracaoAmigoConvidou,
          telefone: formData.telefone,
          como_conheceu: formData.comoConheceu,
          nome_pessoa_convidou: formData.nomePessoaConvidou,
          nome_consolidador: formData.nomeConsolidador,
          observacoes: formData.observacoesConsolidador
        }
      };
      let data, error;
      if (id) {
        // UPDATE visitante existente
        ({ data, error } = await supabase
          .from('visitors')
          .update(visitorData)
          .eq('id', id)
          .select());
        if (error) throw error;
        toast({
          title: "Visitante atualizado com sucesso!",
          description: `${formData.nomeCompletoVisitante} foi atualizado(a) em nosso sistema.`,
        });
        onNavigate('dashboard');
      } else {
        // INSERT novo visitante
        ({ data, error } = await supabase
          .from('visitors')
          .insert([visitorData])
          .select());
        if (error) throw error;
        toast({
          title: "Visitante cadastrado com sucesso! 🎉",
          description: `${formData.nomeCompletoVisitante} foi cadastrado(a) em nosso sistema.`,
        });
        // Reset form
        setFormData({
          nomeCompletoVisitante: '',
          genero: '',
          cep: '',
          bairro: '',
          cidade: '',
          faixaEtaria: '',
          geracaoAmigoConvidou: '',
          telefone: '',
          comoConheceu: '',
          nomePessoaConvidou: '',
          nomeConsolidador: '',
          observacoesConsolidador: '',
          status: 'Novo',
        });
      }
    } catch (error) {
      console.error('Erro ao salvar visitante:', error);
      toast({
        title: id ? "Erro ao atualizar visitante" : "Erro ao cadastrar visitante",
        description: "Ocorreu um erro ao tentar salvar os dados do visitante. Por favor, tente novamente.",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    if (id) {
      // Buscar dados do visitante para edição
      const fetchVisitor = async () => {
        const { data, error } = await supabase
          .from('visitors')
          .select('*')
          .eq('id', id)
          .single();
        if (data) {
          setFormData({
            nomeCompletoVisitante: data.name || '',
            genero: data.metadata?.genero || '',
            cep: data.metadata?.cep || '',
            bairro: data.metadata?.bairro || '',
            cidade: data.metadata?.cidade || '',
            faixaEtaria: data.metadata?.faixa_etaria || '',
            geracaoAmigoConvidou: data.metadata?.geracaoAmigoConvidou || '',
            telefone: data.metadata?.telefone || '',
            comoConheceu: data.metadata?.como_conheceu || '',
            nomePessoaConvidou: data.metadata?.nome_pessoa_convidou || '',
            nomeConsolidador: data.metadata?.nome_consolidador || '',
            observacoesConsolidador: data.metadata?.observacoes || '',
            status: data.status || 'Novo',
          });
        }
      };
      fetchVisitor();
    }
  }, [id]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="px-6 py-4">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => onNavigate('home')}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-2xl font-playfair font-bold text-gray-900">Cadastro de Visitante</h1>
              <p className="text-gray-600">Preencha os dados do novo visitante</p>
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
                  Dados do Visitante
                </h2>
                <p className="text-gray-600">Informações essenciais para o cadastro</p>
              </div>

              {/* Nome Completo */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nome Completo Visitante *
                </label>
                <input
                  type="text"
                  required
                  value={formData.nomeCompletoVisitante}
                  onChange={(e) => handleInputChange('nomeCompletoVisitante', e.target.value)}
                  className="input-church"
                  placeholder="Nome completo do visitante"
                />
              </div>

              {/* Gênero */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Gênero *
                </label>
                <select
                  required
                  value={formData.genero}
                  onChange={(e) => handleInputChange('genero', e.target.value)}
                  className="input-church"
                >
                  <option value="">Selecione</option>
                  <option value="Masculino">Masculino</option>
                  <option value="Feminino">Feminino</option>
                </select>
              </div>

              {/* CEP */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  CEP
                </label>
                <input
                  type="text"
                  value={formData.cep}
                  onChange={handleCepChange}
                  className="input-church"
                  placeholder="CEP (opcional)"
                />
              </div>

              {/* Cidade */}
              <div className="relative" style={{ position: 'relative' }}>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cidade *
                </label>
                <div className="relative" style={{ 
                  position: 'relative',
                  zIndex: 10
                }}>
                  <input
                    ref={cityInputRef}
                    type="text"
                    required
                    value={formData.cidade}
                    onChange={(e) => handleInputChange('cidade', e.target.value)}
                    onFocus={handleCityInputFocus}
                    onKeyDown={handleCityKeyDown}
                    className="input-church w-full"
                    placeholder="Digite pelo menos 3 caracteres"
                    autoComplete="off"
                    aria-haspopup="listbox"
                    aria-expanded={showCityDropdown}
                    aria-controls="cidades-listbox"
                    aria-autocomplete="list"
                    aria-activedescendant={focusedCityIndex >= 0 ? `cidade-option-${cities[focusedCityIndex]?.id}` : undefined}
                  />
                  {formData.cidade && (
                    <button
                      type="button"
                      onClick={() => {
                        setFormData(prev => ({ ...prev, cidade: '' }));
                        setCities([]);
                        setShowCityDropdown(false);
                        cityInputRef.current?.focus();
                      }}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      ✕
                    </button>
                  )}
                </div>
                
                {/* Dropdown de cidades */}
                {(() => {
                  console.log('Renderizando dropdown de cidades. showCityDropdown:', showCityDropdown, 'Total de cidades:', cities.length);
                  console.log('Estado atual do dropdown:', {
                    showCityDropdown,
                    citiesLength: cities.length,
                    isLoading,
                    searchError: searchError ? searchError : 'Nenhum erro'
                  });
                  
                  if (showCityDropdown && cities.length > 0) {
                    console.log('Mostrando dropdown com', cities.length, 'cidades');
                  } else if (showCityDropdown && cities.length === 0) {
                    console.log('Dropdown deveria estar visível, mas não há cidades para mostrar');
                  } else {
                    console.log('Dropdown não está visível (showCityDropdown é falso)');
                  }
                  
                  return null;
                })()}
                
                {/* Container para o dropdown de cidades */}
                <div style={{ position: 'relative' }}>
                  {showCityDropdown && cities.length > 0 && (
                    <div 
                      id="cidades-listbox"
                      role="listbox"
                      ref={dropdownRef}
                      className="absolute z-50 w-full mt-1 bg-white rounded-md shadow-lg max-h-60 ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none"
                      style={{
                        position: 'absolute',
                        top: '100%',
                        left: 0,
                        right: 0,
                        zIndex: 1000,
                        backgroundColor: 'white',
                        border: '1px solid #e2e8f0',
                        borderRadius: '0.375rem',
                        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'
                      }}
                    >
                      {cities.map((city, index) => (
                        <div
                          key={city.id}
                          ref={(el) => el && (cityOptionsRef.current[index] = el)}
                          id={`cidade-option-${city.id}`}
                          role="option"
                          aria-selected={focusedCityIndex === index}
                          className={`cursor-default select-none relative py-2 pl-3 pr-9 ${
                            focusedCityIndex === index ? 'bg-indigo-100' : 'hover:bg-indigo-50'
                          }`}
                          onClick={() => handleCitySelect(city, index)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                              e.preventDefault();
                              handleCitySelect(city, index);
                            }
                          }}
                          tabIndex={-1}
                        >
                          <div className="flex items-center">
                            <span className="font-normal ml-3 block truncate">
                              {city.nome} {city.uf?.sigla ? `- ${city.uf.sigla}` : city.microrregiao?.mesorregiao?.UF?.sigla ? `- ${city.microrregiao.mesorregiao.UF.sigla}` : ''}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                
                {/* Mensagem de carregamento */}
                {isLoading && formData.cidade.length >= 3 && (
                  <div 
                    className="absolute z-50 mt-1 w-full bg-white shadow-lg rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm p-4 text-center"
                    role="status"
                    aria-live="polite"
                  >
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-indigo-600 mr-2"></div>
                      <span>Buscando cidades...</span>
                    </div>
                  </div>
                )}
                
                {/* Mensagem de nenhuma cidade encontrada */}
                {!isLoading && showCityDropdown && cities.length === 0 && formData.cidade.length >= 3 && (
                  <div 
                    className="absolute z-50 mt-1 w-full bg-white shadow-lg rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm p-4 text-center text-gray-500"
                    role="status"
                    aria-live="polite"
                  >
                    {searchError || `Nenhuma cidade encontrada para "${formData.cidade}"`}
                  </div>
                )}
              </div>

              {/* Bairro */}
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bairro
                </label>
                <div className="relative">
                  <input
                    ref={neighborhoodInputRef}
                    type="text"
                    value={formData.bairro}
                    onChange={(e) => handleNeighborhoodChange(e.target.value)}
                    onFocus={handleNeighborhoodInputFocus}
                    className="input-church w-full"
                    placeholder={formData.cidade ? "Digite pelo menos 2 caracteres" : "Selecione uma cidade primeiro"}
                    autoComplete="off"
                    aria-haspopup="listbox"
                    aria-expanded={showNeighborhoodDropdown}
                    aria-controls="bairros-listbox"
                    disabled={!formData.cidade}
                  />
                  {formData.bairro && (
                    <button
                      type="button"
                      onClick={() => {
                        setFormData(prev => ({ ...prev, bairro: '' }));
                        setNeighborhoods([]);
                        setFilteredNeighborhoods([]);
                        setShowNeighborhoodDropdown(false);
                      }}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      disabled={!formData.cidade}
                    >
                      ✕
                    </button>
                  )}
                </div>
                
                {/* Dropdown de bairros */}
                {showNeighborhoodDropdown && (neighborhoods.length > 0 || isLoadingNeighborhood) && (
                  <div 
                    id="bairros-listbox"
                    role="listbox"
                    ref={neighborhoodDropdownRef}
                    className="absolute z-50 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm"
                    style={{ top: '100%' }}
                  >
                    {isLoadingNeighborhood ? (
                      <div className="flex items-center justify-center p-2">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-indigo-600 mr-2"></div>
                        <span>Buscando bairros...</span>
                      </div>
                    ) : (
                      filteredNeighborhoods.map((neighborhood, index) => (
                        <div
                          key={index}
                          id={`bairro-option-${index}`}
                          role="option"
                          aria-selected={formData.bairro === neighborhood}
                          className="cursor-default select-none relative py-2 pl-3 pr-9 hover:bg-indigo-50"
                          onClick={() => handleNeighborhoodSelect(neighborhood)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                              e.preventDefault();
                              handleNeighborhoodSelect(neighborhood);
                            }
                          }}
                          tabIndex={0}
                        >
                          <div className="flex items-center">
                            <span className="font-normal ml-3 block truncate">
                              {neighborhood}
                            </span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}
                
                {showNeighborhoodDropdown && neighborhoods.length === 0 && formData.bairro.length >= 2 && !isLoadingNeighborhood ? (
                  <div 
                    className="absolute z-50 mt-1 w-full bg-white shadow-lg rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm p-4 text-center"
                    role="status"
                    aria-live="polite"
                  >
                    {formData.cidade ? 
                      `Nenhum bairro encontrado para "${formData.bairro}" em ${formData.cidade}` :
                      'Selecione uma cidade primeiro'}
                  </div>
                ) : showNeighborhoodDropdown && (neighborhoods.length > 0 || isLoadingNeighborhood) ? (
                  <div 
                    id="bairros-listbox"
                    role="listbox"
                    ref={neighborhoodDropdownRef}
                    className="absolute z-50 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm"
                    style={{ top: '100%' }}
                  >
                    {isLoadingNeighborhood ? (
                      <div className="flex items-center justify-center p-2">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-indigo-600 mr-2"></div>
                        <span>Buscando bairros...</span>
                      </div>
                    ) : (
                      filteredNeighborhoods.map((neighborhood, index) => (
                        <div
                          key={index}
                          id={`bairro-option-${index}`}
                          role="option"
                          aria-selected={formData.bairro === neighborhood}
                          className="cursor-default select-none relative py-2 pl-3 pr-9 hover:bg-indigo-50"
                          onClick={() => handleNeighborhoodSelect(neighborhood)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                              e.preventDefault();
                              handleNeighborhoodSelect(neighborhood);
                            }
                          }}
                          tabIndex={0}
                        >
                          <div className="flex items-center">
                            <span className="font-normal ml-3 block truncate">
                              {neighborhood}
                            </span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                ) : null}
              </div>

              {/* Faixa Etária */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Faixa Etária *
                </label>
                <select
                  required
                  value={formData.faixaEtaria}
                  onChange={(e) => handleInputChange('faixaEtaria', e.target.value)}
                  className="input-church"
                >
                  <option value="">Selecione</option>
                  <option value="Criança">Criança</option>
                  <option value="Adolescente">Adolescente</option>
                  <option value="Jovem">Jovem</option>
                  <option value="Adulto">Adulto</option>
                  <option value="Melhor idade">Melhor idade</option>
                </select>
              </div>

              {/* Geração do Amigo que Convidou */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Se o Amigo que te convidou já frequenta a igreja, a qual Geração ele pertence?
                </label>
                <select
                  value={formData.geracaoAmigoConvidou}
                  onChange={(e) => handleInputChange('geracaoAmigoConvidou', e.target.value)}
                  className="input-church"
                >
                  <option value="">Selecione (Opcional)</option>
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

              {/* Telefone */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Telefone *
                </label>
                <input
                  type="tel"
                  required
                  value={formData.telefone}
                  onChange={(e) => handleInputChange('telefone', e.target.value)}
                  className="input-church"
                  placeholder="(DDD) XXXXX-XXXX"
                />
              </div>

              {/* Como Conheceu a Vida Nova Hotolândia? */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Como Conheceu a Vida Nova Hotolândia? *
                </label>
                <select
                  required
                  value={formData.comoConheceu}
                  onChange={(e) => handleInputChange('comoConheceu', e.target.value)}
                  className="input-church"
                >
                  <option value="">Selecione</option>
                  <option value="Instagram">Instagram</option>
                  <option value="Facebook">Facebook</option>
                  <option value="Um amigo fora da Igreja">Um amigo fora da Igreja</option>
                  <option value="Um amigo que já frequenta a Igreja">Um amigo que já frequenta a Igreja</option>
                  <option value="Google">Google</option>
                  <option value="Outro">Outro</option>
                </select>
              </div>

              {/* Nome da Pessoa que Convidou */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nome da pessoa que Convidou?
                </label>
                <input
                  type="text"
                  value={formData.nomePessoaConvidou}
                  onChange={(e) => handleInputChange('nomePessoaConvidou', e.target.value)}
                  className="input-church"
                  placeholder="Nome (Opcional)"
                />
              </div>

              {/* Nome do Consolidador */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nome do Consolidador
                </label>
                <input
                  type="text"
                  value={formData.nomeConsolidador}
                  onChange={(e) => handleInputChange('nomeConsolidador', e.target.value)}
                  className="input-church"
                  placeholder="Nome (Opcional)"
                />
              </div>

              {/* Observações do Consolidador */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Observações do Consolidador
                </label>
                <textarea
                  value={formData.observacoesConsolidador}
                  onChange={(e) => handleInputChange('observacoesConsolidador', e.target.value)}
                  className="input-church"
                  placeholder="Alguma observação? (Opcional)"
                  rows={3}
                />
              </div>

              {/* Status */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <select
                  value={formData.status}
                  onChange={e => handleInputChange('status', e.target.value)}
                  className="input-church"
                  disabled={!id}
                >
                  <option value="Novo">Novo</option>
                  <option value="Pendente">Pendente</option>
                  <option value="Contatado">Contatado</option>
                </select>
              </div>

              {/* Submit Button */}
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="btn-church text-lg px-8 py-4 flex items-center space-x-3"
                >
                  <span>Salvar Cadastro</span>
                  <Check className="w-5 h-5" />
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
export default VisitorForm;
