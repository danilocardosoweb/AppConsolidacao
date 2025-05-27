import React, { useState, useEffect } from 'react';
import { Users, UserPlus, BarChart3, Calendar, Heart, ArrowRight, Sparkles, FileText } from 'lucide-react';
import Dashboard from '../components/Dashboard';
import VisitorForm from '../components/VisitorForm';
import Settings from '../components/Settings';
import ExportData from '../components/ExportData';
import MonthlyReport from '../components/MonthlyReport';
import CellForm from '../components/CellForm';
import VisitorDetails from '../components/VisitorDetails';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { supabase } from '../integrations/supabase/client';

const Index = () => {
  const [currentView, setCurrentView] = useState('home');
  const [showFooterImageModal, setShowFooterImageModal] = useState(false);
  const [showLogoModal, setShowLogoModal] = useState(false);
  const [totalVisitantes, setTotalVisitantes] = useState<number | null>(null);

  useEffect(() => {
    async function fetchStats() {
      const { data, error } = await supabase.from('visitors').select('id');
      if (!error && data) {
        setTotalVisitantes(data.length);
      }
    }
    fetchStats();
  }, []);

  if (currentView === 'dashboard') {
    return <Dashboard onNavigate={setCurrentView} />;
  }

  if (currentView === 'register') {
    return <VisitorForm onNavigate={setCurrentView} />;
  }

  if (currentView === 'settings') {
    return <Settings onNavigate={setCurrentView} />;
  }

  if (currentView === 'export') {
    return <ExportData onNavigate={setCurrentView} />;
  }

  if (currentView === 'monthly-report') {
    return <MonthlyReport onNavigate={setCurrentView} />;
  }

  if (currentView === 'cells-register') {
    return <CellForm onNavigate={setCurrentView} />;
  }

  if (currentView.startsWith('visitor/')) {
    const visitorId = currentView.split('/')[1];
    return <VisitorDetails id={visitorId} onNavigate={setCurrentView} />;
  }

  if (currentView.startsWith('edit-visitor/')) {
    const visitorId = currentView.split('/')[1];
    return <VisitorForm id={visitorId} onNavigate={setCurrentView} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <header className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-church-primary/10 to-church-secondary/10"></div>
        <nav className="relative z-10 container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="cursor-pointer" onClick={() => setShowLogoModal(true)}>
                <img 
                  src="../../Imagem/Group_439-removebg-preview.png" 
                  alt="Logo Ministério de Consolidação" 
                  className="h-24 w-auto object-contain"
                />
              </div>
              <h1 className="text-2xl font-playfair font-bold text-black">
                Ministério de Consolidação
              </h1>
            </div>
            <div className="hidden md:flex items-center space-x-6">
              {/* Botão Cadastrar Visitante */}
              <button
                onClick={() => setCurrentView('register')}
                className="btn-church"
              >
                Cadastrar Visitante
              </button>

              {/* Dropdown Área ADM */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost">
                    Área ADM
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => setCurrentView('dashboard')}>
                    Dashboard
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setCurrentView('monthly-report')}>
                    Relatórios
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

            </div>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 px-6">
        <div className="container mx-auto text-center">
          <div className="animate-fade-in">
            <h2 className="text-5xl md:text-7xl font-playfair font-bold mb-6">
              <span className="gradient-text">Bem-vindos</span>
              <br />
              <span className="text-gray-800">à Nossa Igreja</span>
            </h2>
            <div className="text-2xl font-semibold text-black bg-white/80 px-4 py-2 rounded-lg shadow-md inline-block mb-6">Igreja Vida Nova Hortolândia</div>
            <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto leading-relaxed">
              Um lugar para Amar e Ser Amado!
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button
                onClick={() => setCurrentView('register')}
                className="group btn-church text-lg px-8 py-4 flex items-center space-x-3"
              >
                <UserPlus className="w-6 h-6" />
                <span>Cadastrar Visitante</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Cards */}
      <section className="py-20 px-6">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h3 className="text-4xl font-playfair font-bold mb-4 gradient-text">
              Funcionalidades
            </h3>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Tudo que você precisa para gerenciar visitantes de forma moderna e eficiente
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            <div className="group glass-effect p-8 rounded-2xl hover-lift animate-scale-in">
              <div className="w-16 h-16 bg-gradient-to-r from-church-primary to-church-secondary rounded-2xl flex items-center justify-center mb-6 group-hover:animate-glow">
                <UserPlus className="w-8 h-8 text-white" />
              </div>
              <h4 className="text-2xl font-semibold mb-4 text-gray-800">Cadastro Rápido</h4>
              <p className="text-gray-600 leading-relaxed">
                Interface intuitiva para cadastro de visitantes em poucos cliques. 
                Formulário otimizado para máxima eficiência.
              </p>
            </div>

            <div className="group glass-effect p-8 rounded-2xl hover-lift animate-scale-in delay-200">
              <div className="w-16 h-16 bg-gradient-to-r from-church-accent to-church-warm rounded-2xl flex items-center justify-center mb-6 group-hover:animate-glow">
                <BarChart3 className="w-8 h-8 text-white" />
              </div>
              <h4 className="text-2xl font-semibold mb-4 text-gray-800">Dashboard Completo</h4>
              <p className="text-gray-600 leading-relaxed">
                Visualize estatísticas em tempo real, acompanhe o crescimento 
                e gere relatórios detalhados.
              </p>
            </div>

            <div className="group glass-effect p-8 rounded-2xl hover-lift animate-scale-in delay-400">
              <div className="w-16 h-16 bg-gradient-to-r from-church-gold to-church-warm rounded-2xl flex items-center justify-center mb-6 group-hover:animate-glow">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h4 className="text-2xl font-semibold mb-4 text-gray-800">Gestão Avançada</h4>
              <p className="text-gray-600 leading-relaxed">
                Gerencie todos os visitantes com filtros avançados, 
                busca inteligente e organização por categorias.
              </p>
            </div>

            <div
              onClick={() => setCurrentView('monthly-report')}
              className="group glass-effect p-8 rounded-2xl hover-lift animate-scale-in delay-600 cursor-pointer"
            >
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mb-6 group-hover:animate-glow">
                <FileText className="w-8 h-8 text-white" />
              </div>
              <h4 className="text-2xl font-semibold mb-4 text-gray-800">Relatórios Inteligentes</h4>
              <p className="text-gray-600 leading-relaxed">
                Análises avançadas com insights automatizados 
                e recomendações estratégicas para crescimento.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-6 bg-gradient-to-r from-church-primary/5 to-church-secondary/5">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div className="animate-slide-up">
              <div className="text-4xl font-bold gradient-text mb-2">{totalVisitantes !== null ? totalVisitantes.toLocaleString('pt-BR') + '+' : '-'}</div>
              <div className="text-gray-600">Visitantes Cadastrados</div>
            </div>
            <div className="animate-slide-up delay-200">
              <div className="text-4xl font-bold gradient-text mb-2">98%</div>
              <div className="text-gray-600">Satisfação dos Usuários</div>
            </div>
            <div className="animate-slide-up delay-400">
              <div className="text-4xl font-bold gradient-text mb-2">24/7</div>
              <div className="text-gray-600">Sistema Disponível</div>
            </div>
            <div className="animate-slide-up delay-600">
              <div className="text-4xl font-bold gradient-text mb-2">100%</div>
              <div className="text-gray-600">Dados Seguros</div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 px-6 text-center">
        <div className="container mx-auto">
          <h3 className="text-4xl font-playfair font-bold mb-6 gradient-text">
            Pronto para Começar?
          </h3>
          <p className="text-xl text-gray-600 mb-12 max-w-xl mx-auto">
            Cadastre seu primeiro visitante agora e veja como é fácil gerenciar sua comunidade.
          </p>
          <button
            onClick={() => setCurrentView('register')}
            className="btn-church text-lg px-8 py-4 flex items-center space-x-3 mx-auto"
          >
            <UserPlus className="w-6 h-6" />
            <span>Cadastrar Novo Visitante</span>
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8 text-center">
        <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Seção Geração Israel */}
          <div className="text-left">
            <div className="flex items-center space-x-3 mb-4">
              {/* Aqui você pode adicionar o logo, se tiver */}
              <div className="w-20 h-20 overflow-hidden rounded-xl flex items-center justify-center bg-white cursor-pointer" onClick={() => setShowFooterImageModal(true)}>
                <img src="../../Imagem/Consolidacao_Com_Fundo_Azul.png" alt="Logo Geração José" className="w-full h-full object-cover rounded-xl transition-transform duration-200 hover:scale-110" />
              </div>
              <div>
                <h3 className="text-xl font-playfair font-bold">Geração José</h3>
                <p className="text-sm text-gray-400">Sistema de Acolhimento</p> {/* Texto placeholder */}
              </div>
            </div>
            <p className="text-gray-400 leading-relaxed mb-4">
              Corações firmados em Deus, como José, para viver o extraordinário.
            </p>
            {/* Ícone do Instagram - placeholder */}
            <div className="flex items-center space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M12.315 2c2.43 0 2.71.01 3.657.054.952.043 1.495.174 1.867.319.376.145.64.31.92.59s.443.544.59.92c.145.372.276.915.319 1.867.044.947.054 1.227.054 3.657s-.01 2.71-.054 3.657c-.043.952-.174 1.495-.319 1.867-.145.376-.31.64-.59.92s-.544.443-.92.59c-.372.145-.915.276-1.867.319-.947.044-1.227.054-3.657.054s-2.71-.01-3.657-.054c-.952-.043-1.495-.174-1.867-.319-.376-.145-.64-.31-.92-.59s-.443-.544-.59-.92c-.145-.372-.276-.915-.319-1.867-.044-.947-.054-1.227-.054-3.657s.01-2.71.054-3.657c.043-.952.174-1.495.319-1.867.145-.376.31-.64.59-.92s.544-.443.92-.59c.372-.145.915-.276 1.867-.319C9.605 2.01 9.885 2 12.315 2zm0 2.166c-2.44 0-2.742.01-3.7.056-.951.043-1.374.173-1.638.279-.263.106-.468.23-.64.403-.17.173-.293.378-.403.64-.106.263-.236.685-.28 1.638-.046.951-.056 1.253-.056 3.7s.01 2.742.056 3.7c.044.953.174 1.374.28 1.638.11.263.237.468.404.64.172.17.378.293.64.403.263.106.685.236 1.638.28.951.046 1.253.056 3.7.056s2.742-.01 3.7-.056c.953-.044 1.374-.174 1.638-.28.263-.11.468-.237.64-.404.17-.172.293-.378.403-.64.106-.263.236-.685.28-1.638.046-.951.056-1.253.056-3.7s-.01-2.742-.056-3.7c-.044-.953-.174-1.374-.28-1.638-.11-.263-.237-.468-.404-.64-.172-.17-.378-.293-.64-.403-.263-.106-.685-.236-1.638-.28-.951-.046-1.253-.056-3.7-.056zM12.315 6.468c-3.017 0-5.457 2.44-5.457 5.457s2.44 5.457 5.457 5.457 5.457-2.44 5.457-5.457-2.44-5.457-5.457-5.457zm0 9.166c-2.04 0-3.7-1.66-3.7-3.7s1.66-3.7 3.7-3.7 3.7 1.66 3.7 3.7-1.66 3.7-3.7 3.7zm6.406-11.845c-.676 0-1.225.549-1.225 1.224s.549 1.225 1.225 1.225 1.224-.549 1.224-1.225-.548-1.224-1.224-1.224z" clipRule="evenodd" />
                </svg>
              </a>
            </div>
          </div>

          {/* Seção Contato */}
          <div className="text-left">
            <h3 className="text-xl font-bold mb-4">Contato</h3>
            <div className="space-y-2 text-gray-400">
              <div className="flex items-center space-x-2">
                {/* Ícone de Telefone - placeholder */}
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.774a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                </svg>
                <span>(19) 99165-9221</span> {/* Número placeholder */}
              </div>
              <div className="flex items-center space-x-2">
                {/* Ícone de Email - placeholder */}
              </div>
            </div>
          </div>
        </div>
        {/* Direitos Autorais */}
        <div className="mt-8 border-t border-gray-700 pt-8 text-center text-gray-500 text-sm">
          <p>&copy; 2025 Geração José. Todos os direitos reservados.</p>
          <p className="text-xs mt-2">Desenvolvido com ❤️ por <span className="text-yellow-400">Danilo Cardoso</span></p> {/* Texto placeholder */}
        </div>
      </footer>

      {/* Modal de imagem ampliada do rodapé */}
      {showFooterImageModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70" onClick={() => setShowFooterImageModal(false)}>
          <img
            src="../../Imagem/Consolidacao_Com_Fundo_Azul.png"
            alt="Logo Geração José Ampliado"
            className="max-w-2xl max-h-[90vh] w-full h-auto rounded-2xl shadow-2xl border-4 border-white"
            onClick={e => e.stopPropagation()}
          />
        </div>
      )}

      {/* Modal de imagem ampliada do logo do topo */}
      {showLogoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70" onClick={() => setShowLogoModal(false)}>
          <img
            src="../../Imagem/Consolidacao_Com_Fundo_Preto.png"
            alt="Logo Igreja Vida Nova Hortolândia Ampliado"
            className="max-w-2xl max-h-[90vh] w-full h-auto rounded-xl shadow-2xl border-4 border-white"
            onClick={e => e.stopPropagation()}
          />
        </div>
      )}

    </div>
  );
};

export default Index;
