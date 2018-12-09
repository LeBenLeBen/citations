const functions = require('firebase-functions');

const admin = require('firebase-admin');
admin.initializeApp();

const database = admin.firestore();

database.settings({ timestampsInSnapshots: true });

/**
 * Set likes, dislikes and score couters on all quotes
 * Only if it mistmatch the likers/dislikers list
 */
exports.updateFeelingsAndScore = functions.https.onRequest(
  (request, response) => {
    let quotesUpdatedCounter = 0;

    return database
      .collection('quotes')
      .get()
      .then(querySnapshot => {
        return querySnapshot.forEach(doc => {
          const likedBy = doc.data().likedBy || [];
          const dislikedBy = doc.data().dislikedBy || [];

          const currentLikes = doc.data().likes || 0;
          const currentDislikes = doc.data().dislikes || 0;
          const currentScore = doc.data().score || 0;

          const likes = likedBy ? likedBy.length : 0;
          const dislikes = dislikedBy ? dislikedBy.length : 0;

          const score = likes - dislikes;

          if (
            currentLikes !== likes ||
            currentDislikes !== dislikes ||
            currentScore !== score
          ) {
            quotesUpdatedCounter++;
            return database
              .collection('quotes')
              .doc(doc.id)
              .update({ likes, dislikes, score });
          }
        });
      })
      .then(() => {
        response.status(200).send(`Updated ${quotesUpdatedCounter} quotes.`);
      });
  }
);

/**
 * On Quote update, recalculate likers/dislikes and score if it changed
 */
exports.updateQuoteCounters = functions.firestore
  .document('quotes/{quoteId}')
  .onUpdate(change => {
    const previousValue = change.before.data();
    const newValue = change.after.data();

    const likedByBefore = previousValue.likedBy || [];
    const dislikedByBefore = previousValue.dislikedBy || [];

    const likedByAfter = newValue.likedBy || [];
    const dislikedByAfter = newValue.dislikedBy || [];

    if (
      likedByBefore.length !== likedByAfter.length ||
      dislikedByBefore.length !== dislikedByAfter.length
    ) {
      let likes = likedByAfter.length;
      let dislikes = dislikedByAfter.length;
      let score = likes - dislikes;

      return change.after.ref.update({
        likes,
        dislikes,
        score,
      });
    }

    return null;
  });

/**
 * Everytime a quote is created or deleted
 * Update the global counter cache at stats/quotes.count
 */
exports.updateQuoteStats = functions.firestore
  .document('quotes/{quoteId}')
  .onWrite(change => {
    let increment;

    if (change.after.exists && !change.before.exists) {
      increment = 1;
    } else if (!change.after.exists && change.before.exists) {
      increment = -1;
    } else {
      return null;
    }

    const quotesStats = database.collection('stats').doc('quotes');

    return database
      .runTransaction(transaction => {
        return transaction.get(quotesStats).then(doc => {
          let count = (doc.exists && doc.data().count) || 0;
          count = count + increment;
          transaction.set(quotesStats, { count }, { merge: true });
        });
      })
      .then(() => {
        return console.log('Counter updated.');
      });
  });

/**
 * Recaclculate quotes counter cache from scratch
 */
exports.recountQuotes = functions.https.onRequest((request, response) => {
  let count;

  return database
    .collection('quotes')
    .get()
    .then(querySnapshot => {
      count = querySnapshot.size;
      return database
        .collection('stats')
        .doc('quotes')
        .set({ count }, { merge: true });
    })
    .then(() => {
      response.status(200).send(`Updated quotes counter: ${count} quotes.`);
    });
});
