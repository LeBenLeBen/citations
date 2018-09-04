import { database } from '@/services/firebase';

export default class QuotesController {
  static scope = 'quotes';

  static create({ quote, author, interlocutor, date }) {
    const text = typeof quote === 'string' ? quote.split('\n') : quote;
    const timestamp = new Date(date).getTime();

    return database.collection(this.scope).add({
      text,
      author,
      interlocutor,
      date: timestamp,
    });
  }

  static toggleLike({ quoteId, userId }) {
    return database
      .collection(this.scope)
      .doc(quoteId)
      .get()
      .then(querySnapshot => {
        const likers =
          (querySnapshot.data() && querySnapshot.data().likedBy) || [];
        const index = likers.indexOf(userId);

        if (likers && index > -1) {
          likers.splice(index, 1);
        } else {
          likers.push(userId);
        }

        return database
          .collection(this.scope)
          .doc(quoteId)
          .set(
            {
              likedBy: likers,
            },
            { merge: true },
          );
      });
  }
}
