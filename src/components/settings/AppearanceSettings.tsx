
import React, { useState } from 'react';
import { Save, Palette, Eye, Moon, Sun, Monitor, Type, Layout } from 'lucide-react';

interface AppearanceSettingsProps {
  onSave: () => void;
}

const AppearanceSettings: React.FC<AppearanceSettingsProps> = ({ onSave }) => {
  const [theme, setTheme] = useState('light');
  const [colorScheme, setColorScheme] = useState('blue');
  const [fontSize, setFontSize] = useState('medium');
  const [layout, setLayout] = useState('comfortable');
  const [animations, setAnimations] = useState(true);
  const [compactMode, setCompactMode] = useState(false);

  const colorSchemes = [
    { name: 'blue', label: 'Azul Clássico', primary: 'bg-blue-600', secondary: 'bg-blue-100' },
    { name: 'purple', label: 'Roxo Elegante', primary: 'bg-purple-600', secondary: 'bg-purple-100' },
    { name: 'green', label: 'Verde Natureza', primary: 'bg-green-600', secondary: 'bg-green-100' },
    { name: 'indigo', label: 'Índigo Profundo', primary: 'bg-indigo-600', secondary: 'bg-indigo-100' },
    { name: 'rose', label: 'Rosa Suave', primary: 'bg-rose-600', secondary: 'bg-rose-100' },
    { name: 'orange', label: 'Laranja Vibrante', primary: 'bg-orange-600', secondary: 'bg-orange-100' }
  ];

  const fontSizes = [
    { value: 'small', label: 'Pequeno', class: 'text-sm' },
    { value: 'medium', label: 'Médio', class: 'text-base' },
    { value: 'large', label: 'Grande', class: 'text-lg' },
    { value: 'xlarge', label: 'Extra Grande', class: 'text-xl' }
  ];

  const handleSave = () => {
    console.log('Salvando configurações de aparência:', {
      theme,
      colorScheme,
      fontSize,
      layout,
      animations,
      compactMode
    });
    onSave();
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border p-6 space-y-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-pink-600 rounded-xl flex items-center justify-center">
          <Palette className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Configurações de Aparência</h2>
          <p className="text-gray-600">Personalize a interface do sistema</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Tema e Cores */}
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Tema</h3>
            <div className="grid grid-cols-3 gap-3">
              <button
                onClick={() => setTheme('light')}
                className={`p-4 border-2 rounded-lg flex flex-col items-center space-y-2 transition-all ${
                  theme === 'light' ? 'border-church-primary bg-church-primary/5' : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <Sun className="w-6 h-6 text-yellow-500" />
                <span className="text-sm font-medium">Claro</span>
              </button>
              
              <button
                onClick={() => setTheme('dark')}
                className={`p-4 border-2 rounded-lg flex flex-col items-center space-y-2 transition-all ${
                  theme === 'dark' ? 'border-church-primary bg-church-primary/5' : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <Moon className="w-6 h-6 text-gray-700" />
                <span className="text-sm font-medium">Escuro</span>
              </button>
              
              <button
                onClick={() => setTheme('auto')}
                className={`p-4 border-2 rounded-lg flex flex-col items-center space-y-2 transition-all ${
                  theme === 'auto' ? 'border-church-primary bg-church-primary/5' : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <Monitor className="w-6 h-6 text-gray-600" />
                <span className="text-sm font-medium">Auto</span>
              </button>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Esquema de Cores</h3>
            <div className="grid grid-cols-2 gap-3">
              {colorSchemes.map((scheme) => (
                <button
                  key={scheme.name}
                  onClick={() => setColorScheme(scheme.name)}
                  className={`p-3 border-2 rounded-lg flex items-center space-x-3 transition-all ${
                    colorScheme === scheme.name ? 'border-church-primary bg-church-primary/5' : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex space-x-1">
                    <div className={`w-4 h-4 rounded-full ${scheme.primary}`}></div>
                    <div className={`w-4 h-4 rounded-full ${scheme.secondary}`}></div>
                  </div>
                  <span className="text-sm font-medium">{scheme.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Tamanho da Fonte</h3>
            <div className="space-y-2">
              {fontSizes.map((size) => (
                <button
                  key={size.value}
                  onClick={() => setFontSize(size.value)}
                  className={`w-full p-3 border-2 rounded-lg text-left transition-all ${
                    fontSize === size.value ? 'border-church-primary bg-church-primary/5' : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <span className={`${size.class} font-medium`}>{size.label}</span>
                  <span className={`${size.class} text-gray-600 ml-2`}>Exemplo de texto</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Layout e Comportamento */}
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Layout</h3>
            <div className="space-y-3">
              <button
                onClick={() => setLayout('comfortable')}
                className={`w-full p-4 border-2 rounded-lg flex items-center space-x-3 transition-all ${
                  layout === 'comfortable' ? 'border-church-primary bg-church-primary/5' : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <Layout className="w-5 h-5" />
                <div className="text-left">
                  <p className="font-medium">Confortável</p>
                  <p className="text-sm text-gray-600">Mais espaçamento entre elementos</p>
                </div>
              </button>
              
              <button
                onClick={() => setLayout('compact')}
                className={`w-full p-4 border-2 rounded-lg flex items-center space-x-3 transition-all ${
                  layout === 'compact' ? 'border-church-primary bg-church-primary/5' : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <Layout className="w-5 h-5" />
                <div className="text-left">
                  <p className="font-medium">Compacto</p>
                  <p className="text-sm text-gray-600">Menos espaçamento, mais conteúdo visível</p>
                </div>
              </button>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Comportamento</h3>
            
            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">Animações</p>
                <p className="text-sm text-gray-500">Ativar animações e transições suaves</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={animations}
                  onChange={(e) => setAnimations(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-church-primary/50 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-church-primary"></div>
              </label>
            </div>

            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">Modo Compacto</p>
                <p className="text-sm text-gray-500">Reduz o tamanho de botões e elementos</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={compactMode}
                  onChange={(e) => setCompactMode(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-church-primary/50 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-church-primary"></div>
              </label>
            </div>
          </div>

          {/* Preview */}
          <div className="p-4 border border-gray-200 rounded-lg bg-gray-50">
            <h4 className="font-medium text-gray-900 mb-3">Pré-visualização</h4>
            <div className="space-y-3">
              <div className="bg-white p-3 rounded border">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-church-primary rounded-full"></div>
                  <div>
                    <p className={`font-medium ${fontSizes.find(s => s.value === fontSize)?.class}`}>Nome do Visitante</p>
                    <p className="text-gray-600 text-sm">email@exemplo.com</p>
                  </div>
                </div>
              </div>
              <button className="w-full bg-church-primary text-white py-2 rounded font-medium">
                Botão de Exemplo
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

export default AppearanceSettings;
