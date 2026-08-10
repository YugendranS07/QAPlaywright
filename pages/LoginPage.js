const { expect } = require('@playwright/test');

class LoginPage {

    constructor(page) {

        this.page = page;

        this.emailTextbox = page.locator("#email");
        this.passwordTextbox = page.locator("#password");
        this.loginButton = page.getByRole('button', { name: 'Sign In' });
        this.errorMessage = page.getByText('Invalid email or password');
    }

    async navigate() {
        await this.page.goto("/login");
    }

    async enterEmail(email) {
        await this.emailTextbox.fill(email);
    }

    async enterPassword(password) {
        await this.passwordTextbox.fill(password);
    }

    async clickLogin() {
        await this.loginButton.click();
    }

    async login(email, password) {
        await this.enterEmail(email);
        await this.enterPassword(password);
        await this.clickLogin();
    }

    async verifyErrorMessage(message) {
    await expect(this.errorMessage).toHaveText(message);
}
}

module.exports = LoginPage;