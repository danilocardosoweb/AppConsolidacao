import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { MapPin, Users, Navigation, Settings, Eye, Filter } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

// Corrigir o problema dos ícones do Leaflet
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

const DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

interface ReportMapProps {
  selectedMonth: number;
  selectedYear: number;
}

interface Visitor {
  id: string;
  name: string;
  cep?: string;
  logradouro?: string;
  bairro?: string;
  localidade?: string;
  uf?: string;
  lat?: number;
  lng?: number;
  visitCount: number;
  isNewVisitor: boolean;
  distance?: number;
}

// Função simulada para geocodificar Bairro/Cidade/UF (SUBSTITUIR POR UMA API REAL)
const geocodeAddress = async (bairro?: string, localidade?: string, uf?: string): Promise<{ lat: number; lng: number } | null> => {
  if (!bairro || !localidade || !uf) {
    return null; // Não podemos geocodificar sem informações básicas de localização
  }

  const addressString = `${bairro}, ${localidade}, ${uf}, Brasil`;
  console.log(`Attempting to geocode: ${addressString}`);

  // !!! AQUI VOCÊ INTEGRARIA UMA API DE GEOCODIFICAÇÃO REAL !!!
  // Exemplos de APIs:
  // - Google Geocoding API (requer chave e tem custos)
  // - Mapbox Geocoding API (requer chave e tem custos)
  // - Nominatim (OpenStreetMap - pode ter limites de uso)

  // Exemplo SIMULADO: Retornar coordenadas fixas para Hortolândia para demonstração
  // SUBSTITUA ISSO PELA CHAMADA REAL À API E TRATAMENTO DA RESPOSTA
  if (localidade.toLowerCase() === 'hortolândia' && uf?.toLowerCase() === 'sp') {
     // Coordenadas aproximadas para o centro de Hortolândia
    return { lat: -22.85211, lng: -47.23157 };
  } else {
    // Retorna null para outros endereços na simulação
    return null;
  }
};

const ReportMap: React.FC<ReportMapProps> = ({ selectedMonth, selectedYear }) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<L.Map | null>(null);
  const markersRef = useRef<L.Marker[]>([]);
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'new' | 'recurring'>('all');
  const [hoveredVisitor, setHoveredVisitor] = useState<Visitor | null>(null);
  const [visitors, setVisitors] = useState<Visitor[]>([]);
  const [loadingVisitors, setLoadingVisitors] = useState(true);
  const [errorVisitors, setErrorVisitors] = useState<string | null>(null);

  // Igreja central (exemplo: São Paulo, SP)
  const churchLocation = {
    lat: -22.85211,
    lng: -47.23157,
    name: "Nossa Igreja"
  };

  const filteredVisitors = visitors.filter(visitor => {
    if (selectedFilter === 'new') return visitor.isNewVisitor;
    if (selectedFilter === 'recurring') return !visitor.isNewVisitor;
    return true;
  });

  // Adicionar estilos CSS para os marcadores personalizados
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      .custom-marker {
        background: none !important;
        border: none !important;
      }
      .custom-marker div {
        transition: transform 0.2s;
      }
      .custom-marker:hover div {
        transform: scale(1.1);
      }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  useEffect(() => {
    fetchVisitors();
  }, [selectedMonth, selectedYear]);

  const fetchVisitors = async () => {
    setLoadingVisitors(true);
    setErrorVisitors(null);
    try {
      // Buscar visitantes do Supabase para o mês/ano selecionado
      // Ajuste a query conforme a estrutura real da sua tabela de visitantes
      // e como a data de visita/cadastro é armazenada.
      const { data, error } = await supabase
        .from('visitors')
        .select('id, name, cep, visitCount, isNewVisitor') // Corrigido para usar 'name' em vez de 'nome'
        // Adicione filtros por data aqui, se aplicável (ex: data_cadastro entre inicio e fim do mês/ano)
        // .gte('data_cadastro', `${selectedYear}-${String(selectedMonth).padStart(2, '0')}-01`)
        // .lt('data_cadastro', `${selectedYear}-${String(selectedMonth + 1).padStart(2, '0')}-01`)
        ;

      if (error) throw error;

      // Aqui, vamos processar os visitantes para buscar informações do ViaCEP e Geocodificar
      const visitorsWithAddress = await Promise.all(data.map(async (visitor) => {
        let visitorData: Visitor = { // Inicializa com dados do Supabase mapeados
          id: visitor.id,
          name: visitor.name,
          cep: visitor.cep,
          visitCount: visitor.visitCount,
          isNewVisitor: visitor.isNewVisitor,
        };

        if (visitor.cep) {
          try {
            const response = await fetch(`https://viacep.com.br/ws/${visitor.cep}/json/`);
            const cepData = await response.json();
            if (cepData && !cepData.erro) {
              visitorData = { // Adiciona dados do ViaCEP
                ...visitorData,
                logradouro: cepData.logradouro,
                bairro: cepData.bairro,
                localidade: cepData.localidade,
                uf: cepData.uf,
              };
            } else {
               console.warn(`CEP ${visitor.cep} não encontrado no ViaCEP para o visitante ${visitor.id}`);
            }
          } catch (cepError) {
            console.error(`Erro ao buscar CEP ${visitor.cep} no ViaCEP:`, cepError);
          }
        }

        // --- Geocodificação ---
        // Tentar geocodificar usando as informações de endereço (Bairro, Cidade, UF)
        if (visitorData.bairro && visitorData.localidade && visitorData.uf) {
           const coords = await geocodeAddress(visitorData.bairro, visitorData.localidade, visitorData.uf);
           if (coords) {
              visitorData.lat = coords.lat;
              visitorData.lng = coords.lng;
              // Opcional: Calcular distância para a igreja se tiver coords
              // visitorData.distance = calcularDistancia(coords, churchLocation);
           }
        }
        // --- Fim Geocodificação ---

        return visitorData as Visitor; // Garante que o tipo retornado é Visitor

      }));

      setVisitors(visitorsWithAddress.filter(v => v.lat && v.lng)); // Filtra apenas visitantes com coordenadas válidas para mostrar no mapa

    } catch (err) {
      console.error('Erro ao carregar visitantes:', err);
      setErrorVisitors('Erro ao carregar dados dos visitantes.');
    } finally {
      setLoadingVisitors(false);
    }
  };

  // Efeito para inicializar e atualizar o mapa
  useEffect(() => {
    if (!mapContainer.current) return;

    // Limpar mapa existente
    if (map.current) {
      map.current.remove();
      map.current = null;
    }

    // Inicializar o mapa
    map.current = L.map(mapContainer.current).setView(
      [churchLocation.lat, churchLocation.lng],
      11
    );

    // Adicionar o tile layer do OpenStreetMap
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(map.current);

    // Adicionar marcador da igreja
    const churchMarker = L.marker([churchLocation.lat, churchLocation.lng], {
      icon: L.divIcon({
        className: 'church-marker',
        html: '<div class="flex items-center justify-center w-8 h-8 bg-red-600 rounded-full border-2 border-white text-white font-bold text-sm">I</div>',
        iconSize: [32, 32],
        iconAnchor: [16, 16]
      })
    }).addTo(map.current);

    churchMarker.bindPopup(`
      <div class="p-3">
        <a href="https://vidanovahortolandia.com.br" target="_blank" rel="noopener noreferrer" class="font-bold text-lg text-blue-600 hover:underline">Igreja Vida Nova Hortolândia</a>
        <p class="text-sm text-gray-600 mt-1">Centro da Comunidade</p>
        <div class="mt-2 text-xs text-gray-500">
          ${filteredVisitors.length} visitantes mapeados neste mês
        </div>
      </div>
    `);

    // Filtrar visitantes com coordenadas válidas
    const filteredVisitorsWithCoords = visitors.filter(v => v.lat && v.lng);

    // Agrupar visitantes por bairro/cidade
    const groupedVisitors = filteredVisitorsWithCoords.reduce((groups, visitor) => {
      const key = `${visitor.bairro}-${visitor.localidade}-${visitor.uf}`;
      if (!groups[key]) {
        groups[key] = [];
      }
      groups[key].push(visitor);
      return groups;
    }, {} as Record<string, Visitor[]>);

    // Criar marcadores para cada grupo
    Object.entries(groupedVisitors).forEach(([key, groupVisitors]) => {
      if (groupVisitors.length === 0) return;

      // Usar as coordenadas do primeiro visitante do grupo
      const firstVisitor = groupVisitors[0];
      const count = groupVisitors.length;

      // Criar ícone personalizado com contagem
      const iconHtml = `
        <div style="
          background-color: #4CAF50;
          color: white;
          border-radius: 50%;
          width: 30px;
          height: 30px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          border: 2px solid white;
          box-shadow: 0 2px 5px rgba(0,0,0,0.2);
        ">
          ${count}
        </div>
      `;

      const customIcon = L.divIcon({
        html: iconHtml,
        className: 'custom-marker',
        iconSize: [30, 30],
        iconAnchor: [15, 15]
      });

      // Criar marcador com popup
      const marker = L.marker([firstVisitor.lat!, firstVisitor.lng!], { icon: customIcon })
        .bindPopup(`
          <div style="padding: 8px;">
            <h3 style="margin: 0 0 8px 0; font-size: 14px;">${firstVisitor.bairro}</h3>
            <p style="margin: 0; font-size: 12px;">${firstVisitor.localidade} - ${firstVisitor.uf}</p>
            <p style="margin: 4px 0 0 0; font-size: 12px; color: #666;">
              ${count} visitante${count > 1 ? 's' : ''}
            </p>
          </div>
        `);

      marker.addTo(map.current!);
    });

    // Ajustar o zoom para mostrar todos os marcadores
    if (filteredVisitorsWithCoords.length > 0) {
      const group = L.featureGroup(filteredVisitorsWithCoords.map(v => L.marker([v.lat!, v.lng!])));
      map.current.fitBounds(group.getBounds().pad(0.1));
    }

    // Função de limpeza para remover o mapa ao desmontar o componente
    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };

  }, [filteredVisitors, churchLocation, visitors, selectedMonth, selectedYear]);

  const stats = {
    total: filteredVisitors.length,
    new: filteredVisitors.filter(v => v.isNewVisitor).length,
    recurring: filteredVisitors.filter(v => !v.isNewVisitor).length,
    avgDistance: filteredVisitors.length > 0 ? (filteredVisitors.reduce((sum, v) => sum + (v.distance || 0), 0) / filteredVisitors.length).toFixed(1) : '-'
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-playfair font-bold gradient-text mb-2">
          Mapa de Visitantes
        </h2>
        <p className="text-gray-600">
          Visualize a distribuição geográfica dos visitantes
        </p>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Distribuição Geográfica
          </CardTitle>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setSelectedFilter('all')}
              className={`px-3 py-1 rounded-full text-xs ${
                selectedFilter === 'all'
                  ? 'bg-blue-100 text-blue-800'
                  : 'bg-gray-100 text-gray-600'
              }`}
            >
              Todos
            </button>
            <button
              onClick={() => setSelectedFilter('new')}
              className={`px-3 py-1 rounded-full text-xs ${
                selectedFilter === 'new'
                  ? 'bg-blue-100 text-blue-800'
                  : 'bg-gray-100 text-gray-600'
              }`}
            >
              Novos
            </button>
            <button
              onClick={() => setSelectedFilter('recurring')}
              className={`px-3 py-1 rounded-full text-xs ${
                selectedFilter === 'recurring'
                  ? 'bg-blue-100 text-blue-800'
                  : 'bg-gray-100 text-gray-600'
              }`}
            >
              Recorrentes
            </button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <div className="grid grid-cols-3 gap-4">
              <div className="flex items-center space-x-2">
                <Users className="h-4 w-4 text-blue-500" />
                <div>
                  <p className="text-xs text-gray-500">Total</p>
                  <p className="text-lg font-bold">{stats.total}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4 text-green-500" />
                <div>
                  <p className="text-xs text-gray-500">Novos</p>
                  <p className="text-lg font-bold">{stats.new}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Navigation className="h-4 w-4 text-purple-500" />
                <div>
                  <p className="text-xs text-gray-500">Média Dist.</p>
                  <p className="text-lg font-bold">{stats.avgDistance} km</p>
                </div>
              </div>
            </div>
            <div className="h-[400px] w-full rounded-lg overflow-hidden">
              <div ref={mapContainer} className="h-full w-full" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReportMap;
