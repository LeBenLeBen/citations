<template>
  <div class="loader">
    <div class="loader__bubble">
      <span></span>
      <span></span>
      <span></span>
    </div>
  </div>
</template>

<style lang="scss">
$ti-color-bg: $alt-color-lighter;

.loader {
  display: flex;
  width: max-content;
  margin: $spacing-unit-default auto;

  position: relative;

  &::before,
  &::after {
    content: '';
    display: block;
    width: 30px;
    height: 30px;

    position: absolute;
    bottom: -10px;
    left: 28px;
    z-index: 1;

    border-radius: 50%;
  }

  &::before {
    background-color: $ti-color-bg;
  }

  &::after {
    margin-left: 16px;
    margin-bottom: -4px;

    background-color: $background-color;
  }
}

.loader__bubble {
  padding: 16px;
  display: inline-flex;

  position: relative;
  z-index: 2;

  background-color: $ti-color-bg;
  border-radius: 50px;

  span {
    display: block;
    height: 12px;
    width: 12px;

    background-color: $alt-color;
    border-radius: 50%;
    opacity: 0.4;

    + span {
      margin-left: 6px;
    }

    @for $i from 1 through 3 {
      &:nth-of-type(#{$i}) {
        animation: 1s blink infinite ($i * 0.3333s);
      }
    }
  }
}

@keyframes blink {
  50% {
    opacity: 1;
  }
}
</style>
