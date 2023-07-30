<template>
  <div class="message-list">
    <!-- 下拉刷新 -->
    <van-pull-refresh
      v-model="isLoading"
      @refresh="onRefresh"
      style="height: 100%"
    >
      <div class="message-list-content">
        <!-- 搜索框 -->
        <SearchInput></SearchInput>
        <!-- 消息列表 -->
        <!-- 空状态 -->
        <van-empty
          v-if="!messageList"
          class="empty-image"
          image-size="5.3333rem"
          image="https://preview.qiantucdn.com/ing/96/52/73/08P58PICMTDXicDnkUisK_PIC2018.jpg%21qt324_nowater_jpg"
        />
        <!-- 消息列表不为空 -->
        <ul v-else>
          <li
            @click="goMsgDetails(item._id, item.type)"
            v-for="(item, index) in messageList"
            :key="index"
          >
            <div class="user-pic">
              <img :src="$baseUrl + item.imgUrl" alt="" />
            </div>
            <div class="list-info">
              <div class="info-top">
                <div class="user-nick">
                  {{ item.type == "friendChat" ? item.nick : item.groupName }}
                </div>
                <div class="time">{{ item.lastMessage.time }}</div>
              </div>
              <div class="info-bottom">
                <!-- 文字 -->
                <div class="message-text" v-if="item.lastMessage.msgType == 0">
                  {{ item.lastMessage.message }}
                </div>
                <!-- 图片 -->
                <div class="message-text pic" v-else>[图片]</div>
                <!-- 已读或者未读 -->
                <div class="dots" v-show="item.unreadMsgCounts">
                  {{ item.unreadMsgCounts }}
                </div>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </van-pull-refresh>
  </div>
</template>

<script>
import SearchInput from "@/components/SearchInput/index.vue";
import { mapState } from "vuex";
import { formatDate } from "@/utils/timeFormat";
export default {
  components: {
    SearchInput,
  },
  data() {
    return {
      count: 0,
      isLoading: false,
      messageList: [],
    };
  },
  methods: {
    onRefresh() {
      setTimeout(() => {
        this.getMessageList();
        this.isLoading = false;
      }, 1000);
    },
    //获取消息列表
    async getMessageList() {
      let userId = this.userId;
      let unreadNum = 0;
      let result = await this.$API.reqGetMessageList({ userId });
      if (result.status == 200) {
        result.data.forEach((i) => {
          i.lastMessage.time = formatDate(i.lastMessage.time);
          if (i.unreadMsgCounts) {
            unreadNum += i.unreadMsgCounts;
          }
        });        
        this.$store.commit("setUnReadNum", unreadNum);
        this.messageList = result.data;
      }
    },
    goMsgDetails(id, type) {
      let route = {
        path: "/MessageDetail/" + type,
        query: {
          id,
        },
      };
      this.$router.push(route);
    },
  },
  computed: {
    ...mapState({ userId: (state) => state.user.userInfo._id }),
  },
  mounted() {
    this.getMessageList();
  },
  sockets: {
    unread_message() {
      this.getMessageList();
    },
  },
};
</script>

<style lang="less" scoped>
.message-list {
  width: 100%;
  height: 100vh;
  // min-height: 100%;
  padding: 1.3333rem 0.4rem 1.3333rem;
  box-sizing: border-box;

  .message-list-content::-webkit-scrollbar {
    display: none;
  }

  .message-list-content {
    width: 100%;
    height: 100%;
    padding-top: 0.2667rem;
    box-sizing: border-box;
    overflow: auto;
    scrollbar-width: none;
    -ms-overflow-style: none;

    .van-empty {
      padding: 2.6667rem;
    }

    ul {
      width: 100%;

      li {
        width: 100%;
        height: 1.8027rem;
        display: flex;
        align-items: center;

        .user-pic {
          width: 1.2667rem;
          height: 1.2667rem;
          border-radius: 50%;
          margin-right: 0.2667rem;
          overflow: hidden;

          img {
            width: 100%;
            height: 100%;
          }
        }

        .list-info {
          flex: 1;
          height: 1.2667rem;
          display: flex;
          flex-direction: column;
          justify-content: center;
          overflow: hidden;

          .info-top {
            width: 100%;
            display: flex;
            align-items: center;
            // justify-content: center;
            flex: 1;

            .user-nick {
              font-size: 0.4rem;
              flex: 1;
            }
          }

          .info-bottom {
            width: 100%;
            height: 0.5rem;
            display: flex;
            justify-content: space-between;
            align-items: center;

            .message-text {
              width: 100%;
              height: 0.5rem;
              overflow: hidden;
              flex: 1;
              font-size: 0.3333rem;
              line-height: 0.5rem;
            }

            .pic {
              color: #9f9f9f;
            }

            .dots {
              width: 0.5rem;
              height: 0.5rem;
              background-color: #f06262;
              border-radius: 50%;
              display: flex;
              justify-content: center;
              align-items: center;
              color: #fff;
            }
          }
        }
      }
    }
  }
}
</style>