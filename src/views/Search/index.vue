<template>
  <div>
    <NavTop class="search-Nav-Top">
      <BackBtn></BackBtn>
      <span>添加好友/群</span>
    </NavTop>
    <div class="content">
      <div class="search-input">
        <van-field
          v-model="keyword"
          placeholder="请输入联系人/群名称"
          input-align="center"
          @blur="search"
        />
      </div>
      <!-- 加载中 -->
      <div class="loading-content" v-show="isLoading">
        <van-loading
          type="spinner"
          color="##838383"
          vertical
          size="0.64rem"
          text-color="#838383"
          >加载中...</van-loading
        >
      </div>
      <!-- 搜索后的结果列表 -->
      <div class="search-result-content" v-show="!isLoading">
        <!-- 搜得到数据 -->
        <div class="have-result" v-if="searchResult">
          <div class="result" v-show="friendList.length">
            <van-divider>联系人</van-divider>
            <FriendOrGroupList
              :dataList="friendList"
              :ListType="0"
            ></FriendOrGroupList>
          </div>
          <div class="result" v-show="groupList.length">
            <van-divider>群聊</van-divider>
            <FriendOrGroupList
              :dataList="groupList"
              :ListType="1"
            ></FriendOrGroupList>
          </div>
        </div>
        <!-- 搜不到数据 -->
        <div class="no-result" v-else>暂无更多...</div>
      </div>
    </div>
  </div>
</template>

<script>
import NavTop from "@/components/NavTop/index.vue";
import FriendOrGroupList from "@/components/FriendOrGroupList/index.vue";
import BackBtn from "@/components/BackBtn/index.vue";
import { mapMutations, mapState } from "vuex";
export default {
  components: {
    NavTop,
    FriendOrGroupList,
    BackBtn,
  },
  data() {
    return {
      isLoading: false,
      keyword: "", //输入框内容
      friendList: [],
      groupList: [],
      searchResult: false, //搜得到数据就是true
    };
  },
  methods: {
    //输入框搜索
    async search() {
      this.isLoading = true;
      let results = await this.$API.reqSearch({ keyword: this.keyword });
      this.isLoading = false;
      if (results.status == 200) {
        this.searchResult = true;
        this.friendList = results.data.friendList;
        this.groupList = results.data.groupList;
      } else {
        this.searchResult = false;
      }
    },
    ...mapMutations(["setSearchKeyWord", "clearSearchKeyWord"]),
  },
  computed: {
    ...mapState({ keywordVuex: (state) => state.search.keyword }),
  },
  mounted(){
    this.keyword=this.keywordVuex
    this.search()
  },
  beforeRouteLeave(to, from, next) {
    if (to.path == "/userhome" || to.path == "/grouphome") {
        this.setSearchKeyWord(this.keyword)
        next()
    }else{
        this.clearSearchKeyWord()
        next()
    }
  },
};
</script>

<style lang="less" scoped>
.search-Nav-Top {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 999;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #fff;
  font-size: 0.4667rem;
}
.content {
  width: 100%;
  height: 100vh;
  padding: 1.5999rem 0.4rem 0rem;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  .search-input {
    width: 100%;
    height: 0.9333rem;
    padding: 0 0.4rem;
    box-sizing: border-box;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 0.1333rem;
    margin-bottom: 0.2667rem;
    background-color: #f6f6f6;
    span {
      font-size: 0.4rem;
      color: #838383;
    }
  }
  .search-result-content {
    width: 100%;
    flex: 1;
    overflow: auto;
    box-sizing: border-box;
  }
}
.result {
  .title {
    color: #838383;
    font-size: 0.4rem;
  }
}
.van-cell {
  background-color: transparent;
}
.van-divider {
  margin: 0.1333rem 0px;
}
.no-result {
  width: 100%;
  height: 1rem;
  padding-top: 0.2667rem;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #818181;
  font-size: 0.4rem;
}
</style>