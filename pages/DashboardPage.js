const { expect } = require('@playwright/test');

class DashboardPage {

    constructor(page) {
        this.page = page;

        this.logoutButton =
            page.getByRole('button', { name: 'Logout' });

        this.eventCards =
            page.getByTestId('event-card');

        this.browseEventsButton =
            page.getByRole('link', { name: 'Browse Events →' });
    }

    async navigate() {
        await this.page.goto('/');
    }

    async verifyDashboardLoaded() {

        await expect(this.page).toHaveURL(
            'https://eventhub.rahulshettyacademy.com/'
        );

        await expect(this.logoutButton).toBeVisible({
            timeout: 60000
        });

        await expect(this.eventCards.first()).toBeVisible({
            timeout: 60000
        });
    }

    async getEventCount() {
        return await this.eventCards.count();
    }

    async clickBrowseEvents() {

        await expect(this.browseEventsButton).toBeVisible({
            timeout: 60000
        });

        await this.browseEventsButton.click();
    }
}

module.exports = DashboardPage;