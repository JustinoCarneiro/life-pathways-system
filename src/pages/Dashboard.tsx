
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useNavigate } from 'react-router-dom';
import SectorsList from '@/components/SectorsList';
import DashboardStats from '@/components/DashboardStats';
import UserManagement from '@/components/UserManagement';
import PeopleFilters from '@/components/PeopleFilters';
import DiscipledPeople from '@/components/DiscipledPeople';
import UserProfile from '@/components/UserProfile';
import ReportGenerator from '@/components/ReportGenerator';
import { LogOut, Plus, Users, TrendingUp, Heart, Filter, Settings, User, FileText, UserCheck } from 'lucide-react';

const Dashboard = () => {
  const navigate = useNavigate();
  const userName = localStorage.getItem('userName') || 'Usuário';
  const userRole = localStorage.getItem('userRole') || 'user';
  const [showCreateSector, setShowCreateSector] = useState(false);
  const [selectedSector, setSelectedSector] = useState<string>('all');
  const [selectedLifegroup, setSelectedLifegroup] = useState<string>('all');

  // Implementar "lembrar por 1 semana"
  useEffect(() => {
    const loginTime = localStorage.getItem('loginTime');
    if (loginTime) {
      const oneWeek = 7 * 24 * 60 * 60 * 1000; // 1 semana em milliseconds
      const now = new Date().getTime();
      const loginDate = new Date(loginTime).getTime();
      
      if (now - loginDate > oneWeek) {
        // Logout automático após 1 semana
        handleLogout();
      }
    } else {
      // Se não há loginTime, definir agora
      localStorage.setItem('loginTime', new Date().toISOString());
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('userRole');
    localStorage.removeItem('userName');
    localStorage.removeItem('loginTime');
    navigate('/');
  };

  // Mock data para setores e lifegroups
  const sectors = [
    { id: '1', name: 'Setor Norte' },
    { id: '2', name: 'Setor Sul' },
  ];

  const lifegroups = [
    { id: '1', name: 'Lifegroup Alpha', sectorId: '1' },
    { id: '2', name: 'Lifegroup Beta', sectorId: '2' },
  ];

  const filteredLifegroups = selectedSector === 'all' 
    ? lifegroups 
    : lifegroups.filter(lg => lg.sectorId === selectedSector);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Heart className="h-8 w-8 text-blue-600 mr-3" />
              <h1 className="text-xl font-semibold text-gray-900">START FORTALEZA</h1>
            </div>
            <div className="flex items-center space-x-4">
              {userRole === 'admin' && (
                <Button onClick={() => setShowCreateSector(true)} size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Novo Setor
                </Button>
              )}
              <span className="text-sm text-gray-600">Olá, {userName}</span>
              <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                {userRole === 'admin' ? 'Administrador' : 'Líder de Setor'}
              </span>
              <Button variant="outline" size="sm" onClick={handleLogout}>
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
          <p className="text-gray-600">Gerencie setores, lifegroups e acompanhe o trilho do membro</p>
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
            <div className="flex space-x-4">
              {userRole === 'admin' && (
                <div className="flex-1">
                  <label className="block text-sm font-medium mb-2">Setor</label>
                  <Select value={selectedSector} onValueChange={setSelectedSector}>
                    <SelectTrigger>
                      <SelectValue placeholder="Todos os setores" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos os setores</SelectItem>
                      {sectors.map(sector => (
                        <SelectItem key={sector.id} value={sector.id}>
                          {sector.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
              <div className="flex-1">
                <label className="block text-sm font-medium mb-2">Lifegroup</label>
                <Select value={selectedLifegroup} onValueChange={setSelectedLifegroup}>
                  <SelectTrigger>
                    <SelectValue placeholder="Todos os lifegroups" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos os lifegroups</SelectItem>
                    {filteredLifegroups.map(lifegroup => (
                      <SelectItem key={lifegroup.id} value={lifegroup.id}>
                        {lifegroup.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        <DashboardStats 
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
            <SectorsList 
              showCreateForm={showCreateSector} 
              onCloseCreateForm={() => setShowCreateSector(false)}
              selectedSector={selectedSector}
              selectedLifegroup={selectedLifegroup}
            />
          </TabsContent>

          <TabsContent value="people-filters">
            <PeopleFilters 
              selectedSector={selectedSector}
              selectedLifegroup={selectedLifegroup}
            />
          </TabsContent>

          <TabsContent value="discipled-people">
            <DiscipledPeople 
              selectedSector={selectedSector}
              selectedLifegroup={selectedLifegroup}
            />
          </TabsContent>

          <TabsContent value="reports">
            <ReportGenerator 
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
