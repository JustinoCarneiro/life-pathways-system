
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { X } from 'lucide-react';

interface CreateSectorFormProps {
  onSubmit: (sectorData: { name: string; description: string }) => void;
  onCancel: () => void;
}

const CreateSectorForm: React.FC<CreateSectorFormProps> = ({ onSubmit, onCancel }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      toast({
        title: "Erro",
        description: "Nome do setor é obrigatório",
        variant: "destructive",
      });
      return;
    }

    onSubmit({ name: name.trim(), description: description.trim() });
    
    toast({
      title: "Setor criado!",
      description: `O setor "${name}" foi criado com sucesso.`,
    });
    
    setName('');
    setDescription('');
  };

  return (
    <Card className="border-2 border-blue-200 bg-blue-50">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Criar Novo Setor</CardTitle>
            <CardDescription>
              Adicione um novo setor ao sistema START FORTALEZA
            </CardDescription>
          </div>
          <Button variant="ghost" size="sm" onClick={onCancel}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="sectorName">Nome do Setor</Label>
            <Input
              id="sectorName"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Setor Norte, Setor Centro..."
              required
            />
          </div>
          <div>
            <Label htmlFor="sectorDescription">Descrição</Label>
            <Input
              id="sectorDescription"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Descrição da região ou características do setor"
            />
          </div>
          <div className="flex space-x-2">
            <Button type="submit">Criar Setor</Button>
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancelar
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default CreateSectorForm;
