// Screenshots the timeline in headless Chrome so an update can be checked visually.
// Usage: node screenshot.mjs <url> <output-dir>
// Writes timeline.png (desktop), card.png (newest corporate card open) and mobile.png.

import { spawn } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

const [url = 'http://localhost:4329/', outDir = '/tmp/timeline'] = process.argv.slice(2);
const chrome = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
if (!fs.existsSync(chrome)) throw new Error(`Chrome not found at ${chrome}`);
fs.mkdirSync(outDir, { recursive: true });

const port = 9400 + Math.floor(Math.random() * 500);
const profile = fs.mkdtempSync(path.join(os.tmpdir(), 'timeline-chrome-'));
const proc = spawn(chrome, ['--headless=new', '--disable-gpu', '--hide-scrollbars', `--remote-debugging-port=${port}`, `--user-data-dir=${profile}`, 'about:blank'], { stdio: 'ignore' });
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

try {
  let target;
  for (let i = 0; i < 50 && !target; i++) {
    await sleep(200);
    try {
      target = (await (await fetch(`http://127.0.0.1:${port}/json`)).json()).find((t) => t.type === 'page');
    } catch {}
  }
  if (!target) throw new Error('Could not connect to headless Chrome');

  const ws = new WebSocket(target.webSocketDebuggerUrl);
  await new Promise((resolve) => ws.addEventListener('open', resolve, { once: true }));
  let id = 0;
  const send = (method, params = {}) =>
    new Promise((resolve) => {
      const myId = ++id;
      const onMessage = (event) => {
        const message = JSON.parse(event.data);
        if (message.id !== myId) return;
        ws.removeEventListener('message', onMessage);
        resolve(message.result ?? message);
      };
      ws.addEventListener('message', onMessage);
      ws.send(JSON.stringify({ id: myId, method, params }));
    });
  const evaluate = async (expression) => (await send('Runtime.evaluate', { expression, returnByValue: true })).result.value;
  const viewport = (width, height) => send('Emulation.setDeviceMetricsOverride', { width, height, deviceScaleFactor: 1, mobile: width < 600 });
  const shot = async (file, selector, { fullPage = true } = {}) => {
    const params = { format: 'png', captureBeyondViewport: fullPage };
    if (selector) {
      const box = await evaluate(`(() => { const b = document.querySelector('${selector}').getBoundingClientRect(); return { x: b.x, y: b.y + scrollY, width: b.width, height: b.height }; })()`);
      params.clip = { ...box, scale: 1 };
    }
    fs.writeFileSync(path.join(outDir, file), Buffer.from((await send('Page.captureScreenshot', params)).data, 'base64'));
  };

  await send('Page.enable');
  await send('Runtime.enable');
  await viewport(1280, 900);
  await send('Page.navigate', { url });
  await sleep(2000);
  await viewport(1280, await evaluate('document.documentElement.scrollHeight'));
  await shot('timeline.png', '[data-career]');

  await viewport(1280, 900);
  const opened = await evaluate(`(() => {
    const cards = document.querySelectorAll('[id^="corporate-"][popover]');
    const card = cards[cards.length - 1];
    card?.showPopover();
    return card?.id;
  })()`);
  await sleep(300);
  await shot('card.png', null, { fullPage: false });

  await evaluate(`document.querySelector(':popover-open')?.hidePopover()`);
  await viewport(390, 900);
  await send('Page.reload');
  await sleep(2000);
  const overflow = await evaluate('document.documentElement.scrollWidth > innerWidth');
  await viewport(390, await evaluate('document.documentElement.scrollHeight'));
  await shot('mobile.png');

  console.log(JSON.stringify({ outDir, card: opened, mobileOverflow: overflow }));
  ws.close();
} finally {
  const exited = new Promise((resolve) => proc.once('exit', resolve));
  proc.kill();
  await exited;
  fs.rmSync(profile, { recursive: true, force: true, maxRetries: 5, retryDelay: 200 });
}
