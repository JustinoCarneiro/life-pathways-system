
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Users, ArrowRight, User } from 'lucide-react';

interface DiscipledPeopleProps {
  selectedSector: string;
  selectedLifegroup: string;
}

interface DiscipleRelation {
  discipler: {
    id: string;
    name: string;
    lifegroupId: string;
    sectorId: string;
  };
  disciple: {
    id: string;
    name: string;
    lifegroupId: string;
    sectorId: string;
  };
}

const DiscipledPeople: React.FC<DiscipledPeopleProps> = ({ selectedSector, selectedLifegroup }) => {
  const userRole = localStorage.getItem('userRole') || 'user';
  const [filterSector, setFilterSector] = useState<string>('all');
  const [filterLifegroup, setFilterLifegroup] = useState<string>('all');

  // Mock data de relacionamentos discipulador-discípulo
  const discipleRelations: DiscipleRelation[] = [
    {
      discipler: { id: '1', name: 'João Silva', lifegroupId: '1', sectorId: '1' },
      disciple: { id: '2', name: 'Maria Santos', lifegroupId: '1', sectorId: '1' }
    },
    {
      discipler: { id: '1', name: 'João Silva', lifegroupId: '1', sectorId: '1' },
      disciple: { id: '3', name: 'Pedro Costa', lifegroupId: '1', sectorId: '1' }
    },
    {
      discipler: { id: '4', name: 'Ana Paula', lifegroupId: '2', sectorId: '2' },
      disciple: { id: '5', name: 'Carlos Oliveira', lifegroupId: '2', sectorId: '2' }
    },
    {
      discipler: { id: '6', name: 'Lucas Ferreira', lifegroupId: '2', sectorId: '2' },
      disciple: { id: '7', name: 'Fernanda Lima', lifegroupId: '2', sectorId: '2' }
    },
  ];

  const sectors = [
    { id: '1', name: 'Setor Norte' },
    { id: '2', name: 'Setor Sul' },
  ];

  const lifegroups = [
    { id: '1', name: 'Lifegroup Alpha', sectorId: '1' },
    { id: '2', name: 'Lifegroup Beta', sectorId: '2' },
  ];

  const filterRelations = () => {
    let filtered = discipleRelations;

    // Aplicar filtros principais do dashboard
    if (selectedSector !== 'all') {
      filtered = filtered.filter(relation => 
        relation.discipler.sectorId === selectedSector && 
        relation.disciple.sectorId === selectedSector
      );
    }

    if (selectedLifegroup !== 'all') {
      filtered = filtered.filter(relation => 
        relation.discipler.lifegroupId === selectedLifegroup && 
        relation.disciple.lifegroupId === selectedLifegroup
      );
    }

    // Aplicar filtros específicos da aba
    if (filterSector !== 'all') {
      filtered = filtered.filter(relation => 
        relation.discipler.sectorId === filterSector && 
        relation.disciple.sectorId === filterSector
      );
    }

    if (filterLifegroup !== 'all') {
      filtered = filtered.filter(relation => 
        relation.discipler.lifegroupId === filterLifegroup && 
        relation.disciple.lifegroupId === filterLifegroup
      );
    }

    return filtered;
  };

  const getFilteredLifegroups = () => {
    if (filterSector === 'all') return lifegroups;
    return lifegroups.filter(lg => lg.sectorId === filterSector);
  };

  const groupBySector = () => {
    const filtered = filterRelations();
    const grouped: { [key: string]: DiscipleRelation[] } = {};
    
    filtered.forEach(relation => {
      const sectorName = sectors.find(s => s.id === relation.discipler.sectorId)?.name || 'Setor Desconhecido';
      if (!grouped[sectorName]) grouped[sectorName] = [];
      grouped[sectorName].push(relation);
    });
    
    return grouped;
  };

  const groupByLifegroup = () => {
    const filtered = filterRelations();
    const grouped: { [key: string]: DiscipleRelation[] } = {};
    
    filtered.forEach(relation => {
      const lifegroupName = lifegroups.find(lg => lg.id === relation.discipler.lifegroupId)?.name || 'Lifegroup Desconhecido';
      if (!grouped[lifegroupName]) grouped[lifegroupName] = [];
      grouped[lifegroupName].push(relation);
    });
    
    return grouped;
  };

  const filteredRelations = filterRelations();

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Users className="h-5 w-5 mr-2" />
            Pessoas Discipuladas
          </CardTitle>
          <CardDescription>
            Visualize os relacionamentos de discipulado organizados por setor e lifegroup
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex space-x-4">
              {userRole === 'admin' && (
                <div className="flex-1">
                  <label className="block text-sm font-medium mb-2">Filtrar por Setor</label>
                  <Select value={filterSector} onValueChange={setFilterSector}>
                    <SelectTrigger>
                      <SelectValue placeholder="Todos os setores" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos os setores</SelectItem>
                      {sectors.map(sector => (
                        <SelectItem key={sector.id} value={sector.id}>
                          {sector.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
              <div className="flex-1">
                <label className="block text-sm font-medium mb-2">Filtrar por Lifegroup</label>
                <Select value={filterLifegroup} onValueChange={setFilterLifegroup}>
                  <SelectTrigger>
                    <SelectValue placeholder="Todos os lifegroups" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos os lifegroups</SelectItem>
                    {getFilteredLifegroups().map(lifegroup => (
                      <SelectItem key={lifegroup.id} value={lifegroup.id}>
                        {lifegroup.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Badge variant="outline">
                Total de relacionamentos: {filteredRelations.length}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="sector" className="space-y-4">
        <TabsList>
          <TabsTrigger value="sector">Por Setor</TabsTrigger>
          <TabsTrigger value="lifegroup">Por Lifegroup</TabsTrigger>
        </TabsList>

        <TabsContent value="sector">
          <div className="space-y-4">
            {Object.entries(groupBySector()).map(([sectorName, relations]) => (
              <Card key={sectorName}>
                <CardHeader>
                  <CardTitle className="text-lg">{sectorName}</CardTitle>
                  <CardDescription>
                    {relations.length} relacionamento(s) de discipulado
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {relations.map((relation, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center space-x-2">
                            <User className="h-4 w-4 text-blue-600" />
                            <span className="font-medium">{relation.discipler.name}</span>
                            <Badge variant="outline" className="text-xs">Discipulador</Badge>
                          </div>
                          <ArrowRight className="h-4 w-4 text-gray-400" />
                          <div className="flex items-center space-x-2">
                            <User className="h-4 w-4 text-green-600" />
                            <span>{relation.disciple.name}</span>
                            <Badge variant="outline" className="text-xs">Discípulo</Badge>
                          </div>
                        </div>
                        <Badge variant="secondary">
                          {lifegroups.find(lg => lg.id === relation.discipler.lifegroupId)?.name}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="lifegroup">
          <div className="space-y-4">
            {Object.entries(groupByLifegroup()).map(([lifegroupName, relations]) => (
              <Card key={lifegroupName}>
                <CardHeader>
                  <CardTitle className="text-lg">{lifegroupName}</CardTitle>
                  <CardDescription>
                    {relations.length} relacionamento(s) de discipulado
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {relations.map((relation, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center space-x-2">
                            <User className="h-4 w-4 text-blue-600" />
                            <span className="font-medium">{relation.discipler.name}</span>
                            <Badge variant="outline" className="text-xs">Discipulador</Badge>
                          </div>
                          <ArrowRight className="h-4 w-4 text-gray-400" />
                          <div className="flex items-center space-x-2">
                            <User className="h-4 w-4 text-green-600" />
                            <span>{relation.disciple.name}</span>
                            <Badge variant="outline" className="text-xs">Discípulo</Badge>
                          </div>
                        </div>
                        <Badge variant="secondary">
                          {sectors.find(s => s.id === relation.discipler.sectorId)?.name}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DiscipledPeople;
