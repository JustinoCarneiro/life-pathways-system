
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import PersonCard from './PersonCard';
import { UserCheck, Users } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface DiscipledPeopleProps {
  selectedArea: string;
  selectedSector: string;
  selectedLifegroup: string;
}

interface Person {
  id: string;
  name: string;
  contact: string;
  address: string;
  birth_date: string;
  lifegroup_id: string;
  is_leader: boolean;
  is_assistant: boolean;
  discipler_id?: string;
  steps: any;
}

const DiscipledPeople: React.FC<DiscipledPeopleProps> = ({
  selectedArea,
  selectedSector,
  selectedLifegroup
}) => {
  const [discipledPeople, setDiscipledPeople] = useState<Person[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchDiscipledPeople();
  }, [selectedArea, selectedSector, selectedLifegroup]);

  const fetchDiscipledPeople = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('people')
        .select('*')
        .not('discipler_id', 'is', null);

      if (error) {
        console.error('Error fetching discipled people:', error);
        return;
      }

      setDiscipledPeople(data || []);
    } catch (error) {
      console.error('Error fetching discipled people:', error);
    } finally {
      setIsLoading(false);
    }
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
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <UserCheck className="h-5 w-5 mr-2" />
            Pessoas Discipuladas
          </CardTitle>
          <CardDescription>
            Lista de pessoas que estão sendo discipuladas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-2">
              <Users className="h-4 w-4" />
              <span className="text-sm font-medium">{discipledPeople.length} pessoas discipuladas</span>
            </div>
            <Badge variant="default">{discipledPeople.length} Total</Badge>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {discipledPeople.map((person) => (
              <PersonCard
                key={person.id}
                id={person.id}
                name={person.name}
                contact={person.contact || ''}
                address={person.address || ''}
                birthDate={person.birth_date}
                lifegroupId={person.lifegroup_id}
                isLeader={person.is_leader}
                isAssistant={person.is_assistant}
                disciplerId={person.discipler_id}
                steps={person.steps || {}}
              />
            ))}
          </div>

          {discipledPeople.length === 0 && (
            <div className="text-center py-12">
              <UserCheck className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhuma pessoa discipulada</h3>
              <p className="text-gray-600">Ainda não há pessoas sendo discipuladas no sistema.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DiscipledPeople;
