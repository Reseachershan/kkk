import firestore, {
  FirebaseFirestoreTypes,
} from '@react-native-firebase/firestore';

export const getCollection = (path: string) => {
  return firestore().collection(path);
};
export const getDocument = (path: string) => {
  return firestore().doc(path);
};
export const getBatch = () => {
  const batchs = [firestore().batch()];
  const MAX_BATCH_SIZE = 480;
  let petitions = 0;
  const getCurrentBatch = () => {
    petitions++;
    if (petitions >= MAX_BATCH_SIZE) {
      petitions = 0;
      batchs.push(firestore().batch());
    }
    return batchs[batchs.length - 1];
  };

  const commit = async () => {
    return await Promise.all(batchs.map(async batch => await batch.commit()));
  };
  const deleteF = (
    documentRef: FirebaseFirestoreTypes.DocumentReference<FirebaseFirestoreTypes.DocumentData>,
  ) => {
    const batch = getCurrentBatch();
    return batch.delete(documentRef);
  };
  const set = (
    documentRef: FirebaseFirestoreTypes.DocumentReference<any>,
    data: any,
    options?: FirebaseFirestoreTypes.SetOptions | undefined,
  ) => {
    const batch = getCurrentBatch();
    return batch.set(documentRef, data, options);
  };
  const update = (
    documentRef: FirebaseFirestoreTypes.DocumentReference<FirebaseFirestoreTypes.DocumentData>,
    data: Partial<{[x: string]: any}>,
  ) => {
    const batch = getCurrentBatch();
    return batch.update(documentRef, data);
  };
  return {
    commit,
    delete: deleteF,
    set,
    update,
  };
};
export const getCollectionGroup = (collectionId: string) => {
  return firestore().collectionGroup(collectionId);
};
export const runTransaction = (
  updateFunction: (
    transaction: FirebaseFirestoreTypes.Transaction,
  ) => Promise<any>,
) => {
  return firestore().runTransaction(updateFunction);
};
