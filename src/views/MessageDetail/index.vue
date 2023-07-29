<template>
  <div class="main">
    <NavTop class="navtop">
      <div class="navtop-title">{{ nick }}</div>
      <BackBtn />
      <van-icon
        name="ellipsis"
        class="detail-btn"
        v-if="true"
        @click="goGroupOrFriendHome"
      />
    </NavTop>
    <MsgContent :isDisabled="isDisabled" :dataList="dataList" />
  </div>
</template>

<script>
import NavTop from "@/components/NavTop/index.vue";
import BackBtn from "@/components/BackBtn/index.vue";
import MsgContent from "@/components/MsgContent/index.vue";
import { mapState } from "vuex";
import { Toast } from "vant";
import { formatDate } from "@/utils/timeFormat";
export default {
  components: {
    NavTop,
    BackBtn,
    MsgContent,
  },
  data() {
    return {
      nick: "",
      isDisabled: false,
      dataList: [],
      pageNum: 1,
    };
  },
  methods: {
    goGroupOrFriendHome() {
      if (this.$route.params.type == "friendChat") {
        let route = {
          path: "/userhome",
          query: {
            _id: this.$route.query.id,
          },
        };
        this.$router.push(route);
      } else {
        let route = {
          path: "/groupHome",
          query: {
            _id: this.$route.query.id,
          },
        };
        this.$router.push(route);
      }
    },
    //获取聊天好友信息和记录
    async getPrivateList(pageNum = 1) {
      let Ids = {
        userId: this.userId,
        friendId: this.$route.query.id,
        pageNum: pageNum,
      };
      const result = await this.$API.reqGetPrivateList(Ids);
      if (result.status == 200) {
        //格式化时间
        result.data.messageList.forEach(
          (item) => (item.time = formatDate(item.time))
        );
        //消息条数小于10不能刷新
        if (result.data.messageList.length <= 14) {
          this.isDisabled = true;
        }
        this.nick = result.data.friendNick.nick;
        this.dataList = [...result.data.messageList, ...this.dataList];
      } else if (result.status == 201) {
        //没记录
        this.isDisabled = true; //没有记录不能刷新
        this.nick = result.data.friendNick.nick;
      } else if (result.status == 202) {
        //不是好友
        this.nick = result.data.friendNick.nick;
        Toast.fail(result.msg);
      } else {
        Toast.fail(result.msg);
      }
    },
    async getGroupList(pageNum = 1) {
      let Ids = {
        userId: this.userId,
        groupId: this.$route.query.id,
        pageNum: pageNum,
      };
      const result = await this.$API.reqGetGroupList(Ids);
      if (result.status == 200) {
        //格式化时间
        result.data.messageList.forEach(
          (item) => (item.time = formatDate(item.time))
        );
        //消息条数小于10不能刷新
        if (result.data.length <= 14) {
          this.isDisabled = true;
        }
        this.nick = result.data.groupNick.groupName;
        this.dataList = [...result.data.messageList, ...this.dataList];
      } else if (result.status == 201) {
        //没记录
        this.isDisabled = true; //没有记录不能刷新
        this.nick = result.data.friendNick.nick;
      } else if (result.status == 202) {
        //不是好友
        this.nick = result.data.friendNick.nick;
        Toast.fail(result.msg);
      } else {
        Toast.fail(result.msg);
      }
    },
    //将记录变为已读
    async changeRead() {
      let Ids = {
        userId: this.userId,
        friendId: this.$route.query.id,
      };
      await this.$API.reqSetMessageRead(Ids);
    },
  },
  computed: {
    ...mapState({ userId: (state) => state.user.userInfo._id }),
  },
  mounted() {
    if (this.$route.params.type == "friendChat") {
      this.getPrivateList();
      this.changeRead()
    } else {
      this.getGroupList();
      //只有进入群聊才能知道有人在房间里发消息
      this.$socket.emit("join_group", this.$route.query.id);
    }
  },
};
</script>

<style lang="less" scoped>
.main {
  width: 100%;
  height: 100vh;
}
.navtop {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 999;
}
.detail-btn {
  position: fixed;
  top: 0.4rem;
  right: 0.4rem;
  font-size: 0.6rem;
  color: #fff;
  font-weight: 600;
  z-index: 999;
}
</style>