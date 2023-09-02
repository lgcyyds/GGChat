<template>
  <div>
    <!-- 动态列表 -->
    <ul class="space-content" v-if="SpaceList.length">
      <li v-for="(item, index) in SpaceList" :key="index" ref="spaceListItem">
        <!-- 用户信息 -->
        <div class="user-info">
          <!-- 用户头像 -->
          <div class="user-pic" @click="goUserSpaceDetail(item)">
            <img :src="$baseUrl + item.userId.imgUrl" alt="" />
          </div>
          <!-- 用户姓名和发布时间 -->
          <div class="user">
            <div class="user-nick">{{ item.userId.nick }}</div>
            <div class="time">{{ item.time }}</div>
          </div>
          <!-- 删除按钮 -->
          <van-icon
            name="delete-o"
            class="del-space"
            v-if="item.userId._id == $store.state.user.userInfo._id"
            @click="delSpace(item._id, index)"
          />
        </div>
        <!-- 动态文字 -->
        <div class="space-text">{{ item.textDesc }}</div>
        <!-- 图片内容 -->
        <ul class="pic-content">
          <!-- 这里用li背景来做照片墙 -->
          <li
            class="img-content"
            :class="index > 2 ? 'lazy' : ''"
            v-for="(photo, indexPic) in item.photos"
            :key="indexPic"
            @click="showAllPic(item.photos, indexPic)"
            :data-bg-url="`${$baseUrl + photo}`"
          ></li>
        </ul>
        <!-- :style="`background-image: url(${$baseUrl + photo})`" -->
      </li>
    </ul>
    <!-- 暂无数据 -->
    <div class="nomore" v-else>
      <img src="@/assets/images/no_space.png" alt="" />
      <div class="nomore-text">暂无数据</div>
    </div>
  </div>
</template>

<script>
import { ImagePreview, Dialog, Toast } from "vant";
import _ from "lodash";
export default {
  props: ["SpaceList"],
  methods: {
    // 图片预览
    showAllPic(photos, index) {
      let imgs = photos.map((photo) => {
        return `${this.$baseUrl + photo}`;
      });
      ImagePreview({
        images: imgs,
        startPosition: index,
        closeable: true,
        loop: false,
      });
    },
    // 删除动态
    delSpace(_id, index) {
      Dialog.confirm({
        message: "确认删除吗？",
      })
        .then(async () => {
          //调用删除接口
          try {
            let result = await this.$API.reqDelSpace({ _id });
            if (result.status == 200) {
              Toast(result.msg);
              this.SpaceList.splice(index, 1);
            }
          } catch (error) {
            console.log(error);
          }
        })
        .catch(() => {
          //取消
          return;
        });
    },
    //点击头像去空间
    goUserSpaceDetail(item) {
      //路由跳转
      let route = {
        path: "/userHome",
        query: {
          _id: item.userId._id,
        },
      };
      this.$router.push(route);
    },
    //懒加载，只有到可视窗口才发送图片请求
    imgLazyLoading: _.throttle(() => {
      // 检查所有需要懒加载的 li 元素
      var lazyLiElements = document.querySelectorAll(".lazy");

      lazyLiElements.forEach(function (lazyLi) {
        // 判断 li 元素是否在视野内
        if (lazyLi.getBoundingClientRect().top < window.innerHeight) {
          // 加载背景图片
          lazyLi.style.backgroundImage = "url(" + lazyLi.dataset.bgUrl + ")";
          lazyLi.classList.remove("lazy");
        }
      });
    }, 400),
    //前三条动态的图片不需要懒加载
    noLazyLoading() {
      this.$refs.spaceListItem.slice(0, 3).forEach((liElements) => {
        liElements.querySelectorAll(".img-content").forEach((picLi) => {
          picLi.style.backgroundImage = "url(" + picLi.dataset.bgUrl + ")";
        });
      });
    },
  },
};
</script>

<style lang="less" scoped>
.space-content {
  width: 100%;

  & > li {
    width: 100%;
    padding: 0.4rem 0.3333rem;
    box-sizing: border-box;
    margin-bottom: 0.2667rem;

    .user-info {
      width: 100%;
      height: 1.0667rem;
      display: flex;
      align-items: center;
      margin-bottom: 0.4rem;

      .user-pic {
        width: 1.0667rem;
        height: 1.0667rem;
        border-radius: 50%;
        overflow: hidden;
        margin-right: 0.3333rem;

        img {
          width: 100%;
          height: 100%;
        }
      }

      .user {
        height: 100%;
        display: flex;
        flex: 1;
        flex-direction: column;
        justify-content: space-around;

        .user-nick {
          font-size: 0.4rem;
        }

        .time {
          font-size: 0.3333rem;
          color: #858585;
        }
      }

      .del-space {
        font-size: 0.4667rem;
        align-self: flex-start;
      }
    }

    .space-text {
      font-size: 0.4rem;
      line-height: 0.5333rem;
      margin-bottom: 0.4rem;
    }

    .pic-content {
      width: 100%;
      margin-bottom: 0.1333rem;
      display: flex;
      flex-wrap: wrap;

      .img-content {
        width: 31.8%;
        padding-bottom: 32%;
        overflow: hidden;
        margin: 0.0667rem;
        box-sizing: border-box;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 0.2rem;
        // background-image: url('../../assets/images/1.jpg');
        background-size: cover;
        background-repeat: no-repeat;
        background-position: center;
      }
    }
  }
}

.nomore {
  width: 100%;
  height: 9.3333rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding-top: 1.6667rem;

  .nomore-text {
    margin-top: 0.2667rem;
    font-size: 0.3733rem;
    color: #858585;
  }
}
</style>