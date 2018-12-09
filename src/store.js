import Vue from 'vue';
import Vuex from 'vuex';
import _ from 'lodash';

import { database } from '@/services/firebase';
import { toggleLike } from '@/controllers/QuotesController';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    quotes: {},
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
      Vue.set(state.quotes, quote.id, quote);
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

    toggleLike(state, { quoteId, userId }) {
      const quote = _.find(state.quotes, quote => quote.id === quoteId);
      let likedBy = [...(quote.likedBy || [])];
      let likes = quote.likes || likedBy.length;
      const likedIndex = likedBy.indexOf(userId);

      if (likedIndex > -1) {
        likedBy.splice(likedIndex, 1);
        likes--;
      } else {
        likedBy.push(userId);
        likes++;
      }

      Vue.set(quote, 'likedBy', likedBy);
      quote.likes = likes;
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

    toggleLike({ commit, state }, quoteId) {
      const userId = state.user.uid;

      // Instantly update the UI
      commit('toggleLike', {
        quoteId,
        userId,
      });

      return toggleLike({ userId, quoteId }).then(
        () => {},
        error => {
          // Revert in case of error
          commit('toggleLike', {
            quoteId,
            userId,
          });
          Vue.notify({
            type: 'error',
            title: 'Impossible d’aimer cette citation',
            text: error.message,
          });
        },
      );
    },
  },

  getters: {
    quotesFiltered(state) {
      return state.quotesFiltered.map(id => state.quotes[id]);
    },
  },
});
