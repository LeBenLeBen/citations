import Vue from 'vue';
import Vuex from 'vuex';
import _ from 'lodash';

import { database } from '@/services/firebase';
import QuotesController from '@/controllers/QuotesController';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    quotes: [],
    lastQuote: null,
    complete: false,
    user: {},
    author: '',
    order: 'date',
  },

  mutations: {
    setUser(state, user) {
      state.user = user;
    },

    setAuthor(state, author) {
      state.author = author;
    },

    setOrder(state, order) {
      state.order = order;
    },

    toggleLike(state, { quoteId, userId }) {
      const quote = _.find(state.quotes, quote => quote.id === quoteId);
      let likedBy = [...(quote.likedBy || [])];
      const likedIndex = likedBy.indexOf(userId);

      if (likedIndex > -1) {
        likedBy = likedBy.slice(likedIndex, likedIndex);
      } else {
        likedBy.push(userId);
      }

      Vue.set(quote, 'likedBy', likedBy);
    },
  },

  actions: {
    loadQuotes({ state }, reset = false) {
      let ref = database.collection('quotes');
      if (state.author) ref = ref.where('author', '==', state.author);
      ref = ref.orderBy(state.order, 'desc');
      if (!reset && state.lastQuote) ref = ref.startAfter(state.lastQuote);
      ref = ref.limit(20);

      return ref.get().then(
        querySnapshot => {
          if (reset) {
            state.quotes = [];
            state.lastQuote = null;
            state.complete = false;
          }

          querySnapshot.forEach(doc => {
            state.quotes.push({
              id: doc.id,
              ...doc.data(),
            });
          });

          if (querySnapshot.docs.length) {
            state.lastQuote = querySnapshot.docs[querySnapshot.docs.length - 1];
          } else {
            state.complete = true;
          }
        },
        error => {
          Vue.notify({
            type: 'error',
            title: 'Impossible d’accéder aux citations',
            text: error.message,
          });
        },
      );
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

      return QuotesController.toggleLike({ userId, quoteId }).then(
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
});
