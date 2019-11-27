<template>
  <div class="text-center">
    <Loader v-if="loading" />
    <button
      v-else
      type="button"
      class="btn btn--primary btn--large"
      @click="login"
    >
      Connexion avec Google
    </button>
  </div>
</template>

<script>
import { auth } from '@/services/firebase';
import { auth as fireauth } from 'firebase/app';
import Loader from '@/components/Loader';

export default {
  components: {
    Loader,
  },

  data() {
    return {
      loading: false,
    };
  },

  methods: {
    login() {
      this.loading = true;

      const provider = new fireauth.GoogleAuthProvider();

      provider.setCustomParameters({
        hd: 'liip.ch',
      });

      auth.signInWithPopup(provider).catch(error => {
        this.loading = false;
        this.$notify({
          type: 'error',
          title: 'Impossible de se connecter',
          text: error.message,
        });
      });
    },
  },
};
</script>
