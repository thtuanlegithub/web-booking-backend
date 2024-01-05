const chai = require('chai');
const sinon = require('sinon');
const chaiHttp = require('chai-http');
chai.use(require('sinon-chai'));
const expect = chai.expect;
chai.use(chaiHttp);
import app from '../../server';
const customerApiService = require('../../services/customerApiService');

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