<template>
  <transition name="pop">
    <div class="popover" v-if="open">
      <slot />
    </div>
  </transition>
</template>

<script>
export default {
  props: {
    open: Boolean,
  },
};
</script>

<style lang="scss">
.popover {
  width: max-content;
  max-width: 65vw;
  padding: $spacing-unit-small;

  position: absolute;
  bottom: 100%;
  right: 100%;

  background-color: $alt-color-lighter;
  border-radius: 20px;
  transform-origin: bottom right;

  @include media('sm') {
    padding: $spacing-unit-default;
  }
}

.pop-enter-active {
  transform: scale(1);
  transition: transform 0.3s cubic-bezier(0.27, 1.28, 0.92, 1.05);
}

.pop-leave-active {
  transform: scale(1);
  transition: transform 0.2s cubic-bezier(0, 1, 0.72, 1);
}

.pop-enter,
.pop-leave-to {
  transform: scale(0);
}
</style>
