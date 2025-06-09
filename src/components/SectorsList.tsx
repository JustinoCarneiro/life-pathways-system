
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import PersonCard from './PersonCard';
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
  people: Person[];
}

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

interface SectorsListProps {
  showCreateForm: boolean;
  onCloseCreateForm: () => void;
  selectedSector: string;
  selectedLifegroup: string;
}

const SectorsList: React.FC<SectorsListProps> = ({ 
  showCreateForm, 
  onCloseCreateForm,
  selectedSector,
  selectedLifegroup 
}) => {
  const userRole = localStorage.getItem('userRole') || 'user';
  
  // Mock data atualizada - hierarquia simplificada: Setor > Lifegroups > Pessoas
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
          people: [
            {
              id: '1',
              name: 'João Silva',
              contact: '(85) 99999-9999',
              address: 'Rua das Flores, 123 - Fortaleza',
              birthDate: '1990-05-15',
              lifegroupId: '1',
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
              lifegroupId: '1',
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
    {
      id: '2',
      name: 'Setor Sul',
      description: 'Região sul da cidade',
      lifegroups: [
        {
          id: '2',
          name: 'Lifegroup Beta',
          sectorId: '2',
          people: [
            {
              id: '3',
              name: 'Pedro Costa',
              contact: '(85) 77777-7777',
              address: 'Rua da Esperança, 789 - Fortaleza',
              birthDate: '1992-03-08',
              lifegroupId: '2',
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

  // Filtrar setores baseado na seleção
  const filteredSectors = selectedSector === 'all' 
    ? sectors 
    : sectors.filter(sector => sector.id === selectedSector);

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
            Setores e Lifegroups
          </CardTitle>
          <CardDescription>
            Hierarquia: Setor → Lifegroup → Pessoas Cadastradas
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {filteredSectors.map((sector) => (
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
                    {sector.lifegroups.reduce((total, lg) => total + lg.people.length, 0)} Pessoas
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
                  {sector.lifegroups
                    .filter(lifegroup => 
                      selectedLifegroup === 'all' || lifegroup.id === selectedLifegroup
                    )
                    .map((lifegroup) => (
                    <div key={lifegroup.id} className="border rounded-lg p-3 bg-gray-50">
                      <div 
                        className="flex items-center justify-between cursor-pointer"
                        onClick={() => toggleLifegroup(lifegroup.id)}
                      >
                        <div className="flex items-center space-x-3">
                          {expandedLifegroups.includes(lifegroup.id) ? 
                            <ChevronDown className="h-4 w-4" /> : 
                            <ChevronRight className="h-4 w-4" />
                          }
                          <Users className="h-4 w-4 text-blue-600" />
                          <div>
                            <h4 className="font-medium">{lifegroup.name}</h4>
                            <p className="text-sm text-gray-600">
                              {lifegroup.people.length} pessoas cadastradas
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge variant="outline">
                            {lifegroup.people.length} pessoas
                          </Badge>
                          {userRole === 'admin' && (
                            <Button size="sm" variant="outline">
                              <Plus className="h-4 w-4 mr-1" />
                              Pessoa
                            </Button>
                          )}
                        </div>
                      </div>

                      {expandedLifegroups.includes(lifegroup.id) && (
                        <div className="mt-4 ml-6">
                          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                            {lifegroup.people.map((person) => (
                              <PersonCard
                                key={person.id}
                                {...person}
                              />
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
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
