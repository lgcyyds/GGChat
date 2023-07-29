<template>
  <div>
    <!-- 导航顶部NavTop -->
    <NavTop class="message-nav-top">
      <div class="msg-top">
        <!-- 头像 -->
        <div class="user-pic" @click="goMyHome">
          <img :src="$baseUrl + userInfo.imgUrl" alt="" />
        </div>
        <!-- 名字 -->
        <div class="user-nick">{{ userInfo.nick }}</div>
        <!-- 最右侧＋号(新建群聊或者退出登录) -->
        <van-popover
          v-model="showPopover"
          trigger="click"
          :actions="actions"
          @select="onSelect"
          placement="bottom-end"
        >
          <template #reference>
            <div class="create-group">
              <van-icon name="add-o" size="0.6667rem" />
            </div>
          </template>
        </van-popover>
      </div>
    </NavTop>
    <!-- 消息列表MessageList -->
    <MessageList></MessageList>
    <!-- 底部选项Tabbar -->
    <Tabbar></Tabbar>
  </div>
</template>
<script>
import MessageList from "@/components/MessageList/index.vue";
import NavTop from "@/components/NavTop/index.vue";
import Tabbar from "@/components/Tabbar/index.vue";
import { mapState } from "vuex";
export default {
  components: {
    MessageList,
    NavTop,
    Tabbar,
  },
  data() {
    return {
      showPopover: false,
      // 通过 actions 属性来定义菜单选项
      actions: [{ text: "新建群聊" }, { text: "退出登录" }],
    };
  },
  methods: {
    goMyHome() {
      let route = {
        path: "/userhome",
        query: {
          _id: this._id,
        },
      };
      this.$router.push(route);
    },
    //左上角加号
    onSelect(action) {
      if (action.text === "新建群聊") {
        this.$router.push("/CreateOrUpdateGroup/新建群聊");
      } else if (action.text === "退出登录") {
        //清空用户信息
        this.$store.commit("clearUserInfo");
        //断开socket连接
        // this.$socket.disconnect();
        //回到登录页
        this.$router.push("/login");
      }
    },
  },
  computed: {
    ...mapState({
      _id: (state) => state.user.userInfo._id,
      userInfo: (state) => state.user.userInfo||{},
    }),
  },
};
</script>

<style lang="less" scoped>
.message-nav-top {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 999;

  .msg-top {
    display: flex;
    position: relative;
    box-sizing: border-box;
    width: 100%;
    height: 100%;
    padding: 0 0.3333rem 0 0.4rem;
    align-items: center;

    .user-pic {
      width: 0.9333rem;
      height: 0.9333rem;
      border-radius: 50%;
      overflow: hidden;

      img {
        width: 100%;
        height: 100%;
      }
    }

    .user-nick {
      flex: 1;
      font-size: 0.4rem;
      color: #fffbe8;
      margin-left: 0.2667rem;
    }
  }
  .create-group {
    width: 0.6667rem;
    height: 0.6667rem;
    van-icon {
      width: 100%;
      height: 100%;
    }
  }
}
</style>
<style>
.van-popover__action {
  width: 2.5067rem;
}
.van-popover[data-popper-placement="bottom-end"] .van-popover__arrow {
  right: 4px;
}
</style>