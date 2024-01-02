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
        return {
            EM: 'error getting tour planning count',
            EC: '1',
            DT: undefined
        }
    }
}

module.exports = { getTourPlanning }