import { database } from '@/services/firebase';

const scope = 'authors';

export function create({ name }) {
  return database.collection(scope).add({
    name,
  });
}

export function createIfNotExists({ name }) {
  return database
    .collection(scope)
    .where('name', '==', name)
    .get()
    .then(querySnapshot => {
      if (querySnapshot.empty) {
        return create({ name });
      }
    });
}
