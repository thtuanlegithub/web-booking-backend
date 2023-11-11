// Import thư viện kiểm thử
const chai = require('chai');
const nock = require('nock');
const sequelize = require('sequelize')
nock.enableNetConnect(); // Kích hoạt intercepting network requests

const chaiHttp = require('chai-http');
const sinon = require('sinon');
import app from '../server';
import packageService from '../services/packageService'
import apiController from '../controller/apiController';
// Sử dụng Chai HTTP
chai.use(chaiHttp);
const expect = chai.expect;

describe('Server', () => {
    it('should start the server without errors', async () => {
        const res = await chai.request(app).get('/');
        expect(res).to.have.status(200);
    }, 10000);
});

describe('Rendered Page', () => {
    it('should render the home page', async () => {
        const res = await chai.request(app).get('/');
        expect(res).to.have.status(200);
        // Kiểm tra xem nội dung của trang có chứa html hay không
        expect(res.text).to.include('html');
        // Others
    }, 10000);

    it('should render package pages', async () => {
        // Kiểm tra trang Package
        const res = await chai.request(app).get('/package');
        expect(res).to.have.status(200);
        // Kiểm tra xem nội dung của trang có chứa các đoạn div hay không
        expect(res.text).to.include('<div>');
        // Kiểm tra các điều kiện khác tùy thuộc vào nhu cầu kiểm thử
    }, 10000);

    it('should render travel pages', async () => {
        // Kiểm tra trang Travel
        const res = await chai.request(app).get('/travel');
        expect(res).to.have.status(200);
        // Kiểm tra xem nội dung của trang có chứa các đoạn div hay không
        expect(res.text).to.include('<div>');
        // Kiểm tra các điều kiện khác tùy thuộc vào nhu cầu kiểm thử
    }, 10000);

    it('should render tour pages', async () => {
        // Kiểm tra trang Tour
        const res = await chai.request(app).get('/tour');
        expect(res).to.have.status(200);
        // Kiểm tra xem nội dung của trang có chứa các đoạn div hay không
        expect(res.text).to.include('<div>');
        // Kiểm tra các điều kiện khác tùy thuộc vào nhu cầu kiểm thử
    }, 10000);

    it('should render discount pages', async () => {
        // Kiểm tra trang Discount
        const res = await chai.request(app).get('/discount');
        expect(res).to.have.status(200);
        // Kiểm tra xem nội dung của trang có chứa các đoạn div hay không
        expect(res.text).to.include('<div>');
        // Kiểm tra các điều kiện khác tùy thuộc vào nhu cầu kiểm thử
    }, 10000);

    it('should render account pages', async () => {
        // Kiểm tra trang Account
        const res = await chai.request(app).get('/account');
        expect(res).to.have.status(200);
        // Kiểm tra xem nội dung của trang có chứa các đoạn div hay không
        expect(res.text).to.include('<div>');
        // Kiểm tra các điều kiện khác tùy thuộc vào nhu cầu kiểm thử
    }, 10000);

    it('should render booking pages', async () => {
        // Kiểm tra trang Booking
        const res = await chai.request(app).get('/booking');
        expect(res).to.have.status(200);
        // Kiểm tra xem nội dung của trang có chứa các đoạn div hay không
        expect(res.text).to.include('<div>');
        // Kiểm tra các điều kiện khác tùy thuộc vào nhu cầu kiểm thử
    }, 10000);

    it('should render invoice pages', async () => {
        // Kiểm tra trang Invoice
        const res = await chai.request(app).get('/invoice');
        expect(res).to.have.status(200);
        // Kiểm tra xem nội dung của trang có chứa các đoạn div hay không
        expect(res.text).to.include('<div>');
        // Kiểm tra các điều kiện khác tùy thuộc vào nhu cầu kiểm thử
    }, 10000);

    it('should render customer pages', async () => {
        // Kiểm tra trang Customer
        const res = await chai.request(app).get('/customer');
        expect(res).to.have.status(200);
        // Kiểm tra xem nội dung của trang có chứa các đoạn div hay không
        expect(res.text).to.include('<div>');
        // Kiểm tra các điều kiện khác tùy thuộc vào nhu cầu kiểm thử
    }, 10000);

    it('should render statistics pages', async () => {
        // Kiểm tra trang Statistics
        const res = await chai.request(app).get('/statistics');
        expect(res).to.have.status(200);
        // Kiểm tra xem nội dung của trang có chứa các đoạn div hay không
        expect(res.text).to.include('<div>');
        // Kiểm tra các điều kiện khác tùy thuộc vào nhu cầu kiểm thử
    }, 10000);
});
describe('API Routes', () => {
    describe('GET /api/package-data', () => {
        it('should return a list of packages', (done) => {
            chai.request(app)
                .get('/api/package-data')
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    // Add more assertions based on your specific response structure
                    done();
                });
        }, 10000);
        it('should handle server error', async () => {
            // Giả mạo hàm getAllPackageList để trả về một promise bị reject với error giả định
            const errorMock = new Error('Simulated server error');
            const getAllPackageListStub = sinon.stub(packageService, 'getAllPackageList').rejects(errorMock);

            // Tạo mock request và mock response
            const mockRequest = sinon.request;
            const mockResponse = {
                status: sinon.stub().returnsThis(),
                json: sinon.stub(),
            };

            // Gọi hàm kiểm thử với req và res giả mạo
            await apiController.getPackageList(mockRequest, mockResponse);

            // Kiểm tra các điều kiện mong muốn
            expect(mockResponse.status.calledWith(500)).to.be.true;
            expect(mockResponse.json.calledWith({
                EM: 'error from server',
                EC: '-1',
                DT: '',
            })).to.be.true;

            // Khôi phục hàm getAllPackageList để tránh ảnh hưởng đến các test case khác
            getAllPackageListStub.restore();
        });
    });
});