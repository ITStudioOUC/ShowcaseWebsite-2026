<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';

const canvasRef = ref<HTMLCanvasElement>();
let ctx: CanvasRenderingContext2D;
let W = 0; let H = 0;
let time = 0; let animFrameId = 0;

// ---- 世界空间 ----
const WORLD_H = 3000;
let cameraY = 0;

function updateCamera() {
  const lenis = (window as any).__lenis;
  const scrollY = lenis ? lenis.scroll : window.scrollY;
  const docH = document.body.scrollHeight - window.innerHeight;
  cameraY = docH > 0 ? (scrollY / docH) * (WORLD_H - H) : 0;
}

// ---- 工具 ----
interface RgbColor { r: number; g: number; b: number; }
function rgba(c: RgbColor, a: number) { return `rgba(${c.r},${c.g},${c.b},${a.toFixed(3)})`; }
const isMobile = window.innerWidth < 768;

// ==================== 星空 (改用类似着色器的深空分布与锐利闪烁) ====================
interface Star {
  x: number;
  worldY: number;
  r: number;
  baseAlpha: number;
  twinkleSpeed: number;
  twinklePhase: number;
  colorStr: string; // 预存颜色头，提升性能
  glowRadius: number;
}

const stars: Star[] = [];
// 增加星星数量以展现浩瀚深空感
const STAR_COUNT = isMobile ? 300 : 800;

function generateStars() {
  stars.length = 0;
  for (let i = 0; i < STAR_COUNT; i++) {
    // 尺寸：使用 4 次幂实现偏态分布 (海量微小星 + 极少量大星)
    const sizeFactor = Math.pow(Math.random(), 4);
    const r = 0.2 + sizeFactor * 1.8;

    const baseAlpha = 0.3 + Math.random() * 0.7;

    // 色温：85%冷蓝白，15%黄橙 (模拟真实星光色散)
    const hue = Math.random() > 0.85 ? 30 + Math.random() * 30 : 200 + Math.random() * 40;
    const colorStr = `hsla(${hue}, 80%, 85%`;

    // 仅耀眼星星附带光晕 Bloom 效果
    const glowRadius = r > 1.2 ? r * (3 + Math.random() * 4) : 0;

    stars.push({
      x: Math.random() * W,
      worldY: Math.random() * WORLD_H * 0.55,
      r,
      baseAlpha,
      twinkleSpeed: 0.005 + Math.random() * 0.02,
      twinklePhase: Math.random() * Math.PI * 2,
      colorStr,
      glowRadius
    });
  }
}

function drawStar(s: Star, screenY: number, fade: number) {
  // 闪烁核心：普通正弦波是平滑呼吸，三次幂正弦波能模拟大气折射造成的锐利闪烁
  const tw = 0.5 + 0.5 * Math.sin(time * s.twinkleSpeed + s.twinklePhase);
  const currentAlpha = s.baseAlpha * fade * (0.2 + 0.8 * tw * tw * tw);

  if (currentAlpha < 0.01) return;

  ctx.save();
  ctx.globalAlpha = currentAlpha;

  if (s.glowRadius > 0 && currentAlpha > 0.3) {
    const g = ctx.createRadialGradient(s.x, screenY, 0, s.x, screenY, s.glowRadius);
    g.addColorStop(0, `${s.colorStr}, ${currentAlpha * 0.4})`);
    g.addColorStop(1, `${s.colorStr}, 0)`);
    ctx.fillStyle = g;
    ctx.beginPath(); ctx.arc(s.x, screenY, s.glowRadius, 0, Math.PI * 2); ctx.fill();
  }

  ctx.fillStyle = `${s.colorStr}, ${currentAlpha})`;
  ctx.beginPath(); ctx.arc(s.x, screenY, s.r, 0, Math.PI * 2); ctx.fill();

  ctx.restore();
}

// ==================== 极光 (引入 Tri-Noise 与 色相流动 模拟 Shader) ====================
interface AuroraBand {
  worldY: number;
  avgH: number;
  amp: number;
  density: number;
  speed: number;
  opacity: number;
  baseHue: number;
}

const auroraBands: AuroraBand[] = [
  // 底部主带：强烈的绿-青交替，折叠感强
  { worldY: 180, avgH: 350, amp: 100, density: isMobile ? 8 : 4, speed: 0.0030, opacity: 0.7, baseHue: 150 },
  // 中层副带：粉紫色的薄纱流动
  { worldY: 350, avgH: 300, amp: 140, density: isMobile ? 8 : 4, speed: 0.0020, opacity: 0.5, baseHue: 270 },
  // 背景高层带：微弱的青蓝色
  { worldY: 550, avgH: 400, amp: 120, density: isMobile ? 9 : 5, speed: 0.0035, opacity: 0.4, baseHue: 190 },
  // 远景带：深邃的玫红/紫色
  { worldY: 750, avgH: 300, amp: 90,  density: isMobile ? 10: 6, speed: 0.0025, opacity: 0.3, baseHue: 320 }
];

function drawAurora(band: AuroraBand, offsetY: number) {
  const phase = time * band.speed;

  // 1. 弥漫光晕 (背景辉光，增强体积感)
  const cx = W * 0.5 + Math.sin(phase * 0.5) * W * 0.2;
  const cy = band.worldY - band.avgH * 0.5 - offsetY;
  const glowGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.max(W * 0.6, band.avgH));
  glowGrad.addColorStop(0, `hsla(${band.baseHue}, 80%, 60%, ${band.opacity * 0.15})`);
  glowGrad.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = glowGrad;
  ctx.beginPath();
  ctx.ellipse(cx, cy, W * 0.6, band.avgH * 0.8, 0, 0, Math.PI * 2);
  ctx.fill();

  // 2. 模拟 Shader 的光线步进渲染极光帘幕
  for (let x = -60; x <= W + 60; x += band.density) {
    // 核心算法：Tri-Noise 三角折叠噪声 (替代平滑的 sin)
    // 利用取绝对值反转，制造出极光真实的“锐利褶皱”形态
    let n1 = 1.0 - Math.abs(Math.sin(x * 0.002 + phase));
    let n2 = 1.0 - Math.abs(Math.sin(x * 0.005 - phase * 1.3));
    let n3 = 1.0 - Math.abs(Math.sin(x * 0.012 + phase * 0.8));
    const tNoise = (n1 + n2 * 0.5 + n3 * 0.25) / 1.75; // 映射到 0~1 左右

    const yBot = band.worldY + (tNoise * 2 - 1) * band.amp - offsetY;
    if (yBot < -100 || yBot > H + 100) continue;

    // 褶皱处 (tNoise大) 极光不仅更亮，而且冲得更高
    const rh = band.avgH * (0.4 + 1.2 * tNoise);
    const yTop = yBot - rh;
    if (yTop > H || yBot < 0) continue;

    const intensity = 0.2 + 0.8 * Math.pow(tNoise, 1.5);
    const baseAlpha = band.opacity * intensity;

    // 动态色相 (模拟文章中冷暖色交替：随 X 轴大范围波动)
    const hue = band.baseHue +
        Math.sin(x * 0.001 - phase * 0.8) * 50 +
        Math.sin(x * 0.004 + phase * 1.5) * 30;

    // 模拟透视发散斜率
    const slantX = Math.sin(x * 0.003 + phase) * (rh * 0.3);
    const xTop = x + slantX;

    // 绘制具有高度体积感的渐变切片
    const grad = ctx.createLinearGradient(x, yBot, xTop, yTop);
    grad.addColorStop(0, `hsla(${hue}, 90%, 65%, ${baseAlpha})`);
    grad.addColorStop(0.4, `hsla(${hue + 10}, 80%, 55%, ${baseAlpha * 0.6})`);
    grad.addColorStop(1, `hsla(${hue + 20}, 70%, 45%, 0)`);

    ctx.fillStyle = grad;
    ctx.beginPath();
    // 宽度稍微重叠(1.3倍)，防止抗锯齿产生黑线缝隙
    const dw = band.density * 0.65;
    ctx.moveTo(x - dw, yBot);
    ctx.lineTo(xTop - dw, yTop);
    ctx.lineTo(xTop + dw, yTop);
    ctx.lineTo(x + dw, yBot);
    ctx.closePath();
    ctx.fill();
  }
}

// ==================== 稀薄云层 ====================
function drawClouds(offsetY: number) {
  const y0 = Math.max(0, WORLD_H * 0.53 - offsetY);
  const y1 = Math.min(H, WORLD_H * 0.58 - offsetY);
  if (y1 <= y0) return;
  ctx.save(); ctx.globalAlpha = 0.14;
  const yC = (y0 + y1) / 2;
  for (let x = 0; x < W; x += 8) {
    const n = Math.sin(x * 0.013 + time * 0.003) * Math.cos(x * 0.021 - time * 0.002) * Math.sin(x * 0.007 + time * 0.004);
    const h = n * (y1 - y0) * 0.35;
    const g = ctx.createLinearGradient(0, yC - h, 0, yC + h);
    g.addColorStop(0, 'rgba(190,200,220,0)'); g.addColorStop(0.4, 'rgba(190,200,220,0.5)');
    g.addColorStop(0.6, 'rgba(190,200,220,0.5)'); g.addColorStop(1, 'rgba(190,200,220,0)');
    ctx.fillStyle = g; ctx.fillRect(x, Math.max(y0, yC - h), 5, Math.min(y1, yC + h) - Math.max(y0, yC - h));
  }
  ctx.restore();
}

// ==================== 天地海一体渐变 ====================
function drawSkyToAbyss(offsetY: number) {
  const top = Math.max(0, -offsetY);
  const bot = Math.min(H, WORLD_H - offsetY);
  if (bot <= top) return;
  const grad = ctx.createLinearGradient(0, top, 0, bot);
  grad.addColorStop(0, '#040b18');
  grad.addColorStop(0.18, '#081628');
  grad.addColorStop(0.38, '#0d1f38');
  grad.addColorStop(0.48, '#0e243e');
  grad.addColorStop(0.58, '#0a1d35');
  grad.addColorStop(0.70, '#061528');
  grad.addColorStop(0.84, '#020b18');
  grad.addColorStop(1, '#000000');
  ctx.fillStyle = grad;
  ctx.fillRect(0, top, W, bot - top);
}

// ==================== 海面微弱波纹 ====================
function drawRipples(offsetY: number) {
  const surfY = WORLD_H * 0.50 - offsetY;
  const y0 = Math.max(0, surfY - 10);
  const y1 = Math.min(H, surfY + 50);
  if (y1 <= y0) return;
  ctx.strokeStyle = 'rgba(100,160,220,0.06)'; ctx.lineWidth = 0.5;
  for (let y = y0; y < y1; y += 12) {
    ctx.beginPath();
    for (let x = 0; x < W; x += 4) {
      const wy = y + Math.sin(x * 0.018 + time * 0.006 + y * 0.04) * 2;
      x === 0 ? ctx.moveTo(x, wy) : ctx.lineTo(x, wy);
    }
    ctx.stroke();
  }
}

// ==================== 水下世界 ====================
function drawUnderwater(offsetY: number) {
  const top = WORLD_H * 0.52 - offsetY;
  const bot = WORLD_H - offsetY;
  if (bot <= 0 || top >= H) return;
  const y0 = Math.max(0, top);
  const y1 = Math.min(H, bot);
  if (y1 <= y0) return;
  const range = y1 - y0;

  ctx.save();
  ctx.globalCompositeOperation = 'lighter';
  for (let r = 0; r < 5; r++) {
    const rx = (r / 5) * W + Math.sin(time * 0.003 + r * 2.1) * W * 0.2;
    const rw = 15 + Math.sin(r * 3.7) * 8;
    const gradX = ctx.createLinearGradient(rx - rw, 0, rx + rw, 0);
    gradX.addColorStop(0, 'rgba(120,180,220,0)');
    gradX.addColorStop(0.5, 'rgba(120,180,220,0.04)');
    gradX.addColorStop(1, 'rgba(120,180,220,0)');
    ctx.fillStyle = gradX;
    ctx.fillRect(rx - rw, y0, rw * 2, range);
  }
  ctx.restore();

  for (let i = 0; i < 60; i++) {
    const sx = (i * W / 57 + Math.sin(i * 5.1 + time * 0.0008) * W * 0.3) % W;
    const sy = y0 + ((i * 73 + time * 0.04) % range);
    if (sy > y1) continue;
    const depthFrac = (sy - y0) / range;
    const size = 0.3 + (i % 3) * 0.5 + Math.sin(i * 3.7) * 0.2;
    const alpha = (0.015 + 0.04 * (1 - depthFrac)) * (0.5 + 0.5 * Math.sin(time * 0.005 + i * 1.7));
    ctx.fillStyle = `rgba(160,200,230,${alpha.toFixed(3)})`;
    ctx.beginPath(); ctx.arc(sx, sy, size, 0, Math.PI * 2); ctx.fill();
  }

  for (let i = 0; i < 10; i++) {
    const sx = (i * W / 9 + Math.sin(time * 0.002 + i) * W * 0.4) % W;
    const sy = y0 + ((i * 137 + time * 0.025) % range);
    if (sy > y1) continue;
    const pulse = 0.5 + 0.5 * Math.sin(time * 0.015 + i * 2.3);
    const alpha = 0.03 + 0.06 * pulse;
    const g = ctx.createRadialGradient(sx, sy, 0, sx, sy, 4);
    g.addColorStop(0, `rgba(180,230,255,${alpha.toFixed(3)})`);
    g.addColorStop(1, 'rgba(180,230,255,0)');
    ctx.fillStyle = g;
    ctx.beginPath(); ctx.arc(sx, sy, 4, 0, Math.PI * 2); ctx.fill();
  }

  ctx.strokeStyle = 'rgba(100,160,220,0.03)'; ctx.lineWidth = 0.6;
  for (let y = y0 + 30; y < y1 - 30; y += 60) {
    ctx.beginPath();
    for (let x = 0; x < W; x += 6) {
      const wy = y + Math.sin(x * 0.008 + time * 0.003 + y * 0.02) * 8;
      x === 0 ? ctx.moveTo(x, wy) : ctx.lineTo(x, wy);
    }
    ctx.stroke();
  }
}

// ==================== 主渲染 ====================
function render() {
  time += 1;
  updateCamera();
  ctx.clearRect(0, 0, W, H);

  const viewTop = cameraY;
  const viewBot = cameraY + H;

  drawSkyToAbyss(cameraY);

  const SKY_FADE_START = WORLD_H * 0.35;
  const SKY_FADE_END   = WORLD_H * 0.52;
  const skyFade = 1 - Math.max(0, Math.min(1, (viewTop - SKY_FADE_START) / (SKY_FADE_END - SKY_FADE_START)));

  // 渲染极光
  if (skyFade > 0.01) {
    ctx.save();
    ctx.globalCompositeOperation = 'lighter'; // 让层叠部分自然发出高亮体积光
    ctx.globalAlpha = skyFade;
    auroraBands.forEach(band => {
      // 视锥粗略剔除
      if (band.worldY + band.amp > viewTop && band.worldY - band.avgH * 2 < viewBot) {
        drawAurora(band, cameraY);
      }
    });
    ctx.restore();
  }

  // 渲染星空
  if (skyFade > 0.01) {
    stars.forEach(s => {
      if (s.worldY < viewTop - 20 || s.worldY > viewBot + 20) return;
      let fade = skyFade;
      if (s.worldY > WORLD_H * 0.43) fade *= Math.max(0, 1 - (s.worldY - WORLD_H * 0.43) / (WORLD_H * 0.07));
      if (fade > 0.005) drawStar(s, s.worldY - cameraY, fade);
    });
  }

  drawClouds(cameraY);
  drawRipples(cameraY);
  drawUnderwater(cameraY);

  const worldEnd = WORLD_H - cameraY;
  if (worldEnd < H) { ctx.fillStyle = '#000000'; ctx.fillRect(0, Math.max(0, worldEnd), W, H); }
  animFrameId = requestAnimationFrame(render);
}

function onResize() {
  if (!canvasRef.value) return;
  W = canvasRef.value.width = window.innerWidth;
  H = canvasRef.value.height = window.innerHeight;
  generateStars();
}

onMounted(() => {
  if (!canvasRef.value) return;
  ctx = canvasRef.value.getContext('2d')!;
  onResize();
  window.addEventListener('resize', onResize);
  animFrameId = requestAnimationFrame(render);
});

onUnmounted(() => {
  window.removeEventListener('resize', onResize);
  cancelAnimationFrame(animFrameId);
});
</script>

<template>
  <canvas ref="canvasRef" id="ribbon-canvas"></canvas>
</template>
