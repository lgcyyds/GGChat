export const state = {
    friendNoticeNum: 0,
    groupNoticeNum: 0,
    unReadNum:0
}
export const mutations = {
    //登录的时候就要查一次申请信息
    SOCKET_notice_num(state, data) {
        state.friendNoticeNum = data.friendNoticeNum
        state.groupNoticeNum = data.groupNoticeNum
    },
    //好友申请
    SOCKET_apply_notice(state, data) {
        state.friendNoticeNum = data.friendNoticeNum
        state.groupNoticeNum = data.groupNoticeNum
    },
    // 更改数量
    updateFriendNoticeNum(state) {
        state.friendNoticeNum = state.friendNoticeNum - 1
    },
    updateGroupNoticeNum(state) {
        state.groupNoticeNum = state.groupNoticeNum - 1
    },
    //tabber底部未读消息数
    setUnReadNum(state,num){
        state.unReadNum = num
    }

}
export const actions = {

}
export const getters = {
    friendNum() {
        return state.friendNoticeNum
    },
    groupNum() {
        return state.groupNoticeNum?.[0]?.totalNum || 0//因为有可能不存在该属性
    },
}
export default {
    state,
    mutations,
    actions,
    getters
}