const chai = require('chai');
const sinon = require('sinon');
const chaiHttp = require('chai-http');
chai.use(require('sinon-chai'));
const expect = chai.expect;
chai.use(chaiHttp);
import app from '../../server';
import travelApiService from '../../services/travelApiService';
const generateMockTravelData = (page, limit) => {
    const totalRows = 30; // Số lượng dòng dữ liệu trong trang
    const totalPages = Math.ceil(totalRows / limit);

    const travels = [];
    for (let i = 1; i <= limit; i++) {
        const travel = {
            id: i + (page - 1) * limit, // Tạo id duy nhất cho từng dòng dữ liệu
            startLocation: `Start Location ${i}`,
            startDateTime: new Date().toISOString(),
            maxTicket: 100,
            remainTicket: 50,
            travelPrice: 500,
            discountId: i % 2 === 0 ? 1 : 2, // Chia lẻ để tạo sự đa dạng
            tourId: i,
        };
        travels.push(travel);
    }

    return {
        EM: 'get data successfully',
        EC: '0',
        DT: {
            totalRows: totalRows,
            totalPages: totalPages,
            travels: travels,
        },
    };
};

describe('Travel Controller', () => {
    let createTravelStub;
    let updateTravelStub;
    let getTravelWithPaginationStub;
    let getTravelByIdStub;
    let deleteTravelStub;

    beforeEach(() => {
        // Tạo một stub cho các hàm trong travelApiService
        createTravelStub = sinon.stub(travelApiService, 'createTravel');
        updateTravelStub = sinon.stub(travelApiService, 'updateTravel');
        getTravelWithPaginationStub = sinon.stub(travelApiService, 'getTravelWithPagination');
        getTravelByIdStub = sinon.stub(travelApiService, 'getTravelById');
        deleteTravelStub = sinon.stub(travelApiService, 'deleteTravel');
    });

    afterEach(() => {
        // Khôi phục trạng thái ban đầu của stub sau khi các unit test chạy xong
        createTravelStub.restore();
        updateTravelStub.restore();
        getTravelWithPaginationStub.restore();
        getTravelByIdStub.restore();
        deleteTravelStub.restore();
    });

    describe('create', () => {
        it('should create a travel successfully', async () => {
            // Tạo mock data để trả về khi gọi hàm createTravel
            const mockTravelData = {
                startLocation: 'Test Location',
                startDateTime: '2024-01-01T00:00:00.000Z',
                maxTicket: 100,
                remainTicket: 100,
                travelPrice: 500,
                discountId: 1,
                tourId: 1
            };

            const mockApiResponse = {
                EM: 'create travel successfully',
                EC: '0',
                DT: '',
            };

            // Thiết lập giá trị trả về cho stub
            createTravelStub.returns(mockApiResponse);

            // Gọi route API sử dụng chai-http
            const res = await chai.request(app)
                .post('/api/travel/create')
                .send(mockTravelData);

            // Kiểm tra kết quả
            expect(res).to.have.status(200);
            expect(res.body).to.deep.equal(mockApiResponse);
        });

        it('should handle error during travel creation', async () => {
            // Tạo mock data để trả về khi có lỗi
            const mockTravelData = {
                startLocation: 'Test Location',
                startDateTime: '2024-01-01T00:00:00.000Z',
                maxTicket: 100,
                remainTicket: 100,
                travelPrice: 500,
                discountId: 'discount_id_1',
                tourId: 'tour_id_1'
            };

            const mockErrorApiResponse = {
                EM: 'error from server',
                EC: '1',
                DT: '',
            };

            // Thiết lập giá trị trả về cho stub khi có lỗi
            createTravelStub.throws('Database error');

            // Gọi route API sử dụng chai-http
            const res = await chai.request(app)
                .post('/api/travel/create')
                .send(mockTravelData);

            // Kiểm tra kết quả
            expect(res).to.have.status(500);
            expect(res.body).to.deep.equal(mockErrorApiResponse);
        });
    });

    describe('read', () => {
        it('should get paginated travel data successfully', async () => {
            const mockPage = 1;
            const mockLimit = 10;

            // Sử dụng hàm generateMockTravelData để tạo dữ liệu giả mạo
            const mockApiResponse = generateMockTravelData(mockPage, mockLimit);

            // Thiết lập giá trị trả về cho stub
            getTravelWithPaginationStub.withArgs(mockPage, mockLimit).returns(mockApiResponse);

            // Gọi route API sử dụng chai-http
            const res = await chai.request(app)
                .get('/api/travel/read')
                .query({ page: mockPage, limit: mockLimit });

            // Kiểm tra kết quả
            expect(res).to.have.status(200);
            expect(res.body).to.deep.equal(mockApiResponse);
        });

        it('should handle error during travel data retrieval', async () => {
            const mockPage = 1;
            const mockLimit = 10;

            // Sử dụng hàm generateMockTravelData để tạo dữ liệu giả mạo
            const mockErrorApiResponse = {
                EM: 'error from server',
                EC: '1',
                DT: '',
            };

            // Thiết lập giá trị trả về cho stub khi có lỗi
            getTravelWithPaginationStub.withArgs(mockPage, mockLimit).throws('Database error');

            // Gọi route API sử dụng chai-http
            const res = await chai.request(app)
                .get('/api/travel/read')
                .query({ page: mockPage, limit: mockLimit });

            // Kiểm tra kết quả
            expect(res).to.have.status(500);
            expect(res.body).to.deep.equal(mockErrorApiResponse);
        });
    });

    describe('read-by-id', () => {
        it('should get travel by id successfully', async () => {
            const mockTravelId = 1;
            const mockApiResponse = {
                EM: 'get travel by id successfully',
                EC: '0',
                DT: {
                    id: mockTravelId,
                    startLocation: 'Test Location',
                    startDateTime: new Date().toISOString(),
                    maxTicket: 100,
                    remainTicket: 50,
                    travelPrice: 500,
                    discountId: 1,
                    tourId: 1,
                },
            };

            getTravelByIdStub.withArgs(mockTravelId).returns(mockApiResponse);

            const res = await chai.request(app)
                .get(`/api/travel/read-by-id?id=${mockTravelId}`);

            expect(res).to.have.status(200);
            expect(res.body).to.deep.equal(mockApiResponse);
        });

        it('should handle error during travel retrieval by id', async () => {
            const mockTravelId = 1;
            const mockErrorApiResponse = {
                EM: 'error from server',
                EC: '1',
                DT: '',
            };

            getTravelByIdStub.withArgs(mockTravelId).throws(new Error('Simulated error from server'));

            const res = await chai.request(app)
                .get(`/api/travel/read-by-id?id=${mockTravelId}`);

            expect(res).to.have.status(500);
            expect(res.body).to.deep.equal(mockErrorApiResponse);
        });
    });
    describe('update', () => {
        it('should update a travel successfully', async () => {
            const mockTravelData = {
                id: 1,
                startLocation: 'Updated Location',
                startDateTime: new Date().toISOString(),
                maxTicket: 120,
                remainTicket: 80,
                travelPrice: 600,
                discountId: 2,
                tourId: 2,
            };

            const mockApiResponse = {
                EM: 'update travel successfully',
                EC: '0',
                DT: '',
            };

            updateTravelStub.withArgs(mockTravelData).returns(mockApiResponse);

            const res = await chai.request(app)
                .put('/api/travel/update')
                .send(mockTravelData);

            expect(res).to.have.status(200);
            expect(res.body).to.deep.equal(mockApiResponse);
        });

        it('should handle error during travel update', async () => {
            const mockTravelData = {
                id: 1,
                startLocation: 'Updated Location',
                startDateTime: new Date().toISOString(),
                maxTicket: 120,
                remainTicket: 80,
                travelPrice: 600,
                discountId: 2,
                tourId: 2,
            };

            const mockErrorApiResponse = {
                EM: 'error from server',
                EC: '1',
                DT: '',
            };

            updateTravelStub.withArgs(mockTravelData).throws(new Error('Simulated error from server'));

            const res = await chai.request(app)
                .put('/api/travel/update')
                .send(mockTravelData);

            expect(res).to.have.status(500);
            expect(res.body).to.deep.equal(mockErrorApiResponse);
        });
    });
    describe('delete', () => {
        beforeEach(() => {
            deleteTravelStub.reset();
        });

        it('should delete travel successfully', async () => {
            const mockTravelId = 1;

            const mockApiResponse = {
                EM: 'delete travel successfully',
                EC: '0',
                DT: ''
            };

            deleteTravelStub.withArgs(mockTravelId).returns(mockApiResponse);

            const res = await chai.request(app)
                .delete('/api/travel/delete')
                .send({ id: mockTravelId });

            expect(res).to.have.status(200);
            expect(res.body).to.deep.equal(mockApiResponse);

            sinon.assert.calledOnce(deleteTravelStub);
            sinon.assert.calledWithExactly(deleteTravelStub, mockTravelId);
        });

        it('should handle error from server during travel deletion', async () => {
            const mockTravelId = 1;

            const mockErrorApiResponse = {
                EM: 'error from server',
                EC: '1',
                DT: ''
            };

            deleteTravelStub.withArgs(mockTravelId).throws(new Error('Simulated error from server'));

            const res = await chai.request(app)
                .delete('/api/travel/delete')
                .send({ id: mockTravelId });

            expect(res).to.have.status(500);
            expect(res.body).to.deep.equal(mockErrorApiResponse);

            sinon.assert.calledOnce(deleteTravelStub);
            sinon.assert.calledWithExactly(deleteTravelStub, mockTravelId);
        });

        it('should handle not found travel during deletion', async () => {
            const mockTravelId = 1;

            const mockNotFoundApiResponse = {
                EM: 'not found travel',
                EC: '0',
                DT: ''
            };

            deleteTravelStub.withArgs(mockTravelId).returns(mockNotFoundApiResponse);

            const res = await chai.request(app)
                .delete('/api/travel/delete')
                .send({ id: mockTravelId });

            expect(res).to.have.status(200);
            expect(res.body).to.deep.equal(mockNotFoundApiResponse);

            sinon.assert.calledOnce(deleteTravelStub);
            sinon.assert.calledWithExactly(deleteTravelStub, mockTravelId);
        });
    });
});