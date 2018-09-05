<template>
  <div class="home">
    <transition-group name="fade" mode="out-in" tag="div" class="container">
      <!--<strong>{{ quotes.length }} témoignage{{ quotes.length > 1 ? 's' : '' }}</strong>-->
      <transition-group name="list" tag="ul" class="quotes relative-parent list-stacked list-stacked--tight" key="list">
        <li v-for="quote in quotes" :key="quote.id" class="list-item">
          <Quote :quote="quote" />
        </li>
      </transition-group>
      <Loader v-if="loading" key="loader" />
    </transition-group>
    <div class="actions">
      <ul class="list-stacked list-stacked--small">
        <li>
          <div class="relative-parent">
            <button class="btn btn--default btn--circle" @click.prevent="filtersOpen = !filtersOpen">
              🔍
              <span v-if="filtersCount" class="btn__badge">{{ filtersCount }}</span>
            </button>
            <Popover :open="this.filtersOpen">
              <div class="form-group">
                <label for="author" class="field-label pdgt0">Filtrer par poète</label>
                <select v-model="author" id="author" class="field">
                  <option value="" selected></option>
                  <option v-for="(author, i) in authors" :key="i">{{ author.name }}</option>
                </select>
              </div>
              <div class="form-group">
                <label for="order" class="field-label">Ordrer par</label>
                <select v-model="order" id="order" class="field">
                  <option value="date">Date</option>
                  <option value="likedBy">Popularité</option>
                </select>
              </div>
              <div class="form-group">
                <button class="btn btn--primary btn--block" @click="resetFilters">Réinitialiser</button>
              </div>
            </Popover>
          </div>
        </li>
       <li>
          <router-link to="/add" class="btn btn--primary btn--circle">✏️</router-link>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import { database } from '@/services/firebase';
import Quote from '@/components/Quote';
import Popover from '@/components/Popover';
import Loader from '@/components/Loader';

export default {
  name: 'home',

  components: {
    Quote,
    Popover,
    Loader,
  },

  data() {
    return {
      filtersOpen: false,
      loading: false,
    };
  },

  firestore: {
    authors: database.collection('authors').orderBy('name'),
  },

  computed: {
    ...mapState(['quotes', 'complete']),

    author: {
      get() {
        return this.$store.state.author;
      },
      set(value) {
        this.scrollTop();
        this.$store.dispatch('setAuthor', value);
      },
    },

    order: {
      get() {
        return this.$store.state.order;
      },
      set(value) {
        this.scrollTop();
        this.$store.dispatch('setOrder', value);
      },
    },

    filtersCount() {
      let count = 0;
      this.author && count++;
      this.order !== 'date' && count++;
      return count;
    },
  },

  created() {
    if (!this.$store.state.quotes.length) {
      this.load();
    }
  },

  mounted() {
    window.addEventListener('scroll', this.handleScroll);
  },

  beforeDestroy() {
    window.removeEventListener('scroll', this.handleScroll);
  },

  methods: {
    load() {
      if (this.loading || this.complete) {
        return;
      }

      this.loading = true;
      this.$store.dispatch('loadQuotes').then(() => {
        this.loading = false;
      });
    },

    scrollTop() {
      const scrollDuration = 500;
      const cosParameter = window.scrollY / 2;
      let scrollCount = 0;
      let oldTimestamp = performance.now();

      function step(newTimestamp) {
        scrollCount +=
          Math.PI / (scrollDuration / (newTimestamp - oldTimestamp));
        if (scrollCount >= Math.PI) window.scrollTo(0, 0);
        if (window.scrollY === 0) return;
        window.scrollTo(
          0,
          Math.round(cosParameter + cosParameter * Math.cos(scrollCount)),
        );
        oldTimestamp = newTimestamp;
        window.requestAnimationFrame(step);
      }
      window.requestAnimationFrame(step);
    },

    handleScroll() {
      const top = document.scrollingElement.scrollTop;
      const scrollHeight = document.scrollingElement.scrollHeight;
      const height = window.innerHeight;

      if (top >= scrollHeight - height * 1.5) {
        this.load();
      }
    },

    resetFilters() {
      this.author = '';
      this.order = 'date';
      this.filtersOpen = false;
    },
  },
};
</script>

<style lang="scss">
.quotes {
  text-align: center;
}

.actions {
  position: fixed;
  right: $spacing-unit-small;
  bottom: $spacing-unit-small;
  z-index: 2;

  @include media('md') {
    right: $spacing-unit-default;
    bottom: $spacing-unit-default;
  }
}

.add-btn {
  font-size: rem(64px);
  line-height: 0;
}
</style>
