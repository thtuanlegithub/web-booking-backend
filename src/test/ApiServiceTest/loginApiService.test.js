const chai = require('chai');
const sinon = require('sinon');
const chaiHttp = require('chai-http');
chai.use(require('sinon-chai'));
const expect = chai.expect;
const db = require('../../models/index');
chai.use(chaiHttp);
const JWTActions = require('../../middleware/JWTActions');
const { handleCompanyLogin } = require('../../services/loginService');

describe('Login API Service', () => {
    let sandbox;

    beforeEach(() => {
        sandbox = sinon.createSandbox();
    });

    afterEach(() => {
        sandbox.restore();
    });

    describe('company login', () => {

        it('should handle company login successfully', async () => {
            // Mock data for the test
            const mockCompanyUserData = {
                username: 'testUser',
                password: 'testPassword',
            };

            // Stub the findOne method to simulate successful login
            sandbox.stub(db.CompanyAccounts, 'findOne').resolves({
                username: mockCompanyUserData.username,
                password: mockCompanyUserData.password,
                role: 'admin', // Assuming a role for testing
            });

            // Stub the createJWT method to simulate token creation
            const createJWTStub = sandbox.stub(JWTActions, 'createJWT').returns('mockToken');

            const result = await handleCompanyLogin(mockCompanyUserData);

            // Assertions
            expect(result).to.deep.equal({
                EM: 'Login successfully',
                EC: '0',
                DT: 'mockToken',
            });

            // Check if createJWT was called with the correct parameters
            sinon.assert.calledOnceWithExactly(createJWTStub, {
                username: mockCompanyUserData.username,
                role: 'admin', // Adjust based on your test case
                password: mockCompanyUserData.password,
            });
        });


        it('should handle wrong password during company login', async () => {
            // Mock data for the test
            const mockCompanyUserData = {
                username: 'testUser',
                password: 'wrongPassword',
            };

            // Stub the findOne method to simulate user found with wrong password
            sandbox.stub(db.CompanyAccounts, 'findOne').resolves({
                username: mockCompanyUserData.username,
                password: 'correctPassword', // Simulating a different password
                role: 'admin',
            });

            const result = await handleCompanyLogin(mockCompanyUserData);

            // Assertions
            expect(result).to.deep.equal({
                EM: 'Wrong password',
                EC: '0',
                DT: '',
            });
        });

        it('should handle not found user during company login', async () => {
            // Mock data for the test
            const mockCompanyUserData = {
                username: 'nonexistentUser',
                password: 'testPassword',
            };

            // Stub the findOne method to simulate user not found
            sandbox.stub(db.CompanyAccounts, 'findOne').resolves(null);

            const result = await handleCompanyLogin(mockCompanyUserData);

            // Assertions
            expect(result).to.deep.equal({
                EM: 'Not found user',
                EC: '0',
                DT: '',
            });
        });

        it('should handle error during company login', async () => {
            // Mock data for the test
            const mockCompanyUserData = {
                username: 'testUser',
                password: 'testPassword',
            };

            // Stub the findOne method to simulate an error during login
            const errorMock = new Error('Login error');
            sandbox.stub(db.CompanyAccounts, 'findOne').rejects(errorMock);

            const result = await handleCompanyLogin(mockCompanyUserData);

            // Assertions
            expect(result).to.deep.equal({
                EM: 'Error when login',
                EC: '1',
                DT: '',
            });
        });

    })

})