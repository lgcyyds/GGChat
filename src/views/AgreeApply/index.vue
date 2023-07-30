<template>
  <div>
    <NavTop class="navtop-contacts">
      <div class="navtop-title">{{ $route.params.type }}</div>
      <BackBtn />
    </NavTop>
    <main>
      <!-- 无申请通知 -->
      <div class="no-notice" v-if="!AgreeApplyList.length">
        暂无{{ $route.params.type === "新朋友" ? "好友" : "群" }}通知
      </div>
      <!-- 有申请通知 -->
      <ul class="notice-content" v-else>
        <li
          class="notice-item"
          v-for="(item, index) in AgreeApplyList"
          :key="index"
        >
          <img :src="$baseUrl + item.friendId.imgUrl" alt="" />
          <div class="user-info">
            <div class="nick">{{ item.friendId.nick }}</div>
            <div class="from" v-if="$route.params.type === '群通知'">
              来自{{ item.group[0].groupName }}的群
            </div>
          </div>
          <div
            class="agree-btn"
            @click="handleAgree(item.friendId._id, item.groupId)"
          >
            同意
          </div>
        </li>
      </ul>
    </main>
  </div>
</template>

<script>
import NavTop from "@/components/NavTop/index.vue";
import BackBtn from "@/components/BackBtn/index.vue";
import { mapState } from "vuex";
import { Toast } from "vant";
import _ from "lodash";
export default {
  components: {
    NavTop,
    BackBtn,
  },
  data() {
    return {
      AgreeApplyList: [],
    };
  },
  methods: {
    //获取群申请列表
    async getGroupAgreeApply() {
      let userId = { userId: this.userId };
      try {
        let result = await this.$API.reqGetGroupNoAgree(userId);
        if (result.status == 200) {
          this.AgreeApplyList = result.data;
        }
      } catch (error) {
        console.log(error);
      }
    },
    //获取好友申请列表
    async getFriendAgreeApply() {
      let userId = { userId: this.userId };
      try {
        const result = await this.$API.reqGetFriendNoAgree(userId);
        if (result.status == 200) {
          this.AgreeApplyList = result.data;
        }
      } catch (error) {
        console.log(error);
      }
    },
    //同意群或者好友申请
    handleAgree: _.throttle(async function(userId, groupId){
      if (this.$route.params.type == "群通知") {
        let Ids = { userId, groupId };
        const result = await this.$API.reqAgreeGroupApply(Ids);
        if (result.status == 200) {
          this.getGroupAgreeApply();
          Toast("已同意");
          this.$store.commit("updateGroupNoticeNum");
        }
      } else {
        let Ids = { userId: this.userId, friendId: userId };
        const result = await this.$API.reqAgreeFriendApply(Ids);
        if (result.status == 200) {
          this.getFriendAgreeApply();
          Toast("已同意");
          this.$store.commit("updateFriendNoticeNum");
        }
      }
    }, 2000),
  },
  mounted() {
    if (this.$route.params.type == "群通知") {
      this.getGroupAgreeApply();
    } else {
      this.getFriendAgreeApply();
    }
  },
  computed: {
    ...mapState({ userId: (state) => state.user.userInfo._id }),
  },
};
</script>

<style lang="less" scoped>
.navtop-contacts {
  position: fixed;
  top: 0;
  left: 0;
}
main {
  width: 100%;
  height: 100vh;
  background-color: #f6f6f6;
  padding: 1.6rem 0 0;
  box-sizing: border-box;
  .no-notice {
    width: 100%;
    height: 2.4rem;
    background-color: #fff;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 0.4rem;
    color: #979696;
  }
  .notice-content {
    width: 100%;
    padding: 0 0.4rem;
    background-color: #fff;
    box-sizing: border-box;
    .notice-item {
      width: 100%;
      height: 2.2667rem;
      display: flex;
      align-items: center;
      img {
        width: 1.6rem;
        height: 1.6rem;
        border-radius: 50%;
        margin-right: 0.2rem;
      }
      .user-info {
        flex: 1;
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        padding: 0.4rem 0;
        box-sizing: border-box;
        .nick {
          font-size: 0.4rem;
        }
        .from {
          color: #838383;
        }
      }
      .agree-btn {
        width: 1.5333rem;
        height: 0.7333rem;
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: #bfdafa;
        color: #1f79e7;
      }
    }
  }
}
</style>