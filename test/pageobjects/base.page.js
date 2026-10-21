class BasePage {
  /**
   * Returns the first element from a list of candidate selectors that exists.
   * Locators can be a single selector string or an ordered array (fallbacks).
   */
  async findElement(selectors, timeout = 10000) {
    const candidates = Array.isArray(selectors) ? selectors : [selectors];
    const deadline = Date.now() + timeout;

    do {
      for (const selector of candidates) {
        try {
          const element = await browser.$(selector);
          if (await element.isExisting()) {
            return element;
          }
        } catch (error) {
          // Invalid selector for this app version; try the next candidate.
        }
      }
      await browser.pause(250);
    } while (Date.now() < deadline);

    return null;
  }

  async isDisplayed(selectors, timeout = 5000) {
    const element = await this.findElement(selectors, timeout);
    if (!element) {
      return false;
    }
    return element.isDisplayed().catch(() => false);
  }

  async waitForDisplayed(selectors, timeout = 15000) {
    const element = await this.findElement(selectors, timeout);
    if (!element) {
      throw new Error(`Element not found within ${timeout}ms: ${selectors}`);
    }
    await element.waitForDisplayed({ timeout });
    return element;
  }

  async tap(selectors, timeout = 15000) {
    const element = await this.waitForDisplayed(selectors, timeout);
    await element.click();
    return element;
  }

  async getText(selectors, timeout = 15000) {
    const element = await this.waitForDisplayed(selectors, timeout);
    return element.getText();
  }

  async countElements(selectors) {
    try {
      const elements = await browser.$$(selectors);
      return elements.length;
    } catch (error) {
      return 0;
    }
  }

  async countAny(selectorList) {
    let total = 0;
    for (const selector of selectorList) {
      total += await this.countElements(selector);
    }
    return total;
  }

  async swipeUp(duration = 800) {
    const { width, height } = await browser.getWindowSize();
    const startX = Math.round(width / 2);
    const startY = Math.round(height * 0.75);
    const endY = Math.round(height * 0.25);

    await browser
      .action('pointer')
      .move({ x: startX, y: startY })
      .down()
      .pause(duration)
      .move({ x: startX, y: endY })
      .up()
      .perform();

    await browser.pause(500);
  }

  async swipeDown(duration = 800) {
    const { width, height } = await browser.getWindowSize();
    const startX = Math.round(width / 2);
    const startY = Math.round(height * 0.25);
    const endY = Math.round(height * 0.75);

    await browser
      .action('pointer')
      .move({ x: startX, y: startY })
      .down()
      .pause(duration)
      .move({ x: startX, y: endY })
      .up()
      .perform();

    await browser.pause(500);
  }
}

module.exports = BasePage;
