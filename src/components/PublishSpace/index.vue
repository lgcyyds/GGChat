<template>
  <div class="publish-content">
    <!-- 顶部标题和按钮 -->
    <div class="publish-title">
      <span @click="handleCancel">取消</span>
      <div>写动态</div>
      <button
        @click="submitSpace"
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
              :before-read="handleBeforeUpload"
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
import { mixins } from "@/mixins/compressImage";
export default {
  mixins: [mixins],
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
    //上传图片
    async upLoadPic(param) {
      if (param.length == 1) {
        //单照片
        let file = new File([param[0].file], param[0].file.name, {
          type: "image/jpeg",
        }); //Blob转file
        param.status = "uploading";
        param.message = "上传中...";
        let form = new FormData();
        form.append("photo", file);
        let result = await this.$API.reqSpaceUploadPhoto(form);
        if (result.status == 200) {
          this.picList.push(result.url);
          param.status = "done";
          param.message = "上传成功";
          //上传图片后顺便提交全部信息
          this.Publish();
        } else {
          param.status = "failed";
          param.message = "上传失败";
        }
      } else {
        //多照片
        let files = param.map((f) => {
          f.status = "uploading";
          f.message = "上传中...";
          let file = new File([f.file], f.file.name, { type: "image/jpeg" }); //Blob转file
          return file;
        });
        let form = new FormData();
        for (let i of files) {
          form.append("photos", i);
        }
        let result = await this.$API.reqSpaceUploadPhotos(form);
        if (result.status == 200) {
          param.forEach((f) => {
            f.status = "done";
            f.message = "上传成功";
          });
          this.picList.push(...result.url);
          //上传图片后顺便提交全部信息
          this.Publish();
        } else {
          param.forEach((f) => {
            f.status = "failed";
            f.message = "上传失败";
          });
        }
      }
    },
    //点击发布按钮
    submitSpace() {
      //点击发布后先上传图片，然后在上传的方法中发布动态
      this.upLoadPic(this.formInfo.upLoaderImgList);
    },

    //删除照片
    delPicture(file, detail) {
      this.picList.splice(detail.index, 1);
    },
    /*     //上传前压缩
    handleBeforeUpload(file) {
      // 在上传之前对图片进行压缩
      let compressImages = []
      return new Promise((resolve, reject) => {
        if (!file.length) {
          this.compressImage(file)
            .then((compressedFile) => {
              // 返回压缩后的文件
              resolve(compressedFile);                            
            })
            .catch((error) => {
              // 处理压缩错误
              reject(error);
              console.log(error);
            });
        } else {
          compressImages = file.map((item) => this.compressImage(item));
          Promise.all(compressImages).then((compressedFiles)=>{
            resolve(compressedFiles)
            console.log(compressedFiles);
            
          }).catch((error)=>{
            reject(error)
          })          
        }
      });
    },
    //压缩
    compressImage(file) {
      // 使用图片压缩库对图片进行压缩
      return new Promise((resolve, reject) => {
        const compressor = new ImageCompressor();

        compressor
          .compress(file, {
            quality: 0.4, // 压缩质量，可以调整
            maxWidth: 800, // 最大宽度，可以调整
            maxHeight: 800, // 最大高度，可以调整
          })
          .then((compressedFile) => {
            resolve(compressedFile);
          })
          .catch((error) => {
            reject(error);
          });
      });
    }, */
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