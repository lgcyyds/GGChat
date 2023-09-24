<template>
  <div>
    <NavTop style="position: fixed; left: 0; top: 0; z-index: 999">
      <BackBtn />
      <div class="navtop-title">{{ $route.params.type }}</div>
    </NavTop>
    <div class="content">
      <van-form @submit="submitGroupInfo">
        <!-- 头像 -->
        <van-field name="uploader" label="群头像">
          <template #input>
            <van-uploader
              :before-read="handleBeforeUpload"
              v-model="groupInfo.fileList"
              max-count="1"
            />
          </template>
        </van-field>
        <!-- 群昵称 -->
        <van-field
          v-model="groupInfo.groupName"
          name="groupName"
          label="群昵称"
          placeholder="请设置群昵称"
          :rules="[{ required: true }]"
          autocomplete="off"
          maxlength="15"
        />
        <!-- 群简介 -->
        <van-field
          v-model="groupInfo.sign"
          name="sign"
          rows="2"
          autosize
          label="群简介"
          type="textarea"
          maxlength="50"
          placeholder="请输入群简介"
          show-word-limit
        />
        <!-- 底部按钮 -->
        <div class="bottom-btn">
          <van-button round block type="info" native-type="submit"
            >保存</van-button
          >
        </div>
      </van-form>
      <!-- 群成员列表 -->
      <div class="group-user-content" v-if="$route.params.type == '编辑群信息'">
        <div class="content-title">
          群成员管理（{{ groupUserList.length }}人）
        </div>
        <ul>
          <li v-for="(item, index) in groupUserList" :key="index">
            <div class="user-pic">
              <img :src="$baseUrl + item.userId.imgUrl" alt="" />
            </div>
            <div class="user-nick">{{ item.userId.nick }}</div>
            <van-icon
              name="delete-o"
              class="del-user"
              size=".4667rem"
              @click="delGroupMember(item.userId._id)"
            ></van-icon>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import NavTop from "@/components/NavTop/index.vue";
import BackBtn from "@/components/BackBtn/index.vue";
import { Toast, Dialog } from "vant";
import { mapState } from "vuex";
import { reqDelFriend } from "@/api";
import { mixins } from "@/mixins/compressImage";
export default {
  components: {
    NavTop,
    BackBtn,
  },
  mixins: [mixins],
  data() {
    return {
      groupInfo: {
        groupName: "", //群昵称
        sign: "", //群简介
        fileList: [], //群头像
      },
      groupImgUrl: "",
      groupUserList: [], //成员列表
    };
  },
  methods: {
    //上传群头像
    async upLoadImg(param, values) {
      if(!param){
        this.onSubmit(values);
        return
      }
      param.status = "uploading";
      param.message = "上传中...";
      let file = new File([param], param.name, { type: "image/jpeg" });
      let form = new FormData();
      form.append("img", file);
      try {
        let result = await this.$API.reqGroupPic(form);
        if (result.status == 200) {
          param.status = "done";
          param.message = "上传成功";
          this.groupImgUrl = result.url;
          Toast("头像上传成功");
          this.onSubmit(values);
        } else {
          param.status = "failed";
          param.message = "上传失败";
        }
      } catch (error) {
        param.status = "failed";
        param.message = "上传失败";
      }
    },
    async onSubmit(values) {
      if (this.$route.params.type === "新建群聊") {
        let groupInfo = {
          userId: this.userId,
          groupName: values.groupName,
          sign: values.sign,
          imgUrl: this.groupImgUrl == "" ? "/group_pic.png" : this.groupImgUrl,
        };
        try {
          let result = await this.$API.reqCreateGroup(groupInfo);
          if (result.status == 200) {
            Toast("创建成功");
            setTimeout(() => {
              this.$router.push("/message");
            }, 1000);
          } else {
            Toast("创建失败");
          }
        } catch (error) {
          Toast("创建失败");
        }
      } else {
        //更新群信息
        let _id = this.$route.query.groupId;
        let groupInfo = {
          _id,
          groupName: values.groupName,
          sign: values.sign,
          imgUrl: this.groupImgUrl == "" ? "/group_pic.png" : this.groupImgUrl,
        };
        try {
          let result = await this.$API.reqUpdateGroupInfo(groupInfo);
          if (result.status == 200) {
            Toast(result.msg);
            setTimeout(() => {
              this.$router.go(-1);
            }, 1000);
          }
        } catch (error) {
          Toast("修改失败");
        }
      }
    },
    //编辑群聊时的初始群信息
    async getOldGroupList() {
      let { groupId } = this.$route.query;
      let groupInfo = {
        groupId,
        groupLeaderId: this.userId,
      };
      let result = await this.$API.reqGetUpdateGroupInfo(groupInfo);
      if (result.status == 200) {
        Object.assign(this.groupInfo, result.data.groupInfo); //原始信息
        this.groupImgUrl = result.data.groupInfo.imgUrl; //原始头像
        this.groupInfo.fileList = [{ url: this.$baseUrl + this.groupImgUrl }]; //原始头像显示
        this.groupUserList = [...result.data.groupMemberList]; //群成员列表
      }
    },
    //移除成员
    delGroupMember(userId) {
      const VueComponent = this;
      //移除成员回调
      async function beforeClose(action, done) {
        let { groupId } = VueComponent.$route.query;
        let Ids = {
          userId,
          groupId,
        };
        if (action === "confirm") {
          let result = await this.$API.reqDelGroupUser(Ids);
          if (result.status == 200) {
            VueComponent.getOldGroupList();
            done();
            Toast("移除成功！");
          } else {
            done();
          }
          done();
        } else {
          done();
        }
      }
      Dialog.confirm({
        message: "确认移除该成员？",
        confirmButtonText: "移除",
        confirmButtonColor: "#ff0000",
        beforeClose,
      }).catch(() => {});
    },
    //退出群聊

    //点击保存
    submitGroupInfo(values) {
      this.upLoadImg(this.groupInfo.fileList[0].file, values);      
    },
  },
  computed: {
    ...mapState({ userId: (state) => state.user.userInfo._id }),
  },
  mounted() {
    if (this.$route.params.type === "编辑群信息") {
      this.getOldGroupList();
    }
  },
};
</script>

<style lang="less" scoped>
.content {
  padding-top: 1.3333rem;
}
.bottom-btn {
  width: 100%;
  padding: 0.2rem 0.2rem;
  box-sizing: border-box;
  position: fixed;
  left: 0;
  bottom: 0;
  background-color: #fff;
  z-index: 999;
}
.group-user-content {
  width: 100%;
  padding: 0.4rem;
  box-sizing: border-box;
  padding-bottom: 1.6rem;
  .content-title {
    font-size: 0.3733rem;
    color: #646566;
    margin-bottom: 0.4rem;
  }
  ul {
    li {
      width: 100%;
      height: 1.4667rem;
      display: flex;
      align-items: center;
      .user-pic {
        width: 1.0667rem;
        height: 1.0667rem;
        overflow: hidden;
        border-radius: 50%;
        img {
          width: 100%;
          height: 100%;
        }
      }
      .user-nick {
        flex: 1;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        font-size: 0.4rem;
        margin-left: 0.2667rem;
      }
    }
  }
}
</style>
<style>
.van-dialog__confirm,
.van-dialog__confirm:active {
  color: #1989fa;
}
</style>