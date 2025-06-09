
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

// Este componente não é mais necessário com a nova hierarquia simplificada
// Setor > Lifegroups > Pessoas (removemos o nível "Grupo")
// Funcionalidade foi integrada diretamente no SectorsList

const LifegroupCard = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Componente Legacy</CardTitle>
        <CardDescription>
          Este componente foi substituído pela nova hierarquia simplificada
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-gray-500 text-center py-4">
          A hierarquia agora é: Setor → Lifegroups → Pessoas Cadastradas
        </p>
      </CardContent>
    </Card>
  );
};

export default LifegroupCard;
