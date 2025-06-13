
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Sidebar, 
  SidebarContent, 
  SidebarFooter, 
  SidebarGroup, 
  SidebarGroupContent, 
  SidebarGroupLabel, 
  SidebarHeader, 
  SidebarMenu, 
  SidebarMenuButton, 
  SidebarMenuItem, 
  SidebarProvider, 
  SidebarTrigger 
} from '@/components/ui/sidebar';
import DashboardStats from '@/components/DashboardStats';
import UserProfile from '@/components/UserProfile';
import UserManagement from '@/components/UserManagement';
import HierarchyManagement from '@/components/HierarchyManagement';
import ChartsPage from '@/components/ChartsPage';
import DiscipledPeople from '@/components/DiscipledPeople';
import ReportGenerator from '@/components/ReportGenerator';
import PeopleManagement from '@/components/PeopleManagement';
import { useAuth } from '@/hooks/useAuth';
import { 
  BarChart3, 
  Building, 
  FileText, 
  LogOut, 
  Plus, 
  Settings, 
  Users, 
  User,
  Home,
  UserCheck
} from 'lucide-react';

const Dashboard = () => {
  const { user, signOut, userRole } = useAuth();
  const [activeTab, setActiveTab] = useState('inicio');
  const [selectedArea, setSelectedArea] = useState('all');
  const [selectedSector, setSelectedSector] = useState('all');
  const [selectedLifegroup, setSelectedLifegroup] = useState('all');

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
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

  const menuItems = [
    { id: 'inicio', label: 'Início', icon: Home },
    { id: 'lideranca', label: 'Liderança', icon: Building },
    { id: 'discipulados', label: 'Discipulados', icon: UserCheck },
    { id: 'pessoas', label: 'Pessoas', icon: Users },
    { id: 'configuracoes', label: 'Configurações', icon: Settings },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'inicio':
        return (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <Select value={selectedArea} onValueChange={setSelectedArea}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Selecionar Área" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas as Áreas</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={selectedSector} onValueChange={setSelectedSector}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Selecionar Setor" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os Setores</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={selectedLifegroup} onValueChange={setSelectedLifegroup}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Selecionar Lifegroup" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os Lifegroups</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <ChartsPage />
          </div>
        );
      case 'lideranca':
        return (
          <HierarchyManagement 
            showCreateForm={false}
            onCloseCreateForm={() => {}}
            selectedArea={selectedArea}
            selectedSector={selectedSector}
            selectedLifegroup={selectedLifegroup}
            userRole={userRole}
          />
        );
      case 'discipulados':
        return (
          <DiscipledPeople 
            selectedArea={selectedArea}
            selectedSector={selectedSector}
            selectedLifegroup={selectedLifegroup}
          />
        );
      case 'pessoas':
        return <PeopleManagement />;
      case 'configuracoes':
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Configurações do Sistema</CardTitle>
                <CardDescription>
                  Gerencie as configurações gerais do sistema
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h3 className="font-medium">Perfil do Usuário</h3>
                      <p className="text-sm text-gray-600">Gerencie suas informações pessoais</p>
                    </div>
                    <Button 
                      variant="outline" 
                      onClick={() => setActiveTab('perfil')}
                    >
                      Acessar
                    </Button>
                  </div>
                  
                  {userRole === 'admin' && (
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h3 className="font-medium">Gestão de Usuários</h3>
                        <p className="text-sm text-gray-600">Gerencie usuários e permissões</p>
                      </div>
                      <Button 
                        variant="outline" 
                        onClick={() => setActiveTab('gestao-usuarios')}
                      >
                        Acessar
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        );
      case 'perfil':
        return <UserProfile />;
      case 'gestao-usuarios':
        return userRole === 'admin' ? <UserManagement /> : null;
      default:
        return <ChartsPage />;
    }
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gray-50">
        <Sidebar>
          <SidebarHeader className="p-4">
            <div className="flex items-center space-x-2">
              <h1 className="text-xl font-bold text-gray-900">DISTRITO START</h1>
            </div>
            <Badge variant="secondary" className="w-fit">
              {getRoleLabel()}
            </Badge>
          </SidebarHeader>
          
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Menu Principal</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {menuItems.map((item) => (
                    <SidebarMenuItem key={item.id}>
                      <SidebarMenuButton
                        onClick={() => setActiveTab(item.id)}
                        isActive={activeTab === item.id}
                      >
                        <item.icon className="h-4 w-4" />
                        <span>{item.label}</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
          
          <SidebarFooter className="p-4 space-y-2">
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  onClick={() => setActiveTab('perfil')}
                  isActive={activeTab === 'perfil'}
                >
                  <User className="h-4 w-4" />
                  <span>Meu Perfil</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              
              {userRole === 'admin' && (
                <SidebarMenuItem>
                  <SidebarMenuButton
                    onClick={() => setActiveTab('gestao-usuarios')}
                    isActive={activeTab === 'gestao-usuarios'}
                  >
                    <Users className="h-4 w-4" />
                    <span>Gestão de Usuários</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )}
              
              <SidebarMenuItem>
                <SidebarMenuButton onClick={handleSignOut}>
                  <LogOut className="h-4 w-4" />
                  <span>Sair</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
            
            <div className="text-xs text-gray-500 px-2">
              {user?.user_metadata?.full_name || user?.email}
            </div>
          </SidebarFooter>
        </Sidebar>

        <main className="flex-1 flex flex-col">
          <header className="bg-white shadow-sm border-b">
            <div className="flex items-center h-16 px-4">
              <SidebarTrigger />
              <div className="ml-4">
                <h2 className="text-lg font-semibold text-gray-900">
                  {menuItems.find(item => item.id === activeTab)?.label || 'Dashboard'}
                </h2>
              </div>
            </div>
          </header>

          <div className="flex-1 p-6 overflow-auto">
            {renderContent()}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Dashboard;
