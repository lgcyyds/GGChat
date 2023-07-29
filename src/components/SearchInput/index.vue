<template>
  <div class="searchInput" @click="$router.push('/search')">
    <van-icon name="search" size="0.5333rem"/>
    <span>搜索</span>
  </div>
</template>

<script>
export default {

}
</script>

<style lang="less" scoped>
.searchInput{
    width: 100%;
    height: .9333rem;
    background-color: #f6f6f6;
    padding: 0 .4rem;
    box-sizing: border-box;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: .1333rem;
    margin-bottom: .2667rem;
    span{
        font-size: .4rem;
        color: #838383;
    }
}
</style>