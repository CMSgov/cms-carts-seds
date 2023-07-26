@accessibility
Feature: Site Accessibility Audit
    Performs an accessibility audit on the various CARTS pages

    Rule: Admin User
        Background: Logged in as Admin
            Given I am logged in as an admin user

        Scenario Outline: Accessibility Verification
            When I visit "<URI>"
            Then the page is accessible on all device types

            Examples:
                | URI      |
                | /admin   |
                | /profile |


    Rule: State User
        Background: Logged in as User
            Given I am logged in as a state user

        Scenario Outline: Accessibility Verification
            When I visit "<URI>"
            Then the page is accessible on all device types

            Examples:
                | URI      |
                | /        |
                | /profile |
                | /help    |
