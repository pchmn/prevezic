import { convexQuery } from '@convex-dev/react-query';
import { api } from '@prevezic/backend/_generated/api';
import type { Id } from '@prevezic/backend/_generated/dataModel';
import { useTheme } from '@prevezic/ui/theme-provider';
import { useQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import { useEffect } from 'react';
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

  const { resetMetaThemeColor, setMetaThemeColor } = useTheme();

  const { data: medias } = useQuery({
    ...convexQuery(api.media.list, {
      projectId: projectId as Id<'projects'>,
    }),
    initialData: [],
  });

  useEffect(() => {
    setMetaThemeColor('#000');

    return () => resetMetaThemeColor();
  }, [setMetaThemeColor, resetMetaThemeColor]);

  return (
    <SlideShowDialog
      open={true}
      onOpenChange={() => {
        navigate({
          to: '/projects/$projectId',
          params: { projectId },
        });
      }}
      images={medias}
      initialIndex={medias.findIndex((media) => media._id === mediaId)}
      onDownload={(index) => {
        const media = medias[index];
        if (!media) return;
        fetch(media.url).then(async (res) => {
          const blob = await res.blob();
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `${media._id}-${new Date(media._creationTime).toISOString()}.${media.contentType.split('/')[1]}`;
          a.click();
          a.remove();
        });
      }}
    />
  );
}
