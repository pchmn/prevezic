export type StorageType = 'localStorage' | 'sessionStorage';
export class StorageChangeEvent<T> extends CustomEvent<{ value: T; cause?: 'write' | 'remove' }> {}

export class HTML5Store<T> {
  protected listener: EventListener | undefined;
  private storage: Storage;

  constructor(protected storageType: StorageType = 'localStorage') {
    this.storage = storageType === 'localStorage' ? localStorage : sessionStorage;
  }

  set(key: string, value: T) {
    this.storage.setItem(key, JSON.stringify(value));
    dispatchStorageEvent(`${this.storageType}:${key}`, value, 'write');
  }

  get(key: string, defaultValue?: T) {
    const item = this.storage.getItem(key);

    if (item !== null) {
      return JSON.parse(item) as T;
    }

    return defaultValue;
  }

  remove(key: string) {
    this.storage.removeItem(key);
    dispatchStorageEvent(`${this.storageType}:${key}`, undefined, 'remove');
  }

  watch(key: string, listener: (event: StorageChangeEvent<T>) => void) {
    this.listener = listener as EventListener;
    window.addEventListener(`${this.storageType}:${key}`, this.listener);
  }

  unwatch(key: string): void {
    if (this.listener) {
      window.removeEventListener(`${this.storageType}:${key}`, this.listener);
    }
  }
}

function dispatchStorageEvent<T>(eventName: string, value: T, cause?: 'write' | 'remove'): void {
  window.dispatchEvent(
    new StorageChangeEvent(eventName, {
      detail: {
        value,
        cause,
      },
    })
  );
}
