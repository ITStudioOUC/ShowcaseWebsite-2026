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
  // 使用 Lenis 的平滑滚动值 (如果有), 否则回退到原生 scrollY
  const lenis = (window as any).__lenis;
  const scrollY = lenis ? lenis.scroll : window.scrollY;
  const docH = document.body.scrollHeight - window.innerHeight;
  cameraY = docH > 0 ? (scrollY / docH) * (WORLD_H - H) : 0;
}

// ---- 工具 ----
interface RgbColor { r: number; g: number; b: number; }
function rgba(c: RgbColor, a: number) { return `rgba(${c.r},${c.g},${c.b},${a.toFixed(3)})`; }

// ==================== 星星 ====================
interface Star { x: number; worldY: number; r: number; baseAlpha: number; twinkleSpeed: number; twinklePhase: number; hue: number; haloR: number; }
const stars: Star[] = [];
const STAR_COUNT = 450;

function generateStars() {
  stars.length = 0;
  for (let i = 0; i < STAR_COUNT; i++) {
    const r = 0.3 + Math.random() * 2.2;
    const ba = 0.40 + Math.random() * 0.60; // 最低 40%
    stars.push({
      x: Math.random() * W, worldY: Math.random() * WORLD_H * 0.50, r, baseAlpha: ba,
      twinkleSpeed: 0.004 + Math.random() * 0.020, twinklePhase: Math.random() * Math.PI * 2,
      hue: 200 + Math.random() * 40, haloR: ba > 0.6 ? r * 4 + Math.random() * 8 : 0,
    });
  }
}

function drawStar(s: Star, screenY: number, fade: number) {
  const tw = 0.5 + 0.5 * Math.sin(time * s.twinkleSpeed + s.twinklePhase);
  const a = s.baseAlpha * fade * (0.25 + 0.75 * tw * tw * tw);
  if (a < 0.005) return;
  ctx.save(); ctx.globalAlpha = a;
  if (s.haloR > 0 && a > 0.25) {
    const g = ctx.createRadialGradient(s.x, screenY, s.r * 0.5, s.x, screenY, s.haloR);
    const ha = a * 0.18;
    g.addColorStop(0, `hsla(${s.hue}, 25%, 88%, ${ha})`);
    g.addColorStop(0.5, `hsla(${s.hue}, 20%, 75%, ${ha * 0.3})`);
    g.addColorStop(1, `hsla(${s.hue}, 15%, 60%, 0)`);
    ctx.fillStyle = g; ctx.beginPath(); ctx.arc(s.x, screenY, s.haloR, 0, Math.PI * 2); ctx.fill();
  }
  const g = ctx.createRadialGradient(s.x, screenY, 0, s.x, screenY, s.r);
  g.addColorStop(0, `hsla(${s.hue}, 15%, 96%, ${a})`);
  g.addColorStop(0.35, `hsla(${s.hue}, 20%, 82%, ${a * 0.7})`);
  g.addColorStop(0.75, `hsla(${s.hue}, 25%, 55%, ${a * 0.12})`);
  g.addColorStop(1, `hsla(${s.hue}, 30%, 40%, 0)`);
  ctx.fillStyle = g; ctx.beginPath(); ctx.arc(s.x, screenY, s.r, 0, Math.PI * 2); ctx.fill();
  ctx.restore();
}

// ==================== 极光帘幕 ====================
interface AuroraArc {
  worldY: number; amp: number; freq: number; slantAngle: number;
  avgH: number; hVar: number; density: number; width: number;
  foldCount: number; foldIntensity: number;
  cBase: RgbColor; cMid: RgbColor; cTop: RgbColor;
  opacity: number; speed: number; phaseShift: number;
}
const auroraArcs: AuroraArc[] = [
  { worldY: 140, amp: 12, freq: 0.0007, slantAngle: 0.15, avgH: 170, hVar: 100, density: 6, width: 5, foldCount: 2, foldIntensity: 1.8, cBase: { r: 140, g: 255, b: 180 }, cMid: { r: 70, g: 230, b: 155 }, cTop: { r: 20, g: 190, b: 110 }, opacity: 0.7, speed: 0.006, phaseShift: 0 },
  { worldY: 340, amp: 35, freq: 0.0016, slantAngle: -0.55, avgH: 220, hVar: 130, density: 5, width: 4.5, foldCount: 3, foldIntensity: 1.5, cBase: { r: 60, g: 240, b: 200 }, cMid: { r: 90, g: 80, b: 230 }, cTop: { r: 30, g: 30, b: 180 }, opacity: 0.55, speed: 0.0045, phaseShift: 2.5 },
  { worldY: 600, amp: 50, freq: 0.0022, slantAngle: 0.65, avgH: 260, hVar: 160, density: 7, width: 4, foldCount: 4, foldIntensity: 1.3, cBase: { r: 0, g: 220, b: 255 }, cMid: { r: 120, g: 180, b: 255 }, cTop: { r: 40, g: 100, b: 230 }, opacity: 0.6, speed: 0.007, phaseShift: 5.0 },
  { worldY: 850, amp: 40, freq: 0.0014, slantAngle: -0.50, avgH: 190, hVar: 120, density: 6, width: 4.5, foldCount: 3, foldIntensity: 1.6, cBase: { r: 250, g: 140, b: 210 }, cMid: { r: 160, g: 80, b: 230 }, cTop: { r: 90, g: 40, b: 200 }, opacity: 0.5, speed: 0.005, phaseShift: 1.8 },
];

function drawAurora(arc: AuroraArc, offsetY: number) {
  const phase = time * arc.speed + arc.phaseShift;
  const folds: { x: number; strength: number }[] = [];
  for (let f = 0; f < arc.foldCount; f++) {
    const fx = W * (0.1 + f * (0.8 / Math.max(1, arc.foldCount - 1))) + Math.sin(phase * 1.7 + f * 2.3) * W * 0.1;
    folds.push({ x: fx, strength: 0.7 + 0.3 * Math.sin(phase * 0.8 + f * 1.5) });
  }
  // 弥漫光晕
  const cx = W * 0.5 + Math.sin(phase * 0.5) * W * 0.2;
  const cy = arc.worldY - arc.avgH * 0.6 - offsetY;
  const glowGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.max(W * 0.6, arc.avgH));
  glowGrad.addColorStop(0, rgba(arc.cMid, arc.opacity * 0.2));
  glowGrad.addColorStop(0.5, rgba(arc.cMid, arc.opacity * 0.06));
  glowGrad.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = glowGrad; ctx.beginPath(); ctx.ellipse(cx, cy, W * 0.6, arc.avgH * 0.7, 0, 0, Math.PI * 2); ctx.fill();
  // 帘幕射线
  for (let x = -40; x <= W + 40; x += arc.density) {
    const yBot = arc.worldY + Math.sin(x * arc.freq + phase) * arc.amp - offsetY;
    if (yBot < -50 || yBot > H + 50) continue;
    const envelope = 0.4 + 0.6 * Math.abs(Math.sin(x * 0.0004 + phase * 0.3));
    const rv = (Math.sin(x * 0.037 + phase * 1.8) * 0.5 + Math.sin(x * 0.061 - phase * 2.3) * 0.3 + Math.sin(x * 0.019 + phase * 0.7) * 0.2) * arc.hVar;
    let rh = Math.max(3, arc.avgH * envelope + rv);
    let foldBoost = 1;
    for (const fold of folds) {
      const d = Math.abs(x - fold.x);
      const inf = Math.exp(-d * d / (30000 + 15000 * fold.strength));
      foldBoost = Math.max(foldBoost, 1 + inf * arc.foldIntensity * fold.strength);
      rh *= (1 + inf * 0.4);
    }
    // 倾角沿 x 轴波动，避免全层平行
    const varyAngle = arc.slantAngle + Math.sin(x * 0.005 + phase * 0.7) * 0.45 + Math.cos(x * 0.013 - phase * 0.5) * 0.35;
    const slantX = varyAngle * rh, xTop = x + slantX, yTop = yBot - rh;
    if (yTop > H || yBot < 0) continue;
    const bw = arc.width * 0.6, tw = arc.width * 0.2;
    const baseAlpha = arc.opacity * foldBoost;
    const grad = ctx.createLinearGradient(x, yBot, xTop, yTop);
    grad.addColorStop(0, rgba(arc.cBase, baseAlpha));
    grad.addColorStop(0.4, rgba(arc.cMid, baseAlpha * 0.6));
    grad.addColorStop(1, rgba(arc.cTop, 0));
    ctx.fillStyle = grad; ctx.beginPath();
    ctx.moveTo(x - bw, yBot); ctx.lineTo(xTop - tw, yTop);
    ctx.lineTo(xTop + tw, yTop); ctx.lineTo(x + bw, yBot);
    ctx.closePath(); ctx.fill();
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
// 从天空顶部到世界底部的连续渐变，无明显分界线
function drawSkyToAbyss(offsetY: number) {
  const top = Math.max(0, -offsetY);
  const bot = Math.min(H, WORLD_H - offsetY);
  if (bot <= top) return;

  const grad = ctx.createLinearGradient(0, top, 0, bot);
  // 天空深空 → 天蓝 → 海天交界(极暗蓝) → 深海蓝 → 墨蓝 → 纯黑
  grad.addColorStop(0, '#040b18');       // 最顶 — 深空黑蓝
  grad.addColorStop(0.18, '#081628');    // 星空区域
  grad.addColorStop(0.38, '#0d1f38');   // 天底
  grad.addColorStop(0.48, '#0e243e');   // 海天相接
  grad.addColorStop(0.58, '#0a1d35');   // 入海
  grad.addColorStop(0.70, '#061528');   // 浅海
  grad.addColorStop(0.84, '#020b18');   // 深海
  grad.addColorStop(1, '#000000');       // 深渊纯黑
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

  // --- 水下光柱 (god rays) ---
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

  // --- 浮游微粒 (多尺寸) ---
  for (let i = 0; i < 60; i++) {
    const sx = (i * W / 57 + Math.sin(i * 5.1 + time * 0.0008) * W * 0.3) % W;
    const sy = y0 + ((i * 73 + time * 0.04) % range);
    if (sy > y1) continue;
    const depthFrac = (sy - y0) / range;
    const size = 0.3 + (i % 3) * 0.5 + Math.sin(i * 3.7) * 0.2; // 0.3~1.8px
    const alpha = (0.015 + 0.04 * (1 - depthFrac)) * (0.5 + 0.5 * Math.sin(time * 0.005 + i * 1.7));
    ctx.fillStyle = `rgba(160,200,230,${alpha.toFixed(3)})`;
    ctx.beginPath(); ctx.arc(sx, sy, size, 0, Math.PI * 2); ctx.fill();
  }

  // --- 水母/磷光粒子 (稀疏, 微亮) ---
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

  // --- 暗流波纹 (宽间距) ---
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

  // 天空 + 渐变 → 海洋 → 深渊 (一体渐变)
  drawSkyToAbyss(cameraY);

  // 天空区域整体淡出：viewTop 超过 SKY_FADE_START 时极光和星星开始淡出
  const SKY_FADE_START = WORLD_H * 0.35;
  const SKY_FADE_END   = WORLD_H * 0.52;
  const skyFade = 1 - Math.max(0, Math.min(1, (viewTop - SKY_FADE_START) / (SKY_FADE_END - SKY_FADE_START)));

  // 极光
  if (skyFade > 0.01) {
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    ctx.globalAlpha = skyFade;
    auroraArcs.forEach(a => {
      if (a.worldY + a.amp > viewTop && a.worldY - a.avgH - a.hVar < viewBot) drawAurora(a, cameraY);
    });
    ctx.restore();
  }

  // 星星
  if (skyFade > 0.01) {
    stars.forEach(s => {
      if (s.worldY < viewTop - 20 || s.worldY > viewBot + 20) return;
      // 地平线淡出 + 全局天空淡出
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
