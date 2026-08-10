const { test, expect } = require('@playwright/test');

const APIUtils = require('../../utils/APIUtils');
const users = require('../../fixtures/users.json');

test(
    'Verify API event is displayed correctly in UI',
    async ({
        request,
        page
    }) => {

        // ============================================
        // PART 1 - API
        // ============================================

        const apiUtils =
            new APIUtils(request);


        // Login through API

        const loginResponse =
            await apiUtils.login(
                users.validUser.email,
                users.validUser.password
            );

        expect(loginResponse.status()).toBe(200);

        const loginBody =
            await loginResponse.json();

        const token =
            loginBody.token;

        expect(token).toBeTruthy();


        // Get event from API

        const response =
            await apiUtils.getEvents(
                token,
                {
                    search: 'dill',
                    page: 1,
                    limit: 10
                }
            );

        expect(response.status()).toBe(200);

        const responseBody =
            await response.json();

        expect(responseBody.success).toBe(true);

        expect(responseBody.data.length)
            .toBeGreaterThan(0);


        // Extract API event

        const apiEvent =
            responseBody.data[0];

        const apiEventTitle =
            apiEvent.title;

        console.log(
            'API Event:',
            apiEventTitle
        );


        // ============================================
        // PART 2 - UI
        // ============================================

        await page.goto('/login');


        // Login through UI

        await page.locator('#email')
            .fill(users.validUser.email);

        await page.locator('#password')
            .fill(users.validUser.password);

        await page
            .getByRole('button', {
                name: 'Sign In'
            })
            .click();


        // Go to Events

        await page
            .getByRole('link', {
                name: 'Browse Events →'
            })
            .click();


        // Search same event

        const searchBox =
            page.getByRole('textbox', {
                name: 'Search events, venues…'
            });

        await searchBox.fill('dill');


        // Find event card

        const eventCard =
            page
                .getByTestId('event-card')
                .filter({
                    hasText: apiEventTitle
                });

        await expect(eventCard)
            .toBeVisible();


        // ============================================
        // PART 3 - API vs UI validation
        // ============================================

        await expect(eventCard)
            .toContainText(apiEventTitle);

        console.log(
            'API Event:',
            apiEventTitle
        );

        console.log(
            'UI Event:',
            await eventCard.textContent()
        );

    }
);