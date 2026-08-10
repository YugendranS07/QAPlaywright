const { test, expect } = require('@playwright/test');

const APIUtils =
    require('../../utils/APIUtils');

const users =
    require('../../fixtures/users.json');


test.only('Verify authenticated user using /auth/me', async ({
    request
}) => {

    const apiUtils =
        new APIUtils(request);


    // ============================================
    // STEP 1 - Login
    // ============================================

    const loginResponse =
        await apiUtils.login(
            users.validUser.email,
            users.validUser.password
        );

    expect(loginResponse.status())
        .toBe(200);


    // ============================================
    // STEP 2 - Get JWT
    // ============================================

    const loginBody =
        await loginResponse.json();

    expect(loginBody.success)
        .toBe(true);

    expect(loginBody.token)
        .toBeTruthy();

    const token =
        loginBody.token;


    // ============================================
    // STEP 3 - Call /auth/me
    // ============================================

    const meResponse =
        await apiUtils.getCurrentUser(token);


    // ============================================
    // STEP 4 - Validate Response
    // ============================================

    console.log(
        'Auth Me Status:',
        meResponse.status()
    );

    expect(meResponse.status())
        .toBe(200);


    const meBody =
        await meResponse.json();

    console.log(
        'Current User:',
        JSON.stringify(
            meBody,
            null,
            2
        )
    );


    // ============================================
    // STEP 5 - Validate User
    // ============================================

    expect(meBody.success)
        .toBe(true);

    expect(meBody.user)
        .toBeDefined();

    expect(meBody.user.email)
        .toBe(users.validUser.email);

});