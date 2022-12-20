import { useEffect, useMemo, useState } from 'react';

import { breakpoints } from '../provider';

type LargerThanOptions = {
  largerThan: keyof typeof breakpoints;
  smallerThan?: keyof typeof breakpoints;
};
type SmallerThanOptions = {
  smallerThan: keyof typeof breakpoints;
  largerThan?: keyof typeof breakpoints;
};
type UseMediaQueryOptions = LargerThanOptions | SmallerThanOptions;

function getQuery({ largerThan, smallerThan }: UseMediaQueryOptions) {
  let query = '';
  if (largerThan) {
    query = `(min-width: ${breakpoints[largerThan]}px)`;
  }
  if (smallerThan) {
    query = query
      ? `${query} and (max-width: ${breakpoints[smallerThan]}px)`
      : `(max-width: ${breakpoints[smallerThan]}px)`;
  }
  return query;
}

function getMatches(query: string) {
  // Prevents SSR issues
  if (typeof window !== 'undefined') {
    return window.matchMedia(query).matches;
  }
  return false;
}

export function useMediaQuery(options: UseMediaQueryOptions) {
  const query = useMemo(() => getQuery(options), [options]);
  const [matches, setMatches] = useState(getMatches(query));

  useEffect(() => {
    const mediaQuery = window.matchMedia(query);

    setMatches(getMatches(query));

    const listener = () => setMatches(getMatches(query));

    try {
      mediaQuery.addEventListener('change', listener);
    } catch (e) {
      mediaQuery.addListener(listener);
    }

    return () => {
      try {
        mediaQuery.removeEventListener('change', listener);
      } catch (e) {
        mediaQuery.removeListener(listener);
      }
    };
  }, [query]);

  return matches;
}
