const fs = require('node:fs');
const net = require('node:net');
const path = require('node:path');
const { spawn } = require('node:child_process');
const { remote } = require('webdriverio');
const { getCapabilities } = require('../config/capabilities');

const hostname = process.env.APPIUM_HOST || '127.0.0.1';
const port = Number(process.env.APPIUM_PORT || 4723);
const basePath = process.env.APPIUM_BASE_PATH || '/';

function isPortOpen(timeout = 1000) {
  return new Promise((resolve) => {
    const socket = new net.Socket();
    let settled = false;

    const finish = (value) => {
      if (settled) {
        return;
      }
      settled = true;
      socket.destroy();
      resolve(value);
    };

    socket.setTimeout(timeout);
    socket.once('connect', () => finish(true));
    socket.once('timeout', () => finish(false));
    socket.once('error', () => finish(false));
    socket.connect(port, hostname);
  });
}

async function waitForPort(timeoutMs = 60000) {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    if (await isPortOpen()) {
      return true;
    }
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }
  return false;
}

async function ensureAppium() {
  if (await isPortOpen()) {
    console.log(`Using the Appium server already running on ${hostname}:${port}`);
    return null;
  }

  const appiumBin = path.join(
    path.dirname(require.resolve('appium/package.json')),
    'index.js'
  );

  console.log(`Starting Appium: ${appiumBin}`);
  const child = spawn(
    process.execPath,
    [appiumBin, 'server', '--port', String(port), '--base-path', basePath],
    { cwd: process.cwd(), env: process.env, stdio: 'ignore' }
  );

  const ready = await waitForPort();
  if (!ready) {
    child.kill();
    throw new Error('Appium did not start within 60s');
  }

  console.log('Appium is ready');
  return child;
}

async function capture(client, name) {
  const outDir = path.join(process.cwd(), 'reports');
  fs.mkdirSync(outDir, { recursive: true });

  const pageSource = await client.getPageSource();
  fs.writeFileSync(path.join(outDir, `${name}-source.xml`), pageSource, 'utf8');

  const screenshot = await client.takeScreenshot();
  fs.writeFileSync(path.join(outDir, `${name}.png`), Buffer.from(screenshot, 'base64'));

  console.log(`Saved reports/${name}-source.xml and reports/${name}.png`);
}

async function main() {
  const appium = await ensureAppium();

  const client = await remote({
    hostname,
    port,
    path: basePath,
    logLevel: 'error',
    capabilities: getCapabilities()
  });

  try {
    await client.pause(3000);

    try {
      const homeTab = await client.$(
        'android=new UiSelector().descriptionStartsWith("Cari")'
      );
      if (await homeTab.isExisting()) {
        await homeTab.click();
        await client.pause(1500);
      }
    } catch (error) {
      console.warn('Could not switch to the home tab:', error.message);
    }

    await capture(client, 'homepage');

    try {
      const filter = await client.$(
        'android=new UiSelector().descriptionContains("Filter")'
      );
      if (await filter.isExisting()) {
        const location = await filter.getLocation();
        const size = await filter.getSize();
        await client
          .action('pointer')
          .move({
            x: Math.round(location.x * 0.45),
            y: location.y + Math.round(size.height / 2)
          })
          .down()
          .up()
          .perform();
        await client.pause(2500);
        await capture(client, 'search');

        const back = await client.$('~Back');
        if (await back.isExisting()) {
          await back.click();
        } else {
          await client.back();
        }
        await client.pause(2000);
      }
    } catch (error) {
      console.warn('Search screen capture skipped:', error.message);
    }

    try {
      const akun = await client.$(
        'android=new UiSelector().descriptionStartsWith("Akun Saya")'
      );
      if (await akun.isExisting()) {
        await akun.click();
        await client.pause(2500);
        await capture(client, 'profile');
      }
    } catch (error) {
      console.warn('Account screen capture skipped:', error.message);
    }

    try {
      const cari = await client.$(
        'android=new UiSelector().descriptionStartsWith("Cari")'
      );
      if (await cari.isExisting()) {
        await cari.click();
        await client.pause(1000);
      }
    } catch (error) {
      // Restoring the home tab is best-effort.
    }
  } finally {
    await client.deleteSession();
    if (appium) {
      appium.kill();
    }
  }
}

main().catch((error) => {
  console.error('Failed to scan locators:', error.message);
  process.exit(1);
});
