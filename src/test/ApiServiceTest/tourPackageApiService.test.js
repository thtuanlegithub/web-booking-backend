const chai = require('chai');
const sinon = require('sinon');
const chaiHttp = require('chai-http');
chai.use(require('sinon-chai'));
const expect = chai.expect;
const db = require('../../models/index');
chai.use(chaiHttp);
const { getAllTourPackage } = require('../../services/tourPackageApiService');

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
