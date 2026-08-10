const { test, expect } = require('@playwright/test');
const APIUtils = require('../../utils/APIUtils');
const users = require('../../fixtures/users.json');
const eventNegativeData = require('../../fixtures/eventNegativeData.json');

let apiUtils;

// ==================================================
// BEFORE EACH
// ==================================================
test.beforeEach(async ({ request }) => {
    apiUtils = new APIUtils(request);

    // Login before every negative test
    const loginResponse = await apiUtils.login(
        users.validUser.email,
        users.validUser.password
    );

    expect(loginResponse.status()).toBe(200);
});

// ==================================================
// DATA-DRIVEN NEGATIVE TESTS
// ==================================================
eventNegativeData.negativeCases.forEach((testData) => {

    test(`Create event - ${testData.name}`, async () => {

        // ============================================
        // STEP 1 - COPY VALID BASE EVENT
        // ============================================
        const eventData = { ...eventNegativeData.baseEvent };

        // ============================================
        // STEP 2 - MODIFY PAYLOAD
        // ============================================
        if (testData.removeField) {
            delete eventData[testData.removeField];
        }

        if (testData.value !== undefined) {
            eventData[testData.field] = testData.value;
        }

        console.log(`Running Negative Test: ${testData.name}`);
        console.log('Request Payload:', eventData);

        // ============================================
        // STEP 3 - SEND CREATE EVENT REQUEST
        // ============================================
        const response = await apiUtils.createEvent(eventData);

        // ============================================
        // STEP 4 - READ RESPONSE
        // ============================================
        const body = await response.json();

        console.log('Status:', response.status());
        console.log('Response:', JSON.stringify(body, null, 2));

        // ============================================
        // STEP 5 - VALIDATE HTTP STATUS
        // ============================================
        expect(response.status()).toBe(400);

        // ============================================
        // STEP 6 - VALIDATE COMMON RESPONSE
        // ============================================
        expect(body.success).toBe(false);
        expect(body.error).toBe('Validation failed');

        // ============================================
// STEP 7 - VALIDATE DETAILS
// ============================================

// ============================================
// STEP 7 - VALIDATE DETAILS
// ============================================

// Support both:
// message  -> single expected validation message
// messages -> multiple expected validation messages

const expectedMessages = testData.messages || [testData.message];

expect(body.details.length)
    .toBe(expectedMessages.length);

// Validate every expected message
for (const expectedMessage of expectedMessages) {

    const matchingError = body.details.find(
        detail =>
            detail.field === testData.field &&
            detail.message === expectedMessage
    );

    expect(matchingError).toBeTruthy();
}
    });

});