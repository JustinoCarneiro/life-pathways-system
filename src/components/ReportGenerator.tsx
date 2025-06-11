
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { FileText, Download, BarChart3 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface ReportGeneratorProps {
  selectedArea: string;
  selectedSector: string;
  selectedLifegroup: string;
}

const ReportGenerator: React.FC<ReportGeneratorProps> = ({
  selectedArea,
  selectedSector,
  selectedLifegroup
}) => {
  const [reportType, setReportType] = useState('general');
  const [reportData, setReportData] = useState<any>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const reportTypes = [
    { value: 'general', label: 'Relatório Geral' },
    { value: 'people', label: 'Relatório de Pessoas' },
    { value: 'disciples', label: 'Relatório de Discipulados' },
    { value: 'leaders', label: 'Relatório de Líderes' },
    { value: 'steps', label: 'Relatório do Trilho' }
  ];

  const generateReport = async () => {
    setIsGenerating(true);
    try {
      // Fetch data based on report type
      const { data: people, error } = await supabase
        .from('people')
        .select('*');

      if (error) {
        console.error('Error fetching data for report:', error);
        return;
      }

      // Process data based on report type
      let processedData;
      switch (reportType) {
        case 'general':
          processedData = generateGeneralReport(people || []);
          break;
        case 'people':
          processedData = generatePeopleReport(people || []);
          break;
        case 'disciples':
          processedData = generateDisciplesReport(people || []);
          break;
        case 'leaders':
          processedData = generateLeadersReport(people || []);
          break;
        case 'steps':
          processedData = generateStepsReport(people || []);
          break;
        default:
          processedData = generateGeneralReport(people || []);
      }

      setReportData(processedData);
    } catch (error) {
      console.error('Error generating report:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const generateGeneralReport = (people: any[]) => {
    return {
      title: 'Relatório Geral',
      summary: {
        totalPeople: people.length,
        totalLeaders: people.filter(p => p.is_leader).length,
        totalAssistants: people.filter(p => p.is_assistant).length,
        totalDiscipled: people.filter(p => p.discipler_id).length
      },
      data: people
    };
  };

  const generatePeopleReport = (people: any[]) => {
    return {
      title: 'Relatório de Pessoas',
      summary: {
        totalPeople: people.length,
        byAge: {
          young: people.filter(p => p.birth_date && calculateAge(p.birth_date) <= 25).length,
          adult: people.filter(p => p.birth_date && calculateAge(p.birth_date) > 25 && calculateAge(p.birth_date) <= 50).length,
          senior: people.filter(p => p.birth_date && calculateAge(p.birth_date) > 50).length
        }
      },
      data: people
    };
  };

  const generateDisciplesReport = (people: any[]) => {
    const discipled = people.filter(p => p.discipler_id);
    return {
      title: 'Relatório de Discipulados',
      summary: {
        totalDiscipled: discipled.length,
        activeDisciples: discipled.length
      },
      data: discipled
    };
  };

  const generateLeadersReport = (people: any[]) => {
    const leaders = people.filter(p => p.is_leader || p.is_assistant);
    return {
      title: 'Relatório de Líderes',
      summary: {
        totalLeaders: people.filter(p => p.is_leader).length,
        totalAssistants: people.filter(p => p.is_assistant).length
      },
      data: leaders
    };
  };

  const generateStepsReport = (people: any[]) => {
    return {
      title: 'Relatório do Trilho',
      summary: {
        totalPeople: people.length,
        withSteps: people.filter(p => p.steps && Object.keys(p.steps).length > 0).length
      },
      data: people
    };
  };

  const calculateAge = (birthDate: string) => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  const downloadReport = () => {
    if (!reportData) return;
    
    const dataStr = JSON.stringify(reportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${reportData.title.toLowerCase().replace(/\s+/g, '-')}-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <FileText className="h-5 w-5 mr-2" />
            Gerador de Relatórios
          </CardTitle>
          <CardDescription>
            Gere relatórios detalhados sobre pessoas, liderança e discipulado
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium mb-2">Tipo de Relatório</label>
              <Select value={reportType} onValueChange={setReportType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {reportTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end">
              <Button 
                onClick={generateReport} 
                disabled={isGenerating}
                className="w-full"
              >
                <BarChart3 className="h-4 w-4 mr-2" />
                {isGenerating ? 'Gerando...' : 'Gerar Relatório'}
              </Button>
            </div>
          </div>

          {reportData && (
            <div className="border rounded-lg p-4 bg-gray-50">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">{reportData.title}</h3>
                <Button onClick={downloadReport} size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                {Object.entries(reportData.summary).map(([key, value]: [string, any]) => (
                  <div key={key} className="text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      {typeof value === 'object' ? Object.values(value).reduce((a: any, b: any) => a + b, 0) : value}
                    </div>
                    <div className="text-sm text-gray-600 capitalize">
                      {key.replace(/([A-Z])/g, ' $1').toLowerCase()}
                    </div>
                  </div>
                ))}
              </div>

              <div className="text-sm text-gray-600">
                <strong>Dados processados:</strong> {reportData.data.length} registros
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ReportGenerator;
