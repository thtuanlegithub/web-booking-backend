const chai = require('chai');
const sinon = require('sinon');
const chaiHttp = require('chai-http');
chai.use(require('sinon-chai'));
const expect = chai.expect;
const db = require('../../models/index');
chai.use(chaiHttp);
const bookingApiService = require('../../services/bookingApiService');
const { createBooking, getBookingWithPagination, updateBooking, deleteBooking, getBookingById } = require('../../services/bookingApiService');
describe('Booking API Service', () => {
    let sandbox;

    beforeEach(() => {
        sandbox = sinon.createSandbox();
    });

    afterEach(() => {
        sandbox.restore();
    });

    describe('createBooking', () => {
        it('should create a booking successfully', async () => {
            const req = {
                body: {
                    exportInvoice: true,
                    bookingStatus: 'Completed',
                    bookingPrice: 1500000,
                    bookingDate: '01/01/2024',
                    customer: {
                        customerPhone: 12345,
                        customerName: 'name',
                        customerGmail: 'name@gmail.com',
                    },
                    touristList: ['t1', 't2'],
                    paymentNote: '',
                    paymentImage: '/',
                    travelId: '1'
                }
            };
            const res = {
                status: (statusCode) => ({
                    json: (response) => {
                        expect(statusCode).to.equal(200);
                        expect(response).to.deep.equal({ EM: 'create booking successfully', EC: '0', DT: { id: 1 } });
                    }
                })
            };

            await createBooking(req, res);
        });

        it('should update an existing customer and create a booking successfully', async () => {
            // Mocking data and database calls
            sandbox.stub(db.Customers, 'findOne').resolves({ id: 1 });
            sandbox.stub(db.Customers, 'update').resolves({});
            sandbox.stub(db.Bookings, 'create').resolves({ id: 1 });
            sandbox.stub(db.Tourists, 'create').resolves({});

            const bookingData = {
                exportInvoice: true,
                bookingStatus: 'Completed',
                bookingPrice: 1000000,
                bookingDate: '01/01/2023',
                customer: {
                    customerPhone: '123456789',
                    customerName: 'name',
                    customerGmail: 'name@gmail.com',
                },
                touristList: ['t1', 't2']
                ,
                paymentNote: '',
                paymentImage: '/',
                travelId: 1
            };

            const result = await createBooking(bookingData);

            expect(result).to.deep.equal({
                EM: 'create booking successfully',
                EC: '0',
                DT: { id: 1 }
            });
        });

        it('should handle errors during booking creation', async () => {
            const req = { body: {} };
            const res = {
                status: (statusCode) => ({
                    json: (response) => {
                        expect(statusCode).to.equal(500);
                        expect(response).to.deep.equal({ EM: 'error creating booking', EC: '1', DT: undefined });
                    }
                })
            };

            // Mocking an error during booking creation
            sandbox.replace(bookingApiService, 'createBooking', async () => { throw new Error('Simulated error'); });

            await createBooking(req, res);
        });

    });

    describe('getBookingById', () => {
        it('should get booking data by ID successfully', async () => {
            // Define your mocked booking data
            const mockedBookingData = {
                id: 8,
                bookingStatus: "Unpaid",
                bookingPrice: "3800000",
                customerId: 3,
                paymentNote: "",
                paymentImage: "/",
                travelId: 8,
                exportInvoice: true,
                createdAt: "2023-12-28T19:44:29.000Z",
                updatedAt: "2023-12-28T19:49:53.000Z",
                Customer: {
                    id: 3,
                    customerPhone: "1",
                    customerName: "2",
                    customerGmail: "3",
                    customerAccountId: null,
                    createdAt: "2023-12-28T19:44:29.000Z",
                    updatedAt: "2024-01-01T22:26:56.000Z"
                },
                Tourists: [
                    {
                        id: 23,
                        touristName: "1",
                        bookingId: 8,
                        createdAt: "2023-12-28T19:49:53.000Z",
                        updatedAt: "2023-12-28T19:49:53.000Z"
                    },
                    {
                        id: 24,
                        touristName: "2",
                        bookingId: 8,
                        createdAt: "2023-12-28T19:49:53.000Z",
                        updatedAt: "2023-12-28T19:49:53.000Z"
                    }
                ],
                Travel: {
                    id: 8,
                    startLocation: "Thành phố Hồ Chí Minh",
                    startDateTime: "2024-02-01T03:30:00.000Z",
                    maxTicket: 50,
                    remainTicket: 48,
                    tourId: 7,
                    discountId: 4,
                    travelPrice: "1900000",
                    createdAt: "2023-12-28T18:32:08.000Z",
                    updatedAt: "2024-01-01T22:37:23.000Z",
                    Tour: {
                        id: 7,
                        tourName: "Thành phố Hồ Chí Minh - Chợ Bến Thành - Suối Tiên",
                        totalDay: 2,
                        totalNight: 2,
                        addressList: "Nha Trang",
                        tourPrice: "2000000",
                        tourStatus: "Completed",
                        mainImage: "https://firebasestorage.googleapis.com/v0/b/webbooking-2460b.appspot.com/o/images%2F7493164544cca73?alt=media&token=9a6994d7-55c9-484c-ad2c-20760f3bfbe5",
                        createdAt: "2023-12-28T16:06:02.000Z",
                        updatedAt: "2024-01-01T19:15:45.000Z"
                    },
                    Discount: {
                        id: 4,
                        discountName: "Khai xuân 2024",
                        discountType: "Percentage",
                        discountAmount: "5",
                        discountDescription: "",
                        createdAt: "2023-12-31T14:50:50.000Z",
                        updatedAt: "2023-12-31T14:50:50.000Z"
                    }
                }
            };

            // Stubbing the findOne method of db.Bookings
            const findOneStub = sandbox.stub(db.Bookings, 'findOne').resolves(mockedBookingData);

            // Define your test data, assuming a booking with ID 1 exists
            const bookingId = 8;

            // Call the function
            const result = await getBookingById(bookingId);

            // Assert the result
            expect(result).to.deep.equal({
                EM: 'get booking by id successfully',
                EC: '0',
                DT: mockedBookingData, // Expect the actual mocked data
            });

            // Assert that the findOne method was called
            expect(findOneStub).to.have.been.calledOnceWithExactly({
                where: {
                    id: bookingId,
                },
                include: [
                    {
                        model: db.Customers,
                    },
                    {
                        model: db.Tourists,
                    },
                    {
                        model: db.Travels,
                        include: [
                            {
                                model: db.Tours,
                            },
                            {
                                model: db.Discounts,
                            },
                        ],
                    },
                ],
            });
        });

        it('should handle errors during reading booking data by ID', async () => {
            // Stubbing the findOne method to simulate an error
            const findOneStub = sandbox.stub(db.Bookings, 'findOne').rejects(new Error('Simulated error'));

            // Define your test data
            const bookingId = 1;

            try {
                // Call the function
                const result = await getBookingById(bookingId);

                // If no error occurred, fail the test
                throw new Error('Expected an error but got a result');
            } catch (error) {
                // Assert that the error message contains the expected message
                expect(error.message).to.include('Expected an error but got a result');

                // Assert that the findOne method was called
                expect(findOneStub).to.have.been.calledOnceWithExactly({
                    where: {
                        id: bookingId,
                    },
                    include: [
                        {
                            model: db.Customers,
                        },
                        {
                            model: db.Tourists,
                        },
                        {
                            model: db.Travels,
                            include: [
                                {
                                    model: db.Tours,
                                },
                                {
                                    model: db.Discounts,
                                },
                            ],
                        },
                    ],
                });
            }

        });
    });

    describe('getBookingWithPagination', () => {
        // Test case for successful retrieval of all data
        it('should get all data successfully when page and limit are 0', async () => {
            // Mock the database call
            sinon.stub(db.Bookings, 'findAll').resolves(['booking1', 'booking2']);

            const result = await getBookingWithPagination(0, 0);

            // Assertions
            expect(result.EM).to.equal('get data successfully');
            expect(result.EC).to.equal('0');
            expect(result.DT).to.deep.equal(['booking1', 'booking2']);

            // Restore the stub after the test
            sinon.restore();
        });

        // Test case for successful paginated retrieval
        it('should get paginated data successfully', async () => {
            // Mock the database call
            sinon.stub(db.Bookings, 'findAndCountAll').resolves({
                count: 10,
                rows: ['booking1', 'booking2'],
            });

            const result = await getBookingWithPagination(2, 5);

            // Assertions
            expect(result.EM).to.equal('get data successfully');
            expect(result.EC).to.equal('0');
            expect(result.DT.totalRows).to.equal(10);
            expect(result.DT.totalPages).to.equal(2);
            expect(result.DT.bookings).to.deep.equal(['booking1', 'booking2']);

            // Restore the stub after the test
            sinon.restore();
        });

        // Test case for invalid input parameters
        it('should handle invalid input parameters', async () => {
            const result = await getBookingWithPagination(-1, 'invalid');

            // Assertions
            expect(result.EM).to.equal('error getting data');
            expect(result.EC).to.equal('1');
            expect(result.DT).to.equal(null);
        });

        // Add more test cases as needed

    });

    // describe('updateBooking', () => {
    //     afterEach(() => {
    //         sinon.restore();
    //     });

    //     it('should update booking successfully', async () => {
    //         const bookingData = {
    //             id: 1,
    //             exportInvoice: true,
    //             touristList: ['Tourist1', 'Tourist2'],
    //             bookingStatus: 'Paid',
    //             bookingPrice: 500,
    //             paymentNote: 'Paid via credit card',
    //             paymentImage: 'payment-image-url',
    //             travelId: 1001,
    //         };

    //         const findOneStub = sinon.stub(db.Bookings, 'findOne').resolves({ id: 1 });
    //         const destroyStub = sinon.stub(db.Tourists, 'destroy').resolves(2); // Assuming two tourists were deleted
    //         const createStub = sinon.stub(db.Tourists, 'create').resolves({});
    //         const updateStub = sinon.stub(db.Bookings, 'update').resolves(1); // Assuming one booking was updated

    //         await updateBooking(bookingData);

    //         // Assertions
    //         expect(findOneStub.calledOnce).to.be.true;
    //         expect(destroyStub.calledOnce).to.be.true;
    //         expect(createStub.calledTwice).to.be.true;
    //         expect(updateStub.calledOnce).to.be.true;
    //     });

    //     it('should handle errors gracefully', async () => {
    //         const bookingData = {
    //             id: 1,
    //             exportInvoice: true,
    //             touristList: ['Tourist1', 'Tourist2'],
    //             bookingStatus: 'Paid',
    //             bookingPrice: 500,
    //             paymentNote: 'Paid via credit card',
    //             paymentImage: 'payment-image-url',
    //             travelId: 1001,
    //         };

    //         // Stub findOne to reject with an error
    //         const findOneStub = sinon.stub(db.Bookings, 'findOne').rejects(new Error('Database error'));

    //         const result = await updateBooking(bookingData);

    //         // Assertions
    //         expect(findOneStub.calledOnce).to.be.true;
    //         expect(result.EC).to.equal('1');
    //         expect(result.EM).to.equal('Error updating booking');
    //     });
    // });

    describe('deleteBooking', () => {
        afterEach(() => {
            sinon.restore();
        });

        it('should delete booking successfully', async () => {
            // Stub findOne to return a booking
            const findOneStub = sinon.stub(db.Bookings, 'findOne').resolves({
                id: 1, // Replace with the actual booking data
            });

            // Stub destroy methods
            const destroyTouristsStub = sinon.stub(db.Tourists, 'destroy').resolves();
            const destroyBookingsStub = sinon.stub(db.Bookings, 'destroy').resolves();

            const result = await deleteBooking(1); // Pass a valid booking id

            // Assertions
            expect(findOneStub.calledOnce).to.be.true;
            expect(destroyTouristsStub.calledOnce).to.be.true;
            expect(destroyBookingsStub.calledOnce).to.be.true;
            expect(result.EC).to.equal('0');
            expect(result.EM).to.equal('delete booking successfully');
        });

        it('should handle not found booking', async () => {
            // Stub findOne to return null (not found)
            const findOneStub = sinon.stub(db.Bookings, 'findOne').resolves(null);

            const result = await deleteBooking(1); // Pass a valid booking id

            // Assertions
            expect(findOneStub.calledOnce).to.be.true;
            expect(result.EC).to.equal('0');
            expect(result.EM).to.equal('not found booking');
        });

        it('should handle errors gracefully', async () => {
            // Stub findOne to throw an error
            const findOneStub = sinon.stub(db.Bookings, 'findOne').rejects(new Error('Database error'));

            const result = await deleteBooking(1); // Pass a valid booking id

            // Assertions
            expect(findOneStub.calledOnce).to.be.true;
            expect(result.EC).to.equal('1');
            expect(result.EM).to.equal('error deleting booking');
        });
    });

});