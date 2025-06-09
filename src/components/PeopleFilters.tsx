
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import PersonCard from './PersonCard';
import { Search, AlertTriangle } from 'lucide-react';

interface PeopleFiltersProps {
  selectedSector: string;
  selectedLifegroup: string;
}

interface Person {
  id: string;
  name: string;
  contact: string;
  address: string;
  birthDate: string;
  lifegroupId: string;
  sectorId: string;
  isLeader: boolean;
  isAssistant: boolean;
  steps: {
    newBirth?: string;
    initialFollowUp?: boolean;
    coffeeWithPastor?: boolean;
    stationDNA?: boolean;
    newCreature?: boolean;
    baptism?: boolean;
  };
}

const PeopleFilters: React.FC<PeopleFiltersProps> = ({ selectedSector, selectedLifegroup }) => {
  const [missingFilters, setMissingFilters] = useState({
    newBirth: false,
    initialFollowUp: false,
    coffeeWithPastor: false,
    stationDNA: false,
    newCreature: false,
    baptism: false,
  });

  // Mock data de pessoas
  const allPeople: Person[] = [
    {
      id: '1',
      name: 'João Silva',
      contact: '(85) 99999-9999',
      address: 'Rua das Flores, 123 - Fortaleza',
      birthDate: '1990-05-15',
      lifegroupId: '1',
      sectorId: '1',
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
      sectorId: '1',
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
    {
      id: '3',
      name: 'Pedro Costa',
      contact: '(85) 77777-7777',
      address: 'Rua da Esperança, 789 - Fortaleza',
      birthDate: '1992-03-08',
      lifegroupId: '2',
      sectorId: '2',
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
  ];

  const filterPeople = () => {
    let filtered = allPeople;

    // Filtrar por setor
    if (selectedSector !== 'all') {
      filtered = filtered.filter(person => person.sectorId === selectedSector);
    }

    // Filtrar por lifegroup
    if (selectedLifegroup !== 'all') {
      filtered = filtered.filter(person => person.lifegroupId === selectedLifegroup);
    }

    // Filtrar por etapas faltantes
    const activeMissingFilters = Object.entries(missingFilters).filter(([_, active]) => active);
    if (activeMissingFilters.length > 0) {
      filtered = filtered.filter(person => {
        return activeMissingFilters.some(([step]) => {
          const stepValue = person.steps[step as keyof typeof person.steps];
          return !stepValue || stepValue === false;
        });
      });
    }

    return filtered;
  };

  const filteredPeople = filterPeople();

  const stepLabels = {
    newBirth: 'Novo Nascimento',
    initialFollowUp: 'ACI (Acompanhamento Inicial)',
    coffeeWithPastor: 'Café com Pastor',
    stationDNA: 'Estação DNA',
    newCreature: 'Nova Criatura',
    baptism: 'Batismo',
  };

  const activeMissingFiltersCount = Object.values(missingFilters).filter(Boolean).length;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Search className="h-5 w-5 mr-2" />
            Filtro de Pessoas
          </CardTitle>
          <CardDescription>
            Encontre pessoas que estão faltando etapas específicas do crescimento espiritual
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium mb-3 flex items-center">
                <AlertTriangle className="h-4 w-4 mr-2" />
                Pessoas faltando etapas:
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {Object.entries(stepLabels).map(([step, label]) => (
                  <div key={step} className="flex items-center space-x-2">
                    <Checkbox
                      id={step}
                      checked={missingFilters[step as keyof typeof missingFilters]}
                      onCheckedChange={(checked) => 
                        setMissingFilters(prev => ({
                          ...prev,
                          [step]: checked === true
                        }))
                      }
                    />
                    <label htmlFor={step} className="text-sm cursor-pointer">
                      {label}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {activeMissingFiltersCount > 0 && (
              <div className="flex flex-wrap gap-2">
                <span className="text-sm text-gray-600">Filtros ativos:</span>
                {Object.entries(missingFilters)
                  .filter(([_, active]) => active)
                  .map(([step]) => (
                    <Badge key={step} variant="outline">
                      Faltando: {stepLabels[step as keyof typeof stepLabels]}
                    </Badge>
                  ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>
            Resultados da Pesquisa
            <Badge variant="secondary" className="ml-2">
              {filteredPeople.length} pessoas
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredPeople.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">
                {activeMissingFiltersCount > 0 
                  ? 'Nenhuma pessoa encontrada com os filtros selecionados'
                  : 'Selecione filtros acima para encontrar pessoas'
                }
              </p>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredPeople.map((person) => (
                <PersonCard
                  key={person.id}
                  {...person}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PeopleFilters;
