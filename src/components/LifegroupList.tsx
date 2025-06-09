
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import PersonCard from './PersonCard';

const LifegroupList = () => {
  // Este componente agora é legacy - a funcionalidade foi movida para SectorsList
  // Mantido para compatibilidade, mas pode ser removido no futuro
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          Sistema Legacy
        </CardTitle>
        <CardDescription>
          Esta visualização foi substituída pela nova hierarquia de setores
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-gray-500 text-center py-8">
          A nova estrutura hierárquica está disponível acima com Setores → Lifegroups → Grupos → Pessoas
        </p>
      </CardContent>
    </Card>
  );
};

export default LifegroupList;
