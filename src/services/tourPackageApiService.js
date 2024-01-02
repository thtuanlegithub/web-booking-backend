import db from "../models/index";
const getAllTourPackage = async () => {
    try {
        let tourpackages = await db.TourPackages.findAll();
        return {
            EM: 'get data successfully',
            EC: '0',
            DT: tourpackages,
        }
    } catch (error) {
        return {
            EM: 'Database error',
            EC: '1',
            DT: '',
        }
    }
}

module.exports = { getAllTourPackage };