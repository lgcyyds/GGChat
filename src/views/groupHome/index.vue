<template>
  <div class="content">
    <NavTop class="navtop-content">
      <BackBtn />
      <div class="navtop-title">{{ groupInfo.groupName }}</div>
      <van-icon
        name="ellipsis"
        class="more-icon"
        @click="popShow = true"
        v-if="true"
      />
    </NavTop>
    <!-- 点击右上角弹出层 -->
    <van-popup class="pop-content" v-model="popShow" position="bottom">
      <div
        class="update-group"
        v-if="GroupOwner == userId"
        @click="updateGroup"
      >
        编辑资料
      </div>
      <div class="out-group" @click="outGroup">退出群聊</div>
    </van-popup>
    <!-- 群信息 -->
    <div class="group-content">
      <div class="group-info-top">
        <div class="group-pic" @click="lookPic()">
          <img :src="$baseUrl + groupInfo.imgUrl" alt="" />
        </div>
        <div class="group-info">
          <div class="group-name">{{ groupInfo.groupName }}</div>
          <div class="group-number">{{ groupInfo.groupNumber }}</div>
        </div>
      </div>
      <div class="group-createTime">
        <van-icon class="time-icon" name="underway-o" />
        <span>创建时间：{{ groupInfo.createTime }}</span>
      </div>
    </div>
    <!-- 群简介 -->
    <div class="group-sign-content">
      <div class="content-title">群简介</div>
      <div class="sign-text">{{ groupInfo.sign }}</div>
    </div>
    <!-- 群成员列表 -->
    <div class="group-people-content">
      <div class="content-title">群成员 ({{ groupMember.length }}人)</div>
      <ul>
        <li v-for="(item, index) in groupMember" :key="index">
          <div class="user-pic">
            <img :src="$baseUrl + item.userId.imgUrl" alt="" />
          </div>
          <div class="user-nick">{{ item.userId.nick }}</div>
          <van-tag
            color="#ffe1e1"
            text-color="#ad0000"
            v-if="GroupOwner == item.userId._id"
            >群主</van-tag
          >
        </li>
      </ul>
    </div>
    <!-- 底部按钮 -->
    <div class="bottom">
      <div class="send-btn" @click="handleBtn">{{ btnText }}</div>
    </div>
  </div>
</template>

<script>
import BackBtn from "@/components/BackBtn/index.vue";
import NavTop from "@/components/NavTop/index.vue";
import { ImagePreview, Toast, Dialog } from "vant";
import { mapState } from "vuex";

export default {
  components: {
    BackBtn,
    NavTop,
  },
  data() {
    return {
      popShow: false,
      groupInfo: {},
      groupMember: [],
      GroupOwner: "",
      groupState: null,
    };
  },
  methods: {
    // 点击编辑群资料
    updateGroup() {
      let route = {
        path: `/CreateOrUpdateGroup/编辑群信息`,
        query: { groupId: this.$route.query._id },
      };
      this.$router.push(route);
    },
    //退出群聊
    outGroup() {
      if (this.userId == this.GroupOwner) {
        Dialog.confirm({
          message: "确认解散吗？",
        })
          .then(async () => {
            let groupId = this.$route.query._id;
            try {
              let result = await this.$API.reqDelGroup({ groupId });
              if (result.status == 200) {
                this.$router.replace("/contacts");
                Toast("解散成功");
              }
            } catch (error) {
              console.log(error);
            }
          })
          .catch(() => {
            this.popShow = false;
          });
      } else {
        Dialog.confirm({
          message: "确认退出吗？",
        })
          .then(async () => {
            let groupId = this.$route.query._id;
            let Ids = {
              groupId,
              userId: this.userId,
            };
            try {
              let result = await this.$API.reqDelGroupUser(Ids);
              if (result.status == 200) {
                this.$router.replace("/contacts");
                Toast("退出成功");
              }
            } catch (error) {
              console.log(error);
            }
          })
          .catch(() => {
            this.popShow = false;
          });
      }
    },
    lookPic() {
      ImagePreview({
        images: [this.$baseUrl + this.groupInfo.imgUrl],
        showIndex: false,
      });
    },
    //获取群信息
    async getGroupInfo() {
      let groupId = this.$route.query._id;
      let Ids = {
        groupId,
        userId: this.userId,
      };
      try {
        let result = await this.$API.reqGetGroupHome(Ids);
        let result2 = await this.$API.reqGetGroupUserList({ groupId });
        if (result.status == 200 && result2.status == 200) {
          this.groupInfo = result.data;
          this.groupState = result.state;
          this.GroupOwner = result.data.userId; //判断群主
          this.groupMember = result2.data;
        }
      } catch (error) {
        return new Error(error);
      }
    },
    //点击底部按钮
    async handleBtn() {
      if (this.groupState == 1) {
        //已加入就显示发送信息
        let route = {
          path: "/MessageDetail/groupChat",
          query: {
            id: this.$route.query._id,
          },
        };
        this.$router.push(route);
      } else if (this.groupState == 2) {
        //未加入就显示申请加入
        let groupId = this.$route.query._id;
        let Ids = {
          groupId,
          userId: this.userId,
        };
        let result = await this.$API.reqAddGroup(Ids);
        if (result.status == 200) {
          Toast(result.msg);
          this.getGroupInfo();
          // 触发socket
          this.$socket.emit("apply_notice", this.groupInfo.userId);
        } else {
          Toast(result.msg);
        }
      } else {
        //申请中
        Toast("申请中");
        return;
      }
    },
  },
  computed: {
    ...mapState({ userId: (state) => state.user.userInfo._id }),
    //底部文字
    btnText() {
      if (this.groupState == 1) {
        //已加入就显示发送信息
        return "发消息";
      } else if (this.groupState == 2) {
        //未加入就显示申请加入
        return "申请加入";
      } else {
        //申请中
        return "申请中";
      }
    },
  },
  mounted() {
    this.getGroupInfo();
  },
};
</script>

<style lang="less" scoped>
.navtop-content {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 99;
}
.content {
  width: 100%;
  height: 100vh;
  padding-top: 1.3333rem;
  box-sizing: border-box;
  background-color: #f6f6f6;
}
.more-icon {
  position: fixed;
  top: 0.4rem;
  right: 0.4rem;
  font-size: 0.6rem;
  color: #fff;
  font-weight: 600;
}
.pop-content {
  display: flex;
  // height: 80px;
  flex-direction: column;
  .update-group,
  .out-group {
    width: 100%;
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 0.4rem;
    line-height: 1.3333rem;
  }
  .update-group {
    border-bottom: 0.04rem solid #eae8e8;
  }
  .out-group {
    color: #f06262;
  }
}
.group-content {
  width: 100%;
  background-color: #fff;
  padding: 0.1333rem 0.4rem 0.3333rem;
  box-sizing: border-box;
  margin-bottom: 0.3333rem;
  .group-info-top {
    width: 100%;
    height: 1.4667rem;
    display: flex;
    align-items: center;
    margin-bottom: 0.4rem;
    .group-pic {
      width: 1.4667rem;
      height: 1.4667rem;
      border-radius: 50%;
      overflow: hidden;
      margin-right: 0.4rem;
      img {
        width: 100%;
        height: 100%;
      }
    }
    .group-info {
      flex: 1;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      display: flex;
      flex-direction: column;
      justify-content: space-around;
      .group-name {
        font-size: 0.4667rem;
        margin-bottom: 0.2667rem;
      }
    }
  }
  .group-createTime {
    font-size: 0.3333rem;
    color: #858585;
    .time-icon {
      font-weight: 700;
    }
    span {
      margin-left: 0.1333rem;
    }
  }
}
.group-sign-content {
  width: 100%;
  background-color: #fff;
  padding: 0.4667rem 0.4rem;
  box-sizing: border-box;
  margin-bottom: 0.3333rem;
  .content-title {
    font-size: 0.4rem;
    margin-bottom: 0.4rem;
  }
  .sign-text {
    font-size: 0.3733rem;
    line-height: 0.5333rem;
  }
}
.group-people-content {
  width: 100%;
  background-color: #fff;
  padding: 0.4667rem 0.4rem 0.2667rem;
  box-sizing: border-box;
  .content-title {
    font-size: 0.4rem;
    margin-bottom: 0.4rem;
  }
  ul {
    li {
      width: 100%;
      height: 1.4667rem;
      display: flex;
      align-items: center;
      .user-pic {
        width: 1.0667rem;
        height: 1.0667rem;
        overflow: hidden;
        border-radius: 50%;
        img {
          width: 100%;
          height: 100%;
        }
      }
      .user-nick {
        flex: 1;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        font-size: 0.4rem;
        margin-left: 0.2667rem;
      }
    }
  }
}
.bottom {
  width: 100%;
  height: 1.6667rem;
  background-color: #fff;
  border-top: 0.04rem solid #dbdada;
  padding: 0.2667rem 0.4rem;
  box-sizing: border-box;
  position: fixed;
  left: 0;
  bottom: 0;
  .send-btn {
    width: 100%;
    height: 100%;
    background-color: #3c98ff;
    border-radius: 0.1333rem;
    color: #fff;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 0.4rem;
  }
}
</style>