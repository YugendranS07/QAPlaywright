const { test, expect } = require('../fixtures/baseFixture');

test(
    'Verify user can book an event and cancel it successfully',
    async ({
        dashboardPage,
        eventPage,
        bookingPage,
        myBookingsPage
    }) => {

        // ============================================
        // STEP 1 - Verify Dashboard
        // ============================================
  // Navigate to Dashboard
        await dashboardPage.navigate();

        // Verify Dashboard
        await dashboardPage.verifyDashboardLoaded();
        await dashboardPage.verifyDashboardLoaded();


        // ============================================
        // STEP 2 - Browse Events
        // ============================================

        await dashboardPage.clickBrowseEvents();


        // ============================================
        // STEP 3 - Search Event
        // ============================================


await bookingPage.fillBookingDetails(
    bookingData.customer.name,
    bookingData.customer.email,
    bookingData.customer.phone
);


        // ============================================
        // STEP 5 - Fill Booking Details
        // ============================================

        await bookingPage.fillBookingDetails(
            'Yugendran',
            'sampletest123@gmail.com',
            '9876543210'
        );


        // ============================================
        // STEP 6 - Confirm Booking
        // ============================================

        await bookingPage.confirmBookingNow();


        // ============================================
        // STEP 7 - Capture Booking Reference
        // ============================================

        const bookingRef =
            await bookingPage.getBookingRef();

        console.log(`Booking Reference: ${bookingRef}`);

        expect(bookingRef).toBeTruthy();


        // ============================================
        // STEP 8 - Open My Bookings
        // ============================================

        await bookingPage.viewBookingsClick();

        await myBookingsPage.waitForPageLoad();


        // ============================================
        // STEP 9 - Verify Booking
        // ============================================

        // await myBookingsPage.verifyBookingExists(
        //     bookingRef
        // );


        // ============================================
        // STEP 10 - Cancel Booking
        // ============================================

        await myBookingsPage.cancelBookingByRef(
            bookingRef
        );

    }
);