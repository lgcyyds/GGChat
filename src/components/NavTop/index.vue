<template>
    <div class="navtop">
        <slot></slot>
    </div>
</template>

<script>
export default {

}
</script>

<style lang="less" scoped>
.navtop{
    width: 100%;
    height: 1.3333rem;
    background: linear-gradient(to left,#00c3ff, #339afb);//顶部渐变色
}
.navtop-title {
    text-align: center;
    line-height: 1.3333rem;
    color: #fff;
    font-size: .4667rem;
}
</style>