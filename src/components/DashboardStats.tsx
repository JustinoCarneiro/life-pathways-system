
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, CheckCircle, TrendingUp, Heart } from 'lucide-react';

interface DashboardStatsProps {
  selectedSector: string;
  selectedLifegroup: string;
}

const DashboardStats: React.FC<DashboardStatsProps> = ({ selectedSector, selectedLifegroup }) => {
  // Mock data baseada nos filtros selecionados
  const getFilteredStats = () => {
    // Aqui você aplicaria os filtros reais aos dados
    // Por enquanto, retornando dados mockados
    
    if (selectedSector !== 'all' || selectedLifegroup !== 'all') {
      return {
        totalPeople: selectedLifegroup !== 'all' ? '8' : '15',
        baptized: selectedLifegroup !== 'all' ? '3' : '6',
        growing: selectedLifegroup !== 'all' ? '5' : '9',
        newBirth: selectedLifegroup !== 'all' ? '4' : '7',
      };
    }

    return {
      totalPeople: '24',
      baptized: '8',
      growing: '16',
      newBirth: '12',
    };
  };

  const stats = getFilteredStats();

  const statsConfig = [
    {
      title: 'Total de Pessoas',
      value: stats.totalPeople,
      description: 'Pessoas ativas nos lifegroups',
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      title: 'Batizados',
      value: stats.baptized,
      description: 'Completaram o batismo',
      icon: CheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      title: 'Em Crescimento',
      value: stats.growing,
      description: 'Progredindo nas etapas',
      icon: TrendingUp,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
    },
    {
      title: 'Novos Nascimentos',
      value: stats.newBirth,
      description: 'Aceitos recentemente',
      icon: Heart,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {statsConfig.map((stat, index) => (
        <Card key={index} className="hover:shadow-lg transition-shadow duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              {stat.title}
            </CardTitle>
            <div className={`${stat.bgColor} p-2 rounded-lg`}>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
            <p className="text-xs text-gray-500 mt-1">{stat.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default DashboardStats;
