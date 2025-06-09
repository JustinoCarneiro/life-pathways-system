
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import PersonCard from './PersonCard';

const LifegroupList = () => {
  const dummyPeople = [
    {
      id: '1',
      name: 'João Silva',
      contact: '(11) 99999-9999',
      address: 'Rua das Flores, 123 - São Paulo',
      birthDate: '1990-05-15',
      steps: {
        newBirth: '2024-01-15',
        initialFollowUp: true,
        coffeeWithPastor: true,
        stationDNA: false,
        newCreature: false,
        baptism: false,
      },
    },
    {
      id: '2',
      name: 'Maria Santos',
      contact: '(11) 88888-8888',
      address: 'Av. Principal, 456 - São Paulo',
      birthDate: '1985-09-22',
      steps: {
        newBirth: '2023-11-10',
        initialFollowUp: true,
        coffeeWithPastor: true,
        stationDNA: true,
        newCreature: true,
        baptism: true,
      },
    },
    {
      id: '3',
      name: 'Pedro Costa',
      contact: '(11) 77777-7777',
      address: 'Rua da Esperança, 789 - São Paulo',
      birthDate: '1992-03-08',
      steps: {
        newBirth: '2024-02-01',
        initialFollowUp: true,
        coffeeWithPastor: false,
        stationDNA: false,
        newCreature: false,
        baptism: false,
      },
    },
    {
      id: '4',
      name: 'Ana Oliveira',
      contact: '(11) 66666-6666',
      address: 'Rua da Paz, 321 - São Paulo',
      birthDate: '1988-12-03',
      steps: {
        newBirth: '2023-08-20',
        initialFollowUp: true,
        coffeeWithPastor: true,
        stationDNA: true,
        newCreature: false,
        baptism: false,
      },
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          Grupo de Vida Alpha
        </CardTitle>
        <CardDescription>
          Acompanhe o progresso espiritual de cada pessoa
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {dummyPeople.map((person) => (
            <PersonCard
              key={person.id}
              {...person}
              lifegroupId="alpha"
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default LifegroupList;
