const chai = require('chai');
const sinon = require('sinon');
const chaiHttp = require('chai-http');
chai.use(require('sinon-chai'));
const expect = chai.expect;
chai.use(chaiHttp);
import app from '../../server';
const dashboardService = require('../../services/dashboardService');

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