const { test, expect } = require('@playwright/test');

const APIUtils = require('../../utils/APIUtils');
const users = require('../../fixtures/users.json');


test('Login fails with invalid password', async ({ request }) => {

    const apiUtils = new APIUtils(request);

    // ============================================
    // STEP 1 - Login with wrong password
    // ============================================

    const response = await apiUtils.login(
        users.validUser.email,
        'WrongPassword123'
    );


    // ============================================
    // STEP 2 - Print response
    // ============================================

    console.log(
        'Status:',
        response.status()
    );

    const body = await response.json();

    console.log(
        'Response:',
        JSON.stringify(body, null, 2)
    );


    // ============================================
    // STEP 3 - Validate HTTP status
    // ============================================

    expect(response.status()).toBe(400);


    // ============================================
    // STEP 4 - Validate business response
    // ============================================

    expect(body.success).toBe(false);

    expect(body.error).toBeTruthy();

});

test('Get events without authentication token', async ({ request }) => {

    const response = await request.get(
        'https://api.eventhub.rahulshettyacademy.com/api/events'
    );


    console.log(
        'Status:',
        response.status()
    );


    const body = await response.json();


    console.log(
        'Response:',
        JSON.stringify(body, null, 2)
    );


    expect(response.status()).toBe(401);

    expect(body.success).toBe(false);

    expect(body.error).toBeTruthy();

});

test('Get events with invalid token', async ({ request }) => {

    const response = await request.get(
        'https://api.eventhub.rahulshettyacademy.com/api/events',
        {
            headers: {
                Authorization: 'Bearer invalid-token-12345'
            }
        }
    );


    console.log(
        'Status:',
        response.status()
    );


    const body = await response.json();


    console.log(
        'Response:',
        JSON.stringify(body, null, 2)
    );


    expect(response.status()).toBe(401);

    expect(body.success).toBe(false);

    expect(body.error).toBeTruthy();

});


test('Get non-existing event', async ({ request }) => {

    const apiUtils = new APIUtils(request);

    // ============================================
    // LOGIN
    // ============================================

    const loginResponse = await apiUtils.login(
        users.validUser.email,
        users.validUser.password
    );

    expect(loginResponse.status()).toBe(200);


    // ============================================
    // GET INVALID EVENT ID
    // ============================================

    const eventId = 999999999;

    const response =
        await apiUtils.getEventById(eventId);


    console.log(
        'Status:',
        response.status()
    );


    const body =
        await response.json();


    console.log(
        'Response:',
        JSON.stringify(body, null, 2)
    );


    // ============================================
    // VALIDATE
    // ============================================

    expect(response.status()).toBe(404);

    expect(body.success).toBe(false);

    expect(body.error)
        .toContain(`Event with id ${eventId} not found`);

});



test('Create event with missing title', async ({ request }) => {

    const apiUtils = new APIUtils(request);


    // ============================================
    // STEP 1 - LOGIN
    // ============================================

    const loginResponse = await apiUtils.login(
        users.validUser.email,
        users.validUser.password
    );

    expect(loginResponse.status()).toBe(200);


    // ============================================
    // STEP 2 - INVALID EVENT DATA
    // title is intentionally missing
    // ============================================

    const eventData = {

        description:
            'Negative API testing event',

        category:
            'Conference',

        venue:
            'Automation Testing Center',

        city:
            'Chennai',

        eventDate:
            '2027-01-15T10:00:00.000Z',

        price:
            1000,

        totalSeats:
            100,

        imageUrl:
            'https://example.com/test-event.jpg'
    };


    // ============================================
    // STEP 3 - CREATE EVENT
    // ============================================

    const response =
        await apiUtils.createEvent(eventData);


    console.log(
        'Status:',
        response.status()
    );


    const body =
        await response.json();


    console.log(
        'Response:',
        JSON.stringify(body, null, 2)
    );


    // ============================================
    // STEP 4 - VALIDATE
    // ============================================

// ============================================
// STEP 4 - VALIDATE RESPONSE
// ============================================

expect(response.status()).toBe(400);

expect(body.success).toBe(false);

expect(body.error)
    .toBe('Validation failed');

expect(body.details).toHaveLength(1);

expect(body.details[0].field)
    .toBe('title');

expect(body.details[0].message)
    .toBe('Title is required');

});
test('Create event with missing category', async ({ request }) => {

    const apiUtils = new APIUtils(request);

    // ============================================
    // LOGIN
    // ============================================

    const loginResponse = await apiUtils.login(
        users.validUser.email,
        users.validUser.password
    );

    expect(loginResponse.status()).toBe(200);


    // ============================================
    // INVALID DATA
    // category intentionally missing
    // ============================================

    const eventData = {

        title:
            'Negative API Testing Event',

        description:
            'Testing missing category',

        venue:
            'Automation Testing Center',

        city:
            'Chennai',

        eventDate:
            '2027-01-15T10:00:00.000Z',

        price:
            1000,

        totalSeats:
            100,

        imageUrl:
            'https://example.com/test-event.jpg'
    };


    // ============================================
    // CREATE EVENT
    // ============================================

    const response =
        await apiUtils.createEvent(eventData);


    console.log(
        'Status:',
        response.status()
    );


    const body =
        await response.json();


    console.log(
        'Response:',
        JSON.stringify(body, null, 2)
    );


    // ============================================
    // VALIDATE
    // ============================================

    expect(response.status())
        .toBe(400);

    expect(body.success)
        .toBe(false);

    expect(body.error)
        .toBe('Validation failed');

    expect(body.details)
        .toHaveLength(1);

    expect(body.details[0].field)
        .toBe('category');

    expect(body.details[0].message)
        .toBe('Category is required');

});
test('Create event with invalid price', async ({ request }) => {

    const apiUtils = new APIUtils(request);

    // ============================================
    // STEP 1 - LOGIN
    // ============================================

    const loginResponse = await apiUtils.login(
        users.validUser.email,
        users.validUser.password
    );

    expect(loginResponse.status()).toBe(200);


    // ============================================
    // STEP 2 - INVALID EVENT DATA
    // price is intentionally invalid
    // ============================================

    const eventData = {

        title:
            'Negative API Testing Event',

        description:
            'Testing invalid price',

        category:
            'Conference',

        venue:
            'Automation Testing Center',

        city:
            'Chennai',

        eventDate:
            '2027-01-15T10:00:00.000Z',

        price:
            'INVALID',

        totalSeats:
            100,

        imageUrl:
            'https://example.com/test-event.jpg'
    };


    // ============================================
    // STEP 3 - CREATE EVENT
    // ============================================

    const response =
        await apiUtils.createEvent(eventData);


    console.log(
        'Status:',
        response.status()
    );


    const body =
        await response.json();


    console.log(
        'Response:',
        JSON.stringify(body, null, 2)
    );


    // ============================================
    // STEP 4 - BASIC VALIDATION
    // ============================================

    expect(response.status())
        .toBe(400);

    expect(body.success)
        .toBe(false);

    expect(body.error)
        .toBe('Validation failed');


    // ============================================
    // STEP 5 - PRINT VALIDATION DETAILS
    // ============================================

    expect(body.details).toHaveLength(1);

expect(body.details[0].field)
    .toBe('price');

expect(body.details[0].message)
    .toBe('Price must be a non-negative number');

});

test('Create event with invalid total seats', async ({ request }) => {

    const apiUtils = new APIUtils(request);

    // ============================================
    // STEP 1 - LOGIN
    // ============================================

    const loginResponse = await apiUtils.login(
        users.validUser.email,
        users.validUser.password
    );

    expect(loginResponse.status()).toBe(200);


    // ============================================
    // STEP 2 - INVALID EVENT DATA
    // ============================================

    const eventData = {

        title:
            'Negative API Testing Event',

        description:
            'Testing invalid total seats',

        category:
            'Conference',

        venue:
            'Automation Testing Center',

        city:
            'Chennai',

        eventDate:
            '2027-01-15T10:00:00.000Z',

        price:
            1000,

        // Intentionally invalid
        totalSeats:
            -10,

        imageUrl:
            'https://example.com/test-event.jpg'
    };


    // ============================================
    // STEP 3 - CREATE EVENT
    // ============================================

    const response =
        await apiUtils.createEvent(eventData);


    console.log(
        'Status:',
        response.status()
    );


    const body =
        await response.json();


    console.log(
        'Response:',
        JSON.stringify(body, null, 2)
    );


    // ============================================
    // STEP 4 - VALIDATE
    // ============================================

    expect(response.status())
        .toBe(400);

    expect(body.success)
        .toBe(false);

    expect(body.error)
        .toBe('Validation failed');


 expect(body.details).toHaveLength(1);

expect(body.details[0].field)
    .toBe('totalSeats');

expect(body.details[0].message)
    .toBe('Total seats must be a positive integer');

});