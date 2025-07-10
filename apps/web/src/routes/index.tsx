import { convexQuery } from '@convex-dev/react-query';
import { api } from '@prevezic/backend/_generated/api';
import { Button } from '@prevezic/ui/button';
import { Card, CardContent } from '@prevezic/ui/card';
import { Flex } from '@prevezic/ui/flex';
import { Input } from '@prevezic/ui/input';
import { Spinner } from '@prevezic/ui/spinner';
import { useQuery } from '@tanstack/react-query';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import '../App.css';

export const Route = createFileRoute('/')({
  component: App,
});

function App() {
  const navigate = useNavigate();

  const { data: projects, isPending } = useQuery({
    ...convexQuery(api.project.list, {}),
    networkMode: 'online',
  });

  const [code, setCode] = useState('');

  useEffect(() => {
    console.log({ isPending, projects });
    if (isPending) {
      return;
    }
    if (projects && projects.length === 1) {
      navigate({
        to: '/projects/$projectId',
        params: { projectId: projects[0]._id },
        replace: true,
      });
    }
  }, [isPending, projects, navigate]);

  if (!isPending && projects?.length !== 1) {
    return (
      <Flex direction='col' className='h-screen w-full p-4' gap='md'>
        <Flex direction='col' gap='md'>
          {projects?.map((project) => (
            <Card
              key={project._id}
              onClick={() =>
                navigate({
                  to: '/projects/$projectId',
                  params: { projectId: project._id },
                })
              }
            >
              <CardContent className='flex flex-col gap-1 py-2 px-4'>
                <div className='text-lg font-bold'>{project.name}</div>
                <div className='text-sm text-muted-foreground'>
                  {project.description}
                </div>
              </CardContent>
            </Card>
          ))}
        </Flex>

        <Flex gap='md' flex='1' align='center' justify='center'>
          <Input
            placeholder='Entrer le code...'
            value={code}
            onChange={(e) => setCode(e.target.value)}
          />
          <Button
            onClick={() =>
              navigate({
                to: '/projects/join',
                search: { token: code },
                replace: true,
              })
            }
          >
            Rejoindre
          </Button>
        </Flex>
      </Flex>
    );
  }

  return (
    <Flex align='center' justify='center' className='h-screen'>
      <Spinner className='w-8 h-8' />
    </Flex>
  );
}
