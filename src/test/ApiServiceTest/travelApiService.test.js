const chai = require('chai');
const sinon = require('sinon');
const chaiHttp = require('chai-http');
chai.use(require('sinon-chai'));
const expect = chai.expect;
const db = require('../../models/index');
chai.use(chaiHttp);
const { createTravel, getTravelWithPagination, updateTravel, deleteTravel, getTravelById } = require('../../services/travelApiService');

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
