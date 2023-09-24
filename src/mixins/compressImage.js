import ImageCompressor from "image-compressor.js";
export const mixins = {
    
    methods: {
        //上传前压缩
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
                    Promise.all(compressImages).then((compressedFiles) => {
                        resolve(compressedFiles)
                    }).catch((error) => {
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
        },
    }
}