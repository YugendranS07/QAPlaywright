const base = require('@playwright/test');
const { expect } = base;

const APIUtils = require('../utils/APIUtils');
const users = require('./users.json');

exports.test = base.test.extend({

    apiUtils: async ({ request }, use) => {

        // ============================================
        // CREATE API UTILITY
        // ============================================

        const apiUtils =
            new APIUtils(request);


        // ============================================
        // LOGIN
        // ============================================

        const loginResponse =
            await apiUtils.login(
                users.validUser.email,
                users.validUser.password
            );


        // ============================================
        // VALIDATE LOGIN
        // ============================================

        if (loginResponse.status() !== 200) {

            throw new Error(
                `API Login failed. Status: ${loginResponse.status()}`
            );
        }


        console.log(
            'API fixture authentication successful'
        );


        // ============================================
        // PROVIDE FIXTURE TO TEST
        // ============================================

        await use(apiUtils);


        // ============================================
        // CLEANUP
        // ============================================

        console.log(
            'API fixture cleanup completed'
        );
    }
});

exports.expect = expect;