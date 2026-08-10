const { test, expect } = require('@playwright/test');

test(
    'Modify real events API response and verify UI',
    async ({ page }) => {

        // =====================================================
        // 1. INTERCEPT EVENTS API
        // =====================================================

        await page.route(
            '**/api/events**',
            async route => {

                console.log(
                    'Events API intercepted'
                );

                // =============================================
                // CALL REAL API
                // =============================================

                const response =
                    await route.fetch();

                console.log(
                    'Real API Status:',
                    response.status()
                );

                expect(
                    response.status()
                ).toBe(200);


                // =============================================
                // READ REAL RESPONSE
                // =============================================

                const responseBody =
                    await response.json();

                console.log(
                    'Real Events Count:',
                    responseBody.data.length
                );


                // =============================================
                // MODIFY RESPONSE
                // =============================================

                responseBody.data.unshift({

                    id: 99999,

                    title:
                        'Modified Playwright Event',

                    description:
                        'This event was injected by Playwright',

                    category:
                        'Automation',

                    venue:
                        'Playwright Testing Center',

                    city:
                        'Chennai',

                    eventDate:
                        '2027-08-15T10:00:00.000Z',

                    price:
                        '9999',

                    totalSeats:
                        500,

                    availableSeats:
                        250,

                    imageUrl:
                        'https://example.com/modified.jpg',

                    isStatic:
                        false,

                    userId:
                        20544
                });


                // =============================================
                // UPDATE PAGINATION
                // =============================================

                responseBody.pagination.total =
                    responseBody.data.length;


                // =============================================
                // RETURN MODIFIED RESPONSE
                // =============================================

                await route.fulfill({

                    response,

                    body:
                        JSON.stringify(responseBody),

                    headers: {
                        ...response.headers(),

                        'content-type':
                            'application/json'
                    }
                });
            }
        );


        // =====================================================
        // 2. OPEN EVENTS PAGE
        // =====================================================

        await page.goto(
            'https://eventhub.rahulshettyacademy.com/events'
        );


        // =====================================================
        // 3. VERIFY PAGE
        // =====================================================

        await expect(page).toHaveURL(
            'https://eventhub.rahulshettyacademy.com/events'
        );


        // =====================================================
        // 4. FIND MODIFIED EVENT
        // =====================================================

        const modifiedEvent =
            page.getByTestId('event-card')
                .filter({
                    hasText:
                        'Modified Playwright Event'
                });


        // =====================================================
        // 5. VERIFY MODIFIED EVENT
        // =====================================================

        await expect(
            modifiedEvent
        ).toBeVisible();


        await expect(
            modifiedEvent
        ).toContainText(
            'Modified Playwright Event'
        );


        await expect(
            modifiedEvent
        ).toContainText(
            'Automation'
        );


        await expect(
            modifiedEvent
        ).toContainText(
            'Chennai'
        );


        await expect(
            modifiedEvent
        ).toContainText(
            '$9,999'
        );


        console.log(
            'Modified API response successfully displayed in UI'
        );
    }
);