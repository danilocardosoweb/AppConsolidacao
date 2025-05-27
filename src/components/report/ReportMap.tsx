import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { MapPin, Users, Navigation, Settings, Eye, Filter } from 'lucide-react';

// Corrigir o problema dos ícones do Leaflet
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
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
  address: string;
  lat: number;
  lng: number;
  visitCount: number;
  isNewVisitor: boolean;
  distance: number;
}

const ReportMap: React.FC<ReportMapProps> = ({ selectedMonth, selectedYear }) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<L.Map | null>(null);
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'new' | 'recurring'>('all');
  const [hoveredVisitor, setHoveredVisitor] = useState<Visitor | null>(null);

  // Igreja central (exemplo: São Paulo, SP)
  const churchLocation = {
    lat: -23.5505,
    lng: -46.6333,
    name: "Nossa Igreja"
  };

  // Mock data dos visitantes com diferentes localizações
  const visitors: Visitor[] = [
    { id: '1', name: 'João Silva', address: 'Vila Madalena, SP', lat: -23.5449, lng: -46.6929, visitCount: 5, isNewVisitor: false, distance: 8.2 },
    { id: '2', name: 'Maria Santos', address: 'Jardins, SP', lat: -23.5649, lng: -46.6544, visitCount: 1, isNewVisitor: true, distance: 3.1 },
    { id: '3', name: 'Pedro Oliveira', address: 'Moema, SP', lat: -23.5928, lng: -46.6640, visitCount: 8, isNewVisitor: false, distance: 6.5 },
    { id: '4', name: 'Ana Costa', address: 'Pinheiros, SP', lat: -23.5647, lng: -46.7019, visitCount: 2, isNewVisitor: true, distance: 9.8 },
    { id: '5', name: 'Carlos Lima', address: 'Vila Olímpia, SP', lat: -23.5955, lng: -46.6890, visitCount: 12, isNewVisitor: false, distance: 7.3 },
    { id: '6', name: 'Lucia Ferreira', address: 'Liberdade, SP', lat: -23.5587, lng: -46.6344, visitCount: 3, isNewVisitor: false, distance: 2.8 },
    { id: '7', name: 'Roberto Alves', address: 'Brooklin, SP', lat: -23.6089, lng: -46.7022, visitCount: 1, isNewVisitor: true, distance: 11.2 },
    { id: '8', name: 'Sofia Martins', address: 'Vila Mariana, SP', lat: -23.5881, lng: -46.6395, visitCount: 6, isNewVisitor: false, distance: 4.9 },
  ];

  const filteredVisitors = visitors.filter(visitor => {
    if (selectedFilter === 'new') return visitor.isNewVisitor;
    if (selectedFilter === 'recurring') return !visitor.isNewVisitor;
    return true;
  });

  useEffect(() => {
    if (!mapContainer.current) return;

    try {
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
          html: `<div class="w-6 h-6 rounded-full bg-blue-500 border-2 border-white"></div>`,
          iconSize: [24, 24]
        })
      }).addTo(map.current);

      churchMarker.bindPopup(`
        <div class="p-3">
          <h3 class="font-bold text-lg text-blue-600">${churchLocation.name}</h3>
          <p class="text-sm text-gray-600">Centro da Comunidade</p>
          <div class="mt-2 text-xs text-gray-500">
            ${filteredVisitors.length} visitantes mapeados
          </div>
        </div>
      `);

      // Adicionar círculo de área de influência
      L.circle([churchLocation.lat, churchLocation.lng], {
        radius: 5000,
        color: '#9BC8EF',
        fillColor: '#9BC8EF',
        fillOpacity: 0.1,
        weight: 2
      }).addTo(map.current);

      // Adicionar marcadores dos visitantes
      filteredVisitors.forEach(visitor => {
        const markerColor = visitor.isNewVisitor ? '#7BB3E8' : '#5B9EE1';
        const markerSize = Math.min(1.2, 0.8 + (visitor.visitCount / 10)) * 24;

        const visitorMarker = L.marker([visitor.lat, visitor.lng], {
          icon: L.divIcon({
            className: 'visitor-marker',
            html: `<div class="w-${markerSize} h-${markerSize} rounded-full bg-${markerColor} border-2 border-white"></div>`,
            iconSize: [markerSize, markerSize]
          })
        }).addTo(map.current);

        visitorMarker.bindPopup(`
          <div class="p-3 max-w-xs">
            <h3 class="font-bold text-lg">${visitor.name}</h3>
            <p class="text-sm text-gray-600 mb-2">${visitor.address}</p>
            <div class="space-y-1 text-xs">
              <div class="flex justify-between">
                <span>Visitas:</span>
                <span class="font-semibold">${visitor.visitCount}</span>
              </div>
              <div class="flex justify-between">
                <span>Distância:</span>
                <span class="font-semibold">${visitor.distance} km</span>
              </div>
              <div class="flex justify-between">
                <span>Tipo:</span>
                <span class="px-2 py-1 rounded-full text-xs ${visitor.isNewVisitor ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}">
                  ${visitor.isNewVisitor ? 'Novo' : 'Recorrente'}
                </span>
              </div>
            </div>
          </div>
        `);

        // Adicionar linha conectando visitante à igreja
        L.polyline(
          [[churchLocation.lat, churchLocation.lng], [visitor.lat, visitor.lng]],
          {
            color: visitor.isNewVisitor ? '#7BB3E8' : '#5B9EE1',
            weight: 2,
            opacity: 0.4
          }
        ).addTo(map.current);
      });

      return () => {
        map.current?.remove();
      };
    } catch (error) {
      console.error('Erro ao inicializar mapa:', error);
    }
  }, [selectedFilter]);

  const stats = {
    total: filteredVisitors.length,
    new: filteredVisitors.filter(v => v.isNewVisitor).length,
    recurring: filteredVisitors.filter(v => !v.isNewVisitor).length,
    avgDistance: (filteredVisitors.reduce((sum, v) => sum + v.distance, 0) / filteredVisitors.length).toFixed(1)
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
