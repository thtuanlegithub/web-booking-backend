import db from "../models/index";
import { Sequelize } from "../models/index";
const createTour = async (tourData) => {
    try {
        const createdTour = await db.Tours.create({
            tourName: tourData.tourGeneralInformation.tourName,
            totalDay: tourData.tourGeneralInformation.totalDay,
            totalNight: tourData.tourGeneralInformation.totalNight,
            addressList: tourData.tourGeneralInformation.addressList,
            tourPrice: tourData.tourGeneralInformation.tourPrice,
            tourStatus: tourData.tourGeneralInformation.tourStatus,
            mainImage: tourData.mainImage
        })

        // Tạo TOURADDITIONALIMAGES và liên kết nó với TOUR
        const additionalImages = tourData.additionalImages; // Đây là một mảng các id của các ảnh bổ sung
        for (let i = 0; i < additionalImages.length; i++) {
            await db.TourAdditionalImages.create({
                tourId: createdTour.id, // id của TOUR đã tạo
                additionalImage: additionalImages[i] // id của ảnh bổ sung
            });
        }

        // Tạo TOURSCHEDULE và liên kết nó với TOUR
        const tourSchedule = tourData.tourSchedule;
        const daySummaries = tourData.daySummaries;
        for (let i = 0; i < tourSchedule.length; i++) {
            const createdSchedule = await db.TourSchedules.create({
                tourId: createdTour.id, // id của TOUR đã tạo
                dayIndex: i + 1, // hoặc bạn có thể sử dụng i nếu DayIndex bắt đầu từ 0
                daySummary: daySummaries[i]
            });
            // Tạo TOURPACKAGE và liên kết nó với TOURSCHEDULE và PACKAGE
            for (let j = 0; j < tourSchedule[i].length; j++) {
                await db.TourPackages.create({
                    tourScheduleId: createdSchedule.id, // id của TOURSCHEDULE đã tạo
                    packageId: tourSchedule[i][j].value // id của PACKAGE đã tìm thấy
                });
            }
        }
        return {
            EM: 'create tour successfully',
            EC: '0',
            DT: ''
        }
    } catch (error) {
        return {
            EM: 'Database error',
            EC: '1',
            DT: ''
        }
    }
}
const getTourById = async (tourId) => {
    try {
        const options = {
            logging: console.log
        };

        let tour = await db.Tours.findOne({
            where: {
                id: tourId
            },
            include: [
                {
                    model: db.TourSchedules,
                    include: [
                        {
                            model: db.Packages
                        }
                    ]
                }, {
                    model: db.TourAdditionalImages
                }
            ]
        });
        return {
            EM: 'get tour by id successfully',
            EC: '0',
            DT: tour
        }
    } catch (error) {
        return {
            EM: 'Database error',
            EC: '1',
            DT: ''
        }
    }
}
const getTourWithPagination = async (page, limit) => {
    try {
        if (page === 0 && limit === 0) {
            let tours = await db.Tours.findAll();
            return {
                EM: 'get data successfully',
                EC: '0',
                DT: tours,
            }
        }
        else {
            let offset = (page - 1) * limit;
            const { count, rows } = await db.Tours.findAndCountAll({
                offset: offset,
                limit: limit,
                order: [["id", "DESC"]]
            });
            let totalPages = Math.ceil(count / limit);
            let data = {
                totalRows: count,
                totalPages: totalPages,
                tours: rows,
            }
            return {
                EM: 'get data successfully',
                EC: '0',
                DT: data,
            }
        }
    } catch (error) {
        return {
            EM: 'Database error',
            EC: '1',
            DT: ''
        }
    }
}
const updateTour = async (tourData) => {
    try {
        let data = await db.Tours.findOne({
            where: { id: tourData.id }
        })

        if (data) {
            // Update Tour General Information
            let updatedTour = await db.Tours.update({
                tourName: tourData.tourGeneralInformation.tourName,
                totalDay: tourData.tourGeneralInformation.totalDay,
                totalNight: tourData.tourGeneralInformation.totalNight,
                addressList: tourData.tourGeneralInformation.addressList,
                tourPrice: tourData.tourGeneralInformation.tourPrice,
                tourStatus: tourData.tourGeneralInformation.tourStatus,
                mainImage: tourData.mainImage
            }, {
                where: {
                    id: tourData.id
                }
            })

            // Delete Tour Schedules, Tour Packages, Tour Additional Images
            // Delete TOURADDITIONALIMAGES
            await db.TourAdditionalImages.destroy({
                where: { tourId: tourData.id }
            });

            // Fetch TOURSCHEDULE IDs associated with the tour
            const scheduleIds = await db.TourSchedules.findAll({
                attributes: ['id'],
                where: { tourId: tourData.id }
            });

            // Delete TOURPACKAGE
            await db.TourPackages.destroy({
                where: { tourScheduleId: scheduleIds.map(schedule => schedule.id) }
            });

            // Delete TOURSCHEDULE
            await db.TourSchedules.destroy({
                where: { tourId: tourData.id }
            });


            // Create Tour Schedules, Tour Packages, Tour Additional Images again
            // Tạo TOURADDITIONALIMAGES và liên kết nó với TOUR
            const additionalImages = tourData.additionalImages; // Đây là một mảng các id của các ảnh bổ sung
            for (let i = 0; i < additionalImages.length; i++) {
                await db.TourAdditionalImages.create({
                    tourId: tourData.id, // id của TOUR đã tạo
                    additionalImage: additionalImages[i] // id của ảnh bổ sung
                });
            }

            // Tạo TOURSCHEDULE và liên kết nó với TOUR
            const tourSchedule = tourData.tourSchedule;
            const daySummaries = tourData.daySummaries;
            for (let i = 0; i < tourSchedule.length; i++) {
                const createdSchedule = await db.TourSchedules.create({
                    tourId: tourData.id, // id của TOUR đã tạo
                    dayIndex: i + 1, // hoặc bạn có thể sử dụng i nếu DayIndex bắt đầu từ 0
                    daySummary: daySummaries[i]
                });
                // Tạo TOURPACKAGE và liên kết nó với TOURSCHEDULE và PACKAGE
                for (let j = 0; j < tourSchedule[i].length; j++) {
                    await db.TourPackages.create({
                        tourScheduleId: createdSchedule.id, // id của TOURSCHEDULE đã tạo
                        packageId: tourSchedule[i][j].value // id của PACKAGE đã tìm thấy
                    });
                }
            }


            return {
                EM: 'update package successfully',
                EC: '0',
                DT: '',
            }
        }
        else {
            return {
                EM: 'not found data',
                EC: '0',
                DT: ''
            }
        }
    } catch (error) {
        return {
            EM: 'Database error',
            EC: '1',
            DT: ''
        }
    }
}
const deleteTour = async (id) => {
    try {
        const tour = await db.Tours.findOne({ where: { id: id } });

        if (tour) {
            // Delete TOURADDITIONALIMAGES
            await db.TourAdditionalImages.destroy({
                where: { tourId: tour.id }
            });

            // Fetch TOURSCHEDULE IDs associated with the tour
            const scheduleIds = await db.TourSchedules.findAll({
                attributes: ['id'],
                where: { tourId: tour.id }
            });

            // Delete TOURPACKAGE
            await db.TourPackages.destroy({
                where: { tourScheduleId: scheduleIds.map(schedule => schedule.id) }
            });

            // Delete TOURSCHEDULE
            await db.TourSchedules.destroy({
                where: { tourId: tour.id }
            });

            // Delete TOUR
            await db.Tours.destroy({
                where: { id: tour.id }
            });

            return {
                EM: 'delete tour successfully',
                EC: '0',
                DT: ''
            };
        } else {
            return {
                EM: 'not found tour',
                EC: '0',
                DT: ''
            };
        }
    } catch (error) {
        return {
            EM: 'error deleting tour',
            EC: '1',
            DT: ''
        };
    }
};


module.exports = { createTour, getTourWithPagination, updateTour, deleteTour, getTourById };