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
      'android=new UiSelector().descriptionStartsWith("Lokasi, area")'
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
    return this.bottomNavCari;
  }

  get bottomNavCari() {
    return [
      'android=new UiSelector().descriptionContains("Tab 1 of 5")',
      '~Cari\nTab 1 of 5',
      'android=new UiSelector().descriptionStartsWith("Cari")',
      '~Cari'
    ];
  }

  get bottomNavHunianBaru() {
    return [
      'android=new UiSelector().descriptionContains("Tab 2 of 5")',
      '~Hunian Baru\nTab 2 of 5',
      'android=new UiSelector().descriptionStartsWith("Hunian Baru")',
      '~Hunian Baru'
    ];
  }

  get bottomNavIklanSaya() {
    return [
      'android=new UiSelector().descriptionContains("Tab 3 of 5")',
      '~Iklan Saya\nTab 3 of 5',
      'android=new UiSelector().descriptionStartsWith("Iklan Saya")',
      '~Iklan Saya'
    ];
  }

  get bottomNavBuatIklan() {
    return [
      'android=new UiSelector().descriptionContains("Tab 4 of 5")',
      '~Buat Iklan\nTab 4 of 5',
      'android=new UiSelector().descriptionStartsWith("Buat Iklan")',
      '~Buat Iklan'
    ];
  }

  get bottomNavAkunSaya() {
    return [
      'android=new UiSelector().descriptionContains("Tab 5 of 5")',
      '~Akun Saya\nTab 5 of 5',
      'android=new UiSelector().descriptionStartsWith("Akun Saya")',
      '~Akun Saya'
    ];
  }

  get filterModal() {
    return [
      '~Terapkan',
      'android=new UiSelector().descriptionContains("Terapkan")',
      '~Tipe Iklan',
      'android=new UiSelector().descriptionContains("Tipe Iklan")'
    ];
  }

  get hunianBaruScreen() {
    return [
      '~Properti Pilihan 99.co',
      'android=new UiSelector().descriptionContains("Properti Pilihan 99.co")',
      'android=new UiSelector().descriptionContains("Cari Lokasi, area, atau Nama Proyek")'
    ];
  }

  get searchSuggestions() {
    return [
      '~Lokasi Terkait',
      'android=new UiSelector().descriptionContains("Lokasi Terkait")'
    ];
  }

  get profileScreen() {
    return [
      '~Login / Daftar',
      'android=new UiSelector().descriptionContains("Login / Daftar")',
      'android=new UiSelector().descriptionContains("silahkan Login")'
    ];
  }

  get loginPrompt() {
    return this.profileScreen;
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
    return (await this.waitForAny(this.categoryItems)) > 0;
  }

  async isPropertyFeedDisplayed() {
    return (await this.waitForAny(this.propertyCards)) > 0;
  }

  async isBottomNavDisplayed() {
    return this.isDisplayed(this.bottomNav);
  }

  async isProfileScreenDisplayed() {
    return this.isDisplayed(this.profileScreen);
  }

  async isFilterModalDisplayed() {
    return this.isDisplayed(this.filterModal, 10000);
  }

  async isTabDestinationDisplayed(tab) {
    const normalized = String(tab).trim().toLowerCase();

    if (normalized === 'cari') {
      return this.isSearchBarDisplayed();
    }
    if (normalized === 'hunian baru') {
      return (await this.waitForAny(this.hunianBaruScreen, 15000)) > 0;
    }
    if (['iklan saya', 'buat iklan', 'akun saya', 'profile'].includes(normalized)) {
      return (await this.waitForAny(this.loginPrompt, 15000)) > 0;
    }

    throw new Error(`Unknown bottom navigation tab: "${tab}"`);
  }

  async getPropertyCardCount() {
    return this.countFirst(this.propertyCards);
  }

  async goToHomeTab() {
    // With noReset enabled the app can resume on the last opened tab or even
    // on a full-screen sub-screen (search, filter, login prompt). Only use the
    // hardware back button when the bottom navigation is not reachable, so we
    // never risk closing the app from a tab screen.
    for (let attempt = 0; attempt < 6; attempt += 1) {
      const tab = await this.findElement(this.bottomNavCari, 1200);
      if (tab) {
        try {
          await tab.click();
        } catch (error) {
          // The tab can be detached while the screen animates; retry.
        }

        if (await this.isDisplayed(this.searchBar, 3000)) {
          return;
        }
        continue;
      }

      try {
        await browser.back();
      } catch (error) {
        // No back action available; let the caller surface the timeout.
      }
      await browser.pause(800);
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

  async typeSearchQuery(text) {
    const input = await this.waitForDisplayed(this.searchInput, 10000);
    await input.click();
    await input.setValue(text);
    await browser.pause(1200);

    try {
      // Submit the query so the app resolves locations instead of only
      // showing the in-progress text.
      await browser.pressKeyCode(66);
    } catch (error) {
      // Suggestions can still appear from the input event alone.
    }

    await browser.pause(2500);
  }

  async areSearchSuggestionsDisplayed(text) {
    const suggestions = await this.waitForAny(this.searchSuggestions, 15000);
    if (suggestions === 0) {
      return false;
    }

    const input = await this.findElement(this.searchInput, 2000);
    if (!input) {
      return false;
    }

    const value = await input
      .getValue()
      .catch(() => input.getText().catch(() => ''));
    return String(value).toLowerCase().includes(String(text).toLowerCase());
  }

  async tapFilter() {
    await this.tap(this.filterButton);
  }

  async closeFilterModal() {
    await browser.back();
    await browser.pause(800);
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
