import db from "../models/index";
import { Sequelize } from "../models/index";
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
        console.error("Error createTravel", error);
    }
}
const getTravelById = async (travelId) => {
    try {
        let travel = await db.Travels.findOne({
            where: {
                id: travelId
            },
            include:
            {
                model: db.Tours
            }
        });
        return {
            EM: 'get travel by id successfully',
            EC: '0',
            DT: travel
        }
    } catch (error) {
        console.error("Error - get travel by id", error);
    }
}
const getTravelWithPagination = async (page, limit) => {
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
const updateTravel = async (travelData) => {
    console.log("update travel in api service called");
    console.log(travelData);
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
    }
    console.log(">>> completed");

    return {
        EM: 'update package successfully',
        EC: '0',
        DT: data,
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
        console.error("Error deleteTravel", error);
        return {
            EM: 'error deleting travel',
            EC: '1',
            DT: ''
        };
    }
};


module.exports = { createTravel, getTravelWithPagination, updateTravel, deleteTravel, getTravelById };