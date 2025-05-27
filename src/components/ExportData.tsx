import React, { useState } from 'react';
import { ArrowLeft, Download, FileText, FileSpreadsheet, Calendar, Filter, Users, Eye, CheckCircle } from 'lucide-react';
import { Button } from './ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';

interface ExportDataProps {
  onNavigate: (view: string) => void;
}

const ExportData: React.FC<ExportDataProps> = ({ onNavigate }) => {
  const [selectedFormat, setSelectedFormat] = useState('excel');
  const [dateRange, setDateRange] = useState('all');
  const [exportFilters, setExportFilters] = useState({
    includePersonalData: true,
    includeContactInfo: true,
    includeVisitHistory: true,
    includeNotes: false
  });
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);

  // Mock data for preview
  const mockData = [
    { id: 1, nome: 'João Silva', email: 'joao@email.com', telefone: '(11) 99999-9999', dataVisita: '2024-05-25', origem: 'Site' },
    { id: 2, nome: 'Maria Santos', email: 'maria@email.com', telefone: '(11) 88888-8888', dataVisita: '2024-05-24', origem: 'Indicação' },
    { id: 3, nome: 'Pedro Costa', email: 'pedro@email.com', telefone: '(11) 77777-7777', dataVisita: '2024-05-23', origem: 'Redes Sociais' }
  ];

  const formatOptions = [
    { id: 'excel', name: 'Excel (.xlsx)', icon: FileSpreadsheet, description: 'Formato ideal para análises e relatórios' },
    { id: 'csv', name: 'CSV', icon: FileText, description: 'Formato universal, compatível com qualquer sistema' },
    { id: 'pdf', name: 'PDF', icon: FileText, description: 'Formato para impressão e compartilhamento' },
    { id: 'json', name: 'JSON', icon: FileText, description: 'Formato para integração com outros sistemas' }
  ];

  const dateRangeOptions = [
    { id: 'all', name: 'Todos os períodos', description: 'Exportar todos os visitantes cadastrados' },
    { id: 'today', name: 'Hoje', description: 'Visitantes de hoje' },
    { id: 'week', name: 'Última semana', description: 'Últimos 7 dias' },
    { id: 'month', name: 'Último mês', description: 'Últimos 30 dias' },
    { id: 'custom', name: 'Período personalizado', description: 'Escolher datas específicas' }
  ];

  const handleExport = async () => {
    setIsExporting(true);
    setExportProgress(0);

    // Simulate export process
    const steps = [20, 40, 60, 80, 100];
    for (const step of steps) {
      await new Promise(resolve => setTimeout(resolve, 500));
      setExportProgress(step);
    }

    // Simulate file download
    const filename = `visitantes_${new Date().toISOString().split('T')[0]}.${selectedFormat}`;
    console.log(`Exportando arquivo: ${filename}`);
    
    setIsExporting(false);
    setExportProgress(0);
  };

  const getEstimatedCount = () => {
    switch (dateRange) {
      case 'today': return '5';
      case 'week': return '23';
      case 'month': return '89';
      case 'custom': return '45';
      default: return '1,247';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
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
                <h1 className="text-2xl font-playfair font-bold text-gray-900">Exportar Dados</h1>
                <p className="text-gray-600">Exporte dados dos visitantes em diferentes formatos</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <span className="text-sm text-gray-500">
                {getEstimatedCount()} registros serão exportados
              </span>
            </div>
          </div>
        </div>
      </header>

      <div className="p-6 max-w-6xl mx-auto">
        <Tabs defaultValue="configure" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="configure" className="text-gray-700 hover:text-church-primary">Configurar Exportação</TabsTrigger>
            <TabsTrigger value="preview" className="text-gray-700 hover:text-church-primary">Visualizar Dados</TabsTrigger>
            <TabsTrigger value="history" className="text-gray-700 hover:text-church-primary">Histórico</TabsTrigger>
          </TabsList>

          <TabsContent value="configure" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Formato de Exportação */}
              <div className="bg-white rounded-2xl shadow-sm border p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                  <Download className="w-5 h-5 text-church-primary" />
                  <span>Formato de Exportação</span>
                </h3>
                <div className="space-y-3">
                  {formatOptions.map((format) => (
                    <div
                      key={format.id}
                      onClick={() => setSelectedFormat(format.id)}
                      className={`p-4 border rounded-lg cursor-pointer transition-all ${
                        selectedFormat === format.id
                          ? 'border-church-primary bg-church-primary/5'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <format.icon className={`w-5 h-5 ${
                          selectedFormat === format.id ? 'text-church-primary' : 'text-gray-400'
                        }`} />
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">{format.name}</p>
                          <p className="text-sm text-gray-500">{format.description}</p>
                        </div>
                        {selectedFormat === format.id && (
                          <CheckCircle className="w-5 h-5 text-church-primary" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Período */}
              <div className="bg-white rounded-2xl shadow-sm border p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                  <Calendar className="w-5 h-5 text-church-primary" />
                  <span>Período dos Dados</span>
                </h3>
                <div className="space-y-3">
                  {dateRangeOptions.map((range) => (
                    <div
                      key={range.id}
                      onClick={() => setDateRange(range.id)}
                      className={`p-4 border rounded-lg cursor-pointer transition-all ${
                        dateRange === range.id
                          ? 'border-church-primary bg-church-primary/5'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-gray-900">{range.name}</p>
                          <p className="text-sm text-gray-500">{range.description}</p>
                        </div>
                        {dateRange === range.id && (
                          <CheckCircle className="w-5 h-5 text-church-primary" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {dateRange === 'custom' && (
                  <div className="mt-4 grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Data Inicial</label>
                      <input
                        type="date"
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-church-primary/50"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Data Final</label>
                      <input
                        type="date"
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-church-primary/50"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Filtros de Dados */}
            <div className="bg-white rounded-2xl shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                <Filter className="w-5 h-5 text-church-primary" />
                <span>Dados a Incluir</span>
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                {Object.entries(exportFilters).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-700">
                      {key === 'includePersonalData' && 'Dados Pessoais'}
                      {key === 'includeContactInfo' && 'Informações de Contato'}
                      {key === 'includeVisitHistory' && 'Histórico de Visitas'}
                      {key === 'includeNotes' && 'Observações'}
                    </span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={value}
                        onChange={(e) => setExportFilters({...exportFilters, [key]: e.target.checked})}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-church-primary/50 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-church-primary"></div>
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Botão de Exportação */}
            <div className="bg-white rounded-2xl shadow-sm border p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Pronto para Exportar</h3>
                  <p className="text-gray-600">
                    {getEstimatedCount()} registros serão exportados em formato {selectedFormat.toUpperCase()}
                  </p>
                </div>
                <Button
                  onClick={handleExport}
                  disabled={isExporting}
                  className="btn-church flex items-center space-x-2 min-w-[140px]"
                >
                  {isExporting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>{exportProgress}%</span>
                    </>
                  ) : (
                    <>
                      <Download className="w-4 h-4" />
                      <span>Exportar</span>
                    </>
                  )}
                </Button>
              </div>
              
              {isExporting && (
                <div className="mt-4">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-church-primary h-2 rounded-full transition-all duration-500"
                      style={{ width: `${exportProgress}%` }}
                    ></div>
                  </div>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="preview" className="space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border p-6">
              <div className="flex items-center space-x-3 mb-6">
                <Eye className="w-6 h-6 text-church-primary" />
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Visualizar Dados</h3>
                  <p className="text-gray-600">Prévia dos dados que serão exportados</p>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Nome</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">E-mail</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Telefone</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Data da Visita</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Origem</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mockData.map((visitor) => (
                      <tr key={visitor.id} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4">{visitor.nome}</td>
                        <td className="py-3 px-4">{visitor.email}</td>
                        <td className="py-3 px-4">{visitor.telefone}</td>
                        <td className="py-3 px-4">{new Date(visitor.dataVisita).toLocaleDateString('pt-BR')}</td>
                        <td className="py-3 px-4">
                          <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
                            {visitor.origem}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="mt-4 text-center text-gray-500">
                <p>Mostrando 3 de {getEstimatedCount()} registros</p>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="history" className="space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center space-x-2">
                <Users className="w-5 h-5 text-church-primary" />
                <span>Histórico de Exportações</span>
              </h3>

              <div className="space-y-3">
                {[
                  { date: '2024-05-25', format: 'Excel', records: '1,247', size: '2.1 MB' },
                  { date: '2024-05-20', format: 'CSV', records: '1,198', size: '856 KB' },
                  { date: '2024-05-15', format: 'PDF', records: '1,156', size: '4.2 MB' }
                ].map((export_, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-church-primary/10 rounded-lg flex items-center justify-center">
                        <Download className="w-5 h-5 text-church-primary" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
                          Exportação {export_.format} - {export_.records} registros
                        </p>
                        <p className="text-sm text-gray-500">
                          {new Date(export_.date).toLocaleDateString('pt-BR')} • {export_.size}
                        </p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      <Download className="w-4 h-4 mr-2" />
                      Baixar
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ExportData;
