import { on } from "node:cluster";
import { trace } from "node:console";

const {
    defineConfig,
    devices
} = require('@playwright/test');

require('dotenv').config();

module.exports = defineConfig({

    testDir: './tests',

    timeout: 30 * 1000,

    expect: {
        timeout: 5000
    },
    trace:on,

    workers: 1,

    fullyParallel: false,

    // ============================================
    // REPORTERS
    // ============================================

   reporter: [
    ['list'],

    [
        'html',
        {
            outputFolder: 'playwright-report',
            open: 'never'
        }
    ],

    [
        'allure-playwright',
        {
            resultsDir: 'allure-results'
        }
    ]
],

    // ============================================
    // GLOBAL USE
    // ============================================

    use: {

  
    baseURL:
        process.env.BASE_URL ||
        'https://eventhub.rahulshettyacademy.com',


        // Capture trace when test retries
        trace: 'on-first-retry',

        // Capture screenshot when test fails
        screenshot: 'only-on-failure',

        // Capture video when test fails
        video: 'retain-on-failure'
    },


    // ============================================
    // PROJECTS
    // ============================================

    projects: [

        {
            name: 'setup',

            testMatch:
                /.*auth\.setup\.js/
        },

        {
            name: 'chromium',

            use: {
                ...devices['Desktop Chrome']
            },

            dependencies: [
                'setup'
            ]
        }
    ]
});