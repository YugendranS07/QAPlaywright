const { test, expect } = require('@playwright/test');

test('Verify UI loading state for slow Events API', async ({ page }) => {

    // ============================================
    // INTERCEPT EVENTS API
    // ============================================

    await page.route(
        '**/api/events**',
        async route => {

            // Wait for 5 seconds
            await new Promise(
                resolve => setTimeout(resolve, 5000)
            );

            // Continue to real API
            await route.continue();
        }
    );


    // ============================================
    // OPEN EVENTS PAGE
    // ============================================

    await page.goto(
        'https://eventhub.rahulshettyacademy.com/events'
    );


    // ============================================
    // VERIFY PAGE
    // ============================================

    await expect(
        page
    ).toHaveURL(
        'https://eventhub.rahulshettyacademy.com/events'
    );

});