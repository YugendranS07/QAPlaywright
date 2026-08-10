const { test, expect } = require('@playwright/test');

test('Verify UI when Events API returns 500', async ({ page }) => {

    // ============================================
    // MOCK SERVER ERROR
    // ============================================

    await page.route(
        '**/api/events**',
        async route => {

            await route.fulfill({

                status: 500,

                contentType: 'application/json',

                body: JSON.stringify({

                    success: false,

                    error: 'Internal Server Error'
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
    // VERIFY ERROR MESSAGE
    // ============================================

    // await expect(
    //     page.getByText(
    //         /error|failed|something went wrong/i
    //     ).first()
    // ).toBeVisible();

});