
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import PersonCard from './PersonCard';
import { Filter, Search, Users } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface PeopleFiltersProps {
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

const PeopleFilters: React.FC<PeopleFiltersProps> = ({
  selectedArea,
  selectedSector,
  selectedLifegroup
}) => {
  const [people, setPeople] = useState<Person[]>([]);
  const [filteredPeople, setFilteredPeople] = useState<Person[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [ageFilter, setAgeFilter] = useState('all');
  const [roleFilter, setRoleFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchPeople();
  }, [selectedArea, selectedSector, selectedLifegroup]);

  useEffect(() => {
    applyFilters();
  }, [people, searchTerm, ageFilter, roleFilter]);

  const fetchPeople = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('people')
        .select('*');

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

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(person =>
        person.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        person.contact?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        person.address?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Age filter
    if (ageFilter !== 'all') {
      filtered = filtered.filter(person => {
        if (!person.birth_date) return false;
        
        const age = calculateAge(person.birth_date);
        switch (ageFilter) {
          case 'young': return age <= 25;
          case 'adult': return age > 25 && age <= 50;
          case 'senior': return age > 50;
          default: return true;
        }
      });
    }

    // Role filter
    if (roleFilter !== 'all') {
      filtered = filtered.filter(person => {
        switch (roleFilter) {
          case 'leader': return person.is_leader;
          case 'assistant': return person.is_assistant;
          case 'discipled': return person.discipler_id;
          case 'member': return !person.is_leader && !person.is_assistant;
          default: return true;
        }
      });
    }

    setFilteredPeople(filtered);
  };

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

  const clearFilters = () => {
    setSearchTerm('');
    setAgeFilter('all');
    setRoleFilter('all');
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
            <Filter className="h-5 w-5 mr-2" />
            Filtros de Pessoas
          </CardTitle>
          <CardDescription>
            Filtre e pesquise pessoas cadastradas no sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium mb-2">Pesquisar</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Nome, contato ou endereço..."
                  className="pl-10"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Faixa Etária</label>
              <Select value={ageFilter} onValueChange={setAgeFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas as idades</SelectItem>
                  <SelectItem value="young">Até 25 anos</SelectItem>
                  <SelectItem value="adult">26 a 50 anos</SelectItem>
                  <SelectItem value="senior">Acima de 50 anos</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Função</label>
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas as funções</SelectItem>
                  <SelectItem value="leader">Líderes</SelectItem>
                  <SelectItem value="assistant">Auxiliares</SelectItem>
                  <SelectItem value="discipled">Discipulados</SelectItem>
                  <SelectItem value="member">Membros</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-end">
              <Button variant="outline" onClick={clearFilters} className="w-full">
                Limpar Filtros
              </Button>
            </div>
          </div>

          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <Users className="h-4 w-4" />
              <span className="text-sm font-medium">{filteredPeople.length} pessoas encontradas</span>
            </div>
            <div className="flex space-x-2">
              {searchTerm && (
                <Badge variant="secondary">Pesquisa: {searchTerm}</Badge>
              )}
              {ageFilter !== 'all' && (
                <Badge variant="secondary">Idade: {ageFilter}</Badge>
              )}
              {roleFilter !== 'all' && (
                <Badge variant="secondary">Função: {roleFilter}</Badge>
              )}
            </div>
          </div>

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
              <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhuma pessoa encontrada</h3>
              <p className="text-gray-600">Tente ajustar os filtros ou pesquisar por outros termos.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PeopleFilters;
