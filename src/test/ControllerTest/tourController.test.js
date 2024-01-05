const chai = require('chai');
const sinon = require('sinon');
const chaiHttp = require('chai-http');
chai.use(require('sinon-chai'));
const expect = chai.expect;
const db = require('../../models/index');
chai.use(chaiHttp);
import app from '../../server';
const tourApiService = require('../../services/tourApiService');

const generateMockTourByIdData = (tourId) => {
    return {
        EM: 'get tour by id successfully',
        EC: '0',
        DT: {
            id: tourId,
            tourName: `Tour ${tourId}`,
            totalDay: 5,
            totalNight: 4,
            addressList: [`Location ${tourId}`],
            tourPrice: 1000,
            tourStatus: 'Active',
            mainImage: `main_image_url_${tourId}.jpg`,
            additionalImages: [
                `additional_image_url_${tourId}_1.jpg`,
                `additional_image_url_${tourId}_2.jpg`,
            ],
            tourSchedule: [
                [
                    { packageId: tourId, packageName: `Package ${tourId}` },
                    { packageId: tourId + 1, packageName: `Package ${tourId + 1}` },
                ],
                [
                    { packageId: tourId + 2, packageName: `Package ${tourId + 2}` },
                    { packageId: tourId + 3, packageName: `Package ${tourId + 3}` },
                ],
            ],
            daySummaries: [`Day ${tourId} Summary`],
        },
    };
};
const generateMockTourData = (page, limit) => {
    const totalRows = 20;
    const totalPages = Math.ceil(totalRows / limit);

    return {
        EM: 'get data successfully',
        EC: '0',
        DT: {
            totalRows,
            totalPages,
            tours: Array.from({ length: limit }, (_, index) => ({
                id: page * limit + index + 1,
                tourName: `Tour ${page * limit + index + 1}`,
                totalDay: 5,
                totalNight: 4,
                addressList: [`Location ${index + 1}`],
                tourPrice: 1000,
                tourStatus: 'Active',
                mainImage: `main_image_url_${index + 1}.jpg`,
                additionalImages: [
                    `additional_image_url_${index + 1}_1.jpg`,
                    `additional_image_url_${index + 1}_2.jpg`,
                ],
                tourSchedule: [
                    [
                        { packageId: index + 1, packageName: `Package ${index + 1}` },
                        { packageId: index + 2, packageName: `Package ${index + 2}` },
                    ],
                    [
                        { packageId: index + 3, packageName: `Package ${index + 3}` },
                        { packageId: index + 4, packageName: `Package ${index + 4}` },
                    ],
                ],
                daySummaries: [`Day ${index + 1} Summary`],
            })),
        },
    };
};

describe('Tour Controller', () => {
    let createTourStub;
    let updateTourStub;
    let getTourWithPaginationStub;
    let getTourByIdStub;
    let deleteTourStub;

    beforeEach(() => {
        // Tạo một stub cho hàm createTour và updateTour của tourApiService
        createTourStub = sinon.stub(tourApiService, 'createTour');
        updateTourStub = sinon.stub(tourApiService, 'updateTour');
        getTourWithPaginationStub = sinon.stub(tourApiService, 'getTourWithPagination');
        getTourByIdStub = sinon.stub(tourApiService, 'getTourById');
        deleteTourStub = sinon.stub(tourApiService, 'deleteTour');

    });

    afterEach(() => {
        // Khôi phục trạng thái ban đầu của stub sau khi các unit test chạy xong
        createTourStub.restore();
        updateTourStub.restore();
        getTourWithPaginationStub.restore();
        getTourByIdStub.restore();
        deleteTourStub.restore();

    });

    describe('create', () => {
        it('should create a tour successfully', async () => {
            // Tạo mock data để trả về khi gọi hàm createTour
            const mockTourData = {
                tourGeneralInformation: {
                    tourName: 'Test Tour',
                    totalDay: 5,
                    totalNight: 4,
                    addressList: 'Test Address',
                    tourPrice: 1000,
                    tourStatus: 'active',
                },
                mainImage: 'image_id_1',
                additionalImages: ['image_id_2', 'image_id_3'],
                tourSchedule: [[{ value: 'package_id_1' }]],
                daySummaries: ['Day 1 Summary'],
            };

            const mockApiResponse = {
                EM: 'create tour successfully',
                EC: '0',
                DT: '',
            };

            // Thiết lập giá trị trả về cho stub
            createTourStub.returns(mockApiResponse);

            // Gọi route API sử dụng chai-http
            const res = await chai.request(app)
                .post('/api/tour/create')
                .send(mockTourData);

            // Kiểm tra kết quả
            expect(res).to.have.status(200);
            expect(res.body).to.deep.equal(mockApiResponse);
        });

        it('should handle error during tour creation', async () => {
            // Tạo mock data để trả về khi có lỗi
            const mockTourData = {
                tourGeneralInformation: {
                    tourName: 'Test Tour',
                    totalDay: 5,
                    totalNight: 4,
                    addressList: 'Test Address',
                    tourPrice: 1000,
                    tourStatus: 'active',
                },
                mainImage: 'image_id_1',
                additionalImages: ['image_id_2', 'image_id_3'],
                tourSchedule: [[{ value: 'package_id_1' }]],
                daySummaries: ['Day 1 Summary'],
            };

            const mockErrorApiResponse = {
                EM: 'error from server',
                EC: '1',
                DT: '',
            };

            // Thiết lập giá trị trả về cho stub khi có lỗi
            createTourStub.throws('Database error');

            // Gọi route API sử dụng chai-http
            const res = await chai.request(app)
                .post('/api/tour/create')
                .send(mockTourData);

            // Kiểm tra kết quả
            expect(res).to.have.status(500);
            expect(res.body).to.deep.equal(mockErrorApiResponse);
        });

    })

    describe('update', () => {
        it('should update a tour successfully', async () => {
            // Tạo mock data để trả về khi gọi hàm updateTour
            const mockTourData = {
                id: 'tour_id_1',
                tourGeneralInformation: {
                    tourName: 'Updated Test Tour',
                    totalDay: 7,
                    totalNight: 6,
                    addressList: 'Updated Test Address',
                    tourPrice: 1500,
                    tourStatus: 'inactive',
                },
                mainImage: 'updated_image_id_1',
                additionalImages: ['updated_image_id_2', 'updated_image_id_3'],
                tourSchedule: [[{ value: 'updated_package_id_1' }]],
                daySummaries: ['Updated Day 1 Summary'],
            };

            const mockApiResponse = {
                EM: 'update package successfully',
                EC: '0',
                DT: '',
            };

            // Thiết lập giá trị trả về cho stub
            updateTourStub.returns(mockApiResponse);

            // Gọi route API sử dụng chai-http
            const res = await chai.request(app)
                .put('/api/tour/update')
                .send(mockTourData);

            // Kiểm tra kết quả
            expect(res).to.have.status(200);
            expect(res.body).to.deep.equal(mockApiResponse);
        });

        it('should handle error during tour update', async () => {
            // Tạo mock data để trả về khi có lỗi
            const mockTourData = {
                id: 'tour_id_1',
                tourGeneralInformation: {
                    tourName: 'Updated Test Tour',
                    totalDay: 7,
                    totalNight: 6,
                    addressList: 'Updated Test Address',
                    tourPrice: 1500,
                    tourStatus: 'inactive',
                },
                mainImage: 'updated_image_id_1',
                additionalImages: ['updated_image_id_2', 'updated_image_id_3'],
                tourSchedule: [[{ value: 'updated_package_id_1' }]],
                daySummaries: ['Updated Day 1 Summary'],
            };

            const mockErrorApiResponse = {
                EM: 'error from server',
                EC: '1',
                DT: '',
            };

            // Thiết lập giá trị trả về cho stub khi có lỗi
            updateTourStub.throws('Database error');

            // Gọi route API sử dụng chai-http
            const res = await chai.request(app)
                .put('/api/tour/update')
                .send(mockTourData);

            // Kiểm tra kết quả
            expect(res).to.have.status(500);
            expect(res.body).to.deep.equal(mockErrorApiResponse);
        });
    })

    describe('read', () => {
        it('should get paginated tour data successfully', async () => {
            const mockPage = 1;
            const mockLimit = 10;

            // Sử dụng hàm generateMockTourData để tạo dữ liệu giả mạo
            const mockApiResponse = generateMockTourData(mockPage, mockLimit);

            // Thiết lập giá trị trả về cho stub
            getTourWithPaginationStub.withArgs(mockPage, mockLimit).returns(mockApiResponse);

            // Gọi route API sử dụng chai-http
            const res = await chai.request(app)
                .get('/api/tour/read')
                .query({ page: mockPage, limit: mockLimit });

            // Kiểm tra kết quả
            expect(res).to.have.status(200);
            expect(res.body).to.deep.equal(mockApiResponse);
        });

    })

    describe('read-by-id', () => {
        it('should get tour by id successfully', async () => {
            const mockTourId = 1;

            // Sử dụng hàm generateMockTourByIdData để tạo dữ liệu giả mạo
            const mockApiResponse = generateMockTourByIdData(mockTourId);

            // Thiết lập giá trị trả về cho stub
            getTourByIdStub.withArgs(mockTourId).returns(mockApiResponse);

            // Gọi route API sử dụng chai-http
            const res = await chai.request(app)
                .get(`/api/tour/read-by-id?id=${mockTourId}`);

            // Kiểm tra kết quả
            expect(res).to.have.status(200);
            expect(res.body).to.deep.equal(mockApiResponse);
        });
    })

    describe('delete', () => {
        beforeEach(() => {
            // Thiết lập lại trạng thái của stub trước mỗi test case
            deleteTourStub.reset();
        });
        it('should delete tour successfully', async () => {
            const mockTourId = 1;

            // Tạo giả mạo cho hàm deleteTour trong tourApiService
            deleteTourStub.withArgs(mockTourId).returns({
                EM: 'delete tour successfully',
                EC: '0',
                DT: ''
            });

            // Gọi route API sử dụng chai-http
            const res = await chai.request(app)
                .delete('/api/tour/delete')
                .send({ id: mockTourId });

            // Kiểm tra kết quả
            expect(res).to.have.status(200);
            expect(res.body).to.deep.equal({
                EM: 'delete tour successfully',
                EC: '0',
                DT: ''
            });

            // Kiểm tra xem hàm deleteTour trong tourApiService đã được gọi đúng cách hay không
            sinon.assert.calledOnce(deleteTourStub);
            sinon.assert.calledWithExactly(deleteTourStub, mockTourId);
        });

        it('should handle error from server during tour deletion', async () => {
            const mockTourId = 1;

            // Tạo giả mạo cho hàm deleteTour trong tourApiService để mô phỏng lỗi
            deleteTourStub.withArgs(mockTourId).throws(new Error('Simulated error from server'));

            // Gọi route API sử dụng chai-http
            const res = await chai.request(app)
                .delete('/api/tour/delete')
                .send({ id: mockTourId });

            // Kiểm tra kết quả
            expect(res).to.have.status(500);
            expect(res.body).to.deep.equal({
                EM: 'error from server',
                EC: '1',
                DT: ''
            });

            // Kiểm tra xem hàm deleteTour trong tourApiService đã được gọi đúng cách hay không
            sinon.assert.calledOnce(deleteTourStub);
            sinon.assert.calledWithExactly(deleteTourStub, mockTourId);
        });

        it('should handle not found tour during deletion', async () => {
            const mockTourId = 1;

            // Tạo giả mạo cho hàm deleteTour trong tourApiService trả về không tìm thấy tour
            deleteTourStub.withArgs(mockTourId).returns({
                EM: 'not found tour',
                EC: '0',
                DT: ''
            });

            // Gọi route API sử dụng chai-http
            const res = await chai.request(app)
                .delete('/api/tour/delete')
                .send({ id: mockTourId });

            // Kiểm tra kết quả
            expect(res).to.have.status(200);
            expect(res.body).to.deep.equal({
                EM: 'not found tour',
                EC: '0',
                DT: ''
            });

            // Kiểm tra xem hàm deleteTour trong tourApiService đã được gọi đúng cách hay không
            sinon.assert.calledOnce(deleteTourStub);
            sinon.assert.calledWithExactly(deleteTourStub, mockTourId);
        });
    });


});