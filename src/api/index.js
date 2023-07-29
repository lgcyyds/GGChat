import requests from './request'


/* ---------------------------------------登录注册接口-------------------------------- */
//登录
export const reqLogin = (userInfo) => requests({ url: '/login', method: 'post', data: userInfo })
// 注册
export const reqRegister = (registerInfo) => requests({ url: '/register', method: 'post', data: registerInfo })

/* ---------------------------------------用户信息接口-------------------------------- */
//获取个人主页信息
export const reqGetUserHome = (Ids) => requests({ url: '/home/user', method: 'get', params: Ids })
//获取私聊信息
export const reqMessagePageInfo = (Ids) => requests({ url: '/message/friend', method: 'get', params: Ids })
//更新个人信息
export const reqUpdateUserInfo = (newUserInfo) => requests({ url: '/update/user', method: 'post', data: newUserInfo })
//参数在请求头，登录就获取本人信息
export const reqUserInfo = () => requests({ url: '/user/getUserInfo', method: 'get' })
/* ---------------------------------------空间动态接口-------------------------------- */
//发布动态接口
export const reqAddSpace = (obj) => requests({ url: '/space/add', method: 'post', data: obj })
//获取我和我的好友的所有动态
export const reqGetSpaceList = (userId) => requests({ url: '/space/get', method: 'get', params: userId })
//删除动态
export const reqDelSpace = (Id) => requests({ url: '/space/del', method: 'get', params: Id })
//获取从个人主页进去的空间信息
export const reqGetSpaceListDetails = (userId) => requests({ url: 'space/details', method: 'get', params: userId })

/* ---------------------------------------好友接口-------------------------------- */
//加好友
export const reqAddFriend = (Ids) => requests({ url: '/friend/add', method: 'post', data: Ids })
//获取好友列表接口
export const reqGetContactsFriendList = (userId) => requests({ url: '/contacts/friend', method: 'get', params: userId })
// 删除好友
export const reqDelFriend = (Ids) => requests({ url: '/del/friend', method: 'get', params: Ids })
//获取好友申请列表
export const reqGetFriendNoAgree = (userId) => requests({ url: '/get/friend/noagree', method: 'get', params: userId })
//同意好友申请
export const reqAgreeFriendApply = (Ids) => requests({ url: '/friend/agree', method: 'post', params: Ids })

/* ---------------------------------------群相关接口-------------------------------- */
//新建群聊
export const reqCreateGroup = (groupInfo) => requests({ url: '/create/group', method: 'post', data: groupInfo })
//获取群主页信息
export const reqGetGroupHome = (Ids) => requests({ url: '/home/group', method: 'get', params: Ids })
//获取群成员列表
export const reqGetGroupUserList = (groupId) => requests({ url: '/get/groupUser', method: 'get', params: groupId })
//加入群聊
export const reqAddGroup = (Ids) => requests({ url: '/group/add', method: 'post', params: Ids })
//获取联系人页面的群列表
export const reqGetContactsGroupList = (userId) => requests({ url: '/contacts/group', method: 'get', params: userId })
//获取修改时群的初始信息
export const reqGetUpdateGroupInfo = (groupInfo) => requests({ url: '/get/update/group', method: 'get', params: groupInfo })
//编辑群信息
export const reqUpdateGroupInfo = (groupInfo) => requests({ url: '/update/groupInfo', method: 'post', params: groupInfo })
//删除群成员或者群成员退群
export const reqDelGroupUser = (Ids) => requests({ url: '/del/groupUser', method: 'get', params: Ids })
//群主解散群
export const reqDelGroup = (Id) => requests({ url: '/del/group', method: 'get', params: Id })
//获取申请加入群聊信息
export const reqGetGroupNoAgree = (userId) => requests({ url: '/get/group/noagree', method: "get", params: userId })
//同意加入群聊
export const reqAgreeGroupApply = (Ids) => requests({ url: '/group/agree', method: 'post', params: Ids })

/* ---------------------------------------聊天相关接口接口-------------------------------- */
//获取message页面
export const reqGetMessageList = (userId) => requests({ url: 'message/list', method: 'get', params: userId })
//获取好友私聊信息
export const reqGetPrivateList = (Ids) => requests({ url: '/message/friend', method: 'get', params: Ids })
//获取群聊信息
export const reqGetGroupList = (Ids) => requests({ url:'/message/group',method:'get',params:Ids})
// 将好友聊天记录状态设置为已读
export const reqSetMessageRead = (ids) => requests({ url: '/message/read', method: 'get', params: ids })


/* ---------------------------------------图片上传接口-------------------------------- */
//用户头像上传接口
export const reqUploadUserPic = (photo) => requests({ url: '/upload/user_photo/user', method: 'post', data: photo })
//动态多照片上传
export const reqSpaceUploadPhotos = (photos) => requests({ url: '/space/upload/space_photo/photos', method: 'post', data: photos })
//动态单照片上传
export const reqSpaceUploadPhoto = (photo) => requests({ url: '/space/upload/space_photo/photo', method: 'post', data: photo })
//上传群头像
export const reqGroupPic = (photo) => requests({ url: '/upload/group/group_photo/groupUpload', method: 'post', data: photo })
// 私聊图片上传接口
// 单图片
export const reqPrivateUploadPhoto = (form) => requests({ url: '/chat/private/private_photo/photo', method: 'post', data: form })
// 多图片
export const reqPrivateUploadPhotos = (form) => requests({ url: '/chat/private/private_photo/photos', method: 'post', data: form })

// 群聊图片上传接口
// 单图片
export const reqGroupUploadPhoto = (form) => requests({ url: '/chat/group_photo/photo', method: 'post', data: form })
// 多图片
export const reqGroupUploadPhotos = (form) => requests({ url: '/chat/group_photo/photos', method: 'post', data: form })



/* ---------------------------------------搜索接口接口-------------------------------- */

export const reqSearch = (keyword) => requests({ url: '/search', method: 'post', params: keyword })



