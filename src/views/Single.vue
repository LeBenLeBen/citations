<template>
  <div class="container text-center">
    <Quote v-if="quote" :quote="quote" :className="className" />
    <Loader v-else />
  </div>
</template>

<script>
import { database } from '@/services/firebase';
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

  data() {
    return {
      quote: null,
    };
  },

  computed: {
    className() {
      return `quote--color-${Math.floor(Math.random() * 5 + 1)}`;
    },
  },

  firestore() {
    return {
      quote: database.collection('quotes').doc(this.id),
    };
  },
};
</script>
