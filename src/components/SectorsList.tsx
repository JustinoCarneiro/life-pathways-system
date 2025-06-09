
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import PersonCard from './PersonCard';
import CreateSectorForm from './CreateSectorForm';
import { ChevronDown, ChevronRight, MapPin, Users, Plus, Edit, Trash2 } from 'lucide-react';

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
  isLeader?: boolean;
  isAssistant?: boolean;
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
              isLeader: true,
              isAssistant: false,
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
              isLeader: false,
              isAssistant: true,
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
              isLeader: false,
              isAssistant: false,
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
  const [editingSector, setEditingSector] = useState<string | null>(null);
  const [editingLifegroup, setEditingLifegroup] = useState<string | null>(null);
  const [editNames, setEditNames] = useState<{ [key: string]: string }>({});

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

  const handleEditSector = (sectorId: string, newName: string) => {
    setSectors(prev => prev.map(sector => 
      sector.id === sectorId ? { ...sector, name: newName } : sector
    ));
    setEditingSector(null);
    setEditNames(prev => ({ ...prev, [sectorId]: '' }));
  };

  const handleEditLifegroup = (lifegroupId: string, newName: string) => {
    setSectors(prev => prev.map(sector => ({
      ...sector,
      lifegroups: sector.lifegroups.map(lg => 
        lg.id === lifegroupId ? { ...lg, name: newName } : lg
      )
    })));
    setEditingLifegroup(null);
    setEditNames(prev => ({ ...prev, [lifegroupId]: '' }));
  };

  const handleDeleteSector = (sectorId: string) => {
    if (confirm('Tem certeza que deseja excluir este setor?')) {
      setSectors(prev => prev.filter(sector => sector.id !== sectorId));
    }
  };

  const handleDeleteLifegroup = (lifegroupId: string) => {
    if (confirm('Tem certeza que deseja excluir este lifegroup?')) {
      setSectors(prev => prev.map(sector => ({
        ...sector,
        lifegroups: sector.lifegroups.filter(lg => lg.id !== lifegroupId)
      })));
    }
  };

  const startEditingSector = (sector: Sector) => {
    setEditingSector(sector.id);
    setEditNames(prev => ({ ...prev, [sector.id]: sector.name }));
  };

  const startEditingLifegroup = (lifegroup: Lifegroup) => {
    setEditingLifegroup(lifegroup.id);
    setEditNames(prev => ({ ...prev, [lifegroup.id]: lifegroup.name }));
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
                  <div className="flex-1">
                    {editingSector === sector.id ? (
                      <div className="flex items-center space-x-2">
                        <Input
                          value={editNames[sector.id] || ''}
                          onChange={(e) => setEditNames(prev => ({ ...prev, [sector.id]: e.target.value }))}
                          className="max-w-xs"
                          onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                              handleEditSector(sector.id, editNames[sector.id]);
                            }
                          }}
                        />
                        <Button size="sm" onClick={() => handleEditSector(sector.id, editNames[sector.id])}>
                          Salvar
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => setEditingSector(null)}>
                          Cancelar
                        </Button>
                      </div>
                    ) : (
                      <div>
                        <h3 className="font-semibold text-lg">{sector.name}</h3>
                        <p className="text-sm text-gray-600">{sector.description}</p>
                      </div>
                    )}
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
                    <div className="flex space-x-1">
                      <Button size="sm" variant="outline" onClick={(e) => { e.stopPropagation(); startEditingSector(sector); }}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline" onClick={(e) => { e.stopPropagation(); handleDeleteSector(sector.id); }}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline" onClick={(e) => e.stopPropagation()}>
                        <Plus className="h-4 w-4 mr-1" />
                        Lifegroup
                      </Button>
                    </div>
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
                          <div className="flex-1">
                            {editingLifegroup === lifegroup.id ? (
                              <div className="flex items-center space-x-2">
                                <Input
                                  value={editNames[lifegroup.id] || ''}
                                  onChange={(e) => setEditNames(prev => ({ ...prev, [lifegroup.id]: e.target.value }))}
                                  className="max-w-xs"
                                  onKeyPress={(e) => {
                                    if (e.key === 'Enter') {
                                      handleEditLifegroup(lifegroup.id, editNames[lifegroup.id]);
                                    }
                                  }}
                                />
                                <Button size="sm" onClick={() => handleEditLifegroup(lifegroup.id, editNames[lifegroup.id])}>
                                  Salvar
                                </Button>
                                <Button size="sm" variant="outline" onClick={() => setEditingLifegroup(null)}>
                                  Cancelar
                                </Button>
                              </div>
                            ) : (
                              <div>
                                <h4 className="font-medium">{lifegroup.name}</h4>
                                <p className="text-sm text-gray-600">
                                  {lifegroup.people.length} pessoas cadastradas
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge variant="outline">
                            {lifegroup.people.length} pessoas
                          </Badge>
                          {userRole === 'admin' && (
                            <div className="flex space-x-1">
                              <Button size="sm" variant="outline" onClick={(e) => { e.stopPropagation(); startEditingLifegroup(lifegroup); }}>
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button size="sm" variant="outline" onClick={(e) => { e.stopPropagation(); handleDeleteLifegroup(lifegroup.id); }}>
                                <Trash2 className="h-4 w-4" />
                              </Button>
                              <Button size="sm" variant="outline" onClick={(e) => e.stopPropagation()}>
                                <Plus className="h-4 w-4 mr-1" />
                                Pessoa
                              </Button>
                            </div>
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
