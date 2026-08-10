const { expect } = require('@playwright/test');
const bookingData = require('../fixtures/bookingData.json');
class BookingPage {

    constructor(page) {
        this.page = page;

        this.bookTicketsTextVisible = page.getByRole('heading', { name: 'Book Tickets' });
        this.fullName = page.getByPlaceholder('Your full name');
        this.email = page.getByPlaceholder('you@email.com');
        this.phone = page.getByPlaceholder('+91 98765 43210');
        this.confirmBooking = page.getByRole('button', { name: 'Confirm Booking' });
        this.viewBookings = page.getByRole('button', { name: 'View My Bookings' });
        this.bookingRef = page.locator('.booking-ref');
    }

    async fillBookingDetails(name, email, phone) {
        await expect(this.bookTicketsTextVisible).toBeVisible();
        await this.fullName.fill(name);
        await this.email.fill(email);
        await this.phone.fill(phone);
    }

    async confirmBookingNow() {
        await this.confirmBooking.click();
    }

    async getBookingRef() {
        await this.bookingRef.waitFor({ state: 'visible' });
        return (await this.bookingRef.textContent()).trim();
    }

    async viewBookingsClick() {
        await this.viewBookings.waitFor({ state: 'visible' });
        await this.viewBookings.click();
    }
}

module.exports = BookingPage;