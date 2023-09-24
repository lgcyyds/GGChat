<template>
  <div>
    <NavTop>
      <div class="navtop-title">个人信息</div>
    </NavTop>
    <BackBtn></BackBtn>
    <div class="content">
      <van-form @submit="submitUpdate">
        <!-- 头像上传 -->
        <van-field name="uploader" label="头像">
          <template #input>
            <van-uploader
              v-model="updateInfo.fileList"
              :before-read="handleBeforeUpload"
              :max-count="1"
            />
          </template>
        </van-field>
        <!-- 昵称 -->
        <van-field
          v-model="updateInfo.nick"
          name="nick"
          label="昵称"
          placeholder="请设置您的昵称"
          :rules="[{ required: true }]"
          autocomplete="off"
          maxlength="15"
        />
        <!-- 性别 -->
        <van-field name="sex" label="性别">
          <template #input>
            <van-radio-group v-model="updateInfo.sex" direction="horizontal">
              <van-radio name="男">男</van-radio>
              <van-radio name="女">女</van-radio>
            </van-radio-group>
          </template>
        </van-field>
        <!-- 生日 -->
        <van-field
          readonly
          clickable
          name="birthday"
          :value="updateInfo.birthday"
          label="生日"
          placeholder="点击选择您的生日"
          @click="showPicker = true"
        />
        <van-popup v-model="showPicker" position="bottom">
          <van-datetime-picker
            type="date"
            title="选择年/月/日"
            v-model="currentDate"
            :min-date="minDate"
            :max-date="maxDate"
            @confirm="onConfirm"
            @cancel="showPicker = false"
          />
        </van-popup>
        <!-- 个性签名 -->
        <van-field
          v-model="updateInfo.sign"
          name="sign"
          rows="2"
          autosize
          label="个性签名"
          type="textarea"
          maxlength="50"
          placeholder="请输入您的个性签名"
          show-word-limit
        />
        <div style="margin: 16px">
          <van-button round block type="info" native-type="submit"
            >保存</van-button
          >
        </div>
      </van-form>
    </div>
  </div>
</template>

<script>
import NavTop from "@/components/NavTop/index.vue";
import BackBtn from "@/components/BackBtn/index.vue";
import { mapState } from "vuex";
import { Toast } from "vant";
import { mixins } from "@/mixins/compressImage";
export default {
  components: {
    NavTop,
    BackBtn,
  },
  mixins: [mixins],
  data() {
    return {
      updateInfo: {
        nick: "", //昵称
        sex: "", // 性别
        birthday: "", //生日
        sign: "", // 个性签名
        fileList: [], //头像
      },
      showPicker: false,
      minDate: new Date(1900, 1, 1),
      maxDate: new Date(2099, 12, 31),
      currentDate: new Date(),
      userImgUrl: "",
    };
  },
  methods: {
    //提交更新信息
    async onSubmit(values) {
      const { nick, sex, birthday, sign, uploader } = values;
      let defaultImg = sex === "男" ? "/user_pic1.jpeg" : "/user_pic2.jpeg";
      let newUserInfo = {
        _id: this.userId,
        nick,
        sex,
        birthday,
        sign,
        imgUrl: uploader.length ? this.userImgUrl : defaultImg,
      };      
      try {
        let result = await this.$API.reqUpdateUserInfo(newUserInfo);
        if (result.status == 200) {
          Toast(result.msg);
          this.$router.go(-1);
        }
      } catch (error) {
        console.log(error);
      }
    },
    //图片上传服务器后返回对应路径
    async upLoadPic(param, values) {
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
        const result = await this.$API.reqUploadUserPic(form);
        if (result.status === 200) {
          this.userImgUrl = result.url;
          param.status = "done";
          param.message = "上传成功";
          this.onSubmit(values);
        }
      } catch (error) {
        param.status = "failed";
        param.message = "上传失败";
      }
    },
    onConfirm(time) {
      this.updateInfo.birthday = this.formatterDateTime(time);
      this.showPicker = false;
    },
    //格式化时间函数
    formatterDateTime(time) {
      let day = time.getDate();
      let month = time.getMonth();
      let year = time.getFullYear();
      return year + "-" + month + "-" + day;
    },
    // 获取原始个人信息
    async getOldUserInfo() {
      let _id = this.userId;
      let { urlId } = this.$route.query;
      let Ids = { _id, urlId };
      try {
        const result = await this.$API.reqGetUserHome(Ids);
        if (result.status === 200) {
          let { nick, sex, birthday, imgUrl, sign } = result.data.user;
          this.userImgUrl = imgUrl;
          Object.assign(this.updateInfo, {
            fileList: [{ url: this.$baseUrl + imgUrl }],
            nick,
            sex,
            birthday,
            sign,
          });
        }
      } catch (error) {
        console.log(error);
      }
    },
    //点击提交更新信息
    submitUpdate(values) {
      this.upLoadPic(this.updateInfo.fileList[0].file, values);
      console.log(this.updateInfo.fileList);
      
    },
  },
  computed: {
    ...mapState({ userId: (state) => state.user.userInfo._id }),
  },
  mounted() {
    this.getOldUserInfo();
  },
};
</script>

<style lang="less" scoped></style>