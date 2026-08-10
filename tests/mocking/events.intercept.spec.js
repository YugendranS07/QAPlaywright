const { test, expect } = require('@playwright/test');

test(
    'Modify real events API response',
    async ({ page }) => {

        await page.route(
            '**/api/events**',
            async route => {

                // Get the real response
                const response =
                    await route.fetch();

                // Convert response to JSON
                const body =
                    await response.json();

                console.log(
                    'Original Events:',
                    body.data.length
                );


                // Modify the response
                body.data = [

                    {
                        id: 99999,

                        title:
                            'Modified API Event',

                        description:
                            'Modified using Playwright',

                        category:
                            'Testing',

                        venue:
                            'Automation Center',

                        city:
                            'Chennai',

                        eventDate:
                            '2027-08-15T10:00:00.000Z',

                        price:
                            '999',

                        totalSeats:
                            100,

                        availableSeats:
                            50,

                        imageUrl:
                            'https://example.com/test.jpg',

                        isStatic:
                            false,

                        userId:
                            20544
                    }

                ];


                // Return modified response
                await route.fulfill({

                    response,

                    body:
                        JSON.stringify(body)

                });
            }
        );


        await page.goto(
            'https://eventhub.rahulshettyacademy.com/events'
        );


        const eventCard =
            page.getByTestId('event-card')
                .filter({
                    hasText:
                        'Modified API Event'
                });


        await expect(
            eventCard
        ).toBeVisible();


        console.log(
            'Modified API response displayed successfully'
        );
    }
);