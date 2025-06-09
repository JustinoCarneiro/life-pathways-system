
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import SectorsList from '@/components/SectorsList';
import DashboardStats from '@/components/DashboardStats';
import { LogOut, Plus, Users, TrendingUp, Heart } from 'lucide-react';

const Dashboard = () => {
  const navigate = useNavigate();
  const userName = localStorage.getItem('userName') || 'Usuário';
  const userRole = localStorage.getItem('userRole') || 'user';
  const [showCreateSector, setShowCreateSector] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('userRole');
    localStorage.removeItem('userName');
    navigate('/');
  };

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
                {userRole === 'admin' ? 'Administrador' : 'Usuário'}
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
          <p className="text-gray-600">Gerencie setores, grupos de vida e acompanhe o crescimento espiritual</p>
        </div>

        <DashboardStats />
        <SectorsList showCreateForm={showCreateSector} onCloseCreateForm={() => setShowCreateSector(false)} />
      </main>
    </div>
  );
};

export default Dashboard;
