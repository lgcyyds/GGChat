<template>
    <div>
        <NavTop>
            <div class="navtop-title">404</div>
        </NavTop>
        <div class="undefined"></div>
        <h1 class="title">页面找不到了QAQ~ <span @click="$router.push('/message')">去主页</span></h1>
    </div>
</template>

<script>
import NavTop from '@/components/NavTop/index.vue'
export default {
    components: {
        NavTop
    }
}
</script>

<style lang="less" scoped>
.undefined {
    width: 100%;
    height: 10.6667rem;
    background-image: url('@/assets/images/404.png');
    background-repeat: no-repeat;
    background-size: contain;
    background-position: center;
}
.title {
    width: 100%;
    height: .6667rem;
    text-align: center;
    line-height: .6667rem;
    font-size: .4rem;
    span {
        color: #227bac;
    }
}
</style>