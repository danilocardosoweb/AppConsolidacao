
import React, { useState } from 'react';
import { Save, Bell, Mail, MessageSquare, ToggleLeft, ToggleRight, Clock } from 'lucide-react';

interface NotificationSettingsProps {
  onSave: () => void;
}

const NotificationSettings: React.FC<NotificationSettingsProps> = ({ onSave }) => {
  const [emailSettings, setEmailSettings] = useState({
    newVisitor: true,
    dailyReport: true,
    weeklyReport: false,
    monthlyReport: true,
    systemUpdates: true
  });

  const [smsSettings, setSmsSettings] = useState({
    newVisitor: false,
    emergencyAlerts: true,
    reminderMessages: false
  });

  const [generalSettings, setGeneralSettings] = useState({
    enablePushNotifications: true,
    quietHours: true,
    quietStart: '22:00',
    quietEnd: '07:00',
    notificationSound: 'default'
  });

  const [recipients, setRecipients] = useState([
    { id: 1, name: 'Pastor João', email: 'pastor@igreja.com', role: 'Pastor Principal', active: true },
    { id: 2, name: 'Maria Silva', email: 'maria@igreja.com', role: 'Secretária', active: true },
    { id: 3, name: 'Carlos Santos', email: 'carlos@igreja.com', role: 'Líder de Recepção', active: false }
  ]);

  const handleSave = () => {
    console.log('Salvando configurações de notificação:', { emailSettings, smsSettings, generalSettings, recipients });
    onSave();
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border p-6 space-y-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
          <Bell className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Configurações de Notificações</h2>
          <p className="text-gray-600">Gerencie como e quando receber notificações</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Notificações por Email */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2 mb-4">
            <Mail className="w-5 h-5 text-blue-600" />
            <h3 className="text-lg font-medium text-gray-900">Notificações por Email</h3>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">Novo Visitante</p>
                <p className="text-sm text-gray-500">Notificação imediata quando alguém se cadastra</p>
              </div>
              <button
                onClick={() => setEmailSettings({...emailSettings, newVisitor: !emailSettings.newVisitor})}
                className="text-church-primary hover:text-church-secondary"
              >
                {emailSettings.newVisitor ? <ToggleRight className="w-6 h-6" /> : <ToggleLeft className="w-6 h-6" />}
              </button>
            </div>

            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">Relatório Diário</p>
                <p className="text-sm text-gray-500">Resumo diário dos visitantes</p>
              </div>
              <button
                onClick={() => setEmailSettings({...emailSettings, dailyReport: !emailSettings.dailyReport})}
                className="text-church-primary hover:text-church-secondary"
              >
                {emailSettings.dailyReport ? <ToggleRight className="w-6 h-6" /> : <ToggleLeft className="w-6 h-6" />}
              </button>
            </div>

            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">Relatório Semanal</p>
                <p className="text-sm text-gray-500">Estatísticas da semana</p>
              </div>
              <button
                onClick={() => setEmailSettings({...emailSettings, weeklyReport: !emailSettings.weeklyReport})}
                className="text-church-primary hover:text-church-secondary"
              >
                {emailSettings.weeklyReport ? <ToggleRight className="w-6 h-6" /> : <ToggleLeft className="w-6 h-6" />}
              </button>
            </div>

            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">Relatório Mensal</p>
                <p className="text-sm text-gray-500">Análise completa do mês</p>
              </div>
              <button
                onClick={() => setEmailSettings({...emailSettings, monthlyReport: !emailSettings.monthlyReport})}
                className="text-church-primary hover:text-church-secondary"
              >
                {emailSettings.monthlyReport ? <ToggleRight className="w-6 h-6" /> : <ToggleLeft className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Configurações Gerais */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2 mb-4">
            <MessageSquare className="w-5 h-5 text-green-600" />
            <h3 className="text-lg font-medium text-gray-900">SMS e Configurações Gerais</h3>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">SMS - Novo Visitante</p>
                <p className="text-sm text-gray-500">SMS imediato para líderes</p>
              </div>
              <button
                onClick={() => setSmsSettings({...smsSettings, newVisitor: !smsSettings.newVisitor})}
                className="text-church-primary hover:text-church-secondary"
              >
                {smsSettings.newVisitor ? <ToggleRight className="w-6 h-6" /> : <ToggleLeft className="w-6 h-6" />}
              </button>
            </div>

            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">Horário Silencioso</p>
                <p className="text-sm text-gray-500">Pausar notificações durante a noite</p>
              </div>
              <button
                onClick={() => setGeneralSettings({...generalSettings, quietHours: !generalSettings.quietHours})}
                className="text-church-primary hover:text-church-secondary"
              >
                {generalSettings.quietHours ? <ToggleRight className="w-6 h-6" /> : <ToggleLeft className="w-6 h-6" />}
              </button>
            </div>

            {generalSettings.quietHours && (
              <div className="p-4 bg-gray-50 rounded-lg space-y-3">
                <div className="flex items-center space-x-2 text-gray-700">
                  <Clock className="w-4 h-4" />
                  <span className="text-sm font-medium">Período Silencioso</span>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Início</label>
                    <input
                      type="time"
                      value={generalSettings.quietStart}
                      onChange={(e) => setGeneralSettings({...generalSettings, quietStart: e.target.value})}
                      className="w-full px-2 py-1 text-sm border border-gray-200 rounded focus:ring-1 focus:ring-church-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Fim</label>
                    <input
                      type="time"
                      value={generalSettings.quietEnd}
                      onChange={(e) => setGeneralSettings({...generalSettings, quietEnd: e.target.value})}
                      className="w-full px-2 py-1 text-sm border border-gray-200 rounded focus:ring-1 focus:ring-church-primary"
                    />
                  </div>
                </div>
              </div>
            )}

            <div className="p-4 border border-gray-200 rounded-lg">
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Som das Notificações
              </label>
              <select
                value={generalSettings.notificationSound}
                onChange={(e) => setGeneralSettings({...generalSettings, notificationSound: e.target.value})}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-church-primary/50"
              >
                <option value="default">Padrão</option>
                <option value="bell">Sino</option>
                <option value="chime">Carrilhão</option>
                <option value="none">Silencioso</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Lista de Destinatários */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900">Destinatários das Notificações</h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {recipients.map((recipient) => (
            <div key={recipient.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-gray-900">{recipient.name}</h4>
                <button
                  onClick={() => setRecipients(recipients.map(r => 
                    r.id === recipient.id ? {...r, active: !r.active} : r
                  ))}
                  className="text-church-primary hover:text-church-secondary"
                >
                  {recipient.active ? <ToggleRight className="w-5 h-5" /> : <ToggleLeft className="w-5 h-5" />}
                </button>
              </div>
              <p className="text-sm text-gray-600 mb-1">{recipient.email}</p>
              <p className="text-xs text-gray-500">{recipient.role}</p>
            </div>
          ))}
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

export default NotificationSettings;
