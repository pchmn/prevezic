import { convexQuery } from '@convex-dev/react-query';
import { api } from '@prevezic/backend/_generated/api';
import { Flex } from '@prevezic/ui/flex';
import { Spinner } from '@prevezic/ui/spinner';
import { useQuery } from '@tanstack/react-query';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useEffect } from 'react';
import '../App.css';

export const Route = createFileRoute('/')({
  component: App,
});

function App() {
  const navigate = useNavigate();

  const { data: projects, isPending } = useQuery({
    ...convexQuery(api.project.list, {}),
  });

  useEffect(() => {
    console.log({ isPending, projects });
    if (!isPending && projects && projects.length > 0) {
      navigate({
        to: '/projects/$projectId',
        params: { projectId: projects[0]._id },
      });
    }
  }, [isPending, projects, navigate]);

  return (
    <Flex align='center' justify='center' className='h-screen'>
      <Spinner className='w-8 h-8' />
    </Flex>
  );
}
