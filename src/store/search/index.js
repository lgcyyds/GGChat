//为了保存搜索页的数据，就是跳转之后回来数据还在
const state = {
    keyword:''
}
const mutations = {
    setSearchKeyWord(state, keyword){
        state.keyword = keyword
    },
    clearSearchKeyWord(state){
        state.keyword = ''
    }
}
const actions = {

}
export default{
    state,
    mutations,
    actions
}
