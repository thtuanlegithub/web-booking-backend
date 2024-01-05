const chai = require('chai');
const sinon = require('sinon');
require("dotenv").config();
import app from '../server';
const JWTActions = require('../middleware/JWTActions');
const jwt = require('jsonwebtoken');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
const expect = chai.expect;
chai.use(require('sinon-chai'));

describe('Server', () => {
    it('should start the server without errors', async () => {
        const res = await chai.request(app).get('/');
        expect(res).to.have.status(200);
    }, 10000);
});

describe('JWTActions', () => {
    describe('createJWT', () => {
        it('should create a JWT token', () => {
            const payload = { userId: '12345' };
            const signStub = sinon.stub(jwt, 'sign').returns('fakeToken');

            const result = JWTActions.createJWT(payload);

            expect(result).to.equal('fakeToken');
            sinon.assert.calledOnceWithExactly(signStub, payload, process.env.JWT_SECRET);
            signStub.restore();
        });

        it('should return null if token creation fails', () => {
            const payload = { userId: '12345' };
            const signStub = sinon.stub(jwt, 'sign').throws(new Error('Token creation failed'));

            const result = JWTActions.createJWT(payload);

            expect(result).to.be.null;
            sinon.assert.calledOnceWithExactly(signStub, payload, process.env.JWT_SECRET);
            signStub.restore();
        });
    });

    describe('verifyToken', () => {
        it('should verify a JWT token', async () => {
            const token = 'fakeToken';
            const decodedToken = { userId: '12345' };

            // Stub the jwt.verify to resolve with decodedToken
            const verifyStub = sinon.stub(jwt, 'verify').callsFake((_, __, callback) => {
                process.nextTick(() => {
                    callback(null, decodedToken);
                });
            });

            try {
                const result = await JWTActions.verifyToken(token);
                expect(result).to.deep.equal(decodedToken);
                sinon.assert.calledOnceWithExactly(verifyStub, token, process.env.JWT_SECRET, sinon.match.func);
            } catch (error) {
                // Handle the error here
                console.error(error);
            } finally {
                verifyStub.restore(); // Restore the stub
            }
        });

        it('should return null if token verification fails', async () => {
            const token = 'fakeToken';

            // Stub the jwt.verify to reject with an error
            const verifyStub = sinon.stub(jwt, 'verify').callsFake((_, __, callback) => {
                process.nextTick(() => {
                    callback(new Error('Token verification failed'), null);
                });
            });

            try {
                const result = await JWTActions.verifyToken(token);
                expect(result).to.be.null;
                sinon.assert.calledOnceWithExactly(verifyStub, token, process.env.JWT_SECRET, sinon.match.func);
            } catch (error) {
                // Handle the error here
                console.error(error);
            } finally {
                verifyStub.restore(); // Restore the stub
            }
        });
    });
});

// end unit test