<template>
  <div>
    <!-- 消息容器 -->
    <div class="message-content" ref="msgContent">
      <van-pull-refresh
        v-model="isLoading"
        @refresh="onRefresh"
        pulling-text="下拉加载更多记录"
        loosing-text="释放加载更多记录"
        loading-text="加载中"
        :disabled="isDisabled"
      >
        <ul class="message-list-content">
          <li v-for="(item, index) in dataList" :key="index">
            <!-- 自己消息框 (位于右边，发送内容和头像两部分)-->
            <div class="me msg-box-right" v-if="item.userId._id == userId">
              <!-- 发送内容 -->
              <div class="msg-content right">
                <!-- 如果是在群聊里面，所有人都要带昵称 -->
                <div class="nick">{{ item.userId.nick }}</div>
                <div class="msg-del">
                  <!-- 时间 -->
                  <div class="msg-time">{{ item.time }}</div>
                  <!-- 文字 -->
                  <div class="bubble bubble-right" v-if="item.msgType == 0">
                    {{ item.message }}
                  </div>
                  <!-- 图片 -->
                  <div class="bubble bubble-right" v-else>
                    <div class="msg-pic" @click="lookPic(item.message)">
                      <van-image
                        height="3rem"
                        lazy-load
                        fit="cover"
                        :src="$baseUrl + item.message"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <!-- 头像 -->
              <div class="user-pic" @click="goUserHome(userId)">
                <img :src="$baseUrl + item.userId.imgUrl" alt="" />
              </div>
            </div>
            <!-- 对方消息框 -->
            <div class="other msg-box-left" v-else>
              <!-- 头像 -->
              <div class="user-pic" @click="goUserHome(item.userId._id)">
                <img :src="$baseUrl + item.userId.imgUrl" alt="" />
              </div>
              <!-- 发送内容 -->
              <div class="msg-content left">
                <!-- 如果是在群聊里面，所有人都要带昵称 -->
                <div class="nick">{{ item.userId.nick }}</div>
                <div class="msg-del">
                  <!-- 文字 -->
                  <div class="bubble bubble-left" v-if="item.msgType == 0">
                    {{ item.message }}
                  </div>
                  <!-- 图片 -->
                  <div class="bubble bubble-left" v-else>
                    <div class="msg-pic" @click="lookPic(item.message)">
                      <van-image
                        height="3rem"
                        lazy-load
                        fit="cover"
                        :src="$baseUrl + item.message"
                      />
                    </div>
                  </div>
                  <!-- 时间 -->
                  <div class="msg-time">{{ item.time }}</div>
                </div>
              </div>
            </div>
          </li>
        </ul>
      </van-pull-refresh>
    </div>
    <!-- 底部输入框 -->
    <div class="bottom" :class="!emojiShow ? 'bottom-hidden' : ''">
      <!-- 发送框和发送按钮 -->
      <div class="bottom-input">
        <input type="text" v-model="value" />
        <div class="send-btn" @click="sendMsg">
          <img src="@/assets/icon/A2.png" alt="" />
        </div>
      </div>
      <div class="bottom-other">
        <img
          class="emoji"
          @click="emojiShow = !emojiShow"
          src="@/assets/icon/A.png"
          alt=""
        />
        <van-uploader
          multiple
          :max-count="9"
          accept="image/png, image/jpeg, image/jpg"
          :after-read="afterRead"
          :before-read="handleBeforeUpload"
          @click-upload="emojiShow = false"
        >
          <img src="@/assets/icon/A1.png" alt="" />
        </van-uploader>
      </div>
      <div class="bottom-emoji">
        <EmojiList @emoji="handleEmoji" />
      </div>
    </div>
  </div>
</template>

<script>
import EmojiList from "@/components/EmojiList/index.vue";
import { ImagePreview, Toast } from "vant";
import { mapState } from "vuex";
import { formatDate } from "@/utils/timeFormat";
import { mixins } from "@/mixins/compressImage";
export default {
  mixins: [mixins],
  props: ["isDisabled", "dataList"],
  components: {
    EmojiList,
  },
  data() {
    return {
      value: "",
      emojiShow: false, //emoji弹出框
      isLoading: false, //是否在下拉刷新
      chatType: this.$route.params.type, // 聊天类型（私聊、群聊）
      newMessage: this.$store.state.socket.message,
      isRefreshing: false,
      RefreshLocation: [],
    };
  },
  methods: {
    //上传图片之后发送图片
    async afterRead(file) {
      if (this.chatType == "friendChat") {
        //私聊
        if (!file.length) {
          let fileImg = new File([file.file], file.file.name, {
            type: "image/jpeg",
          });
          //单照片
          let form = new FormData();
          form.append("img", fileImg);
          let result = await this.$API.reqPrivateUploadPhoto(form);
          if (result.status == 200) {
            let dataMsg = {
              userId: {
                _id: this.userId,
                nick: this.nick,
                imgUrl: this.imgUrl,
              },
              msgType: 1,
              message: result.url,
              time: formatDate(new Date()),
              fromId: this.userId,
              toId: this.$route.query.id,
            };
            this.dataList.push(dataMsg);
            this.sendPrivateChat(dataMsg);
          } else {
            Toast("发送失败");
          }
        } else {
          //多照片
          let fileImgs = file.map((item) => {
            return new File([item.file], item.file.name, {
              type: "image/jpeg",
            });
          });
          let form = new FormData();
          for (let f of fileImgs) {
            form.append("imgs", f);
          }
          let result = await this.$API.reqPrivateUploadPhotos(form);
          if (result.status == 200) {
            for (let f of result.url) {
              let dataMsg = {
                userId: {
                  _id: this.userId,
                  nick: this.nick,
                  imgUrl: this.imgUrl,
                },
                msgType: 1,
                message: f, //遍历后存进数据库
                time: formatDate(new Date()),
                fromId: this.userId,
                toId: this.$route.query.id,
              };
              this.dataList.push(dataMsg);
              this.sendPrivateChat(dataMsg);
            }
          } else {
            Toast("发送失败");
          }
        }
      } else {
        //群聊
        if (!file.length) {
          let fileImg = new File([file.file], file.file.name, {
            type: "image/jpeg",
          });
          //单照片
          let form = new FormData();
          form.append("img", fileImg);
          let result = await this.$API.reqGroupUploadPhoto(form);
          if (result.status == 200) {
            let dataMsg = {
              userId: {
                _id: this.userId,
                nick: this.nick,
                imgUrl: this.imgUrl,
              },
              msgType: 1,
              message: result.url,
              time: formatDate(new Date()),
              fromId: this.userId,
              toId: this.$route.query.id,
            };
            this.dataList.push(dataMsg);
            this.sendGroupChat(dataMsg);
          } else {
            Toast("发送失败");
          }
        } else {
          //多照片
          let fileImgs = file.map((item) => {
            return new File([item.file], item.file.name, {
              type: "image/jpeg",
            });
          });
          let form = new FormData();
          for (let f of fileImgs) {
            form.append("imgs", f);
          }
          let result = await this.$API.reqGroupUploadPhotos(form);
          if (result.status == 200) {
            for (let f of result.url) {
              let dataMsg = {
                userId: {
                  _id: this.userId,
                  nick: this.nick,
                  imgUrl: this.imgUrl,
                },
                msgType: 1,
                message: f, //遍历后存进数据库
                time: formatDate(new Date()),
                fromId: this.userId,
                toId: this.$route.query.id,
              };
              this.dataList.push(dataMsg);
              this.sendGroupChat(dataMsg);
            }
          } else {
            Toast("发送失败");
          }
        }
      }
    },
    //传emoji表情
    handleEmoji(emoji) {
      this.value = this.value + emoji;
    },
    //刷新加载更多记录
    onRefresh() {
      this.isRefreshing = true;
      this.$parent.pageNum += 1;
      if (this.chatType == "friendChat") {
        //私聊
        this.$parent.getPrivateList(this.$parent.pageNum);
      } else {
        //群聊
        this.$parent.getGroupList(this.$parent.pageNum);
      }
      setTimeout(() => {
        this.isLoading = false;
      }, 1000);
    },
    lookPic(photos) {
      ImagePreview({
        images: [this.$baseUrl + photos],
        closeable: false,
        loop: false,
        showIndex: false,
      });
    },
    //点击头像去主页
    goUserHome(id) {
      let route = {
        path: "/userhome",
        query: {
          _id: id,
        },
      };
      this.$router.push(route);
    },
    //发送文字消息
    sendMsg() {
      if (!this.value) {
        Toast("消息内容不能为空");
        return;
      }
      let dataMsg = {
        userId: {
          _id: this.userId,
          nick: this.nick,
          imgUrl: this.imgUrl,
        },
        msgType: 0,
        message: this.value,
        time: formatDate(new Date()),
        fromId: this.userId,
        toId: this.$route.query.id,
      };
      this.dataList.push(dataMsg);
      if (this.chatType == "friendChat") {
        this.sendPrivateChat(dataMsg);
      } else {
        this.sendGroupChat(dataMsg);
      }
      this.value = "";
      this.emojiShow = false; //发送后关闭表情框
    },
    //发送私聊信息
    sendPrivateChat(dataMsg) {
      this.$socket.emit(
        "private_chat",
        dataMsg,
        this.userId,
        this.$route.query.id
      );
    },
    //发送群聊信息
    sendGroupChat(dataMsg) {
      this.$socket.emit(
        "group_chat",
        dataMsg,
        this.userId,
        this.$route.query.id
      );
    },
    //回车键发送消息
    enterSendMsg(e) {
      if (e.keyCode == 13) {
        this.sendMsg();
      }
    },
  },
  computed: {
    ...mapState({
      userId: (state) => state.user.userInfo._id,
      nick: (state) => state.user.userInfo.nick,
      imgUrl: (state) => state.user.userInfo.imgUrl,
    }),
  },
  watch: {
    //发一条消息，界面向上移动
    newMessage(value) {
      this.dataList.push(value.slice(-1)[0]);
    },
    //刷新后页面停留
    dataList() {
      //记录刷新前的位置
      this.$nextTick(() => {
        this.RefreshLocation.unshift(this.$refs.msgContent.scrollHeight);
        if (this.isRefreshing) {
          //刷新加载
          this.$refs.msgContent.scrollTop =
            this.RefreshLocation[0] - this.RefreshLocation[1];
          this.isRefreshing = false;
        } else {
          //首次加载
          this.$refs.msgContent.scrollTop = this.$refs.msgContent.scrollHeight;
        }
      });
    },
  },
  created() {
    window.addEventListener("keydown", this.enterSendMsg, true);
  },
  beforeDestroy() {
    window.removeEventListener("keydown", this.enterSendMsg, true);
  },
};
</script>

<style lang="less" scoped>
.bottom {
  width: 100%;
  position: fixed;
  bottom: 0;
  left: 0;
  background-color: #f8f8f8;
  border-top: 0.04rem solid #dbdada;
  box-sizing: border-box;
  padding: 0.2rem 0.2667rem;
  transition: all 200ms linear;
  &.bottom-hidden {
    bottom: -4.4rem;
  }
  .bottom-input {
    display: flex;
    input {
      width: 100%;
      border: none;
      height: 0.9333rem;
      font-size: 0.4rem;
      padding: 0 0.2rem;
      border-radius: 0.1333rem;
    }
    .send-btn {
      width: 1.6rem;
      height: 0.9333rem;
      background-color: #b6e2f9;
      margin-left: 0.2667rem;
      border-radius: 0.1333rem;
      display: flex;
      justify-content: center;
      align-items: center;
      img {
        width: 0.8rem;
        height: 0.8rem;
      }
    }
  }
  .bottom-other {
    width: 100%;
    height: 0.8rem;
    margin-top: 0.2667rem;
    display: flex;
    align-items: center;
    img {
      width: 0.8rem;
      height: 0.8rem;
    }
    .emoji {
      margin-right: 0.1333rem;
    }
  }
  .bottom-emoji {
    width: 100%;
    height: 4rem;
    margin-top: 0.2667rem;
    overflow: auto;
    scrollbar-width: none;
    -ms-overflow-style: none;
    border-top: 0.0133rem solid #dddddd;
  }
}
.bottom-emoji::-webkit-scrollbar {
  display: none;
}
.message-content::-webkit-scrollbar {
  display: none;
}
.message-content {
  width: 100%;
  height: 100vh;
  padding: 1.3333rem 0 2rem 0;
  box-sizing: border-box;
  background-color: #f1f1f1;
  overflow: auto;
  scrollbar-width: none;
  -ms-overflow-style: none;
  .message-list-content {
    padding: 0.4rem 0.3333rem;
    box-sizing: border-box;
    .me,
    .other {
      width: 100%;
      min-height: 1.2667rem;
      margin-bottom: 0.5333rem;
      display: flex;
      .user-pic {
        width: 1.2667rem;
        height: 1.2667rem;
        border-radius: 50%;
        overflow: hidden;
        img {
          width: 100%;
          height: 100%;
        }
      }
      .msg-content {
        display: flex;
        flex-direction: column;
        .msg-del {
          display: flex;
          .bubble {
            max-width: 6rem;
            min-height: 1.2667rem;
            margin: 0.1333rem 0;
            line-height: 0.6667rem;
            white-space: pre-wrap;
            word-break: break-all;
            word-wrap: break-word;
            border-radius: 0.1333rem;
            padding: 0.333rem 0.2rem;
            box-sizing: border-box;
            font-size: 0.4rem;
            display: flex;
            align-items: center;
            .msg-pic {
              img {
                width: 100%;
              }
            }
          }
          .bubble-left {
            background-image: linear-gradient(to right, #cdd6f2, #e2e2e5);
            margin-left: 0.2667rem;
          }
          .bubble-right {
            background-image: linear-gradient(to right, #498adf, #61cffb);
            margin-right: 0.2667rem;
          }
          .msg-time {
            align-self: flex-end;
            padding: 0.2rem 0.1333rem;
          }
        }
      }
      .right {
        align-items: flex-end;
        .nick {
          margin-right: 0.2667rem;
        }
      }
      .left {
        align-items: flex-start;
        .nick {
          margin-left: 0.2667rem;
        }
      }
    }
  }
  .msg-box-right {
    justify-content: flex-end;
  }
  .msg-box-left {
  }
}
</style>