import { database } from '@/services/firebase';

const scope = 'quotes';

export function create(
  { quote, author, interlocutor, date },
  options = { triggerSlackWebhook: true }
) {
  const text = typeof quote === 'string' ? quote.split('\n') : quote;
  const timestamp = new Date(date).getTime();

  return database
    .collection(scope)
    .add({
      text,
      author,
      interlocutor,
      date: timestamp,
    })
    .then(doc => {
      if (options.triggerSlackWebhook) {
        triggerSlackWebhook({
          quote,
          author,
          interlocutor,
          quoteId: doc.id,
        });
      }
      return doc;
    });
}

export function toggleLike({ quoteId, userId }) {
  return database
    .collection(scope)
    .doc(quoteId)
    .get()
    .then(querySnapshot => {
      const likers =
        (querySnapshot.data() && querySnapshot.data().likedBy) || [];
      let likes = querySnapshot.data().likes || likers.length;
      const index = likers.indexOf(userId);

      if (likers && index > -1) {
        likers.splice(index, 1);
        likes--;
      } else {
        likers.push(userId);
        likes++;
      }

      return database
        .collection(scope)
        .doc(quoteId)
        .set({ likedBy: likers, likes }, { merge: true });
    });
}

export function triggerSlackWebhook({ quote, author, interlocutor, quoteId }) {
  if (!process.env.VUE_APP_SLACK_WEBHOOK_URL) return;

  const text = `${quote}\n— *${author}*${
    interlocutor ? ` à *${interlocutor}*` : ''
  }`;
  const url = `${window.location.origin}/quote/${quoteId}`;
  const colors = [
    '#a3d774',
    '#70add0',
    '#9070d0',
    '#d97593',
    '#e5ad7b',
    '#e5d77b',
  ];
  const color = colors[Math.floor(Math.random() * colors.length)];

  fetch(process.env.VUE_APP_SLACK_WEBHOOK_URL, {
    method: 'POST',
    body: JSON.stringify({
      text: 'Nouvelle quote publiée',
      attachments: [
        {
          text,
          color,
          actions: [
            {
              type: 'button',
              text: 'View',
              url,
            },
          ],
        },
      ],
    }),
  });
}
