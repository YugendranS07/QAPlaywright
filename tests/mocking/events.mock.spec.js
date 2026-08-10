const { test, expect } = require('@playwright/test');

test.only('Verify UI using mocked events API',async ({ page }) => {

        // ============================================
        // STEP 1 - INTERCEPT EVENTS API
        // ============================================

        await page.route(
            '**/api/events**',
            async route => {

                // ========================================
                // MOCK RESPONSE
                // ========================================

                await route.fulfill({

                    status: 200,

                    contentType: 'application/json',

                    body: JSON.stringify({

                        success: true,

                        data: [

                            {
                                id: 999,

                                title: 'Mock Playwright Event',

                                description:
                                    'Event created through API mocking',

                                category: 'Conference',

                                venue:
                                    'Mock Testing Center',

                                city:
                                    'Chennai',

                                eventDate:
                                    '2027-08-15T10:00:00.000Z',

                                price: '999',

                                totalSeats: 100,

                                availableSeats: 50,

                                imageUrl:
                                    'https://example.com/mock.jpg',

                                isStatic: false,

                                userId: 20544
                            }

                        ],

                        pagination: {

                            total: 1,

                            page: 1,

                            limit: 10,

                            totalPages: 1
                        }
                    })
                });
            }
        );


        // ============================================
        // STEP 2 - OPEN EVENTS PAGE
        // ============================================

        await page.goto(
            'https://eventhub.rahulshettyacademy.com/events'
        );


        // ============================================
        // STEP 3 - VERIFY MOCKED EVENT
        // ============================================

        const eventCard =
            page.getByTestId('event-card')
                .filter({
                    hasText: 'Mock Playwright Event'
                });


        await expect(
            eventCard
        ).toBeVisible();


        // ============================================
        // STEP 4 - VALIDATE MOCKED DATA
        // ============================================

        await expect(
            eventCard
        ).toContainText(
            'Mock Playwright Event'
        );


        await expect(
            eventCard
        ).toContainText(
            'Chennai'
        );


        console.log(
            'Mocked event successfully displayed in UI'
        );
    }
);