import { useConvexMutation } from '@convex-dev/react-query';
import { api } from '@prevezic/backend/_generated/api';
import { Flex } from '@prevezic/ui/flex';
import { Spinner } from '@prevezic/ui/spinner';
import { useMutation } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import { useEffect } from 'react';
import z from 'zod';
import { isPrevezicError } from '~/lib/error.utils';

const searchSchema = z.object({
  token: z.string(),
});

export const Route = createFileRoute('/projects/join')({
  validateSearch: searchSchema,
  component: RouteComponent,
});

function RouteComponent() {
  const { token } = Route.useSearch();
  const navigate = Route.useNavigate();

  const { mutate: joinProject, isPending: isJoiningProject } = useMutation({
    mutationFn: useConvexMutation(api.project.join),
    onSuccess: ({ projectId }: { projectId: string }) => {
      navigate({ to: '/projects/$projectId', params: { projectId } });
    },
    onError: (error) => {
      if (isPrevezicError(error)) {
        console.error(error.data.code);
      }
      navigate({ to: '/' });
    },
  });

  useEffect(() => {
    joinProject({
      invitationToken: token,
    });
  }, [joinProject, token]);

  return (
    <Flex align='center' justify='center' className='h-screen'>
      <Spinner className='w-8 h-8' />
    </Flex>
  );
}
