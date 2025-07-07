import { Button } from '@prevezic/ui/button';
import { createFileRoute } from '@tanstack/react-router';
import { appConfig } from '~/config/config';
import { SESSION_QUERY_KEY } from '~/hooks/useSession';
import { authClient } from '~/lib/auth.client';
import '../App.css';

export const Route = createFileRoute('/')({
  component: App,
  beforeLoad: async ({ context: { authClient, queryClient } }) => {
    const { data: session } = await authClient.getSession();

    if (!session) {
      const { data } = await authClient.signIn.anonymous();
      queryClient.setQueryData(SESSION_QUERY_KEY, data);
    } else {
      queryClient.setQueryData(SESSION_QUERY_KEY, session);
    }
  },
});

function App() {
  return (
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
