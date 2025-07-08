import { convexQuery } from '@convex-dev/react-query';
import { api } from '@prevezic/backend/_generated/api';
import { Button } from '@prevezic/ui/button';
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
    if (projects && projects.length > 0) {
      navigate({
        to: '/projects/$projectId',
        params: { projectId: projects[0]._id },
      });
    }
  }, [isPending, projects, navigate]);

  if (!isPending && projects?.length === 0) {
    return (
      <Flex align='center' justify='center' className='h-screen' gap='md'>
        <Input
          placeholder='Entrer le code...'
          value={code}
          onChange={(e) => setCode(e.target.value)}
        />
        <Button
          onClick={() =>
            navigate({ to: '/projects/join', search: { token: code } })
          }
        >
          Rejoindre
        </Button>
      </Flex>
    );
  }

  return (
    <Flex align='center' justify='center' className='h-screen'>
      <Spinner className='w-8 h-8' />
    </Flex>
  );
}
