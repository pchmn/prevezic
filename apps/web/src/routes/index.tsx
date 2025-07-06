import { Button } from '@prevezic/ui/button';
import { createFileRoute } from '@tanstack/react-router';
import '../App.css';

export const Route = createFileRoute('/')({
  component: App,
});

function App() {
  return (
    <div>
      <Button>Click me</Button>
    </div>
  );
}
