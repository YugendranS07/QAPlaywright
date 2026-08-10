const {
    test,
    expect
} = require('../../fixtures/apiFixture');


test(
    'Create event using API fixture',
    async ({ apiUtils }) => {

        const eventData = {

            title:
                `Fixture Test Event ${Date.now()}`,

            description:
                'Created using Playwright fixture',

            category:
                'Conference',

            venue:
                'Automation Testing Center',

            city:
                'Chennai',

            eventDate:
                '2027-08-15T10:00:00.000Z',

            price:
                1500,

            totalSeats:
                100,

            imageUrl:
                'https://example.com/fixture.jpg'
        };


        // ============================================
        // CREATE EVENT
        // ============================================

        const response =
            await apiUtils.createEvent(
                eventData
            );


        console.log(
            'Create Status:',
            response.status()
        );


        expect(
            response.status()
        ).toBe(201);


        // ============================================
        // RESPONSE
        // ============================================

        const body =
            await response.json();


        console.log(
            'Create Response:',
            JSON.stringify(
                body,
                null,
                2
            )
        );


        // ============================================
        // VALIDATE
        // ============================================

        expect(
            body.success
        ).toBe(true);


        expect(
            body.data.title
        ).toBe(eventData.title);


        expect(
            body.data.category
        ).toBe('Conference');


        // ============================================
        // CLEANUP
        // ============================================

        const eventId =
            body.data.id;


        const deleteResponse =
            await apiUtils.deleteEvent(
                eventId
            );


        expect(
            deleteResponse.status()
        ).toBe(200);


        console.log(
            'Event deleted:',
            eventId
        );
    }
);