import { useMutation } from '@tanstack/react-query';
import {
  addDoc as firestoreAddDoc,
  CollectionReference,
  deleteDoc as firestoreDeleteDoc,
  DocumentReference,
  UpdateData,
  updateDoc as firestoreUpdateDoc,
} from 'firebase/firestore';

import { convertObjectToDotNotation, DeepPartial } from '../../utils';

export function useFirestoreAddDoc<T>() {
  return useMutation({
    mutationFn: ({ ref, data }: { ref: CollectionReference<T>; data: T }) => firestoreAddDoc(ref, data),
  });
}

export function useFirestoreUpdateDoc<T>() {
  return useMutation({
    mutationFn: ({ ref, data, overwrite }: { ref: DocumentReference<T>; data: DeepPartial<T>; overwrite?: boolean }) =>
      firestoreUpdateDoc(
        ref,
        overwrite ? (data as UpdateData<T>) : (convertObjectToDotNotation<T>(data) as UpdateData<T>)
      ),
  });
}

export function useFirestoreDeleteDoc() {
  return useMutation({
    mutationFn: ({ ref }: { ref: DocumentReference }) => firestoreDeleteDoc(ref),
  });
}
