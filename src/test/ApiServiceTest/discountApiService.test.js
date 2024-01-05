const chai = require('chai');
const sinon = require('sinon');
const chaiHttp = require('chai-http');
chai.use(require('sinon-chai'));
const expect = chai.expect;
const db = require('../../models/index');
chai.use(chaiHttp);
const { createDiscount, getDiscountById, getDiscountWithPagination, updateDiscount, deleteDiscount } = require('../../services/discountApiService');

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