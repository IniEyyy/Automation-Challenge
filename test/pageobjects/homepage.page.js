const BasePage = require('./base.page');

/**
 * Homepage (revamp) page object for the 99.co Indonesia app.
 *
 * Locators were captured from the real app with `npm run scan:locators`.
 * The app exposes NO resource-ids; every interactive element is identified by
 * its accessibility label (`content-desc`). We therefore prefer the
 * accessibility-id selector (`~label`) and fall back to UiSelector description
 * matching. Keep the exact Indonesian labels in sync with the app.
 */
class HomepagePage extends BasePage {
  get searchBar() {
    return [
      '~Lokasi, area, project',
      'android=new UiSelector().descriptionContains("Lokasi, area, project")',
      'android=new UiSelector().descriptionContains("Lokasi")'
    ];
  }

  get searchInput() {
    return [
      'android=new UiSelector().className("android.widget.EditText")',
      'android=new UiSelector().descriptionContains("Lokasi, area, project")'
    ];
  }

  get filterButton() {
    return ['~Filter', 'android=new UiSelector().descriptionContains("Filter")'];
  }

  get heroBanner() {
    return [
      'android=new UiSelector().descriptionStartsWith("Properti Dijual di Indonesia")',
      'android=new UiSelector().descriptionStartsWith("Properti Disewakan")'
    ];
  }

  get categoryItems() {
    return [
      '~Properti Baru',
      '~Aset Bank',
      'android=new UiSelector().descriptionContains("Properti Baru")',
      'android=new UiSelector().descriptionContains("Aset Bank")'
    ];
  }

  get propertyCards() {
    return [
      'android=new UiSelector().descriptionStartsWith("Rp ")',
      'android=new UiSelector().descriptionContains("Rp ")'
    ];
  }

  get bottomNav() {
    return [
      'android=new UiSelector().descriptionStartsWith("Cari")',
      '~Cari'
    ];
  }

  get bottomNavCari() {
    return ['android=new UiSelector().descriptionStartsWith("Cari")', '~Cari'];
  }

  get bottomNavHunianBaru() {
    return [
      'android=new UiSelector().descriptionStartsWith("Hunian Baru")',
      '~Hunian Baru'
    ];
  }

  get bottomNavIklanSaya() {
    return [
      'android=new UiSelector().descriptionStartsWith("Iklan Saya")',
      '~Iklan Saya'
    ];
  }

  get bottomNavBuatIklan() {
    return [
      'android=new UiSelector().descriptionStartsWith("Buat Iklan")',
      '~Buat Iklan'
    ];
  }

  get bottomNavAkunSaya() {
    return [
      'android=new UiSelector().descriptionStartsWith("Akun Saya")',
      '~Akun Saya'
    ];
  }

  get profileScreen() {
    return [
      '~Login / Daftar',
      'android=new UiSelector().descriptionContains("Login / Daftar")',
      'android=new UiSelector().descriptionContains("silahkan Login")'
    ];
  }

  async waitForHomepage(timeout = 20000) {
    await this.waitForDisplayed(this.bottomNav, timeout);
    return this;
  }

  async isHomepageDisplayed() {
    return this.isDisplayed(this.bottomNav);
  }

  async isSearchBarDisplayed() {
    return this.isDisplayed(this.searchBar);
  }

  async isSearchInputDisplayed() {
    return this.isDisplayed(this.searchInput);
  }

  async isHeroBannerDisplayed() {
    return this.isDisplayed(this.heroBanner);
  }

  async areCategoryShortcutsDisplayed() {
    return (await this.countAny(this.categoryItems)) > 0;
  }

  async isPropertyFeedDisplayed() {
    return (await this.countAny(this.propertyCards)) > 0;
  }

  async isBottomNavDisplayed() {
    return this.isDisplayed(this.bottomNav);
  }

  async isProfileScreenDisplayed() {
    return this.isDisplayed(this.profileScreen);
  }

  async getPropertyCardCount() {
    return this.countAny(this.propertyCards);
  }

  async goToHomeTab() {
    // With noReset enabled the app can resume on the last opened tab or even
    // on a sub-screen (e.g. search). First dismiss any screen that exposes a
    // Back button, then select the "Cari" (home) tab.
    for (let attempt = 0; attempt < 3; attempt += 1) {
      const back = await this.findElement(
        ['~Back', 'android=new UiSelector().description("Back")'],
        1500
      );
      if (!back) {
        break;
      }
      await back.click();
      await browser.pause(1000);
    }

    try {
      const tab = await this.findElement(this.bottomNavCari, 5000);
      if (tab) {
        await tab.click();
        await browser.pause(1000);
      }
    } catch (error) {
      // Bottom nav not available yet; the caller will wait for the homepage.
    }
  }

  async tapSearchBar() {
    // The search field is exposed as one merged accessibility node that spans
    // the whole content area, so clicking it hits a listing card. Instead we
    // tap the empty area to the left of the "Filter" button, which is on the
    // same row as the search field.
    const filter = await this.findElement(this.filterButton, 5000);
    if (filter) {
      const location = await filter.getLocation();
      const size = await filter.getSize();
      const x = Math.max(1, Math.round(location.x * 0.45));
      const y = location.y + Math.round(size.height / 2);
      await browser.action('pointer').move({ x, y }).down().up().perform();
      return;
    }

    await this.tap(this.searchBar);
  }

  async tapFilter() {
    await this.tap(this.filterButton);
  }

  async tapBottomNav(tab) {
    const tabs = {
      cari: this.bottomNavCari,
      'hunian baru': this.bottomNavHunianBaru,
      'iklan saya': this.bottomNavIklanSaya,
      'buat iklan': this.bottomNavBuatIklan,
      'akun saya': this.bottomNavAkunSaya,
      profile: this.bottomNavAkunSaya
    };

    const selectors = tabs[String(tab).toLowerCase()];
    if (!selectors) {
      throw new Error(`Unknown bottom navigation tab: "${tab}"`);
    }

    await this.tap(selectors);
  }

  async scrollFeed() {
    await this.swipeUp();
  }

  async scrollToTop() {
    await this.swipeDown();
  }
}

module.exports = new HomepagePage();
