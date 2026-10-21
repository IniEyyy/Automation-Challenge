const fs = require('node:fs');
const path = require('node:path');
const { getCapabilities } = require('./config/capabilities');

exports.config = {
  runner: 'local',

  specs: ['./features/**/*.feature'],
  exclude: [],

  maxInstances: 1,
  capabilities: [getCapabilities()],

  logLevel: process.env.LOG_LEVEL || 'info',
  bail: 0,
  waitforTimeout: Number(process.env.WAIT_FOR_TIMEOUT || 20000),
  connectionRetryTimeout: 180000,
  connectionRetryCount: 3,

  services: [
    [
      'appium',
      {
        command: 'appium',
        args: {
          address: process.env.APPIUM_HOST || '127.0.0.1',
          port: Number(process.env.APPIUM_PORT || 4723),
          basePath: process.env.APPIUM_BASE_PATH || '/'
        }
      }
    ]
  ],

  framework: 'cucumber',
  reporters: ['spec'],

  cucumberOpts: {
    require: ['./features/step-definitions/*.steps.js'],
    backtrace: false,
    requireModule: [],
    dryRun: false,
    failFast: false,
    snippets: true,
    source: true,
    strict: false,
    tagExpression: '',
    timeout: 180000,
    ignoreUndefinedDefinitions: false
  },

  afterStep: async function (step, scenario, result) {
    if (result.passed) {
      return;
    }

    try {
      const image = await browser.takeScreenshot();
      const dir = path.join(process.cwd(), 'reports', 'screenshots');
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      const name = (scenario && scenario.pickle && scenario.pickle.name) || 'failed';
      const safeName = name.replace(/[^a-z0-9]+/gi, '-').toLowerCase();
      fs.writeFileSync(
        path.join(dir, `${Date.now()}-${safeName}.png`),
        Buffer.from(image, 'base64')
      );
    } catch (error) {
      // Screenshot is best-effort; never fail the run because of it.
    }
  }
};
