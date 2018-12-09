import Vue from 'vue';
import Vuex from 'vuex';

import { database } from '@/services/firebase';
import { toggleFeeling } from '@/controllers/QuotesController';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    quotes: {
      entities: {},
      count: null,
    },
    quotesFiltered: [],
    lastQuote: null,
    complete: false,
    user: {},
    author: '',
    order: 'date',
  },

  mutations: {
    resetList(state) {
      state.quotesFiltered = [];
      state.lastQuote = null;
      state.complete = false;
    },

    setUser(state, user) {
      state.user = user;
    },

    setAuthor(state, author) {
      state.author = author;
    },

    setOrder(state, order) {
      state.order = order;
    },

    addQuote(state, quote) {
      Vue.set(state.quotes.entities, quote.id, quote);
    },

    addQuoteToList(state, quoteId) {
      state.quotesFiltered.push(quoteId);
    },

    setLastQuote(state, quote) {
      state.lastQuote = quote;
    },

    setIsComplete(state) {
      state.complete = true;
    },

    toggleFeeling(state, { quoteId, userId, feelingCounter, feelingList }) {
      const quote = state.quotes.entities[quoteId];
      let list = [...(quote[feelingList] || [])];
      let counter = quote[feelingCounter] || list.length;
      const likedIndex = list.indexOf(userId);

      if (likedIndex > -1) {
        list.splice(likedIndex, 1);
        counter--;
      } else {
        list.push(userId);
        counter++;
      }

      Vue.set(quote, feelingList, list);
      quote[feelingCounter] = counter;
    },

    setQuotesCount(state, { count }) {
      state.quotes.count = count;
    },
  },

  actions: {
    loadQuotes({ state, commit }, reset = false) {
      let ref = database.collection('quotes');
      if (state.author) ref = ref.where('author', '==', state.author);
      ref = ref.orderBy(state.order, 'desc');
      if (!reset && state.lastQuote) ref = ref.startAfter(state.lastQuote);
      ref = ref.limit(20);

      return ref.get().then(
        querySnapshot => {
          if (reset) {
            commit('resetList');
          }

          querySnapshot.forEach(doc => {
            const quoteId = doc.id;
            const quote = { id: quoteId, ...doc.data() };
            commit('addQuote', quote);
            commit('addQuoteToList', quoteId);
          });

          if (querySnapshot.docs.length) {
            commit(
              'setLastQuote',
              querySnapshot.docs[querySnapshot.docs.length - 1]
            );
          } else {
            commit('setIsComplete');
          }
        },
        error => {
          Vue.notify({
            type: 'error',
            title: 'Impossible de charger les citations',
            text: error.message,
          });
        }
      );
    },

    loadQuotesCounter({ commit }) {
      return database
        .collection('stats')
        .doc('quotes')
        .get()
        .then(doc => {
          if (doc.exists) {
            const count = doc.data().count;
            commit('setQuotesCount', { count });
          }
        });
    },

    loadQuote({ commit }, id) {
      return database
        .collection('quotes')
        .doc(id)
        .get()
        .then(doc => {
          if (doc.exists) {
            const quote = { id: doc.id, ...doc.data() };
            commit('addQuote', quote);
          }
        });
    },

    setAuthor({ commit, dispatch }, author) {
      commit('setAuthor', author);
      dispatch('loadQuotes', true);
    },

    setOrder({ commit, dispatch }, order) {
      commit('setOrder', order);
      dispatch('loadQuotes', true);
    },

    toggleFeeling({ commit, dispatch, state }, { feeling, quoteId }) {
      const userId = state.user.uid;
      const quote = state.quotes.entities[quoteId];
      let feelingCounter;
      let feelingList;

      switch (feeling) {
        case 'like':
          // If user previously disliked, undo it
          if ((quote.dislikedBy || []).includes(userId)) {
            dispatch('toggleFeeling', { feeling: 'dislike', quoteId });
          }
          feelingCounter = 'likes';
          feelingList = 'likedBy';
          break;
        case 'dislike':
          // If user previously liked it, undo it
          if ((quote.likedBy || []).includes(userId)) {
            dispatch('toggleFeeling', { feeling: 'like', quoteId });
          }
          feelingCounter = 'dislikes';
          feelingList = 'dislikedBy';
          break;
      }

      // Instantly update the UI
      commit('toggleFeeling', {
        quoteId,
        userId,
        feelingCounter,
        feelingList,
      });

      return toggleFeeling({ userId, quoteId, feelingList }).then(
        () => {},
        error => {
          // Revert in case of error
          commit('toggleFeeling', {
            quoteId,
            userId,
            feelingCounter,
            feelingList,
          });
          Vue.notify({
            type: 'error',
            title:
              'Impossible de sauvegarder votre sentiment à propos de cette citation',
            text: error.message,
          });
        }
      );
    },
  },

  getters: {
    quotesFiltered(state) {
      return state.quotesFiltered.map(id => state.quotes.entities[id]);
    },
  },
});
