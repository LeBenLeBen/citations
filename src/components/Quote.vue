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
      le&nbsp;<router-link :to="`/quote/${quote.id}`" class="text-nowrap">{{ date }}</router-link>
      <button :class="['btn btn--bare like', { 'like--liked': liked }]"
        type="button"
        @click="toggleLike"
        :title="liked ? 'Je n’aime plus' : 'J’aime'">
        <heart-alt-icon v-if="liked" class="like__icon icon" />
        <heart-icon v-else class="like__icon icon" />
        {{ (quote.likedBy && quote.likedBy.length) || 0 }}
      </button>
    </div>
  </div>
</template>

<script>
import { format } from '@/helpers/date';
import { mapState } from 'vuex';
import heartAltIcon from '@/assets/icons/heart-alt.svg';
import heartIcon from '@/assets/icons/heart.svg';

export default {
  components: {
    'heart-alt-icon': heartAltIcon,
    'heart-icon': heartIcon,
  },

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

  .list-item:first-child & {
    margin-top: 0;
  }

  .list-item:last-child & {
    margin-bottom: 0;
  }
}

.quote__body {
  min-width: 100%;
  width: max-content;
  max-width: 100%;
  padding: $spacing-unit-small $spacing-unit-default;

  position: relative;
  z-index: 2;

  color: rgba(0, 0, 0, 0.8);

  background-color: $alt-color-lighter;
  border-radius: 20px;
  transition: background-color 0.3s ease-out;

  @include media('sm') {
    padding: $spacing-unit-default $spacing-unit-large;

    border-radius: 40px;
  }
}

.quote__meta {
  padding: $spacing-unit-tiny 70px 0;

  position: relative;
  z-index: 1;

  font-size: rem(16px);
  color: $alt-color;

  @include media('sm') {
    padding-left: 90px;
    padding-right: 90px;
  }

  &::before,
  &::after {
    content: '';
    display: block;
    width: 44px;
    height: 44px;

    position: absolute;
    top: -25px;
    left: 30px;

    border-radius: 50%;

    @include media('sm') {
      left: 46px;
    }
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
  margin-left: 14px;
  margin-right: 2px;

  fill: currentColor;

  vertical-align: -3px;
}
</style>
