
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import StepIcons from './StepIcons';
import { Calendar, MapPin, Phone } from 'lucide-react';

interface Person {
  id: string;
  name: string;
  contact: string;
  address: string;
  birthDate: string;
  lifegroupId: string;
  steps: {
    newBirth?: string;
    initialFollowUp?: boolean;
    coffeeWithPastor?: boolean;
    stationDNA?: boolean;
    newCreature?: boolean;
    baptism?: boolean;
  };
}

const PersonCard: React.FC<Person> = ({
  id,
  name,
  contact,
  address,
  birthDate,
  lifegroupId,
  steps,
}) => {
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

  const getProgressPercentage = () => {
    const totalSteps = 5;
    const completedSteps = Object.values(steps).filter(Boolean).length;
    return (completedSteps / totalSteps) * 100;
  };

  const progressPercentage = getProgressPercentage();

  return (
    <Card className="hover:shadow-lg transition-all duration-200 border-l-4 border-l-blue-500">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-base">{name}</CardTitle>
            <CardDescription>{calculateAge(birthDate)} anos</CardDescription>
          </div>
          <Badge 
            variant={progressPercentage === 100 ? "default" : "secondary"}
            className="text-xs"
          >
            {Math.round(progressPercentage)}%
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="space-y-1 text-xs text-gray-600">
          <div className="flex items-center">
            <Phone className="h-3 w-3 mr-2" />
            {contact}
          </div>
          <div className="flex items-center">
            <MapPin className="h-3 w-3 mr-2" />
            {address}
          </div>
          <div className="flex items-center">
            <Calendar className="h-3 w-3 mr-2" />
            {new Date(birthDate).toLocaleDateString('pt-BR')}
          </div>
        </div>

        <div className="pt-2">
          <StepIcons 
            lifegroupId={lifegroupId} 
            personId={id} 
            steps={steps} 
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default PersonCard;
