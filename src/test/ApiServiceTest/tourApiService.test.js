const chai = require('chai');
const sinon = require('sinon');
const chaiHttp = require('chai-http');
chai.use(require('sinon-chai'));
const expect = chai.expect;
const db = require('../../models/index');
chai.use(chaiHttp);
const { createTour, getTourById, getTourWithPagination, updateTour, deleteTour } = require('../../services/tourApiService');
const { getTourPlanning } = require('../../services/dashboardService');

describe('Tour API Service', () => {
    let sandbox;

    beforeEach(() => {
        sandbox = sinon.createSandbox();
    });

    afterEach(() => {
        sandbox.restore();
    });

    // describe('createTour', () => {
    //     it('should create a tour successfully', async () => {
    //         // Mock data for the test
    //         const mockTourData = {
    //             tourGeneralInformation: {
    //                 tourName: 'Test Tour',
    //                 totalDay: 3,
    //                 // ... other fields
    //             },
    //             mainImage: 'mainImage',
    //             additionalImages: ['img1', 'img2'],
    //             tourSchedule: [[{ label: 'Location 1', value: 1 }, { label: 'Location 2', value: 2 }]],
    //             daySummaries: ['Day 1']
    //         };

    //         // Stub the create method to simulate a successful creation
    //         const createStub = sandbox.stub(db.Tours, 'create').resolves(mockTourData);

    //         const result = await createTour(mockTourData);

    //         // Assertions
    //         expect(result).to.deep.equal({
    //             EM: 'create tour successfully',
    //             EC: '0',
    //             DT: ''
    //         });

    //         // Verify that the create method was called with the correct arguments
    //         sinon.assert.calledOnceWithExactly(createStub, {
    //             tourName: mockTourData.tourGeneralInformation.tourName,
    //             totalDay: mockTourData.tourGeneralInformation.totalDay,
    //             // ... other fields
    //         });

    //         // Restore the stub after the test
    //         createStub.restore();
    //     });

    //     it('should handle error during tour creation', async () => {
    //         // Mock data for the test
    //         const mockTourData = {
    //             // ... provide the required data for creating a tour
    //         };

    //         // Stub the create method to simulate an error during creation
    //         sandbox.stub(db.Tours, 'create').rejects(new Error('Database error'));

    //         const result = await createTour(mockTourData);

    //         // Assertions
    //         expect(result).to.deep.equal({
    //             EM: 'Database error',
    //             EC: '1',
    //             DT: ''
    //         });
    //     });
    // });


    describe('getTourById', () => {
        it('should get tour by id successfully', async () => {
            // Mock data for the test
            const mockTourId = 1;
            const mockTourData = {
                id: mockTourId,
                "DT": {
                    id: 7,
                    tourName: "Thành phố Hồ Chí Minh - Chợ Bến Thành - Suối Tiên",
                    totalDay: 2,
                    totalNight: 2,
                    addressList: "Nha Trang",
                    tourPrice: "2000000",
                    tourStatus: "Completed",
                    mainImage: "https://firebasestorage.googleapis.com/v0/b/webbooking-2460b.appspot.com/o/images%2F7493164544cca73?alt=media&token=9a6994d7-55c9-484c-ad2c-20760f3bfbe5",
                    createdAt: "2023-12-28T16:06:02.000Z",
                    updatedAt: "2024-01-01T19:15:45.000Z",
                    TourSchedules: [
                        {
                            id: 49,
                            tourId: 7,
                            dayIndex: 1,
                            daySummary: "THÁP BÀ - NGỌC TRAI LONG BEACH PEARL",
                            createdAt: "2024-01-01T19:15:45.000Z",
                            updatedAt: "2024-01-01T19:15:45.000Z",
                            Packages: [
                                {
                                    id: 1,
                                    packageName: "Tháp bà Ponagar",
                                    packageType: "Tham quan",
                                    packageAddress: "Nha Trang",
                                    packageDescription: "Được coi là Tháp Bà Ponagar Nha Trang còn có tên gọi khác là Yang Po Inư Nagar hay Yang Pô Ana Gar - Là ngôi đền Chăm Pa nằm trên đỉnh một ngọn đồi nhỏ cao khoảng 10-12 mét so với mực nước biển, ở cửa sông Cái (sông Nha Trang) tại Nha Trang - Khánh Hòa.",
                                    createdAt: "2023-12-27T13:58:28.000Z",
                                    updatedAt: "2023-12-27T13:58:28.000Z",
                                    TourPackages: {
                                        tourScheduleId: 49,
                                        packageId: 1,
                                        createdAt: "2024-01-01T19:15:45.000Z",
                                        updatedAt: "2024-01-01T19:15:45.000Z"
                                    }
                                },
                                {
                                    id: 2,
                                    packageName: "Ngọc trai Long Beach Pearl (đường Trương Hán Siêu)",
                                    packageType: "Tham quan",
                                    packageAddress: "Nha Trang",
                                    packageDescription: "Tham quan, mua sắm các sản phẩm từ ngọc trai - báu vật khơi xa kết hợp cùng sự sáng tạo của người nghệ nhân tạo thành những sản phẩm trang sức cao cấp, chất lượng cao. Không chỉ dành riêng cho phái nữ, Long Beach Pearl còn chế tác những chiếc vòng tay dây da ngọc trai dành cho nam giới. ",
                                    createdAt: "2023-12-28T13:56:17.000Z",
                                    updatedAt: "2023-12-28T13:56:17.000Z",
                                    TourPackages: {
                                        tourScheduleId: 49,
                                        packageId: 2,
                                        createdAt: "2024-01-01T19:15:45.000Z",
                                        updatedAt: "2024-01-01T19:15:45.000Z"
                                    }
                                }
                            ]
                        },
                        {
                            id: 50,
                            tourId: 7,
                            dayIndex: 2,
                            daySummary: "LÀNG CHÀI  - ĐẢO KHỈ",
                            createdAt: "2024-01-01T19:15:45.000Z",
                            updatedAt: "2024-01-01T19:15:45.000Z",
                            Packages: [
                                {
                                    id: 3,
                                    packageName: "Làng Chài Xưa",
                                    packageType: "Tham quan",
                                    packageAddress: "Nha Trang",
                                    packageDescription: "Với lịch sử 300 năm cái nôi của nghề làm nước mắm, trải nghiệm cảm giác lao động trên đồng muối, đi trên con đường rạng xưa, thăm phố cổ Phan Thiết, , thăm nhà lều của hàm hộ nước mắm xưa, đắm chìm cảm xúc trong biển 3D và thích thú khi đi chợ làng chài xưa với bàn tính tay, bàn cân xưa thú vị,…",
                                    createdAt: "2023-12-28T13:56:40.000Z",
                                    updatedAt: "2023-12-28T13:56:40.000Z",
                                    TourPackages: {
                                        tourScheduleId: 50,
                                        packageId: 3,
                                        createdAt: "2024-01-01T19:15:45.000Z",
                                        updatedAt: "2024-01-01T19:15:45.000Z"
                                    }
                                },
                                {
                                    id: 4,
                                    packageName: "Hòn Lao - Đảo Khỉ",
                                    packageType: "Tham quan",
                                    packageAddress: "Nha Trang",
                                    packageDescription: "nơi có hơn 1000 chú khỉ đang được bảo tồn và sinh sống tự nhiên. Quý khách tự do tắm biển, thư giãn, tham quan xem chương trình biểu diễn xiếc Khỉ, đua chó, khỉ bơi lội hoặc trải nghiệm các môn thể thao trên bãi biển và trò chơi: canô kéo dù, mô tô nước, đua xe công thức 1, bắn súng sơn, cưỡi đà điểu … (chi phí tự túc).",
                                    createdAt: "2023-12-28T13:57:03.000Z",
                                    updatedAt: "2023-12-30T14:01:17.000Z",
                                    TourPackages: {
                                        tourScheduleId: 50,
                                        packageId: 4,
                                        createdAt: "2024-01-01T19:15:45.000Z",
                                        updatedAt: "2024-01-01T19:15:45.000Z"
                                    }
                                }
                            ]
                        }
                    ],
                    TourAdditionalImages: [
                        {
                            id: 57,
                            tourId: 7,
                            additionalImage: "https://firebasestorage.googleapis.com/v0/b/webbooking-2460b.appspot.com/o/images%2F4f8c1fad44e0e4cf?alt=media&token=8964f20c-6825-45f2-bca1-4bf2165dd839",
                            createdAt: "2024-01-01T19:15:45.000Z",
                            updatedAt: "2024-01-01T19:15:45.000Z"
                        },
                        {
                            id: 58,
                            tourId: 7,
                            additionalImage: "https://firebasestorage.googleapis.com/v0/b/webbooking-2460b.appspot.com/o/images%2Ff6a3039af3368d85?alt=media&token=c3f660b4-0ecb-4fe9-bb6a-94ad054e9537",
                            createdAt: "2024-01-01T19:15:45.000Z",
                            updatedAt: "2024-01-01T19:15:45.000Z"
                        },
                        {
                            id: 59,
                            tourId: 7,
                            additionalImage: "https://firebasestorage.googleapis.com/v0/b/webbooking-2460b.appspot.com/o/images%2F42c08ccf9e59648a?alt=media&token=d6fb3a22-c0e1-45cf-98b0-cdbab3fbe31c",
                            createdAt: "2024-01-01T19:15:45.000Z",
                            updatedAt: "2024-01-01T19:15:45.000Z"
                        }
                    ]
                }
            };

            // Stub necessary methods to simulate the database query
            sandbox.stub(db.Tours, 'findOne').resolves(mockTourData);

            // ... Stub other necessary methods as needed

            const result = await getTourById(mockTourId);

            // Assertions
            expect(result).to.deep.equal({
                EM: 'get tour by id successfully',
                EC: '0',
                DT: mockTourData
            });
        });

        it('should handle error during getTourById', async () => {
            // Mock data for the test
            const mockTourId = 1;

            // Stub necessary methods to simulate an error during the database query
            sandbox.stub(db.Tours, 'findOne').rejects(new Error('Database error'));

            // ... Stub other necessary methods as needed

            const result = await getTourById(mockTourId);

            // Assertions
            expect(result).to.deep.equal({
                EM: 'Database error',
                EC: '1',
                DT: ''
            });
        });
    })
    describe('getTourPlanning', () => {
        it('should get tour planning count successfully', async () => {
            const mockIncompletedTourCount = 5; // Replace with the actual count

            // Stub the count method to return a predefined count
            sandbox.stub(db.Tours, 'count').resolves(mockIncompletedTourCount);

            const result = await getTourPlanning();

            // Assertions
            expect(result).to.deep.equal({
                EM: 'get tour is planning successfully',
                EC: '0',
                DT: mockIncompletedTourCount
            });
        });

        it('should handle errors during tour planning count retrieval', async () => {
            // Stub the count method to throw an error
            sandbox.stub(db.Tours, 'count').rejects(new Error('Simulated error'));

            const result = await getTourPlanning();

            // Assertions
            expect(result).to.deep.equal({
                EM: 'error getting tour planning count',
                EC: '1',
                DT: undefined
            });
        });
    });
    describe('getTourWithPagination', () => {
        it('should get all tours successfully when page and limit are 0', async () => {
            // Mock data for the test
            const mockTours = [{ id: 1, tourName: 'Tour 1' }, { id: 2, tourName: 'Tour 2' }];

            // Stub necessary methods to simulate the database query
            sandbox.stub(db.Tours, 'findAll').resolves(mockTours);

            const result = await getTourWithPagination(0, 0);

            // Assertions
            expect(result).to.deep.equal({
                EM: 'get data successfully',
                EC: '0',
                DT: mockTours
            });
        });

        it('should get paginated tours successfully when page and limit are not 0', async () => {
            // Mock data for the test
            const mockPage = 1;
            const mockLimit = 10;
            const mockTourData = {
                count: 20,
                rows: [{ id: 1, tourName: 'Tour 1' }, { id: 2, tourName: 'Tour 2' }]
            };

            // Stub necessary methods to simulate the database query
            sandbox.stub(db.Tours, 'findAndCountAll').resolves(mockTourData);

            const result = await getTourWithPagination(mockPage, mockLimit);

            // Assertions
            expect(result).to.deep.equal({
                EM: 'get data successfully',
                EC: '0',
                DT: {
                    totalRows: mockTourData.count,
                    totalPages: 2,
                    tours: mockTourData.rows
                }
            });
        });

        it('should handle error during getTourWithPagination', async () => {
            // Mock data for the test
            const mockPage = 1;
            const mockLimit = 10;

            // Stub necessary methods to simulate an error during the database query
            sandbox.stub(db.Tours, 'findAndCountAll').rejects(new Error('Database error'));

            const result = await getTourWithPagination(mockPage, mockLimit);

            // Assertions
            expect(result).to.deep.equal({
                EM: 'Database error',
                EC: '1',
                DT: ''
            });
        });
    })

    describe('updateTour', () => {
        it('should update tour successfully', async () => {
            // Mock data for the test
            const mockTourData = {
                id: 1,
                tourGeneralInformation: {
                    tourName: 'Updated Tour',
                    totalDay: 5,
                    totalNight: 4,
                    addressList: ['Location 1', 'Location 2'],
                    tourPrice: 1000,
                    tourStatus: 'Active',
                },
                mainImage: 'updated-main-image.jpg',
                additionalImages: [1, 2, 3], // Assuming these are valid additional image IDs
                tourSchedule: [
                    [
                        { value: 4 }, // Assuming this is a valid package ID
                        { value: 5 },
                    ],
                    [
                        { value: 6 },
                        { value: 7 },
                    ],
                ],
                daySummaries: ['Day 1 Summary', 'Day 2 Summary'],
            };

            // Stub necessary methods to simulate the database queries
            sandbox.stub(db.Tours, 'findOne').resolves({ id: 1 }); // Assuming the tour exists
            sandbox.stub(db.Tours, 'update').resolves([1]); // Mock the update result
            sandbox.stub(db.TourAdditionalImages, 'destroy').resolves(2); // Mock the destroy result
            sandbox.stub(db.TourSchedules, 'findAll').resolves([{ id: 1 }, { id: 2 }]);
            sandbox.stub(db.TourPackages, 'destroy').resolves(2); // Mock the destroy result
            sandbox.stub(db.TourSchedules, 'destroy').resolves(2); // Mock the destroy result
            sandbox.stub(db.TourAdditionalImages, 'create').resolves({ id: 3 }); // Mock the create result
            sandbox.stub(db.TourSchedules, 'create').resolves({ id: 4 }); // Mock the create result
            sandbox.stub(db.TourPackages, 'create').resolves({ id: 5 }); // Mock the create result

            const result = await updateTour(mockTourData);

            // Assertions
            expect(result).to.deep.equal({
                EM: 'update package successfully',
                EC: '0',
                DT: '',
            });
        });

        it('should handle not found data during updateTour', async () => {
            // Mock data for the test
            const mockTourData = {
                id: 1,
                // ... other data
            };

            // Stub the findOne method to simulate not finding the tour
            sandbox.stub(db.Tours, 'findOne').resolves(null);

            const result = await updateTour(mockTourData);

            // Assertions
            expect(result).to.deep.equal({
                EM: 'not found data',
                EC: '0',
                DT: '',
            });
        });

        it('should handle database error during updateTour', async () => {
            // Mock data for the test
            const mockTourData = {
                id: 1,
                // ... other data
            };

            // Stub necessary methods to simulate a database error
            sandbox.stub(db.Tours, 'findOne').throws(new Error('Database error'));

            const result = await updateTour(mockTourData);

            // Assertions
            expect(result).to.deep.equal({
                EM: 'Database error',
                EC: '1',
                DT: '',
            });
        });

    })

    describe('deleteTour', () => {
        it('should delete tour successfully', async () => {
            // Mock data for the test
            const mockTourId = 1;

            // Stub necessary methods to simulate the database queries
            sandbox.stub(db.Tours, 'findOne').resolves({ id: mockTourId }); // Assuming the tour exists
            sandbox.stub(db.TourAdditionalImages, 'destroy').resolves(2); // Mock the destroy result
            sandbox.stub(db.TourSchedules, 'findAll').resolves([{ id: 1 }, { id: 2 }]);
            sandbox.stub(db.TourPackages, 'destroy').resolves(2); // Mock the destroy result
            sandbox.stub(db.TourSchedules, 'destroy').resolves(2); // Mock the destroy result
            sandbox.stub(db.Tours, 'destroy').resolves(1); // Mock the destroy result

            const result = await deleteTour(mockTourId);

            // Assertions
            expect(result).to.deep.equal({
                EM: 'delete tour successfully',
                EC: '0',
                DT: '',
            });
        });

        it('should handle not found tour during deleteTour', async () => {
            // Mock data for the test
            const mockTourId = 1;

            // Stub the findOne method to simulate not finding the tour
            sandbox.stub(db.Tours, 'findOne').resolves(null);

            const result = await deleteTour(mockTourId);

            // Assertions
            expect(result).to.deep.equal({
                EM: 'not found tour',
                EC: '0',
                DT: '',
            });
        });

        it('should handle database error during deleteTour', async () => {
            // Mock data for the test
            const mockTourId = 1;

            // Stub necessary methods to simulate a database error
            sandbox.stub(db.Tours, 'findOne').throws(new Error('Database error'));

            const result = await deleteTour(mockTourId);

            // Assertions
            expect(result).to.deep.equal({
                EM: 'error deleting tour',
                EC: '1',
                DT: '',
            });
        });
    })
});