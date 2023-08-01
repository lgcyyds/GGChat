<template>
  <div class="login-container">
    <BackgroundCanvasSky />
    <div class="login-form">
      <h1 class="login-title">登录</h1>
      <form>
        <input
          v-model="phone"
          type="text"
          placeholder="请输入账号"
          class="input-field"
        />
        <input
          v-model="password"
          type="password"
          placeholder="请输入密码"
          class="input-field"
        />
        <button class="login-button" @click="Login">登录</button>
        <h5 class="register">还没有账号？请<router-link to="/register">注册</router-link></h5>
      </form>
    </div>
  </div>
</template>
<script>
import BackgroundCanvasSky from "@/components/BackgroundCanvasSky/index.vue";
import { setToken } from "@/utils/localstorage";
import { Toast } from "vant";
export default {
  components: {
    BackgroundCanvasSky,
  },
  data() {
    return {
      phone: "",
      password: "",
    };
  },
  methods: {
    async Login() {
      const { phone, password } = this;
      if (!phone || !password) {
        Toast("用户名或密码不能为空");
        return;
      }
      let userInfo = {
        phone,
        password,
      };
      const ToastLoading = Toast({
        message: "登录中...",
      });
      const result = await this.$API.reqLogin(userInfo);
      if (result.status == 200) {
        setToken(result.data.token)
        ToastLoading.close();
        this.$store.commit('setUserInfo',result.data)
        Toast(result.msg)
        //连接socket
        this.$socket.connect()
        this.$socket.emit('login',result.data._id)
        this.$router.replace('/message')
      }else{
        Toast(result.msg)
      }
    },
  },
};
</script>
<style scoped>
.login-container {
  width: 100%;
  height: 100vh;
}

.login-form {
  width: 7.3333rem;
  background-color: #fff;
  padding: 0.5333rem;
  border-radius: 0.2667rem;
  box-shadow: 0 0 0.2667rem rgba(0, 0, 0, 0.1);
  animation: fade-in 0.5s ease-out;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

@keyframes fade-in {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.login-title {
  text-align: center;
  color: #2196f3;
  font-size: 0.64rem;
  margin-bottom: 0.5333rem;
}

.input-field {
  width: 6.7067rem;
  padding: 0.2667rem;
  margin-bottom: 0.2667rem;
  border: 0.0267rem solid #ccc;
  border-radius: 0.1067rem;
}

.login-button {
  width: 100%;
  padding: 0.2667rem;
  background-color: #2196f3;
  border: none;
  border-radius: 0.1067rem;
  color: #fff;
  font-size: 0.4267rem;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.login-button:hover {
  background-color: #0d8bf2;
}
.input-field {
  font-size: 0.85em;
  background: rgb(255, 255, 255);
  border: 1px solid rgb(220, 220, 220);
  height: 0.6133rem;
  transition: border-color 0.4s, box-shadow 1s;
}

.input-field:active,
.input-field:focus {
  border: 0.0267rem solid #137dd5;
  box-shadow: 0.1067rem 0.1067rem 0 #3790ee;
}
.register {
  text-align: center;
  margin-top: 0.1333rem;
}
</style>
