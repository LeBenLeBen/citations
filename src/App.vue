<template>
  <div id="app" class="master">
    <header class="topbar" v-if="hasUser">
      <h1 class="app-title app-title--shrinked">
        <router-link to="/">Quotes</router-link>
      </h1>

      <ul class="list-inline list-inline--small list-inline--right">
        <li class="hidden-xs-down">{{ name }}</li>
        <li class="hidden-xs-down"><Avatar :src="user.photoURL" /></li>
        <li>
          <button
            type="button"
            class="btn btn--circle btn--default"
            @click="logout"
            title="Se déconnecter"
          >
            <leave-icon class="icon" />
          </button>
        </li>
      </ul>
    </header>

    <main class="main pdgt pdgb+">
      <transition name="fade" mode="out-in" v-if="initialized">
        <router-view v-if="hasUser" />
        <div v-else>
          <h1 class="app-title">Quotes</h1>
          <Login />
        </div>
      </transition>
    </main>

    <notifications position="top center" :duration="5000" />
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex';
import { auth } from '@/services/firebase';
import Login from '@/components/Login';
import Avatar from '@/components/Avatar';
import leaveIcon from '@/assets/icons/leave.svg';

export default {
  components: {
    Login,
    Avatar,
    'leave-icon': leaveIcon,
  },

  data() {
    return {
      initialized: false,
    };
  },

  mounted() {
    auth.onAuthStateChanged(user => {
      this.initialized = true;

      if (!user) {
        this.setUser({});
        return;
      }

      const { uid, displayName, email, photoURL } = user;
      this.setUser({
        uid,
        displayName,
        email,
        photoURL,
      });
    });
  },

  computed: {
    ...mapState(['user']),

    hasUser() {
      return Object.keys(this.user).length > 0;
    },

    name() {
      return (this.user && this.user.displayName.split(' ')[0]) || '';
    },
  },

  methods: {
    ...mapMutations(['setUser']),

    logout() {
      auth.signOut().catch(function(error) {
        this.$notify({
          type: 'error',
          title: 'Impossible de se déconnecter',
          text: error.message,
        });
      });
    },
  },
};
</script>

<style lang="scss">
.topbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: $spacing-unit-small;

  position: sticky;
  top: 0;
  z-index: 3;

  background-image: linear-gradient(
    to bottom,
    $background-color,
    rgba($background-color, 0)
  );
}

.app-title {
  font-size: calc(50px + (100 - 50) * (100vw - 320px) / (1200 - 320));
  line-height: 1;
  text-align: center;

  &::before,
  &::after {
    color: $alt-color;
  }

  &::before {
    content: open-quote;
  }
  &::after {
    content: close-quote;
  }

  a {
    text-decoration: none;

    &:hover {
      opacity: 0.8;
    }
  }

  @media (min-width: 1200px) {
    font-size: 100px;
  }
}

.app-title--shrinked {
  font-size: 30px;
  margin-bottom: 0;
}

.notifications {
  margin-top: 5px;
}

.vue-notification {
  padding: $spacing-unit-small;

  font-size: rem(16px);

  border-radius: 5px;
}
</style>
