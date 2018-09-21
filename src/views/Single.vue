<template>
  <div class="container text-center">
    <Quote v-if="quote" :quote="quote" :className="className" />
    <Loader v-else />
  </div>
</template>

<script>
import Quote from '@/components/Quote';
import Loader from '@/components/Loader';

export default {
  components: {
    Quote,
    Loader,
  },

  props: {
    id: String,
  },

  computed: {
    quote() {
      return this.$store.state.quotes[this.id];
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
