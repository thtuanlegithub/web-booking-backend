const chai = require('chai');
const sinon = require('sinon');
const chaiHttp = require('chai-http');
chai.use(require('sinon-chai'));
const expect = chai.expect;
chai.use(chaiHttp);
import app from '../../server';
const packageApiService = require('../../services/packageApiService');

describe('Package Routes', () => {
    let createPackageStub;
    let getPackageWithPaginationStub;
    let getPackageByAddressListStub;
    let updatePackageStub;
    let deletePackageStub;

    beforeEach(() => {
        // Tạo một stub cho hàm createPackage của packageApiService
        createPackageStub = sinon.stub(packageApiService, 'createPackage');
        getPackageWithPaginationStub = sinon.stub(packageApiService, 'getPackageWithPagination');
        getPackageByAddressListStub = sinon.stub(packageApiService, 'getPackageByAddressList');
        updatePackageStub = sinon.stub(packageApiService, 'updatePackage');
        deletePackageStub = sinon.stub(packageApiService, 'deletePackage');

    });

    afterEach(() => {
        // Khôi phục trạng thái ban đầu của stub sau khi các unit test chạy xong
        createPackageStub.restore();
        getPackageWithPaginationStub.restore();
        getPackageByAddressListStub.restore();
        updatePackageStub.restore();
        deletePackageStub.restore();

    });

    describe('create', () => {

        it('should create a package successfully', async () => {
            // Mock data để trả về khi gọi hàm createPackage
            const mockPackageData = {
                packageName: 'Test Package',
                packageType: 'Type A',
                packageAddress: '123 Test Street',
                packageDescription: 'A test package',
            };

            const mockApiResponse = {
                EM: 'create package successfully',
                EC: '0',
                DT: mockPackageData,
            };

            // Thiết lập giá trị trả về cho stub
            createPackageStub.returns(mockApiResponse);

            // Gọi route API sử dụng chai-http
            const res = await chai.request(app).post('/api/package/create').send(mockPackageData);

            // Kiểm tra kết quả
            expect(res).to.have.status(200);
            expect(res.body).to.deep.equal(mockApiResponse);
        });

        it('should handle error during package creation', async () => {
            // Mock data để trả về khi có lỗi
            const mockErrorApiResponse = {
                EM: 'error from server',
                EC: '1',
                DT: '',
            };

            // Thiết lập giá trị trả về cho stub khi có lỗi
            createPackageStub.throws('Database error');

            // Gọi route API sử dụng chai-http
            const res = await chai.request(app).post('/api/package/create').send({ /* package data */ });

            // Kiểm tra kết quả
            expect(res).to.have.status(500);
            expect(res.body).to.deep.equal(mockErrorApiResponse);
        });
    })
    describe('read', () => {
        it('should get package with pagination', async () => {
            // Thiết lập giá trị trả về cho stub
            getPackageWithPaginationStub.returns({
                EM: 'get data successfully',
                EC: '0',
                DT: { totalRows: 2, totalPages: 1, packages: [{}, {}] },
            });

            // Gọi route API sử dụng chai-http
            const res = await chai.request(app).get('/api/package/read').query({ page: 1, limit: 10 });

            // Kiểm tra kết quả
            expect(res).to.have.status(200);
            expect(res.body).to.have.property('EM', 'get data successfully');
            expect(res.body).to.have.property('EC', '0');
            expect(res.body.DT).to.have.property('totalRows', 2);
            expect(res.body.DT).to.have.property('totalPages', 1);
            expect(res.body.DT).to.have.property('packages').to.be.an('array');
        });

        it('should handle error during get package with pagination', async () => {
            // Thiết lập giá trị trả về cho stub khi có lỗi
            getPackageWithPaginationStub.throws('Pagination error');

            // Gọi route API sử dụng chai-http
            const res = await chai.request(app).get('/api/package/read').query({ page: 1, limit: 10 });

            // Kiểm tra kết quả
            expect(res).to.have.status(500);
            expect(res.body).to.have.property('EM', 'error from server');
            expect(res.body).to.have.property('EC', '1');
        });
    })
    describe('read-by-address', () => {
        it('should read packages by address list successfully', async () => {
            // Tạo mock data để trả về khi gọi hàm getPackageByAddressList
            const mockAddressList = '123 Main Street|456 Second Street';
            const mockPackageData = [
                {
                    id: 1,
                    packageName: 'Package 1',
                    packageType: 'Type A',
                    packageAddress: '123 Main Street',
                    packageDescription: 'Description 1',
                },
                {
                    id: 2,
                    packageName: 'Package 2',
                    packageType: 'Type B',
                    packageAddress: '456 Second Street',
                    packageDescription: 'Description 2',
                },
            ];
            const mockApiResponse = {
                EM: 'get data successfully',
                EC: '0',
                DT: mockPackageData,
            };

            // Thiết lập giá trị trả về cho stub
            getPackageByAddressListStub.returns(mockApiResponse);

            // Gọi route API sử dụng chai-http
            const res = await chai.request(app).get(`/api/package/read-by-address?addressList=${encodeURIComponent(mockAddressList)}`);

            // Kiểm tra kết quả
            expect(res).to.have.status(200);
            expect(res.body).to.deep.equal(mockApiResponse);
        });

        it('should handle error during reading packages by address list', async () => {
            // Tạo mock data để trả về khi có lỗi
            const mockErrorApiResponse = {
                EM: 'error from server',
                EC: '1',
                DT: '',
            };

            // Thiết lập giá trị trả về cho stub khi có lỗi
            getPackageByAddressListStub.throws('Query error');

            // Gọi route API sử dụng chai-http
            const res = await chai.request(app).get('/api/package/read-by-address?addressList=invalidAddressList');

            // Kiểm tra kết quả
            expect(res).to.have.status(500);
            expect(res.body).to.deep.equal(mockErrorApiResponse);
        });
    })
    describe('update', () => {
        it('should update a package successfully', async () => {
            // Tạo mock data để trả về khi gọi hàm updatePackage
            const mockPackageData = {
                id: 1,
                packageName: 'Updated Package',
                packageType: 'Updated Type',
                packageAddress: 'Updated Address',
                packageDescription: 'Updated Description',
            };
            const mockApiResponse = {
                EM: 'update package successfully',
                EC: '0',
                DT: '',
            };

            // Thiết lập giá trị trả về cho stub
            updatePackageStub.returns(mockApiResponse);

            // Gọi route API sử dụng chai-http
            const res = await chai.request(app)
                .put('/api/package/update')
                .send(mockPackageData);

            // Kiểm tra kết quả
            expect(res).to.have.status(200);
            expect(res.body).to.deep.equal(mockApiResponse);
        });

        it('should handle error during package update', async () => {
            // Tạo mock data để trả về khi có lỗi
            const mockErrorApiResponse = {
                EM: 'error from server',
                EC: '1',
                DT: '',
            };

            // Thiết lập giá trị trả về cho stub khi có lỗi
            updatePackageStub.throws('Database error');

            // Gọi route API sử dụng chai-http
            const res = await chai.request(app)
                .put('/api/package/update')
                .send({ id: 1 }); // Truyền một dữ liệu không hợp lệ để gây ra lỗi

            // Kiểm tra kết quả
            expect(res).to.have.status(500);
            expect(res.body).to.deep.equal(mockErrorApiResponse);
        });
    })
    describe('delete', () => {

        it('should delete a package successfully', async () => {
            // Tạo mock data để trả về khi gọi hàm deletePackage
            const mockApiResponse = {
                EM: 'delete package successfully',
                EC: '0',
                DT: '',
            };

            // Thiết lập giá trị trả về cho stub
            deletePackageStub.returns(mockApiResponse);

            // Gọi route API sử dụng chai-http
            const res = await chai.request(app)
                .delete('/api/package/delete')
                .send({ id: 1 }); // Truyền một id hợp lệ để xóa gói tour

            // Kiểm tra kết quả
            expect(res).to.have.status(200);
            expect(res.body).to.deep.equal(mockApiResponse);
        });

        it('should handle error during package deletion', async () => {
            // Tạo mock data để trả về khi có lỗi
            const mockErrorApiResponse = {
                EM: 'error from server',
                EC: '1',
                DT: '',
            };

            // Thiết lập giá trị trả về cho stub khi có lỗi
            deletePackageStub.throws('Database error');

            // Gọi route API sử dụng chai-http
            const res = await chai.request(app)
                .delete('/api/package/delete')
                .send({ id: 1 }); // Truyền một id hợp lệ để gây ra lỗi

            // Kiểm tra kết quả
            expect(res).to.have.status(500);
            expect(res.body).to.deep.equal(mockErrorApiResponse);
        });
    })
});