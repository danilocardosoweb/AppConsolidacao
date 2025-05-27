
import React, { useState } from 'react';
import { Save, Database, Download, Upload, Trash2, Shield, Calendar, AlertTriangle } from 'lucide-react';

interface DataSettingsProps {
  onSave: () => void;
}

const DataSettings: React.FC<DataSettingsProps> = ({ onSave }) => {
  const [backupSettings, setBackupSettings] = useState({
    autoBackup: true,
    frequency: 'daily',
    retention: '30',
    includeImages: true
  });

  const [exportSettings, setExportSettings] = useState({
    format: 'excel',
    includePersonalData: true,
    anonymizeData: false
  });

  const [backupHistory] = useState([
    { id: 1, date: '2024-05-25', size: '15.2 MB', status: 'success', type: 'auto' },
    { id: 2, date: '2024-05-24', size: '14.8 MB', status: 'success', type: 'auto' },
    { id: 3, date: '2024-05-23', size: '14.5 MB', status: 'success', type: 'manual' },
    { id: 4, date: '2024-05-22', size: '14.1 MB', status: 'error', type: 'auto' }
  ]);

  const handleSave = () => {
    console.log('Salvando configurações de dados:', { backupSettings, exportSettings });
    onSave();
  };

  const handleExport = () => {
    console.log('Exportando dados...');
  };

  const handleImport = () => {
    console.log('Importando dados...');
  };

  const handleBackup = () => {
    console.log('Iniciando backup manual...');
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border p-6 space-y-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-xl flex items-center justify-center">
          <Database className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Configurações de Dados</h2>
          <p className="text-gray-600">Backup, exportação e gerenciamento de dados</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Configurações de Backup */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900">Backup Automático</h3>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">Backup Automático</p>
                <p className="text-sm text-gray-500">Backup automático dos dados</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={backupSettings.autoBackup}
                  onChange={(e) => setBackupSettings({...backupSettings, autoBackup: e.target.checked})}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-church-primary/50 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-church-primary"></div>
              </label>
            </div>

            <div className="p-4 border border-gray-200 rounded-lg">
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Frequência do Backup
              </label>
              <select
                value={backupSettings.frequency}
                onChange={(e) => setBackupSettings({...backupSettings, frequency: e.target.value})}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-church-primary/50"
              >
                <option value="daily">Diário</option>
                <option value="weekly">Semanal</option>
                <option value="monthly">Mensal</option>
              </select>
            </div>

            <div className="p-4 border border-gray-200 rounded-lg">
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Retenção (dias)
              </label>
              <input
                type="number"
                value={backupSettings.retention}
                onChange={(e) => setBackupSettings({...backupSettings, retention: e.target.value})}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-church-primary/50"
                min="1"
                max="365"
              />
              <p className="text-xs text-gray-500 mt-1">Backups mais antigos serão excluídos automaticamente</p>
            </div>

            <div className="flex space-x-3">
              <button
                onClick={handleBackup}
                className="flex-1 btn-church flex items-center justify-center space-x-2"
              >
                <Download className="w-4 h-4" />
                <span>Backup Manual</span>
              </button>
            </div>
          </div>
        </div>

        {/* Exportação e Importação */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900">Exportação e Importação</h3>
          
          <div className="space-y-4">
            <div className="p-4 border border-gray-200 rounded-lg">
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Formato de Exportação
              </label>
              <select
                value={exportSettings.format}
                onChange={(e) => setExportSettings({...exportSettings, format: e.target.value})}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-church-primary/50"
              >
                <option value="excel">Excel (.xlsx)</option>
                <option value="csv">CSV</option>
                <option value="json">JSON</option>
                <option value="pdf">PDF</option>
              </select>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm text-gray-700">Incluir dados pessoais</span>
                <input
                  type="checkbox"
                  checked={exportSettings.includePersonalData}
                  onChange={(e) => setExportSettings({...exportSettings, includePersonalData: e.target.checked})}
                  className="rounded border-gray-300 text-church-primary focus:ring-church-primary"
                />
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm text-gray-700">Anonimizar dados</span>
                <input
                  type="checkbox"
                  checked={exportSettings.anonymizeData}
                  onChange={(e) => setExportSettings({...exportSettings, anonymizeData: e.target.checked})}
                  className="rounded border-gray-300 text-church-primary focus:ring-church-primary"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={handleExport}
                className="btn-church flex items-center justify-center space-x-2"
              >
                <Download className="w-4 h-4" />
                <span>Exportar</span>
              </button>
              <button
                onClick={handleImport}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center space-x-2"
              >
                <Upload className="w-4 h-4" />
                <span>Importar</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Histórico de Backups */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900">Histórico de Backups</h3>
        
        <div className="overflow-hidden rounded-lg border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Data</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tamanho</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tipo</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ações</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {backupHistory.map((backup) => (
                <tr key={backup.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(backup.date).toLocaleDateString('pt-BR')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {backup.size}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      backup.type === 'auto' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'
                    }`}>
                      {backup.type === 'auto' ? 'Automático' : 'Manual'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      backup.status === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {backup.status === 'success' ? 'Sucesso' : 'Erro'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <div className="flex space-x-2">
                      <button className="text-blue-600 hover:text-blue-800">
                        <Download className="w-4 h-4" />
                      </button>
                      <button className="text-red-600 hover:text-red-800">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Zona de Perigo */}
      <div className="p-6 border-2 border-red-200 rounded-lg bg-red-50">
        <div className="flex items-center space-x-3 mb-4">
          <AlertTriangle className="w-6 h-6 text-red-600" />
          <h3 className="text-lg font-medium text-red-900">Zona de Perigo</h3>
        </div>
        <p className="text-sm text-red-700 mb-4">
          Estas ações são irreversíveis. Certifique-se de ter um backup antes de prosseguir.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center space-x-2">
            <Trash2 className="w-4 h-4" />
            <span>Limpar Todos os Dados</span>
          </button>
          <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center space-x-2">
            <Calendar className="w-4 h-4" />
            <span>Resetar Sistema</span>
          </button>
        </div>
      </div>

      <div className="flex justify-end pt-6 border-t">
        <button
          onClick={handleSave}
          className="btn-church flex items-center space-x-2"
        >
          <Save className="w-4 h-4" />
          <span>Salvar Configurações</span>
        </button>
      </div>
    </div>
  );
};

export default DataSettings;
