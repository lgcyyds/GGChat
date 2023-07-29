<template>
  <div>
    <div class="content">
      <van-form @submit="onSubmit">
        <!-- 手机号 -->
        <van-field
          v-model="registerInfo.username"
          name="phone"
          label="手机号"
          type="tel"
          placeholder="请输入11位手机号"
          :rules="[{ required: true }]"
          autocomplete="off"
          maxlength="11"
        />
        <!-- 密码 -->
        <van-field
          v-model="registerInfo.password"
          type="password"
          name="password"
          label="密码"
          placeholder="请设置您的密码"
          :rules="[{ required: true }]"
        />
        <!-- 昵称 -->
        <van-field
          v-model="registerInfo.nick"
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
            <van-radio-group v-model="registerInfo.sex" direction="horizontal">
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
          v-model="registerInfo.birthday"
          label="生日"
          placeholder="点击选择您的生日"
          @click="showPicker = true"
        />
        <van-popup v-model="showPicker" position="bottom">
          <van-datetime-picker
            v-model="currentDate"
            type="date"
            title="选择年/月/日"
            :min-date="minDate"
            :max-date="maxDate"
            @confirm="onConfirm"
            @cancel="showPicker = false"
          />
        </van-popup>
        <!-- 个性签名 -->
        <van-field
          v-model="registerInfo.sign"
          name="sign"
          rows="2"
          autosize
          label="个性签名"
          type="textarea"
          maxlength="50"
          placeholder="请输入您的个性签名"
          show-word-limit
        />
        <div style="margin: 0.4267rem">
          <van-button round block type="info" native-type="submit"
            >注册</van-button
          >
        </div>
      </van-form>
      <div class="tips"><van-icon name="fail" />请认真填写所有信息哦～</div>
    </div>
  </div>
</template>

<script>
import { Toast } from "vant";
export default {
  data() {
    return {
      registerInfo: {
        username: "",
        password: "",
        nick: "",
        sex: "男", // 性别
        birthday: "",
        sign: "", // 个性签名
      },
      minDate: new Date(1900, 1, 1),
      maxDate: new Date(2099, 12, 31),
      currentDate: new Date(),
      showPicker: false,
    };
  },
  methods: {
    async onSubmit(values) {
      const result = await this.$API.reqRegister(values);
      if (result.status === 200) {
        Toast({
          message: result.msg,
          duration: 1000,
          onClose: () => {
            this.$router.replace("/Login");
          },
        });
      } else if (result.status === 405) {
        Toast("请将基本信息按照规定填写完整");
      } else {
        Toast(result.msg);
      }
    },
    onConfirm(time) {
      this.currentDate = time;
      this.registerInfo.birthday = this.formatterDateTime(this.currentDate);
      this.showPicker = false;
    },
    // 格式化时间函数
    formatterDateTime(time) {
      let date = time;
      let year = date.getFullYear();
      let month = date.getMonth() + 1;
      let strDate = date.getDate();
      return year + "-" + month + "-" + strDate;
    },
  },
};
</script>

<style lang="less" scoped>
.tips {
  width: 100%;
  height: 0.4rem;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #969799;
}
.van-field__control {
  color: tomato;
}
</style>
