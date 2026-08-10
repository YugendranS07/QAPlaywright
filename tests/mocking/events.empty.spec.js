const { test, expect } = require('@playwright/test');

test('Verify UI when Events API returns empty data', async ({ page }) => {

    // ============================================
    // INTERCEPT EVENTS API
    // ============================================

    await page.route(
        '**/api/events**',
        async route => {

            await route.fulfill({

                status: 200,

                contentType: 'application/json',

                body: JSON.stringify({

                    success: true,

                    data: [],

                    pagination: {
                        total: 0,
                        page: 1,
                        limit: 10,
                        totalPages: 0
                    }
                })
            });
        }
    );


    // ============================================
    // OPEN EVENTS PAGE
    // ============================================

    await page.goto(
        'https://eventhub.rahulshettyacademy.com/events'
    );


    // ============================================
    // VERIFY EMPTY STATE
    // ============================================

    // Use the actual text displayed by your application.
    // If your application uses a different message,
    // replace this text.

    await expect(
        page.getByText(
            /no events|no event/i
        )
    ).toBeVisible();

});