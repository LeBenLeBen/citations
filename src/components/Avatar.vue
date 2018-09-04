<template>
  <div class="avatar">
    <img :src="src" class="avatar__image" alt="" />
  </div>
</template>

<script>
export default {
  props: {
    src: {
      type: String,
      required: true,
    },
  },
};
</script>

<style lang="scss" scoped>
.avatar {
  display: inline-block;
  width: 56px;
  height: 56px;

  position: relative;

  vertical-align: middle;

  border-radius: 50%;

  &::before {
    content: '';
    display: block;
    width: 100%;
    height: 100%;

    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;

    border-radius: inherit;
    box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.15) inset;
  }
}

.avatar__image {
  width: 100%;
  height: auto;
  border-radius: inherit;
}
</style>
