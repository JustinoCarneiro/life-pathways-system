import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Building, MapPin, Users, Plus, Edit, Trash2, User, ChevronDown, ChevronRight, Building2, Navigation, Crown } from 'lucide-react';
import PersonRegistrationForm from './PersonRegistrationForm';

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
  const [people, setPeople] = useState<Person[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showPersonForm, setShowPersonForm] = useState(false);
  const [expandedAreas, setExpandedAreas] = useState<string[]>([]);
  const [expandedSectors, setExpandedSectors] = useState<string[]>([]);
  const [expandedLifegroups, setExpandedLifegroups] = useState<string[]>([]);
  const [editingItem, setEditingItem] = useState<{id: string, name: string, type: string} | null>(null);
  const [newItemData, setNewItemData] = useState({
    name: '',
    type: 'area' as 'area' | 'sector' | 'lifegroup',
    parentId: '',
  });
  const { toast } = useToast();

  const areaIcons = [Building, Building2, Crown, Navigation];
  const sectorIcons = [MapPin, Navigation, Building2];
  const lifegroupIcons = [Users, Crown, User];

  const [selectedIcons, setSelectedIcons] = useState<{[key: string]: number}>({});

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

      // Fetch people
      const { data: peopleData, error: peopleError } = await supabase
        .from('people')
        .select('*')
        .order('created_at', { ascending: true });

      if (peopleError) throw peopleError;

      setAreas(areasData || []);
      setSectors(sectorsData || []);
      setLifegroups(lifegroupsData || []);
      setPeople(peopleData || []);
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

  const handleUpdateItem = async (id: string, name: string, type: string) => {
    try {
      let error;
      
      if (type === 'area') {
        ({ error } = await supabase
          .from('areas')
          .update({ name })
          .eq('id', id));
      } else if (type === 'sector') {
        ({ error } = await supabase
          .from('sectors')
          .update({ name })
          .eq('id', id));
      } else if (type === 'lifegroup') {
        ({ error } = await supabase
          .from('lifegroups')
          .update({ name })
          .eq('id', id));
      }

      if (error) throw error;

      toast({
        title: "Item atualizado",
        description: "O nome foi atualizado com sucesso.",
      });

      setEditingItem(null);
      fetchHierarchyData();
    } catch (error) {
      console.error('Error updating item:', error);
      toast({
        title: "Erro ao atualizar",
        description: "Não foi possível atualizar o item.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteItem = async (id: string, type: string, name: string) => {
    if (!confirm(`Tem certeza que deseja excluir "${name}"?`)) return;

    try {
      let error;
      
      if (type === 'area') {
        ({ error } = await supabase
          .from('areas')
          .delete()
          .eq('id', id));
      } else if (type === 'sector') {
        ({ error } = await supabase
          .from('sectors')
          .delete()
          .eq('id', id));
      } else if (type === 'lifegroup') {
        ({ error } = await supabase
          .from('lifegroups')
          .delete()
          .eq('id', id));
      } else if (type === 'person') {
        ({ error } = await supabase
          .from('people')
          .delete()
          .eq('id', id));
      }

      if (error) throw error;

      toast({
        title: "Item excluído",
        description: `"${name}" foi removido com sucesso.`,
      });

      fetchHierarchyData();
    } catch (error) {
      console.error('Error deleting item:', error);
      toast({
        title: "Erro ao excluir",
        description: "Não foi possível excluir o item.",
        variant: "destructive",
      });
    }
  };

  const toggleArea = (areaId: string) => {
    setExpandedAreas(prev => 
      prev.includes(areaId) 
        ? prev.filter(id => id !== areaId)
        : [...prev, areaId]
    );
  };

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

  const canEdit = () => {
    return userRole === 'admin';
  };

  const canDelete = () => {
    return userRole === 'admin';
  };

  const getIcon = (type: string, itemId: string) => {
    const iconIndex = selectedIcons[itemId] || 0;
    let icons;
    
    switch (type) {
      case 'area':
        icons = areaIcons;
        break;
      case 'sector':
        icons = sectorIcons;
        break;
      case 'lifegroup':
        icons = lifegroupIcons;
        break;
      default:
        return Building;
    }
    
    return icons[iconIndex % icons.length];
  };

  const cycleIcon = (itemId: string, type: string) => {
    let maxIcons;
    switch (type) {
      case 'area':
        maxIcons = areaIcons.length;
        break;
      case 'sector':
        maxIcons = sectorIcons.length;
        break;
      case 'lifegroup':
        maxIcons = lifegroupIcons.length;
        break;
      default:
        maxIcons = 1;
    }
    
    setSelectedIcons(prev => ({
      ...prev,
      [itemId]: ((prev[itemId] || 0) + 1) % maxIcons
    }));
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
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="flex items-center">
                <Building className="h-5 w-5 mr-2" />
                Hierarquia: Área → Setor → Lifegroup → Pessoas
              </CardTitle>
              <CardDescription>
                Visualize e gerencie toda a estrutura hierárquica do DISTRITO START
              </CardDescription>
            </div>
            {canEdit() && (
              <div className="flex space-x-2">
                <Button onClick={() => setShowPersonForm(true)} size="sm">
                  <User className="h-4 w-4 mr-2" />
                  Adicionar Pessoa
                </Button>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {showPersonForm && (
            <PersonRegistrationForm
              onSuccess={() => {
                setShowPersonForm(false);
                fetchHierarchyData();
              }}
              onCancel={() => setShowPersonForm(false)}
            />
          )}

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

          <div className="space-y-4">
            {areas.map((area) => {
              const areaSectors = sectors.filter(s => s.area_id === area.id);
              const totalPeopleInArea = areaSectors.reduce((total, sector) => {
                const sectorLifegroups = lifegroups.filter(l => l.sector_id === sector.id);
                return total + sectorLifegroups.reduce((lgTotal, lg) => {
                  return lgTotal + people.filter(p => p.lifegroup_id === lg.id).length;
                }, 0);
              }, 0);
              
              const AreaIcon = getIcon('area', area.id);
              
              return (
                <div key={area.id} className="border rounded-lg p-4 bg-blue-50">
                  <div 
                    className="flex items-center justify-between cursor-pointer"
                    onClick={() => toggleArea(area.id)}
                  >
                    <div className="flex items-center">
                      {expandedAreas.includes(area.id) ? 
                        <ChevronDown className="h-5 w-5 mr-2" /> : 
                        <ChevronRight className="h-5 w-5 mr-2" />
                      }
                      <div 
                        className="cursor-pointer mr-2"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (canEdit()) cycleIcon(area.id, 'area');
                        }}
                      >
                        <AreaIcon className="h-5 w-5 text-blue-600" />
                      </div>
                      {editingItem?.id === area.id ? (
                        <div className="flex items-center space-x-2">
                          <Input
                            value={editingItem.name}
                            onChange={(e) => setEditingItem({...editingItem, name: e.target.value})}
                            className="max-w-xs"
                          />
                          <Button size="sm" onClick={() => handleUpdateItem(area.id, editingItem.name, 'area')}>
                            Salvar
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => setEditingItem(null)}>
                            Cancelar
                          </Button>
                        </div>
                      ) : (
                        <>
                          <h3 className="font-semibold text-lg">{area.name}</h3>
                          <Badge variant="default" className="ml-2">ÁREA</Badge>
                        </>
                      )}
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant="secondary">{areaSectors.length} setores</Badge>
                      <Badge variant="outline">{totalPeopleInArea} pessoas</Badge>
                      {canEdit() && (
                        <div className="flex space-x-1">
                          <Button size="sm" variant="outline" onClick={(e) => {
                            e.stopPropagation();
                            setEditingItem({id: area.id, name: area.name, type: 'area'});
                          }}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          {canDelete() && (
                            <Button size="sm" variant="outline" onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteItem(area.id, 'area', area.name);
                            }}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {expandedAreas.includes(area.id) && areaSectors.length > 0 && (
                    <div className="mt-4 ml-6 space-y-3">
                      {areaSectors.map((sector) => {
                        const sectorLifegroups = lifegroups.filter(l => l.sector_id === sector.id);
                        const totalPeopleInSector = sectorLifegroups.reduce((total, lg) => {
                          return total + people.filter(p => p.lifegroup_id === lg.id).length;
                        }, 0);
                        
                        const SectorIcon = getIcon('sector', sector.id);
                        
                        return (
                          <div key={sector.id} className="border rounded-lg p-3 bg-green-50">
                            <div 
                              className="flex items-center justify-between cursor-pointer"
                              onClick={() => toggleSector(sector.id)}
                            >
                              <div className="flex items-center">
                                {expandedSectors.includes(sector.id) ? 
                                  <ChevronDown className="h-4 w-4 mr-2" /> : 
                                  <ChevronRight className="h-4 w-4 mr-2" />
                                }
                                <div 
                                  className="cursor-pointer mr-2"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    if (canEdit()) cycleIcon(sector.id, 'sector');
                                  }}
                                >
                                  <SectorIcon className="h-4 w-4 text-green-600" />
                                </div>
                                {editingItem?.id === sector.id ? (
                                  <div className="flex items-center space-x-2">
                                    <Input
                                      value={editingItem.name}
                                      onChange={(e) => setEditingItem({...editingItem, name: e.target.value})}
                                      className="max-w-xs"
                                    />
                                    <Button size="sm" onClick={() => handleUpdateItem(sector.id, editingItem.name, 'sector')}>
                                      Salvar
                                    </Button>
                                    <Button size="sm" variant="outline" onClick={() => setEditingItem(null)}>
                                      Cancelar
                                    </Button>
                                  </div>
                                ) : (
                                  <>
                                    <h4 className="font-medium">{sector.name}</h4>
                                    <Badge variant="secondary" className="ml-2">SETOR</Badge>
                                  </>
                                )}
                              </div>
                              <div className="flex items-center space-x-2">
                                <Badge variant="secondary">{sectorLifegroups.length} lifegroups</Badge>
                                <Badge variant="outline">{totalPeopleInSector} pessoas</Badge>
                                {canEdit() && (
                                  <div className="flex space-x-1">
                                    <Button size="sm" variant="outline" onClick={(e) => {
                                      e.stopPropagation();
                                      setEditingItem({id: sector.id, name: sector.name, type: 'sector'});
                                    }}>
                                      <Edit className="h-3 w-3" />
                                    </Button>
                                    {canDelete() && (
                                      <Button size="sm" variant="outline" onClick={(e) => {
                                        e.stopPropagation();
                                        handleDeleteItem(sector.id, 'sector', sector.name);
                                      }}>
                                        <Trash2 className="h-3 w-3" />
                                      </Button>
                                    )}
                                  </div>
                                )}
                              </div>
                            </div>

                            {expandedSectors.includes(sector.id) && sectorLifegroups.length > 0 && (
                              <div className="mt-3 ml-6 space-y-2">
                                {sectorLifegroups.map((lifegroup) => {
                                  const lifegroupPeople = people.filter(p => p.lifegroup_id === lifegroup.id);
                                  const LifegroupIcon = getIcon('lifegroup', lifegroup.id);
                                  
                                  return (
                                    <div key={lifegroup.id} className="border rounded-lg p-3 bg-purple-50">
                                      <div 
                                        className="flex items-center justify-between cursor-pointer"
                                        onClick={() => toggleLifegroup(lifegroup.id)}
                                      >
                                        <div className="flex items-center">
                                          {expandedLifegroups.includes(lifegroup.id) ? 
                                            <ChevronDown className="h-4 w-4 mr-2" /> : 
                                            <ChevronRight className="h-4 w-4 mr-2" />
                                          }
                                          <div 
                                            className="cursor-pointer mr-2"
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              if (canEdit()) cycleIcon(lifegroup.id, 'lifegroup');
                                            }}
                                          >
                                            <LifegroupIcon className="h-4 w-4 text-purple-600" />
                                          </div>
                                          {editingItem?.id === lifegroup.id ? (
                                            <div className="flex items-center space-x-2">
                                              <Input
                                                value={editingItem.name}
                                                onChange={(e) => setEditingItem({...editingItem, name: e.target.value})}
                                                className="max-w-xs"
                                              />
                                              <Button size="sm" onClick={() => handleUpdateItem(lifegroup.id, editingItem.name, 'lifegroup')}>
                                                Salvar
                                              </Button>
                                              <Button size="sm" variant="outline" onClick={() => setEditingItem(null)}>
                                                Cancelar
                                              </Button>
                                            </div>
                                          ) : (
                                            <>
                                              <span className="text-sm font-medium">{lifegroup.name}</span>
                                              <Badge variant="outline" className="ml-2">LIFEGROUP</Badge>
                                            </>
                                          )}
                                        </div>
                                        <div className="flex items-center space-x-2">
                                          <Badge variant="outline">{lifegroupPeople.length} pessoas</Badge>
                                          {canEdit() && (
                                            <div className="flex space-x-1">
                                              <Button size="sm" variant="outline" onClick={(e) => {
                                                e.stopPropagation();
                                                setEditingItem({id: lifegroup.id, name: lifegroup.name, type: 'lifegroup'});
                                              }}>
                                                <Edit className="h-3 w-3" />
                                              </Button>
                                              {canDelete() && (
                                                <Button size="sm" variant="outline" onClick={(e) => {
                                                  e.stopPropagation();
                                                  handleDeleteItem(lifegroup.id, 'lifegroup', lifegroup.name);
                                                }}>
                                                  <Trash2 className="h-3 w-3" />
                                                </Button>
                                              )}
                                            </div>
                                          )}
                                        </div>
                                      </div>
                                      
                                      {expandedLifegroups.includes(lifegroup.id) && lifegroupPeople.length > 0 && (
                                        <div className="mt-3 ml-6 space-y-1">
                                          {lifegroupPeople.map((person) => (
                                            <div key={person.id} className="flex items-center justify-between py-2 px-3 bg-white rounded border text-sm">
                                              <div className="flex items-center">
                                                <User className="h-3 w-3 mr-2 text-gray-500" />
                                                <span className="font-medium">{person.name}</span>
                                                {person.is_leader && <span className="ml-2 text-yellow-500" title="Líder">👑</span>}
                                                {person.is_assistant && <span className="ml-1 text-blue-500" title="Auxiliar">🤚</span>}
                                                <span className="ml-2 text-gray-500">• {person.contact}</span>
                                              </div>
                                              {canEdit() && (
                                                <div className="flex space-x-1">
                                                  <Button size="sm" variant="outline" className="h-6 w-6 p-0">
                                                    <Edit className="h-2 w-2" />
                                                  </Button>
                                                  {canDelete() && (
                                                    <Button 
                                                      size="sm" 
                                                      variant="outline" 
                                                      className="h-6 w-6 p-0"
                                                      onClick={() => handleDeleteItem(person.id, 'person', person.name)}
                                                    >
                                                      <Trash2 className="h-2 w-2" />
                                                    </Button>
                                                  )}
                                                </div>
                                              )}
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
