const base = require('@playwright/test').test;

const LoginPage = require('../pages/LoginPage');
const DashboardPage = require('../pages/DashboardPage');
const EventPage = require('../pages/EventPage');
const BookingPage = require('../pages/BookingPage');
const MyBookingsPage = require('../pages/MyBookingsPage');

exports.test = base.extend({

    loginPage: async ({ page }, use) => {

        await use(new LoginPage(page));

    },

    dashboardPage: async ({ page }, use) => {

        await use(new DashboardPage(page));

    },

    eventPage: async ({ page }, use) => {

        await use(new EventPage(page));

    },

    bookingPage: async ({ page }, use) => {

        await use(new BookingPage(page));

    },

    myBookingsPage: async ({ page }, use) => {

        await use(new MyBookingsPage(page));

    }

});

exports.expect = require('@playwright/test').expect;