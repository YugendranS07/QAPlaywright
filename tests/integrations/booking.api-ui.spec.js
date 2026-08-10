const { test, expect } = require('@playwright/test');

const APIUtils = require('../../utils/APIUtils');

const users = require('../../fixtures/users.json');

const DashboardPage = require('../../pages/DashboardPage');
const EventPage = require('../../pages/EventPage');
const BookingPage = require('../../pages/BookingPage');
const MyBookingsPage = require('../../pages/MyBookingsPage');


test.describe('Booking API UI Integration', () => {

    test.only(
        'Book event through UI and verify booking through API',
        async ({ page, request }) => {

            // =====================================================
            // OBJECT INITIALIZATION
            // =====================================================

            const apiUtils = new APIUtils(request);

            const dashboardPage =
                new DashboardPage(page);

            const eventPage =
                new EventPage(page);

            const bookingPage =
                new BookingPage(page);

            const myBookingsPage =
                new MyBookingsPage(page);


            // =====================================================
            // TEST DATA
            // =====================================================

            const customerName =
                'Yugendran Shankar';

            const customerEmail =
                'syugicontact@gmail.com';

            const customerPhone =
                '9876543210';


            // =====================================================
            // STEP 1 - LOGIN THROUGH API
            // =====================================================

            const loginResponse =
                await apiUtils.login(
                    users.validUser.email,
                    users.validUser.password
                );

            expect(loginResponse.status())
                .toBe(200);

            const loginBody =
                await loginResponse.json();

            expect(loginBody.success)
                .toBe(true);

            const token =
                loginBody.token;

            expect(token)
                .toBeTruthy();

            console.log(
                'API Login successful'
            );


            // =====================================================
            // STEP 2 - GET EVENTS THROUGH API
            // =====================================================

            const eventsResponse =
                await apiUtils.getEvents(token);

            expect(eventsResponse.status())
                .toBe(200);

            const eventsBody =
                await eventsResponse.json();

            expect(eventsBody.success)
                .toBe(true);

            console.log(
                'Events API Status:',
                eventsResponse.status()
            );


            // =====================================================
            // STEP 3 - FIND EVENT WITH AVAILABLE SEATS
            // =====================================================

            const event =
                eventsBody.data.find(
                    event =>
                        event.availableSeats > 0
                );

            expect(event)
                .toBeTruthy();

            const eventId =
                event.id;

            console.log(
                'Event ID:',
                eventId
            );

            console.log(
                'Event Title:',
                event.title
            );

            console.log(
                'Event Price:',
                event.price
            );


            // =====================================================
            // STEP 4 - OPEN DASHBOARD
            // =====================================================

            await page.goto(
                'https://eventhub.rahulshettyacademy.com/'
            );

            await dashboardPage.verifyDashboardLoaded();


            // =====================================================
            // STEP 5 - BROWSE EVENTS
            // =====================================================

            await dashboardPage.clickBrowseEvents();


            // =====================================================
            // STEP 6 - SEARCH EVENT
            // =====================================================

            await eventPage.searchEvent(
                event.title
            );


            // =====================================================
            // STEP 7 - CLICK BOOK NOW
            // =====================================================

            await eventPage.clickBookNow();


            // =====================================================
            // STEP 8 - VERIFY BOOKING FORM
            // =====================================================

            await expect(
                bookingPage.bookTicketsTextVisible
            ).toBeVisible();


            // =====================================================
            // STEP 9 - FILL BOOKING DETAILS
            // =====================================================

            await bookingPage.fillBookingDetails(
                customerName,
                customerEmail,
                customerPhone
            );


            // =====================================================
            // STEP 10 - CONFIRM BOOKING
            // =====================================================

            await bookingPage.confirmBookingNow();


            // =====================================================
            // STEP 11 - CAPTURE BOOKING REFERENCE
            // =====================================================

            const bookingRef =
                await bookingPage.getBookingRef();

            console.log(
                'UI Booking Reference:',
                bookingRef
            );

            expect(bookingRef)
                .toBeTruthy();


            // =====================================================
            // STEP 12 - GET BOOKING USING BOOKING REFERENCE
            // =====================================================

            const bookingResponse =
                await apiUtils.getBookingByRef(
                    bookingRef
                );

            console.log(
                'Booking API Status:',
                bookingResponse.status()
            );

            expect(
                bookingResponse.status()
            ).toBe(200);


            // =====================================================
            // STEP 13 - READ BOOKING RESPONSE
            // =====================================================

            const bookingBody =
                await bookingResponse.json();

            console.log(
                'Booking API Response:',
                JSON.stringify(
                    bookingBody,
                    null,
                    2
                )
            );

            expect(
                bookingBody.success
            ).toBe(true);


            const booking =
                bookingBody.data;


            // =====================================================
            // STEP 14 - VERIFY BOOKING REFERENCE
            // =====================================================

            expect(
                booking.bookingRef
            ).toBe(bookingRef);


            // =====================================================
            // STEP 15 - VERIFY EVENT ID
            // =====================================================

            expect(
                booking.eventId
            ).toBe(eventId);


            // =====================================================
            // STEP 16 - VERIFY CUSTOMER NAME
            // =====================================================

            expect(
                booking.customerName
            ).toBe(customerName);


            // =====================================================
            // STEP 17 - VERIFY CUSTOMER EMAIL
            // =====================================================

            expect(
                booking.customerEmail
            ).toBe(customerEmail);


            // =====================================================
            // STEP 18 - VERIFY CUSTOMER PHONE
            // =====================================================

            expect(
                booking.customerPhone
            ).toBe(customerPhone);


            // =====================================================
            // STEP 19 - VERIFY QUANTITY
            // =====================================================

            expect(
                booking.quantity
            ).toBe(1);


            // =====================================================
            // STEP 20 - VERIFY BOOKING STATUS
            // =====================================================

            expect(
                booking.status
            ).toBe('confirmed');


            // =====================================================
            // STEP 21 - VERIFY TOTAL PRICE
            // =====================================================

            expect(
                booking.totalPrice
            ).toBe(
                String(event.price)
            );


            console.log(
                'Booking successfully verified through API'
            );


            // =====================================================
            // STEP 22 - GET BOOKING ID
            // =====================================================

            const bookingId =
                booking.id;

            console.log(
                'Booking ID:',
                bookingId
            );

            expect(
                bookingId
            ).toBeTruthy();


            // =====================================================
            // STEP 23 - GET BOOKING USING BOOKING ID
            // =====================================================

            const bookingByIdResponse =
                await apiUtils.getBooking(
                    bookingId
                );

            expect(
                bookingByIdResponse.status()
            ).toBe(200);


            // =====================================================
            // STEP 24 - VERIFY BOOKING BY ID
            // =====================================================

            const bookingByIdBody =
                await bookingByIdResponse.json();

            console.log(
                'Booking By ID:',
                JSON.stringify(
                    bookingByIdBody,
                    null,
                    2
                )
            );

            expect(
                bookingByIdBody.success
            ).toBe(true);

            expect(
                bookingByIdBody.data.id
            ).toBe(bookingId);

            expect(
                bookingByIdBody.data.bookingRef
            ).toBe(bookingRef);

            expect(
                bookingByIdBody.data.eventId
            ).toBe(eventId);

            expect(
                bookingByIdBody.data.customerName
            ).toBe(customerName);

            expect(
                bookingByIdBody.data.customerEmail
            ).toBe(customerEmail);

            expect(
                bookingByIdBody.data.customerPhone
            ).toBe(customerPhone);

            expect(
                bookingByIdBody.data.status
            ).toBe('confirmed');


            // =====================================================
            // STEP 25 - OPEN MY BOOKINGS
            // =====================================================

            await bookingPage.viewBookingsClick();

            await myBookingsPage.waitForPageLoad();


            // =====================================================
            // STEP 26 - VERIFY BOOKING EXISTS IN UI
            // =====================================================

            await expect(
                page.getByText(bookingRef)
            ).toBeVisible();


            console.log(
                'Booking successfully verified in My Bookings UI:',
                bookingRef
            );


            // =====================================================
            // FINAL RESULT
            // =====================================================

            console.log(
                '=========================================='
            );

            console.log(
                'UI + API BOOKING INTEGRATION PASSED'
            );

            console.log(
                'Booking Ref:',
                bookingRef
            );

            console.log(
                'Booking ID:',
                bookingId
            );

            console.log(
                'Event ID:',
                eventId
            );

            console.log(
                '=========================================='
            );
        }
    );
});