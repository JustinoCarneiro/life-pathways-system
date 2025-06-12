
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Users, Plus, Edit, Trash2, Shield, Mail, Key, Loader2 } from 'lucide-react';
import type { Database } from '@/integrations/supabase/types';

type UserRole = Database['public']['Enums']['user_role'];

interface User {
  id: string;
  email: string;
  full_name: string;
  contact?: string;
  role?: UserRole;
  created_at: string;
}

interface Sector {
  id: string;
  name: string;
}

const UserManagement = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [sectors, setSectors] = useState<Sector[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newUserData, setNewUserData] = useState({
    email: '',
    full_name: '',
    role: 'user' as UserRole,
    sectorId: '',
  });
  const [resetPasswordUserId, setResetPasswordUserId] = useState<string>('');
  const [newPassword, setNewPassword] = useState('');
  const [showPasswordReset, setShowPasswordReset] = useState(false);
  const { toast } = useToast();
  const { userRole } = useAuth();

  useEffect(() => {
    if (userRole === 'admin') {
      fetchUsers();
      fetchSectors();
      // Change admin password to 123456
      changeAdminPassword();
    }
  }, [userRole]);

  const changeAdminPassword = async () => {
    try {
      // Get all users to find the admin user
      const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers();
      
      if (authError) {
        console.error('Error fetching auth users:', authError);
        return;
      }

      const adminUser = authUsers.users.find(u => u.email === 'samuelvitoralves14@gmail.com');
      
      if (adminUser) {
        const { error } = await supabase.auth.admin.updateUserById(adminUser.id, {
          password: '123456'
        });

        if (error) {
          console.error('Error updating admin password:', error);
        } else {
          console.log('Admin password updated to 123456');
          toast({
            title: "Senha do Administrador Atualizada",
            description: "Senha alterada para: 123456",
          });
        }
      }
    } catch (error) {
      console.error('Error changing admin password:', error);
    }
  };

  const fetchUsers = async () => {
    try {
      // Fetch profiles first
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('id, full_name, contact, created_at');

      if (profilesError) throw profilesError;

      // Fetch user roles separately
      const { data: rolesData, error: rolesError } = await supabase
        .from('user_roles')
        .select('user_id, role');

      if (rolesError) throw rolesError;

      // Get user emails from auth metadata (this requires admin privileges)
      const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers();
      
      if (authError) {
        console.error('Error fetching auth users:', authError);
        // If we can't fetch auth users, just show profiles without emails
        const usersWithoutEmails = profilesData?.map(profile => {
          const userRole = rolesData?.find(role => role.user_id === profile.id);
          return {
            id: profile.id,
            email: 'Email not available',
            full_name: profile.full_name,
            contact: profile.contact || '',
            role: userRole?.role as UserRole,
            created_at: profile.created_at,
          };
        }) || [];
        setUsers(usersWithoutEmails);
        return;
      }

      const usersWithEmails = profilesData?.map(profile => {
        const authUser = authUsers.users.find(u => u.id === profile.id);
        const userRole = rolesData?.find(role => role.user_id === profile.id);
        return {
          id: profile.id,
          email: authUser?.email || 'No email',
          full_name: profile.full_name,
          contact: profile.contact || '',
          role: userRole?.role as UserRole,
          created_at: profile.created_at,
        };
      }) || [];

      setUsers(usersWithEmails);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast({
        title: "Erro ao carregar usuários",
        description: "Não foi possível carregar a lista de usuários.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchSectors = async () => {
    try {
      const { data, error } = await supabase
        .from('sectors')
        .select('id, name')
        .order('name');

      if (error) throw error;
      setSectors(data || []);
    } catch (error) {
      console.error('Error fetching sectors:', error);
    }
  };

  const updateUserRole = async (userId: string, newRole: UserRole) => {
    try {
      const { error } = await supabase
        .from('user_roles')
        .upsert({ 
          user_id: userId, 
          role: newRole 
        }, { 
          onConflict: 'user_id' 
        });

      if (error) throw error;

      setUsers(prev => prev.map(user => 
        user.id === userId ? { ...user, role: newRole } : user
      ));

      toast({
        title: "Função atualizada",
        description: "A função do usuário foi atualizada com sucesso.",
      });
    } catch (error) {
      console.error('Error updating user role:', error);
      toast({
        title: "Erro ao atualizar função",
        description: "Não foi possível atualizar a função do usuário.",
        variant: "destructive",
      });
    }
  };

  const handleCreateUser = async () => {
    if (!newUserData.email || !newUserData.full_name) {
      toast({
        title: "Campos obrigatórios",
        description: "Email e nome completo são obrigatórios.",
        variant: "destructive",
      });
      return;
    }

    try {
      // Create user in auth
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: newUserData.email,
        password: Math.random().toString(36).slice(-12), // Generate random password
        user_metadata: {
          full_name: newUserData.full_name
        }
      });

      if (authError) throw authError;

      if (authData.user) {
        // Create profile
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            id: authData.user.id,
            full_name: newUserData.full_name,
            contact: newUserData.email
          });

        if (profileError) throw profileError;

        // Assign role
        const { error: roleError } = await supabase
          .from('user_roles')
          .insert({
            user_id: authData.user.id,
            role: newUserData.role
          });

        if (roleError) throw roleError;

        toast({
          title: "Usuário criado com sucesso",
          description: `${newUserData.full_name} foi adicionado ao sistema.`,
        });

        setNewUserData({ email: '', full_name: '', role: 'user', sectorId: '' });
        setShowCreateForm(false);
        fetchUsers();
      }
    } catch (error) {
      console.error('Error creating user:', error);
      toast({
        title: "Erro ao criar usuário",
        description: "Não foi possível criar o usuário.",
        variant: "destructive",
      });
    }
  };

  const handleResetPassword = async (userId: string, customPassword?: string) => {
    try {
      const passwordToSet = customPassword || Math.random().toString(36).slice(-12);
      
      const { error } = await supabase.auth.admin.updateUserById(userId, {
        password: passwordToSet
      });

      if (error) throw error;

      const user = users.find(u => u.id === userId);
      toast({
        title: "Senha redefinida",
        description: `Nova senha para ${user?.email}: ${passwordToSet}`,
      });

      setShowPasswordReset(false);
      setResetPasswordUserId('');
      setNewPassword('');
    } catch (error) {
      console.error('Error resetting password:', error);
      toast({
        title: "Erro ao redefinir senha",
        description: "Não foi possível redefinir a senha.",
        variant: "destructive",
      });
    }
  };

  const deleteUser = async (userId: string) => {
    if (!confirm('Tem certeza que deseja excluir este usuário?')) return;

    try {
      const { error } = await supabase.auth.admin.deleteUser(userId);

      if (error) throw error;

      setUsers(prev => prev.filter(user => user.id !== userId));
      
      toast({
        title: "Usuário excluído",
        description: "O usuário foi removido do sistema.",
      });
    } catch (error) {
      console.error('Error deleting user:', error);
      toast({
        title: "Erro ao excluir usuário",
        description: "Não foi possível excluir o usuário.",
        variant: "destructive",
      });
    }
  };

  const getRoleLabel = (role?: UserRole) => {
    switch (role) {
      case 'admin': return 'Administrador';
      case 'area_leader': return 'Líder de Área';
      case 'sector_leader': return 'Líder de Setor';
      case 'lifegroup_leader': return 'Líder de Lifegroup';
      default: return 'Usuário';
    }
  };

  const getRoleBadgeVariant = (role?: UserRole) => {
    switch (role) {
      case 'admin': return 'default';
      case 'area_leader': return 'secondary';
      case 'sector_leader': return 'secondary';
      case 'lifegroup_leader': return 'outline';
      default: return 'outline';
    }
  };

  if (userRole !== 'admin') {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">
            <Shield className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold mb-2">Acesso Restrito</h3>
            <p className="text-gray-600">
              Você precisa ter permissões de administrador para acessar esta página.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin mr-2" />
            Carregando usuários...
          </div>
        </CardContent>
      </Card>
    );
  }

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
                Gerencie usuários, funções e permissões do sistema
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
                  <label className="block text-sm font-medium mb-2">Nome Completo</label>
                  <Input
                    value={newUserData.full_name}
                    onChange={(e) => setNewUserData(prev => ({ ...prev, full_name: e.target.value }))}
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
                    onValueChange={(role: UserRole) => setNewUserData(prev => ({ ...prev, role }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="user">Usuário</SelectItem>
                      <SelectItem value="lifegroup_leader">Líder de Lifegroup</SelectItem>
                      <SelectItem value="sector_leader">Líder de Setor</SelectItem>
                      <SelectItem value="area_leader">Líder de Área</SelectItem>
                      <SelectItem value="admin">Administrador</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex space-x-2 mt-4">
                <Button onClick={handleCreateUser}>
                  <Mail className="h-4 w-4 mr-2" />
                  Criar Usuário
                </Button>
                <Button variant="outline" onClick={() => setShowCreateForm(false)}>
                  Cancelar
                </Button>
              </div>
            </div>
          )}

          {showPasswordReset && (
            <div className="border rounded-lg p-4 mb-6 bg-gray-50">
              <h3 className="font-semibold mb-4">Alterar Senha do Usuário</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Nova Senha</label>
                  <Input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Digite a nova senha"
                  />
                </div>
              </div>
              <div className="flex space-x-2 mt-4">
                <Button onClick={() => handleResetPassword(resetPasswordUserId, newPassword)}>
                  <Key className="h-4 w-4 mr-2" />
                  Alterar Senha
                </Button>
                <Button variant="outline" onClick={() => {
                  setShowPasswordReset(false);
                  setResetPasswordUserId('');
                  setNewPassword('');
                }}>
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
                    <h3 className="font-semibold">{user.full_name}</h3>
                    <p className="text-sm text-gray-600">{user.email}</p>
                    <div className="flex items-center space-x-2 mt-2">
                      <Badge variant={getRoleBadgeVariant(user.role)}>
                        {getRoleLabel(user.role)}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => {
                        setResetPasswordUserId(user.id);
                        setShowPasswordReset(true);
                      }}
                    >
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

                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Função</label>
                    <Select 
                      value={user.role || 'user'} 
                      onValueChange={(role: UserRole) => updateUserRole(user.id, role)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="user">Usuário</SelectItem>
                        <SelectItem value="lifegroup_leader">Líder de Lifegroup</SelectItem>
                        <SelectItem value="sector_leader">Líder de Setor</SelectItem>
                        <SelectItem value="area_leader">Líder de Área</SelectItem>
                        <SelectItem value="admin">Administrador</SelectItem>
                      </SelectContent>
                    </Select>
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
