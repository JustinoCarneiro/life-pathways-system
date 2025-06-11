
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Building, MapPin, Users, Plus, Edit, Trash2, User } from 'lucide-react';

interface Area {
  id: string;
  name: string;
  responsible_id?: string;
  created_at: string;
}

interface Sector {
  id: string;
  name: string;
  area_id: string;
  responsible_id?: string;
  created_at: string;
}

interface Lifegroup {
  id: string;
  name: string;
  sector_id: string;
  responsible_id?: string;
  created_at: string;
}

interface HierarchyManagementProps {
  showCreateForm: boolean;
  onCloseCreateForm: () => void;
  selectedArea: string;
  selectedSector: string;
  selectedLifegroup: string;
  userRole: string | null;
}

const HierarchyManagement: React.FC<HierarchyManagementProps> = ({
  showCreateForm,
  onCloseCreateForm,
  selectedArea,
  selectedSector,
  selectedLifegroup,
  userRole
}) => {
  const [areas, setAreas] = useState<Area[]>([]);
  const [sectors, setSectors] = useState<Sector[]>([]);
  const [lifegroups, setLifegroups] = useState<Lifegroup[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newItemData, setNewItemData] = useState({
    name: '',
    type: 'area' as 'area' | 'sector' | 'lifegroup',
    parentId: '',
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchHierarchyData();
  }, []);

  const fetchHierarchyData = async () => {
    try {
      setIsLoading(true);
      
      // Fetch areas
      const { data: areasData, error: areasError } = await supabase
        .from('areas')
        .select('*')
        .order('created_at', { ascending: true });

      if (areasError) throw areasError;

      // Fetch sectors
      const { data: sectorsData, error: sectorsError } = await supabase
        .from('sectors')
        .select('*')
        .order('created_at', { ascending: true });

      if (sectorsError) throw sectorsError;

      // Fetch lifegroups
      const { data: lifegroupsData, error: lifegroupsError } = await supabase
        .from('lifegroups')
        .select('*')
        .order('created_at', { ascending: true });

      if (lifegroupsError) throw lifegroupsError;

      setAreas(areasData || []);
      setSectors(sectorsData || []);
      setLifegroups(lifegroupsData || []);
    } catch (error) {
      console.error('Error fetching hierarchy data:', error);
      toast({
        title: "Erro ao carregar dados",
        description: "Não foi possível carregar a hierarquia.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateItem = async () => {
    if (!newItemData.name.trim()) {
      toast({
        title: "Nome obrigatório",
        description: "Por favor, insira um nome.",
        variant: "destructive",
      });
      return;
    }

    try {
      if (newItemData.type === 'area') {
        const { error } = await supabase
          .from('areas')
          .insert([{ name: newItemData.name }]);

        if (error) throw error;
      } else if (newItemData.type === 'sector') {
        if (!newItemData.parentId) {
          toast({
            title: "Área obrigatória",
            description: "Selecione uma área para o setor.",
            variant: "destructive",
          });
          return;
        }

        const { error } = await supabase
          .from('sectors')
          .insert([{ 
            name: newItemData.name,
            area_id: newItemData.parentId 
          }]);

        if (error) throw error;
      } else if (newItemData.type === 'lifegroup') {
        if (!newItemData.parentId) {
          toast({
            title: "Setor obrigatório",
            description: "Selecione um setor para o lifegroup.",
            variant: "destructive",
          });
          return;
        }

        const { error } = await supabase
          .from('lifegroups')
          .insert([{ 
            name: newItemData.name,
            sector_id: newItemData.parentId 
          }]);

        if (error) throw error;
      }

      toast({
        title: "Item criado com sucesso!",
        description: `${newItemData.type === 'area' ? 'Área' : newItemData.type === 'sector' ? 'Setor' : 'Lifegroup'} "${newItemData.name}" foi criado.`,
      });

      setNewItemData({ name: '', type: 'area', parentId: '' });
      onCloseCreateForm();
      fetchHierarchyData();
    } catch (error) {
      console.error('Error creating item:', error);
      toast({
        title: "Erro ao criar item",
        description: "Não foi possível criar o item.",
        variant: "destructive",
      });
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
            <Building className="h-5 w-5 mr-2" />
            Gestão de Hierarquia
          </CardTitle>
          <CardDescription>
            Gerencie áreas, setores e lifegroups do START FORTALEZA
          </CardDescription>
        </CardHeader>
        <CardContent>
          {showCreateForm && (
            <div className="border rounded-lg p-4 mb-6 bg-gray-50">
              <h3 className="font-semibold mb-4">Criar Novo Item</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Tipo</label>
                  <Select 
                    value={newItemData.type} 
                    onValueChange={(type: 'area' | 'sector' | 'lifegroup') => 
                      setNewItemData(prev => ({ ...prev, type, parentId: '' }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="area">Área</SelectItem>
                      <SelectItem value="sector">Setor</SelectItem>
                      <SelectItem value="lifegroup">Lifegroup</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                {newItemData.type === 'sector' && (
                  <div>
                    <label className="block text-sm font-medium mb-2">Área</label>
                    <Select 
                      value={newItemData.parentId} 
                      onValueChange={(parentId) => setNewItemData(prev => ({ ...prev, parentId }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione uma área" />
                      </SelectTrigger>
                      <SelectContent>
                        {areas.map(area => (
                          <SelectItem key={area.id} value={area.id}>
                            {area.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {newItemData.type === 'lifegroup' && (
                  <div>
                    <label className="block text-sm font-medium mb-2">Setor</label>
                    <Select 
                      value={newItemData.parentId} 
                      onValueChange={(parentId) => setNewItemData(prev => ({ ...prev, parentId }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione um setor" />
                      </SelectTrigger>
                      <SelectContent>
                        {sectors.map(sector => (
                          <SelectItem key={sector.id} value={sector.id}>
                            {sector.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium mb-2">Nome</label>
                  <Input
                    value={newItemData.name}
                    onChange={(e) => setNewItemData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder={`Nome do ${newItemData.type === 'area' ? 'área' : newItemData.type === 'sector' ? 'setor' : 'lifegroup'}`}
                  />
                </div>
              </div>
              <div className="flex space-x-2 mt-4">
                <Button onClick={handleCreateItem}>
                  <Plus className="h-4 w-4 mr-2" />
                  Criar
                </Button>
                <Button variant="outline" onClick={onCloseCreateForm}>
                  Cancelar
                </Button>
              </div>
            </div>
          )}

          <div className="space-y-6">
            {areas.map((area) => {
              const areaSectors = sectors.filter(s => s.area_id === area.id);
              
              return (
                <div key={area.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <Building className="h-5 w-5 mr-2 text-blue-600" />
                      <h3 className="font-semibold text-lg">{area.name}</h3>
                      <Badge variant="outline" className="ml-2">Área</Badge>
                    </div>
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline">
                        <Edit className="h-4 w-4" />
                      </Button>
                      {userRole === 'admin' && (
                        <Button size="sm" variant="outline">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>

                  {areaSectors.length > 0 && (
                    <div className="ml-6 space-y-4">
                      {areaSectors.map((sector) => {
                        const sectorLifegroups = lifegroups.filter(l => l.sector_id === sector.id);
                        
                        return (
                          <div key={sector.id} className="border-l-2 border-gray-200 pl-4">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center">
                                <MapPin className="h-4 w-4 mr-2 text-green-600" />
                                <h4 className="font-medium">{sector.name}</h4>
                                <Badge variant="outline" className="ml-2">Setor</Badge>
                              </div>
                              <div className="flex space-x-2">
                                <Button size="sm" variant="outline">
                                  <Edit className="h-3 w-3" />
                                </Button>
                                <Button size="sm" variant="outline">
                                  <Trash2 className="h-3 w-3" />
                                </Button>
                              </div>
                            </div>

                            {sectorLifegroups.length > 0 && (
                              <div className="ml-6 space-y-2">
                                {sectorLifegroups.map((lifegroup) => (
                                  <div key={lifegroup.id} className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded">
                                    <div className="flex items-center">
                                      <Users className="h-4 w-4 mr-2 text-purple-600" />
                                      <span className="text-sm font-medium">{lifegroup.name}</span>
                                      <Badge variant="outline" className="ml-2">Lifegroup</Badge>
                                    </div>
                                    <div className="flex space-x-2">
                                      <Button size="sm" variant="outline">
                                        <Edit className="h-3 w-3" />
                                      </Button>
                                      <Button size="sm" variant="outline">
                                        <Trash2 className="h-3 w-3" />
                                      </Button>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {areas.length === 0 && (
            <div className="text-center py-12">
              <Building className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhuma área encontrada</h3>
              <p className="text-gray-600 mb-4">Comece criando sua primeira área.</p>
              {userRole === 'admin' && (
                <Button onClick={() => setNewItemData({ name: '', type: 'area', parentId: '' })}>
                  <Plus className="h-4 w-4 mr-2" />
                  Criar Primeira Área
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default HierarchyManagement;
