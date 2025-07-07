import { convexQuery } from '@convex-dev/react-query';
import { api } from '@prevezic/backend/_generated/api';
import type { Id } from '@prevezic/backend/_generated/dataModel';
import { useQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import { appConfig } from '~/config/config';
import { authClient } from '~/lib/auth.client';

export const Route = createFileRoute('/projects/$projectId')({
  component: RouteComponent,
});

function RouteComponent() {
  const { projectId } = Route.useParams();

  const { data: photos } = useQuery({
    ...convexQuery(api.photo.list, { projectId: projectId as Id<'projects'> }),
    initialData: [],
  });

  return (
    <div>
      Hello "/projects/$projectId" {projectId}!
      <div>{JSON.stringify(photos)}</div>
      {photos.map((photo) => (
        <div key={photo._id}>
          <img
            src={photo.url ?? ''}
            alt={photo.storageId}
            width={100}
            height={100}
          />
        </div>
      ))}
      <input
        type='file'
        accept='image/*'
        capture
        onChange={(e) => {
          console.log(e.target.files);
          if (e.target.files?.[0]) {
            addPhoto(e.target.files[0], projectId as Id<'projects'>);
          }
        }}
      />
    </div>
  );
}

async function addPhoto(file: File, projectId: Id<'projects'>) {
  const sendImageUrl = new URL(`${appConfig.convexSiteUrl}/add-photo`);
  sendImageUrl.searchParams.set('projectId', projectId);

  const { data } = await authClient.convex.token();

  await fetch(sendImageUrl, {
    method: 'POST',
    headers: {
      'Content-Type': file.type,
      Authorization: `Bearer ${data?.token}`,
    },
    body: file,
  });
}
