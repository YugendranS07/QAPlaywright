const { expect } = require('@playwright/test');

class APIAssertions {

    // ============================================
    // STATUS CODE VALIDATION
    // ============================================

    static expectStatus(response, expectedStatus) {

        expect(response.status())
            .toBe(expectedStatus);
    }


    // ============================================
    // SUCCESS RESPONSE VALIDATION
    // ============================================

    static expectSuccessBody(responseBody) {

        expect(responseBody.success)
            .toBe(true);
    }


    // ============================================
    // FAILURE RESPONSE VALIDATION
    // ============================================

    static expectFailureBody(
        responseBody,
        expectedError
    ) {

        expect(responseBody.success)
            .toBe(false);

        expect(responseBody.error)
            .toBe(expectedError);
    }


    // ============================================
    // VALIDATION ERROR
    // ============================================

    static expectValidationError(
        responseBody,
        expectedField,
        expectedMessage
    ) {

        expect(responseBody.success)
            .toBe(false);

        expect(responseBody.error)
            .toBe('Validation failed');

        const validationError =
            responseBody.details.find(
                detail =>
                    detail.field === expectedField
            );

        expect(validationError)
            .toBeTruthy();

        expect(validationError.message)
            .toBe(expectedMessage);
    }


    // ============================================
    // EVENT VALIDATION
    // ============================================

    static expectEvent(
        event,
        expectedEvent
    ) {

        expect(event.id)
            .toBe(expectedEvent.id);

        expect(event.title)
            .toBe(expectedEvent.title);

        expect(event.category)
            .toBe(expectedEvent.category);

        expect(event.city)
            .toBe(expectedEvent.city);
    }


    // ============================================
    // BOOKING VALIDATION
    // ============================================

    static expectBooking(
        booking,
        expectedData
    ) {

        expect(booking.eventId)
            .toBe(expectedData.eventId);

        expect(booking.customerName)
            .toBe(expectedData.customerName);

        expect(booking.customerEmail)
            .toBe(expectedData.customerEmail);

        expect(booking.customerPhone)
            .toBe(expectedData.customerPhone);

        expect(booking.quantity)
            .toBe(expectedData.quantity);

        expect(booking.status)
            .toBe('confirmed');
    }
}

module.exports = APIAssertions;