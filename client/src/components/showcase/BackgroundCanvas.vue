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
  const docH = document.body.scrollHeight - window.innerHeight;
  cameraY = docH > 0 ? (window.scrollY / docH) * (WORLD_H - H) : 0;
}

// ---- 工具 ----
interface RgbColor { r: number; g: number; b: number; }
function rgba(c: RgbColor, a: number) { return `rgba(${c.r},${c.g},${c.b},${a.toFixed(3)})`; }

// ==================== 星星 ====================
interface Star { x: number; worldY: number; r: number; baseAlpha: number; twinkleSpeed: number; twinklePhase: number; hue: number; haloR: number; }
const stars: Star[] = [];
const STAR_COUNT = 400;

function generateStars() {
  stars.length = 0;
  for (let i = 0; i < STAR_COUNT; i++) {
    const r = 0.3 + Math.random() * 1.8;
    const ba = 0.12 + Math.random() * 0.88;
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
  { worldY: 240, amp: 20, freq: 0.001, slantAngle: 0.05, avgH: 220, hVar: 140, density: 5, width: 3, foldCount: 3, foldIntensity: 1.6, cBase: { r: 120, g: 255, b: 160 }, cMid: { r: 60, g: 220, b: 140 }, cTop: { r: 10, g: 180, b: 100 }, opacity: 0.65, speed: 0.005, phaseShift: 0 },
  { worldY: 480, amp: 35, freq: 0.0012, slantAngle: -0.12, avgH: 280, hVar: 180, density: 4, width: 2.5, foldCount: 4, foldIntensity: 1.4, cBase: { r: 80, g: 255, b: 180 }, cMid: { r: 110, g: 100, b: 240 }, cTop: { r: 40, g: 40, b: 200 }, opacity: 0.55, speed: 0.004, phaseShift: 1.2 },
  { worldY: 750, amp: 45, freq: 0.0015, slantAngle: 0.18, avgH: 340, hVar: 220, density: 6, width: 2, foldCount: 5, foldIntensity: 1.3, cBase: { r: 0, g: 230, b: 250 }, cMid: { r: 100, g: 160, b: 255 }, cTop: { r: 30, g: 80, b: 220 }, opacity: 0.6, speed: 0.006, phaseShift: 2.8 },
  { worldY: 1020, amp: 30, freq: 0.0011, slantAngle: -0.22, avgH: 240, hVar: 150, density: 5, width: 2.5, foldCount: 4, foldIntensity: 1.5, cBase: { r: 240, g: 120, b: 200 }, cMid: { r: 140, g: 70, b: 220 }, cTop: { r: 80, g: 30, b: 180 }, opacity: 0.45, speed: 0.0055, phaseShift: 4.0 },
  { worldY: 1300, amp: 35, freq: 0.0013, slantAngle: 0.08, avgH: 200, hVar: 120, density: 5, width: 2.5, foldCount: 3, foldIntensity: 1.7, cBase: { r: 100, g: 250, b: 150 }, cMid: { r: 50, g: 200, b: 130 }, cTop: { r: 0, g: 150, b: 100 }, opacity: 0.5, speed: 0.0045, phaseShift: 5.5 },
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
    const slantX = arc.slantAngle * rh, xTop = x + slantX, yTop = yBot - rh;
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

// ==================== 天空渐变 ====================
function drawSkyGradient(offsetY: number) {
  const y0 = Math.max(0, -offsetY);
  const y1 = Math.min(H, WORLD_H * 0.55 - offsetY);
  if (y1 <= y0) return;
  const grad = ctx.createLinearGradient(0, y0, 0, y1);
  grad.addColorStop(0, '#050d1a'); grad.addColorStop(0.5, '#081828');
  grad.addColorStop(0.85, '#0c2035'); grad.addColorStop(1, '#0e2840');
  ctx.fillStyle = grad; ctx.fillRect(0, y0, W, y1 - y0);
}

// ==================== 稀薄云层 ====================
function drawClouds(offsetY: number) {
  const y0 = Math.max(0, WORLD_H * 0.53 - offsetY);
  const y1 = Math.min(H, WORLD_H * 0.58 - offsetY);
  if (y1 <= y0) return;
  for (let pass = 0; pass < 2; pass++) {
    ctx.save(); ctx.globalAlpha = 0.12 + pass * 0.04;
    const yC = (y0 + y1) / 2;
    for (let x = 0; x < W; x += 4) {
      const n = Math.sin(x * 0.013 + time * 0.003) * Math.cos(x * 0.021 - time * 0.002) * Math.sin(x * 0.007 + time * 0.004);
      const h = n * (y1 - y0) * 0.35;
      const g = ctx.createLinearGradient(0, yC - h, 0, yC + h);
      g.addColorStop(0, 'rgba(190,200,220,0)'); g.addColorStop(0.4, 'rgba(190,200,220,0.5)');
      g.addColorStop(0.6, 'rgba(190,200,220,0.5)'); g.addColorStop(1, 'rgba(190,200,220,0)');
      ctx.fillStyle = g; ctx.fillRect(x, Math.max(y0, yC - h), 5, Math.min(y1, yC + h) - Math.max(y0, yC - h));
    }
    ctx.restore();
  }
}

// ==================== 棱角冰川剪影 ====================
interface GlacierPeak { x: number; height: number; sharpness: number; }
let glacierPath: { x: number; y: number }[] = [];

function generateGlacier() {
  const baseY = WORLD_H * 0.60;
  glacierPath = [];

  // 生成主峰
  const peaks: GlacierPeak[] = [];
  const peakCount = 8 + Math.floor(W / 150);
  for (let i = 0; i < peakCount; i++) {
    const x = (i / (peakCount - 1)) * W + (Math.random() - 0.5) * 100;
    const height = 30 + Math.random() * 130;
    peaks.push({ x, height, sharpness: 0.3 + Math.random() * 1.5 });
  }
  peaks.sort((a, b) => a.x - b.x);

  // 在主峰之间插入锯齿状的二级棱角
  const allPoints: { x: number; y: number }[] = [];
  for (let i = 0; i < peaks.length; i++) {
    const p = peaks[i];
    // 山峰顶点 - 尖锐
    allPoints.push({ x: p.x - 3, y: baseY - p.height * 0.85 });
    allPoints.push({ x: p.x, y: baseY - p.height }); // 峰顶
    allPoints.push({ x: p.x + 3, y: baseY - p.height * 0.85 });

    // 到下一个峰之间的锯齿状山脊
    if (i < peaks.length - 1) {
      const next = peaks[i + 1];
      const segWidth = next.x - p.x;
      const subPeaks = 2 + Math.floor(segWidth / 60);
      for (let s = 0; s < subPeaks; s++) {
        const t = (s + 1) / (subPeaks + 1);
        const sx = p.x + t * segWidth + (Math.random() - 0.5) * 30;
        const sh = baseY - (p.height * (1 - t) + next.height * t) * (0.25 + Math.random() * 0.55);
        allPoints.push({ x: sx, y: sh });
      }
    }
  }

  // 按 x 排序
  allPoints.sort((a, b) => a.x - b.x);
  glacierPath = allPoints;
}

function drawGlacier(offsetY: number) {
  if (glacierPath.length === 0) return;
  const baseSY = WORLD_H * 0.60 - offsetY;
  if (baseSY < -200 || baseSY > H + 200) return;

  // 主剪影
  ctx.beginPath();
  ctx.moveTo(-20, H + 50);
  for (const p of glacierPath) {
    ctx.lineTo(p.x, p.y - offsetY);
  }
  ctx.lineTo(W + 20, H + 50);
  ctx.closePath();

  const grad = ctx.createLinearGradient(0, baseSY - 100, 0, baseSY + 50);
  grad.addColorStop(0, 'rgba(230,240,252,0.75)');
  grad.addColorStop(0.25, 'rgba(200,225,245,0.6)');
  grad.addColorStop(0.6, 'rgba(120,175,225,0.4)');
  grad.addColorStop(1, 'rgba(50,110,190,0.15)');
  ctx.fillStyle = grad;
  ctx.fill();

  // 冰川表面的棱角纹理线
  ctx.strokeStyle = 'rgba(180,210,240,0.15)';
  ctx.lineWidth = 0.6;
  for (let i = 0; i < glacierPath.length; i += 3) {
    const p = glacierPath[i];
    const sy = p.y - offsetY;
    if (sy < 0 || sy > H) continue;
    ctx.beginPath();
    ctx.moveTo(p.x, sy);
    // 画短斜线模拟冰川裂隙
    const angle = (Math.sin(p.x * 0.03) * 0.3 + 0.5) * Math.PI;
    ctx.lineTo(p.x + Math.cos(angle) * 18, sy + Math.sin(angle) * 10);
    ctx.stroke();
  }
}

// ==================== 海面碎冰 (预生成, 不规则多边形) ====================
interface IceFloe {
  // 多边形顶点 (相对于中心)
  verts: { x: number; y: number }[];
  worldX: number; worldY: number;
  rotation: number;
  color: string;
}
let iceFloes: IceFloe[] = [];

function generateIceFloes() {
  iceFloes = [];
  const iceTop = WORLD_H * 0.62;
  const iceBot = WORLD_H * 0.66;
  for (let i = 0; i < 50; i++) {
    const cx = Math.random() * W;
    const wy = iceTop + Math.random() * (iceBot - iceTop);
    // 生成不规则多边形 (4-8边形)
    const numVerts = 4 + Math.floor(Math.random() * 5);
    const baseR = 12 + Math.random() * 40; // 大块浮冰
    const verts: { x: number; y: number }[] = [];
    for (let v = 0; v < numVerts; v++) {
      const angle = (v / numVerts) * Math.PI * 2 + (Math.random() - 0.5) * 0.6;
      const r = baseR * (0.4 + Math.random() * 0.6) * (Math.random() > 0.3 ? 1 : 0.35); // 偶尔缺一角
      verts.push({ x: Math.cos(angle) * r, y: Math.sin(angle) * r * 0.35 }); // 压扁
    }
    const alpha = 0.2 + Math.random() * 0.4;
    const blue = 200 + Math.floor(Math.random() * 55);
    iceFloes.push({ verts, worldX: cx, worldY: wy, rotation: Math.random() * Math.PI, color: `rgba(${blue},${blue + 20},${blue + 40},${alpha.toFixed(2)})` });
  }
}

function drawIceFloes(offsetY: number) {
  for (const floe of iceFloes) {
    const sy = floe.worldY - offsetY;
    if (sy < -30 || sy > H + 30) continue;
    // 极缓慢漂移
    const dx = Math.sin(floe.worldY * 0.01 + time * 0.0008) * 12;
    ctx.save();
    ctx.translate(floe.worldX + dx, sy);
    ctx.rotate(floe.rotation + Math.sin(time * 0.0005 + floe.worldX * 0.03) * 0.04);
    ctx.fillStyle = floe.color;
    ctx.beginPath();
    ctx.moveTo(floe.verts[0].x, floe.verts[0].y);
    for (let v = 1; v < floe.verts.length; v++) {
      ctx.lineTo(floe.verts[v].x, floe.verts[v].y);
    }
    ctx.closePath();
    ctx.fill();
    // 冰面高光边
    ctx.strokeStyle = 'rgba(220,235,255,0.3)';
    ctx.lineWidth = 0.5;
    ctx.stroke();
    ctx.restore();
  }
}

// ==================== 海面 ====================
function drawOceanSurface(offsetY: number) {
  const y0 = Math.max(0, WORLD_H * 0.64 - offsetY);
  const y1 = Math.min(H, WORLD_H * 0.70 - offsetY);
  if (y1 <= y0) return;
  const grad = ctx.createLinearGradient(0, y0, 0, y1);
  grad.addColorStop(0, 'rgba(20,60,110,0.7)');
  grad.addColorStop(0.5, 'rgba(10,40,90,0.8)');
  grad.addColorStop(1, 'rgba(5,20,60,0.85)');
  ctx.fillStyle = grad; ctx.fillRect(0, y0, W, y1 - y0);
  // 波纹
  ctx.strokeStyle = 'rgba(100,160,220,0.12)'; ctx.lineWidth = 0.5;
  for (let y = y0; y < y1; y += 8) {
    ctx.beginPath();
    for (let x = 0; x < W; x += 4) {
      const wy = y + Math.sin(x * 0.02 + time * 0.008 + y * 0.05) * 2.5;
      x === 0 ? ctx.moveTo(x, wy) : ctx.lineTo(x, wy);
    }
    ctx.stroke();
  }
}

// ==================== 深海 ====================
function drawDeepOcean(offsetY: number) {
  const y0 = Math.max(0, WORLD_H * 0.68 - offsetY);
  const y1 = Math.min(H, WORLD_H - offsetY);
  if (y1 <= y0) return;
  const grad = ctx.createLinearGradient(0, y0, 0, y1);
  grad.addColorStop(0, 'rgba(5,20,60,0.9)');
  grad.addColorStop(0.25, 'rgba(3,12,40,0.95)');
  grad.addColorStop(0.55, 'rgba(1,6,20,0.98)');
  grad.addColorStop(1, '#000000');
  ctx.fillStyle = grad; ctx.fillRect(0, y0, W, y1 - y0);
  // 海洋微粒
  for (let i = 0; i < 40; i++) {
    const sx = (i * W / 37 + Math.sin(i * 5.1 + time * 0.001) * W * 0.3) % W;
    const sy = y0 + ((i * 113 + time * 0.12) % (y1 - y0));
    ctx.fillStyle = `rgba(180,210,240,${0.03 + 0.05 * Math.sin(time * 0.008 + i * 1.7)})`;
    ctx.beginPath(); ctx.arc(sx, sy, 0.7, 0, Math.PI * 2); ctx.fill();
  }
}

// ==================== 主渲染 ====================
function render() {
  time += 1;
  updateCamera();
  ctx.clearRect(0, 0, W, H);

  const viewTop = cameraY;
  const viewBot = cameraY + H;

  // 天空
  if (viewTop < WORLD_H * 0.55 && viewBot > 0) drawSkyGradient(cameraY);

  // 极光
  if (viewTop < WORLD_H * 0.53) {
    ctx.globalCompositeOperation = 'lighter';
    auroraArcs.forEach(a => {
      if (a.worldY + a.amp > viewTop && a.worldY - a.avgH - a.hVar < viewBot) drawAurora(a, cameraY);
    });
    ctx.globalCompositeOperation = 'source-over';
  }

  // 星星
  if (viewTop < WORLD_H * 0.52) {
    stars.forEach(s => {
      if (s.worldY < viewTop - 20 || s.worldY > viewBot + 20) return;
      let fade = 1;
      if (s.worldY > WORLD_H * 0.45) fade = Math.max(0, 1 - (s.worldY - WORLD_H * 0.45) / (WORLD_H * 0.07));
      if (fade > 0) drawStar(s, s.worldY - cameraY, fade);
    });
  }

  drawClouds(cameraY);
  drawGlacier(cameraY);
  drawIceFloes(cameraY);
  drawOceanSurface(cameraY);
  drawDeepOcean(cameraY);

  const worldEnd = WORLD_H - cameraY;
  if (worldEnd < H) { ctx.fillStyle = '#000000'; ctx.fillRect(0, Math.max(0, worldEnd), W, H); }
  animFrameId = requestAnimationFrame(render);
}

function onResize() {
  if (!canvasRef.value) return;
  W = canvasRef.value.width = window.innerWidth;
  H = canvasRef.value.height = window.innerHeight;
  generateStars();
  generateGlacier();
  generateIceFloes();
}

onMounted(() => {
  if (!canvasRef.value) return;
  ctx = canvasRef.value.getContext('2d')!;
  onResize();
  window.addEventListener('resize', onResize);
  window.addEventListener('scroll', updateCamera, { passive: true });
  animFrameId = requestAnimationFrame(render);
});

onUnmounted(() => {
  window.removeEventListener('resize', onResize);
  window.removeEventListener('scroll', updateCamera);
  cancelAnimationFrame(animFrameId);
});
</script>

<template>
  <canvas ref="canvasRef" id="ribbon-canvas"></canvas>
</template>
