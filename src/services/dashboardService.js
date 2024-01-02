import db from "../models/index";
const getTourPlanning = async () => {
    try {
        const incompletedTour = await db.Tours.count({
            where: {
                tourStatus: 'Incompleted'
            }
        })
        return {
            EM: 'get tour is planning successfully',
            EC: '0',
            DT: incompletedTour
        }
    } catch (error) {
        console.log(error);
    }
}

const getBookingNeedResolving = async () => {

}

const getTotalRevenue = async () => {

}

const getCustomer = async () => {

}

module.exports = { getTourPlanning, getTotalRevenue, getCustomer, getBookingNeedResolving }