const chai = require('chai');
const sinon = require('sinon');
const chaiHttp = require('chai-http');
chai.use(require('sinon-chai'));
const expect = chai.expect;
const db = require('../../models/index');
chai.use(chaiHttp);
const { getPackageById, getPackageWithPagination, getPackageByAddressList, createPackage, updatePackage, deletePackage } = require('../../services/packageApiService');

describe('Package API Service', () => {
    let sandbox;

    beforeEach(() => {
        sandbox = sinon.createSandbox();
    });

    afterEach(() => {
        sandbox.restore();
    });

    describe('getPackageById', () => {
        it('should get package by id successfully', async () => {
            const mockPackageData = { id: 1, packageName: 'Package 1', packageType: 'Type A', packageAddress: 'Address A', packageDescription: 'Description A' };

            sandbox.stub(db.Packages, 'findOne').resolves(mockPackageData);

            const result = await getPackageById(1);

            expect(result).to.deep.equal({
                EM: 'Get Package sucessfully',
                EC: 0,
                DT: mockPackageData,
            });
        });

        it('should handle error during getPackageById', async () => {
            const errorMock = new Error('Database error');
            sandbox.stub(db.Packages, 'findOne').rejects(errorMock);

            const result = await getPackageById(1);

            expect(result).to.deep.equal({
                EM: 'Database error',
                EC: 1,
                DT: '',
            });
        });
    });

    describe('getPackageWithPagination', () => {
        it('should get paginated packages successfully', async () => {
            // Mock data for the test
            const mockPackageData = [
                { id: 1, packageName: 'Package 1', packageType: 'Type A', packageAddress: 'Address A', packageDescription: 'Description A' },
                { id: 2, packageName: 'Package 2', packageType: 'Type B', packageAddress: 'Address B', packageDescription: 'Description B' },
            ];

            const mockCount = 10;

            // Stub the findAndCountAll method to simulate a successful paginated query
            sandbox.stub(db.Packages, 'findAndCountAll').resolves({
                count: mockCount,
                rows: mockPackageData,
            });

            const result = await getPackageWithPagination(2, 5);

            // Assertions
            expect(result).to.deep.equal({
                EM: 'get data successfully',
                EC: '0',
                DT: {
                    totalRows: mockCount,
                    totalPages: 2,
                    packages: mockPackageData,
                },
            });
        });

        it('should handle error during getPackageWithPagination', async () => {
            // Stub the findAndCountAll method to simulate an error during pagination
            sandbox.stub(db.Packages, 'findAndCountAll').rejects(new Error('Pagination error'));

            const result = await getPackageWithPagination(2, 5);

            // Assertions
            expect(result).to.deep.equal({
                EM: 'Pagination error',
                EC: '1',
                DT: '',
            });
        });
    });

    describe('getPackageByAddressList', () => {
        it('should get packages by address list successfully', async () => {
            // Mock data for the test
            const mockAddressList = 'Address A|Address B|Address C';
            const mockPackageData = [
                { id: 1, packageName: 'Package 1', packageType: 'Type A', packageAddress: 'Address A', packageDescription: 'Description A' },
                { id: 2, packageName: 'Package 2', packageType: 'Type B', packageAddress: 'Address B', packageDescription: 'Description B' },
            ];

            // Stub the findAll method to simulate a successful query by address list
            sandbox.stub(db.Packages, 'findAll').resolves(mockPackageData);

            const result = await getPackageByAddressList(mockAddressList);

            // Assertions
            expect(result).to.deep.equal({
                EM: 'get data successfully',
                EC: '0',
                DT: mockPackageData,
            });
        });

        it('should handle empty address list', async () => {
            const result = await getPackageByAddressList('');

            // Assertions
            expect(result).to.deep.equal({
                EM: 'get data successfully',
                EC: '0',
                DT: [],
            });
        });

        it('should handle error during getPackageByAddressList', async () => {
            // Stub the findAll method to simulate an error during query
            sandbox.stub(db.Packages, 'findAll').rejects(new Error('Query error'));

            const result = await getPackageByAddressList('Address A|Address B');

            // Assertions
            expect(result).to.deep.equal({
                EM: 'Query error',
                EC: '1',
                DT: '',
            });
        });
    });

    describe('createPackage', () => {
        it('should create a package successfully', async () => {
            // Mock data for the test
            const mockPackageData = {
                packageName: 'Test Package',
                packageType: 'Test Type',
                packageAddress: 'Test Address',
                packageDescription: 'Test Description',
            };

            // Stub the create method to simulate a successful package creation
            sandbox.stub(db.Packages, 'create').resolves(mockPackageData);

            const result = await createPackage(mockPackageData);

            // Assertions
            expect(result).to.deep.equal({
                EM: 'create package successfully',
                EC: '0',
                DT: mockPackageData,
            });
        });

        it('should handle error during package creation', async () => {
            // Mock data for the test
            const mockPackageData = {
                packageName: 'Test Package',
                packageType: 'Test Type',
                packageAddress: 'Test Address',
                packageDescription: 'Test Description',
            };

            // Stub the create method to simulate an error during package creation
            sandbox.stub(db.Packages, 'create').rejects(new Error('Creation error'));

            const result = await createPackage(mockPackageData);

            // Assertions
            expect(result).to.deep.equal({
                EM: 'database error',
                EC: '1',
                DT: '',
            });
        });
    });

    describe('updatePackage', () => {
        it('should update a package successfully', async () => {
            // Mock data for the test
            const mockPackageData = {
                id: 1,
                packageName: 'Updated Package',
                packageType: 'Updated Type',
                packageAddress: 'Updated Address',
                packageDescription: 'Updated Description',
            };

            // Stub the findOne and update methods to simulate a successful package update
            sandbox.stub(db.Packages, 'findOne').resolves({ id: 1 }); // Assuming package with id: 1 exists
            sandbox.stub(db.Packages, 'update').resolves([1]); // Number of rows updated

            const result = await updatePackage(mockPackageData);

            // Assertions
            expect(result).to.deep.equal({
                EM: 'update package successfully',
                EC: '0',
                DT: '',
            });
        });

        it('should handle error when updating a package', async () => {
            // Mock data for the test
            const mockPackageData = {
                id: 1,
                packageName: 'Updated Package',
                packageType: 'Updated Type',
                packageAddress: 'Updated Address',
                packageDescription: 'Updated Description',
            };

            // Stub the findOne and update methods to simulate an error during package update
            sandbox.stub(db.Packages, 'findOne').rejects(new Error('Database error'));
            sandbox.stub(db.Packages, 'update').rejects(new Error('Update error'));

            const result = await updatePackage(mockPackageData);

            // Assertions
            expect(result).to.deep.equal({
                EM: 'Database error',
                EC: '1',
                DT: '',
            });
        });

        it('should handle not found package during update', async () => {
            // Mock data for the test
            const mockPackageData = {
                id: 1,
                packageName: 'Updated Package',
                packageType: 'Updated Type',
                packageAddress: 'Updated Address',
                packageDescription: 'Updated Description',
            };

            // Stub the findOne method to simulate not finding the package
            sandbox.stub(db.Packages, 'findOne').resolves(null);

            const result = await updatePackage(mockPackageData);

            // Assertions
            expect(result).to.deep.equal({
                EM: 'not found package',
                EC: '0',
                DT: '',
            });
        });
    });

    describe('deletePackage', () => {
        it('should delete a package successfully', async () => {
            // Mock data for the test
            const packageId = 1;

            // Stub the findOne and destroy methods to simulate a successful package deletion
            sandbox.stub(db.Packages, 'findOne').resolves({ id: packageId }); // Assuming package with id: 1 exists
            sandbox.stub(db.Packages, 'destroy').resolves(1); // Number of rows deleted

            const result = await deletePackage(packageId);

            // Assertions
            expect(result).to.deep.equal({
                EM: 'delete package successfully',
                EC: '0',
                DT: '',
            });
        });

        it('should handle error when deleting a package', async () => {
            // Mock data for the test
            const packageId = 1;

            // Stub the findOne and destroy methods to simulate an error during package deletion
            sandbox.stub(db.Packages, 'findOne').rejects(new Error('Database error'));
            sandbox.stub(db.Packages, 'destroy').rejects(new Error('Delete error'));

            const result = await deletePackage(packageId);

            // Assertions
            expect(result).to.deep.equal({
                EM: 'Database error',
                EC: '1',
                DT: '',
            });
        });

        it('should handle not found package during deletion', async () => {
            // Mock data for the test
            const packageId = 1;

            // Stub the findOne method to simulate not finding the package
            sandbox.stub(db.Packages, 'findOne').resolves(null);

            const result = await deletePackage(packageId);

            // Assertions
            expect(result).to.deep.equal({
                EM: 'not found package',
                EC: '0',
                DT: '',
            });
        });
    });
});