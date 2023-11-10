// Import thư viện kiểm thử
const chai = require('chai');
const chaiHttp = require('chai-http');
const sinon = require('sinon');
import app from '../server';
import packageService from '../services/packageService'
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
    });
});