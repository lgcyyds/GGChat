<template>
  <div>
    <NavTop class="top">
      <div class="navtop-title">动态</div>
    </NavTop>
    <main ref="main">
      <!-- 下拉刷新 -->
      <van-pull-refresh
        v-model="isLoading"
        @refresh="onRefresh"
        success-text="刷新成功"
      >
        <SpaceList :SpaceList="spaceList" ref="spaceList"></SpaceList>
      </van-pull-refresh>
    </main>
    <!-- 回到顶部按钮 -->
    <div class="back-top" v-show="showBtn" @click="handleBackTop">
      <van-icon name="arrow-up" size=".6667rem" />
    </div>
    <!-- 发布新动态按钮 -->
    <div class="bar" @click="showPublishSpace = true">
      <van-icon name="plus" size=".6667rem" />
    </div>
    <!-- 发布动态弹出框 -->
    <van-popup v-model="showPublishSpace" position="bottom" style="height: 90%">
      <PublishSpace
        @changeShowSpace="showPublishSpace = $event"
        @refreshList="getSpaceList"
      ></PublishSpace>
    </van-popup>

    <Tabbar></Tabbar>
  </div>
</template>

<script>
import NavTop from "@/components/NavTop/index.vue";
import Tabbar from "@/components/Tabbar/index.vue";
import SpaceList from "@/components/SpaceList/index.vue";
import PublishSpace from "@/components/PublishSpace/index.vue";
export default {
  components: {
    NavTop,
    Tabbar,
    SpaceList,
    PublishSpace,
  },
  data() {
    return {
      isLoading: false, //下拉刷新
      showPublishSpace: false, //发布动态弹出框
      showBtn: false, //回到顶部按钮
      scrollTop: 0, //页面滚动距离
      spaceList: [], //动态列表
    };
  },
  methods: {
    //下拉刷新
    onRefresh() {
      setTimeout(() => {
        this.getSpaceList();
        this.isLoading = false;
      }, 1000);
    },
    // 回到顶部按钮
    showBackTopBtn() {
      let scrollTop = this.$refs.main.scrollTop;
      this.scrollTop = scrollTop;
      if (scrollTop > 500) {
        this.showBtn = true;
      } else {
        this.showBtn = false;
      }
    },
    // 回到顶部按钮时间回调
    handleBackTop() {
      this.timer = setInterval(() => {
        let prevSolution = this.scrollTop;
        let speed = Math.floor(-prevSolution / 2);
        this.$refs.main.scrollTop = prevSolution + speed;
        if (prevSolution === 0) {
          clearInterval(this.timer);
        }
      }, 30);
    },
    //获取动态列表（我和所有人的列表）
    async getSpaceList() {
      const userId = this.$store.state.user.userInfo._id;
      try {
        const result = await this.$API.reqGetSpaceList({ userId });
        if (result.status == 200) {
          this.spaceList = result.data;
        }
      } catch (error) {}
    },
  },
  mounted() {
    this.getSpaceList();
  },
  beforeDestroy() {
    window.removeEventListener("scroll", this.showBackTopBtn, true);
    window.removeEventListener(
      "scroll",
      this.$refs.spaceList.imgLazyLoading,
      true
    );
  },
  watch: {
    // 只要列表变化就开始滑动监听，而组件挂载时需要给列表赋值，
    // 如果列表没有东西也不需要滑动监听
    spaceList() {
      //第三个参数表示捕获阶段产生
      window.addEventListener("scroll", this.showBackTopBtn, true);
      window.addEventListener(
        "scroll",
        this.$refs.spaceList.imgLazyLoading,
        true
      ); //图片懒加载
      this.$nextTick(() => {
        this.$refs.spaceList.noLazyLoading();
      });
    },
  },
};
</script>

<style lang="less" scoped>
.top {
  position: fixed;
  top: 0;
  left: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;

  .navtop-title {
    font-size: 0.5333rem;
    color: aliceblue;
  }
}

main {
  width: 100%;
  height: 100vh;
  overflow: auto;
  scrollbar-width: none;
  -ms-overflow-style: none;
  box-sizing: border-box;
  padding: 1.3333rem 0;
}

.back-top {
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  position: fixed;
  right: 0.4rem;
  bottom: 4.8333rem;
  width: 1.2rem;
  height: 1.2rem;
  box-shadow: 3px 3px 8px 0px #847e7e;
  background-color: #fff;
  color: #858585;
  opacity: 50%;
}

.bar {
  position: fixed;
  right: 0.4rem;
  bottom: 3.3333rem;
  width: 1.2rem;
  height: 1.2rem;
  background-color: #4dc0ff;
  color: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  box-shadow: 3px 3px 8px 0px #847e7e;
  opacity: 50%;
}
.van-pull-refresh {
  //防止下拉刷新时原有动态因为高度显示不全
  min-height: 100%;
}
</style>