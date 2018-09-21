const functions = require('firebase-functions');

const admin = require('firebase-admin');
admin.initializeApp();

const database = admin.firestore();

database.settings({ timestampsInSnapshots: true });

exports.setLikeCounters = functions.https.onRequest((request, response) => {
  return database
    .collection('quotes')
    .get()
    .then(querySnapshot => {
      return querySnapshot.forEach(doc => {
        const likedBy = doc.data().likedBy;
        const likes = likedBy ? likedBy.length : 0;

        if (likedBy && likes > 0) {
          return database
            .collection('quotes')
            .doc(doc.id)
            .update({ likes });
        }
      });
    });
});
