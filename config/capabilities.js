const path = require('node:path');
require('dotenv').config();

function toBool(value, fallback) {
  if (value === undefined) {
    return fallback;
  }
  return String(value).toLowerCase() === 'true';
}

function getCapabilities() {
  const appPath = process.env.APP_PATH ? path.resolve(process.env.APP_PATH) : undefined;

  const caps = {
    platformName: process.env.PLATFORM_NAME || 'Android',
    browserName: '',
    'appium:automationName': process.env.AUTOMATION_NAME || 'UiAutomator2',
    'appium:deviceName': process.env.DEVICE_NAME || 'Android Emulator',
    'appium:platformVersion': process.env.PLATFORM_VERSION || undefined,
    'appium:udid': process.env.DEVICE_UDID || undefined,
    'appium:app': appPath,
    'appium:appPackage': process.env.APP_PACKAGE || 'com.urbanindo.android',
    'appium:appActivity': process.env.APP_ACTIVITY || undefined,
    'appium:noReset': toBool(process.env.NO_RESET, true),
    'appium:fullReset': toBool(process.env.FULL_RESET, false),
    'appium:autoGrantPermissions': true,
    'appium:newCommandTimeout': 240,
    'appium:waitForIdleTimeout': 10000,
    'appium:uiautomator2ServerLaunchTimeout': 60000
  };

  // Appium rejects undefined values, so strip them out.
  return Object.fromEntries(
    Object.entries(caps).filter(([, value]) => value !== undefined && value !== '')
  );
}

module.exports = { getCapabilities };
