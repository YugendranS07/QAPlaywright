const { test } = require('@playwright/test');

const LoginPage = require('../pages/LoginPage');
const users = require('../fixtures/users.json');

test('Authenticate user', async ({ page }) => {

    const loginPage = new LoginPage(page);

    await loginPage.navigate();

    await loginPage.login(
        users.validUser.email,
        users.validUser.password
    );

    // Wait until authentication completes
    await page.waitForLoadState('networkidle');

    // Save authenticated browser state
    await page.context().storageState({
        path: 'playwright/auth/user.json'
    });

});