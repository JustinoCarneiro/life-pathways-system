
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { User, Mail, Phone, Key, Edit, Save, CheckCircle, Eye, EyeOff } from 'lucide-react';

const UserProfile = () => {
  const { toast } = useToast();
  const { user, userRole } = useAuth();
  
  const [isEditing, setIsEditing] = useState(false);
  const [showPasswordChange, setShowPasswordChange] = useState(false);
  const [showPasswords, setShowPasswords] = useState({ current: false, new: false, confirm: false });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [profileData, setProfileData] = useState({
    fullName: user?.user_metadata?.full_name || 'Usuário',
    email: user?.email || 'usuario@exemplo.com',
    contact: user?.user_metadata?.contact || '(85) 99999-9999',
    sector: userRole === 'admin' ? 'Todos os setores' : 'Setor Norte',
    lifegroup: userRole === 'admin' ? 'Todos os lifegroups' : 'Lifegroup Alpha',
  });

  const handleSave = async () => {
    try {
      const { error } = await supabase.auth.updateUser({
        data: {
          full_name: profileData.fullName,
          contact: profileData.contact
        }
      });

      if (error) throw error;

      toast({
        title: "Perfil atualizado!",
        description: "Suas informações foram salvas com sucesso.",
      });
      
      setIsEditing(false);
    } catch (error) {
      toast({
        title: "Erro ao atualizar perfil",
        description: "Não foi possível salvar as alterações.",
        variant: "destructive",
      });
    }
  };

  const handlePasswordChange = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast({
        title: "Senhas não coincidem",
        description: "A nova senha e a confirmação devem ser iguais.",
        variant: "destructive",
      });
      return;
    }

    if (passwordData.newPassword.length < 6) {
      toast({
        title: "Senha muito curta",
        description: "A nova senha deve ter pelo menos 6 caracteres.",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase.auth.updateUser({
        password: passwordData.newPassword
      });

      if (error) throw error;

      toast({
        title: "Senha alterada com sucesso!",
        description: "Sua senha foi atualizada.",
      });

      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      setShowPasswordChange(false);
    } catch (error) {
      toast({
        title: "Erro ao alterar senha",
        description: "Não foi possível alterar sua senha.",
        variant: "destructive",
      });
    }
  };

  const getRoleLabel = () => {
    switch (userRole) {
      case 'admin': return 'Administrador';
      case 'area_leader': return 'Líder de Área';
      case 'sector_leader': return 'Líder de Setor';
      case 'lifegroup_leader': return 'Líder de Lifegroup';
      default: return 'Usuário';
    }
  };

  const topicsCompleted = [
    'Novo Nascimento',
    'Acompanhamento Inicial',
    'Café com Pastor',
    'Estação DNA',
    'Nova Criatura',
    'Batismo',
    'Discipulada'
  ];

  const togglePasswordVisibility = (field: 'current' | 'new' | 'confirm') => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center">
                <User className="h-5 w-5 mr-2" />
                Meu Perfil
              </CardTitle>
              <CardDescription>
                Gerencie suas informações pessoais e configurações da conta
              </CardDescription>
            </div>
            <Badge variant={userRole === 'admin' ? 'default' : 'secondary'}>
              {getRoleLabel()}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="fullName">Nome Completo</Label>
                <Input
                  id="fullName"
                  value={profileData.fullName}
                  onChange={(e) => setProfileData(prev => ({ ...prev, fullName: e.target.value }))}
                  disabled={!isEditing}
                />
              </div>
              
              <div>
                <Label htmlFor="email">Email de Acesso</Label>
                <div className="flex space-x-2">
                  <Input
                    id="email"
                    type="email"
                    value={profileData.email}
                    disabled
                  />
                  <Mail className="h-4 w-4 mt-3 text-gray-400" />
                </div>
              </div>

              <div>
                <Label htmlFor="contact">Contato</Label>
                <div className="flex space-x-2">
                  <Input
                    id="contact"
                    value={profileData.contact}
                    onChange={(e) => setProfileData(prev => ({ ...prev, contact: e.target.value }))}
                    disabled={!isEditing}
                  />
                  <Phone className="h-4 w-4 mt-3 text-gray-400" />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <Label>Setor</Label>
                <Input value={profileData.sector} disabled />
              </div>

              <div>
                <Label>Lifegroup</Label>
                <Input value={profileData.lifegroup} disabled />
              </div>

              <div className="space-y-3">
                <Label>Senha</Label>
                <div className="flex space-x-2">
                  <Input type="password" value="••••••••" disabled />
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setShowPasswordChange(true)}
                  >
                    <Key className="h-4 w-4 mr-2" />
                    Alterar
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {showPasswordChange && (
            <div className="border rounded-lg p-4 bg-gray-50">
              <h3 className="font-semibold mb-4">Alterar Senha</h3>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="newPassword">Nova Senha</Label>
                  <div className="flex space-x-2">
                    <Input
                      id="newPassword"
                      type={showPasswords.new ? "text" : "password"}
                      value={passwordData.newPassword}
                      onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                      placeholder="Digite sua nova senha"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => togglePasswordVisibility('new')}
                    >
                      {showPasswords.new ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
                <div>
                  <Label htmlFor="confirmPassword">Confirmar Nova Senha</Label>
                  <div className="flex space-x-2">
                    <Input
                      id="confirmPassword"
                      type={showPasswords.confirm ? "text" : "password"}
                      value={passwordData.confirmPassword}
                      onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                      placeholder="Confirme sua nova senha"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => togglePasswordVisibility('confirm')}
                    >
                      {showPasswords.confirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button onClick={handlePasswordChange}>
                    <Save className="h-4 w-4 mr-2" />
                    Salvar Nova Senha
                  </Button>
                  <Button variant="outline" onClick={() => setShowPasswordChange(false)}>
                    Cancelar
                  </Button>
                </div>
              </div>
            </div>
          )}

          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold mb-4">Tópicos Necessários</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {topicsCompleted.map((topic, index) => (
                <div key={index} className="flex items-center space-x-2 p-2 bg-green-50 rounded-lg">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-sm text-green-800">{topic}</span>
                </div>
              ))}
            </div>
            <p className="text-sm text-gray-600 mt-3">
              {userRole === 'admin' 
                ? 'Como administrador, você tem acesso completo a todos os recursos.' 
                : 'Você está incluído no sistema como membro do seu setor e lifegroup.'
              }
            </p>
          </div>

          <div className="flex space-x-3 pt-4 border-t">
            {isEditing ? (
              <>
                <Button onClick={handleSave}>
                  <Save className="h-4 w-4 mr-2" />
                  Salvar Dados
                </Button>
                <Button variant="outline" onClick={() => setIsEditing(false)}>
                  Cancelar
                </Button>
              </>
            ) : (
              <Button onClick={() => setIsEditing(true)}>
                <Edit className="h-4 w-4 mr-2" />
                Editar Dados
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserProfile;
