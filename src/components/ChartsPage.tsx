
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { TrendingUp, Users, CheckCircle, BarChart3 } from 'lucide-react';

interface StepStats {
  name: string;
  count: number;
  percentage: number;
}

const ChartsPage = () => {
  const { userRole } = useAuth();
  const [stepStats, setStepStats] = useState<StepStats[]>([]);
  const [totalPeople, setTotalPeople] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#00ff00', '#ff0000', '#0088fe'];

  const stepLabels = {
    newBirth: 'Novo Nascimento',
    initialFollowUp: 'Acompanhamento Inicial',
    coffeeWithPastor: 'Café com Pastor',
    stationDNA: 'Estação DNA',
    newCreature: 'Nova Criatura',
    baptism: 'Batismo',
    discipleship: 'Discipulado'
  };

  useEffect(() => {
    if (userRole === 'admin') {
      fetchStepStatistics();
    }
  }, [userRole]);

  const fetchStepStatistics = async () => {
    try {
      setIsLoading(true);
      
      const { data: people, error } = await supabase
        .from('people')
        .select('steps');

      if (error) throw error;

      const total = people?.length || 0;
      setTotalPeople(total);

      if (total === 0) {
        setStepStats([]);
        return;
      }

      // Count each step
      const stepCounts = {
        newBirth: 0,
        initialFollowUp: 0,
        coffeeWithPastor: 0,
        stationDNA: 0,
        newCreature: 0,
        baptism: 0,
        discipleship: 0
      };

      people?.forEach(person => {
        const steps = person.steps || {};
        Object.keys(stepCounts).forEach(step => {
          if (steps[step] === true || (step === 'newBirth' && steps[step])) {
            stepCounts[step as keyof typeof stepCounts]++;
          }
        });
      });

      // Convert to chart data
      const chartData = Object.entries(stepCounts).map(([key, count]) => ({
        name: stepLabels[key as keyof typeof stepLabels],
        count,
        percentage: Math.round((count / total) * 100)
      }));

      setStepStats(chartData);
    } catch (error) {
      console.error('Error fetching step statistics:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (userRole !== 'admin') {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">
            <BarChart3 className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold mb-2">Acesso Restrito</h3>
            <p className="text-gray-600">
              Você precisa ter permissões de administrador para acessar os gráficos.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <BarChart3 className="h-5 w-5 mr-2" />
            Relatórios e Estatísticas
          </CardTitle>
          <CardDescription>
            Visualize o progresso das pessoas nos tópicos necessários
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center">
                  <Users className="h-8 w-8 text-blue-600 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total de Pessoas</p>
                    <p className="text-2xl font-bold">{totalPeople}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center">
                  <CheckCircle className="h-8 w-8 text-green-600 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-gray-600">Batizados</p>
                    <p className="text-2xl font-bold">
                      {stepStats.find(s => s.name === 'Batismo')?.count || 0}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center">
                  <TrendingUp className="h-8 w-8 text-purple-600 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-gray-600">Em Discipulado</p>
                    <p className="text-2xl font-bold">
                      {stepStats.find(s => s.name === 'Discipulado')?.count || 0}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Progresso por Tópicos - Gráfico de Barras</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={stepStats}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="name" 
                      angle={-45}
                      textAnchor="end"
                      height={100}
                      fontSize={12}
                    />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Distribuição por Tópicos - Gráfico de Pizza</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={stepStats}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percentage }) => `${name}: ${percentage}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="count"
                    >
                      {stepStats.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Detalhamento dos Tópicos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {stepStats.map((step, index) => (
                  <div key={step.name} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center">
                      <div 
                        className="w-4 h-4 rounded mr-3" 
                        style={{ backgroundColor: COLORS[index % COLORS.length] }}
                      ></div>
                      <span className="font-medium">{step.name}</span>
                    </div>
                    <div className="flex items-center space-x-4">
                      <span className="text-sm text-gray-600">{step.percentage}%</span>
                      <span className="font-bold text-lg">{step.count} pessoas</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </div>
  );
};

export default ChartsPage;
