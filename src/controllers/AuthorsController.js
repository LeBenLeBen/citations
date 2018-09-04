import { database } from '@/services/firebase';

export default class AuthorsController {
  static scope = 'authors';

  static create({ name }) {
    return database.collection(this.scope).add({
      name,
    });
  }

  static createIfNotExists({ name }) {
    return database
      .collection(this.scope)
      .where('name', '==', name)
      .get()
      .then(querySnapshot => {
        if (querySnapshot.empty) {
          return this.create({ name });
        }
      });
  }
}
