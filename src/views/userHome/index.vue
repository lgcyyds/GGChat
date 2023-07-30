<template>
  <div class="userHome-content">
    <BackBtn></BackBtn>
    <!-- 如果是自己的主页，就不会显示这个按钮 -->
    <van-icon
      name="ellipsis"
      class="del-btn"
      v-if="$route.query._id !== userId && friendState == 1"
      @click="showPopup = true"
    />
    <!-- 删除好友弹出层 -->
    <van-popup
      v-model="showPopup"
      position="bottom"
      :style="{ height: '1.4667rem' }"
    >
      <div class="out-group" @click="delFriend">删除好友</div>
    </van-popup>
    <!-- 背景 -->
    <div class="bg">
      <BackgroundCanvas></BackgroundCanvas>
    </div>
    <!-- 用户信息 -->
    <div class="content">
      <div class="top">
        <!-- 点击弹出头像大图 -->
        <div class="user-pic">
          <img
            :src="$baseUrl + userHomeInfo.imgUrl"
            @click="lookPic($baseUrl + userHomeInfo.imgUrl)"
          />
        </div>
        <div class="user-nickAndCode">
          <div class="user-nick">{{ userHomeInfo.nick }}</div>
          <div class="user-code">GGCode:{{ userHomeInfo.GGCode }}</div>
        </div>
      </div>
      <div class="user-info">
        <div class="self-Info">
          <img src="@/assets/icon/shenfenrenzheng.png" alt="" />
          <span>{{ userHomeInfo.sex }}</span>
          <span>{{ userHomeInfo.age }}岁</span>
          <span>{{ userHomeInfo.birthday }}</span>
          <span>{{ userHomeInfo.start }}</span>
        </div>
        <div class="phone">
          <img src="@/assets/icon/dianhua.png" alt="" />
          <span>电话：{{ userHomeInfo.phone }}</span>
        </div>
        <div class="sign">
          <img src="@/assets/icon/qianming.png" alt="" />
          <span>个性签名：{{ userHomeInfo.sign }}</span>
        </div>
        <div class="space" @click="goUserSpace">
          <img src="@/assets/icon/gerenkongjian.png" alt="" />
          <span>{{ userHomeInfo.nick }}的空间（去看看）</span>
          <van-icon name="arrow" class="icon-right" />
        </div>
      </div>
    </div>
    <!-- 底部按钮 -->
    <div class="bottom">
      <div class="multifunc-bottom" @click="handleBtnClick">
        {{ btnText }}
      </div>
    </div>
  </div>
</template>

<script>
import BackgroundCanvas from "@/components/BackgroundCanvas/index.vue";
import BackBtn from "@/components/BackBtn/index.vue";
import { mapState } from "vuex";
import { ImagePreview, Toast, Dialog } from "vant";
export default {
  components: {
    BackgroundCanvas,
    BackBtn,
  },
  data() {
    return {
      userHomeInfo: {},
      friendState: null,
      showPopup: false,
      isThrottled : false//初始状态关闭节流
    };
  },
  methods: {
    //获取主页信息
    async getUserhome() {
      let _id = this.userId;
      let urlId = this.$route.query._id;
      let Ids = { _id, urlId };
      const result = await this.$API.reqGetUserHome(Ids);
      if (result.status == 200) {
        this.isThrottled = false//获取主页信息后关闭节流
        const { sex, birthday, start, age, nick, imgUrl, phone, sign, GGCode } =
          result.data.user;
        const { friendState } = result.data;
        this.friendState = friendState;
        this.userHomeInfo = {
          GGCode,
          sex,
          birthday: this.getBirthday(birthday),
          start,
          age,
          nick,
          imgUrl,
          phone,
          sign,
        };
      }
    },
    //格式化生日日期
    getBirthday(birthday) {
      let temp = birthday.split("-");
      return temp[1] + "月" + temp[2] + "日";
    },
    //查看用户头像
    lookPic(imgUrl) {
      ImagePreview({
        images: [imgUrl],
        showIndex: false,
      });
    },
    //删除好友
    delFriend() {
      const { _id } = this.$route.query;
      let Ids = { friendId: _id, userId: this.userId };
      Dialog.confirm({
        title: "温馨提示",
        message: "确认删除好友？",
      })
        .then(async () => {
          let result = await this.$API.reqDelFriend(Ids);
          if (result.status == 200) {
            Toast("删除成功");
          }
          this.$router.replace("/contacts");
        })
        .catch(() => {
          this.showPopup = false;
        });
    },
    //底部点击跳转页面
    async handleBtnClick() {
      /**
       * friendState => 0  申请中
       * friendState => 1  发消息
       * friendState => 2(null) 加好友
       * friendState => 3  编辑资料
       */
      let { imgUrl, nick, sex, birthday, sign } = this.userHomeInfo;
      if (this.friendState == 0) {
        //申请中，点击不跳转
      } else if (this.friendState == 1) {
        //转到与用户的聊天界面
        let route = {
          path: "/MessageDetail/friendChat",
          query: { id: this.$route.query._id },
        };
        this.$router.push(route);
      } else if (this.friendState == 3) {
        // 修改个人信息
        let route = {
          path: "/UpdateInfo",
          query: { urlId: this.$route.query._id },
        };
        this.$router.push(route);
      } else {
        //如果申请还没发出，被节流
        if(this.isThrottled){
          return
        }
        // 开启节流（在获取到页面信息后关闭节流）
        this.isThrottled = true
        //加好友
        let friendId = this.$route.query._id;
        let Ids = {
          friendId,
          userId: this.userId,
        };
        try {
          const result = await this.$API.reqAddFriend(Ids);
          if (result.status == 200) {
            Toast(result.msg);
            this.getUserhome();
            // 触发socket
            this.$socket.emit("apply_notice", friendId);
            
          }
        } catch (error) {
          this.isThrottled = false
          Toast(result.msg);
        }
      }
    },
    //去用户动态空间
    goUserSpace() {
      let route = {
        path: "/SpaceDetails",
        query: {
          userId: this.$route.query._id,
          nick: this.userHomeInfo.nick,
          imgUrl: this.userHomeInfo.imgUrl,
          phone: this.userHomeInfo.phone,
        },
      };
      this.$router.push(route);
    },
  },
  computed: {
    ...mapState({ userId: (state) => state.user.userInfo._id }),
    //底部文字
    btnText() {
      const { friendState } = this;
      if (friendState === 0) {
        return "申请中";
      } else if (friendState === 1) {
        return "发消息"; // 已为好友
      } else if (friendState === 3) {
        return "编辑资料"; // 该用户是自己（4为编辑资料）
      } else {
        return "加好友"; //为null
      }
    },
  },
  mounted() {
    this.getUserhome();
  },
};
</script>

<style lang="less" scoped>
.userHome-content {
  width: 100%;
  height: 100vh;
  background-color: black;
  position: relative;
}
.content {
  width: 100%;
  height: 13.6667rem;
  background-color: #fff;
  padding: 0.4rem;
  box-sizing: border-box;
  position: absolute;
  left: 0;
  bottom: 0;
  border-radius: 0.5333rem 0.5333rem 0 0;

  .top {
    width: 100%;
    height: 2.3333rem;
    display: flex;
    align-items: center;
    margin-bottom: 0.3333rem;

    .user-pic {
      width: 2.3333rem;
      height: 2.3333rem;
      border-radius: 50%;
      overflow: hidden;
      margin-right: 0.4rem;

      img {
        width: 100%;
        height: 100%;
      }
    }

    .user-nickAndCode {
      flex: 1;
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: center;

      .user-nick {
        font-size: 0.4rem;
        font-weight: 700;
        margin-bottom: 0.2667rem;
      }

      .user-code {
        color: #7a7a7a;
        font-size: 0.24rem;
      }
    }
  }

  .user-info {
    width: 100%;
    display: flex;
    flex-direction: column;

    .self-Info,
    .phone,
    .sign,
    .space {
      width: 100%;
      display: flex;
      align-items: center;
      margin: 0.1333rem 0;
      font-size: 0.3333rem;

      img {
        width: 0.6667rem;
        height: 0.6667rem;
      }

      span {
        padding-left: 0.2667rem;
      }

      .icon-right {
        flex: 1;
        display: flex;
        justify-content: flex-end;
      }
    }

    .self-Info {
      span {
        display: inline-block;
        padding: 0 0.2667rem;
        border-right: 0.0133rem solid #7a7a7a;
      }

      span:nth-last-child(1) {
        border: none;
      }
    }
  }
}
.out-group {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 0.4rem;
  color: #f06262;
}
.del-btn {
  position: fixed;
  top: 0.4rem;
  right: 0.4rem;
  font-size: 0.6rem;
  color: #fff;
  font-weight: 600;
}

.bottom {
  width: 100%;
  height: 1.6667rem;
  background-color: #fff;
  border-top: 0.04rem solid #dbdada;
  box-sizing: border-box;
  padding: 0.2667rem 0.4rem;
  position: fixed;
  bottom: 0;
  left: 0;

  .multifunc-bottom {
    height: 100%;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #3c98ff;
    border-radius: 0.1333rem;
    color: #fff;
    font-size: 0.4rem;
  }
}
.bg {
  width: 100%;
  height: 50%;
}
</style>