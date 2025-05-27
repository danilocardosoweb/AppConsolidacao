
import React, { useState } from 'react';
import { Save, Plus, Trash2, Edit, FileText, ToggleLeft, ToggleRight } from 'lucide-react';

interface FormSettingsProps {
  onSave: () => void;
}

const FormSettings: React.FC<FormSettingsProps> = ({ onSave }) => {
  const [fields, setFields] = useState([
    { id: 1, name: 'nome', label: 'Nome Completo', type: 'text', required: true, enabled: true },
    { id: 2, name: 'email', label: 'Email', type: 'email', required: true, enabled: true },
    { id: 3, name: 'telefone', label: 'Telefone', type: 'tel', required: true, enabled: true },
    { id: 4, name: 'cidade', label: 'Cidade', type: 'text', required: false, enabled: true },
    { id: 5, name: 'idade', label: 'Idade', type: 'number', required: false, enabled: true },
    { id: 6, name: 'primeiraVez', label: 'Primeira vez na igreja?', type: 'checkbox', required: false, enabled: true },
    { id: 7, name: 'observacoes', label: 'Observações', type: 'textarea', required: false, enabled: false }
  ]);

  const [settings, setSettings] = useState({
    autoSave: true,
    showProgress: true,
    allowDuplicates: false,
    sendConfirmationEmail: true,
    requireTerms: false
  });

  const toggleField = (fieldId: number) => {
    setFields(fields.map(field => 
      field.id === fieldId ? { ...field, enabled: !field.enabled } : field
    ));
  };

  const toggleRequired = (fieldId: number) => {
    setFields(fields.map(field => 
      field.id === fieldId ? { ...field, required: !field.required } : field
    ));
  };

  const handleSave = () => {
    console.log('Salvando configurações do formulário:', { fields, settings });
    onSave();
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border p-6 space-y-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
          <FileText className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Configurações do Formulário</h2>
          <p className="text-gray-600">Personalize os campos do formulário de visitantes</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Campos do Formulário */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900">Campos do Formulário</h3>
          
          <div className="space-y-3">
            {fields.map((field) => (
              <div key={field.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => toggleField(field.id)}
                      className="text-church-primary hover:text-church-secondary"
                    >
                      {field.enabled ? <ToggleRight className="w-5 h-5" /> : <ToggleLeft className="w-5 h-5" />}
                    </button>
                    <div>
                      <p className={`font-medium ${field.enabled ? 'text-gray-900' : 'text-gray-400'}`}>
                        {field.label}
                      </p>
                      <p className="text-sm text-gray-500">
                        {field.type} {field.required && '• Obrigatório'}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {field.enabled && (
                    <button
                      onClick={() => toggleRequired(field.id)}
                      className={`px-3 py-1 text-xs rounded-full transition-colors ${
                        field.required 
                          ? 'bg-red-100 text-red-700 hover:bg-red-200' 
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {field.required ? 'Obrigatório' : 'Opcional'}
                    </button>
                  )}
                  <button className="p-2 text-gray-400 hover:text-gray-600">
                    <Edit className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <button className="w-full p-4 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-church-primary hover:text-church-primary transition-colors flex items-center justify-center space-x-2">
            <Plus className="w-5 h-5" />
            <span>Adicionar Campo Personalizado</span>
          </button>
        </div>

        {/* Configurações Gerais */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900">Configurações Gerais</h3>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">Salvamento Automático</p>
                <p className="text-sm text-gray-500">Salva automaticamente enquanto o usuário digita</p>
              </div>
              <button
                onClick={() => setSettings({...settings, autoSave: !settings.autoSave})}
                className="text-church-primary hover:text-church-secondary"
              >
                {settings.autoSave ? <ToggleRight className="w-6 h-6" /> : <ToggleLeft className="w-6 h-6" />}
              </button>
            </div>

            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">Mostrar Progresso</p>
                <p className="text-sm text-gray-500">Exibe barra de progresso durante o preenchimento</p>
              </div>
              <button
                onClick={() => setSettings({...settings, showProgress: !settings.showProgress})}
                className="text-church-primary hover:text-church-secondary"
              >
                {settings.showProgress ? <ToggleRight className="w-6 h-6" /> : <ToggleLeft className="w-6 h-6" />}
              </button>
            </div>

            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">Permitir Duplicatas</p>
                <p className="text-sm text-gray-500">Permite cadastrar o mesmo email mais de uma vez</p>
              </div>
              <button
                onClick={() => setSettings({...settings, allowDuplicates: !settings.allowDuplicates})}
                className="text-church-primary hover:text-church-secondary"
              >
                {settings.allowDuplicates ? <ToggleRight className="w-6 h-6" /> : <ToggleLeft className="w-6 h-6" />}
              </button>
            </div>

            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">Email de Confirmação</p>
                <p className="text-sm text-gray-500">Envia email de boas-vindas para visitantes</p>
              </div>
              <button
                onClick={() => setSettings({...settings, sendConfirmationEmail: !settings.sendConfirmationEmail})}
                className="text-church-primary hover:text-church-secondary"
              >
                {settings.sendConfirmationEmail ? <ToggleRight className="w-6 h-6" /> : <ToggleLeft className="w-6 h-6" />}
              </button>
            </div>

            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">Aceitar Termos</p>
                <p className="text-sm text-gray-500">Obriga aceitar termos de uso e privacidade</p>
              </div>
              <button
                onClick={() => setSettings({...settings, requireTerms: !settings.requireTerms})}
                className="text-church-primary hover:text-church-secondary"
              >
                {settings.requireTerms ? <ToggleRight className="w-6 h-6" /> : <ToggleLeft className="w-6 h-6" />}
              </button>
            </div>
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

export default FormSettings;
