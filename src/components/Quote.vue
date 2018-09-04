<template>
  <div :class="['quote', className]">
    <div class="quote__body">
      <ul class="list-stacked list-stacked--divided">
        <li v-for="(sentence, index) in quote.text" :key="index">{{ sentence }}</li>
      </ul>
    </div>
    <div class="quote__meta">
      <strong>{{ quote.author }}</strong>
      <span v-if="quote.interlocutor"> à <strong>{{ quote.interlocutor }}</strong></span>
      le <router-link :to="`/quote/${quote.id}`">{{ date }}</router-link>
      <button :class="['btn btn--bare like', { 'like--liked': liked }]" type="button" @click="toggleLike">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 18" class="like__icon">
          <path v-if="liked" d="M17.75,4.34a4.37,4.37,0,0,0-4.12-3.15,5,5,0,0,0-3.29,1.26A6.26,6.26,0,0,0,9,4.41a.14.14,0,0,1,0,.06l0-.08A6.19,6.19,0,0,0,7.66,2.45,5,5,0,0,0,4.37,1.19,4.37,4.37,0,0,0,.25,4.34c-1.06,3.33,1.31,7.42,6.33,11,.68.48,1.87,1.21,1.92,1.25l.5.27.5-.27c.05,0,1.24-.77,1.92-1.25C16.44,11.76,18.81,7.67,17.75,4.34Z"/>
          <path v-else d="M13.63,2.19A3.37,3.37,0,0,1,16.8,4.64c.92,2.89-1.31,6.57-6,9.83-.56.4-1.51,1-1.84,1.2-.31-.2-1.27-.8-1.84-1.2C2.51,11.21.28,7.53,1.2,4.64A3.37,3.37,0,0,1,4.37,2.19,4.06,4.06,0,0,1,7,3.2,5.12,5.12,0,0,1,8,4.73l.05.13A1,1,0,0,0,9,5.47H9a1,1,0,0,0,.91-.62l0-.06A5,5,0,0,1,11,3.2a4.06,4.06,0,0,1,2.63-1m0-1a5,5,0,0,0-3.29,1.26A6.26,6.26,0,0,0,9,4.41a.14.14,0,0,1,0,.06l0-.08A6.19,6.19,0,0,0,7.66,2.45,5,5,0,0,0,4.37,1.19,4.37,4.37,0,0,0,.25,4.34c-1.06,3.33,1.31,7.42,6.33,11,.68.48,1.87,1.21,1.92,1.25l.5.27.5-.27c.05,0,1.24-.77,1.92-1.25,5-3.53,7.39-7.62,6.33-10.95a4.37,4.37,0,0,0-4.12-3.15Z"/>
        </svg>
        {{ (quote.likedBy && quote.likedBy.length) || 0 }}
      </button>
    </div>
  </div>
</template>

<script>
import { format } from '@/helpers/date';
import { mapState } from 'vuex';

export default {
  props: {
    quote: Object,
    className: String,
  },

  computed: {
    ...mapState(['user']),

    date() {
      return format(new Date(this.quote.date));
    },

    liked() {
      return this.quote.likedBy && this.quote.likedBy.includes(this.user.uid);
    },
  },

  methods: {
    toggleLike() {
      this.$store.dispatch('toggleLike', this.quote.id);
    },
  },
};
</script>

<style lang="scss">
@for $i from 6 to 0 {
  $color: nth($quotes-colors, $i);
  .quote--color-#{$i},
  .quotes > li:nth-child(6n + #{$i}) {
    .quote__body {
      background-color: lighten($color, 15%);

      + .quote__meta::before {
        background-color: lighten($color, 15%);
      }
    }
  }
}

.quote {
  margin: $spacing-unit-small 0;
  max-width: 100%;
  display: inline-flex;
  flex-direction: column;
  align-items: center;
}

.quote__body {
  min-width: 100%;
  width: max-content;
  max-width: 100%;
  padding: $spacing-unit-default $spacing-unit-large;

  position: relative;
  z-index: 2;

  color: rgba(0, 0, 0, 0.8);
  font-size: 20px;

  background-color: $alt-color-lighter;
  border-radius: 40px;
  transition: background-color 0.3s ease-out;
}

.quote__meta {
  padding: $spacing-unit-tiny 90px 0;

  position: relative;
  z-index: 1;

  font-size: rem(16px);
  color: $alt-color;

  &::before,
  &::after {
    content: '';
    display: block;
    width: 44px;
    height: 44px;

    position: absolute;
    top: -25px;
    left: 46px;

    border-radius: 50%;
  }

  &::before {
    background-color: $alt-color-lighter;
    transition: background-color 0.3s ease-out;
  }

  &::after {
    margin-left: 22px;
    margin-bottom: -4px;

    z-index: 1;

    background-image: linear-gradient(
      to right,
      $background-color 50%,
      rgba(255, 255, 255, 0) 50%
    );
  }
}

.like {
  color: $alt-color;
  vertical-align: 0;
}

.like--liked {
  color: #ef82b6;
}

.like__icon {
  width: 18px;
  height: 18px;
  margin-left: 10px;
  margin-right: 2px;

  fill: currentColor;

  vertical-align: -3px;
}
</style>
