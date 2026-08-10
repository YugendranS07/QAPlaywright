const { test, expect } =
    require('../../fixtures/apiFixture');

const negativeTests =
    require('../../fixtures/apiNegativeData.json');


test.describe(
    'Data Driven Negative API Testing',
    () => {

        for (const testData of negativeTests) {

            test(
                `Create event - ${testData.name}`,
                async ({ apiUtils }) => {

                    console.log(
                        'Running Negative Test:',
                        testData.name
                    );

                    console.log(
                        'Request Payload:',
                        testData.payload
                    );


                    // =========================================
                    // CREATE EVENT
                    // =========================================

                    const response =
                        await apiUtils.createEvent(
                            testData.payload
                        );


                    // =========================================
                    // STATUS
                    // =========================================

                    expect(
                        response.status()
                    ).toBe(
                        testData.expectedStatus
                    );


                    // =========================================
                    // RESPONSE
                    // =========================================

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


                    // =========================================
                    // VALIDATE SUCCESS
                    // =========================================

                    expect(
                        responseBody.success
                    ).toBe(false);


                    // =========================================
                    // VALIDATE ERROR
                    // =========================================

                    expect(
                        responseBody.error
                    ).toBe(
                        'Validation failed'
                    );


                    // =========================================
                    // FIND EXPECTED VALIDATION ERROR
                    // =========================================

                    const validationError =
                        responseBody.details.find(
                            detail =>
                                detail.field ===
                                testData.expectedField
                        );


                    expect(
                        validationError
                    ).toBeTruthy();


                    // =========================================
                    // VALIDATE MESSAGE
                    // =========================================

                    expect(
                        validationError.message
                    ).toBe(
                        testData.expectedMessage
                    );


                    console.log(
                        'Validation Details:',
                        responseBody.details
                    );
                }
            );
        }
    }
);