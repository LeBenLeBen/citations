<template>
  <div>
    <div class="container text-center">
      <Quote v-if="quote" :quote="quote" :className="className" />
      <Loader v-else />
    </div>

    <div class="actions actions--left">
      <router-link
        to="/"
        class="btn btn--default btn--circle"
        title="Retour à l’accueil"
      >
        <home-icon class="icon" />
      </router-link>
    </div>
  </div>
</template>

<script>
import Quote from '@/components/Quote';
import Loader from '@/components/Loader';
import homeIcon from '@/assets/icons/home.svg';

export default {
  components: {
    Quote,
    Loader,
    homeIcon,
  },

  props: {
    id: String,
  },

  computed: {
    quote() {
      return this.$store.state.quotes.entities[this.id];
    },

    className() {
      return `quote--color-${Math.floor(Math.random() * 5 + 1)}`;
    },
  },

  created() {
    if (!this.quote) {
      this.$store.dispatch('loadQuote', this.id);
    }
  },
};
</script>
