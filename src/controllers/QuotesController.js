import { database } from '@/services/firebase';

export default class QuotesController {
  static scope = 'quotes';

  static create(
    { quote, author, interlocutor, date },
    options = { triggerSlackWebhook: true },
  ) {
    const text = typeof quote === 'string' ? quote.split('\n') : quote;
    const timestamp = new Date(date).getTime();

    return database
      .collection(this.scope)
      .add({
        text,
        author,
        interlocutor,
        date: timestamp,
      })
      .then(doc => {
        if (options.triggerSlackWebhook) {
          this.triggerSlackWebhook({
            text,
            author,
            interlocutor,
            quoteId: doc.id,
          });
        }
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

  static triggerSlackWebhook({ text, author, interlocutor, quoteId }) {
    if (!process.env.VUE_APP_SLACK_WEBHOOK_URL) return;

    text += `\n— *${author}*${interlocutor ? ` à *${interlocutor}*` : ''}`;
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
}
