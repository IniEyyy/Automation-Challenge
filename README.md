# Automation-Challenge

Welcome to Rumah123 Automation Mobile Challenge, please follow below instruction for this chanllenge

## Requirement:
- use newest Appium Version
- use WebdriverIO as framework
- use CommonJS as a code
- use Page Object Model for code structure
- use Gherkin as Test Cases

## Test Cases:
- You are as an QA at 99, please download latest version of 99 (do not download the Pro Apps). You have the project to testing the revamp part on homepage, please scan all the locators and make it into the automation. so you can reduce testing time and also catch the bugs very sooner.
- How to access the homepage

1.  please open the app
2.  once it's open you will see the homepage

Rule:

- Please forking this repository
- Invite indra99co as collaborator
- once you done, please push into your branch and create the PR

---

## Solution overview

Mobile UI automation for the 99.co Indonesia app (non-Pro) homepage using the
newest Appium 3 + WebdriverIO 9, written in CommonJS with the Page Object Model
and Gherkin feature files (Cucumber).

> WebdriverIO 9 is used instead of 10 because WDIO 10's Cucumber adapter pulls
> in an ESM-only `@cucumber/messages` that fails to initialise on Node 22.16
> (needs >= 22.19). Appium itself stays on the newest version.

```
.
├── config/
│   └── capabilities.js        # Appium capabilities built from .env
├── features/
│   ├── homepage.feature       # Gherkin scenarios
│   └── step-definitions/
│       └── homepage.steps.js  # Cucumber step definitions
├── scripts/
│   └── scan-locators.js       # Dumps UI hierarchy + screenshot for locator scanning
├── test/
│   └── pageobjects/
│       ├── base.page.js       # Shared element/gesture helpers
│       └── homepage.page.js   # Homepage locators + actions
├── wdio.conf.js               # WebdriverIO runner config (Cucumber)
└── .env.example               # Device / app configuration template
```

## Prerequisites

- Node.js >= 20
- Java JDK 17 (for the Android SDK / UiAutomator2)
- Android SDK + platform-tools (`adb` on PATH)
- An Android emulator or a real device
- The **99 app (not the Pro app)** installed on the device

## Setup

```bash
npm install

# install the Appium driver required by the capabilities
npm run setup:driver

# create your local config
copy .env.example .env
```

Then edit `.env`:
- If the app is already installed, set `APP_PACKAGE` / `APP_ACTIVITY`.
  Find the package with `adb shell pm list packages | findstr -i urbanindo`
  (99.co Indonesia = `com.urbanindo.android`).
- Or set `APP_PATH` to a local `.apk` and leave the package as is.

## Scan the homepage locators

The page-object locators were captured from the real 99.co Indonesia UI. The app
exposes no resource-ids, so every element is identified by its accessibility
label (`content-desc`). With the device/emulator running and the app installed:

```bash
# starts Appium automatically, then dumps the homepage + search screens
npm run scan:locators
```

Open `reports/homepage-source.xml`, `reports/search-source.xml` and the matching
`.png` files to inspect the hierarchy. Re-run the scan and update
`test/pageobjects/homepage.page.js` whenever the UI changes.

## Run the tests

Appium is started automatically by `@wdio/appium-service`, so you only need the
device/emulator to be running:

```bash
npm test              # all scenarios
npm run test:smoke    # only @smoke
npm run test:regression
```

## Notes

- CommonJS everywhere (`require` / `module.exports`), no ESM.
- Page Object Model: selectors live in `test/pageobjects`, step definitions only
  call page-object methods.
- Each locator is an ordered list of candidates, so the suite keeps working when
  one strategy (accessibility id, text, resource id) changes.
- On failure, a screenshot is saved to `reports/screenshots/`.
