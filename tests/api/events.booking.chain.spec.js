const { test, expect } = require('@playwright/test');

const APIUtils = require('../../utils/APIUtils');

const users = require('../../fixtures/users.json');


test(
    'Create event, update event and create booking using API chaining',
    async ({ request }) => {

        const apiUtils =
            new APIUtils(request);


        // =====================================================
        // TEST DATA
        // =====================================================

        const eventData = {

            title:
                `Chained API Event ${Date.now()}`,

            description:
                'Event created for API request chaining',

            category:
                'Conference',

            venue:
                'Automation Testing Center',

            city:
                'Chennai',

            eventDate:
                '2027-06-15T10:00:00.000Z',

            price:
                1500,

            totalSeats:
                100,

            imageUrl:
                'https://example.com/chained-event.jpg'
        };


        // =====================================================
        // STEP 1 - LOGIN
        // =====================================================

        const loginResponse =
            await apiUtils.login(
                users.validUser.email,
                users.validUser.password
            );

        expect(loginResponse.status())
            .toBe(200);


        // =====================================================
        // STEP 2 - CREATE EVENT
        // =====================================================

        const createResponse =
            await apiUtils.createEvent(
                eventData
            );

        console.log(
            'Create Status:',
            createResponse.status()
        );

        expect(createResponse.status())
            .toBe(201);


        const createBody =
            await createResponse.json();

        console.log(
            'Create Response:',
            JSON.stringify(
                createBody,
                null,
                2
            )
        );

        expect(createBody.success)
            .toBe(true);


        // =====================================================
        // STEP 3 - CAPTURE EVENT ID
        // =====================================================

        const eventId =
            createBody.data.id;

        console.log(
            'Created Event ID:',
            eventId
        );

        expect(eventId)
            .toBeTruthy();


        // =====================================================
        // STEP 4 - GET EVENT USING DYNAMIC EVENT ID
        // =====================================================

        const getResponse =
            await apiUtils.getEventById(
                eventId
            );

        console.log(
            'Get Status:',
            getResponse.status()
        );

        expect(getResponse.status())
            .toBe(200);


        const getBody =
            await getResponse.json();

        expect(getBody.success)
            .toBe(true);


        expect(
            getBody.data.id
        ).toBe(eventId);


        expect(
            getBody.data.title
        ).toBe(eventData.title);


        // =====================================================
        // STEP 5 - UPDATE SAME EVENT
        // =====================================================

        const updatedEventData = {

            title:
                `Updated Chained Event ${Date.now()}`,

            description:
                'Updated through API chaining',

            category:
                'Workshop',

            venue:
                'Updated Automation Testing Center',

            city:
                'Chennai',

            eventDate:
                '2027-07-15T10:00:00.000Z',

            price:
                2500,

            totalSeats:
                200,

            imageUrl:
                'https://example.com/updated-event.jpg'
        };


        const updateResponse =
            await apiUtils.updateEvent(
                eventId,
                updatedEventData
            );

        console.log(
            'Update Status:',
            updateResponse.status()
        );

        expect(updateResponse.status())
            .toBe(200);


        const updateBody =
            await updateResponse.json();

        expect(updateBody.success)
            .toBe(true);


        expect(
            updateBody.data.id
        ).toBe(eventId);


        expect(
            updateBody.data.title
        ).toBe(updatedEventData.title);


        expect(
            updateBody.data.price
        ).toBe(String(updatedEventData.price));


        // =====================================================
        // STEP 6 - GET UPDATED EVENT
        // =====================================================

        const updatedGetResponse =
            await apiUtils.getEventById(
                eventId
            );

        expect(
            updatedGetResponse.status()
        ).toBe(200);


        const updatedGetBody =
            await updatedGetResponse.json();


        expect(
            updatedGetBody.data.id
        ).toBe(eventId);


        expect(
            updatedGetBody.data.title
        ).toBe(updatedEventData.title);


        expect(
            updatedGetBody.data.category
        ).toBe(updatedEventData.category);


        expect(
            updatedGetBody.data.price
        ).toBe(
            String(updatedEventData.price)
        );


        // =====================================================
        // STEP 7 - CREATE BOOKING USING EVENT ID
        // =====================================================

        const bookingData = {

            eventId:
                eventId,

            customerName:
                'Yugendran Shankar',

            customerEmail:
                users.validUser.email,

            customerPhone:
                '9876543210',

            quantity:
                1
        };


        const bookingResponse =
            await apiUtils.createBooking(
                bookingData
            );


        console.log(
            'Booking Status:',
            bookingResponse.status()
        );


        expect(
            bookingResponse.status()
        ).toBe(201);


        const bookingBody =
            await bookingResponse.json();


        console.log(
            'Booking Response:',
            JSON.stringify(
                bookingBody,
                null,
                2
            )
        );


        expect(
            bookingBody.success
        ).toBe(true);


        // =====================================================
        // STEP 8 - CAPTURE BOOKING REFERENCE
        // =====================================================

        const booking =
            bookingBody.data;

        const bookingId =
            booking.id;

        const bookingRef =
            booking.bookingRef;


        console.log(
            'Booking ID:',
            bookingId
        );

        console.log(
            'Booking Reference:',
            bookingRef
        );


        expect(bookingId)
            .toBeTruthy();

        expect(bookingRef)
            .toBeTruthy();


        // =====================================================
        // STEP 9 - GET BOOKING USING BOOKING REF
        // =====================================================

        const bookingByRefResponse =
            await apiUtils.getBookingByRef(
                bookingRef
            );


        expect(
            bookingByRefResponse.status()
        ).toBe(200);


        const bookingByRefBody =
            await bookingByRefResponse.json();


        expect(
            bookingByRefBody.success
        ).toBe(true);


        expect(
            bookingByRefBody.data.bookingRef
        ).toBe(bookingRef);


        expect(
            bookingByRefBody.data.eventId
        ).toBe(eventId);


        expect(
            bookingByRefBody.data.customerEmail
        ).toBe(
            users.validUser.email
        );


        // =====================================================
        // STEP 10 - GET BOOKING USING BOOKING ID
        // =====================================================

        const bookingByIdResponse =
            await apiUtils.getBooking(
                bookingId
            );


        expect(
            bookingByIdResponse.status()
        ).toBe(200);


        const bookingByIdBody =
            await bookingByIdResponse.json();


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
            bookingByIdBody.data.status
        ).toBe('confirmed');


        console.log(
            'Complete API request chain passed'
        );


        // =====================================================
        // STEP 11 - CLEANUP
        // =====================================================

        const deleteResponse =
            await apiUtils.deleteEvent(
                eventId
            );


        console.log(
            'Cleanup Delete Status:',
            deleteResponse.status()
        );


        expect(
            deleteResponse.status()
        ).toBe(200);
    }
);