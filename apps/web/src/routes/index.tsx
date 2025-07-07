import { convexQuery } from '@convex-dev/react-query';
import { api } from '@prevezic/backend/_generated/api';
import { Button } from '@prevezic/ui/button';
import { useQuery } from '@tanstack/react-query';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { appConfig } from '~/config/config';
import { authClient } from '~/lib/auth.client';
import '../App.css';

export const Route = createFileRoute('/')({
  component: App,
});

function App() {
  const navigate = useNavigate();

  const {
    data: projects,
    isPending,
    isFetching,
    isLoading,
  } = useQuery({
    ...convexQuery(api.project.list, {}),
    initialData: [],
  });

  console.log('isPending', { isPending, isFetching });

  if (!isPending && projects?.length === 1) {
    navigate({
      to: '/projects/$projectId',
      params: { projectId: projects[0]._id },
    });
  }

  return isPending ? (
    <div>Loading...</div>
  ) : (
    <div>
      <Button onClick={addPhoto}>Click me</Button>
      <input
        type='file'
        accept='image/*'
        capture
        onChange={(e) => {
          console.log(e.target.files);
        }}
      />
    </div>
  );
}

async function addPhoto() {
  const sendImageUrl = new URL(`${appConfig.convexSiteUrl}/add-photo`);
  sendImageUrl.searchParams.set('author', 'Jack Smith');

  const { data } = await authClient.convex.token();

  await fetch(sendImageUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'image/png',
      Authorization: `Bearer ${data?.token}`,
    },
    body: 'test',
  });
}
