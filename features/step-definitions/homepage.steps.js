const assert = require('node:assert');
const { Given, When, Then } = require('@wdio/cucumber-framework');
const homepage = require('../../test/pageobjects/homepage.page');

Given('the 99 app is launched', async () => {
  // The Appium session launches the app using the capabilities
  // (app path or appPackage / appActivity). Here we only assert the
  // session is alive before interacting with the UI.
  assert.ok(browser.sessionId, 'Expected an active Appium session');
});

Given('the homepage is displayed', async () => {
  await homepage.goToHomeTab();
  await homepage.waitForHomepage();
  assert.ok(await homepage.isHomepageDisplayed(), 'Homepage should be displayed after launch');
});

When('I tap the property search bar', async () => {
  await homepage.tapSearchBar();
});

When('I type {string} in the search input', async (text) => {
  await homepage.typeSearchQuery(text);
});

When('I tap the filter button', async () => {
  await homepage.tapFilter();
});

When('I close the filter options', async () => {
  await homepage.closeFilterModal();
});

When('I scroll the homepage feed down', async () => {
  await homepage.scrollFeed();
});

When('I open the {string} tab from the bottom navigation', async (tab) => {
  await homepage.tapBottomNav(tab);
});

Then('the property search bar should be visible', async () => {
  assert.ok(await homepage.isSearchBarDisplayed(), 'Property search bar should be visible');
});

Then('the primary category shortcuts should be visible', async () => {
  assert.ok(await homepage.areCategoryShortcutsDisplayed(), 'Primary category shortcuts should be visible');
});

Then('the property recommendation feed should be displayed', async () => {
  assert.ok(await homepage.isPropertyFeedDisplayed(), 'Property recommendation feed should be displayed');
});

Then('the property recommendation feed should still be displayed', async () => {
  assert.ok(await homepage.isPropertyFeedDisplayed(), 'Property recommendation feed should still be displayed after scrolling');
});

Then('the bottom navigation should be visible', async () => {
  assert.ok(await homepage.isBottomNavDisplayed(), 'Bottom navigation should be visible');
});

Then('the bottom navigation should remain visible', async () => {
  assert.ok(await homepage.isBottomNavDisplayed(), 'Bottom navigation should remain visible after scrolling');
});

Then('the search input should be displayed', async () => {
  assert.ok(await homepage.isSearchInputDisplayed(), 'Search input should be displayed after tapping the search bar');
});

Then('search suggestions should be displayed for {string}', async (text) => {
  assert.ok(
    await homepage.areSearchSuggestionsDisplayed(text),
    `Search suggestions for "${text}" should be displayed`
  );
});

Then('the filter options should be displayed', async () => {
  assert.ok(await homepage.isFilterModalDisplayed(), 'Filter options should be displayed after tapping the Filter button');
});

Then('the {string} tab screen should be displayed', async (tab) => {
  assert.ok(
    await homepage.isTabDestinationDisplayed(tab),
    `The "${tab}" tab screen should be displayed`
  );
});

Then('the profile screen should be displayed', async () => {
  assert.ok(await homepage.isProfileScreenDisplayed(), 'Profile screen should be displayed after tapping the Profile tab');
});
