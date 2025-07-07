import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/projects/$projectId')({
  component: RouteComponent,
});

function RouteComponent() {
  const { projectId } = Route.useParams();
  return <div>Hello "/projects/$projectId" {projectId}!</div>;
}
