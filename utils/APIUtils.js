require('dotenv').config();
class APIUtils {

    constructor(request) {

    

    this.request = request;

    this.token = null;

    this.baseURL =
        process.env.API_BASE_URL ||
        'https://api.eventhub.rahulshettyacademy.com/api';

     
    }


    // =====================================================
    // LOGIN
    // =====================================================

    async login(email, password) {

        const response =
            await this.request.post(
                `${this.baseURL}/auth/login`,
                {
                    data: {
                        email,
                        password
                    }
                }
            );


        const responseBody =
            await response.json();


        console.log(
            'Login Status:',
            response.status()
        );

        console.log(
            'Login Response:',
            responseBody
        );


        if (responseBody.token) {

            this.token =
                responseBody.token;
        }


        return response;
    }


    // =====================================================
    // AUTH HEADERS
    // =====================================================

    getAuthHeaders() {

        if (!this.token) {

            throw new Error(
                'Authentication token is not available. Call login() first.'
            );
        }


        return {

            Authorization:
                `Bearer ${this.token}`
        };
    }


    // =====================================================
    // GET CURRENT USER
    // =====================================================

    async getCurrentUser() {

        return await this.request.get(
            `${this.baseURL}/auth/me`,
            {
                headers:
                    this.getAuthHeaders()
            }
        );
    }


    // =====================================================
    // GET EVENTS
    // =====================================================

    async getEvents(params = {}) {

        return await this.request.get(
            `${this.baseURL}/events`,
            {
                params,

                headers:
                    this.getAuthHeaders()
            }
        );
    }


    // =====================================================
    // GET EVENT BY ID
    // =====================================================

    async getEventById(eventId) {

        return await this.request.get(
            `${this.baseURL}/events/${eventId}`,
            {
                headers:
                    this.getAuthHeaders()
            }
        );
    }


    // =====================================================
    // CREATE EVENT
    // =====================================================

    async createEvent(eventData) {

        return await this.request.post(
            `${this.baseURL}/events`,
            {
                data: eventData,

                headers:
                    this.getAuthHeaders()
            }
        );
    }


    // =====================================================
    // UPDATE EVENT
    // =====================================================

    async updateEvent(
        eventId,
        eventData
    ) {

        return await this.request.put(
            `${this.baseURL}/events/${eventId}`,
            {
                data: eventData,

                headers:
                    this.getAuthHeaders()
            }
        );
    }


    // =====================================================
    // DELETE EVENT
    // =====================================================

    async deleteEvent(eventId) {

        return await this.request.delete(
            `${this.baseURL}/events/${eventId}`,
            {
                headers:
                    this.getAuthHeaders()
            }
        );
    }


    // =====================================================
    // GET BOOKING BY REFERENCE
    // =====================================================

    async getBookingByRef(bookingRef) {

        return await this.request.get(
            `${this.baseURL}/bookings/ref/${bookingRef}`,
            {
                headers:
                    this.getAuthHeaders()
            }
        );
    }


    // =====================================================
    // GET BOOKING BY ID
    // =====================================================

    async getBooking(bookingId) {

        return await this.request.get(
            `${this.baseURL}/bookings/${bookingId}`,
            {
                headers:
                    this.getAuthHeaders()
            }
        );
    }
}


module.exports = APIUtils;