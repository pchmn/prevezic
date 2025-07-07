export function Loading({
  isLoading,
  fallback,
  children,
}: {
  isLoading: boolean;
  fallback?: React.ReactNode;
  children: React.ReactNode;
}) {
  if (isLoading) {
    return fallback ?? <div>Loading...</div>;
  }

  return children;
}
