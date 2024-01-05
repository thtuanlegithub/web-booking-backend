const chai = require('chai');
const sinon = require('sinon');
const chaiHttp = require('chai-http');
chai.use(require('sinon-chai'));
const expect = chai.expect;
chai.use(chaiHttp);
import app from '../../server';
const bookingApiService = require('../../services/bookingApiService');

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