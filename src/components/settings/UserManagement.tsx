
import React, { useState } from 'react';
import { Save, UserPlus, Users, Shield, Crown, Eye, Edit, Trash2 } from 'lucide-react';

interface UserManagementProps {
  onSave: () => void;
}

const UserManagement: React.FC<UserManagementProps> = ({ onSave }) => {
  const [users, setUsers] = useState([
    { id: 1, name: 'Pastor João Silva', email: 'pastor@igreja.com', role: 'admin', status: 'active', lastLogin: '2024-05-25' },
    { id: 2, name: 'Maria Santos', email: 'maria@igreja.com', role: 'moderator', status: 'active', lastLogin: '2024-05-24' },
    { id: 3, name: 'Carlos Lima', email: 'carlos@igreja.com', role: 'user', status: 'active', lastLogin: '2024-05-23' },
    { id: 4, name: 'Ana Costa', email: 'ana@igreja.com', role: 'user', status: 'inactive', lastLogin: '2024-05-20' }
  ]);

  const [permissions, setPermissions] = useState({
    admin: {
      dashboard: true,
      visitors: true,
      reports: true,
      settings: true,
      users: true,
      export: true
    },
    moderator: {
      dashboard: true,
      visitors: true,
      reports: true,
      settings: false,
      users: false,
      export: true
    },
    user: {
      dashboard: true,
      visitors: true,
      reports: false,
      settings: false,
      users: false,
      export: false
    }
  });

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin': return <Crown className="w-4 h-4 text-yellow-600" />;
      case 'moderator': return <Shield className="w-4 h-4 text-blue-600" />;
      default: return <Users className="w-4 h-4 text-gray-600" />;
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'admin': return 'Administrador';
      case 'moderator': return 'Moderador';
      default: return 'Usuário';
    }
  };

  const getStatusColor = (status: string) => {
    return status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800';
  };

  const handleSave = () => {
    console.log('Salvando gerenciamento de usuários:', { users, permissions });
    onSave();
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border p-6 space-y-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-xl flex items-center justify-center">
            <Users className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Gerenciamento de Usuários</h2>
            <p className="text-gray-600">Controle de acesso e permissões do sistema</p>
          </div>
        </div>
        <button className="btn-church flex items-center space-x-2">
          <UserPlus className="w-4 h-4" />
          <span>Adicionar Usuário</span>
        </button>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Lista de Usuários */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="text-lg font-medium text-gray-900">Usuários do Sistema</h3>
          
          <div className="space-y-3">
            {users.map((user) => (
              <div key={user.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-church-primary to-church-secondary rounded-full flex items-center justify-center text-white font-semibold">
                      {user.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <h4 className="font-medium text-gray-900">{user.name}</h4>
                        {getRoleIcon(user.role)}
                      </div>
                      <p className="text-sm text-gray-600">{user.email}</p>
                      <div className="flex items-center space-x-3 mt-1">
                        <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(user.status)}`}>
                          {user.status === 'active' ? 'Ativo' : 'Inativo'}
                        </span>
                        <span className="text-xs text-gray-500">
                          Último acesso: {new Date(user.lastLogin).toLocaleDateString('pt-BR')}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button className="p-2 text-gray-400 hover:text-blue-600 rounded-lg hover:bg-blue-50">
                      <Eye className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-green-600 rounded-lg hover:bg-green-50">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Permissões por Função */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900">Permissões por Função</h3>
          
          <div className="space-y-4">
            {Object.entries(permissions).map(([role, perms]) => (
              <div key={role} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-3">
                  {getRoleIcon(role)}
                  <h4 className="font-medium text-gray-900">{getRoleLabel(role)}</h4>
                </div>
                
                <div className="space-y-2">
                  {Object.entries(perms).map(([permission, enabled]) => (
                    <div key={permission} className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 capitalize">
                        {permission === 'dashboard' && 'Dashboard'}
                        {permission === 'visitors' && 'Visitantes'}
                        {permission === 'reports' && 'Relatórios'}
                        {permission === 'settings' && 'Configurações'}
                        {permission === 'users' && 'Usuários'}
                        {permission === 'export' && 'Exportar'}
                      </span>
                      <div className={`w-4 h-4 rounded-full ${enabled ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Estatísticas Rápidas */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6 border-t">
        <div className="text-center">
          <div className="text-2xl font-bold text-church-primary">4</div>
          <div className="text-sm text-gray-600">Total de Usuários</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-green-600">3</div>
          <div className="text-sm text-gray-600">Usuários Ativos</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-yellow-600">1</div>
          <div className="text-sm text-gray-600">Administradores</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-600">1</div>
          <div className="text-sm text-gray-600">Moderadores</div>
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

export default UserManagement;
