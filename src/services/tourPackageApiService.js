import db from "../models/index";
const getAllTourPackage = async () => {
    let tourpackages = await db.TourPackages.findAll();
    return {
        EM: 'get data successfully',
        EC: '0',
        DT: tourpackages,
    }
}

module.exports = { getAllTourPackage };