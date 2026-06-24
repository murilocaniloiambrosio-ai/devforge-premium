const fs = require('node:fs');
const path = require('node:path');
const { spawnSync } = require('node:child_process');
const puppeteer = require('puppeteer');
const ffmpegPath = require('ffmpeg-static');

const root = path.resolve(__dirname, '..');
const outputDir = path.join(__dirname, 'videos');
const frameRoot = path.join(outputDir, '.frames');
const chromePath = 'C:/Program Files/Google/Chrome/Application/chrome.exe';

const width = 720;
const height = 1280;
const fps = 24;
const durationSeconds = 8;
const frameCount = fps * durationSeconds;

const videos = [
  {
    slug: 'devforge-crescimento',
    eyebrow: 'DEVFORGE PREMIUM',
    headline: 'Sua empresa aparece, responde, organiza e cresce.',
    lines: ['Landing page clara', 'WhatsApp com contexto', 'IA no atendimento', 'Banco de dados seguro'],
    metric: '+42%',
    metricLabel: 'menos atendimento manual',
    cta: 'Peca um diagnostico',
    gradient: ['#00c2a8', '#ff5a5f'],
  },
  {
    slug: 'nao-e-so-site',
    eyebrow: 'NAO E SO SITE BONITO',
    headline: 'Site bonito nao paga conta se o lead some depois do clique.',
    lines: ['Oferta que o cliente entende', 'Formulario e WhatsApp rastreaveis', 'CRM para nao perder conversa', 'Dashboard para decidir'],
    metric: '24/7',
    metricLabel: 'fluxo digital ativo',
    cta: 'Transforme visita em venda',
    gradient: ['#ffb545', '#00c2a8'],
  },
  {
    slug: 'ia-com-controle',
    eyebrow: 'IA PARA EMPRESA',
    headline: 'IA boa tira tarefa repetida sem tirar o controle da equipe.',
    lines: ['Responde perguntas frequentes', 'Resume conversas', 'Classifica lead quente', 'Lembra follow-up'],
    metric: '6s',
    metricLabel: 'resposta inicial',
    cta: 'Automatize com seguranca',
    gradient: ['#2f80ed', '#38d996'],
  },
];

function ensureCleanDir(dir) {
  if (fs.existsSync(dir)) {
    fs.rmSync(dir, { recursive: true, force: true });
  }
  fs.mkdirSync(dir, { recursive: true });
}

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}

function buildHtml(video) {
  const lineItems = video.lines
    .map((line, index) => `<li style="--i:${index}">${escapeHtml(line)}</li>`)
    .join('');

  return `<!doctype html>
<html lang="pt-BR">
<head>
<meta charset="utf-8">
<style>
  :root {
    --p: 0;
    --a: ${video.gradient[0]};
    --b: ${video.gradient[1]};
  }
  * { box-sizing: border-box; }
  body {
    margin: 0;
    width: ${width}px;
    height: ${height}px;
    overflow: hidden;
    font-family: Inter, Arial, Helvetica, sans-serif;
    background: #05070b;
    color: white;
  }
  .stage {
    position: relative;
    width: 100%;
    height: 100%;
    padding: 70px 54px;
    display: grid;
    align-content: end;
    isolation: isolate;
    background:
      radial-gradient(circle at calc(18% + var(--p) * 58%) 22%, color-mix(in srgb, var(--a) 46%, transparent), transparent 28%),
      radial-gradient(circle at calc(80% - var(--p) * 34%) 54%, color-mix(in srgb, var(--b) 38%, transparent), transparent 28%),
      linear-gradient(145deg, #05070b 0%, #0e1521 45%, #05070b 100%);
  }
  .grid {
    position: absolute;
    inset: 0;
    background:
      linear-gradient(rgba(255,255,255,.05) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255,255,255,.035) 1px, transparent 1px);
    background-size: 52px 52px;
    transform: translateY(calc(var(--p) * 80px));
    opacity: .45;
    z-index: -2;
  }
  .scan {
    position: absolute;
    left: -15%;
    width: 130%;
    height: 2px;
    border-radius: 999px;
    background: linear-gradient(90deg, transparent, var(--a), transparent);
    opacity: .5;
    transform: translateX(calc(-220px + var(--p) * 460px));
  }
  .scan.one { top: 23%; }
  .scan.two { top: 49%; background: linear-gradient(90deg, transparent, var(--b), transparent); transform: translateX(calc(220px - var(--p) * 460px)); }
  .scan.three { bottom: 18%; }
  .laptop {
    position: absolute;
    left: 50%;
    top: 16%;
    width: 590px;
    transform:
      translateX(-50%)
      translateY(calc(-70px + var(--p) * 92px))
      rotateX(calc(18deg - var(--p) * 8deg))
      rotateZ(calc(-6deg + var(--p) * 4deg))
      scale(calc(.86 + var(--p) * .08));
    transform-origin: center;
    filter: drop-shadow(0 38px 90px rgba(0,0,0,.55));
  }
  .screen {
    min-height: 390px;
    border: 1px solid rgba(255,255,255,.18);
    border-radius: 22px;
    background:
      linear-gradient(135deg, color-mix(in srgb, var(--a) 18%, transparent), transparent 44%),
      linear-gradient(145deg, rgba(18, 27, 42, .98), rgba(9, 11, 16, .96));
    padding: 18px;
  }
  .topbar {
    display: flex;
    align-items: center;
    gap: 8px;
    border-bottom: 1px solid rgba(255,255,255,.12);
    padding-bottom: 14px;
    color: rgba(255,255,255,.62);
    font-size: 16px;
    font-weight: 900;
  }
  .dot { width: 14px; height: 14px; border-radius: 99px; background: var(--b); }
  .dot:nth-child(2) { background: #ffb545; }
  .dot:nth-child(3) { background: var(--a); margin-right: 12px; }
  .cards {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 14px;
    margin-top: 16px;
  }
  .card {
    min-height: 134px;
    border: 1px solid rgba(255,255,255,.12);
    border-radius: 16px;
    padding: 16px;
    background: rgba(255,255,255,.07);
    overflow: hidden;
  }
  .card small { display:block; color: rgba(255,255,255,.62); font-weight: 900; }
  .card strong { display:block; margin-top: 7px; font-size: 36px; }
  .bars {
    height: 44px;
    margin-top: 16px;
    border-radius: 10px;
    background:
      linear-gradient(to top, color-mix(in srgb, var(--a) 56%, transparent), transparent),
      repeating-linear-gradient(90deg, rgba(255,255,255,.12) 0 1px, transparent 1px 28px);
    clip-path: polygon(0 84%, 18% 62%, 36% 68%, 52% 38%, 70% 44%, 86% 22%, 100% 12%, 100% 100%, 0 100%);
  }
  .base {
    width: 100%;
    height: 32px;
    border-radius: 0 0 44px 44px;
    background: linear-gradient(180deg, #d8e7f1, #768a96 54%, #1f2730);
  }
  .chip {
    position: absolute;
    display: grid;
    place-items: center;
    width: 94px;
    height: 94px;
    border: 1px solid rgba(255,255,255,.16);
    border-radius: 22px;
    background: rgba(9,11,16,.58);
    color: var(--a);
    font-size: 28px;
    font-weight: 950;
    backdrop-filter: blur(14px);
    transform: translateY(calc(42px - var(--p) * 84px));
    opacity: calc(.42 + var(--p) * .42);
  }
  .chip.a { left: 52px; top: 220px; }
  .chip.b { right: 52px; top: 250px; color: var(--b); }
  .chip.c { right: 68px; bottom: 315px; color: #38d996; }
  .content {
    position: relative;
    z-index: 3;
    transform: translateY(calc(40px - var(--p) * 40px));
  }
  .eyebrow {
    display: inline-flex;
    width: max-content;
    max-width: 100%;
    color: var(--a);
    font-size: 25px;
    font-weight: 950;
    text-transform: uppercase;
    margin-bottom: 18px;
  }
  h1 {
    margin: 0;
    font-size: 70px;
    line-height: .94;
    letter-spacing: 0;
    text-wrap: balance;
  }
  ul {
    list-style: none;
    padding: 0;
    margin: 34px 0 0;
    display: grid;
    gap: 12px;
  }
  li {
    display: flex;
    align-items: center;
    min-height: 54px;
    border: 1px solid rgba(255,255,255,.13);
    border-radius: 14px;
    background: rgba(255,255,255,.08);
    padding: 0 18px;
    color: rgba(255,255,255,.86);
    font-size: 26px;
    font-weight: 850;
    transform: translateX(calc((1 - min(1, max(0, (var(--p) - .16 - var(--i) * .08) * 7))) * -70px));
    opacity: min(1, max(0, (var(--p) - .12 - var(--i) * .08) * 7));
  }
  .metric {
    display: grid;
    grid-template-columns: 130px 1fr;
    align-items: center;
    gap: 18px;
    margin-top: 34px;
    border-left: 5px solid var(--a);
    padding-left: 18px;
  }
  .metric strong {
    font-size: 60px;
    color: var(--a);
    line-height: 1;
  }
  .metric span {
    color: rgba(255,255,255,.76);
    font-size: 23px;
    font-weight: 850;
  }
  .cta {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-height: 72px;
    margin-top: 36px;
    border-radius: 16px;
    background: linear-gradient(90deg, var(--a), var(--b));
    color: #061210;
    font-size: 27px;
    font-weight: 950;
    padding: 0 30px;
    box-shadow: 0 24px 70px color-mix(in srgb, var(--a) 24%, transparent);
  }
  .brand {
    position: absolute;
    left: 54px;
    top: 52px;
    display: flex;
    align-items: center;
    gap: 16px;
    font-weight: 950;
    font-size: 28px;
  }
  .mark {
    display: grid;
    place-items: center;
    width: 66px;
    height: 66px;
    border-radius: 16px;
    background: linear-gradient(135deg, var(--a), var(--b));
    color: #07100d;
  }
</style>
</head>
<body>
  <main class="stage">
    <div class="grid"></div>
    <span class="scan one"></span>
    <span class="scan two"></span>
    <span class="scan three"></span>
    <div class="brand"><span class="mark">DF</span><span>DevForge</span></div>
    <div class="chip a">IA</div>
    <div class="chip b">CRM</div>
    <div class="chip c">DB</div>
    <section class="laptop">
      <div class="screen">
        <div class="topbar"><span class="dot"></span><span class="dot"></span><span class="dot"></span>DEVFORGE FLOW</div>
        <div class="cards">
          <article class="card"><small>Lead novo</small><strong>84</strong><div class="bars"></div></article>
          <article class="card"><small>Resposta IA</small><strong>6s</strong><div class="bars"></div></article>
          <article class="card"><small>Banco</small><strong>CRM</strong><div class="bars"></div></article>
          <article class="card"><small>Seguranca</small><strong>LGPD</strong><div class="bars"></div></article>
        </div>
      </div>
      <div class="base"></div>
    </section>
    <section class="content">
      <div class="eyebrow">${escapeHtml(video.eyebrow)}</div>
      <h1>${escapeHtml(video.headline)}</h1>
      <ul>${lineItems}</ul>
      <div class="metric"><strong>${escapeHtml(video.metric)}</strong><span>${escapeHtml(video.metricLabel)}</span></div>
      <div class="cta">${escapeHtml(video.cta)}</div>
    </section>
  </main>
  <script>
    window.setVideoProgress = function setVideoProgress(p) {
      document.documentElement.style.setProperty('--p', String(p));
    };
  </script>
</body>
</html>`;
}

async function renderVideo(browser, video) {
  const framesDir = path.join(frameRoot, video.slug);
  ensureCleanDir(framesDir);

  const page = await browser.newPage();
  await page.setViewport({ width, height, deviceScaleFactor: 1 });
  await page.setContent(buildHtml(video), { waitUntil: 'load' });

  for (let frame = 0; frame < frameCount; frame += 1) {
    const progress = frame / (frameCount - 1);
    await page.evaluate((p) => window.setVideoProgress(p), progress);
    await page.screenshot({
      path: path.join(framesDir, `frame-${String(frame).padStart(4, '0')}.png`),
      type: 'png',
    });
  }

  await page.close();

  const outPath = path.join(outputDir, `${video.slug}.mp4`);
  const result = spawnSync(ffmpegPath, [
    '-y',
    '-framerate', String(fps),
    '-i', path.join(framesDir, 'frame-%04d.png'),
    '-c:v', 'libx264',
    '-pix_fmt', 'yuv420p',
    '-movflags', '+faststart',
    '-vf', 'scale=720:1280',
    '-b:v', '2200k',
    outPath,
  ], { stdio: 'inherit' });

  if (result.status !== 0) {
    throw new Error(`ffmpeg failed for ${video.slug}`);
  }

  fs.copyFileSync(path.join(framesDir, 'frame-0048.png'), path.join(outputDir, `${video.slug}-poster.png`));
  fs.rmSync(framesDir, { recursive: true, force: true });
  return outPath;
}

async function main() {
  ensureCleanDir(outputDir);
  fs.mkdirSync(frameRoot, { recursive: true });

  const browser = await puppeteer.launch({
    headless: 'new',
    executablePath: fs.existsSync(chromePath) ? chromePath : undefined,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const created = [];
  for (const video of videos) {
    created.push(await renderVideo(browser, video));
  }

  await browser.close();
  fs.rmSync(frameRoot, { recursive: true, force: true });

  console.log('Videos generated:');
  created.forEach((file) => console.log(file));
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
