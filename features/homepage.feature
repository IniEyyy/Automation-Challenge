@android
Feature: 99 App - Homepage Revamp

  As a QA Engineer on the 99 app
  I want the revamped homepage to be covered by automated checks
  So that layout and navigation regressions are caught early

  Background:
    Given the 99 app is launched
    And the homepage is displayed

  @smoke
  Scenario: Homepage renders all core revamp sections
    Then the property search bar should be visible
    And the primary category shortcuts should be visible
    And the property recommendation feed should be displayed
    And the bottom navigation should be visible

  @smoke
  Scenario: User opens the search experience from the homepage
    When I tap the property search bar
    Then the search input should be displayed

  @regression
  Scenario: Homepage feed can be scrolled
    When I scroll the homepage feed down
    Then the property recommendation feed should still be displayed
    And the bottom navigation should remain visible

  @regression
  Scenario: Bottom navigation opens the account tab
    When I open the "Akun Saya" tab from the bottom navigation
    Then the profile screen should be displayed
