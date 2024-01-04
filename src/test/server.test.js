const chai = require('chai');
const sinon = require('sinon');
require("dotenv").config();
import app from '../server';
const { createBooking, getBookingWithPagination, updateBooking, deleteBooking, getBookingById } = require('../services/bookingApiService');
const { getCustomerWithPagination, deleteCustomer, getCustomerById } = require('../services/customerApiService');
const { getTourPlanning } = require('../services/dashboardService');
const { createDiscount, getDiscountById, getDiscountWithPagination, updateDiscount, deleteDiscount } = require('../services/discountApiService');
const { handleCompanyLogin } = require('../services/loginService');
const { getPackageById, getPackageWithPagination, getPackageByAddressList, createPackage, updatePackage, deletePackage } = require('../services/packageApiService');
const { getAllTourPackage } = require('../services/tourPackageApiService');
const { createTour, getTourById, getTourWithPagination, updateTour, deleteTour } = require('../services/tourApiService');
const { createTravel, getTravelWithPagination, updateTravel, deleteTravel, getTravelById } = require('../services/travelApiService');
const dashboardService = require('../services/dashboardService');
const loginService = require('../services/loginService');
const travelApiService = require('../services/travelApiService');
const packageApiService = require('../services/packageApiService');
const tourApiService = require('../services/tourApiService');
const tourPackageApiService = require('../services/tourPackageApiService');
const bookingApiService = require('../services/bookingApiService');
const customerApiService = require('../services/customerApiService');
const discountApiService = require('../services/discountApiService');
const JWTActions = require('../middleware/JWTActions');
const jwt = require('jsonwebtoken');
const chaiHttp = require('chai-http');

const db = require('../models/index');
chai.use(chaiHttp);

const expect = chai.expect;

// chai.use(require('chai-as-promised'));
chai.use(require('sinon-chai'));

// describe('Booking API Service', () => {
//     let sandbox;

//     beforeEach(() => {
//         sandbox = sinon.createSandbox();
//     });

//     afterEach(() => {
//         sandbox.restore();
//     });

//     describe('createBooking', () => {
//         it('should create a booking successfully', async () => {
//             const req = {
//                 body: {
//                     exportInvoice: true,
//                     bookingStatus: 'Completed',
//                     bookingPrice: 1500000,
//                     bookingDate: '01/01/2024',
//                     customer: {
//                         customerPhone: 12345,
//                         customerName: 'name',
//                         customerGmail: 'name@gmail.com',
//                     },
//                     touristList: ['t1', 't2'],
//                     paymentNote: '',
//                     paymentImage: '/',
//                     travelId: '1'
//                 }
//             };
//             const res = {
//                 status: (statusCode) => ({
//                     json: (response) => {
//                         expect(statusCode).to.equal(200);
//                         expect(response).to.deep.equal({ EM: 'create booking successfully', EC: '0', DT: { id: 1 } });
//                     }
//                 })
//             };

//             await createBooking(req, res);
//         });

//         it('should update an existing customer and create a booking successfully', async () => {
//             // Mocking data and database calls
//             sandbox.stub(db.Customers, 'findOne').resolves({ id: 1 });
//             sandbox.stub(db.Customers, 'update').resolves({});
//             sandbox.stub(db.Bookings, 'create').resolves({ id: 1 });
//             sandbox.stub(db.Tourists, 'create').resolves({});

//             const bookingData = {
//                 exportInvoice: true,
//                 bookingStatus: 'Completed',
//                 bookingPrice: 1000000,
//                 bookingDate: '01/01/2023',
//                 customer: {
//                     customerPhone: '123456789',
//                     customerName: 'name',
//                     customerGmail: 'name@gmail.com',
//                 },
//                 touristList: ['t1', 't2']
//                 ,
//                 paymentNote: '',
//                 paymentImage: '/',
//                 travelId: 1
//             };

//             const result = await createBooking(bookingData);

//             expect(result).to.deep.equal({
//                 EM: 'create booking successfully',
//                 EC: '0',
//                 DT: { id: 1 }
//             });
//         });

//         it('should handle errors during booking creation', async () => {
//             const req = { body: {} };
//             const res = {
//                 status: (statusCode) => ({
//                     json: (response) => {
//                         expect(statusCode).to.equal(500);
//                         expect(response).to.deep.equal({ EM: 'error creating booking', EC: '1', DT: undefined });
//                     }
//                 })
//             };

//             // Mocking an error during booking creation
//             sandbox.replace(bookingApiService, 'createBooking', async () => { throw new Error('Simulated error'); });

//             await createBooking(req, res);
//         });

//     });

//     describe('getBookingById', () => {
//         it('should get booking data by ID successfully', async () => {
//             // Define your mocked booking data
//             const mockedBookingData = {
//                 id: 8,
//                 bookingStatus: "Unpaid",
//                 bookingPrice: "3800000",
//                 customerId: 3,
//                 paymentNote: "",
//                 paymentImage: "/",
//                 travelId: 8,
//                 exportInvoice: true,
//                 createdAt: "2023-12-28T19:44:29.000Z",
//                 updatedAt: "2023-12-28T19:49:53.000Z",
//                 Customer: {
//                     id: 3,
//                     customerPhone: "1",
//                     customerName: "2",
//                     customerGmail: "3",
//                     customerAccountId: null,
//                     createdAt: "2023-12-28T19:44:29.000Z",
//                     updatedAt: "2024-01-01T22:26:56.000Z"
//                 },
//                 Tourists: [
//                     {
//                         id: 23,
//                         touristName: "1",
//                         bookingId: 8,
//                         createdAt: "2023-12-28T19:49:53.000Z",
//                         updatedAt: "2023-12-28T19:49:53.000Z"
//                     },
//                     {
//                         id: 24,
//                         touristName: "2",
//                         bookingId: 8,
//                         createdAt: "2023-12-28T19:49:53.000Z",
//                         updatedAt: "2023-12-28T19:49:53.000Z"
//                     }
//                 ],
//                 Travel: {
//                     id: 8,
//                     startLocation: "Thành phố Hồ Chí Minh",
//                     startDateTime: "2024-02-01T03:30:00.000Z",
//                     maxTicket: 50,
//                     remainTicket: 48,
//                     tourId: 7,
//                     discountId: 4,
//                     travelPrice: "1900000",
//                     createdAt: "2023-12-28T18:32:08.000Z",
//                     updatedAt: "2024-01-01T22:37:23.000Z",
//                     Tour: {
//                         id: 7,
//                         tourName: "Thành phố Hồ Chí Minh - Chợ Bến Thành - Suối Tiên",
//                         totalDay: 2,
//                         totalNight: 2,
//                         addressList: "Nha Trang",
//                         tourPrice: "2000000",
//                         tourStatus: "Completed",
//                         mainImage: "https://firebasestorage.googleapis.com/v0/b/webbooking-2460b.appspot.com/o/images%2F7493164544cca73?alt=media&token=9a6994d7-55c9-484c-ad2c-20760f3bfbe5",
//                         createdAt: "2023-12-28T16:06:02.000Z",
//                         updatedAt: "2024-01-01T19:15:45.000Z"
//                     },
//                     Discount: {
//                         id: 4,
//                         discountName: "Khai xuân 2024",
//                         discountType: "Percentage",
//                         discountAmount: "5",
//                         discountDescription: "",
//                         createdAt: "2023-12-31T14:50:50.000Z",
//                         updatedAt: "2023-12-31T14:50:50.000Z"
//                     }
//                 }
//             };

//             // Stubbing the findOne method of db.Bookings
//             const findOneStub = sandbox.stub(db.Bookings, 'findOne').resolves(mockedBookingData);

//             // Define your test data, assuming a booking with ID 1 exists
//             const bookingId = 8;

//             // Call the function
//             const result = await getBookingById(bookingId);

//             // Assert the result
//             expect(result).to.deep.equal({
//                 EM: 'get booking by id successfully',
//                 EC: '0',
//                 DT: mockedBookingData, // Expect the actual mocked data
//             });

//             // Assert that the findOne method was called
//             expect(findOneStub).to.have.been.calledOnceWithExactly({
//                 where: {
//                     id: bookingId,
//                 },
//                 include: [
//                     {
//                         model: db.Customers,
//                     },
//                     {
//                         model: db.Tourists,
//                     },
//                     {
//                         model: db.Travels,
//                         include: [
//                             {
//                                 model: db.Tours,
//                             },
//                             {
//                                 model: db.Discounts,
//                             },
//                         ],
//                     },
//                 ],
//             });
//         });

//         it('should handle errors during reading booking data by ID', async () => {
//             // Stubbing the findOne method to simulate an error
//             const findOneStub = sandbox.stub(db.Bookings, 'findOne').rejects(new Error('Simulated error'));

//             // Define your test data
//             const bookingId = 1;

//             try {
//                 // Call the function
//                 const result = await getBookingById(bookingId);

//                 // If no error occurred, fail the test
//                 throw new Error('Expected an error but got a result');
//             } catch (error) {
//                 // Assert that the error message contains the expected message
//                 expect(error.message).to.include('Expected an error but got a result');

//                 // Assert that the findOne method was called
//                 expect(findOneStub).to.have.been.calledOnceWithExactly({
//                     where: {
//                         id: bookingId,
//                     },
//                     include: [
//                         {
//                             model: db.Customers,
//                         },
//                         {
//                             model: db.Tourists,
//                         },
//                         {
//                             model: db.Travels,
//                             include: [
//                                 {
//                                     model: db.Tours,
//                                 },
//                                 {
//                                     model: db.Discounts,
//                                 },
//                             ],
//                         },
//                     ],
//                 });
//             }

//         });
//     });

//     describe('getBookingWithPagination', () => {
//         // Test case for successful retrieval of all data
//         it('should get all data successfully when page and limit are 0', async () => {
//             // Mock the database call
//             sinon.stub(db.Bookings, 'findAll').resolves(['booking1', 'booking2']);

//             const result = await getBookingWithPagination(0, 0);

//             // Assertions
//             expect(result.EM).to.equal('get data successfully');
//             expect(result.EC).to.equal('0');
//             expect(result.DT).to.deep.equal(['booking1', 'booking2']);

//             // Restore the stub after the test
//             sinon.restore();
//         });

//         // Test case for successful paginated retrieval
//         it('should get paginated data successfully', async () => {
//             // Mock the database call
//             sinon.stub(db.Bookings, 'findAndCountAll').resolves({
//                 count: 10,
//                 rows: ['booking1', 'booking2'],
//             });

//             const result = await getBookingWithPagination(2, 5);

//             // Assertions
//             expect(result.EM).to.equal('get data successfully');
//             expect(result.EC).to.equal('0');
//             expect(result.DT.totalRows).to.equal(10);
//             expect(result.DT.totalPages).to.equal(2);
//             expect(result.DT.bookings).to.deep.equal(['booking1', 'booking2']);

//             // Restore the stub after the test
//             sinon.restore();
//         });

//         // Test case for invalid input parameters
//         it('should handle invalid input parameters', async () => {
//             const result = await getBookingWithPagination(-1, 'invalid');

//             // Assertions
//             expect(result.EM).to.equal('error getting data');
//             expect(result.EC).to.equal('1');
//             expect(result.DT).to.equal(null);
//         });

//         // Add more test cases as needed

//     });

//     describe('updateBooking', () => {
//         afterEach(() => {
//             sinon.restore();
//         });

//         it('should update booking successfully', async () => {
//             const bookingData = {
//                 id: 1,
//                 exportInvoice: true,
//                 touristList: ['Tourist1', 'Tourist2'],
//                 bookingStatus: 'Paid',
//                 bookingPrice: 500,
//                 paymentNote: 'Paid via credit card',
//                 paymentImage: 'payment-image-url',
//                 travelId: 1001,
//             };

//             const findOneStub = sinon.stub(db.Bookings, 'findOne').resolves({ id: 1 });
//             const destroyStub = sinon.stub(db.Tourists, 'destroy').resolves(2); // Assuming two tourists were deleted
//             const createStub = sinon.stub(db.Tourists, 'create').resolves({});
//             const updateStub = sinon.stub(db.Bookings, 'update').resolves(1); // Assuming one booking was updated

//             await updateBooking(bookingData);

//             // Assertions
//             expect(findOneStub.calledOnce).to.be.true;
//             expect(destroyStub.calledOnce).to.be.true;
//             expect(createStub.calledTwice).to.be.true;
//             expect(updateStub.calledOnce).to.be.true;
//         });

//         it('should handle errors gracefully', async () => {
//             const bookingData = {
//                 id: 1,
//                 exportInvoice: true,
//                 touristList: ['Tourist1', 'Tourist2'],
//                 bookingStatus: 'Paid',
//                 bookingPrice: 500,
//                 paymentNote: 'Paid via credit card',
//                 paymentImage: 'payment-image-url',
//                 travelId: 1001,
//             };

//             // Stub findOne to reject with an error
//             const findOneStub = sinon.stub(db.Bookings, 'findOne').rejects(new Error('Database error'));

//             const result = await updateBooking(bookingData);

//             // Assertions
//             expect(findOneStub.calledOnce).to.be.true;
//             expect(result.EC).to.equal('1');
//             expect(result.EM).to.equal('Error updating booking');
//         });
//     });

//     describe('deleteBooking', () => {
//         afterEach(() => {
//             sinon.restore();
//         });

//         it('should delete booking successfully', async () => {
//             // Stub findOne to return a booking
//             const findOneStub = sinon.stub(db.Bookings, 'findOne').resolves({
//                 id: 1, // Replace with the actual booking data
//             });

//             // Stub destroy methods
//             const destroyTouristsStub = sinon.stub(db.Tourists, 'destroy').resolves();
//             const destroyBookingsStub = sinon.stub(db.Bookings, 'destroy').resolves();

//             const result = await deleteBooking(1); // Pass a valid booking id

//             // Assertions
//             expect(findOneStub.calledOnce).to.be.true;
//             expect(destroyTouristsStub.calledOnce).to.be.true;
//             expect(destroyBookingsStub.calledOnce).to.be.true;
//             expect(result.EC).to.equal('0');
//             expect(result.EM).to.equal('delete booking successfully');
//         });

//         it('should handle not found booking', async () => {
//             // Stub findOne to return null (not found)
//             const findOneStub = sinon.stub(db.Bookings, 'findOne').resolves(null);

//             const result = await deleteBooking(1); // Pass a valid booking id

//             // Assertions
//             expect(findOneStub.calledOnce).to.be.true;
//             expect(result.EC).to.equal('0');
//             expect(result.EM).to.equal('not found booking');
//         });

//         it('should handle errors gracefully', async () => {
//             // Stub findOne to throw an error
//             const findOneStub = sinon.stub(db.Bookings, 'findOne').rejects(new Error('Database error'));

//             const result = await deleteBooking(1); // Pass a valid booking id

//             // Assertions
//             expect(findOneStub.calledOnce).to.be.true;
//             expect(result.EC).to.equal('1');
//             expect(result.EM).to.equal('error deleting booking');
//         });
//     });

// });

describe('Customer API Service', () => {
    let sandbox;

    beforeEach(() => {
        sandbox = sinon.createSandbox();
    });

    afterEach(() => {
        sandbox.restore();
    });

    describe('getCustomerById', () => {
        it('should get customer by id successfully', async () => {
            const customerId = 1;
            const mockCustomerData = {
                id: customerId,
                name: 'John Doe',
                // other fields...
                CustomerAccount: {
                    id: 101,
                    // other fields...
                }
            };

            sandbox.stub(db.Customers, 'findOne').resolves(mockCustomerData);

            const result = await getCustomerById(customerId);

            expect(result).to.deep.equal({
                EM: 'get customer by id successfully',
                EC: '0',
                DT: mockCustomerData
            });
        });

        it('should handle not found customer', async () => {
            const customerId = 1;

            sandbox.stub(db.Customers, 'findOne').resolves(null);

            const result = await getCustomerById(customerId);

            expect(result).to.deep.equal({
                EM: 'not found customer',
                EC: '0',
                DT: null
            });
        });

        it('should handle error during get customer by id', async () => {
            const customerId = 1;

            sandbox.stub(db.Customers, 'findOne').rejects(new Error('Simulated error'));

            const result = await getCustomerById(customerId);

            expect(result).to.deep.equal({
                EM: 'error - get customer by id',
                EC: '1',
                DT: null
            });
        });
    });

    describe('getCustomerWithPagination', () => {
        it('should get all data successfully when page and limit are 0', async () => {
            const mockCustomerData = [{ id: 1, name: 'John' }, { id: 2, name: 'Jane' }];

            sandbox.stub(db.Customers, 'findAll').resolves(mockCustomerData);

            const result = await getCustomerWithPagination(0, 0);

            expect(result).to.deep.equal({
                EM: 'get data successfully',
                EC: '0',
                DT: mockCustomerData
            });
        });

        it('should get paginated data successfully', async () => {
            const mockCustomerData = [{ id: 1, name: 'John' }, { id: 2, name: 'Jane' }];
            const mockCount = 10;

            sandbox.stub(db.Customers, 'findAndCountAll').resolves({
                count: mockCount,
                rows: mockCustomerData
            });

            const result = await getCustomerWithPagination(2, 5);

            expect(result).to.deep.equal({
                EM: 'get data successfully',
                EC: '0',
                DT: {
                    totalRows: mockCount,
                    totalPages: 2,
                    customers: mockCustomerData
                }
            });
        });

        it('should handle invalid input parameters', async () => {
            const result = await getCustomerWithPagination(-1, 'invalid');

            expect(result).to.deep.equal({
                EM: 'error - get customer with pagination',
                EC: '1',
                DT: null
            });
        });

        it('should handle error during get customer with pagination', async () => {
            sandbox.stub(db.Customers, 'findAndCountAll').rejects(new Error('Simulated error'));

            const result = await getCustomerWithPagination(1, 5);

            expect(result).to.deep.equal({
                EM: 'error - get customer with pagination',
                EC: '1',
                DT: null
            });
        });
    });

    describe('deleteCustomer', () => {
        it('should delete customer successfully when customer exists', async () => {
            const mockCustomer = {
                id: 1, // Replace with the actual customer data
            };

            sandbox.stub(db.Customers, 'findOne').resolves(mockCustomer);
            sandbox.stub(db.Customers, 'destroy').resolves();

            const result = await deleteCustomer(1); // Pass a valid customer id

            expect(result).to.deep.equal({
                EM: 'delete customer successfully',
                EC: '0',
                DT: ''
            });
        });

        it('should handle not found customer', async () => {
            sandbox.stub(db.Customers, 'findOne').resolves(null);

            const result = await deleteCustomer(1); // Pass a valid customer id

            expect(result).to.deep.equal({
                EM: 'not found customer',
                EC: '0',
                DT: ''
            });
        });

        it('should handle errors during customer deletion', async () => {
            sandbox.stub(db.Customers, 'findOne').rejects(new Error('Simulated error'));

            const result = await deleteCustomer(1); // Pass a valid customer id

            expect(result).to.deep.equal({
                EM: 'error deleting customer',
                EC: '1',
                DT: ''
            });
        });
    });
});

describe('Discount API Service', () => {
    let sandbox;

    beforeEach(() => {
        sandbox = sinon.createSandbox();
    });

    afterEach(() => {
        sandbox.restore();
    });

    describe('createDiscount', () => {
        it('should create a discount successfully', async () => {
            // Mock data for the test
            const discountData = {
                discountName: 'Test Discount',
                discountType: 'Percentage',
                discountAmount: 10,
                discountDescription: 'Test description',
            };

            // Stub the create method to return a predefined data
            sandbox.stub(db.Discounts, 'create').resolves(discountData);

            const result = await createDiscount(discountData);

            // Assertions
            expect(result).to.deep.equal({
                EM: 'create discount successfully',
                EC: '0',
                DT: discountData,
            });
        });

        it('should handle errors during discount creation', async () => {
            // Stub the create method to throw an error
            sandbox.stub(db.Discounts, 'create').rejects(new Error('Simulated error'));

            const result = await createDiscount({});

            // Assertions
            expect(result).to.deep.equal({
                EM: 'error creating discount',
                EC: '1',
                DT: undefined,
            });
        });
    });

    describe('getDiscountById', () => {
        it('should get discount by ID successfully', async () => {
            // Mock data for the test
            const discountId = 1;
            const fakeDiscount = {
                id: discountId,
                discountName: 'Test Discount',
                discountType: 'Percentage',
                discountAmount: 10,
                discountDescription: 'Test description',
                Travels: [{/* Fake Travel data */ }],
            };

            // Stub the findOne method to return a predefined discount
            sandbox.stub(db.Discounts, 'findOne').resolves(fakeDiscount);

            const result = await getDiscountById(discountId);

            // Assertions
            expect(result).to.deep.equal({
                EM: 'get discount by id successfully',
                EC: '0',
                DT: fakeDiscount,
            });
        });

        it('should handle errors during reading discount data by ID', async () => {
            // Stub the findOne method to throw an error
            sandbox.stub(db.Discounts, 'findOne').rejects(new Error('Simulated error'));

            const result = await getDiscountById(1);

            // Assertions
            expect(result).to.deep.equal({
                EM: 'error getting discount by id',
                EC: '1',
                DT: undefined,
            });
        });
    });

    describe('getDiscountWithPagination', () => {
        it('should get all discounts successfully', async () => {
            // Mock data for the test
            const fakeDiscounts = [
                { id: 1, discountName: 'Discount 1', Travels: [] },
                { id: 2, discountName: 'Discount 2', Travels: [] },
            ];

            // Stub the findAll method to return a predefined list of discounts
            sandbox.stub(db.Discounts, 'findAll').resolves(fakeDiscounts);

            const result = await getDiscountWithPagination(0, 0);

            // Assertions
            expect(result).to.deep.equal({
                EM: 'get all discount successfully',
                EC: '0',
                DT: fakeDiscounts,
            });
        });

        it('should get paginated discounts successfully', async () => {
            // Mock data for the test
            const mockDiscountData = [
                { id: 3, discountName: 'Discount 3', Travels: [] },
                { id: 4, discountName: 'Discount 4', Travels: [] },
            ];
            const mockCount = 10;

            // Stub the findAndCountAll method to return a predefined paginated result
            sandbox.stub(db.Discounts, 'findAndCountAll').resolves({
                count: mockCount,
                rows: mockDiscountData,
            });

            const result = await getDiscountWithPagination(2, 5);

            // Assertions
            expect(result).to.deep.equal({
                EM: 'get pagination discount successfully',
                EC: '0',
                DT: {
                    totalRows: mockCount,
                    totalPages: 2,
                    discounts: mockDiscountData,
                },
            });
        });



        it('should handle errors during discount retrieval', async () => {
            // Stub the findAll method to throw an error
            sandbox.stub(db.Discounts, 'findAll').rejects(new Error('Simulated error'));

            const result = await getDiscountWithPagination(0, 0);

            // Assertions
            expect(result).to.deep.equal({
                EM: 'error getting all discounts',
                EC: '1',
                DT: undefined,
            });
        });

        it('should handle errors during paginated discount retrieval', async () => {
            // Stub the findAndCountAll method to throw an error
            sandbox.stub(db.Discounts, 'findAndCountAll').rejects(new Error('Simulated error'));

            const result = await getDiscountWithPagination(1, 2);

            // Assertions
            expect(result).to.deep.equal({
                EM: 'error getting pagination discounts',
                EC: '1',
                DT: undefined,
            });
        });
    });

    describe('updateDiscount', () => {
        it('should update discount successfully', async () => {
            // Mock data for the test
            const mockDiscountData = {
                id: 1,
                discountName: 'Updated Discount',
                discountType: 'Percentage',
                discountAmount: 10,
                discountDescription: 'Updated description',
            };

            // Stub the findOne and update methods to simulate successful update
            sandbox.stub(db.Discounts, 'findOne').resolves({ id: 1 }); // Assuming discount with id 1 exists
            sandbox.stub(db.Discounts, 'update').resolves([1]); // Simulating one row updated

            const result = await updateDiscount(mockDiscountData);

            // Assertions
            expect(result).to.deep.equal({
                EM: 'update discount successfully',
                EC: '0',
                DT: '',
            });
        });
        it('should handle not found discount during update', async () => {
            // Mock data for the test
            const mockDiscountData = {
                id: 1,
                discountName: 'Updated Discount',
                discountType: 'Percentage',
                discountAmount: 10,
                discountDescription: 'Updated description',
            };

            // Stub the findOne method to simulate discount not found
            sandbox.stub(db.Discounts, 'findOne').resolves(null);

            const result = await updateDiscount(mockDiscountData);

            // Assertions
            expect(result).to.deep.equal({
                EM: 'not found discount',
                EC: '0',
                DT: '',
            });
        });
    })

    describe('deleteDiscount', () => {
        it('should delete discount successfully', async () => {
            // Mock data for the test
            const mockDiscountId = 1;

            // Stub the findOne and destroy methods to simulate successful deletion
            sandbox.stub(db.Discounts, 'findOne').resolves({ id: mockDiscountId }); // Assuming discount with id 1 exists
            sandbox.stub(db.Discounts, 'destroy').resolves(1); // Simulating one row deleted

            const result = await deleteDiscount(mockDiscountId);

            // Assertions
            expect(result).to.deep.equal({
                EM: 'delete discount successfully',
                EC: '0',
                DT: '',
            });
        });

        it('should handle not found discount during deletion', async () => {
            // Mock data for the test
            const mockDiscountId = 1;

            // Stub the findOne method to simulate discount not found
            sandbox.stub(db.Discounts, 'findOne').resolves(null);

            const result = await deleteDiscount(mockDiscountId);

            // Assertions
            expect(result).to.deep.equal({
                EM: 'not found discount',
                EC: '0',
                DT: '',
            });
        });

        it('should handle error during discount deletion', async () => {
            // Mock data for the test
            const mockDiscountId = 1;

            // Stub the findOne and destroy methods to simulate an error during deletion
            sandbox.stub(db.Discounts, 'findOne').resolves({ id: mockDiscountId }); // Assuming discount with id 1 exists
            sandbox.stub(db.Discounts, 'destroy').rejects(new Error('Delete error'));

            const result = await deleteDiscount(mockDiscountId);

            // Assertions
            expect(result).to.deep.equal({
                EM: 'error deleting discount',
                EC: '1',
                DT: '',
            });
        });
    })
});

describe('Login API Service', () => {
    let sandbox;

    beforeEach(() => {
        sandbox = sinon.createSandbox();
    });

    afterEach(() => {
        sandbox.restore();
    });

    describe('company login', () => {

        it('should handle company login successfully', async () => {
            // Mock data for the test
            const mockCompanyUserData = {
                username: 'testUser',
                password: 'testPassword',
            };

            // Stub the findOne method to simulate successful login
            sandbox.stub(db.CompanyAccounts, 'findOne').resolves({
                username: mockCompanyUserData.username,
                password: mockCompanyUserData.password,
                role: 'admin', // Assuming a role for testing
            });

            // Stub the createJWT method to simulate token creation
            const createJWTStub = sandbox.stub(JWTActions, 'createJWT').returns('mockToken');

            const result = await handleCompanyLogin(mockCompanyUserData);

            // Assertions
            expect(result).to.deep.equal({
                EM: 'Login successfully',
                EC: '0',
                DT: 'mockToken',
            });

            // Check if createJWT was called with the correct parameters
            sinon.assert.calledOnceWithExactly(createJWTStub, {
                username: mockCompanyUserData.username,
                role: 'admin', // Adjust based on your test case
                password: mockCompanyUserData.password,
            });
        });


        it('should handle wrong password during company login', async () => {
            // Mock data for the test
            const mockCompanyUserData = {
                username: 'testUser',
                password: 'wrongPassword',
            };

            // Stub the findOne method to simulate user found with wrong password
            sandbox.stub(db.CompanyAccounts, 'findOne').resolves({
                username: mockCompanyUserData.username,
                password: 'correctPassword', // Simulating a different password
                role: 'admin',
            });

            const result = await handleCompanyLogin(mockCompanyUserData);

            // Assertions
            expect(result).to.deep.equal({
                EM: 'Wrong password',
                EC: '0',
                DT: '',
            });
        });

        it('should handle not found user during company login', async () => {
            // Mock data for the test
            const mockCompanyUserData = {
                username: 'nonexistentUser',
                password: 'testPassword',
            };

            // Stub the findOne method to simulate user not found
            sandbox.stub(db.CompanyAccounts, 'findOne').resolves(null);

            const result = await handleCompanyLogin(mockCompanyUserData);

            // Assertions
            expect(result).to.deep.equal({
                EM: 'Not found user',
                EC: '0',
                DT: '',
            });
        });

        it('should handle error during company login', async () => {
            // Mock data for the test
            const mockCompanyUserData = {
                username: 'testUser',
                password: 'testPassword',
            };

            // Stub the findOne method to simulate an error during login
            const errorMock = new Error('Login error');
            sandbox.stub(db.CompanyAccounts, 'findOne').rejects(errorMock);

            const result = await handleCompanyLogin(mockCompanyUserData);

            // Assertions
            expect(result).to.deep.equal({
                EM: 'Error when login',
                EC: '1',
                DT: '',
            });
        });

    })

})

describe('Package API Service', () => {
    let sandbox;

    beforeEach(() => {
        sandbox = sinon.createSandbox();
    });

    afterEach(() => {
        sandbox.restore();
    });

    describe('getPackageById', () => {
        it('should get package by id successfully', async () => {
            const mockPackageData = { id: 1, packageName: 'Package 1', packageType: 'Type A', packageAddress: 'Address A', packageDescription: 'Description A' };

            sandbox.stub(db.Packages, 'findOne').resolves(mockPackageData);

            const result = await getPackageById(1);

            expect(result).to.deep.equal({
                EM: 'Get Package sucessfully',
                EC: 0,
                DT: mockPackageData,
            });
        });

        it('should handle error during getPackageById', async () => {
            const errorMock = new Error('Database error');
            sandbox.stub(db.Packages, 'findOne').rejects(errorMock);

            const result = await getPackageById(1);

            expect(result).to.deep.equal({
                EM: 'Database error',
                EC: 1,
                DT: '',
            });
        });
    });

    describe('getPackageWithPagination', () => {
        it('should get paginated packages successfully', async () => {
            // Mock data for the test
            const mockPackageData = [
                { id: 1, packageName: 'Package 1', packageType: 'Type A', packageAddress: 'Address A', packageDescription: 'Description A' },
                { id: 2, packageName: 'Package 2', packageType: 'Type B', packageAddress: 'Address B', packageDescription: 'Description B' },
            ];

            const mockCount = 10;

            // Stub the findAndCountAll method to simulate a successful paginated query
            sandbox.stub(db.Packages, 'findAndCountAll').resolves({
                count: mockCount,
                rows: mockPackageData,
            });

            const result = await getPackageWithPagination(2, 5);

            // Assertions
            expect(result).to.deep.equal({
                EM: 'get data successfully',
                EC: '0',
                DT: {
                    totalRows: mockCount,
                    totalPages: 2,
                    packages: mockPackageData,
                },
            });
        });

        it('should handle error during getPackageWithPagination', async () => {
            // Stub the findAndCountAll method to simulate an error during pagination
            sandbox.stub(db.Packages, 'findAndCountAll').rejects(new Error('Pagination error'));

            const result = await getPackageWithPagination(2, 5);

            // Assertions
            expect(result).to.deep.equal({
                EM: 'Pagination error',
                EC: '1',
                DT: '',
            });
        });
    });

    describe('getPackageByAddressList', () => {
        it('should get packages by address list successfully', async () => {
            // Mock data for the test
            const mockAddressList = 'Address A|Address B|Address C';
            const mockPackageData = [
                { id: 1, packageName: 'Package 1', packageType: 'Type A', packageAddress: 'Address A', packageDescription: 'Description A' },
                { id: 2, packageName: 'Package 2', packageType: 'Type B', packageAddress: 'Address B', packageDescription: 'Description B' },
            ];

            // Stub the findAll method to simulate a successful query by address list
            sandbox.stub(db.Packages, 'findAll').resolves(mockPackageData);

            const result = await getPackageByAddressList(mockAddressList);

            // Assertions
            expect(result).to.deep.equal({
                EM: 'get data successfully',
                EC: '0',
                DT: mockPackageData,
            });
        });

        it('should handle empty address list', async () => {
            const result = await getPackageByAddressList('');

            // Assertions
            expect(result).to.deep.equal({
                EM: 'get data successfully',
                EC: '0',
                DT: [],
            });
        });

        it('should handle error during getPackageByAddressList', async () => {
            // Stub the findAll method to simulate an error during query
            sandbox.stub(db.Packages, 'findAll').rejects(new Error('Query error'));

            const result = await getPackageByAddressList('Address A|Address B');

            // Assertions
            expect(result).to.deep.equal({
                EM: 'Query error',
                EC: '1',
                DT: '',
            });
        });
    });

    describe('createPackage', () => {
        it('should create a package successfully', async () => {
            // Mock data for the test
            const mockPackageData = {
                packageName: 'Test Package',
                packageType: 'Test Type',
                packageAddress: 'Test Address',
                packageDescription: 'Test Description',
            };

            // Stub the create method to simulate a successful package creation
            sandbox.stub(db.Packages, 'create').resolves(mockPackageData);

            const result = await createPackage(mockPackageData);

            // Assertions
            expect(result).to.deep.equal({
                EM: 'create package successfully',
                EC: '0',
                DT: mockPackageData,
            });
        });

        it('should handle error during package creation', async () => {
            // Mock data for the test
            const mockPackageData = {
                packageName: 'Test Package',
                packageType: 'Test Type',
                packageAddress: 'Test Address',
                packageDescription: 'Test Description',
            };

            // Stub the create method to simulate an error during package creation
            sandbox.stub(db.Packages, 'create').rejects(new Error('Creation error'));

            const result = await createPackage(mockPackageData);

            // Assertions
            expect(result).to.deep.equal({
                EM: 'database error',
                EC: '1',
                DT: '',
            });
        });
    });

    describe('updatePackage', () => {
        it('should update a package successfully', async () => {
            // Mock data for the test
            const mockPackageData = {
                id: 1,
                packageName: 'Updated Package',
                packageType: 'Updated Type',
                packageAddress: 'Updated Address',
                packageDescription: 'Updated Description',
            };

            // Stub the findOne and update methods to simulate a successful package update
            sandbox.stub(db.Packages, 'findOne').resolves({ id: 1 }); // Assuming package with id: 1 exists
            sandbox.stub(db.Packages, 'update').resolves([1]); // Number of rows updated

            const result = await updatePackage(mockPackageData);

            // Assertions
            expect(result).to.deep.equal({
                EM: 'update package successfully',
                EC: '0',
                DT: '',
            });
        });

        it('should handle error when updating a package', async () => {
            // Mock data for the test
            const mockPackageData = {
                id: 1,
                packageName: 'Updated Package',
                packageType: 'Updated Type',
                packageAddress: 'Updated Address',
                packageDescription: 'Updated Description',
            };

            // Stub the findOne and update methods to simulate an error during package update
            sandbox.stub(db.Packages, 'findOne').rejects(new Error('Database error'));
            sandbox.stub(db.Packages, 'update').rejects(new Error('Update error'));

            const result = await updatePackage(mockPackageData);

            // Assertions
            expect(result).to.deep.equal({
                EM: 'Database error',
                EC: '1',
                DT: '',
            });
        });

        it('should handle not found package during update', async () => {
            // Mock data for the test
            const mockPackageData = {
                id: 1,
                packageName: 'Updated Package',
                packageType: 'Updated Type',
                packageAddress: 'Updated Address',
                packageDescription: 'Updated Description',
            };

            // Stub the findOne method to simulate not finding the package
            sandbox.stub(db.Packages, 'findOne').resolves(null);

            const result = await updatePackage(mockPackageData);

            // Assertions
            expect(result).to.deep.equal({
                EM: 'not found package',
                EC: '0',
                DT: '',
            });
        });
    });

    describe('deletePackage', () => {
        it('should delete a package successfully', async () => {
            // Mock data for the test
            const packageId = 1;

            // Stub the findOne and destroy methods to simulate a successful package deletion
            sandbox.stub(db.Packages, 'findOne').resolves({ id: packageId }); // Assuming package with id: 1 exists
            sandbox.stub(db.Packages, 'destroy').resolves(1); // Number of rows deleted

            const result = await deletePackage(packageId);

            // Assertions
            expect(result).to.deep.equal({
                EM: 'delete package successfully',
                EC: '0',
                DT: '',
            });
        });

        it('should handle error when deleting a package', async () => {
            // Mock data for the test
            const packageId = 1;

            // Stub the findOne and destroy methods to simulate an error during package deletion
            sandbox.stub(db.Packages, 'findOne').rejects(new Error('Database error'));
            sandbox.stub(db.Packages, 'destroy').rejects(new Error('Delete error'));

            const result = await deletePackage(packageId);

            // Assertions
            expect(result).to.deep.equal({
                EM: 'Database error',
                EC: '1',
                DT: '',
            });
        });

        it('should handle not found package during deletion', async () => {
            // Mock data for the test
            const packageId = 1;

            // Stub the findOne method to simulate not finding the package
            sandbox.stub(db.Packages, 'findOne').resolves(null);

            const result = await deletePackage(packageId);

            // Assertions
            expect(result).to.deep.equal({
                EM: 'not found package',
                EC: '0',
                DT: '',
            });
        });
    });
});

describe('Tour Package API Service - getAllTourPackage', () => {
    let sandbox;

    beforeEach(() => {
        sandbox = sinon.createSandbox();
    });

    afterEach(() => {
        sandbox.restore();
    });

    it('should get all tour packages successfully', async () => {
        // Mock data for the test
        const mockTourPackages = [
            { id: 1, name: 'Tour Package 1' },
            { id: 2, name: 'Tour Package 2' },
        ];

        // Stub the findAll method to simulate getting all tour packages
        sandbox.stub(db.TourPackages, 'findAll').resolves(mockTourPackages);

        const result = await getAllTourPackage();

        // Assertions
        expect(result).to.deep.equal({
            EM: 'get data successfully',
            EC: '0',
            DT: mockTourPackages,
        });
    });

    it('should handle error when getting all tour packages', async () => {
        // Stub the findAll method to simulate an error during fetching tour packages
        sandbox.stub(db.TourPackages, 'findAll').rejects(new Error('Database error'));

        const result = await getAllTourPackage();

        // Assertions
        expect(result).to.deep.equal({
            EM: 'Database error',
            EC: '1',
            DT: '',
        });
    });
});

// describe('Tour API Service', () => {
//     let sandbox;

//     beforeEach(() => {
//         sandbox = sinon.createSandbox();
//     });

//     afterEach(() => {
//         sandbox.restore();
//     });

//     describe('getTourPlanning', () => {
//         it('should get tour planning count successfully', async () => {
//             const mockIncompletedTourCount = 5; // Replace with the actual count

//             // Stub the count method to return a predefined count
//             sandbox.stub(db.Tours, 'count').resolves(mockIncompletedTourCount);

//             const result = await getTourPlanning();

//             // Assertions
//             expect(result).to.deep.equal({
//                 EM: 'get tour is planning successfully',
//                 EC: '0',
//                 DT: mockIncompletedTourCount
//             });
//         });

//         it('should handle errors during tour planning count retrieval', async () => {
//             // Stub the count method to throw an error
//             sandbox.stub(db.Tours, 'count').rejects(new Error('Simulated error'));

//             const result = await getTourPlanning();

//             // Assertions
//             expect(result).to.deep.equal({
//                 EM: 'error getting tour planning count',
//                 EC: '1',
//                 DT: undefined
//             });
//         });
//     });

//     describe('createTour', () => {
//         it('should create a tour successfully', async () => {
//             // Mock data for the test
//             const mockTourData = {
//                 tourGeneralInformation: {
//                     tourName: 'tourName',
//                     totalDay: 2,
//                     totalNight: 2,
//                     addressList: 'Đà Lạt|Nha Trang',
//                     tourPrice: 5000000,
//                     tourStatus: 'Completed'
//                 },
//                 mainImage: 'mainImage',
//                 additionalImages: ['img1', 'img2'],
//                 tourSchedule: [[{ label: 'Thác Bobla', value: 12 }, { label: 'Ga Đà Lạt', value: 13 }], [{ label: 'Thác Bobla', value: 12 }, { label: 'Ga Đà Lạt', value: 13 }]],
//                 daySummaries: ["Thác - Ga", "Ga- Thác"]
//             };

//             // Stub necessary methods to simulate the creation process
//             sandbox.stub(db.Tours, 'create').resolves({ id: 1 }); // Stub the create method

//             // ... Stub other necessary methods as needed

//             const result = await createTour(mockTourData);

//             // Assertions
//             expect(result).to.deep.equal({
//                 EM: 'create tour successfully',
//                 EC: '0',
//                 DT: ''
//             });
//         });

//         it('should handle error during tour creation', async () => {
//             // Mock data for the test
//             const mockTourData = {
//                 // ... provide the required data for creating a tour
//             };

//             // Stub necessary methods to simulate an error during the creation process
//             sandbox.stub(db.Tours, 'create').rejects(new Error('Database error'));

//             // ... Stub other necessary methods as needed

//             const result = await createTour(mockTourData);

//             // Assertions
//             expect(result).to.deep.equal({
//                 EM: 'Database error',
//                 EC: '1',
//                 DT: ''
//             });
//         });
//     })

//     describe('getTourById', () => {
//         it('should get tour by id successfully', async () => {
//             // Mock data for the test
//             const mockTourId = 1;
//             const mockTourData = {
//                 id: mockTourId,
//                 "DT": {
//                     id: 7,
//                     tourName: "Thành phố Hồ Chí Minh - Chợ Bến Thành - Suối Tiên",
//                     totalDay: 2,
//                     totalNight: 2,
//                     addressList: "Nha Trang",
//                     tourPrice: "2000000",
//                     tourStatus: "Completed",
//                     mainImage: "https://firebasestorage.googleapis.com/v0/b/webbooking-2460b.appspot.com/o/images%2F7493164544cca73?alt=media&token=9a6994d7-55c9-484c-ad2c-20760f3bfbe5",
//                     createdAt: "2023-12-28T16:06:02.000Z",
//                     updatedAt: "2024-01-01T19:15:45.000Z",
//                     TourSchedules: [
//                         {
//                             id: 49,
//                             tourId: 7,
//                             dayIndex: 1,
//                             daySummary: "THÁP BÀ - NGỌC TRAI LONG BEACH PEARL",
//                             createdAt: "2024-01-01T19:15:45.000Z",
//                             updatedAt: "2024-01-01T19:15:45.000Z",
//                             Packages: [
//                                 {
//                                     id: 1,
//                                     packageName: "Tháp bà Ponagar",
//                                     packageType: "Tham quan",
//                                     packageAddress: "Nha Trang",
//                                     packageDescription: "Được coi là Tháp Bà Ponagar Nha Trang còn có tên gọi khác là Yang Po Inư Nagar hay Yang Pô Ana Gar - Là ngôi đền Chăm Pa nằm trên đỉnh một ngọn đồi nhỏ cao khoảng 10-12 mét so với mực nước biển, ở cửa sông Cái (sông Nha Trang) tại Nha Trang - Khánh Hòa.",
//                                     createdAt: "2023-12-27T13:58:28.000Z",
//                                     updatedAt: "2023-12-27T13:58:28.000Z",
//                                     TourPackages: {
//                                         tourScheduleId: 49,
//                                         packageId: 1,
//                                         createdAt: "2024-01-01T19:15:45.000Z",
//                                         updatedAt: "2024-01-01T19:15:45.000Z"
//                                     }
//                                 },
//                                 {
//                                     id: 2,
//                                     packageName: "Ngọc trai Long Beach Pearl (đường Trương Hán Siêu)",
//                                     packageType: "Tham quan",
//                                     packageAddress: "Nha Trang",
//                                     packageDescription: "Tham quan, mua sắm các sản phẩm từ ngọc trai - báu vật khơi xa kết hợp cùng sự sáng tạo của người nghệ nhân tạo thành những sản phẩm trang sức cao cấp, chất lượng cao. Không chỉ dành riêng cho phái nữ, Long Beach Pearl còn chế tác những chiếc vòng tay dây da ngọc trai dành cho nam giới. ",
//                                     createdAt: "2023-12-28T13:56:17.000Z",
//                                     updatedAt: "2023-12-28T13:56:17.000Z",
//                                     TourPackages: {
//                                         tourScheduleId: 49,
//                                         packageId: 2,
//                                         createdAt: "2024-01-01T19:15:45.000Z",
//                                         updatedAt: "2024-01-01T19:15:45.000Z"
//                                     }
//                                 }
//                             ]
//                         },
//                         {
//                             id: 50,
//                             tourId: 7,
//                             dayIndex: 2,
//                             daySummary: "LÀNG CHÀI  - ĐẢO KHỈ",
//                             createdAt: "2024-01-01T19:15:45.000Z",
//                             updatedAt: "2024-01-01T19:15:45.000Z",
//                             Packages: [
//                                 {
//                                     id: 3,
//                                     packageName: "Làng Chài Xưa",
//                                     packageType: "Tham quan",
//                                     packageAddress: "Nha Trang",
//                                     packageDescription: "Với lịch sử 300 năm cái nôi của nghề làm nước mắm, trải nghiệm cảm giác lao động trên đồng muối, đi trên con đường rạng xưa, thăm phố cổ Phan Thiết, , thăm nhà lều của hàm hộ nước mắm xưa, đắm chìm cảm xúc trong biển 3D và thích thú khi đi chợ làng chài xưa với bàn tính tay, bàn cân xưa thú vị,…",
//                                     createdAt: "2023-12-28T13:56:40.000Z",
//                                     updatedAt: "2023-12-28T13:56:40.000Z",
//                                     TourPackages: {
//                                         tourScheduleId: 50,
//                                         packageId: 3,
//                                         createdAt: "2024-01-01T19:15:45.000Z",
//                                         updatedAt: "2024-01-01T19:15:45.000Z"
//                                     }
//                                 },
//                                 {
//                                     id: 4,
//                                     packageName: "Hòn Lao - Đảo Khỉ",
//                                     packageType: "Tham quan",
//                                     packageAddress: "Nha Trang",
//                                     packageDescription: "nơi có hơn 1000 chú khỉ đang được bảo tồn và sinh sống tự nhiên. Quý khách tự do tắm biển, thư giãn, tham quan xem chương trình biểu diễn xiếc Khỉ, đua chó, khỉ bơi lội hoặc trải nghiệm các môn thể thao trên bãi biển và trò chơi: canô kéo dù, mô tô nước, đua xe công thức 1, bắn súng sơn, cưỡi đà điểu … (chi phí tự túc).",
//                                     createdAt: "2023-12-28T13:57:03.000Z",
//                                     updatedAt: "2023-12-30T14:01:17.000Z",
//                                     TourPackages: {
//                                         tourScheduleId: 50,
//                                         packageId: 4,
//                                         createdAt: "2024-01-01T19:15:45.000Z",
//                                         updatedAt: "2024-01-01T19:15:45.000Z"
//                                     }
//                                 }
//                             ]
//                         }
//                     ],
//                     TourAdditionalImages: [
//                         {
//                             id: 57,
//                             tourId: 7,
//                             additionalImage: "https://firebasestorage.googleapis.com/v0/b/webbooking-2460b.appspot.com/o/images%2F4f8c1fad44e0e4cf?alt=media&token=8964f20c-6825-45f2-bca1-4bf2165dd839",
//                             createdAt: "2024-01-01T19:15:45.000Z",
//                             updatedAt: "2024-01-01T19:15:45.000Z"
//                         },
//                         {
//                             id: 58,
//                             tourId: 7,
//                             additionalImage: "https://firebasestorage.googleapis.com/v0/b/webbooking-2460b.appspot.com/o/images%2Ff6a3039af3368d85?alt=media&token=c3f660b4-0ecb-4fe9-bb6a-94ad054e9537",
//                             createdAt: "2024-01-01T19:15:45.000Z",
//                             updatedAt: "2024-01-01T19:15:45.000Z"
//                         },
//                         {
//                             id: 59,
//                             tourId: 7,
//                             additionalImage: "https://firebasestorage.googleapis.com/v0/b/webbooking-2460b.appspot.com/o/images%2F42c08ccf9e59648a?alt=media&token=d6fb3a22-c0e1-45cf-98b0-cdbab3fbe31c",
//                             createdAt: "2024-01-01T19:15:45.000Z",
//                             updatedAt: "2024-01-01T19:15:45.000Z"
//                         }
//                     ]
//                 }
//             };

//             // Stub necessary methods to simulate the database query
//             sandbox.stub(db.Tours, 'findOne').resolves(mockTourData);

//             // ... Stub other necessary methods as needed

//             const result = await getTourById(mockTourId);

//             // Assertions
//             expect(result).to.deep.equal({
//                 EM: 'get tour by id successfully',
//                 EC: '0',
//                 DT: mockTourData
//             });
//         });

//         it('should handle error during getTourById', async () => {
//             // Mock data for the test
//             const mockTourId = 1;

//             // Stub necessary methods to simulate an error during the database query
//             sandbox.stub(db.Tours, 'findOne').rejects(new Error('Database error'));

//             // ... Stub other necessary methods as needed

//             const result = await getTourById(mockTourId);

//             // Assertions
//             expect(result).to.deep.equal({
//                 EM: 'Database error',
//                 EC: '1',
//                 DT: ''
//             });
//         });
//     })

//     describe('getTourWithPagination', () => {
//         it('should get all tours successfully when page and limit are 0', async () => {
//             // Mock data for the test
//             const mockTours = [{ id: 1, tourName: 'Tour 1' }, { id: 2, tourName: 'Tour 2' }];

//             // Stub necessary methods to simulate the database query
//             sandbox.stub(db.Tours, 'findAll').resolves(mockTours);

//             const result = await getTourWithPagination(0, 0);

//             // Assertions
//             expect(result).to.deep.equal({
//                 EM: 'get data successfully',
//                 EC: '0',
//                 DT: mockTours
//             });
//         });

//         it('should get paginated tours successfully when page and limit are not 0', async () => {
//             // Mock data for the test
//             const mockPage = 1;
//             const mockLimit = 10;
//             const mockTourData = {
//                 count: 20,
//                 rows: [{ id: 1, tourName: 'Tour 1' }, { id: 2, tourName: 'Tour 2' }]
//             };

//             // Stub necessary methods to simulate the database query
//             sandbox.stub(db.Tours, 'findAndCountAll').resolves(mockTourData);

//             const result = await getTourWithPagination(mockPage, mockLimit);

//             // Assertions
//             expect(result).to.deep.equal({
//                 EM: 'get data successfully',
//                 EC: '0',
//                 DT: {
//                     totalRows: mockTourData.count,
//                     totalPages: 2,
//                     tours: mockTourData.rows
//                 }
//             });
//         });

//         it('should handle error during getTourWithPagination', async () => {
//             // Mock data for the test
//             const mockPage = 1;
//             const mockLimit = 10;

//             // Stub necessary methods to simulate an error during the database query
//             sandbox.stub(db.Tours, 'findAndCountAll').rejects(new Error('Database error'));

//             const result = await getTourWithPagination(mockPage, mockLimit);

//             // Assertions
//             expect(result).to.deep.equal({
//                 EM: 'Database error',
//                 EC: '1',
//                 DT: ''
//             });
//         });
//     })

//     describe('updateTour', () => {
//         it('should update tour successfully', async () => {
//             // Mock data for the test
//             const mockTourData = {
//                 id: 1,
//                 tourGeneralInformation: {
//                     tourName: 'Updated Tour',
//                     totalDay: 5,
//                     totalNight: 4,
//                     addressList: ['Location 1', 'Location 2'],
//                     tourPrice: 1000,
//                     tourStatus: 'Active',
//                 },
//                 mainImage: 'updated-main-image.jpg',
//                 additionalImages: [1, 2, 3], // Assuming these are valid additional image IDs
//                 tourSchedule: [
//                     [
//                         { value: 4 }, // Assuming this is a valid package ID
//                         { value: 5 },
//                     ],
//                     [
//                         { value: 6 },
//                         { value: 7 },
//                     ],
//                 ],
//                 daySummaries: ['Day 1 Summary', 'Day 2 Summary'],
//             };

//             // Stub necessary methods to simulate the database queries
//             sandbox.stub(db.Tours, 'findOne').resolves({ id: 1 }); // Assuming the tour exists
//             sandbox.stub(db.Tours, 'update').resolves([1]); // Mock the update result
//             sandbox.stub(db.TourAdditionalImages, 'destroy').resolves(2); // Mock the destroy result
//             sandbox.stub(db.TourSchedules, 'findAll').resolves([{ id: 1 }, { id: 2 }]);
//             sandbox.stub(db.TourPackages, 'destroy').resolves(2); // Mock the destroy result
//             sandbox.stub(db.TourSchedules, 'destroy').resolves(2); // Mock the destroy result
//             sandbox.stub(db.TourAdditionalImages, 'create').resolves({ id: 3 }); // Mock the create result
//             sandbox.stub(db.TourSchedules, 'create').resolves({ id: 4 }); // Mock the create result
//             sandbox.stub(db.TourPackages, 'create').resolves({ id: 5 }); // Mock the create result

//             const result = await updateTour(mockTourData);

//             // Assertions
//             expect(result).to.deep.equal({
//                 EM: 'update package successfully',
//                 EC: '0',
//                 DT: '',
//             });
//         });

//         it('should handle not found data during updateTour', async () => {
//             // Mock data for the test
//             const mockTourData = {
//                 id: 1,
//                 // ... other data
//             };

//             // Stub the findOne method to simulate not finding the tour
//             sandbox.stub(db.Tours, 'findOne').resolves(null);

//             const result = await updateTour(mockTourData);

//             // Assertions
//             expect(result).to.deep.equal({
//                 EM: 'not found data',
//                 EC: '0',
//                 DT: '',
//             });
//         });

//         it('should handle database error during updateTour', async () => {
//             // Mock data for the test
//             const mockTourData = {
//                 id: 1,
//                 // ... other data
//             };

//             // Stub necessary methods to simulate a database error
//             sandbox.stub(db.Tours, 'findOne').throws(new Error('Database error'));

//             const result = await updateTour(mockTourData);

//             // Assertions
//             expect(result).to.deep.equal({
//                 EM: 'Database error',
//                 EC: '1',
//                 DT: '',
//             });
//         });

//     })

//     describe('deleteTour', () => {
//         it('should delete tour successfully', async () => {
//             // Mock data for the test
//             const mockTourId = 1;

//             // Stub necessary methods to simulate the database queries
//             sandbox.stub(db.Tours, 'findOne').resolves({ id: mockTourId }); // Assuming the tour exists
//             sandbox.stub(db.TourAdditionalImages, 'destroy').resolves(2); // Mock the destroy result
//             sandbox.stub(db.TourSchedules, 'findAll').resolves([{ id: 1 }, { id: 2 }]);
//             sandbox.stub(db.TourPackages, 'destroy').resolves(2); // Mock the destroy result
//             sandbox.stub(db.TourSchedules, 'destroy').resolves(2); // Mock the destroy result
//             sandbox.stub(db.Tours, 'destroy').resolves(1); // Mock the destroy result

//             const result = await deleteTour(mockTourId);

//             // Assertions
//             expect(result).to.deep.equal({
//                 EM: 'delete tour successfully',
//                 EC: '0',
//                 DT: '',
//             });
//         });

//         it('should handle not found tour during deleteTour', async () => {
//             // Mock data for the test
//             const mockTourId = 1;

//             // Stub the findOne method to simulate not finding the tour
//             sandbox.stub(db.Tours, 'findOne').resolves(null);

//             const result = await deleteTour(mockTourId);

//             // Assertions
//             expect(result).to.deep.equal({
//                 EM: 'not found tour',
//                 EC: '0',
//                 DT: '',
//             });
//         });

//         it('should handle database error during deleteTour', async () => {
//             // Mock data for the test
//             const mockTourId = 1;

//             // Stub necessary methods to simulate a database error
//             sandbox.stub(db.Tours, 'findOne').throws(new Error('Database error'));

//             const result = await deleteTour(mockTourId);

//             // Assertions
//             expect(result).to.deep.equal({
//                 EM: 'error deleting tour',
//                 EC: '1',
//                 DT: '',
//             });
//         });
//     })
// });

describe('Travel API Service', () => {
    let sandbox;

    beforeEach(() => {
        sandbox = sinon.createSandbox();
    });

    afterEach(() => {
        sandbox.restore();
    });

    describe('createTravel', () => {
        it('should create a travel successfully', async () => {
            // Mock data for the test
            const mockTravelData = {
                startLocation: 'City A',
                startDateTime: new Date(),
                maxTicket: 100,
                remainTicket: 50,
                travelPrice: 200.5,
                discountId: 1,
                tourId: 123,
            };

            // Stub the create method to simulate a successful creation
            const createStub = sandbox.stub(db.Travels, 'create').resolves(mockTravelData);

            const result = await createTravel(mockTravelData);

            // Assertions
            expect(result).to.deep.equal({
                EM: 'create travel successfully',
                EC: '0',
                DT: mockTravelData,
            });

            // Verify that the create method was called with the correct arguments
            sinon.assert.calledOnceWithExactly(createStub, mockTravelData);
        });

        it('should handle error during travel creation', async () => {
            // Mock data for the test
            const mockTravelData = {
                startLocation: 'City A',
                startDateTime: new Date(),
                maxTicket: 100,
                remainTicket: 50,
                travelPrice: 200.5,
                discountId: 1,
                tourId: 123,
            };

            // Stub the create method to simulate an error during creation
            sandbox.stub(db.Travels, 'create').throws(new Error('Database error'));

            const result = await createTravel(mockTravelData);

            // Assertions
            expect(result).to.deep.equal({
                EM: 'Database error',
                EC: '1',
                DT: '',
            });
        });

    })
    describe('getTravelById', () => {
        it('should get travel by id successfully', async () => {
            // Mock data for the test
            const mockTravelId = 1;
            const mockTravelData = {
                id: mockTravelId,
                // ... other travel properties
            };

            // Stub the findOne method to simulate finding the travel
            sandbox.stub(db.Travels, 'findOne').resolves(mockTravelData);

            // Stub the include relationships to simulate associated data
            sandbox.stub(db.Tours, 'findOne').resolves({ id: 1 }); // Assuming Tours model is associated

            const result = await getTravelById(mockTravelId);

            // Assertions
            expect(result).to.deep.equal({
                EM: 'get travel by id successfully',
                EC: '0',
                DT: mockTravelData,
            });
        });

        it('should handle error when getting travel by id', async () => {
            // Mock data for the test
            const mockTravelId = 1;

            // Stub the findOne method to simulate an error
            sandbox.stub(db.Travels, 'findOne').throws(new Error('Database error'));

            const result = await getTravelById(mockTravelId);

            // Assertions
            expect(result).to.deep.equal({
                EM: 'Error - get travel by id',
                EC: '1',
                DT: undefined,
            });
        });
    })
    describe('getTravelWithPagination', () => {
        it('should get all travels when page and limit are 0', async () => {
            // Mock data for the test
            const mockTravels = [{ id: 1, /* ... other travel properties */ }];
            sandbox.stub(db.Travels, 'findAll').resolves(mockTravels);

            const result = await getTravelWithPagination(0, 0);

            // Assertions
            expect(result).to.deep.equal({
                EM: 'get data successfully',
                EC: '0',
                DT: mockTravels,
            });
        });

        it('should get paginated travels when page and limit are specified', async () => {
            // Mock data for the test
            const mockTravels = [{ id: 1, /* ... other travel properties */ }];
            const mockCount = 1;

            // Stub the findAndCountAll method to simulate paginated result
            sandbox.stub(db.Travels, 'findAndCountAll').resolves({
                count: mockCount,
                rows: mockTravels,
            });

            const result = await getTravelWithPagination(1, 10);

            // Assertions
            expect(result).to.deep.equal({
                EM: 'get data successfully',
                EC: '0',
                DT: {
                    totalRows: mockCount,
                    totalPages: 1,
                    travels: mockTravels,
                },
            });
        });

        it('should handle error when getting travels with pagination', async () => {
            // Stub the findAll method to simulate an error
            sandbox.stub(db.Travels, 'findAll').throws(new Error('Database error'));

            const result = await getTravelWithPagination(0, 0);

            // Assertions
            expect(result).to.deep.equal({
                EM: 'Database error',
                EC: '1',
                DT: '',
            });
        });
    })
    describe('updateTravel', () => {
        it('should update a travel successfully', async () => {
            // Mock data for the test
            const mockTravelData = {
                id: 1,
                startLocation: 'City A',
                startDateTime: new Date(),
                maxTicket: 100,
                remainTicket: 50,
                travelPrice: 200.5,
                discountId: 1,
                tourId: 123,
            };

            // Stub the findOne and update methods to simulate a successful update
            const findOneStub = sandbox.stub(db.Travels, 'findOne').resolves(mockTravelData);
            const updateStub = sandbox.stub(db.Travels, 'update').resolves([1]); // Simulating one row updated

            const result = await updateTravel(mockTravelData);

            // Assertions
            expect(result).to.deep.equal({
                EM: 'update package successfully',
                EC: '0',
                DT: '',
            });

            // Verify that the findOne method was called with the correct arguments
            sinon.assert.calledOnceWithExactly(findOneStub, { where: { id: mockTravelData.id } });

            // Verify that the update method was called with the correct arguments
            sinon.assert.calledOnceWithExactly(updateStub, {
                startLocation: mockTravelData.startLocation,
                startDateTime: mockTravelData.startDateTime,
                maxTicket: mockTravelData.maxTicket,
                remainTicket: mockTravelData.remainTicket,
                travelPrice: mockTravelData.travelPrice,
                tourId: mockTravelData.tourId,
                discountId: mockTravelData.discountId
            }, { where: { id: mockTravelData.id } });
        });

        it('should handle non-existent travel during update', async () => {
            // Mock data for the test
            const mockTravelData = {
                id: 1,
                startLocation: 'City A',
                startDateTime: new Date(),
                maxTicket: 100,
                remainTicket: 50,
                travelPrice: 200.5,
                discountId: 1,
                tourId: 123,
            };

            // Stub the findOne method to simulate a non-existent travel
            sandbox.stub(db.Travels, 'findOne').resolves(null);

            const result = await updateTravel(mockTravelData);

            // Assertions
            expect(result).to.deep.equal({
                EM: 'not found data',
                EC: '0',
                DT: '',
            });
        });

        it('should handle error during travel update', async () => {
            // Mock data for the test
            const mockTravelData = {
                id: 1,
                startLocation: 'City A',
                startDateTime: new Date(),
                maxTicket: 100,
                remainTicket: 50,
                travelPrice: 200.5,
                discountId: 1,
                tourId: 123,
            };

            // Stub the findOne method to simulate an error during update
            sandbox.stub(db.Travels, 'findOne').throws(new Error('Database error'));

            const result = await updateTravel(mockTravelData);

            // Assertions
            expect(result).to.deep.equal({
                EM: 'Database error',
                EC: '1',
                DT: '',
            });
        });
    })
    describe('deleteTravel', () => {
        it('should delete travel successfully', async () => {
            // Mock data for the test
            const mockTravelId = 1;

            // Stub necessary methods to simulate the database queries
            sandbox.stub(db.Travels, 'findOne').resolves({ id: mockTravelId }); // Assuming the travel exists
            sandbox.stub(db.Travels, 'destroy').resolves(1); // Mock the destroy result

            const result = await deleteTravel(mockTravelId);

            // Assertions
            expect(result).to.deep.equal({
                EM: 'delete travel successfully',
                EC: '0',
                DT: '',
            });
        });

        it('should handle not found travel during deleteTravel', async () => {
            // Mock data for the test
            const mockTravelId = 1;

            // Stub the findOne method to simulate not finding the travel
            sandbox.stub(db.Travels, 'findOne').resolves(null);

            const result = await deleteTravel(mockTravelId);

            // Assertions
            expect(result).to.deep.equal({
                EM: 'not found travel',
                EC: '0',
                DT: '',
            });
        });

        it('should handle database error during deleteTravel', async () => {
            // Mock data for the test
            const mockTravelId = 1;

            // Stub necessary methods to simulate a database error
            sandbox.stub(db.Travels, 'findOne').throws(new Error('Database error'));

            const result = await deleteTravel(mockTravelId);

            // Assertions
            expect(result).to.deep.equal({
                EM: 'error deleting travel',
                EC: '1',
                DT: '',
            });
        });
    })

    // Add more test cases as needed for different scenarios
});


describe('Server', () => {
    it('should start the server without errors', async () => {
        const res = await chai.request(app).get('/');
        expect(res).to.have.status(200);
    }, 10000);
});


describe('Package Routes', () => {
    let createPackageStub;
    let getPackageWithPaginationStub;
    let getPackageByAddressListStub;
    let updatePackageStub;
    let deletePackageStub;

    beforeEach(() => {
        // Tạo một stub cho hàm createPackage của packageApiService
        createPackageStub = sinon.stub(packageApiService, 'createPackage');
        getPackageWithPaginationStub = sinon.stub(packageApiService, 'getPackageWithPagination');
        getPackageByAddressListStub = sinon.stub(packageApiService, 'getPackageByAddressList');
        updatePackageStub = sinon.stub(packageApiService, 'updatePackage');
        deletePackageStub = sinon.stub(packageApiService, 'deletePackage');

    });

    afterEach(() => {
        // Khôi phục trạng thái ban đầu của stub sau khi các unit test chạy xong
        createPackageStub.restore();
        getPackageWithPaginationStub.restore();
        getPackageByAddressListStub.restore();
        updatePackageStub.restore();
        deletePackageStub.restore();

    });

    describe('create', () => {

        it('should create a package successfully', async () => {
            // Mock data để trả về khi gọi hàm createPackage
            const mockPackageData = {
                packageName: 'Test Package',
                packageType: 'Type A',
                packageAddress: '123 Test Street',
                packageDescription: 'A test package',
            };

            const mockApiResponse = {
                EM: 'create package successfully',
                EC: '0',
                DT: mockPackageData,
            };

            // Thiết lập giá trị trả về cho stub
            createPackageStub.returns(mockApiResponse);

            // Gọi route API sử dụng chai-http
            const res = await chai.request(app).post('/api/package/create').send(mockPackageData);

            // Kiểm tra kết quả
            expect(res).to.have.status(200);
            expect(res.body).to.deep.equal(mockApiResponse);
        });

        it('should handle error during package creation', async () => {
            // Mock data để trả về khi có lỗi
            const mockErrorApiResponse = {
                EM: 'error from server',
                EC: '1',
                DT: '',
            };

            // Thiết lập giá trị trả về cho stub khi có lỗi
            createPackageStub.throws('Database error');

            // Gọi route API sử dụng chai-http
            const res = await chai.request(app).post('/api/package/create').send({ /* package data */ });

            // Kiểm tra kết quả
            expect(res).to.have.status(500);
            expect(res.body).to.deep.equal(mockErrorApiResponse);
        });
    })
    describe('read', () => {
        it('should get package with pagination', async () => {
            // Thiết lập giá trị trả về cho stub
            getPackageWithPaginationStub.returns({
                EM: 'get data successfully',
                EC: '0',
                DT: { totalRows: 2, totalPages: 1, packages: [{}, {}] },
            });

            // Gọi route API sử dụng chai-http
            const res = await chai.request(app).get('/api/package/read').query({ page: 1, limit: 10 });

            // Kiểm tra kết quả
            expect(res).to.have.status(200);
            expect(res.body).to.have.property('EM', 'get data successfully');
            expect(res.body).to.have.property('EC', '0');
            expect(res.body.DT).to.have.property('totalRows', 2);
            expect(res.body.DT).to.have.property('totalPages', 1);
            expect(res.body.DT).to.have.property('packages').to.be.an('array');
        });

        it('should handle error during get package with pagination', async () => {
            // Thiết lập giá trị trả về cho stub khi có lỗi
            getPackageWithPaginationStub.throws('Pagination error');

            // Gọi route API sử dụng chai-http
            const res = await chai.request(app).get('/api/package/read').query({ page: 1, limit: 10 });

            // Kiểm tra kết quả
            expect(res).to.have.status(500);
            expect(res.body).to.have.property('EM', 'error from server');
            expect(res.body).to.have.property('EC', '1');
        });
    })
    describe('read-by-address', () => {
        it('should read packages by address list successfully', async () => {
            // Tạo mock data để trả về khi gọi hàm getPackageByAddressList
            const mockAddressList = '123 Main Street|456 Second Street';
            const mockPackageData = [
                {
                    id: 1,
                    packageName: 'Package 1',
                    packageType: 'Type A',
                    packageAddress: '123 Main Street',
                    packageDescription: 'Description 1',
                },
                {
                    id: 2,
                    packageName: 'Package 2',
                    packageType: 'Type B',
                    packageAddress: '456 Second Street',
                    packageDescription: 'Description 2',
                },
            ];
            const mockApiResponse = {
                EM: 'get data successfully',
                EC: '0',
                DT: mockPackageData,
            };

            // Thiết lập giá trị trả về cho stub
            getPackageByAddressListStub.returns(mockApiResponse);

            // Gọi route API sử dụng chai-http
            const res = await chai.request(app).get(`/api/package/read-by-address?addressList=${encodeURIComponent(mockAddressList)}`);

            // Kiểm tra kết quả
            expect(res).to.have.status(200);
            expect(res.body).to.deep.equal(mockApiResponse);
        });

        it('should handle error during reading packages by address list', async () => {
            // Tạo mock data để trả về khi có lỗi
            const mockErrorApiResponse = {
                EM: 'error from server',
                EC: '1',
                DT: '',
            };

            // Thiết lập giá trị trả về cho stub khi có lỗi
            getPackageByAddressListStub.throws('Query error');

            // Gọi route API sử dụng chai-http
            const res = await chai.request(app).get('/api/package/read-by-address?addressList=invalidAddressList');

            // Kiểm tra kết quả
            expect(res).to.have.status(500);
            expect(res.body).to.deep.equal(mockErrorApiResponse);
        });
    })
    describe('update', () => {
        it('should update a package successfully', async () => {
            // Tạo mock data để trả về khi gọi hàm updatePackage
            const mockPackageData = {
                id: 1,
                packageName: 'Updated Package',
                packageType: 'Updated Type',
                packageAddress: 'Updated Address',
                packageDescription: 'Updated Description',
            };
            const mockApiResponse = {
                EM: 'update package successfully',
                EC: '0',
                DT: '',
            };

            // Thiết lập giá trị trả về cho stub
            updatePackageStub.returns(mockApiResponse);

            // Gọi route API sử dụng chai-http
            const res = await chai.request(app)
                .put('/api/package/update')
                .send(mockPackageData);

            // Kiểm tra kết quả
            expect(res).to.have.status(200);
            expect(res.body).to.deep.equal(mockApiResponse);
        });

        it('should handle error during package update', async () => {
            // Tạo mock data để trả về khi có lỗi
            const mockErrorApiResponse = {
                EM: 'error from server',
                EC: '1',
                DT: '',
            };

            // Thiết lập giá trị trả về cho stub khi có lỗi
            updatePackageStub.throws('Database error');

            // Gọi route API sử dụng chai-http
            const res = await chai.request(app)
                .put('/api/package/update')
                .send({ id: 1 }); // Truyền một dữ liệu không hợp lệ để gây ra lỗi

            // Kiểm tra kết quả
            expect(res).to.have.status(500);
            expect(res.body).to.deep.equal(mockErrorApiResponse);
        });
    })
    describe('delete', () => {

        it('should delete a package successfully', async () => {
            // Tạo mock data để trả về khi gọi hàm deletePackage
            const mockApiResponse = {
                EM: 'delete package successfully',
                EC: '0',
                DT: '',
            };

            // Thiết lập giá trị trả về cho stub
            deletePackageStub.returns(mockApiResponse);

            // Gọi route API sử dụng chai-http
            const res = await chai.request(app)
                .delete('/api/package/delete')
                .send({ id: 1 }); // Truyền một id hợp lệ để xóa gói tour

            // Kiểm tra kết quả
            expect(res).to.have.status(200);
            expect(res.body).to.deep.equal(mockApiResponse);
        });

        it('should handle error during package deletion', async () => {
            // Tạo mock data để trả về khi có lỗi
            const mockErrorApiResponse = {
                EM: 'error from server',
                EC: '1',
                DT: '',
            };

            // Thiết lập giá trị trả về cho stub khi có lỗi
            deletePackageStub.throws('Database error');

            // Gọi route API sử dụng chai-http
            const res = await chai.request(app)
                .delete('/api/package/delete')
                .send({ id: 1 }); // Truyền một id hợp lệ để gây ra lỗi

            // Kiểm tra kết quả
            expect(res).to.have.status(500);
            expect(res.body).to.deep.equal(mockErrorApiResponse);
        });
    })
});
const generateMockTourByIdData = (tourId) => {
    return {
        EM: 'get tour by id successfully',
        EC: '0',
        DT: {
            id: tourId,
            tourName: `Tour ${tourId}`,
            totalDay: 5,
            totalNight: 4,
            addressList: [`Location ${tourId}`],
            tourPrice: 1000,
            tourStatus: 'Active',
            mainImage: `main_image_url_${tourId}.jpg`,
            additionalImages: [
                `additional_image_url_${tourId}_1.jpg`,
                `additional_image_url_${tourId}_2.jpg`,
            ],
            tourSchedule: [
                [
                    { packageId: tourId, packageName: `Package ${tourId}` },
                    { packageId: tourId + 1, packageName: `Package ${tourId + 1}` },
                ],
                [
                    { packageId: tourId + 2, packageName: `Package ${tourId + 2}` },
                    { packageId: tourId + 3, packageName: `Package ${tourId + 3}` },
                ],
            ],
            daySummaries: [`Day ${tourId} Summary`],
        },
    };
};
const generateMockTourData = (page, limit) => {
    const totalRows = 20;
    const totalPages = Math.ceil(totalRows / limit);

    return {
        EM: 'get data successfully',
        EC: '0',
        DT: {
            totalRows,
            totalPages,
            tours: Array.from({ length: limit }, (_, index) => ({
                id: page * limit + index + 1,
                tourName: `Tour ${page * limit + index + 1}`,
                totalDay: 5,
                totalNight: 4,
                addressList: [`Location ${index + 1}`],
                tourPrice: 1000,
                tourStatus: 'Active',
                mainImage: `main_image_url_${index + 1}.jpg`,
                additionalImages: [
                    `additional_image_url_${index + 1}_1.jpg`,
                    `additional_image_url_${index + 1}_2.jpg`,
                ],
                tourSchedule: [
                    [
                        { packageId: index + 1, packageName: `Package ${index + 1}` },
                        { packageId: index + 2, packageName: `Package ${index + 2}` },
                    ],
                    [
                        { packageId: index + 3, packageName: `Package ${index + 3}` },
                        { packageId: index + 4, packageName: `Package ${index + 4}` },
                    ],
                ],
                daySummaries: [`Day ${index + 1} Summary`],
            })),
        },
    };
};

describe('Tour Controller', () => {
    let createTourStub;
    let updateTourStub;
    let getTourWithPaginationStub;
    let getTourByIdStub;
    let deleteTourStub;

    beforeEach(() => {
        // Tạo một stub cho hàm createTour và updateTour của tourApiService
        createTourStub = sinon.stub(tourApiService, 'createTour');
        updateTourStub = sinon.stub(tourApiService, 'updateTour');
        getTourWithPaginationStub = sinon.stub(tourApiService, 'getTourWithPagination');
        getTourByIdStub = sinon.stub(tourApiService, 'getTourById');
        deleteTourStub = sinon.stub(tourApiService, 'deleteTour');

    });

    afterEach(() => {
        // Khôi phục trạng thái ban đầu của stub sau khi các unit test chạy xong
        createTourStub.restore();
        updateTourStub.restore();
        getTourWithPaginationStub.restore();
        getTourByIdStub.restore();
        deleteTourStub.restore();

    });

    describe('create', () => {
        it('should create a tour successfully', async () => {
            // Tạo mock data để trả về khi gọi hàm createTour
            const mockTourData = {
                tourGeneralInformation: {
                    tourName: 'Test Tour',
                    totalDay: 5,
                    totalNight: 4,
                    addressList: 'Test Address',
                    tourPrice: 1000,
                    tourStatus: 'active',
                },
                mainImage: 'image_id_1',
                additionalImages: ['image_id_2', 'image_id_3'],
                tourSchedule: [[{ value: 'package_id_1' }]],
                daySummaries: ['Day 1 Summary'],
            };

            const mockApiResponse = {
                EM: 'create tour successfully',
                EC: '0',
                DT: '',
            };

            // Thiết lập giá trị trả về cho stub
            createTourStub.returns(mockApiResponse);

            // Gọi route API sử dụng chai-http
            const res = await chai.request(app)
                .post('/api/tour/create')
                .send(mockTourData);

            // Kiểm tra kết quả
            expect(res).to.have.status(200);
            expect(res.body).to.deep.equal(mockApiResponse);
        });

        it('should handle error during tour creation', async () => {
            // Tạo mock data để trả về khi có lỗi
            const mockTourData = {
                tourGeneralInformation: {
                    tourName: 'Test Tour',
                    totalDay: 5,
                    totalNight: 4,
                    addressList: 'Test Address',
                    tourPrice: 1000,
                    tourStatus: 'active',
                },
                mainImage: 'image_id_1',
                additionalImages: ['image_id_2', 'image_id_3'],
                tourSchedule: [[{ value: 'package_id_1' }]],
                daySummaries: ['Day 1 Summary'],
            };

            const mockErrorApiResponse = {
                EM: 'error from server',
                EC: '1',
                DT: '',
            };

            // Thiết lập giá trị trả về cho stub khi có lỗi
            createTourStub.throws('Database error');

            // Gọi route API sử dụng chai-http
            const res = await chai.request(app)
                .post('/api/tour/create')
                .send(mockTourData);

            // Kiểm tra kết quả
            expect(res).to.have.status(500);
            expect(res.body).to.deep.equal(mockErrorApiResponse);
        });

    })

    describe('update', () => {
        it('should update a tour successfully', async () => {
            // Tạo mock data để trả về khi gọi hàm updateTour
            const mockTourData = {
                id: 'tour_id_1',
                tourGeneralInformation: {
                    tourName: 'Updated Test Tour',
                    totalDay: 7,
                    totalNight: 6,
                    addressList: 'Updated Test Address',
                    tourPrice: 1500,
                    tourStatus: 'inactive',
                },
                mainImage: 'updated_image_id_1',
                additionalImages: ['updated_image_id_2', 'updated_image_id_3'],
                tourSchedule: [[{ value: 'updated_package_id_1' }]],
                daySummaries: ['Updated Day 1 Summary'],
            };

            const mockApiResponse = {
                EM: 'update package successfully',
                EC: '0',
                DT: '',
            };

            // Thiết lập giá trị trả về cho stub
            updateTourStub.returns(mockApiResponse);

            // Gọi route API sử dụng chai-http
            const res = await chai.request(app)
                .put('/api/tour/update')
                .send(mockTourData);

            // Kiểm tra kết quả
            expect(res).to.have.status(200);
            expect(res.body).to.deep.equal(mockApiResponse);
        });

        it('should handle error during tour update', async () => {
            // Tạo mock data để trả về khi có lỗi
            const mockTourData = {
                id: 'tour_id_1',
                tourGeneralInformation: {
                    tourName: 'Updated Test Tour',
                    totalDay: 7,
                    totalNight: 6,
                    addressList: 'Updated Test Address',
                    tourPrice: 1500,
                    tourStatus: 'inactive',
                },
                mainImage: 'updated_image_id_1',
                additionalImages: ['updated_image_id_2', 'updated_image_id_3'],
                tourSchedule: [[{ value: 'updated_package_id_1' }]],
                daySummaries: ['Updated Day 1 Summary'],
            };

            const mockErrorApiResponse = {
                EM: 'error from server',
                EC: '1',
                DT: '',
            };

            // Thiết lập giá trị trả về cho stub khi có lỗi
            updateTourStub.throws('Database error');

            // Gọi route API sử dụng chai-http
            const res = await chai.request(app)
                .put('/api/tour/update')
                .send(mockTourData);

            // Kiểm tra kết quả
            expect(res).to.have.status(500);
            expect(res.body).to.deep.equal(mockErrorApiResponse);
        });
    })

    describe('read', () => {
        it('should get paginated tour data successfully', async () => {
            const mockPage = 1;
            const mockLimit = 10;

            // Sử dụng hàm generateMockTourData để tạo dữ liệu giả mạo
            const mockApiResponse = generateMockTourData(mockPage, mockLimit);

            // Thiết lập giá trị trả về cho stub
            getTourWithPaginationStub.withArgs(mockPage, mockLimit).returns(mockApiResponse);

            // Gọi route API sử dụng chai-http
            const res = await chai.request(app)
                .get('/api/tour/read')
                .query({ page: mockPage, limit: mockLimit });

            // Kiểm tra kết quả
            expect(res).to.have.status(200);
            expect(res.body).to.deep.equal(mockApiResponse);
        });

    })

    describe('read-by-id', () => {
        it('should get tour by id successfully', async () => {
            const mockTourId = 1;

            // Sử dụng hàm generateMockTourByIdData để tạo dữ liệu giả mạo
            const mockApiResponse = generateMockTourByIdData(mockTourId);

            // Thiết lập giá trị trả về cho stub
            getTourByIdStub.withArgs(mockTourId).returns(mockApiResponse);

            // Gọi route API sử dụng chai-http
            const res = await chai.request(app)
                .get(`/api/tour/read-by-id?id=${mockTourId}`);

            // Kiểm tra kết quả
            expect(res).to.have.status(200);
            expect(res.body).to.deep.equal(mockApiResponse);
        });
    })

    describe('delete', () => {
        beforeEach(() => {
            // Thiết lập lại trạng thái của stub trước mỗi test case
            deleteTourStub.reset();
        });
        it('should delete tour successfully', async () => {
            const mockTourId = 1;

            // Tạo giả mạo cho hàm deleteTour trong tourApiService
            deleteTourStub.withArgs(mockTourId).returns({
                EM: 'delete tour successfully',
                EC: '0',
                DT: ''
            });

            // Gọi route API sử dụng chai-http
            const res = await chai.request(app)
                .delete('/api/tour/delete')
                .send({ id: mockTourId });

            // Kiểm tra kết quả
            expect(res).to.have.status(200);
            expect(res.body).to.deep.equal({
                EM: 'delete tour successfully',
                EC: '0',
                DT: ''
            });

            // Kiểm tra xem hàm deleteTour trong tourApiService đã được gọi đúng cách hay không
            sinon.assert.calledOnce(deleteTourStub);
            sinon.assert.calledWithExactly(deleteTourStub, mockTourId);
        });

        it('should handle error from server during tour deletion', async () => {
            const mockTourId = 1;

            // Tạo giả mạo cho hàm deleteTour trong tourApiService để mô phỏng lỗi
            deleteTourStub.withArgs(mockTourId).throws(new Error('Simulated error from server'));

            // Gọi route API sử dụng chai-http
            const res = await chai.request(app)
                .delete('/api/tour/delete')
                .send({ id: mockTourId });

            // Kiểm tra kết quả
            expect(res).to.have.status(500);
            expect(res.body).to.deep.equal({
                EM: 'error from server',
                EC: '1',
                DT: ''
            });

            // Kiểm tra xem hàm deleteTour trong tourApiService đã được gọi đúng cách hay không
            sinon.assert.calledOnce(deleteTourStub);
            sinon.assert.calledWithExactly(deleteTourStub, mockTourId);
        });

        it('should handle not found tour during deletion', async () => {
            const mockTourId = 1;

            // Tạo giả mạo cho hàm deleteTour trong tourApiService trả về không tìm thấy tour
            deleteTourStub.withArgs(mockTourId).returns({
                EM: 'not found tour',
                EC: '0',
                DT: ''
            });

            // Gọi route API sử dụng chai-http
            const res = await chai.request(app)
                .delete('/api/tour/delete')
                .send({ id: mockTourId });

            // Kiểm tra kết quả
            expect(res).to.have.status(200);
            expect(res.body).to.deep.equal({
                EM: 'not found tour',
                EC: '0',
                DT: ''
            });

            // Kiểm tra xem hàm deleteTour trong tourApiService đã được gọi đúng cách hay không
            sinon.assert.calledOnce(deleteTourStub);
            sinon.assert.calledWithExactly(deleteTourStub, mockTourId);
        });
    });


});

describe('Dashboard Controller', () => {
    describe('fetchTourPlanning', () => {
        let getTourPlanningStub;

        beforeEach(() => {
            getTourPlanningStub = sinon.stub(dashboardService, 'getTourPlanning');
        });

        afterEach(() => {
            getTourPlanningStub.restore();
        });

        it('should fetch tour planning count successfully', async () => {
            const mockApiResponse = {
                EM: 'get tour is planning successfully',
                EC: '0',
                DT: 5 // Replace with your expected count
            };

            getTourPlanningStub.returns(mockApiResponse);

            const res = await chai.request(app)
                .get('/api/tourplanning');

            expect(res).to.have.status(200);
            expect(res.body).to.deep.equal(mockApiResponse);
        });

        it('should handle error from server during fetchTourPlanning', async () => {
            const mockErrorApiResponse = {
                EM: 'error from server',
                EC: '1',
                DT: ''
            };

            getTourPlanningStub.throws('Simulated error from server');

            const res = await chai.request(app)
                .get('/api/tourplanning');

            expect(res).to.have.status(500);
            expect(res.body).to.deep.equal(mockErrorApiResponse);
        });
    });
});
describe('Login Controller', () => {
    let handleCompanyLoginStub;

    beforeEach(() => {
        handleCompanyLoginStub = sinon.stub(loginService, 'handleCompanyLogin');
    });

    afterEach(() => {
        handleCompanyLoginStub.restore();
    });

    describe('handleCompanyLogin', () => {
        it('should handle company login successfully', async () => {
            const mockUserData = {
                username: 'testuser',
                password: 'testpassword'
            };

            const mockApiResponse = {
                EM: 'Login successfully',
                EC: '0',
                DT: 'mockToken'
            };

            handleCompanyLoginStub.withArgs(mockUserData).returns(mockApiResponse);

            const res = await chai.request(app)
                .post('/api/company-login')
                .send(mockUserData);

            expect(res).to.have.status(200);
            expect(res.body).to.deep.equal(mockApiResponse);
        });

        // it('should handle error during company login', async () => {
        //     const mockUserData = {
        //         username: 'testuser',
        //         password: 'testpassword'
        //     };

        //     const mockErrorApiResponse = {
        //         EM: 'Error from server',
        //         EC: '1',
        //         DT: ''
        //     };

        //     handleCompanyLoginStub.withArgs(mockUserData).throws('Simulated error from server');

        //     const res = await chai.request(app)
        //         .post('/api/company-login')
        //         .send(mockUserData);

        //     expect(res).to.have.status(500);
        //     expect(res.body).to.deep.equal(mockErrorApiResponse);
        // });
    });
});
const generateMockTravelData = (page, limit) => {
    const totalRows = 30; // Số lượng dòng dữ liệu trong trang
    const totalPages = Math.ceil(totalRows / limit);

    const travels = [];
    for (let i = 1; i <= limit; i++) {
        const travel = {
            id: i + (page - 1) * limit, // Tạo id duy nhất cho từng dòng dữ liệu
            startLocation: `Start Location ${i}`,
            startDateTime: new Date().toISOString(),
            maxTicket: 100,
            remainTicket: 50,
            travelPrice: 500,
            discountId: i % 2 === 0 ? 1 : 2, // Chia lẻ để tạo sự đa dạng
            tourId: i,
        };
        travels.push(travel);
    }

    return {
        EM: 'get data successfully',
        EC: '0',
        DT: {
            totalRows: totalRows,
            totalPages: totalPages,
            travels: travels,
        },
    };
};

describe('Travel Controller', () => {
    let createTravelStub;
    let updateTravelStub;
    let getTravelWithPaginationStub;
    let getTravelByIdStub;
    let deleteTravelStub;

    beforeEach(() => {
        // Tạo một stub cho các hàm trong travelApiService
        createTravelStub = sinon.stub(travelApiService, 'createTravel');
        updateTravelStub = sinon.stub(travelApiService, 'updateTravel');
        getTravelWithPaginationStub = sinon.stub(travelApiService, 'getTravelWithPagination');
        getTravelByIdStub = sinon.stub(travelApiService, 'getTravelById');
        deleteTravelStub = sinon.stub(travelApiService, 'deleteTravel');
    });

    afterEach(() => {
        // Khôi phục trạng thái ban đầu của stub sau khi các unit test chạy xong
        createTravelStub.restore();
        updateTravelStub.restore();
        getTravelWithPaginationStub.restore();
        getTravelByIdStub.restore();
        deleteTravelStub.restore();
    });

    describe('create', () => {
        it('should create a travel successfully', async () => {
            // Tạo mock data để trả về khi gọi hàm createTravel
            const mockTravelData = {
                startLocation: 'Test Location',
                startDateTime: '2024-01-01T00:00:00.000Z',
                maxTicket: 100,
                remainTicket: 100,
                travelPrice: 500,
                discountId: 1,
                tourId: 1
            };

            const mockApiResponse = {
                EM: 'create travel successfully',
                EC: '0',
                DT: '',
            };

            // Thiết lập giá trị trả về cho stub
            createTravelStub.returns(mockApiResponse);

            // Gọi route API sử dụng chai-http
            const res = await chai.request(app)
                .post('/api/travel/create')
                .send(mockTravelData);

            // Kiểm tra kết quả
            expect(res).to.have.status(200);
            expect(res.body).to.deep.equal(mockApiResponse);
        });

        it('should handle error during travel creation', async () => {
            // Tạo mock data để trả về khi có lỗi
            const mockTravelData = {
                startLocation: 'Test Location',
                startDateTime: '2024-01-01T00:00:00.000Z',
                maxTicket: 100,
                remainTicket: 100,
                travelPrice: 500,
                discountId: 'discount_id_1',
                tourId: 'tour_id_1'
            };

            const mockErrorApiResponse = {
                EM: 'error from server',
                EC: '1',
                DT: '',
            };

            // Thiết lập giá trị trả về cho stub khi có lỗi
            createTravelStub.throws('Database error');

            // Gọi route API sử dụng chai-http
            const res = await chai.request(app)
                .post('/api/travel/create')
                .send(mockTravelData);

            // Kiểm tra kết quả
            expect(res).to.have.status(500);
            expect(res.body).to.deep.equal(mockErrorApiResponse);
        });
    });

    describe('read', () => {
        it('should get paginated travel data successfully', async () => {
            const mockPage = 1;
            const mockLimit = 10;

            // Sử dụng hàm generateMockTravelData để tạo dữ liệu giả mạo
            const mockApiResponse = generateMockTravelData(mockPage, mockLimit);

            // Thiết lập giá trị trả về cho stub
            getTravelWithPaginationStub.withArgs(mockPage, mockLimit).returns(mockApiResponse);

            // Gọi route API sử dụng chai-http
            const res = await chai.request(app)
                .get('/api/travel/read')
                .query({ page: mockPage, limit: mockLimit });

            // Kiểm tra kết quả
            expect(res).to.have.status(200);
            expect(res.body).to.deep.equal(mockApiResponse);
        });

        it('should handle error during travel data retrieval', async () => {
            const mockPage = 1;
            const mockLimit = 10;

            // Sử dụng hàm generateMockTravelData để tạo dữ liệu giả mạo
            const mockErrorApiResponse = {
                EM: 'error from server',
                EC: '1',
                DT: '',
            };

            // Thiết lập giá trị trả về cho stub khi có lỗi
            getTravelWithPaginationStub.withArgs(mockPage, mockLimit).throws('Database error');

            // Gọi route API sử dụng chai-http
            const res = await chai.request(app)
                .get('/api/travel/read')
                .query({ page: mockPage, limit: mockLimit });

            // Kiểm tra kết quả
            expect(res).to.have.status(500);
            expect(res.body).to.deep.equal(mockErrorApiResponse);
        });
    });

    describe('read-by-id', () => {
        it('should get travel by id successfully', async () => {
            const mockTravelId = 1;
            const mockApiResponse = {
                EM: 'get travel by id successfully',
                EC: '0',
                DT: {
                    id: mockTravelId,
                    startLocation: 'Test Location',
                    startDateTime: new Date().toISOString(),
                    maxTicket: 100,
                    remainTicket: 50,
                    travelPrice: 500,
                    discountId: 1,
                    tourId: 1,
                },
            };

            getTravelByIdStub.withArgs(mockTravelId).returns(mockApiResponse);

            const res = await chai.request(app)
                .get(`/api/travel/read-by-id?id=${mockTravelId}`);

            expect(res).to.have.status(200);
            expect(res.body).to.deep.equal(mockApiResponse);
        });

        it('should handle error during travel retrieval by id', async () => {
            const mockTravelId = 1;
            const mockErrorApiResponse = {
                EM: 'error from server',
                EC: '1',
                DT: '',
            };

            getTravelByIdStub.withArgs(mockTravelId).throws(new Error('Simulated error from server'));

            const res = await chai.request(app)
                .get(`/api/travel/read-by-id?id=${mockTravelId}`);

            expect(res).to.have.status(500);
            expect(res.body).to.deep.equal(mockErrorApiResponse);
        });
    });
    describe('update', () => {
        it('should update a travel successfully', async () => {
            const mockTravelData = {
                id: 1,
                startLocation: 'Updated Location',
                startDateTime: new Date().toISOString(),
                maxTicket: 120,
                remainTicket: 80,
                travelPrice: 600,
                discountId: 2,
                tourId: 2,
            };

            const mockApiResponse = {
                EM: 'update travel successfully',
                EC: '0',
                DT: '',
            };

            updateTravelStub.withArgs(mockTravelData).returns(mockApiResponse);

            const res = await chai.request(app)
                .put('/api/travel/update')
                .send(mockTravelData);

            expect(res).to.have.status(200);
            expect(res.body).to.deep.equal(mockApiResponse);
        });

        it('should handle error during travel update', async () => {
            const mockTravelData = {
                id: 1,
                startLocation: 'Updated Location',
                startDateTime: new Date().toISOString(),
                maxTicket: 120,
                remainTicket: 80,
                travelPrice: 600,
                discountId: 2,
                tourId: 2,
            };

            const mockErrorApiResponse = {
                EM: 'error from server',
                EC: '1',
                DT: '',
            };

            updateTravelStub.withArgs(mockTravelData).throws(new Error('Simulated error from server'));

            const res = await chai.request(app)
                .put('/api/travel/update')
                .send(mockTravelData);

            expect(res).to.have.status(500);
            expect(res.body).to.deep.equal(mockErrorApiResponse);
        });
    });
    describe('delete', () => {
        beforeEach(() => {
            deleteTravelStub.reset();
        });

        it('should delete travel successfully', async () => {
            const mockTravelId = 1;

            const mockApiResponse = {
                EM: 'delete travel successfully',
                EC: '0',
                DT: ''
            };

            deleteTravelStub.withArgs(mockTravelId).returns(mockApiResponse);

            const res = await chai.request(app)
                .delete('/api/travel/delete')
                .send({ id: mockTravelId });

            expect(res).to.have.status(200);
            expect(res.body).to.deep.equal(mockApiResponse);

            sinon.assert.calledOnce(deleteTravelStub);
            sinon.assert.calledWithExactly(deleteTravelStub, mockTravelId);
        });

        it('should handle error from server during travel deletion', async () => {
            const mockTravelId = 1;

            const mockErrorApiResponse = {
                EM: 'error from server',
                EC: '1',
                DT: ''
            };

            deleteTravelStub.withArgs(mockTravelId).throws(new Error('Simulated error from server'));

            const res = await chai.request(app)
                .delete('/api/travel/delete')
                .send({ id: mockTravelId });

            expect(res).to.have.status(500);
            expect(res.body).to.deep.equal(mockErrorApiResponse);

            sinon.assert.calledOnce(deleteTravelStub);
            sinon.assert.calledWithExactly(deleteTravelStub, mockTravelId);
        });

        it('should handle not found travel during deletion', async () => {
            const mockTravelId = 1;

            const mockNotFoundApiResponse = {
                EM: 'not found travel',
                EC: '0',
                DT: ''
            };

            deleteTravelStub.withArgs(mockTravelId).returns(mockNotFoundApiResponse);

            const res = await chai.request(app)
                .delete('/api/travel/delete')
                .send({ id: mockTravelId });

            expect(res).to.have.status(200);
            expect(res.body).to.deep.equal(mockNotFoundApiResponse);

            sinon.assert.calledOnce(deleteTravelStub);
            sinon.assert.calledWithExactly(deleteTravelStub, mockTravelId);
        });
    });
});

describe('Tour Package Controller', () => {
    let getAllTourPackageStub;

    beforeEach(() => {
        getAllTourPackageStub = sinon.stub(tourPackageApiService, 'getAllTourPackage');
    });

    afterEach(() => {
        getAllTourPackageStub.restore();
    });

    describe('readAllTourPackage', () => {
        beforeEach(() => {
            getAllTourPackageStub.reset();
        });

        it('should get all tour packages successfully', async () => {
            const mockApiResponse = {
                EM: 'get data successfully',
                EC: '0',
                DT: [{ id: 1, name: 'Tour Package 1' }, { id: 2, name: 'Tour Package 2' }]
            };

            getAllTourPackageStub.returns(mockApiResponse);

            const res = await chai.request(app)
                .get('/api/tourpackage/read')
                .send();

            expect(res).to.have.status(200);
            expect(res.body).to.deep.equal(mockApiResponse);

            sinon.assert.calledOnce(getAllTourPackageStub);
        });

        it('should handle error during tour package retrieval', async () => {
            const mockErrorApiResponse = {
                EM: 'error from server',
                EC: '1',
                DT: ''
            };

            getAllTourPackageStub.throws('Simulated database error');

            const res = await chai.request(app)
                .get('/api/tourpackage/read')
                .send();

            expect(res).to.have.status(500);
            expect(res.body).to.deep.equal(mockErrorApiResponse);

            sinon.assert.calledOnce(getAllTourPackageStub);
        });
    });
});
const generateMockBookingData = (page, limit) => {
    const totalRows = 30; // Số lượng dòng dữ liệu trong trang
    const totalPages = Math.ceil(totalRows / limit);

    const bookings = [];
    for (let i = 1; i <= limit; i++) {
        const booking = {
            id: i + (page - 1) * limit, // Tạo id duy nhất cho từng dòng dữ liệu
            customer: {
                id: i,
                name: `Customer ${i}`,
                email: `customer${i}@example.com`,
            },
            travel: {
                id: i,
                startLocation: `Start Location ${i}`,
                startDateTime: new Date().toISOString(),
                maxTicket: 100,
                remainTicket: 50,
                travelPrice: 500,
                discountId: i % 2 === 0 ? 1 : 2, // Chia lẻ để tạo sự đa dạng
                tourId: i,
            },
            bookingDateTime: new Date().toISOString(),
        };
        bookings.push(booking);
    }

    return {
        EM: 'get data successfully',
        EC: '0',
        DT: {
            totalRows: totalRows,
            totalPages: totalPages,
            bookings: bookings,
        },
    };
};

describe('Booking Controller', () => {
    let createBookingStub;
    let getBookingWithPaginationStub;
    let getBookingByIdStub;
    let updateBookingStub;
    let deleteBookingStub;

    beforeEach(() => {
        createBookingStub = sinon.stub(bookingApiService, 'createBooking');
        getBookingWithPaginationStub = sinon.stub(bookingApiService, 'getBookingWithPagination');
        getBookingByIdStub = sinon.stub(bookingApiService, 'getBookingById');
        updateBookingStub = sinon.stub(bookingApiService, 'updateBooking');
        deleteBookingStub = sinon.stub(bookingApiService, 'deleteBooking');
    });

    afterEach(() => {
        createBookingStub.restore();
        getBookingWithPaginationStub.restore();
        getBookingByIdStub.restore();
        updateBookingStub.restore();
        deleteBookingStub.restore();
    });

    describe('createBooking', () => {
        it('should create a booking successfully', async () => {
            const mockBookingData = {
                customer: {
                    customerName: 'John Doe',
                    customerPhone: '123456789',
                    customerGmail: 'john.doe@example.com',
                },
                exportInvoice: true,
                bookingStatus: 'Paid',
                bookingPrice: 500, // Specify the booking price as needed
                paymentNote: 'Payment received',
                paymentImage: 'payment_image_id', // Provide the ID of the payment image
                travelId: 1, // Specify the ID of the associated travel
                touristList: ['Tourist 1', 'Tourist 2'],
            };

            const mockApiResponse = {
                EM: 'create booking successfully',
                EC: '0',
                DT: mockBookingData,  // Provide the expected data for a successful response
            };

            // Stub the createBooking function to return the mockApiResponse
            createBookingStub.returns(mockApiResponse);

            // Make a request to the createBooking endpoint
            const res = await chai.request(app)
                .post('/api/booking/create')
                .send(mockBookingData);

            // Check the result
            expect(res).to.have.status(200);
            expect(res.body).to.deep.equal(mockApiResponse);
        });

        it('should handle error during booking creation', async () => {
            const mockBookingData = {
                customer: {
                    customerName: 'John Doe',
                    customerPhone: '123456789',
                    customerGmail: 'john.doe@example.com',
                },
                exportInvoice: true,
                bookingStatus: 'Paid',
                bookingPrice: 500, // Specify the booking price as needed
                paymentNote: 'Payment received',
                paymentImage: 'payment_image_id', // Provide the ID of the payment image
                travelId: 1, // Specify the ID of the associated travel
                touristList: ['Tourist 1', 'Tourist 2'],
            };

            const mockErrorApiResponse = {
                EM: 'error from server',
                EC: '1',
                DT: '',
            };

            // Stub the createBooking function to throw an error
            createBookingStub.throws('Simulated error from server');

            // Make a request to the createBooking endpoint
            const res = await chai.request(app)
                .post('/api/booking/create')
                .send(mockBookingData);

            // Check the result
            expect(res).to.have.status(500);
            expect(res.body).to.deep.equal(mockErrorApiResponse);
        });
    });

    describe('readBookingPagination', () => {
        it('should get paginated booking data successfully', async () => {
            // Tạo mock data để trả về khi gọi hàm getBookingWithPagination
            const mockPage = 1;
            const mockLimit = 10;
            const mockApiResponse = {
                EM: 'get data successfully',
                EC: '0',
                DT: {
                    totalRows: 30,
                    totalPages: 3,
                    bookings: generateMockBookingData(mockPage, mockLimit)
                },
            };

            // Thiết lập giá trị trả về cho stub
            getBookingWithPaginationStub.withArgs(mockPage, mockLimit).returns(mockApiResponse);

            // Gọi route API sử dụng chai-http
            const res = await chai.request(app)
                .get('/api/booking/read')
                .query({ page: mockPage, limit: mockLimit });

            // Kiểm tra kết quả
            expect(res).to.have.status(200);
            expect(res.body).to.deep.equal({
                EM: mockApiResponse.EM,
                EC: mockApiResponse.EC,
                DT: mockApiResponse.DT,
            });
        });

        it('should handle error during booking data retrieval', async () => {
            // Tạo mock data để trả về khi có lỗi
            const mockPage = 1;
            const mockLimit = 10;
            const mockErrorApiResponse = {
                EM: 'error from server',
                EC: '1',
                DT: '',
            };

            // Thiết lập giá trị trả về cho stub khi có lỗi
            getBookingWithPaginationStub.withArgs(mockPage, mockLimit).throws('Database error');

            // Gọi route API sử dụng chai-http
            const res = await chai.request(app)
                .get('/api/booking/read')
                .query({ page: mockPage, limit: mockLimit });

            // Kiểm tra kết quả
            expect(res).to.have.status(500);
            expect(res.body).to.deep.equal({
                EM: mockErrorApiResponse.EM,
                EC: mockErrorApiResponse.EC,
                DT: mockErrorApiResponse.DT,
            });
        });
    });


    describe('read-by-id', () => {
        it('should get booking by id successfully', async () => {
            const mockBookingId = 1;
            const mockApiResponse = {
                EM: 'get booking by id successfully',
                EC: '0',
                DT: {
                    id: mockBookingId,
                    customer: {
                        id: 1,
                        name: 'Test Customer',
                        email: 'test.customer@example.com',
                    },
                    travel: {
                        id: 1,
                        startLocation: 'Test Location',
                        startDateTime: new Date().toISOString(),
                        maxTicket: 100,
                        remainTicket: 50,
                        travelPrice: 500,
                        discountId: 1,
                        tourId: 1,
                    },
                    bookingDateTime: new Date().toISOString(),
                },
            };

            getBookingByIdStub.withArgs(mockBookingId).returns(mockApiResponse);

            const res = await chai.request(app)
                .get(`/api/booking/read-by-id?id=${mockBookingId}`);

            expect(res).to.have.status(200);
            expect(res.body).to.deep.equal(mockApiResponse);
        });

        it('should handle error during booking retrieval by id', async () => {
            const mockBookingId = 1;
            const mockErrorApiResponse = {
                EM: 'error from server',
                EC: '1',
                DT: '',
            };

            getBookingByIdStub.withArgs(mockBookingId).throws(new Error('Simulated error from server'));

            const res = await chai.request(app)
                .get(`/api/booking/read-by-id?id=${mockBookingId}`);

            expect(res).to.have.status(500);
            expect(res.body).to.deep.equal(mockErrorApiResponse);
        });
    });

    describe('update', () => {
        it('should update a booking successfully', async () => {
            const mockBookingData = {
                id: 1,
                exportInvoice: true,
                touristList: ['Tourist 1', 'Tourist 2'],
                bookingStatus: 'Confirmed',
                bookingPrice: 1000,
                paymentNote: 'Payment received',
                paymentImage: 'payment_image.jpg',
                travelId: 1,
            };

            const mockApiResponse = {
                EM: 'update booking successfully',
                EC: '0',
                DT: '',
            };

            updateBookingStub.withArgs(mockBookingData).returns(mockApiResponse);

            const res = await chai.request(app)
                .put('/api/booking/update')
                .send(mockBookingData);

            expect(res).to.have.status(200);
            expect(res.body).to.deep.equal(mockApiResponse);
        });

        it('should handle error during booking update', async () => {
            const mockBookingData = {
                id: 1,
                exportInvoice: true,
                touristList: ['Tourist 1', 'Tourist 2'],
                bookingStatus: 'Confirmed',
                bookingPrice: 1000,
                paymentNote: 'Payment received',
                paymentImage: 'payment_image.jpg',
                travelId: 1,
            };

            const mockErrorApiResponse = {
                EM: 'error from server',
                EC: '1',
                DT: '',
            };

            updateBookingStub.withArgs(mockBookingData).throws(new Error('Simulated error from server'));

            const res = await chai.request(app)
                .put('/api/booking/update')
                .send(mockBookingData);

            expect(res).to.have.status(500);
            expect(res.body).to.deep.equal(mockErrorApiResponse);
        });
    });

    describe('delete', () => {
        beforeEach(() => {
            deleteBookingStub.reset();
        });

        it('should delete booking successfully', async () => {
            const mockBookingId = 1;

            const mockApiResponse = {
                EM: 'delete booking successfully',
                EC: '0',
                DT: ''
            };

            deleteBookingStub.withArgs(mockBookingId).returns(mockApiResponse);

            const res = await chai.request(app)
                .delete('/api/booking/delete')
                .send({ id: mockBookingId });

            expect(res).to.have.status(200);
            expect(res.body).to.deep.equal(mockApiResponse);

            sinon.assert.calledOnce(deleteBookingStub);
            sinon.assert.calledWithExactly(deleteBookingStub, mockBookingId);
        });

        it('should handle error from server during booking deletion', async () => {
            const mockBookingId = 1;

            const mockErrorApiResponse = {
                EM: 'error from server',
                EC: '1',
                DT: ''
            };

            deleteBookingStub.withArgs(mockBookingId).throws(new Error('Simulated error from server'));

            const res = await chai.request(app)
                .delete('/api/booking/delete')
                .send({ id: mockBookingId });

            expect(res).to.have.status(500);
            expect(res.body).to.deep.equal(mockErrorApiResponse);

            sinon.assert.calledOnce(deleteBookingStub);
            sinon.assert.calledWithExactly(deleteBookingStub, mockBookingId);
        });

        it('should handle not found booking during deletion', async () => {
            const mockBookingId = 1;

            const mockNotFoundApiResponse = {
                EM: 'not found booking',
                EC: '0',
                DT: ''
            };

            deleteBookingStub.withArgs(mockBookingId).returns(mockNotFoundApiResponse);

            const res = await chai.request(app)
                .delete('/api/booking/delete')
                .send({ id: mockBookingId });

            expect(res).to.have.status(200);
            expect(res.body).to.deep.equal(mockNotFoundApiResponse);

            sinon.assert.calledOnce(deleteBookingStub);
            sinon.assert.calledWithExactly(deleteBookingStub, mockBookingId);
        });
    });
});


const generateMockCustomerData = (page, limit) => {
    const totalRows = 30; // Số lượng dòng dữ liệu trong trang
    const totalPages = Math.ceil(totalRows / limit);

    const customers = [];
    for (let i = 1; i <= limit; i++) {
        const customer = {
            id: i + (page - 1) * limit, // Tạo id duy nhất cho từng dòng dữ liệu
            customerName: `Customer ${i}`,
            customerGmail: `customer${i}@example.com`,
            customerPhone: `0${i}2345678`
            // Add other customer properties based on your schema
        };
        customers.push(customer);
    }

    return {
        EM: 'get data successfully',
        EC: '0',
        DT: {
            totalRows: totalRows,
            totalPages: totalPages,
            customers: customers,
        },
    };
};

describe('Customer Controller', () => {
    // Declare the stubs
    let getCustomerWithPaginationStub;
    let getCustomerByIdStub;
    let deleteCustomerStub;

    // Set up the stubs in the 'before' hook
    beforeEach(() => {
        getCustomerWithPaginationStub = sinon.stub(customerApiService, 'getCustomerWithPagination');
        getCustomerByIdStub = sinon.stub(customerApiService, 'getCustomerById');
        deleteCustomerStub = sinon.stub(customerApiService, 'deleteCustomer');
    });

    // Restore the stubs in the 'after' hook
    afterEach(() => {
        getCustomerWithPaginationStub.restore();
        getCustomerByIdStub.restore();
        deleteCustomerStub.restore();
    });

    // Your test cases go here

    // Example 'create' test case

    describe('read', () => {
        it('should get paginated customer data successfully', async () => {
            const mockPage = 1;
            const mockLimit = 10;

            const mockApiResponse = generateMockCustomerData(mockPage, mockLimit);

            getCustomerWithPaginationStub.withArgs(mockPage, mockLimit).returns(mockApiResponse);

            const res = await chai.request(app)
                .get('/api/customer/read')
                .query({ page: mockPage, limit: mockLimit });

            expect(res).to.have.status(200);
            expect(res.body).to.deep.equal(mockApiResponse);
        });

        it('should handle error during customer data retrieval', async () => {
            const mockPage = 1;
            const mockLimit = 10;

            const mockErrorApiResponse = {
                EM: 'error from server',
                EC: '1',
                DT: '',
            };

            getCustomerWithPaginationStub.withArgs(mockPage, mockLimit).throws('Database error');

            const res = await chai.request(app)
                .get('/api/customer/read')
                .query({ page: mockPage, limit: mockLimit });

            expect(res).to.have.status(500);
            expect(res.body).to.deep.equal(mockErrorApiResponse);
        });
    });

    describe('read-by-id', () => {
        it('should get customer by id successfully', async () => {
            const mockCustomerId = 1;
            const mockApiResponse = {
                EM: 'get customer by id successfully',
                EC: '0',
                DT: {
                    id: mockCustomerId,
                    customerName: 'Test Customer',
                    email: 'testcustomer@example.com',
                    // Add other customer properties based on your schema
                },
            };

            getCustomerByIdStub.withArgs(mockCustomerId).returns(mockApiResponse);

            const res = await chai.request(app)
                .get(`/api/customer/read-by-id?id=${mockCustomerId}`);

            expect(res).to.have.status(200);
            expect(res.body).to.deep.equal(mockApiResponse);
        });

        it('should handle error during customer retrieval by id', async () => {
            const mockCustomerId = 1;
            const mockErrorApiResponse = {
                EM: 'error from server',
                EC: '1',
                DT: '',
            };

            getCustomerByIdStub.withArgs(mockCustomerId).throws(new Error('Simulated error from server'));

            const res = await chai.request(app)
                .get(`/api/customer/read-by-id?id=${mockCustomerId}`);

            expect(res).to.have.status(500);
            expect(res.body).to.deep.equal(mockErrorApiResponse);
        });
    });

    describe('delete', () => {
        beforeEach(() => {
            deleteCustomerStub.reset();
        });

        it('should delete customer successfully', async () => {
            const mockCustomerId = 1;

            const mockApiResponse = {
                EM: 'delete customer successfully',
                EC: '0',
                DT: ''
            };

            deleteCustomerStub.withArgs(mockCustomerId).returns(mockApiResponse);

            const res = await chai.request(app)
                .delete('/api/customer/delete')
                .send({ id: mockCustomerId });

            expect(res).to.have.status(200);
            expect(res.body).to.deep.equal(mockApiResponse);

            sinon.assert.calledOnce(deleteCustomerStub);
            sinon.assert.calledWithExactly(deleteCustomerStub, mockCustomerId);
        });

        it('should handle error from server during customer deletion', async () => {
            const mockCustomerId = 1;

            const mockErrorApiResponse = {
                EM: 'error from server',
                EC: '1',
                DT: ''
            };

            deleteCustomerStub.withArgs(mockCustomerId).throws(new Error('Simulated error from server'));

            const res = await chai.request(app)
                .delete('/api/customer/delete')
                .send({ id: mockCustomerId });

            expect(res).to.have.status(500);
            expect(res.body).to.deep.equal(mockErrorApiResponse);

            sinon.assert.calledOnce(deleteCustomerStub);
            sinon.assert.calledWithExactly(deleteCustomerStub, mockCustomerId);
        });
    });
    // Add more test cases for other CRUD operations
});

const generateMockDiscountData = (page, limit) => {
    const totalRows = 30; // Số lượng dòng dữ liệu trong trang
    const totalPages = Math.ceil(totalRows / limit);

    const discounts = [];
    for (let i = 1; i <= limit; i++) {
        const discount = {
            id: i + (page - 1) * limit, // Tạo id duy nhất cho từng dòng dữ liệu
            discountName: `Discount ${i}`,
            discountType: 'Percentage', // Replace with your actual discount types
            discountAmount: 10, // Replace with your actual discount amounts
            discountDescription: `Description ${i}`,
            // Add other discount properties based on your schema
        };
        discounts.push(discount);
    }

    return {
        EM: 'get data successfully',
        EC: '0',
        DT: {
            totalRows: totalRows,
            totalPages: totalPages,
            discounts: discounts,
        },
    };
};

describe('Discount Controller', () => {
    let createDiscountStub;
    let updateDiscountStub;
    let getDiscountWithPaginationStub;
    let getDiscountByIdStub;
    let deleteDiscountStub;

    beforeEach(() => {
        createDiscountStub = sinon.stub(discountApiService, 'createDiscount');
        updateDiscountStub = sinon.stub(discountApiService, 'updateDiscount');
        getDiscountWithPaginationStub = sinon.stub(discountApiService, 'getDiscountWithPagination');
        getDiscountByIdStub = sinon.stub(discountApiService, 'getDiscountById');
        deleteDiscountStub = sinon.stub(discountApiService, 'deleteDiscount');
    });

    afterEach(() => {
        createDiscountStub.restore();
        updateDiscountStub.restore();
        getDiscountWithPaginationStub.restore();
        getDiscountByIdStub.restore();
        deleteDiscountStub.restore();
    });

    describe('create', () => {
        it('should create discount successfully', async () => {
            const mockRequestBody = {
                discountName: 'New Discount',
                discountType: 'Percentage',
                discountAmount: 15,
                discountDescription: 'Description for the new discount',
            };

            const mockApiResponse = {
                EM: 'create discount successfully',
                EC: '0',
                DT: {
                    id: 31, // Replace with the actual ID generated during creation
                    ...mockRequestBody,
                },
            };

            createDiscountStub.withArgs(mockRequestBody).returns(mockApiResponse);

            const res = await chai.request(app)
                .post('/api/discount/create')
                .send(mockRequestBody);

            expect(res).to.have.status(200);
            expect(res.body).to.deep.equal(mockApiResponse);
        });

        it('should handle error during discount creation', async () => {
            const mockRequestBody = {
                // Provide invalid or incomplete data to simulate an error
                discountType: 'Percentage',
                discountAmount: 15,
            };

            const mockErrorApiResponse = {
                EM: 'error from server',
                EC: '1',
                DT: '',
            };

            createDiscountStub.withArgs(mockRequestBody).throws('Database error');

            const res = await chai.request(app)
                .post('/api/discount/create')
                .send(mockRequestBody);

            expect(res).to.have.status(500);
            expect(res.body).to.deep.equal(mockErrorApiResponse);
        });
    });

    describe('read', () => {
        it('should get paginated discount data successfully', async () => {
            const mockPage = 1;
            const mockLimit = 10;

            const mockApiResponse = generateMockDiscountData(mockPage, mockLimit);

            getDiscountWithPaginationStub.withArgs(mockPage, mockLimit).returns(mockApiResponse);

            const res = await chai.request(app)
                .get('/api/discount/read')
                .query({ page: mockPage, limit: mockLimit });

            expect(res).to.have.status(200);
            expect(res.body).to.deep.equal(mockApiResponse);
        });

        it('should handle error during discount data retrieval', async () => {
            const mockPage = 1;
            const mockLimit = 10;

            const mockErrorApiResponse = {
                EM: 'error from server',
                EC: '1',
                DT: '',
            };

            getDiscountWithPaginationStub.withArgs(mockPage, mockLimit).throws('Database error');

            const res = await chai.request(app)
                .get('/api/discount/read')
                .query({ page: mockPage, limit: mockLimit });

            expect(res).to.have.status(500);
            expect(res.body).to.deep.equal(mockErrorApiResponse);
        });
    });

    describe('read-by-id', () => {
        it('should get discount by id successfully', async () => {
            const mockDiscountId = 1;
            const mockApiResponse = {
                EM: 'get discount by id successfully',
                EC: '0',
                DT: {
                    id: mockDiscountId,
                    discountName: 'Test Discount',
                    discountType: 'Percentage',
                    discountAmount: 10,
                    discountDescription: 'Test Description',
                    // Add other discount properties based on your schema
                },
            };

            getDiscountByIdStub.withArgs(mockDiscountId).returns(mockApiResponse);

            const res = await chai.request(app)
                .get(`/api/discount/read-by-id?id=${mockDiscountId}`);

            expect(res).to.have.status(200);
            expect(res.body).to.deep.equal(mockApiResponse);
        });

        it('should handle error during discount retrieval by id', async () => {
            const mockDiscountId = 1;
            const mockErrorApiResponse = {
                EM: 'error from server',
                EC: '1',
                DT: '',
            };

            getDiscountByIdStub.withArgs(mockDiscountId).throws(new Error('Simulated error from server'));

            const res = await chai.request(app)
                .get(`/api/discount/read-by-id?id=${mockDiscountId}`);

            expect(res).to.have.status(500);
            expect(res.body).to.deep.equal(mockErrorApiResponse);
        });
    });

    describe('update', () => {
        it('should update discount successfully', async () => {
            const mockRequestBody = {
                id: 1,
                discountName: 'Updated Discount',
                discountType: 'Fixed Amount',
                discountAmount: 25,
                discountDescription: 'Updated Description',
            };

            const mockApiResponse = {
                EM: 'update discount successfully',
                EC: '0',
                DT: '',
            };

            updateDiscountStub.withArgs(mockRequestBody).returns(mockApiResponse);

            const res = await chai.request(app)
                .put('/api/discount/update')
                .send(mockRequestBody);

            expect(res).to.have.status(200);
            expect(res.body).to.deep.equal(mockApiResponse);
        });

        it('should handle error during discount update', async () => {
            const mockRequestBody = {
                // Provide invalid or incomplete data to simulate an error
                discountName: 'Updated Discount',
                discountAmount: 25,
            };

            const mockErrorApiResponse = {
                EM: 'error from server',
                EC: '1',
                DT: '',
            };

            updateDiscountStub.withArgs(mockRequestBody).throws(new Error('Simulated error from server'));

            const res = await chai.request(app)
                .put('/api/discount/update')
                .send(mockRequestBody);

            expect(res).to.have.status(500);
            expect(res.body).to.deep.equal(mockErrorApiResponse);
        });
    });

    describe('delete', () => {
        it('should delete discount successfully', async () => {
            const mockDiscountId = 1;

            const mockApiResponse = {
                EM: 'delete discount successfully',
                EC: '0',
                DT: '',
            };

            deleteDiscountStub.withArgs(mockDiscountId).returns(mockApiResponse);

            const res = await chai.request(app)
                .delete('/api/discount/delete')
                .send({ id: mockDiscountId });

            expect(res).to.have.status(200);
            expect(res.body).to.deep.equal(mockApiResponse);
        });

        it('should handle error during discount deletion', async () => {
            const mockDiscountId = 1;

            const mockErrorApiResponse = {
                EM: 'error from server',
                EC: '1',
                DT: '',
            };

            deleteDiscountStub.withArgs(mockDiscountId).throws(new Error('Simulated error from server'));

            const res = await chai.request(app)
                .delete('/api/discount/delete')
                .send({ id: mockDiscountId });

            expect(res).to.have.status(500);
            expect(res.body).to.deep.equal(mockErrorApiResponse);
        });
    });
});


describe('JWTActions', () => {
    describe('createJWT', () => {
        it('should create a JWT token', () => {
            const payload = { userId: '12345' };
            const signStub = sinon.stub(jwt, 'sign').returns('fakeToken');

            const result = JWTActions.createJWT(payload);

            expect(result).to.equal('fakeToken');
            sinon.assert.calledOnceWithExactly(signStub, payload, process.env.JWT_SECRET);
            signStub.restore();
        });

        it('should return null if token creation fails', () => {
            const payload = { userId: '12345' };
            const signStub = sinon.stub(jwt, 'sign').throws(new Error('Token creation failed'));

            const result = JWTActions.createJWT(payload);

            expect(result).to.be.null;
            sinon.assert.calledOnceWithExactly(signStub, payload, process.env.JWT_SECRET);
            signStub.restore();
        });
    });

    describe('verifyToken', () => {
        it('should verify a JWT token', async () => {
            const token = 'fakeToken';
            const decodedToken = { userId: '12345' };

            // Stub the jwt.verify to resolve with decodedToken
            const verifyStub = sinon.stub(jwt, 'verify').callsFake((_, __, callback) => {
                process.nextTick(() => {
                    callback(null, decodedToken);
                });
            });

            try {
                const result = await JWTActions.verifyToken(token);
                expect(result).to.deep.equal(decodedToken);
                sinon.assert.calledOnceWithExactly(verifyStub, token, process.env.JWT_SECRET, sinon.match.func);
            } catch (error) {
                // Handle the error here
                console.error(error);
            } finally {
                verifyStub.restore(); // Restore the stub
            }
        });

        it('should return null if token verification fails', async () => {
            const token = 'fakeToken';

            // Stub the jwt.verify to reject with an error
            const verifyStub = sinon.stub(jwt, 'verify').callsFake((_, __, callback) => {
                process.nextTick(() => {
                    callback(new Error('Token verification failed'), null);
                });
            });

            try {
                const result = await JWTActions.verifyToken(token);
                expect(result).to.be.null;
                sinon.assert.calledOnceWithExactly(verifyStub, token, process.env.JWT_SECRET, sinon.match.func);
            } catch (error) {
                // Handle the error here
                console.error(error);
            } finally {
                verifyStub.restore(); // Restore the stub
            }
        });
    });
});

// end unit test