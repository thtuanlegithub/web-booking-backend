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
    });
});

describe('Rendered Page', () => {
    it('should log the server is running at the specified port', () => {
        const consoleLogStub = sinon.stub(console, 'log');

        startServer(8080);

        expect(consoleLogStub.calledOnce).to.be.true;
        expect(consoleLogStub.calledWith('>>> Server is running at port ', 8080)).to.be.true;

        consoleLogStub.restore();
    });
    it('should render the home page', async () => {
        const res = await chai.request(app).get('/');
        expect(res).to.have.status(200);
        // Kiểm tra xem nội dung của trang có chứa html hay không
        expect(res.text).to.include('html');
        // Others
    });

    it('should render package pages', async () => {
        // Kiểm tra trang Package
        const res = await chai.request(app).get('/package');
        expect(res).to.have.status(200);
        // Kiểm tra xem nội dung của trang có chứa các đoạn div hay không
        expect(res.text).to.include('<div>');
        // Kiểm tra các điều kiện khác tùy thuộc vào nhu cầu kiểm thử
    });

    it('should render travel pages', async () => {
        // Kiểm tra trang Travel
        const res = await chai.request(app).get('/travel');
        expect(res).to.have.status(200);
        // Kiểm tra xem nội dung của trang có chứa các đoạn div hay không
        expect(res.text).to.include('<div>');
        // Kiểm tra các điều kiện khác tùy thuộc vào nhu cầu kiểm thử
    });

    it('should render tour pages', async () => {
        // Kiểm tra trang Tour
        const res = await chai.request(app).get('/tour');
        expect(res).to.have.status(200);
        // Kiểm tra xem nội dung của trang có chứa các đoạn div hay không
        expect(res.text).to.include('<div>');
        // Kiểm tra các điều kiện khác tùy thuộc vào nhu cầu kiểm thử
    });

    it('should render discount pages', async () => {
        // Kiểm tra trang Discount
        const res = await chai.request(app).get('/discount');
        expect(res).to.have.status(200);
        // Kiểm tra xem nội dung của trang có chứa các đoạn div hay không
        expect(res.text).to.include('<div>');
        // Kiểm tra các điều kiện khác tùy thuộc vào nhu cầu kiểm thử
    });

    it('should render account pages', async () => {
        // Kiểm tra trang Account
        const res = await chai.request(app).get('/account');
        expect(res).to.have.status(200);
        // Kiểm tra xem nội dung của trang có chứa các đoạn div hay không
        expect(res.text).to.include('<div>');
        // Kiểm tra các điều kiện khác tùy thuộc vào nhu cầu kiểm thử
    });

    it('should render booking pages', async () => {
        // Kiểm tra trang Booking
        const res = await chai.request(app).get('/booking');
        expect(res).to.have.status(200);
        // Kiểm tra xem nội dung của trang có chứa các đoạn div hay không
        expect(res.text).to.include('<div>');
        // Kiểm tra các điều kiện khác tùy thuộc vào nhu cầu kiểm thử
    });

    it('should render invoice pages', async () => {
        // Kiểm tra trang Invoice
        const res = await chai.request(app).get('/invoice');
        expect(res).to.have.status(200);
        // Kiểm tra xem nội dung của trang có chứa các đoạn div hay không
        expect(res.text).to.include('<div>');
        // Kiểm tra các điều kiện khác tùy thuộc vào nhu cầu kiểm thử
    });

    it('should render customer pages', async () => {
        // Kiểm tra trang Customer
        const res = await chai.request(app).get('/customer');
        expect(res).to.have.status(200);
        // Kiểm tra xem nội dung của trang có chứa các đoạn div hay không
        expect(res.text).to.include('<div>');
        // Kiểm tra các điều kiện khác tùy thuộc vào nhu cầu kiểm thử
    });

    it('should render statistics pages', async () => {
        // Kiểm tra trang Statistics
        const res = await chai.request(app).get('/statistics');
        expect(res).to.have.status(200);
        // Kiểm tra xem nội dung của trang có chứa các đoạn div hay không
        expect(res.text).to.include('<div>');
        // Kiểm tra các điều kiện khác tùy thuộc vào nhu cầu kiểm thử
    });
});

describe('API Routes', () => {
    describe('GET /api/package-data', () => {
        it('should return a list of packages', (done) => {
            chai.request(app)
                .get('/api/package-data')
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    expect(res.body).to.be.an('array'); // Assuming the response is an array of packages
                    // Add more assertions based on your specific response structure

                    done();
                });
        });
    });
});