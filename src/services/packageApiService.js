import db from "../models/index"
const getPackageById = async (packageId) => {
    try {
        let packageData = await db.Packages.findOne({
            where: {
                id: packageId
            }
        })
        return {
            EM: 'Get Package sucessfully',
            EC: 0,
            DT: packageData,
        }
    } catch (error) {
        console.log(error);
        return {
            EM: error,
            EC: 1,
            DT: '',
        }
    }
}
module.exports = {
    getPackageById
}