import { convexQuery } from '@convex-dev/react-query';
import { api } from '@prevezic/backend/_generated/api';
import type { Id } from '@prevezic/backend/_generated/dataModel';
import { useQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import { z } from 'zod';
import { SlideShowDialog } from '~/components/SlideShow';

const searchSchema = z.object({
  mediaId: z.string(),
});

export const Route = createFileRoute('/projects/$projectId/slide-show')({
  validateSearch: searchSchema,
  component: RouteComponent,
});

function RouteComponent() {
  const { projectId } = Route.useParams();
  const { mediaId } = Route.useSearch();
  const navigate = Route.useNavigate();

  const { data: photos } = useQuery({
    ...convexQuery(api.photo.list, {
      projectId: projectId as Id<'projects'>,
    }),
    initialData: [],
  });

  console.log(photos);

  // if (!photos) return null;

  return (
    <SlideShowDialog
      open={true}
      onOpenChange={() => {
        navigate({
          to: '/projects/$projectId',
          params: { projectId },
        });
      }}
      images={photos}
      initialIndex={photos.findIndex((photo) => photo._id === mediaId)}
    />
  );
}
