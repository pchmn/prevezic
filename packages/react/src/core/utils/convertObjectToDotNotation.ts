import { DeepPartial } from './deepPartial.type';
import { DotNotation } from './dotNotation.type';

export function convertObjectToDotNotation<T>(obj: DeepPartial<T>): Partial<DotNotation<T>> {
  const newObj: Partial<DotNotation<T>> = {};
  recurse(newObj, obj);
  return newObj;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function recurse(newObj: any, obj: any, currentKey?: string) {
  for (const key in obj) {
    const value = obj[key];
    const newKey = currentKey ? `${currentKey}.${key}` : key;
    if (typeof value === 'object') {
      recurse(newObj, value, newKey);
    } else {
      newObj[newKey] = value;
    }
  }
}
