const { test, expect } = require('@playwright/test');

test('Fetch and validate events API response', async ({ page }) => {

    // ============================================
    // LISTEN FOR API RESPONSE
    // ============================================

    const responsePromise =
        page.waitForResponse(
            response =>
                response.url().includes('/api/events')
                && response.request().method() === 'GET'
        );


    // ============================================
    // OPEN EVENTS PAGE
    // ============================================

    await page.goto(
        'https://eventhub.rahulshettyacademy.com/events'
    );


    // ============================================
    // GET API RESPONSE
    // ============================================

    const response =
        await responsePromise;


    // ============================================
    // STATUS VALIDATION
    // ============================================

    console.log(
        'API URL:',
        response.url()
    );

    console.log(
        'API Status:',
        response.status()
    );

    expect(
        response.status()
    ).toBe(200);


    // ============================================
    // READ JSON RESPONSE
    // ============================================

    const responseBody =
        await response.json();


    console.log(
        'API Response:',
        JSON.stringify(
            responseBody,
            null,
            2
        )
    );


    // ============================================
    // VALIDATE RESPONSE
    // ============================================

    expect(
        responseBody.success
    ).toBe(true);

    expect(
        responseBody.data
    ).toBeInstanceOf(Array);


    expect(
        responseBody.data.length
    ).toBeGreaterThan(0);


    // ============================================
    // VALIDATE FIRST EVENT
    // ============================================

    const firstEvent =
        responseBody.data[0];

    expect(
        firstEvent.id
    ).toBeTruthy();

    expect(
        firstEvent.title
    ).toBeTruthy();

    expect(
        firstEvent.category
    ).toBeTruthy();


    console.log(
        'First Event:',
        firstEvent.title
    );
});