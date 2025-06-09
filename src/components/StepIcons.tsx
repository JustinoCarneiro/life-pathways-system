
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { CheckCircle, Circle, Heart, Coffee, Dna, Sparkles, Waves } from 'lucide-react';

interface Steps {
  newBirth?: string;
  initialFollowUp?: boolean;
  coffeeWithPastor?: boolean;
  stationDNA?: boolean;
  newCreature?: boolean;
  baptism?: boolean;
}

interface StepIconsProps {
  lifegroupId: string;
  personId: string;
  steps: Steps;
}

const StepIcons: React.FC<StepIconsProps> = ({ lifegroupId, personId, steps }) => {
  const [currentSteps, setCurrentSteps] = useState(steps);
  const { toast } = useToast();

  const stepsList = [
    {
      key: 'newBirth',
      label: 'Novo Nascimento',
      icon: Heart,
      color: 'bg-red-100 text-red-700 border-red-200',
      activeColor: 'bg-red-500 text-white',
    },
    {
      key: 'initialFollowUp',
      label: 'Acompanhamento',
      icon: CheckCircle,
      color: 'bg-blue-100 text-blue-700 border-blue-200',
      activeColor: 'bg-blue-500 text-white',
    },
    {
      key: 'coffeeWithPastor',
      label: 'Café com Pastor',
      icon: Coffee,
      color: 'bg-orange-100 text-orange-700 border-orange-200',
      activeColor: 'bg-orange-500 text-white',
    },
    {
      key: 'stationDNA',
      label: 'Estação DNA',
      icon: Dna,
      color: 'bg-purple-100 text-purple-700 border-purple-200',
      activeColor: 'bg-purple-500 text-white',
    },
    {
      key: 'newCreature',
      label: 'Nova Criatura',
      icon: Sparkles,
      color: 'bg-green-100 text-green-700 border-green-200',
      activeColor: 'bg-green-500 text-white',
    },
    {
      key: 'baptism',
      label: 'Batismo',
      icon: Waves,
      color: 'bg-cyan-100 text-cyan-700 border-cyan-200',
      activeColor: 'bg-cyan-500 text-white',
    },
  ];

  const toggleStep = async (stepKey: string) => {
    const isCompleted = currentSteps[stepKey as keyof Steps];
    
    // Simular atualização no banco de dados
    setTimeout(() => {
      setCurrentSteps(prev => ({
        ...prev,
        [stepKey]: stepKey === 'newBirth' ? 
          (isCompleted ? undefined : new Date().toISOString().split('T')[0]) :
          !isCompleted
      }));

      toast({
        title: isCompleted ? "Etapa desmarcada" : "Etapa concluída!",
        description: `${stepsList.find(s => s.key === stepKey)?.label} foi ${isCompleted ? 'desmarcada' : 'marcada como concluída'}.`,
      });
    }, 300);
  };

  return (
    <div className="space-y-3">
      <h4 className="text-sm font-medium text-gray-700">Etapas do Crescimento</h4>
      <div className="grid grid-cols-2 gap-2">
        {stepsList.map((step) => {
          const StepIcon = step.icon;
          const isCompleted = Boolean(currentSteps[step.key as keyof Steps]);
          
          return (
            <Button
              key={step.key}
              variant="outline"
              size="sm"
              onClick={() => toggleStep(step.key)}
              className={`
                flex items-center justify-start gap-2 h-auto py-2 px-3 text-xs
                transition-all duration-200 hover:scale-105
                ${isCompleted ? step.activeColor : step.color}
              `}
            >
              <StepIcon size={14} />
              <span className="truncate">{step.label}</span>
              {isCompleted && <CheckCircle size={12} className="ml-auto" />}
            </Button>
          );
        })}
      </div>
      
      {currentSteps.newBirth && (
        <Badge variant="outline" className="text-xs">
          Novo nascimento: {new Date(currentSteps.newBirth).toLocaleDateString('pt-BR')}
        </Badge>
      )}
    </div>
  );
};

export default StepIcons;
