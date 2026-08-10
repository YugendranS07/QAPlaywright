class EventPage {

    constructor(page) {

        this.page = page;

        this.searchBox =
            page.getByRole('textbox', {
                name: 'Search events, venues…'
            });

        this.bookNowButton =
            page.getByRole('link', {
                name: 'Book Now'
            });
    }


    async searchEvent(eventName) {

        await this.searchBox.fill(eventName);

        this.eventCard =
            this.page
                .getByTestId('event-card')
                .filter({
                    hasText: eventName
                });

        await this.eventCard.waitFor({
            state: 'visible'
        });
    }


    async getEventTitle() {

        return (
            await this.eventCard
                .getByRole('heading')
                .textContent()
        ).trim();

    }

async getEventCard(eventName) {

    const eventCard = this.page
        .getByTestId('event-card')
        .filter({
            hasText: eventName
        });

    await eventCard.waitFor({
        state: 'visible'
    });

    return eventCard;
}
    async clickBookNow() {

        const bookNowLink =
            this.eventCard.getByRole(
                'link',
                { name: 'Book Now' }
            );

        await bookNowLink.click();

        await this.page
            .getByRole('heading', {
                name: 'Book Tickets'
            })
            .waitFor({
                state: 'visible'
            });
    }
}

module.exports = EventPage;