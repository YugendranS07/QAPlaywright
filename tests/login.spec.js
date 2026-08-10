const { test, expect } = require('../fixtures/baseFixture');
const users = require('../fixtures/users.json');

test.describe('Authentication and Booking Module', () => {

    // ============================================================
    // VALID LOGIN
    // ============================================================

    test('Valid Login', async ({ loginPage, dashboardPage }) => {

        await loginPage.navigate();

        await loginPage.login(
            users.validUser.email,
            users.validUser.password
        );

        await dashboardPage.verifyDashboardLoaded();

    });


    // ============================================================
    // INVALID LOGIN SCENARIOS
    // ============================================================

    users.invalidScenarios.forEach((user) => {

        test(`Invalid Login - ${user.name}`, async ({ loginPage }) => {

            await loginPage.navigate();

            await loginPage.login(
                user.email,
                user.password
            );

            await loginPage.verifyErrorMessage(
                user.message
            );

        });

    });


    // ============================================================
    // DASHBOARD EVENT COUNT
    // ============================================================

    test('Dashboard displays events after login', async ({
        loginPage,
        dashboardPage
    }) => {

        await loginPage.navigate();

        await loginPage.login(
            users.validUser.email,
            users.validUser.password
        );

        await dashboardPage.verifyDashboardLoaded();

        const eventCount =
            await dashboardPage.getEventCount();

        expect(eventCount).toBeGreaterThan(0);

    });


    // ============================================================
    // COMPLETE BOOKING FLOW
    // ============================================================

    test('Verify user can book an event and cancel it successfully', async ({
        loginPage,
        dashboardPage,
        eventPage,
        bookingPage,
        myBookingsPage
    }) => {

        // --------------------------------------------------------
        // STEP 1 - Login
        // --------------------------------------------------------

        await loginPage.navigate();

        await loginPage.login(
            users.validUser.email,
            users.validUser.password
        );

        await dashboardPage.verifyDashboardLoaded();


        // --------------------------------------------------------
        // STEP 2 - Navigate to Browse Events
        // --------------------------------------------------------

        await dashboardPage.clickBrowseEvents();


        // --------------------------------------------------------
        // STEP 3 - Search Event
        // --------------------------------------------------------

        await eventPage.searchEvent('dill');


        // --------------------------------------------------------
        // STEP 4 - Click Book Now for the searched event
        // --------------------------------------------------------

        await eventPage.clickBookNow();


        // --------------------------------------------------------
        // STEP 5 - Fill Booking Details
        // --------------------------------------------------------

        await bookingPage.fillBookingDetails(
            'Yugendran',
            'sampletest123@gmail.com',
            '9876543210'
        );


        // --------------------------------------------------------
        // STEP 6 - Confirm Booking
        // --------------------------------------------------------

        await bookingPage.confirmBookingNow();


        // --------------------------------------------------------
        // STEP 7 - Capture Booking Reference
        // --------------------------------------------------------

        const bookingRef =
            await bookingPage.getBookingRef();

        console.log(
            `Booking Reference: ${bookingRef}`
        );

        expect(bookingRef).toBeTruthy();


        // --------------------------------------------------------
        // STEP 8 - Navigate to My Bookings
        // --------------------------------------------------------

        await bookingPage.viewBookingsClick();

        await myBookingsPage.waitForPageLoad();


        // --------------------------------------------------------
        // STEP 10 - Cancel Booking
        // --------------------------------------------------------

        await myBookingsPage.cancelBookingByRef(
            bookingRef
        );

    });

});