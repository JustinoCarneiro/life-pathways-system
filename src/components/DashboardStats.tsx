
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, Users, Building, MapPin } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface DashboardStatsProps {
  selectedArea?: string;
  selectedSector?: string;
  selectedLifegroup?: string;
}

const DashboardStats: React.FC<DashboardStatsProps> = ({
  selectedArea = 'all',
  selectedSector = 'all',
  selectedLifegroup = 'all'
}) => {
  const [stats, setStats] = useState({
    totalAreas: 0,
    totalSectors: 0,
    totalLifegroups: 0,
    totalPeople: 0
  });

  useEffect(() => {
    fetchStats();
  }, [selectedArea, selectedSector, selectedLifegroup]);

  const fetchStats = async () => {
    try {
      // Fetch areas
      const { data: areas, error: areasError } = await supabase
        .from('areas')
        .select('*');

      // Fetch sectors
      const { data: sectors, error: sectorsError } = await supabase
        .from('sectors')
        .select('*');

      // Fetch lifegroups
      const { data: lifegroups, error: lifegroupsError } = await supabase
        .from('lifegroups')
        .select('*');

      // Fetch people
      const { data: people, error: peopleError } = await supabase
        .from('people')
        .select('*');

      if (areasError || sectorsError || lifegroupsError || peopleError) {
        console.error('Error fetching stats:', { areasError, sectorsError, lifegroupsError, peopleError });
        return;
      }

      setStats({
        totalAreas: areas?.length || 0,
        totalSectors: sectors?.length || 0,
        totalLifegroups: lifegroups?.length || 0,
        totalPeople: people?.length || 0
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const statsData = [
    {
      title: "Total de Áreas",
      value: stats.totalAreas,
      icon: Building,
      description: "Áreas ativas"
    },
    {
      title: "Total de Setores",
      value: stats.totalSectors,
      icon: MapPin,
      description: "Setores ativos"
    },
    {
      title: "Total de Lifegroups",
      value: stats.totalLifegroups,
      icon: Users,
      description: "Lifegroups ativos"
    },
    {
      title: "Total de Pessoas",
      value: stats.totalPeople,
      icon: TrendingUp,
      description: "Pessoas cadastradas"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
      {statsData.map((stat, index) => (
        <Card key={index}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {stat.title}
            </CardTitle>
            <stat.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <p className="text-xs text-muted-foreground">
              {stat.description}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default DashboardStats;
