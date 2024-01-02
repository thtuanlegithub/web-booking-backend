import db from "../models/index";
const createTravel = async (travelData) => {
    try {
        let data = await db.Travels.create({
            startLocation: travelData.startLocation,
            startDateTime: travelData.startDateTime,
            maxTicket: travelData.maxTicket,
            remainTicket: travelData.remainTicket,
            travelPrice: travelData.travelPrice,
            discountId: travelData.discountId,
            tourId: travelData.tourId
        })
        return {
            EM: 'create travel successfully',
            EC: '0',
            DT: data
        }
    } catch (error) {
        return {
            EM: 'Database error',
            EC: '1',
            DT: ''
        }
    }
}
const getTravelById = async (travelId) => {
    try {
        let travel = await db.Travels.findOne({
            where: {
                id: travelId
            },
            include: [
                {
                    model: db.Tours,
                    include: [{
                        model: db.TourAdditionalImages
                    },
                    {
                        model: db.TourSchedules,
                        include: {
                            model: db.Packages
                        }
                    }]
                },
                {
                    model: db.Discounts
                }
            ]

        });
        return {
            EM: 'get travel by id successfully',
            EC: '0',
            DT: travel
        }
    } catch (error) {
        return {
            EM: 'Error - get travel by id',
            EC: '1',
            DT: undefined,
        }
    }
}
const getTravelWithPagination = async (page, limit) => {
    try {
        if (page === 0 && limit === 0) {
            let travels = await db.Travels.findAll(
                {
                    include: [{
                        model: db.Tours
                    },
                    {
                        model: db.Discounts
                    }]
                }
            );
            return {
                EM: 'get data successfully',
                EC: '0',
                DT: travels,
            }
        }
        else {
            let offset = (page - 1) * limit;
            const { count, rows } = await db.Travels.findAndCountAll({
                offset: offset,
                limit: limit,
                order: [["id", "DESC"]],
                include: [
                    { model: db.Tours }
                ]
            });
            let totalPages = Math.ceil(count / limit);
            let data = {
                totalRows: count,
                totalPages: totalPages,
                travels: rows,
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
const updateTravel = async (travelData) => {
    try {
        let data = await db.Travels.findOne({
            where: { id: travelData.id }
        })
        if (data) {
            let res = await db.Travels.update({
                startLocation: travelData.startLocation,
                startDateTime: travelData.startDateTime,
                maxTicket: travelData.maxTicket,
                remainTicket: travelData.remainTicket,
                travelPrice: travelData.travelPrice,
                tourId: travelData.tourId,
                discountId: travelData.discountId
            }, {
                where: {
                    id: travelData.id
                }
            })
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
                DT: '',
            }
        }
    } catch (error) {
        return {
            EM: 'Database error',
            EC: '1',
            DT: '',
        }
    }
}
const deleteTravel = async (id) => {
    try {
        const travel = await db.Travels.findOne({ where: { id: id } });
        if (travel) {
            // Delete TRAVEL
            await db.Travels.destroy({
                where: { id: travel.id }
            });

            return {
                EM: 'delete travel successfully',
                EC: '0',
                DT: ''
            };
        } else {
            return {
                EM: 'not found travel',
                EC: '0',
                DT: ''
            };
        }
    } catch (error) {
        return {
            EM: 'error deleting travel',
            EC: '1',
            DT: ''
        };
    }
};

module.exports = { createTravel, getTravelWithPagination, updateTravel, deleteTravel, getTravelById };