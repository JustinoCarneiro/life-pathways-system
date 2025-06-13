
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Calendar, User, MapPin, Phone, Mail, X } from 'lucide-react';

interface PersonRegistrationFormProps {
  onClose: () => void;
  onPersonAdded: () => void;
}

interface Lifegroup {
  id: string;
  name: string;
  sector: {
    name: string;
    area: {
      name: string;
    };
  };
}

const PersonRegistrationForm: React.FC<PersonRegistrationFormProps> = ({ onClose, onPersonAdded }) => {
  const [formData, setFormData] = useState({
    name: '',
    contact: '',
    address: '',
    birth_date: '',
    lifegroup_id: '',
    is_leader: false,
    is_assistant: false,
    discipler_id: ''
  });
  
  const [lifegroups, setLifegroups] = useState<Lifegroup[]>([]);
  const [people, setPeople] = useState<Array<{id: string, name: string}>>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchLifegroups();
    fetchPeople();
  }, []);

  const fetchLifegroups = async () => {
    try {
      const { data, error } = await supabase
        .from('lifegroups')
        .select(`
          id,
          name,
          sector:sectors(
            name,
            area:areas(name)
          )
        `);

      if (error) throw error;
      setLifegroups(data || []);
    } catch (error) {
      console.error('Error fetching lifegroups:', error);
    }
  };

  const fetchPeople = async () => {
    try {
      const { data, error } = await supabase
        .from('people')
        .select('id, name')
        .order('name');

      if (error) throw error;
      setPeople(data || []);
    } catch (error) {
      console.error('Error fetching people:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast({
        title: "Nome obrigatório",
        description: "Por favor, insira o nome da pessoa.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    try {
      const { error } = await supabase
        .from('people')
        .insert([{
          name: formData.name,
          contact: formData.contact || null,
          address: formData.address || null,
          birth_date: formData.birth_date || null,
          lifegroup_id: formData.lifegroup_id || null,
          is_leader: formData.is_leader,
          is_assistant: formData.is_assistant,
          discipler_id: formData.discipler_id || null,
          steps: {}
        }]);

      if (error) throw error;

      toast({
        title: "Pessoa cadastrada com sucesso!",
        description: `${formData.name} foi adicionado ao sistema.`,
      });

      onPersonAdded();
      onClose();
    } catch (error) {
      console.error('Error creating person:', error);
      toast({
        title: "Erro ao cadastrar pessoa",
        description: "Não foi possível cadastrar a pessoa. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="flex items-center">
              <User className="h-5 w-5 mr-2" />
              Cadastrar Nova Pessoa
            </CardTitle>
            <CardDescription>
              Preencha as informações da pessoa
            </CardDescription>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Nome Completo *</label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Nome completo da pessoa"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Contato</label>
              <Input
                value={formData.contact}
                onChange={(e) => setFormData(prev => ({ ...prev, contact: e.target.value }))}
                placeholder="Telefone ou WhatsApp"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Data de Nascimento</label>
              <Input
                type="date"
                value={formData.birth_date}
                onChange={(e) => setFormData(prev => ({ ...prev, birth_date: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Lifegroup</label>
              <Select value={formData.lifegroup_id} onValueChange={(value) => setFormData(prev => ({ ...prev, lifegroup_id: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecionar Lifegroup" />
                </SelectTrigger>
                <SelectContent>
                  {lifegroups.map((lifegroup) => (
                    <SelectItem key={lifegroup.id} value={lifegroup.id}>
                      {lifegroup.name} - {lifegroup.sector?.name} ({lifegroup.sector?.area?.name})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Discipulador</label>
              <Select value={formData.discipler_id} onValueChange={(value) => setFormData(prev => ({ ...prev, discipler_id: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecionar Discipulador" />
                </SelectTrigger>
                <SelectContent>
                  {people.map((person) => (
                    <SelectItem key={person.id} value={person.id}>
                      {person.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Endereço</label>
            <Input
              value={formData.address}
              onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
              placeholder="Endereço completo"
            />
          </div>

          <div className="flex gap-4">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={formData.is_leader}
                onChange={(e) => setFormData(prev => ({ ...prev, is_leader: e.target.checked }))}
                className="rounded border-gray-300"
              />
              <span className="text-sm">É líder</span>
            </label>

            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={formData.is_assistant}
                onChange={(e) => setFormData(prev => ({ ...prev, is_assistant: e.target.checked }))}
                className="rounded border-gray-300"
              />
              <span className="text-sm">É auxiliar</span>
            </label>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Cadastrando...' : 'Cadastrar Pessoa'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default PersonRegistrationForm;
