import { useEffect, useMemo, useState } from 'react';

import { HTML5Store, StorageChangeEvent, StorageType } from './html5Store';

interface Options<T> {
  defaultValue?: T;
  storage?: StorageType;
}

export function useStorage<T>(
  key: string,
  { defaultValue, storage = 'localStorage' }: Options<T>
): [T | undefined, (value: T | ((prevState: T | undefined) => T)) => void, () => void] {
  const store = useMemo(() => new HTML5Store<T>(storage), [storage]);
  const [value, setValue] = useState(store.get(key, defaultValue));

  useEffect(() => {
    const listener = ((event: StorageChangeEvent<T>) => {
      if (event.detail.value !== value) {
        setValue(event.detail.value);
      }
    }) as EventListener;
    store.watch(key, listener);

    return () => {
      store.unwatch(key);
    };
  }, [key, store, value]);

  const set = (newValue: T | ((prevState: T | undefined) => T)) => {
    store.set(key, newValue instanceof Function ? newValue(value) : newValue);
  };

  const remove = () => store.remove(key);

  return [value, set, remove];
}
