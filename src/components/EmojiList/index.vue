<template>
  <div>
    <ul>
      <li
        v-for="(item, index) in emojiList"
        :key="index"
        @click="handleEmoji(item)"
      >
        <div class="emoji-item">{{ item }}</div>
      </li>
    </ul>
  </div>
</template>

<script>
import emoji from "./emoji";
export default {
  data() {
    return {
      emojiList: emoji,
    };
  },
  methods: {
    handleEmoji(emoji) {
      this.$emit("emoji", emoji);
    },
  },
};
</script>

<style lang="less" scoped>
ul {
  width: 100%;
  padding: 0.4rem 0 0;
  display: flex;
  flex-wrap: wrap;
  box-sizing: border-box;
  li {
    width: 14.28%;
    display: flex;
    // justify-content: center;
    align-items: center;
  }
}
.emoji-item {
  width: 0.7333rem;
  height: 0.7333rem;
  margin-bottom: 0.4rem;
  font-size: 0.6667rem;
}
</style>