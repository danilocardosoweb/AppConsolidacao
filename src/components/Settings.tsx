
import React, { useState } from 'react';
import { ArrowLeft, Save, Check } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import GeneralSettings from './settings/GeneralSettings';
import NotificationSettings from './settings/NotificationSettings';
import FormSettings from './settings/FormSettings';
import UserManagement from './settings/UserManagement';
import DataSettings from './settings/DataSettings';
import AppearanceSettings from './settings/AppearanceSettings';

interface SettingsProps {
  onNavigate: (view: string) => void;
}

const Settings: React.FC<SettingsProps> = ({ onNavigate }) => {
  const [savedTab, setSavedTab] = useState<string | null>(null);

  const handleSave = (tabName: string) => {
    setSavedTab(tabName);
    setTimeout(() => setSavedTab(null), 2000);
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
                <h1 className="text-2xl font-playfair font-bold text-gray-900">Configurações</h1>
                <p className="text-gray-600">Personalize o sistema conforme suas necessidades</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              {savedTab && (
                <div className="flex items-center space-x-2 text-green-600 animate-fade-in">
                  <Check className="w-4 h-4" />
                  <span className="text-sm">Salvo!</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="p-6">
        <div className="max-w-6xl mx-auto">
          <Tabs defaultValue="general" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6 h-auto p-1">
              <TabsTrigger value="general" className="text-xs lg:text-sm">
                Geral
              </TabsTrigger>
              <TabsTrigger value="form" className="text-xs lg:text-sm">
                Formulário
              </TabsTrigger>
              <TabsTrigger value="notifications" className="text-xs lg:text-sm">
                Notificações
              </TabsTrigger>
              <TabsTrigger value="users" className="text-xs lg:text-sm">
                Usuários
              </TabsTrigger>
              <TabsTrigger value="data" className="text-xs lg:text-sm">
                Dados
              </TabsTrigger>
              <TabsTrigger value="appearance" className="text-xs lg:text-sm">
                Aparência
              </TabsTrigger>
            </TabsList>

            <TabsContent value="general">
              <GeneralSettings onSave={() => handleSave('general')} />
            </TabsContent>

            <TabsContent value="form">
              <FormSettings onSave={() => handleSave('form')} />
            </TabsContent>

            <TabsContent value="notifications">
              <NotificationSettings onSave={() => handleSave('notifications')} />
            </TabsContent>

            <TabsContent value="users">
              <UserManagement onSave={() => handleSave('users')} />
            </TabsContent>

            <TabsContent value="data">
              <DataSettings onSave={() => handleSave('data')} />
            </TabsContent>

            <TabsContent value="appearance">
              <AppearanceSettings onSave={() => handleSave('appearance')} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Settings;
