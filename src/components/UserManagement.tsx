
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Users, Plus, Edit, Trash2, Shield, Mail, Key } from 'lucide-react';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'sector_leader' | 'user';
  sectorId?: string;
  permissions: {
    canCreateSectors: boolean;
    canDeleteSectors: boolean;
    canManagePeople: boolean;
    canAddPeople: boolean;
    canEditPeople: boolean;
    canDeletePeople: boolean;
  };
}

const UserManagement = () => {
  const [users, setUsers] = useState<User[]>([
    {
      id: '1',
      name: 'João Silva',
      email: 'joao@example.com',
      role: 'sector_leader',
      sectorId: '1',
      permissions: {
        canCreateSectors: false,
        canDeleteSectors: false,
        canManagePeople: true,
        canAddPeople: true,
        canEditPeople: true,
        canDeletePeople: false,
      },
    },
    {
      id: '2',
      name: 'Maria Santos',
      email: 'maria@example.com',
      role: 'user',
      permissions: {
        canCreateSectors: false,
        canDeleteSectors: false,
        canManagePeople: false,
        canAddPeople: false,
        canEditPeople: false,
        canDeletePeople: false,
      },
    },
  ]);

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newUserData, setNewUserData] = useState({
    name: '',
    email: '',
    role: 'user' as User['role'],
    sectorId: '',
  });

  const sectors = [
    { id: '1', name: 'Setor Norte' },
    { id: '2', name: 'Setor Sul' },
  ];

  const togglePermission = (userId: string, permission: keyof User['permissions']) => {
    setUsers(prev => prev.map(user => 
      user.id === userId 
        ? { 
            ...user, 
            permissions: { 
              ...user.permissions, 
              [permission]: !user.permissions[permission] 
            } 
          }
        : user
    ));
  };

  const updateUserRole = (userId: string, role: User['role'], sectorId?: string) => {
    setUsers(prev => prev.map(user => 
      user.id === userId 
        ? { 
            ...user, 
            role, 
            sectorId: role === 'sector_leader' ? sectorId : undefined,
            permissions: role === 'admin' ? {
              canCreateSectors: true,
              canDeleteSectors: true,
              canManagePeople: true,
              canAddPeople: true,
              canEditPeople: true,
              canDeletePeople: true,
            } : user.permissions
          }
        : user
    ));
  };

  const handleCreateUser = () => {
    if (newUserData.name && newUserData.email) {
      const newUser: User = {
        id: Date.now().toString(),
        ...newUserData,
        permissions: {
          canCreateSectors: newUserData.role === 'admin',
          canDeleteSectors: newUserData.role === 'admin',
          canManagePeople: newUserData.role !== 'user',
          canAddPeople: newUserData.role !== 'user',
          canEditPeople: newUserData.role !== 'user',
          canDeletePeople: newUserData.role === 'admin',
        },
      };
      setUsers(prev => [...prev, newUser]);
      setNewUserData({ name: '', email: '', role: 'user', sectorId: '' });
      setShowCreateForm(false);
      
      // Simular envio de email com senha aleatória
      const randomPassword = Math.random().toString(36).slice(-8);
      console.log(`Email enviado para ${newUser.email} com senha: ${randomPassword}`);
    }
  };

  const handleResetPassword = (userId: string) => {
    const user = users.find(u => u.id === userId);
    if (user) {
      const newPassword = Math.random().toString(36).slice(-8);
      console.log(`Nova senha para ${user.email}: ${newPassword}`);
      alert(`Nova senha enviada para ${user.email}`);
    }
  };

  const deleteUser = (userId: string) => {
    if (confirm('Tem certeza que deseja excluir este usuário?')) {
      setUsers(prev => prev.filter(user => user.id !== userId));
    }
  };

  const getRoleLabel = (role: User['role']) => {
    switch (role) {
      case 'admin': return 'Administrador';
      case 'sector_leader': return 'Líder de Setor';
      default: return 'Usuário';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="flex items-center">
                <Users className="h-5 w-5 mr-2" />
                Gestão de Usuários
              </CardTitle>
              <CardDescription>
                Gerencie permissões, acessos e senhas dos usuários do sistema
              </CardDescription>
            </div>
            <Button onClick={() => setShowCreateForm(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Novo Usuário
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {showCreateForm && (
            <div className="border rounded-lg p-4 mb-6 bg-gray-50">
              <h3 className="font-semibold mb-4">Cadastrar Novo Usuário</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Nome</label>
                  <Input
                    value={newUserData.name}
                    onChange={(e) => setNewUserData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Nome completo"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Email</label>
                  <Input
                    type="email"
                    value={newUserData.email}
                    onChange={(e) => setNewUserData(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="email@exemplo.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Função</label>
                  <Select 
                    value={newUserData.role} 
                    onValueChange={(role: User['role']) => setNewUserData(prev => ({ ...prev, role }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="user">Usuário</SelectItem>
                      <SelectItem value="sector_leader">Líder de Setor</SelectItem>
                      <SelectItem value="admin">Administrador</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {newUserData.role === 'sector_leader' && (
                  <div>
                    <label className="block text-sm font-medium mb-2">Setor</label>
                    <Select 
                      value={newUserData.sectorId} 
                      onValueChange={(sectorId) => setNewUserData(prev => ({ ...prev, sectorId }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione um setor" />
                      </SelectTrigger>
                      <SelectContent>
                        {sectors.map(sector => (
                          <SelectItem key={sector.id} value={sector.id}>
                            {sector.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>
              <div className="flex space-x-2 mt-4">
                <Button onClick={handleCreateUser}>
                  <Mail className="h-4 w-4 mr-2" />
                  Criar e Enviar Acesso
                </Button>
                <Button variant="outline" onClick={() => setShowCreateForm(false)}>
                  Cancelar
                </Button>
              </div>
            </div>
          )}

          <div className="space-y-4">
            {users.map((user) => (
              <div key={user.id} className="border rounded-lg p-4">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-semibold">{user.name}</h3>
                    <p className="text-sm text-gray-600">{user.email}</p>
                    <div className="flex items-center space-x-2 mt-2">
                      <Badge variant={user.role === 'admin' ? 'default' : user.role === 'sector_leader' ? 'secondary' : 'outline'}>
                        {getRoleLabel(user.role)}
                      </Badge>
                      {user.sectorId && (
                        <Badge variant="outline">
                          {sectors.find(s => s.id === user.sectorId)?.name}
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button size="sm" variant="outline" onClick={() => handleResetPassword(user.id)}>
                      <Key className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="outline">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => deleteUser(user.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Função</label>
                    <Select 
                      value={user.role} 
                      onValueChange={(role: User['role']) => updateUserRole(user.id, role, user.sectorId)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="user">Usuário</SelectItem>
                        <SelectItem value="sector_leader">Líder de Setor</SelectItem>
                        <SelectItem value="admin">Administrador</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {user.role === 'sector_leader' && (
                    <div>
                      <label className="block text-sm font-medium mb-2">Setor</label>
                      <Select 
                        value={user.sectorId || ''} 
                        onValueChange={(sectorId) => updateUserRole(user.id, user.role, sectorId)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione um setor" />
                        </SelectTrigger>
                        <SelectContent>
                          {sectors.map(sector => (
                            <SelectItem key={sector.id} value={sector.id}>
                              {sector.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                </div>

                <div>
                  <h4 className="text-sm font-medium mb-2 flex items-center">
                    <Shield className="h-4 w-4 mr-2" />
                    Permissões
                  </h4>
                  <div className="grid grid-cols-2 gap-2">
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={user.permissions.canCreateSectors}
                        onChange={() => togglePermission(user.id, 'canCreateSectors')}
                        disabled={user.role === 'admin'}
                        className="rounded"
                      />
                      <span className="text-sm">Criar setores</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={user.permissions.canDeleteSectors}
                        onChange={() => togglePermission(user.id, 'canDeleteSectors')}
                        disabled={user.role === 'admin'}
                        className="rounded"
                      />
                      <span className="text-sm">Excluir setores</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={user.permissions.canAddPeople}
                        onChange={() => togglePermission(user.id, 'canAddPeople')}
                        disabled={user.role === 'admin'}
                        className="rounded"
                      />
                      <span className="text-sm">Adicionar pessoas</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={user.permissions.canEditPeople}
                        onChange={() => togglePermission(user.id, 'canEditPeople')}
                        disabled={user.role === 'admin'}
                        className="rounded"
                      />
                      <span className="text-sm">Editar pessoas</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={user.permissions.canDeletePeople}
                        onChange={() => togglePermission(user.id, 'canDeletePeople')}
                        disabled={user.role === 'admin'}
                        className="rounded"
                      />
                      <span className="text-sm">Excluir pessoas</span>
                    </label>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserManagement;
