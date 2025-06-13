
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { MessageCircle, Download, BarChart3, Users } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface StepsChartsProps {
  selectedArea?: string;
  selectedSector?: string;
  selectedLifegroup?: string;
}

interface StepData {
  name: string;
  count: number;
  color: string;
}

const StepsCharts: React.FC<StepsChartsProps> = ({
  selectedArea = 'all',
  selectedSector = 'all',
  selectedLifegroup = 'all'
}) => {
  const [stepsData, setStepsData] = useState<StepData[]>([]);
  const [totalPeople, setTotalPeople] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const stepColors = [
    '#8B5CF6', '#06B6D4', '#10B981', '#F59E0B',
    '#EF4444', '#6366F1', '#EC4899', '#14B8A6',
    '#F97316'
  ];

  useEffect(() => {
    fetchStepsData();
  }, [selectedArea, selectedSector, selectedLifegroup]);

  const fetchStepsData = async () => {
    try {
      setIsLoading(true);
      const { data: people, error } = await supabase
        .from('people')
        .select('steps');

      if (error) throw error;

      // Contar etapas das pessoas
      const stepsCounts = {
        'Batismo': 0,
        'Acompanhamento Inicial': 0,
        'Café com Pastor': 0,
        'Nova Criatura': 0,
        'Estação DNA': 0,
        'Expresso I': 0,
        'Expresso II': 0,
        'Novo Nascimento': 0,
        'Discipulado': 0
      };

      people?.forEach(person => {
        if (person.steps) {
          Object.keys(stepsCounts).forEach(step => {
            if (person.steps[step]) {
              stepsCounts[step as keyof typeof stepsCounts]++;
            }
          });
        }
      });

      // Dados simulados para demonstração
      const simulatedData = [
        { name: 'Batismo', count: 4 },
        { name: 'Acompanhamento Inicial', count: 2 },
        { name: 'Café com Pastor', count: 6 },
        { name: 'Nova Criatura', count: 8 },
        { name: 'Estação DNA', count: 1 },
        { name: 'Expresso I', count: 3 },
        { name: 'Expresso II', count: 5 },
        { name: 'Novo Nascimento', count: 2 },
        { name: 'Discipulado', count: 3 }
      ];

      const chartData = simulatedData.map((item, index) => ({
        ...item,
        color: stepColors[index % stepColors.length]
      }));

      setStepsData(chartData);
      setTotalPeople(people?.length || 0);
    } catch (error) {
      console.error('Error fetching steps data:', error);
      toast({
        title: "Erro ao carregar dados",
        description: "Não foi possível carregar os dados das etapas.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const generateWhatsAppReport = () => {
    const report = stepsData
      .map(step => `*${step.name}:* ${step.count} pessoas`)
      .join('\n');
    
    const message = `📊 *RELATÓRIO DE ETAPAS*\n\n${report}\n\n👥 *Total de pessoas:* ${totalPeople}\n\n_Gerado pelo Sistema Distrito Start_`;
    
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const downloadReport = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + "Etapa,Quantidade\n"
      + stepsData.map(step => `${step.name},${step.count}`).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "relatorio_etapas.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Estatísticas Gerais */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total de Pessoas</p>
                <p className="text-2xl font-bold">{totalPeople}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <BarChart3 className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Etapas Ativas</p>
                <p className="text-2xl font-bold">{stepsData.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <MessageCircle className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Relatórios</p>
                <div className="flex space-x-2 mt-2">
                  <Button size="sm" onClick={generateWhatsAppReport} className="text-xs">
                    WhatsApp
                  </Button>
                  <Button size="sm" variant="outline" onClick={downloadReport} className="text-xs">
                    <Download className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Gráfico de Barras */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Distribuição por Etapas</CardTitle>
              <CardDescription>Quantidade de pessoas em cada etapa do discipulado</CardDescription>
            </div>
            <div className="flex space-x-2">
              <Button onClick={generateWhatsAppReport} className="flex items-center">
                <MessageCircle className="h-4 w-4 mr-2" />
                Enviar por WhatsApp
              </Button>
              <Button variant="outline" onClick={downloadReport}>
                <Download className="h-4 w-4 mr-2" />
                Baixar CSV
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stepsData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="name" 
                  angle={-45}
                  textAnchor="end"
                  height={80}
                  fontSize={12}
                />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                  {stepsData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Resumo em Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-4">
        {stepsData.map((step, index) => (
          <Card key={step.name}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{step.name}</p>
                  <p className="text-2xl font-bold" style={{ color: step.color }}>
                    {step.count}
                  </p>
                </div>
                <Badge 
                  variant="secondary" 
                  style={{ backgroundColor: `${step.color}20`, color: step.color }}
                >
                  {step.count} pessoas
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default StepsCharts;
