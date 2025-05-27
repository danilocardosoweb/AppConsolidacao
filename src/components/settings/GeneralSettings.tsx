
import React, { useState } from 'react';
import { Save, Church, Globe, Clock, MapPin } from 'lucide-react';

interface GeneralSettingsProps {
  onSave: () => void;
}

const GeneralSettings: React.FC<GeneralSettingsProps> = ({ onSave }) => {
  const [settings, setSettings] = useState({
    churchName: 'Igreja Comunidade',
    address: 'Rua das Flores, 123 - Centro',
    city: 'São Paulo',
    state: 'SP',
    zipCode: '01234-567',
    phone: '(11) 99999-9999',
    email: 'contato@igreja.com',
    website: 'www.igreja.com',
    serviceTime: '09:00',
    language: 'pt-BR',
    timezone: 'America/Sao_Paulo',
    welcomeMessage: 'Seja bem-vindo à nossa igreja!'
  });

  const handleSave = () => {
    console.log('Salvando configurações gerais:', settings);
    onSave();
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border p-6 space-y-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-12 h-12 bg-gradient-to-r from-church-primary to-church-secondary rounded-xl flex items-center justify-center">
          <Church className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Configurações Gerais</h2>
          <p className="text-gray-600">Informações básicas da igreja</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Informações da Igreja */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900">Informações da Igreja</h3>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nome da Igreja
            </label>
            <input
              type="text"
              value={settings.churchName}
              onChange={(e) => setSettings({...settings, churchName: e.target.value})}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-church-primary/50"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Endereço
            </label>
            <input
              type="text"
              value={settings.address}
              onChange={(e) => setSettings({...settings, address: e.target.value})}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-church-primary/50"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cidade
              </label>
              <input
                type="text"
                value={settings.city}
                onChange={(e) => setSettings({...settings, city: e.target.value})}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-church-primary/50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Estado
              </label>
              <select
                value={settings.state}
                onChange={(e) => setSettings({...settings, state: e.target.value})}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-church-primary/50"
              >
                <option value="SP">São Paulo</option>
                <option value="RJ">Rio de Janeiro</option>
                <option value="MG">Minas Gerais</option>
                <option value="RS">Rio Grande do Sul</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              CEP
            </label>
            <input
              type="text"
              value={settings.zipCode}
              onChange={(e) => setSettings({...settings, zipCode: e.target.value})}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-church-primary/50"
            />
          </div>
        </div>

        {/* Contato e Configurações */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900">Contato e Configurações</h3>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Telefone
            </label>
            <input
              type="text"
              value={settings.phone}
              onChange={(e) => setSettings({...settings, phone: e.target.value})}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-church-primary/50"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              type="email"
              value={settings.email}
              onChange={(e) => setSettings({...settings, email: e.target.value})}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-church-primary/50"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Website
            </label>
            <input
              type="url"
              value={settings.website}
              onChange={(e) => setSettings({...settings, website: e.target.value})}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-church-primary/50"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Horário do Culto Principal
            </label>
            <input
              type="time"
              value={settings.serviceTime}
              onChange={(e) => setSettings({...settings, serviceTime: e.target.value})}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-church-primary/50"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Mensagem de Boas-vindas
            </label>
            <textarea
              value={settings.welcomeMessage}
              onChange={(e) => setSettings({...settings, welcomeMessage: e.target.value})}
              rows={3}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-church-primary/50"
            />
          </div>
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

export default GeneralSettings;
