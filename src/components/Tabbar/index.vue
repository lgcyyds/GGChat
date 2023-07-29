<template>
  <div class="tabbar">
    <ul class="tabbar-list">
      <li
        class="tabbar-item"
        v-for="(item, index) in tabbarList"
        :key="index"
        @click="changeTabbar(item.path)"
      >
        <!-- 选中样式 -->
        <template v-if="item.isChecked">
          <van-icon :name="item.tabbarIcon" size=".7467rem" />
        </template>
        <!-- 未选中样式 -->
        <template v-else>
          <van-icon :name="item.NoTabbarIcon" size=".7467rem" />
        </template>
        <span :class="item.isChecked ? 'isChecked' : ''">{{ item.title }}</span>
        <template v-if="item.title == '消息' && unReadNum !== 0">
          <div class="dots">{{ unReadNum }}</div>
        </template>
        <template v-if="item.title == '好友' && TotalApplyNum !== 0">
          <div class="dots">{{ TotalApplyNum }}</div>
        </template>
      </li>
    </ul>
  </div>
</template>

<script>
import { mapGetters, mapState } from "vuex";
export default {
  data() {
    return {
      tabbarList: [
        {
          tabbarIcon: "chat-o",
          NoTabbarIcon: "chat",
          title: "消息",
          path: "/message",
          isChecked: true,
        },
        {
          tabbarIcon: "friends-o",
          NoTabbarIcon: "friends",
          title: "好友",
          path: "/contacts",
          isChecked: true,
        },
        {
          tabbarIcon: "todo-list-o",
          NoTabbarIcon: "todo-list",
          title: "动态",
          path: "/space",
          isChecked: true,
        },
      ],
    };
  },
  methods: {
    // 点击跳转路由
    changeTabbar(path) {
      if (this.$route.path === path) {
        return;
      }
      this.$router.replace(path);
    },
    // 根据路由展示图标类型
    initTabbar() {
      this.tabbarList.forEach((item) => {
        if (this.$route.path !== item.path) {
          return;
        }
        this.$set(item, "isChecked", false);
      });
    },
  },
  mounted() {
    this.initTabbar();
  },
  computed: {
    ...mapGetters(["friendNum", "groupNum"]),
    ...mapState({ unReadNum: (state) => state.notice.unReadNum }),
    //群申请数加好友申请数
    TotalApplyNum() {
      return this.friendNum + this.groupNum;
    },
  },
};
</script>

<style lang="less" scoped>
.tabbar {
  position: fixed;
  left: 0;
  bottom: 0;
  width: 100%;
  height: 1.3333rem;
  background-color: #fff;
  border-top: 0.0267rem solid #cdc9c9;

  .tabbar-list {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: space-around;
    align-items: center;

    .tabbar-item {
      width: 0.7467rem;
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: space-around;
      align-items: center;
      position: relative;
      span {
        font-size: 0.3467rem;
      }
      .dots {
        width: 0.5rem;
        height: 0.5rem;
        position: absolute;
        display: flex;
        justify-content: center;
        align-items: center;
        background-color: #f06262;
        border-radius: 50%;
        color: #fff;
        top: 0;
        right: -0.2667rem;
      }
      .isChecked {
        color: #777777;
      }
    }
  }
}
</style>