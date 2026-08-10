const { test, expect } = require('@playwright/test');

const APIUtils = require('../../utils/APIUtils');
const users = require('../../fixtures/users.json');


test('Create, update, verify and delete event through API', async ({ request }) => {

    const apiUtils = new APIUtils(request);

    let eventId;


    // ============================================
    // STEP 1 - LOGIN
    // ============================================

    const loginResponse = await apiUtils.login(
        users.validUser.email,
        users.validUser.password
    );

    console.log(
        'Login Status:',
        loginResponse.status()
    );

    expect(loginResponse.status()).toBe(200);


    // ============================================
    // STEP 2 - CREATE EVENT DATA
    // ============================================

    const eventData = {

        title: 'Playwright CRUD Test Event',

        description:
            'Created for API automation testing',

        category:
            'Conference',

        venue:
            'Automation Testing Center',

        city:
            'Chennai',

        eventDate:
            '2027-01-15T10:00:00.000Z',

        price:
            1000,

        totalSeats:
            100,

        imageUrl:
            'https://example.com/test-event.jpg'
    };


    // ============================================
    // TRY
    // All CRUD operations are inside try.
    // Finally will always execute for cleanup.
    // ============================================

    try {

        // ========================================
        // STEP 3 - CREATE EVENT
        // ========================================

        const createResponse =
            await apiUtils.createEvent(eventData);


        console.log(
            'Create Status:',
            createResponse.status()
        );


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


        // ========================================
        // STEP 4 - VALIDATE CREATE
        // ========================================

        expect(createResponse.status())
            .toBe(201);

        expect(createBody.success)
            .toBe(true);

        expect(createBody.data)
            .toBeDefined();


        // ========================================
        // STEP 5 - CAPTURE EVENT ID
        // ========================================

        eventId =
            createBody.data.id;


        console.log(
            'Created Event ID:',
            eventId
        );


        expect(eventId)
            .toBeDefined();


        // ========================================
        // STEP 6 - GET CREATED EVENT
        // ========================================

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


        console.log(
            'Get Response:',
            JSON.stringify(
                getBody,
                null,
                2
            )
        );


        // ========================================
        // STEP 7 - VALIDATE CREATED EVENT
        // ========================================

        expect(getBody.success)
            .toBe(true);

        expect(getBody.data.id)
            .toBe(eventId);

        expect(getBody.data.title)
            .toBe(eventData.title);

        expect(getBody.data.description)
            .toBe(eventData.description);

        expect(getBody.data.category)
            .toBe(eventData.category);

        expect(getBody.data.city)
            .toBe(eventData.city);

        // API returns price as String
        expect(getBody.data.price)
            .toBe(String(eventData.price));

        expect(getBody.data.totalSeats)
            .toBe(eventData.totalSeats);


        // ========================================
        // STEP 8 - UPDATE EVENT DATA
        // ========================================

        const updatedEventData = {

            title:
                'Playwright CRUD Updated Event',

            description:
                'Updated through Playwright API automation',

            category:
                'Workshop',

            venue:
                'Updated Automation Testing Center',

            city:
                'Chennai',

            eventDate:
                '2027-02-15T10:00:00.000Z',

            price:
                1500,

            totalSeats:
                200,

            imageUrl:
                'https://example.com/updated-event.jpg'
        };


        // ========================================
        // STEP 9 - UPDATE EVENT
        // ========================================

        const updateResponse =
            await apiUtils.updateEvent(
                eventId,
                updatedEventData
            );


        console.log(
            'Update Status:',
            updateResponse.status()
        );


        const updateBody =
            await updateResponse.json();


        console.log(
            'Update Response:',
            JSON.stringify(
                updateBody,
                null,
                2
            )
        );


        // ========================================
        // STEP 10 - VALIDATE UPDATE
        // ========================================

        expect(updateResponse.status())
            .toBe(200);

        expect(updateBody.success)
            .toBe(true);


        // ========================================
        // STEP 11 - GET UPDATED EVENT
        // ========================================

        const updatedGetResponse =
            await apiUtils.getEventById(
                eventId
            );


        console.log(
            'Updated Get Status:',
            updatedGetResponse.status()
        );


        expect(updatedGetResponse.status())
            .toBe(200);


        const updatedGetBody =
            await updatedGetResponse.json();


        console.log(
            'Updated Event:',
            JSON.stringify(
                updatedGetBody,
                null,
                2
            )
        );


        // ========================================
        // STEP 12 - VALIDATE UPDATED DATA
        // ========================================

        expect(updatedGetBody.success)
            .toBe(true);

        expect(updatedGetBody.data.id)
            .toBe(eventId);

        expect(updatedGetBody.data.title)
            .toBe(updatedEventData.title);

        expect(updatedGetBody.data.description)
            .toBe(updatedEventData.description);

        expect(updatedGetBody.data.category)
            .toBe(updatedEventData.category);

        expect(updatedGetBody.data.venue)
            .toBe(updatedEventData.venue);

        expect(updatedGetBody.data.city)
            .toBe(updatedEventData.city);

        expect(updatedGetBody.data.price)
            .toBe(String(updatedEventData.price));

        expect(updatedGetBody.data.totalSeats)
            .toBe(updatedEventData.totalSeats);


        // ========================================
        // STEP 13 - DELETE EVENT
        // ========================================

        const deleteResponse =
            await apiUtils.deleteEvent(
                eventId
            );


        console.log(
            'Delete Status:',
            deleteResponse.status()
        );


        const deleteBody =
            await deleteResponse.json();


        console.log(
            'Delete Response:',
            JSON.stringify(
                deleteBody,
                null,
                2
            )
        );


        // ========================================
        // STEP 14 - VALIDATE DELETE
        // ========================================

        expect(deleteResponse.status())
            .toBe(200);

        expect(deleteBody.success)
            .toBe(true);

            


        // ========================================
        // STEP 15 - VERIFY EVENT IS DELETED
        // ========================================

        const deletedGetResponse =
            await apiUtils.getEventById(
                eventId
            );


        console.log(
            'Get Deleted Event Status:',
            deletedGetResponse.status()
        );


        const deletedBody =
            await deletedGetResponse.json();


        console.log(
            'Get Deleted Event Response:',
            JSON.stringify(
                deletedBody,
                null,
                2
            )
        );


        // ========================================
        // STEP 16 - VALIDATE 404
        // ========================================

        expect(deletedGetResponse.status())
            .toBe(404);

        expect(deletedBody.success)
            .toBe(false);

        expect(deletedBody.error)
            .toContain(
                `Event with id ${eventId} not found`
            );

    }

    finally {

        // ========================================
        // CLEANUP
        // ========================================
        // If the test fails before DELETE,
        // this block will still execute.
        //
        // If the event was already deleted,
        // we don't try to delete it again.
        // ========================================

        if (eventId) {

            try {

                const cleanupResponse =
                    await apiUtils.deleteEvent(
                        eventId
                    );


                console.log(
                    'Cleanup Delete Status:',
                    cleanupResponse.status()
                );

            }

            catch (error) {

                console.log(
                    'Cleanup failed:',
                    error.message
                );

            }
        }
    }

});