const chai = require('chai');
const sinon = require('sinon');
const chaiHttp = require('chai-http');
chai.use(require('sinon-chai'));
const expect = chai.expect;
chai.use(chaiHttp);
import app from '../../server';
const loginService = require('../../services/loginService');

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

        it('should handle error during company login', async () => {
            const mockUserData = {
                username: 'testuser',
                password: 'testpassword'
            };

            const mockErrorApiResponse = {
                EM: 'Error from server',
                EC: '1',
                DT: ''
            };

            handleCompanyLoginStub.withArgs(mockUserData).throws('Simulated error from server');

            const res = await chai.request(app)
                .post('/api/company-login')
                .send(mockUserData);

            expect(res).to.have.status(500);
            expect(res.body).to.deep.equal(mockErrorApiResponse);
        });
    });
});