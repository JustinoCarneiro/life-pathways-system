
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { User, Mail, Phone, Key, Edit, Save, CheckCircle } from 'lucide-react';

const UserProfile = () => {
  const { toast } = useToast();
  const userRole = localStorage.getItem('userRole') || 'user';
  const userName = localStorage.getItem('userName') || 'Usuário';
  
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    fullName: userName,
    email: 'usuario@exemplo.com',
    contact: '(85) 99999-9999',
    sector: userRole === 'admin' ? 'Todos os setores' : 'Setor Norte',
    lifegroup: userRole === 'admin' ? 'Todos os lifegroups' : 'Lifegroup Alpha',
  });

  const handleSave = () => {
    // Simular salvamento
    localStorage.setItem('userName', profileData.fullName);
    
    toast({
      title: "Perfil atualizado!",
      description: "Suas informações foram salvas com sucesso.",
    });
    
    setIsEditing(false);
  };

  const handleRequestNewPassword = () => {
    // Simular envio de nova senha
    const newPassword = Math.random().toString(36).substring(2, 8).toUpperCase();
    
    toast({
      title: "Nova senha enviada!",
      description: `Uma nova senha foi enviada para ${profileData.email}. Nova senha: ${newPassword}`,
    });
  };

  const getRoleLabel = () => {
    switch (userRole) {
      case 'admin': return 'Administrador';
      case 'sector_leader': return 'Líder de Setor';
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
                    onChange={(e) => setProfileData(prev => ({ ...prev, email: e.target.value }))}
                    disabled={!isEditing}
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
                    onClick={handleRequestNewPassword}
                  >
                    <Key className="h-4 w-4 mr-2" />
                    Nova Senha
                  </Button>
                </div>
                <p className="text-xs text-gray-500">
                  Clique em "Nova Senha" para receber uma senha aleatória de 6 dígitos no seu email
                </p>
              </div>
            </div>
          </div>

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
