const { test, expect } = require('@playwright/test');

const APIUtils = require('../../utils/APIUtils');
const users = require('../../fixtures/users.json');

test('Get events from API using authentication', async ({ request }) => {

    const apiUtils = new APIUtils(request);

    // ============================================
    // STEP 1 - Login through API
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
    // STEP 2 - Read Login Response
    // ============================================

    const loginBody =
        await loginResponse.json();

    console.log(
        'Login Response:',
        JSON.stringify(loginBody, null, 2)
    );


    // ============================================
    // STEP 3 - Validate Login
    // ============================================

    expect(loginBody.success).toBe(true);

    expect(loginBody.token).toBeTruthy();


    // ============================================
    // STEP 4 - Extract JWT Token
    // ============================================

    const token = loginBody.token;

    console.log(
        'Token received:',
        token.substring(0, 20) + '...'
    );


    // ============================================
    // STEP 5 - Call Protected Events API
    // ============================================

    const eventsResponse =
        await apiUtils.getEvents(token);


    console.log(
        'Events Status:',
        eventsResponse.status()
    );


    // ============================================
    // STEP 6 - Validate Events Response
    // ============================================

    expect(eventsResponse.status()).toBe(200);

    const eventsBody =
        await eventsResponse.json();

    console.log(
        'Events Response:',
        JSON.stringify(eventsBody, null, 2)
    );

    expect(eventsBody.success).toBe(true);

    expect(eventsBody.data).toBeDefined();

    expect(eventsBody.data.length)
        .toBeGreaterThan(0);
});

test('Get Dill event from API', async ({ request }) => {

    const apiUtils = new APIUtils(request);

    // ============================================
    // STEP 1 - Login
    // ============================================

    const loginResponse = await apiUtils.login(
        users.validUser.email,
        users.validUser.password
    );

    expect(loginResponse.status()).toBe(200);

    const loginBody = await loginResponse.json();

    expect(loginBody.success).toBe(true);
    expect(loginBody.token).toBeTruthy();

    const token = loginBody.token;


    // ============================================
    // STEP 2 - Search event through API
    // ============================================

    const response = await apiUtils.getEvents(token, {
        search: 'dill',
        page: 1,
        limit: 10
    });


    // ============================================
    // STEP 3 - Validate API response
    // ============================================

    expect(response.status()).toBe(200);

    const responseBody = await response.json();

    expect(responseBody.success).toBe(true);

    expect(responseBody.data.length).toBeGreaterThan(0);


    // ============================================
    // STEP 4 - Extract event
    // ============================================

    const event = responseBody.data[0];

    console.log('API Event ID:', event.id);
    console.log('API Event Title:', event.title);
    console.log('API Event City:', event.city);


    // ============================================
    // STEP 5 - Validate event data
    // ============================================

    expect(event.id).toBeDefined();

    expect(event.title).toBe(
        'Dilli Diwali Mela'
    );

    expect(event.city).toBe('Delhi');

    expect(event.category).toBe('Festival');

});