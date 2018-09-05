<template>
  <div class="container">
    <form ref="form" @submit.prevent="save">
      <div class="grid grid--right">
        <div class="grid__item sm-w-3/4">
          <h1>Nouvelle entrée</h1>
        </div>
      </div>
      <div class="form-group">
        <div class="grid">
          <div class="grid__item sm-w-1/4">
            <label for="author" class="field-label sm-text-right">Auteur</label>
          </div>
          <div class="grid__item w-3/4 sm-w-2/5">
            <input v-if="newUserMode" ref="author" type="text" v-model="author" id="author" class="field" required>
            <select v-else ref="author" v-model="author" id="author" class="field" required>
              <option value="" selected></option>
              <option v-for="(author, i) in authors" :key="i">{{ author.name }}</option>
            </select>
          </div>
          <div class="grid__item w-1/4 sm-w-1/5">
            <button type="button"
              class="btn btn--default btn--text-icon"
              @click="toggleUserMode"
              :title="newUserMode ? 'Utiliser un auteur existant' : 'Ajouter un auteur'">
              <minus-icon v-if="newUserMode" class="icon" />
              <plus-icon v-else class="icon" />
            </button>
          </div>
        </div>
      </div>
      <div class="form-group">
        <div class="grid">
          <div class="grid__item sm-w-1/4">
            <label for="interlocutor" class="field-label sm-text-right">Interlocuteur</label>
          </div>
          <div class="grid__item sm-w-2/5">
            <input v-model="interlocutor" type="text" id="interlocutor" class="field">
          </div>
        </div>
      </div>
      <div class="form-group">
        <div class="grid">
          <div class="grid__item sm-w-1/4">
            <label for="date" class="field-label sm-text-right">Date</label>
          </div>
          <div class="grid__item sm-w-2/5">
            <input v-model="date" type="date" id="date" class="field" required>
          </div>
        </div>
      </div>
      <div class="form-group">
        <div class="grid">
          <div class="grid__item sm-w-1/4">
            <label for="quote" class="field-label sm-text-right">Poésie</label>
          </div>
          <div class="grid__item sm-w-3/4">
            <textarea v-model="quote" id="quote" rows="3" class="field" required></textarea>
          </div>
        </div>
      </div>
      <div class="form-group">
        <div class="grid grid--right">
          <div class="grid__item sm-w-3/4">
            <button type="submit" class="btn btn--primary">Inscrire dans les annales</button>
          </div>
        </div>
      </div>
    </form>
  </div>
</template>

<script>
import { database } from '@/services/firebase';
import { format } from '@/helpers/date';
import QuotesController from '@/controllers/QuotesController';
import AuthorsController from '@/controllers/AuthorsController';
import minusIcon from '@/assets/icons/minus.svg';
import plusIcon from '@/assets/icons/plus.svg';

export default {
  components: {
    'minus-icon': minusIcon,
    'plus-icon': plusIcon,
  },

  data() {
    return {
      authors: [],
      quote: '',
      author: null,
      interlocutor: '',
      date: format(new Date(), 'YYYY-MM-DD'),
      newUserMode: false,
    };
  },

  firestore: {
    authors: database.collection('authors').orderBy('name'),
  },

  mounted() {
    this.$refs.form[0] && this.$refs.form[0].focus();
  },

  methods: {
    toggleUserMode() {
      this.newUserMode = !this.newUserMode;
      this.$nextTick(() => {
        this.$refs.author && this.$refs.author.focus();
      });
    },

    save() {
      let { quote, author, interlocutor, date } = this;
      QuotesController.create({ quote, author, interlocutor, date }).then(
        () => {
          this.$store.dispatch('loadQuotes', true);
          this.$router.push({ name: 'home' });
          this.$notify({
            type: 'success',
            title: 'Citation enregistrée',
            text: 'Merci pour cette valeureuse contribution',
          });
        },
        error => {
          this.$notify({
            type: 'error',
            title: 'Impossible de sauver la citation',
            text: error.message,
          });
        },
      );
      AuthorsController.createIfNotExists({
        name: author,
      });
    },
  },
};
</script>
