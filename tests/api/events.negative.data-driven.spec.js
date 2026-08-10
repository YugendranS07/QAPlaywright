const {
    test
} = require('../../fixtures/apiFixture');

const APIAssertions =
    require('../../utils/APIAssertions');

const negativeTests =
    require('../../fixtures/apiNegativeData.json');


test.describe(
    'Data Driven Negative API Testing',
    () => {

        // ============================================
        // CREATE ONE TEST FOR EACH FIXTURE RECORD
        // ============================================

        for (const testData of negativeTests) {

            test(
                `Create event - ${testData.name}`,

                async ({ apiUtils }) => {

                    console.log(
                        '=========================================='
                    );

                    console.log(
                        'Running Negative Test:',
                        testData.name
                    );

                    console.log(
                        'Request Payload:',
                        testData.payload
                    );


                    // ========================================
                    // CREATE EVENT
                    // ========================================

                    const response =
                        await apiUtils.createEvent(
                            testData.payload
                        );


                    // ========================================
                    // STATUS VALIDATION
                    // ========================================

                    console.log(
                        'Status:',
                        response.status()
                    );

                    APIAssertions.expectStatus(
                        response,
                        testData.expectedStatus
                    );


                    // ========================================
                    // READ RESPONSE
                    // ========================================

                    const responseBody =
                        await response.json();

                    console.log(
                        'Response:',
                        JSON.stringify(
                            responseBody,
                            null,
                            2
                        )
                    );


                    // ========================================
                    // VALIDATE ERROR
                    // ========================================

                    APIAssertions.expectValidationError(
                        responseBody,
                        testData.expectedField,
                        testData.expectedMessage
                    );


                    // ========================================
                    // LOG VALIDATION DETAILS
                    // ========================================

                    console.log(
                        'Validation Details:',
                        responseBody.details
                    );

                    console.log(
                        'Test Passed:',
                        testData.name
                    );

                    console.log(
                        '=========================================='
                    );
                }
            );
        }
    }
);