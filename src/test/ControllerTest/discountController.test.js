const chai = require('chai');
const sinon = require('sinon');
const chaiHttp = require('chai-http');
chai.use(require('sinon-chai'));
const expect = chai.expect;
const db = require('../../models/index');
chai.use(chaiHttp);
import app from '../../server';
const discountApiService = require('../../services/discountApiService');
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