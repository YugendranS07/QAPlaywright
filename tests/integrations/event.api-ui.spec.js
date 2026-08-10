const { test, expect } = require('@playwright/test');

const APIUtils = require('../../utils/APIUtils');
const DashboardPage = require('../../pages/DashboardPage');
const EventPage = require('../../pages/EventPage');

const users = require('../../fixtures/users.json');


// ==================================================
// TEST 1
// API CREATE → UI VERIFY → API DELETE
// ==================================================

test('Create event through API and verify it in UI', async ({
    request,
    page
}) => {

    const apiUtils = new APIUtils(request);

    const dashboardPage = new DashboardPage(page);
    const eventPage = new EventPage(page);

    let createdEventId;

    try {

        // ============================================
        // STEP 1 - API LOGIN
        // ============================================

        const loginResponse = await apiUtils.login(
            users.validUser.email,
            users.validUser.password
        );

        expect(loginResponse.status()).toBe(200);


        // ============================================
        // STEP 2 - CREATE UNIQUE EVENT DATA
        // ============================================

        const eventTitle =
            `API UI Integration Event ${Date.now()}`;

        const eventData = {

            title: eventTitle,

            description:
                'Event created through API for UI validation',

            category:
                'Conference',

            venue:
                'Automation Testing Center',

            city:
                'Chennai',

            eventDate:
                '2027-03-15T10:00:00.000Z',

            price:
                1500,

            totalSeats:
                100,

            imageUrl:
                'https://example.com/integration-test.jpg'
        };


        // ============================================
        // STEP 3 - CREATE EVENT THROUGH API
        // ============================================

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
            JSON.stringify(createBody, null, 2)
        );


        // ============================================
        // STEP 4 - VALIDATE API RESPONSE
        // ============================================

        expect(createResponse.status()).toBe(201);

        expect(createBody.success).toBe(true);

        createdEventId =
            createBody.data.id;

        expect(createBody.data.title)
            .toBe(eventTitle);

        console.log(
            'Created Event ID:',
            createdEventId
        );


        // ============================================
        // STEP 5 - OPEN DASHBOARD
        // ============================================

        await page.goto(
            'https://eventhub.rahulshettyacademy.com/'
        );

        await dashboardPage.verifyDashboardLoaded();


        // ============================================
        // STEP 6 - BROWSE EVENTS
        // ============================================

        await dashboardPage.clickBrowseEvents();


        // ============================================
        // STEP 7 - SEARCH API-CREATED EVENT
        // ============================================

        await eventPage.searchEvent(eventTitle);


        // ============================================
        // STEP 8 - VERIFY EVENT IN UI
        // ============================================

        await expect(
            eventPage.eventCard
        ).toBeVisible();

        await expect(
            eventPage.eventCard
        ).toContainText(eventTitle);


        console.log(
            `UI successfully displayed API-created event: ${eventTitle}`
        );

    }

    finally {

        // ============================================
        // STEP 9 - CLEANUP
        // ============================================

        if (createdEventId) {

            const deleteResponse =
                await apiUtils.deleteEvent(
                    createdEventId
                );

            console.log(
                'Cleanup Delete Status:',
                deleteResponse.status()
            );

            const deleteBody =
                await deleteResponse.json();

            console.log(
                'Cleanup Delete Response:',
                JSON.stringify(
                    deleteBody,
                    null,
                    2
                )
            );

            expect(
                deleteResponse.status()
            ).toBe(200);
        }
    }
});


// ==================================================
// TEST 2
// API CREATE → UI VERIFY → API UPDATE → UI VERIFY
// → API DELETE
// ==================================================

test('Update event through API and verify updated data in UI', async ({
    request,
    page
}) => {

    const apiUtils = new APIUtils(request);

    const dashboardPage = new DashboardPage(page);
    const eventPage = new EventPage(page);

    let createdEventId;


    const originalTitle =
        `API UI Update Event ${Date.now()}`;

    const updatedTitle =
        `API UI Updated Event ${Date.now()}`;


    try {

        // ============================================
        // STEP 1 - API LOGIN
        // ============================================

        const loginResponse = await apiUtils.login(
            users.validUser.email,
            users.validUser.password
        );

        expect(loginResponse.status()).toBe(200);


        // ============================================
        // STEP 2 - CREATE EVENT
        // ============================================

        const createData = {

            title: originalTitle,

            description:
                'Event created for API UI update testing',

            category:
                'Conference',

            venue:
                'Automation Testing Center',

            city:
                'Chennai',

            eventDate:
                '2027-04-15T10:00:00.000Z',

            price:
                1500,

            totalSeats:
                100,

            imageUrl:
                'https://example.com/update-test.jpg'
        };


        const createResponse =
            await apiUtils.createEvent(createData);


        console.log(
            'Create Status:',
            createResponse.status()
        );


        expect(createResponse.status())
            .toBe(201);


        const createBody =
            await createResponse.json();


        createdEventId =
            createBody.data.id;


        console.log(
            'Created Event ID:',
            createdEventId
        );


        // ============================================
        // STEP 3 - OPEN DASHBOARD
        // ============================================

        await page.goto(
            'https://eventhub.rahulshettyacademy.com/'
        );

        await dashboardPage.verifyDashboardLoaded();


        // ============================================
        // STEP 4 - BROWSE EVENTS
        // ============================================

        await dashboardPage.clickBrowseEvents();


        // ============================================
        // STEP 5 - VERIFY ORIGINAL EVENT
        // ============================================

        await eventPage.searchEvent(
            originalTitle
        );


        const originalEventCard =
            await eventPage.getEventCard(
                originalTitle
            );


        await expect(
            originalEventCard
        ).toContainText(originalTitle);


        // ============================================
        // STEP 6 - UPDATE EVENT THROUGH API
        // ============================================

        const updateData = {

            title:
                updatedTitle,

            description:
                'Event updated through API',

            category:
                'Workshop',

            venue:
                'Updated Automation Testing Center',

            city:
                'Chennai',

            eventDate:
                '2027-05-15T10:00:00.000Z',

            price:
                2500,

            totalSeats:
                200,

            imageUrl:
                'https://example.com/updated-event.jpg'
        };


        const updateResponse =
            await apiUtils.updateEvent(
                createdEventId,
                updateData
            );


        console.log(
            'Update Status:',
            updateResponse.status()
        );


        expect(updateResponse.status())
            .toBe(200);


        const updateBody =
            await updateResponse.json();


        console.log(
            'Updated Event:',
            JSON.stringify(
                updateBody,
                null,
                2
            )
        );


        // ============================================
        // STEP 7 - VALIDATE API UPDATE
        // ============================================

        expect(updateBody.success)
            .toBe(true);

        expect(updateBody.data.title)
            .toBe(updatedTitle);

        expect(updateBody.data.category)
            .toBe('Workshop');

        expect(updateBody.data.price)
            .toBe('2500');


        // ============================================
        // STEP 8 - GO BACK TO DASHBOARD
        // ============================================
        //
        // IMPORTANT:
        // Do NOT use page.reload() here.
        //
        // We are currently on /events.
        // page.reload() would reload /events.
        //
        // DashboardPage.verifyDashboardLoaded()
        // expects the dashboard URL (/).
        // Therefore explicitly navigate to dashboard.
        // ============================================

        await page.goto(
            'https://eventhub.rahulshettyacademy.com/'
        );


        await dashboardPage.verifyDashboardLoaded();


        // ============================================
        // STEP 9 - BROWSE EVENTS AGAIN
        // ============================================

        await dashboardPage.clickBrowseEvents();


        // ============================================
        // STEP 10 - SEARCH UPDATED EVENT
        // ============================================

        await eventPage.searchEvent(
            updatedTitle
        );


        // ============================================
        // STEP 11 - GET UPDATED EVENT CARD
        // ============================================

        const updatedEventCard =
            await eventPage.getEventCard(
                updatedTitle
            );


        // ============================================
        // STEP 12 - VERIFY UPDATED DATA IN UI
        // ============================================

        await expect(
            updatedEventCard
        ).toBeVisible();


        await expect(
            updatedEventCard
        ).toContainText(updatedTitle);


        await expect(
            updatedEventCard
        ).toContainText('Workshop');


      await expect(
    updatedEventCard
).toContainText('$2,500');


        console.log(
            `UI successfully displayed updated event: ${updatedTitle}`
        );

    }

    finally {

        // ============================================
        // STEP 13 - CLEANUP
        // ============================================

        if (createdEventId) {

            const deleteResponse =
                await apiUtils.deleteEvent(
                    createdEventId
                );


            console.log(
                'Cleanup Delete Status:',
                deleteResponse.status()
            );


            const deleteBody =
                await deleteResponse.json();


            console.log(
                'Cleanup Delete Response:',
                JSON.stringify(
                    deleteBody,
                    null,
                    2
                )
            );


            expect(
                deleteResponse.status()
            ).toBe(200);
        }
    }
});