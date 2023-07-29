<template>
  <div class="publish-content">
    <!-- 顶部标题和按钮 -->
    <div class="publish-title">
      <span @click="handleCancel">取消</span>
      <div>写动态</div>
      <button
        @click="Publish"
        :disabled="disabled"
        :class="disabled ? 'isDisabled' : ''"
      >
        发布
      </button>
    </div>
    <!-- 分隔线 -->
    <van-divider />
    <!-- 编辑区域 -->
    <div class="edit-content">
      <van-form class="form-flex">
        <!-- 文本编辑 -->
        <van-field
          class="text-edit"
          v-model="formInfo.text"
          placeholder="分享新鲜事..."
          autosize
          rows="3"
          type="textarea"
          maxlength="200"
          show-word-limit
        />
        <!-- 图片上传 -->
        <van-field name="uploader">
          <template #input>
            <van-uploader
              v-model="formInfo.upLoaderImgList"
              multiple
              :max-count="9"
              preview-size="2.7rem"
              :after-read="afterRead"
              @delete="delPicture"
            />
          </template>
        </van-field>
      </van-form>
    </div>
  </div>
</template>

<script>
import { Toast } from "vant";
import { mapState } from "vuex";
export default {
  data() {
    return {
      formInfo: {
        text: "",
        upLoaderImgList: [],
      },
      picList: [],
    };
  },
  computed: {
    disabled() {
      if (this.formInfo.text == "" && this.picList.length == 0) {
        return true;
      } else {
        return false;
      }
    },
    ...mapState({ userId: (state) => state.user.userInfo._id }),
  },
  methods: {
    //取消发布并清空数据
    handleCancel() {
      Object.assign(this.$data, this.$options.data());
      this.$emit("changeShowSpace", false);
    },
    // 发布动态
    async Publish() {
      let obj = {
        userId: this.userId,
        textDesc: this.formInfo.text,
        photos: this.picList,
      };
      let result = await this.$API.reqAddSpace(obj);
      if (result.status == 200) {
        Toast(result.msg);
        this.handleCancel();
        this.$emit("refreshList");
      }
    },
    //上传图片后的回调
    async afterRead(file) {
      if (!file.length) {
        //单照片
        file.status = "uploading";
        file.message = "上传中...";
        let form = new FormData();
        form.append("photo", file.file);
        let result = await this.$API.reqSpaceUploadPhoto(form);
        if (result.status == 200) {
          this.picList.push(result.url);
          file.status = "done";
          file.message = "上传成功";
        } else {
          file.status = "failed";
          file.message = "上传失败";
        }
      } else {
        //多照片
        file.forEach((f) => {
          f.status = "uploading";
          f.message = "上传中...";
        });
        let form = new FormData();
        for (let i of file) {
          form.append("photos", i.file);
        }
        let result = await this.$API.reqSpaceUploadPhotos(form);
        if (result.status == 200) {
          file.forEach((f) => {
            f.status = "done";
            f.message = "上传成功";
          });
          this.picList.push(...result.url);
        } else {
          file.forEach((f) => {
            f.status = "failed";
            f.message = "上传失败";
          });
        }
      }
    },
    //删除照片
    delPicture(file, detail) {
      this.picList.splice(detail.index,1)
    },
  },
};
</script>

<style lang="less" scoped>
.publish-content {
  .publish-title {
    width: 100%;
    height: 1.2667rem;
    padding: 0.2667rem 0.2667rem 0.2667rem 0.3333rem;
    box-sizing: border-box;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 0.4267rem;

    span {
      font-size: 0.4rem;
    }

    div {
      flex: 1;
      display: flex;
      justify-content: center;
      align-items: center;
    }

    button {
      width: 1.5333rem;
      height: 0.8rem;
      background-color: #4dc0ff;
      border: none;
      color: #fff;
      font-size: 0.3467rem;
      border-radius: 0.1333rem;
    }

    .isDisabled {
      background-color: #9bd9fb;
    }
  }

  .edit-content {
    width: 100%;
    box-sizing: border-box;
    .form-flex {
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: space-around;
      .text-edit {
        width: 100%;
        min-height: 3.3333rem;
      }
    }
  }
}

.van-divider {
  margin: 0;
}
</style>