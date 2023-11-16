import db from '../models/index.js'
const getAllPackageList = async () => {
    try {
        let packages = [];
        packages = await db.Packages.findAll();
        return packages;
    } catch (error) {
        console.log(error);
    }
}
const getPackageList = async (page) => {
    try {
        let packages = [];
        const itemsPerPage = 10;
        const offset = (page - 1) * itemsPerPage;
        packages = await db.Packages.findAll({
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
        totalNumber = await db.Packages.count();
        return totalNumber;
    } catch (error) {
        console.log(error);
    }
}
const getPackageCityById = (packageCityId) => {
    switch (packageCityId) {
        case '1':
            return "Đà Lạt";
        case '2':
            return "Đà Nẵng";
        default:
            return "Khác";
    }
}
const getPackageTypeById = (packageTypeId) => {
    switch (packageTypeId) {
        case '1':
            return "Thăm thắng cảnh";
        case '2':
            return "Ăn uống";
        case '3':
            return "Mua sắm";
        case '4':
            return "Giải trí";
        case '5':
            return "Thể thao";
        case '6':
            return "Kiến thức";
        case '7':
            return "Giao lưu văn hóa";
        default:
            return "Khác";
    }
}
const createNewPackage = async (data) => {
    try {
        console.log(data);
        if (data) {
            let packageType = getPackageTypeById(data.packageType);
            let packageCity = getPackageCityById(data.packageCity);
            await db.Packages.create({
                packageName: data.packageName,
                packageType: packageType,
                packageCity: packageCity,
                packageImage: data.packageImage,
            })
            console.log("Add new package successfully!");
        }
        else {
            console.log("Package is null");
        }
    } catch (error) {
        console.log(error);
    }
}
module.exports = {
    getPackageList, getTotalNumber, getAllPackageList, createNewPackage
}