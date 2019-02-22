export default {
  data() {
    return {
      lineWidth: 2.6
    }
  },
  methods: {
    Arrow(ctx, x1, y1, x2, y2, color = '#666', width = 1.6, theta = 60, headlen = 4) {
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

      ctx.save();
      ctx.beginPath();
      ctx.lineTo(botLeftX, botLeftY);
      ctx.lineTo(x1, y1);
      ctx.lineTo(topRightX, topRightY);
      ctx.lineTo(botRightX, botRightY);
      ctx.lineTo(arrowRightX, arrowRightY);
      ctx.lineTo(x2 - 1 * Math.cos(lineAngle), y2 - 1 * Math.cos(lineAngle));
      ctx.lineTo(arrowLeftX, arrowLeftY);
      ctx.lineTo(botLeftX, botLeftY);
      ctx.closePath();
      ctx.fillStyle = color;
      ctx.fill();
      ctx.restore();
    },
    drawArrow(ctx, x1, y1, x2, y2, color = '#666', width = 1, theta = 30, headlen = 6) {
      // 计算各角度和对应的P2,P3坐标 
      var angle = Math.atan2(y1 - y2, x1 - x2) * 180 / Math.PI,
        angle1 = (angle + theta) * Math.PI / 180,
        angle2 = (angle - theta) * Math.PI / 180,
        topX = headlen * Math.cos(angle1),
        topY = headlen * Math.sin(angle1),
        botX = headlen * Math.cos(angle2),
        botY = headlen * Math.sin(angle2);
      ctx.save();
      ctx.beginPath();
      var arrowX = x1 - topX,
        arrowY = y1 - topY;
      ctx.moveTo(arrowX, arrowY);
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      arrowX = x2 + topX;
      arrowY = y2 + topY;
      ctx.moveTo(arrowX, arrowY);
      ctx.lineTo(x2, y2);
      arrowX = x2 + botX;
      arrowY = y2 + botY;
      ctx.lineTo(arrowX, arrowY);
      ctx.strokeStyle = color;
      ctx.lineWidth = width;
      ctx.stroke();
      ctx.restore();
    },
    Line(x1, y1, x2, y2, color = '#666', width = 1.2) {
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.closePath();
      ctx.strokeStyle = color;
      ctx.lineWidth = width;
      ctx.stroke();
      ctx.restore();
    }
  }
}
