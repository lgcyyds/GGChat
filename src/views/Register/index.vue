<template>
  <div>
    <NavTop>
      <div class="navtop-title">注册</div>
    </NavTop>
    <BackBtn />
    <UserInfoForm/>
  </div>
</template>

<script>
import NavTop from "@/components/NavTop";
import BackBtn from "@/components/BackBtn";
import UserInfoForm from "@/components/UserInfoForm";
export default {
  components:{
    NavTop,
    BackBtn,
    UserInfoForm
  }
};
</script>

<style lang="less" scoped>
</style>