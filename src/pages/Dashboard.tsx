
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import DashboardStats from '@/components/DashboardStats';
import UserProfile from '@/components/UserProfile';
import UserManagement from '@/components/UserManagement';
import HierarchyManagement from '@/components/HierarchyManagement';
import ChartsPage from '@/components/ChartsPage';
import SectorsList from '@/components/SectorsList';
import DiscipledPeople from '@/components/DiscipledPeople';
import ReportGenerator from '@/components/ReportGenerator';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { 
  BarChart3, 
  Building, 
  FileText, 
  LogOut, 
  MapPin, 
  Plus, 
  Settings, 
  Users, 
  User,
  PlusCircle
} from 'lucide-react';

const Dashboard = () => {
  const { user, signOut, userRole } = useAuth();
  const [showCreateForm, setShowCreateForm] = useState(false);
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">DISTRITO START</h1>
              <Badge variant="secondary" className="ml-3">
                {getRoleLabel()}
              </Badge>
            </div>
            
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                {user?.user_metadata?.full_name || user?.email}
              </span>
              <Button variant="outline" size="sm" onClick={handleSignOut}>
                <LogOut className="h-4 w-4 mr-2" />
                Sair
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-7">
            <TabsTrigger value="overview" className="flex items-center">
              <BarChart3 className="h-4 w-4 mr-2" />
              Visão Geral
            </TabsTrigger>
            <TabsTrigger value="hierarchy" className="flex items-center">
              <Building className="h-4 w-4 mr-2" />
              Hierarquia
              {userRole === 'admin' && (
                <Button
                  size="sm"
                  variant="ghost"
                  className="ml-2 h-6 w-6 p-0"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowCreateForm(true);
                  }}
                >
                  <PlusCircle className="h-3 w-3" />
                </Button>
              )}
            </TabsTrigger>
            <TabsTrigger value="sectors" className="flex items-center">
              <MapPin className="h-4 w-4 mr-2" />
              Setores
            </TabsTrigger>
            <TabsTrigger value="discipled" className="flex items-center">
              <Users className="h-4 w-4 mr-2" />
              Discipulados
            </TabsTrigger>
            <TabsTrigger value="reports" className="flex items-center">
              <FileText className="h-4 w-4 mr-2" />
              Relatórios
            </TabsTrigger>
            <TabsTrigger value="charts" className="flex items-center">
              <BarChart3 className="h-4 w-4 mr-2" />
              Gráficos
            </TabsTrigger>
            <TabsTrigger value="profile" className="flex items-center">
              <User className="h-4 w-4 mr-2" />
              {userRole === 'admin' ? 'Gestão' : 'Perfil'}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <DashboardStats />
          </TabsContent>

          <TabsContent value="hierarchy" className="space-y-6">
            <HierarchyManagement 
              showCreateForm={showCreateForm}
              onCloseCreateForm={() => setShowCreateForm(false)}
              selectedArea={selectedArea}
              selectedSector={selectedSector}
              selectedLifegroup={selectedLifegroup}
              userRole={userRole}
            />
          </TabsContent>

          <TabsContent value="sectors" className="space-y-6">
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <Select value={selectedSector} onValueChange={setSelectedSector}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Selecionar Setor" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os Setores</SelectItem>
                  <SelectItem value="1">Setor Norte</SelectItem>
                  <SelectItem value="2">Setor Sul</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={selectedLifegroup} onValueChange={setSelectedLifegroup}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Selecionar Lifegroup" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os Lifegroups</SelectItem>
                  <SelectItem value="1">Lifegroup Alpha</SelectItem>
                  <SelectItem value="2">Lifegroup Beta</SelectItem>
                </SelectContent>
              </Select>

              {userRole === 'admin' && (
                <Button onClick={() => setShowCreateForm(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Novo Setor
                </Button>
              )}
            </div>

            <SectorsList 
              showCreateForm={showCreateForm}
              onCloseCreateForm={() => setShowCreateForm(false)}
              selectedSector={selectedSector}
              selectedLifegroup={selectedLifegroup}
            />
          </TabsContent>

          <TabsContent value="discipled" className="space-y-6">
            <DiscipledPeople />
          </TabsContent>

          <TabsContent value="reports" className="space-y-6">
            <ReportGenerator />
          </TabsContent>

          <TabsContent value="charts" className="space-y-6">
            <ChartsPage />
          </TabsContent>

          <TabsContent value="profile" className="space-y-6">
            {userRole === 'admin' ? (
              <Tabs defaultValue="profile" className="space-y-6">
                <TabsList>
                  <TabsTrigger value="profile">Meu Perfil</TabsTrigger>
                  <TabsTrigger value="users">Gestão de Usuários</TabsTrigger>
                </TabsList>
                
                <TabsContent value="profile">
                  <UserProfile />
                </TabsContent>
                
                <TabsContent value="users">
                  <UserManagement />
                </TabsContent>
              </Tabs>
            ) : (
              <UserProfile />
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Dashboard;
