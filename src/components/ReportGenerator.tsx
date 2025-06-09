
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { FileText, Copy, Download, Filter, Calendar } from 'lucide-react';

interface ReportGeneratorProps {
  selectedSector: string;
  selectedLifegroup: string;
}

const ReportGenerator: React.FC<ReportGeneratorProps> = ({ selectedSector, selectedLifegroup }) => {
  const { toast } = useToast();
  const [generatedReport, setGeneratedReport] = useState('');
  const [reportType, setReportType] = useState<'summary' | 'detailed' | 'discipleship'>('summary');

  const generateReport = () => {
    const currentDate = new Date().toLocaleDateString('pt-BR');
    const currentTime = new Date().toLocaleTimeString('pt-BR');
    
    let report = '';
    
    if (reportType === 'summary') {
      report = `
RELATÓRIO RESUMIDO - START FORTALEZA
Data: ${currentDate} - ${currentTime}

FILTROS APLICADOS:
- Setor: ${selectedSector === 'all' ? 'Todos os setores' : `Setor ${selectedSector}`}
- Lifegroup: ${selectedLifegroup === 'all' ? 'Todos os lifegroups' : `Lifegroup ${selectedLifegroup}`}

ESTATÍSTICAS GERAIS:
- Total de Pessoas Cadastradas: 24
- Pessoas Discipuladas: 16
- Pessoas Não Discipuladas: 8
- Pessoas Sem Nenhum Tópico: 4

TÓPICOS COMPLETADOS:
- Novo Nascimento: 20 pessoas
- Acompanhamento Inicial (ACI): 20 pessoas
- Café com Pastor: 16 pessoas
- Estação DNA: 12 pessoas
- Nova Criatura: 14 pessoas
- Batismo: 8 pessoas

CRESCIMENTO ESPIRITUAL:
- Taxa de Conclusão Média: 67%
- Pessoas com Trilho Completo: 8
- Pessoas em Desenvolvimento: 16

OBSERVAÇÕES:
- 4 pessoas ainda não iniciaram nenhum tópico
- 8 pessoas precisam de discipulador
- Maior concentração no Café com Pastor (16 pessoas)
`;
    } else if (reportType === 'detailed') {
      report = `
RELATÓRIO DETALHADO - START FORTALEZA
Data: ${currentDate} - ${currentTime}

FILTROS APLICADOS:
- Setor: ${selectedSector === 'all' ? 'Todos os setores' : `Setor ${selectedSector}`}
- Lifegroup: ${selectedLifegroup === 'all' ? 'Todos os lifegroups' : `Lifegroup ${selectedLifegroup}`}

DETALHAMENTO POR SETOR:

SETOR NORTE:
- Total de Pessoas: 15
- Lifegroups: 1 (Lifegroup Alpha)
- Pessoas Discipuladas: 9
- Taxa de Conclusão: 73%

Tópicos por pessoa:
• João Silva (Líder) - Trilho Completo ✓
• Maria Santos (Assistente) - Trilho Completo ✓
• Pedro Costa - 3/7 tópicos
• Ana Paula - 5/7 tópicos
• Carlos Oliveira - 2/7 tópicos

SETOR SUL:
- Total de Pessoas: 9
- Lifegroups: 1 (Lifegroup Beta)
- Pessoas Discipuladas: 7
- Taxa de Conclusão: 61%

Tópicos por pessoa:
• Lucas Ferreira (Líder) - 6/7 tópicos
• Fernanda Lima - 4/7 tópicos
• Roberto Silva - 3/7 tópicos
• Julia Santos - 5/7 tópicos

PESSOAS SEM DISCIPULADOR:
1. Carlos Oliveira - Setor Norte
2. Roberto Silva - Setor Sul
3. Mariana Costa - Setor Norte

PRÓXIMAS AÇÕES RECOMENDADAS:
- Designar discipuladores para 8 pessoas
- Focar no desenvolvimento dos tópicos DNA e Nova Criatura
- Agendar café com pastor para 8 pessoas
`;
    } else {
      report = `
RELATÓRIO DE DISCIPULADO - START FORTALEZA
Data: ${currentDate} - ${currentTime}

FILTROS APLICADOS:
- Setor: ${selectedSector === 'all' ? 'Todos os setores' : `Setor ${selectedSector}`}
- Lifegroup: ${selectedLifegroup === 'all' ? 'Todos os lifegroups' : `Lifegroup ${selectedLifegroup}`}

RELACIONAMENTOS DE DISCIPULADO:

SETOR NORTE - LIFEGROUP ALPHA:
🔹 João Silva → Maria Santos (Relacionamento ativo)
🔹 João Silva → Pedro Costa (Relacionamento ativo)
🔹 Ana Paula → Carlos Oliveira (Relacionamento ativo)

SETOR SUL - LIFEGROUP BETA:
🔹 Lucas Ferreira → Fernanda Lima (Relacionamento ativo)
🔹 Roberto Silva → Julia Santos (Relacionamento ativo)

ESTATÍSTICAS DE DISCIPULADO:
- Total de Discipuladores Ativos: 5
- Total de Discípulos: 16
- Média de Discípulos por Discipulador: 3.2
- Taxa de Cobertura: 67% (16 de 24 pessoas)

DISCIPULADORES MAIS ATIVOS:
1. João Silva - 3 discípulos
2. Ana Paula - 2 discípulos
3. Lucas Ferreira - 2 discípulos

PESSOAS SEM DISCIPULADOR (8):
• Carlos Oliveira - Setor Norte
• Roberto Silva - Setor Sul
• Mariana Costa - Setor Norte
• Paulo Santos - Setor Sul
• Luiza Lima - Setor Norte
• Rafael Oliveira - Setor Sul
• Carla Silva - Setor Norte
• Daniel Costa - Setor Sul

RECOMENDAÇÕES:
- Identificar líderes para se tornarem discipuladores
- Estabelecer programa de treinamento para discipuladores
- Criar cronograma de acompanhamento mensal
- Implementar sistema de feedback dos discípulos
`;
    }

    setGeneratedReport(report);
    
    toast({
      title: "Relatório gerado!",
      description: "O relatório foi gerado com base nos filtros selecionados.",
    });
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedReport);
    toast({
      title: "Copiado!",
      description: "Relatório copiado para a área de transferência.",
    });
  };

  const downloadReport = () => {
    const blob = new Blob([generatedReport], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `relatorio-start-fortaleza-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Download iniciado!",
      description: "O relatório está sendo baixado.",
    });
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
            Gere relatórios detalhados com base nos filtros aplicados no dashboard
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <Filter className="h-5 w-5 text-gray-500" />
              <div className="flex space-x-2">
                <Badge variant="outline">
                  Setor: {selectedSector === 'all' ? 'Todos' : `Setor ${selectedSector}`}
                </Badge>
                <Badge variant="outline">
                  Lifegroup: {selectedLifegroup === 'all' ? 'Todos' : `LG ${selectedLifegroup}`}
                </Badge>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Tipo de Relatório</label>
              <div className="flex space-x-2">
                <Button
                  variant={reportType === 'summary' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setReportType('summary')}
                >
                  Resumido
                </Button>
                <Button
                  variant={reportType === 'detailed' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setReportType('detailed')}
                >
                  Detalhado
                </Button>
                <Button
                  variant={reportType === 'discipleship' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setReportType('discipleship')}
                >
                  Discipulado
                </Button>
              </div>
            </div>

            <Button onClick={generateReport} className="w-full">
              <Calendar className="h-4 w-4 mr-2" />
              Gerar Relatório
            </Button>
          </div>
        </CardContent>
      </Card>

      {generatedReport && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Relatório Gerado</CardTitle>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm" onClick={copyToClipboard}>
                  <Copy className="h-4 w-4 mr-2" />
                  Copiar
                </Button>
                <Button variant="outline" size="sm" onClick={downloadReport}>
                  <Download className="h-4 w-4 mr-2" />
                  Baixar
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Textarea
              value={generatedReport}
              readOnly
              className="min-h-[400px] font-mono text-sm"
            />
            <p className="text-xs text-gray-500 mt-2">
              Você pode copiar este texto e colar em qualquer aplicativo (Word, WhatsApp, Email, etc.)
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ReportGenerator;
