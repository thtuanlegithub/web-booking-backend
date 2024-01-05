const chai = require('chai');
const sinon = require('sinon');
const chaiHttp = require('chai-http');
chai.use(require('sinon-chai'));
const expect = chai.expect;
const db = require('../../models/index');
chai.use(chaiHttp);
const { getCustomerWithPagination, deleteCustomer, getCustomerById } = require('../../services/customerApiService');

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