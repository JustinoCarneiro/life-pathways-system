
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/hooks/useAuth';
import { Navigate } from 'react-router-dom';
import HierarchyManagement from '@/components/HierarchyManagement';
import DashboardStats from '@/components/DashboardStats';
import UserManagement from '@/components/UserManagement';
import PeopleFilters from '@/components/PeopleFilters';
import DiscipledPeople from '@/components/DiscipledPeople';
import UserProfile from '@/components/UserProfile';
import ReportGenerator from '@/components/ReportGenerator';
import { LogOut, Plus, Users, TrendingUp, Heart, Filter, Settings, User, FileText, UserCheck, Menu } from 'lucide-react';

const Dashboard = () => {
  const { user, isLoading, userRole, signOut } = useAuth();
  const [showCreateArea, setShowCreateArea] = useState(false);
  const [selectedArea, setSelectedArea] = useState<string>('all');
  const [selectedSector, setSelectedSector] = useState<string>('all');
  const [selectedLifegroup, setSelectedLifegroup] = useState<string>('all');

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/" replace />;
  }

  const userName = user.user_metadata?.full_name || user.email?.split('@')[0] || 'Usuário';

  const getRoleLabel = (role: string | null) => {
    switch (role) {
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
              <Button variant="ghost" size="sm" className="mr-2 lg:hidden">
                <Menu className="h-5 w-5" />
              </Button>
              <Heart className="h-8 w-8 text-blue-600 mr-3" />
              <div className="text-left">
                <h1 className="text-xl font-semibold text-gray-900">START FORTALEZA</h1>
                <p className="text-xs text-gray-600">Sistema de Gestão</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              {userRole === 'admin' && (
                <Button onClick={() => setShowCreateArea(true)} size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Nova Área
                </Button>
              )}
              <span className="text-sm text-gray-600 hidden sm:inline">Olá, {userName}</span>
              <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                {getRoleLabel(userRole)}
              </span>
              <Button variant="outline" size="sm" onClick={signOut}>
                <LogOut className="h-4 w-4 mr-2" />
                Sair
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Dashboard</h2>
          <p className="text-gray-600">Gerencie a hierarquia e acompanhe o trilho dos membros</p>
        </div>

        {/* Filtros */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Filter className="h-5 w-5 mr-2" />
              Filtros
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {(userRole === 'admin' || userRole === 'area_leader') && (
                <div>
                  <label className="block text-sm font-medium mb-2">Área</label>
                  <Select value={selectedArea} onValueChange={setSelectedArea}>
                    <SelectTrigger>
                      <SelectValue placeholder="Todas as áreas" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todas as áreas</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
              <div>
                <label className="block text-sm font-medium mb-2">Setor</label>
                <Select value={selectedSector} onValueChange={setSelectedSector}>
                  <SelectTrigger>
                    <SelectValue placeholder="Todos os setores" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos os setores</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Lifegroup</label>
                <Select value={selectedLifegroup} onValueChange={setSelectedLifegroup}>
                  <SelectTrigger>
                    <SelectValue placeholder="Todos os lifegroups" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos os lifegroups</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        <DashboardStats 
          selectedArea={selectedArea}
          selectedSector={selectedSector}
          selectedLifegroup={selectedLifegroup}
        />

        <Tabs defaultValue="hierarchy" className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="hierarchy">Hierarquia</TabsTrigger>
            <TabsTrigger value="people-filters">Filtro de Pessoas</TabsTrigger>
            <TabsTrigger value="discipled-people">Pessoas Discipuladas</TabsTrigger>
            <TabsTrigger value="reports">Relatórios</TabsTrigger>
            {userRole === 'admin' && <TabsTrigger value="user-management">Gestão de Usuários</TabsTrigger>}
            <TabsTrigger value="profile">Perfil</TabsTrigger>
          </TabsList>

          <TabsContent value="hierarchy">
            <HierarchyManagement 
              showCreateForm={showCreateArea} 
              onCloseCreateForm={() => setShowCreateArea(false)}
              selectedArea={selectedArea}
              selectedSector={selectedSector}
              selectedLifegroup={selectedLifegroup}
              userRole={userRole}
            />
          </TabsContent>

          <TabsContent value="people-filters">
            <PeopleFilters 
              selectedArea={selectedArea}
              selectedSector={selectedSector}
              selectedLifegroup={selectedLifegroup}
            />
          </TabsContent>

          <TabsContent value="discipled-people">
            <DiscipledPeople 
              selectedArea={selectedArea}
              selectedSector={selectedSector}
              selectedLifegroup={selectedLifegroup}
            />
          </TabsContent>

          <TabsContent value="reports">
            <ReportGenerator 
              selectedArea={selectedArea}
              selectedSector={selectedSector}
              selectedLifegroup={selectedLifegroup}
            />
          </TabsContent>

          {userRole === 'admin' && (
            <TabsContent value="user-management">
              <UserManagement />
            </TabsContent>
          )}

          <TabsContent value="profile">
            <UserProfile />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Dashboard;
