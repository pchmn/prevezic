import {
  addDoc as firestoreAddDoc,
  CollectionReference,
  deleteDoc as firestoreDeleteDoc,
  DocumentReference,
  UpdateData,
  updateDoc as firestoreUpdateDoc,
} from 'firebase/firestore';
import { useState } from 'react';

import { convertObjectToDotNotation, DeepPartial } from '../../utils';

export function useFirestoreActions() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | undefined>();

  const addDoc = async <T>(ref: CollectionReference<T>, data: T) => {
    try {
      setLoading(true);
      setError(undefined);
      await firestoreAddDoc(ref, data);
      setLoading(false);
    } catch (error) {
      setError(error as Error);
      setLoading(false);
      throw error;
    }
  };

  const updateDoc = async <T>(ref: DocumentReference<T>, data: DeepPartial<T>, overwrite = false) => {
    try {
      setLoading(true);
      setError(undefined);
      await firestoreUpdateDoc(
        ref,
        overwrite ? (data as UpdateData<T>) : (convertObjectToDotNotation<T>(data) as UpdateData<T>)
      );
      setLoading(false);
    } catch (error) {
      setError(error as Error);
      setLoading(false);
      throw error;
    }
  };

  const deleteDoc = async (ref: DocumentReference) => {
    try {
      setLoading(true);
      setError(undefined);
      await firestoreDeleteDoc(ref);
      setLoading(false);
    } catch (error) {
      setError(error as Error);
      setLoading(false);
      throw error;
    }
  };

  return { loading, error, addDoc, updateDoc, deleteDoc };
}
