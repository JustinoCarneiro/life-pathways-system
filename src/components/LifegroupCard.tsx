
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import PersonCard from './PersonCard';
import { ChevronDown, ChevronRight, Users, Plus } from 'lucide-react';

interface Group {
  id: string;
  name: string;
  lifegroupId: string;
  people: Person[];
}

interface Person {
  id: string;
  name: string;
  contact: string;
  address: string;
  birthDate: string;
  groupId: string;
  steps: {
    newBirth?: string;
    initialFollowUp?: boolean;
    coffeeWithPastor?: boolean;
    stationDNA?: boolean;
    newCreature?: boolean;
    baptism?: boolean;
  };
}

interface Lifegroup {
  id: string;
  name: string;
  sectorId: string;
  groups: Group[];
}

interface LifegroupCardProps {
  lifegroup: Lifegroup;
  isExpanded: boolean;
  onToggle: () => void;
}

const LifegroupCard: React.FC<LifegroupCardProps> = ({ lifegroup, isExpanded, onToggle }) => {
  const userRole = localStorage.getItem('userRole') || 'user';
  const totalPeople = lifegroup.groups.reduce((total, group) => total + group.people.length, 0);

  return (
    <div className="border rounded-lg p-3 bg-gray-50">
      <div 
        className="flex items-center justify-between cursor-pointer"
        onClick={onToggle}
      >
        <div className="flex items-center space-x-3">
          {isExpanded ? 
            <ChevronDown className="h-4 w-4" /> : 
            <ChevronRight className="h-4 w-4" />
          }
          <Users className="h-4 w-4 text-blue-600" />
          <div>
            <h4 className="font-medium">{lifegroup.name}</h4>
            <p className="text-sm text-gray-600">{lifegroup.groups.length} grupos</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="outline">
            {totalPeople} pessoas
          </Badge>
          {userRole === 'admin' && (
            <Button size="sm" variant="outline">
              <Plus className="h-4 w-4 mr-1" />
              Grupo
            </Button>
          )}
        </div>
      </div>

      {isExpanded && (
        <div className="mt-4 ml-6 space-y-4">
          {lifegroup.groups.map((group) => (
            <div key={group.id} className="border rounded-lg p-3 bg-white">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <h5 className="font-medium text-sm">{group.name}</h5>
                  <Badge variant="secondary" className="text-xs">
                    {group.people.length} pessoas
                  </Badge>
                </div>
                {userRole === 'admin' && (
                  <Button size="sm" variant="outline">
                    <Plus className="h-4 w-4 mr-1" />
                    Pessoa
                  </Button>
                )}
              </div>
              
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {group.people.map((person) => (
                  <PersonCard
                    key={person.id}
                    {...person}
                    lifegroupId={lifegroup.id}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default LifegroupCard;
