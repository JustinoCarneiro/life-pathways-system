
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Users, Plus, Edit, Trash2, Shield } from 'lucide-react';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'sector_leader' | 'user';
  sectorId?: string;
  permissions: {
    canCreateSectors: boolean;
    canDeleteSectors: boolean;
    canManagePeople: boolean;
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
      },
    },
  ]);

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

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
        ? { ...user, role, sectorId }
        : user
    ));
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
                Gerencie permissões e acessos dos usuários do sistema
              </CardDescription>
            </div>
            <Button onClick={() => setShowCreateForm(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Novo Usuário
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {users.map((user) => (
              <div key={user.id} className="border rounded-lg p-4">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-semibold">{user.name}</h3>
                    <p className="text-sm text-gray-600">{user.email}</p>
                    <div className="flex items-center space-x-2 mt-2">
                      <Badge variant={user.role === 'sector_leader' ? 'default' : 'secondary'}>
                        {user.role === 'sector_leader' ? 'Líder de Setor' : 'Usuário'}
                      </Badge>
                      {user.sectorId && (
                        <Badge variant="outline">
                          {sectors.find(s => s.id === user.sectorId)?.name}
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button size="sm" variant="outline" onClick={() => setEditingUser(user)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="outline">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
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

                <div className="mt-4">
                  <h4 className="text-sm font-medium mb-2 flex items-center">
                    <Shield className="h-4 w-4 mr-2" />
                    Permissões
                  </h4>
                  <div className="space-y-2">
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={user.permissions.canCreateSectors}
                        onChange={() => togglePermission(user.id, 'canCreateSectors')}
                        className="rounded"
                      />
                      <span className="text-sm">Criar setores</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={user.permissions.canDeleteSectors}
                        onChange={() => togglePermission(user.id, 'canDeleteSectors')}
                        className="rounded"
                      />
                      <span className="text-sm">Excluir setores</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={user.permissions.canManagePeople}
                        onChange={() => togglePermission(user.id, 'canManagePeople')}
                        className="rounded"
                      />
                      <span className="text-sm">Gerenciar pessoas</span>
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
