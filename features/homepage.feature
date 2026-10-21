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

  @smoke
  Scenario: User searches for a location by typing
    When I tap the property search bar
    And I type "Jakarta" in the search input
    Then search suggestions should be displayed for "Jakarta"

  @regression
  Scenario: Homepage feed can be scrolled
    When I scroll the homepage feed down
    Then the property recommendation feed should still be displayed
    And the bottom navigation should remain visible

  @regression
  Scenario: User opens the filter options from the homepage
    When I tap the filter button
    Then the filter options should be displayed
    When I close the filter options

  @regression
  Scenario Outline: Bottom navigation opens each main tab
    When I open the "<tab>" tab from the bottom navigation
    Then the "<tab>" tab screen should be displayed

    Examples:
      | tab         |
      | Cari        |
      | Hunian Baru |
      | Iklan Saya  |
      | Buat Iklan  |
      | Akun Saya   |
