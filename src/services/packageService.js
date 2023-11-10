import db from '../models/index.js'
const getAllPackageList = async () => {
    try {
        let packages = [];
        packages = await db.Package.findAll();
        return packages;
    } catch (error) {
        console.log(error);
    }
}
const getPackageList = async (page) => {
    try {
        let packages = [];
        const itemsPerPage = 1;
        const offset = (page - 1) * itemsPerPage;
        packages = await db.Package.findAll({
            offset,
            limit: itemsPerPage
        });
        return packages;
    } catch (error) {
        console.log(error);
    }
}
const getTotalNumber = async () => {
    try {
        let totalNumber = 0;
        totalNumber = await db.Package.count();
        return totalNumber;
    } catch (error) {
        console.log(error);
    }
}
module.exports = {
    getPackageList, getTotalNumber, getAllPackageList
}