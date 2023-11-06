import db from '../models/index.js'
const getPackageList = async () => {
    try {
        let packages = [];
        packages = await db.Package.findAll();
        return packages;
    } catch (error) {
        console.log(error);
    }
}

module.exports = {
    getPackageList
}