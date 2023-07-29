<template>
  <div class="canvas-container">
    <canvas ref="canvas" class="canvas"></canvas>
  </div>
</template>


<script>
export default {
  mounted() {
    this.initializeCanvas();
  },
  methods: {
    initializeCanvas() {
      const canvas = this.$refs.canvas;
      const context = canvas.getContext("2d");
      const width = window.innerWidth;
      const height = window.innerHeight;

      canvas.width = width;
      canvas.height = height;

      const clouds = [];
      const numClouds = 20; // 调整云朵数量

      for (let i = 0; i < numClouds; i++) {
        const x = Math.random() * width;
        const y = Math.random() * height * 0.6;
        const scale = Math.random() * 0.5 + 0.5;
        const speed = Math.random() * 0.2 + 0.1;

        clouds.push({ x, y, scale, speed });
      }

      const drawCloud = (x, y, scale) => {
        context.beginPath();
        context.moveTo(x, y);
        context.bezierCurveTo(
          x + 40 * scale,
          y - 30 * scale,
          x + 120 * scale,
          y - 30 * scale,
          x + 160 * scale,
          y - 90 * scale
        );
        context.bezierCurveTo(
          x + 190 * scale,
          y - 130 * scale,
          x + 230 * scale,
          y - 130 * scale,
          x + 250 * scale,
          y - 120 * scale
        );
        context.bezierCurveTo(
          x + 280 * scale,
          y - 200 * scale,
          x + 350 * scale,
          y - 200 * scale,
          x + 370 * scale,
          y - 120 * scale
        );
        context.bezierCurveTo(
          x + 420 * scale,
          y - 120 * scale,
          x + 420 * scale,
          y - 70 * scale,
          x + 390 * scale,
          y - 50 * scale
        );
        context.bezierCurveTo(
          x + 430 * scale,
          y + 20 * scale,
          x + 350 * scale,
          y + 30 * scale,
          x + 310 * scale,
          y + 20 * scale
        );
        context.bezierCurveTo(
          x + 290 * scale,
          y + 80 * scale,
          x + 200 * scale,
          y + 70 * scale,
          x + 170 * scale,
          y + 40 * scale
        );
        context.bezierCurveTo(
          x + 150 * scale,
          y + 100 * scale,
          x + 80 * scale,
          y + 100 * scale,
          x + 70 * scale,
          y + 70 * scale
        );
        context.bezierCurveTo(
          x + 30 * scale,
          y + 100 * scale,
          x - 20 * scale,
          y + 80 * scale,
          x,
          y
        );
        context.closePath();

        const gradient = context.createLinearGradient(
          x,
          y - 90 * scale,
          x,
          y + 100 * scale
        );
        gradient.addColorStop(0, "rgba(255, 255, 255, 0.8)"); // 云朵浅色部分
        gradient.addColorStop(1, "rgba(255, 255, 255, 0.2)"); // 云朵深色部分

        context.fillStyle = gradient;
        context.fill();
        context.shadowColor = "rgba(0, 0, 0, 0.1)";
        context.shadowBlur = 20 * scale;
        context.shadowOffsetX = 10 * scale;
        context.shadowOffsetY = 10 * scale;
      };

      const animate = () => {
        context.clearRect(0, 0, width, height);

        clouds.sort((a, b) => a.y - b.y); // 根据云朵的y坐标进行排序，确保较低的云朵在较高的云朵之前绘制

        for (let i = 0; i < numClouds; i++) {
          const cloud = clouds[i];

          // 绘制云朵，并设置较低的云朵透明度较高，以实现层次感和立体感
          context.globalAlpha = 1 - i / numClouds;
          drawCloud(cloud.x, cloud.y, cloud.scale);

          cloud.x += cloud.speed;

          if (cloud.x > width + 400 * cloud.scale) {
            cloud.x = -400 * cloud.scale;
          }
        }

        requestAnimationFrame(animate);
      };

      animate();
    },
  },
};
</script>
<style scoped>
.canvas-container {
  position: relative;
  width: 100%;
  height: 100vh;
  background-color: #87ceeb; /* 蓝天背景色 */
}

.canvas {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
</style>


