
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import LifegroupCard from './LifegroupCard';
import CreateSectorForm from './CreateSectorForm';
import { ChevronDown, ChevronRight, MapPin, Users, Plus } from 'lucide-react';

interface Sector {
  id: string;
  name: string;
  description: string;
  lifegroups: Lifegroup[];
}

interface Lifegroup {
  id: string;
  name: string;
  sectorId: string;
  groups: Group[];
}

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

interface SectorsListProps {
  showCreateForm: boolean;
  onCloseCreateForm: () => void;
}

const SectorsList: React.FC<SectorsListProps> = ({ showCreateForm, onCloseCreateForm }) => {
  const userRole = localStorage.getItem('userRole') || 'user';
  
  // Mock data - na implementação real virá do banco de dados
  const [sectors, setSectors] = useState<Sector[]>([
    {
      id: '1',
      name: 'Setor Norte',
      description: 'Região norte da cidade',
      lifegroups: [
        {
          id: '1',
          name: 'Lifegroup Alpha',
          sectorId: '1',
          groups: [
            {
              id: '1',
              name: 'Grupo dos Jovens',
              lifegroupId: '1',
              people: [
                {
                  id: '1',
                  name: 'João Silva',
                  contact: '(85) 99999-9999',
                  address: 'Rua das Flores, 123 - Fortaleza',
                  birthDate: '1990-05-15',
                  groupId: '1',
                  steps: {
                    newBirth: '2024-01-15',
                    initialFollowUp: true,
                    coffeeWithPastor: true,
                    stationDNA: false,
                    newCreature: false,
                    baptism: false,
                  },
                },
                {
                  id: '2',
                  name: 'Maria Santos',
                  contact: '(85) 88888-8888',
                  address: 'Av. Principal, 456 - Fortaleza',
                  birthDate: '1985-09-22',
                  groupId: '1',
                  steps: {
                    newBirth: '2023-11-10',
                    initialFollowUp: true,
                    coffeeWithPastor: true,
                    stationDNA: true,
                    newCreature: true,
                    baptism: true,
                  },
                },
              ],
            },
          ],
        },
      ],
    },
    {
      id: '2',
      name: 'Setor Sul',
      description: 'Região sul da cidade',
      lifegroups: [
        {
          id: '2',
          name: 'Lifegroup Beta',
          sectorId: '2',
          groups: [
            {
              id: '2',
              name: 'Grupo Família',
              lifegroupId: '2',
              people: [
                {
                  id: '3',
                  name: 'Pedro Costa',
                  contact: '(85) 77777-7777',
                  address: 'Rua da Esperança, 789 - Fortaleza',
                  birthDate: '1992-03-08',
                  groupId: '2',
                  steps: {
                    newBirth: '2024-02-01',
                    initialFollowUp: true,
                    coffeeWithPastor: false,
                    stationDNA: false,
                    newCreature: false,
                    baptism: false,
                  },
                },
              ],
            },
          ],
        },
      ],
    },
  ]);

  const [expandedSectors, setExpandedSectors] = useState<string[]>(['1']);
  const [expandedLifegroups, setExpandedLifegroups] = useState<string[]>(['1']);

  const toggleSector = (sectorId: string) => {
    setExpandedSectors(prev => 
      prev.includes(sectorId) 
        ? prev.filter(id => id !== sectorId)
        : [...prev, sectorId]
    );
  };

  const toggleLifegroup = (lifegroupId: string) => {
    setExpandedLifegroups(prev => 
      prev.includes(lifegroupId) 
        ? prev.filter(id => id !== lifegroupId)
        : [...prev, lifegroupId]
    );
  };

  const handleCreateSector = (sectorData: { name: string; description: string }) => {
    const newSector: Sector = {
      id: Date.now().toString(),
      name: sectorData.name,
      description: sectorData.description,
      lifegroups: [],
    };
    setSectors(prev => [...prev, newSector]);
    onCloseCreateForm();
  };

  return (
    <div className="space-y-6">
      {showCreateForm && (
        <CreateSectorForm 
          onSubmit={handleCreateSector}
          onCancel={onCloseCreateForm}
        />
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <MapPin className="h-5 w-5 mr-2" />
            Setores e Grupos de Vida
          </CardTitle>
          <CardDescription>
            Hierarquia: Setor → Lifegroup → Grupo → Pessoas
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {sectors.map((sector) => (
            <div key={sector.id} className="border rounded-lg p-4">
              <div 
                className="flex items-center justify-between cursor-pointer"
                onClick={() => toggleSector(sector.id)}
              >
                <div className="flex items-center space-x-3">
                  {expandedSectors.includes(sector.id) ? 
                    <ChevronDown className="h-4 w-4" /> : 
                    <ChevronRight className="h-4 w-4" />
                  }
                  <div>
                    <h3 className="font-semibold text-lg">{sector.name}</h3>
                    <p className="text-sm text-gray-600">{sector.description}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant="outline">
                    {sector.lifegroups.length} Lifegroups
                  </Badge>
                  <Badge variant="secondary">
                    {sector.lifegroups.reduce((total, lg) => total + lg.groups.reduce((gtotal, g) => gtotal + g.people.length, 0), 0)} Pessoas
                  </Badge>
                  {userRole === 'admin' && (
                    <Button size="sm" variant="outline">
                      <Plus className="h-4 w-4 mr-1" />
                      Lifegroup
                    </Button>
                  )}
                </div>
              </div>

              {expandedSectors.includes(sector.id) && (
                <div className="mt-4 ml-6 space-y-3">
                  {sector.lifegroups.map((lifegroup) => (
                    <LifegroupCard
                      key={lifegroup.id}
                      lifegroup={lifegroup}
                      isExpanded={expandedLifegroups.includes(lifegroup.id)}
                      onToggle={() => toggleLifegroup(lifegroup.id)}
                    />
                  ))}
                </div>
              )}
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default SectorsList;
