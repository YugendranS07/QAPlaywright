const { expect } = require('@playwright/test');

class MyBookingsPage {

    constructor(page) {
        this.page = page;

        this.titleMyBookings = page.getByRole('heading', { name: 'My Bookings' });
        this.confirmCancel = page.getByTestId('confirm-dialog-yes');
    }

    async waitForPageLoad() {
        await this.titleMyBookings.waitFor({ state: 'visible' });
    }

  async cancelBookingByRef(bookingRef) {

    await this.waitForPageLoad();

    const bookingCard = this.page
        .getByTestId('booking-card')
        .filter({
            has: this.page.locator('.booking-ref', {
                hasText: bookingRef
            })
        });

    await expect(bookingCard).toBeVisible();

    await bookingCard
        .getByTestId('cancel-booking-btn')
        .click();

    await this.confirmCancel.click();

    await expect(
        this.page.locator('.booking-ref', { hasText: bookingRef })
    ).toHaveCount(0);
}
}

module.exports = MyBookingsPage;