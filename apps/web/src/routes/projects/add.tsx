import { api } from '@prevezic/backend/_generated/api';
import { Button } from '@prevezic/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@prevezic/ui/card';
import { Input } from '@prevezic/ui/input';
import { createFileRoute, useRouter } from '@tanstack/react-router';
import { useMutation } from 'convex/react';
import { useState } from 'react';

export const Route = createFileRoute('/projects/add')({
  component: RouteComponent,
});

function RouteComponent() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [errors, setErrors] = useState<{ name?: string; general?: string }>({});
  const [isLoading, setIsLoading] = useState(false);

  const insertProject = useMutation(api.project.insert);

  const validateForm = () => {
    const newErrors: { name?: string } = {};

    if (!name.trim()) {
      newErrors.name = 'Project name is required';
    } else if (name.trim().length < 3) {
      newErrors.name = 'Project name must be at least 3 characters';
    } else if (name.trim().length > 100) {
      newErrors.name = 'Project name must be less than 100 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setErrors({});
    setIsLoading(true);

    try {
      const projectId = await insertProject({
        name: name.trim(),
        description: description.trim() || undefined,
      });

      // Navigate to the project page (or projects list)
      // For now, redirect to home - you can change this to the actual project route later
      router.navigate({ to: '/' });
    } catch (error) {
      console.error('Failed to create project:', error);
      setErrors({
        general: 'Failed to create project. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='container mx-auto py-8 px-4 max-w-2xl'>
      <Card>
        <CardHeader>
          <CardTitle>Create New Project</CardTitle>
          <CardDescription>
            Start a new photo collection project for your event. Share photos
            with friends and family!
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className='space-y-6'>
            {errors.general && (
              <div className='bg-destructive/10 border border-destructive/20 rounded-md p-4'>
                <p className='text-destructive text-sm font-medium'>
                  {errors.general}
                </p>
              </div>
            )}

            <div>
              <Input
                id='project-name'
                label='Project Name'
                type='text'
                placeholder="e.g., Sarah's Birthday Party, Summer Wedding 2024"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (errors.name) {
                    setErrors((prev) => ({ ...prev, name: undefined }));
                  }
                }}
                error={errors.name}
                required
              />
            </div>

            <div>
              <Input
                id='project-description'
                label='Description (Optional)'
                type='text'
                placeholder='Tell people what this project is about...'
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <div className='flex gap-4 pt-4'>
              <Button type='submit' disabled={isLoading} className='flex-1'>
                {isLoading ? 'Creating...' : 'Create Project'}
              </Button>
              <Button
                type='button'
                variant='outline'
                onClick={() => router.history.back()}
                disabled={isLoading}
              >
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
