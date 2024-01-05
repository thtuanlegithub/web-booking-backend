const chai = require('chai');
const sinon = require('sinon');
const chaiHttp = require('chai-http');
chai.use(require('sinon-chai'));
const expect = chai.expect;
chai.use(chaiHttp);
import app from '../../server';
const tourPackageApiService = require('../../services/tourPackageApiService');

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