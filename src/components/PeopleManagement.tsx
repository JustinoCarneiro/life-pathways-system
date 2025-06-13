
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import PersonCard from './PersonCard';
import PersonRegistrationForm from './PersonRegistrationForm';
import { Users, Plus, Filter } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

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

const PeopleManagement = () => {
  const [people, setPeople] = useState<Person[]>([]);
  const [filteredPeople, setFilteredPeople] = useState<Person[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showRegistrationForm, setShowRegistrationForm] = useState(false);
  
  // Filtros
  const [selectedArea, setSelectedArea] = useState('all');
  const [selectedSector, setSelectedSector] = useState('all');
  const [selectedLifegroup, setSelectedLifegroup] = useState('all');
  const [selectedStep, setSelectedStep] = useState('all');

  useEffect(() => {
    fetchPeople();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [people, selectedArea, selectedSector, selectedLifegroup, selectedStep]);

  const fetchPeople = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('people')
        .select('*')
        .order('name');

      if (error) {
        console.error('Error fetching people:', error);
        return;
      }

      setPeople(data || []);
    } catch (error) {
      console.error('Error fetching people:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...people];

    // Filtro por step
    if (selectedStep !== 'all') {
      filtered = filtered.filter(person => {
        const steps = person.steps || {};
        return steps[selectedStep] === true;
      });
    }

    setFilteredPeople(filtered);
  };

  const stepOptions = [
    { value: 'all', label: 'Todas as Etapas' },
    { value: 'newBirth', label: 'Novo Nascimento' },
    { value: 'initialFollowUp', label: 'Acompanhamento Inicial' },
    { value: 'coffeeWithPastor', label: 'Café com Pastor' },
    { value: 'stationDNA', label: 'Estação DNA' },
    { value: 'newCreature', label: 'Nova Criatura' },
    { value: 'expressI', label: 'Expresso I' },
    { value: 'expressII', label: 'Expresso II' },
    { value: 'baptism', label: 'Batismo' },
    { value: 'discipleship', label: 'Discipulado' }
  ];

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
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center">
                <Users className="h-5 w-5 mr-2" />
                Gestão de Pessoas
              </CardTitle>
              <CardDescription>
                Gerencie todas as pessoas cadastradas no sistema
              </CardDescription>
            </div>
            <Button onClick={() => setShowRegistrationForm(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Nova Pessoa
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {/* Filtros */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              <span className="text-sm font-medium">Filtros:</span>
            </div>
            
            <Select value={selectedArea} onValueChange={setSelectedArea}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Selecionar Área" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as Áreas</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={selectedSector} onValueChange={setSelectedSector}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Selecionar Setor" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os Setores</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={selectedLifegroup} onValueChange={setSelectedLifegroup}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Selecionar Lifegroup" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os Lifegroups</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={selectedStep} onValueChange={setSelectedStep}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Filtrar por Etapa" />
              </SelectTrigger>
              <SelectContent>
                {stepOptions.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Estatísticas */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-2">
              <Users className="h-4 w-4" />
              <span className="text-sm font-medium">
                {filteredPeople.length} de {people.length} pessoas
              </span>
            </div>
            <Badge variant="default">
              Total: {people.length}
            </Badge>
          </div>

          {/* Lista de pessoas */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredPeople.map((person) => (
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

          {filteredPeople.length === 0 && (
            <div className="text-center py-12">
              <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {people.length === 0 ? 'Nenhuma pessoa cadastrada' : 'Nenhuma pessoa encontrada'}
              </h3>
              <p className="text-gray-600">
                {people.length === 0 
                  ? 'Cadastre a primeira pessoa no sistema.' 
                  : 'Tente ajustar os filtros para encontrar pessoas.'
                }
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modal de cadastro */}
      {showRegistrationForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <PersonRegistrationForm
              onClose={() => setShowRegistrationForm(false)}
              onPersonAdded={() => {
                fetchPeople();
                setShowRegistrationForm(false);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default PeopleManagement;
