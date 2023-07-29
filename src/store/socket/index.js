import { formatDate } from "@/utils/timeFormat";
export const state = {
    message: [],
}
export const mutations = {
    //私聊
    SOCKET_private_chat(state, data) {
        data.time = formatDate(data.time)
        state.message.push(data)
    },
    //群聊
    SOCKET_group_chat(state, data) {
        data.time = formatDate(data.time)
        state.message.push(data)
    },


}
export const actions = {
}
export default {
    state,
    mutations,
    actions
}