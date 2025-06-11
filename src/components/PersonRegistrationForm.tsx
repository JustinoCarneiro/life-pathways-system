
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { User, X } from 'lucide-react';

interface Lifegroup {
  id: string;
  name: string;
  sector_id: string;
}

interface PersonRegistrationFormProps {
  lifegroups: Lifegroup[];
  onSuccess: () => void;
  onCancel: () => void;
}

const PersonRegistrationForm: React.FC<PersonRegistrationFormProps> = ({
  lifegroups,
  onSuccess,
  onCancel
}) => {
  const [formData, setFormData] = useState({
    name: '',
    contact: '',
    address: '',
    birth_date: '',
    lifegroup_id: '',
    is_leader: false,
    is_assistant: false,
    discipler_id: '',
    steps: {
      newBirth: '',
      initialFollowUp: false,
      coffeeWithPastor: false,
      stationDNA: false,
      newCreature: false,
      baptism: false
    }
  });
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.lifegroup_id) {
      toast({
        title: "Campos obrigatórios",
        description: "Nome e Lifegroup são obrigatórios.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsLoading(true);
      
      const { error } = await supabase
        .from('people')
        .insert([{
          name: formData.name.trim(),
          contact: formData.contact.trim() || null,
          address: formData.address.trim() || null,
          birth_date: formData.birth_date || null,
          lifegroup_id: formData.lifegroup_id,
          is_leader: formData.is_leader,
          is_assistant: formData.is_assistant,
          discipler_id: formData.discipler_id || null,
          steps: formData.steps
        }]);

      if (error) throw error;

      toast({
        title: "Pessoa cadastrada com sucesso!",
        description: `${formData.name} foi adicionado ao sistema.`,
      });

      onSuccess();
    } catch (error) {
      console.error('Error creating person:', error);
      toast({
        title: "Erro ao cadastrar pessoa",
        description: "Não foi possível cadastrar a pessoa.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleStepChange = (stepKey: string, value: boolean | string) => {
    setFormData(prev => ({
      ...prev,
      steps: {
        ...prev.steps,
        [stepKey]: value
      }
    }));
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <User className="h-5 w-5 mr-2" />
            <CardTitle>Cadastrar Nova Pessoa</CardTitle>
          </div>
          <Button variant="outline" size="sm" onClick={onCancel}>
            <X className="h-4 w-4" />
          </Button>
        </div>
        <CardDescription>
          Preencha os dados da nova pessoa para cadastro
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Nome Completo *</label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Digite o nome completo"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Data de Nascimento</label>
              <Input
                type="date"
                value={formData.birth_date}
                onChange={(e) => setFormData(prev => ({ ...prev, birth_date: e.target.value }))}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Contato</label>
              <Input
                value={formData.contact}
                onChange={(e) => setFormData(prev => ({ ...prev, contact: e.target.value }))}
                placeholder="Telefone ou WhatsApp"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Lifegroup *</label>
              <Select 
                value={formData.lifegroup_id} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, lifegroup_id: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um lifegroup" />
                </SelectTrigger>
                <SelectContent>
                  {lifegroups.map(lifegroup => (
                    <SelectItem key={lifegroup.id} value={lifegroup.id}>
                      {lifegroup.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Endereço</label>
            <Input
              value={formData.address}
              onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
              placeholder="Endereço completo"
            />
          </div>

          <div className="space-y-3">
            <label className="block text-sm font-medium">Funções</label>
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="is_leader"
                  checked={formData.is_leader}
                  onCheckedChange={(checked) => 
                    setFormData(prev => ({ ...prev, is_leader: checked as boolean }))
                  }
                />
                <label htmlFor="is_leader" className="text-sm">É Líder</label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="is_assistant"
                  checked={formData.is_assistant}
                  onCheckedChange={(checked) => 
                    setFormData(prev => ({ ...prev, is_assistant: checked as boolean }))
                  }
                />
                <label htmlFor="is_assistant" className="text-sm">É Assistente</label>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <label className="block text-sm font-medium">Trilho de Crescimento</label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="initialFollowUp"
                  checked={formData.steps.initialFollowUp}
                  onCheckedChange={(checked) => handleStepChange('initialFollowUp', checked as boolean)}
                />
                <label htmlFor="initialFollowUp" className="text-sm">Acompanhamento Inicial</label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="coffeeWithPastor"
                  checked={formData.steps.coffeeWithPastor}
                  onCheckedChange={(checked) => handleStepChange('coffeeWithPastor', checked as boolean)}
                />
                <label htmlFor="coffeeWithPastor" className="text-sm">Café com Pastor</label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="stationDNA"
                  checked={formData.steps.stationDNA}
                  onCheckedChange={(checked) => handleStepChange('stationDNA', checked as boolean)}
                />
                <label htmlFor="stationDNA" className="text-sm">Estação DNA</label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="newCreature"
                  checked={formData.steps.newCreature}
                  onCheckedChange={(checked) => handleStepChange('newCreature', checked as boolean)}
                />
                <label htmlFor="newCreature" className="text-sm">Nova Criatura</label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="baptism"
                  checked={formData.steps.baptism}
                  onCheckedChange={(checked) => handleStepChange('baptism', checked as boolean)}
                />
                <label htmlFor="baptism" className="text-sm">Batismo</label>
              </div>
            </div>
          </div>

          <div className="flex space-x-2">
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Cadastrando...' : 'Cadastrar Pessoa'}
            </Button>
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancelar
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default PersonRegistrationForm;
