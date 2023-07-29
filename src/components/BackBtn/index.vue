<template>
  <div>
    <van-icon name="arrow-left" class="back-btn" @click="backBtn"/>
  </div>
</template>

<script>
export default {
    props:['path'],
    methods:{
        backBtn(){
            if(this.path){
                this.$router.push(`/${this.path}`)
            }else{
                this.$router.go(-1)
            }
        }
    }
}
</script>

<style lang="less" scoped>
.back-btn{
    position: fixed;
    left: .4rem;
    top: .4rem;
    font-size: .5333rem;
    color: #fff;
    font-weight: 600;
}
</style>