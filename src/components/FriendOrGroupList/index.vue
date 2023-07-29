<template>
  <div class="list-content">
    <!-- 好友/群列表 -->
    <ul class="list-all-item">
      <li class="list-item" v-for="(item, index) in dataList" :key="index" @click="goDetail(item._id)">
        <!-- 头像 -->
        <div class="user-pic">
          <img :src="$baseUrl + item.imgUrl" alt="" />
        </div>
        <!-- 好友 -->
        <div class="list-info" v-if="!ListType">
          <div class="user-nick">
            {{ !ListType ? item.nick : item.groupName }}
          </div>
          <div class="message-text" v-if="!ListType">
            <img src="@/assets//images/comment.png" alt="" />
            个性签名：{{ item.sign }}
          </div>
        </div>
        <!-- 群聊列表 -->
        <div class="group-name" v-else>
          {{ !ListType ? item.nick : item.groupName }}
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  props: ["ListType", "dataList"],
  methods:{
    goDetail(id){
      if(!this.ListType){
        let route = {
          path: "/userhome",
          query: {
            _id: id,
          },
        };
        this.$router.push(route);
      }else{
        let route = {
          path: "/grouphome",
          query: {
            _id: id,
          },
        };
        this.$router.push(route);
      }
    }
  }
};
</script>

<style lang="less" scoped>
.list-content {
  width: 100%;

  .list-item {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    margin: 0.2667rem 0;
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

    .list-info,
    .group-name {
      display: flex;
      flex-direction: column;
      justify-content: space-around;
      flex: 1;
      text-overflow: ellipsis; //文字内容溢出时，显示...,需要配合下面两条使用
      overflow: hidden;
      white-space: nowrap;
      height: 1.2667rem;
      max-width: 7.6rem;

      .user-nick {
        font-size: 0.4rem;
      }

      .message-text {
        max-width: 7.6rem;
        font-size: 0.3333rem;
        display: flex;
        align-items: center;
        text-overflow: ellipsis; //文字内容溢出时，显示...,需要配合下面两条使用
        overflow: hidden;
        white-space: nowrap;

        img {
          width: 0.4rem;
          height: 0.4rem;
          margin-right: 0.0667rem;
        }
      }
    }

    .group-name {
      font-size: 0.4rem;
    }
  }
}
</style>