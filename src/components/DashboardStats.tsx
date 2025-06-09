
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, CheckCircle, Coffee, Heart, Zap, Waves, Star } from 'lucide-react';

interface DashboardStatsProps {
  selectedSector: string;
  selectedLifegroup: string;
}

const DashboardStats: React.FC<DashboardStatsProps> = ({ selectedSector, selectedLifegroup }) => {
  const userRole = localStorage.getItem('userRole') || 'user';

  // Mock data baseada nos filtros selecionados
  const getFilteredStats = () => {
    if (selectedSector !== 'all' || selectedLifegroup !== 'all') {
      return {
        totalPeople: selectedLifegroup !== 'all' ? '8' : '15',
        baptized: selectedLifegroup !== 'all' ? '3' : '6',
        coffeeWithPastor: selectedLifegroup !== 'all' ? '5' : '9',
        initialFollowUp: selectedLifegroup !== 'all' ? '6' : '11',
        stationDNA: selectedLifegroup !== 'all' ? '4' : '7',
        baptism: selectedLifegroup !== 'all' ? '3' : '6',
        newCreature: selectedLifegroup !== 'all' ? '4' : '8',
      };
    }

    return {
      totalPeople: '24',
      baptized: '8',
      coffeeWithPastor: '16',
      initialFollowUp: '20',
      stationDNA: '12',
      baptism: '8',
      newCreature: '14',
    };
  };

  const stats = getFilteredStats();

  const statsConfig = [
    {
      title: 'Total de Pessoas Cadastradas',
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
      icon: Waves,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      title: 'Café com Pastor',
      value: stats.coffeeWithPastor,
      description: 'Participaram do café',
      icon: Coffee,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
    },
    {
      title: 'ACI (Acompanhamento Inicial)',
      value: stats.initialFollowUp,
      description: 'Seguimento inicial completo',
      icon: Heart,
      color: 'text-red-600',
      bgColor: 'bg-red-100',
    },
    {
      title: 'Estação DNA',
      value: stats.stationDNA,
      description: 'Completaram Station DNA',
      icon: Zap,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100',
    },
    {
      title: 'Batismo',
      value: stats.baptism,
      description: 'Realizaram o batismo',
      icon: CheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      title: 'Nova Criatura',
      value: stats.newCreature,
      description: 'Curso Nova Criatura',
      icon: Star,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-4 mb-8">
      {statsConfig.map((stat, index) => (
        <Card key={index} className="hover:shadow-lg transition-shadow duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-medium text-gray-600 leading-tight">
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
