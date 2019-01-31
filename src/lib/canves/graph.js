
export default {
  data() {
    return {
      lineWidth: 2.6
    }
  },
  methods: {
    Arrow(x1, y1, x2, y2, color = '#666', activeColor = 'transparent', width = 1.5, theta = 60, headlen = 3) {
      // 把当做动作矩形画
      const angle = Math.atan2(y1 - y2, x1 - x2) * 180 / Math.PI;
      const lineAngle = (angle - 90) * Math.PI / 180;
      const lineOffsetX = width * Math.cos(lineAngle);
      const lineOffsetY = width * Math.sin(lineAngle);
      const topRightX = x1 - lineOffsetX;
      const topRightY = y1 - lineOffsetY;
      const nookAngle = angle * Math.PI / 180;
      const nookX = 8 * Math.cos(nookAngle);
      const nookY = 8 * Math.sin(nookAngle);
      const botLeftX = x2 + nookX;
      const botLeftY = y2 + nookY;
      const botRightX = botLeftX - lineOffsetX;
      const botRightY = botLeftY - lineOffsetY;

      // 画完矩形，链接箭头
      const arrowRightAngle = (angle + theta) * Math.PI / 180;
      const arrowLeftAngle = (angle - theta) * Math.PI / 180;
      const arrowRightX = botRightX + headlen * Math.cos(arrowRightAngle);
      const arrowRightY = botRightY + headlen * Math.sin(arrowRightAngle);
      const arrowLeftX = botLeftX + headlen * Math.cos(arrowLeftAngle);
      const arrowLeftY = botLeftY + headlen * Math.sin(arrowLeftAngle);

      this.ctx.save();
      this.ctx.beginPath();
      this.ctx.lineTo(botLeftX, botLeftY);
      this.ctx.lineTo(x1, y1);
      this.ctx.lineTo(topRightX, topRightY);
      this.ctx.lineTo(botRightX, botRightY);
      this.ctx.lineTo(arrowRightX, arrowRightY);
      this.ctx.lineTo(x2 - 1 * Math.cos(lineAngle), y2 - 1 * Math.cos(lineAngle));
      this.ctx.lineTo(arrowLeftX, arrowLeftY);
      this.ctx.closePath();
      this.ctx.fillStyle = color;
      this.ctx.fill();
      this.ctx.lineWidth = 2.4;
      this.ctx.strokeStyle = activeColor;
      this.ctx.stroke();
      this.ctx.restore();
    },
    Line(x1, y1, x2, y2, color = '#666', width = 1.2) {
      this.ctx.save();
      this.ctx.beginPath();
      this.ctx.moveTo(x1, y1);
      this.ctx.lineTo(x2, y2);
      this.ctx.closePath();
      this.ctx.strokeStyle = color;
      this.ctx.lineWidth = width;
      this.ctx.stroke();
      this.ctx.restore();
    }
  }
}
