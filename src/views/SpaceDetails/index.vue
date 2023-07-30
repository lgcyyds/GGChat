<template>
  <div class="space-datails-content">
    <div class="space-header">
      <NavTop :style="`opacity: ${opacityStyle}`">
        <div class="navtop-title">{{ userInfo.nick }}的空间</div>
      </NavTop>
      <BackBtn class="BackBtn"></BackBtn>
    </div>
    <!-- 背景 -->
    <div
      class="space-bg"
      style="
        background-image: url('https://img1.baidu.com/it/u=2463514011,1142503686&fm=253&fmt=auto&app=138&f=JPEG?w=888&h=500');
      "
    ></div>
    <main ref="sd">
      <!-- 用户头像 -->
      <div class="user">
        <div class="user-pic">
          <img :src="$baseUrl + userInfo.imgUrl" alt="" />
        </div>
        <div class="user-info">
          <div class="user-nick">{{ userInfo.nick }}</div>
          <div class="user-code">{{ userInfo.phone }}</div>
        </div>
      </div>
      <!-- 空间动态列表 -->
      <div class="space-list">
        <SpaceList :SpaceList="SpaceList" ref="spaceList"></SpaceList>
      </div>
    </main>
  </div>
</template>

<script>
import NavTop from "@/components/NavTop/index.vue";
import BackBtn from "@/components/BackBtn/index.vue";
import SpaceList from "@/components/SpaceList/index.vue";
import { watch } from "vue";
export default {
  components: {
    NavTop,
    BackBtn,
    SpaceList,
  },
  data() {
    return {
      SpaceList: [],
      opacityStyle: 0,
      userInfo: {},
    };
  },
  methods: {
    //滚动导航变色
    changeOpacity() {
      let scrollTop = this.$refs.sd.scrollTop;
      let windowMaxHeight = window.innerWidth;
      let scrollTopRem = scrollTop / (windowMaxHeight * 0.1); //得到
      if (scrollTopRem) {
        this.opacityStyle = scrollTopRem - 6;
      }
    },
    //获取空间信息
    async getSpaceListDetail() {
      const { imgUrl, phone, nick } = this.$route.query;
      this.userInfo = { imgUrl, phone, nick };
      const userId = this.$route.query.userId;
      try {
        const result = await this.$API.reqGetSpaceListDetails({ userId });
        if (result.status == 200) {
          this.SpaceList = result.data;
        }
      } catch (error) {
        console.log(error);
      }
    },
  },
  mounted() {
    window.addEventListener("scroll", this.changeOpacity, true);
    this.getSpaceListDetail();
  },
  beforeDestroy() {
    window.removeEventListener("scroll", this.changeOpacity, true);
    window.removeEventListener(
      "scroll",
      this.$refs.spaceList.imgLazyLoading,
      true
    );
  },
  watch: {
    SpaceList() {
      this.$nextTick(() => {
        //图片懒加载
        window.addEventListener(
          "scroll",
          this.$refs.spaceList.imgLazyLoading,
          true
        );
        //前三条动态不需要懒加载
        this.$nextTick(() => {
          this.$refs.spaceList.noLazyLoading();
        });
      });
    },
  },
};
</script>

<style lang="less" scoped>
.space-datails-content {
  width: 100%;
  height: 100vh;
}
.space-header {
  width: 100%;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 999;
}
.space-bg {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 6.6667rem;
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;
}
main {
  width: 100%;
  height: 100%;
  position: relative;
  overflow: auto;

  .user {
    width: 100%;
    height: 1.7333rem;
    padding: 0 0.5333rem;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    margin-bottom: 0.3333rem;
    position: absolute;
    top: 4rem;
    left: 0;
    color: #fff;
    .user-pic {
      width: 1.7333rem;
      height: 1.7333rem;
      border-radius: 50%;
      overflow: hidden;
      margin-right: 0.2rem;
      img {
        width: 100%;
        height: 100%;
      }
    }
    .user-info {
      display: flex;
      flex: 1;
      height: 100%;
      padding: 0.2667rem 0;
      box-sizing: border-box;
      flex-direction: column;
      justify-content: space-around;
      font-size: 0.5333rem;
      .user-code {
        font-size: 0.3333rem;
      }
    }
  }
  .space-list {
    width: 100%;
    background-color: #fff;
    position: absolute;
    top: 6rem;
    left: 0;
    border-radius: 0.4rem 0.4rem 0 0;
  }
}
</style>