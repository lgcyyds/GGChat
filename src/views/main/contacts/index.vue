<template>
  <div>
    <!-- 顶部 -->
    <NavTop class="navtop-contacts">
      <div class="navtop-title">联系人</div>
    </NavTop>
    <!-- 中间内容部分 -->
    <div class="content">
      <SearchInput />
      <div class="new-user" @click="goAgreeApply('新朋友')">
        新朋友
        <div class="dots" v-show="friendNum > 0">{{ friendNum }}</div>
        <van-icon name="arrow" />
      </div>
      <div class="new-user" @click="goAgreeApply('群通知')">
        群通知
        <div class="dots" v-show="groupNum > 0">{{ groupNum }}</div>
        <van-icon name="arrow" />
      </div>
      <!-- 好友/群聊界面切换 -->
      <van-tabs v-model="active" @change="changeTabCar">
        <van-tab
          :title="item.title"
          v-for="(item, index) in tabCar"
          :key="index"
        ></van-tab>
      </van-tabs>
      <!-- 好友/群聊列表 -->
      <van-empty
        v-if="false"
        image="https://preview.qiantucdn.com/ing/96/52/73/08P58PICMTDXicDnkUisK_PIC2018.jpg%21qt324_nowater_jpg"
      />
      <FriendOrGroupList
        v-else
        class="friend-group-content"
        :dataList="dataList"
        :ListType="ListType"
      >
      </FriendOrGroupList>
    </div>
    <!-- 底部tabbar -->
    <Tabbar />
  </div>
</template>

<script>
import Tabbar from "@/components/Tabbar/index.vue";
import NavTop from "@/components/NavTop/index.vue";
import SearchInput from "@/components/SearchInput/index.vue";
import FriendOrGroupList from "@/components/FriendOrGroupList/index.vue";
import { mapGetters, mapState } from "vuex";

export default {
  components: {
    Tabbar,
    NavTop,
    SearchInput,
    FriendOrGroupList,
  },
  data() {
    return {
      tabCar: [{ title: "好友" }, { title: "群聊" }],
      dataList: [],
      ListType: 0,
      active: 0,
    };
  },
  methods: {
    // 点击切换好友/群聊标签页
    changeTabCar(index) {
      if (index == 0) {
        this.ListType = 0;
        this.getFriendList();
      } else {
        this.ListType = 1;
        this.getGroupList();
      }
    },
    goAgreeApply(type) {
      this.$router.push(`/AgreeApply/${type}`);
    },
    //获取好友列表
    async getFriendList() {
      let userId = this.userId;
      let friendList = [];
      let result = await this.$API.reqGetContactsFriendList({ userId });
      if (result.status == 200) {
        for (let f of result.data) {
          friendList.push(f.friendId);
        }
        this.dataList = [...friendList];
      }
    },
    //获取群列表
    async getGroupList() {
      let userId = this.userId;
      let groupList = [];
      let result = await this.$API.reqGetContactsGroupList({ userId });
      if (result.status == 200) {
        for (let g of result.data) {
          groupList.push(g.groupId);
        }
        this.dataList = [...groupList];
      }
    },
  },
  computed: {
    ...mapState({ userId: (state) => state.user.userInfo._id }),
    ...mapGetters(["friendNum", "groupNum"]),
  },
  mounted() {
    this.getFriendList();
  },
};
</script>

<style lang="less" scoped>
.navtop-contacts {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 999;
}

.content {
  width: 100%;
  height: 100vh;
  padding: 1.5999rem 0.4rem 1.3333rem;
  box-sizing: border-box;

  .new-user {
    width: 100%;
    height: 1.4667rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 0.4rem;
    border-bottom: 0.04rem solid #f6f6f6;

    .dots {
      width: 0.5rem;
      height: 0.5rem;
      display: flex;
      justify-content: center;
      align-items: center;
      border-radius: 50%;
      background-color: #f06262;
      color: #fff;
      margin-left: auto;
      margin-right: 0.1333rem;
    }
  }
}

::v-deep .van-tabs__line {
  background-color: #54a0e7;
}
</style>