import db from "../models/index"
import { Sequelize } from "../models/index"
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
const getPackageList = async () => {
    try {
        let packageData = await db.Packages.findAll(
            {
                attributes: ['id', 'packageName', 'packageType', 'packageAddress']
            }
        );
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
const getPackageWithPagination = async (page, limit) => {
    try {
        let offset = (page - 1) * limit;
        const { count, rows } = await db.Packages.findAndCountAll({
            offset: offset,
            limit: limit,
            order: [["id", "DESC"]]
        });
        let totalPages = Math.ceil(count / limit);
        let data = {
            totalRows: count,
            totalPages: totalPages,
            packages: rows,
        }
        return {
            EM: 'get data successfully',
            EC: '0',
            DT: data,
        }
    } catch (error) {
        console.log(error);
    }
}
const getPackageByAddressList = async (addressList) => {
    try {
        if (addressList != null && addressList != []) {
            const addresses = addressList.split('|').filter(Boolean);
            const whereCondition = { packageAddress: { [Sequelize.Op.in]: addresses } };
            const data = await db.Packages.findAll({
                where: whereCondition
            });
            return {
                EM: 'get data successfully',
                EC: '0',
                DT: data,
            }
        }
        else {
            return {
                EM: 'get data successfully',
                EC: '0',
                DT: [],
            }
        }
    } catch (error) {
        console.log(error);
    }
}
const createPackage = async (packageData) => {
    try {
        const data = await db.Packages.create({
            packageName: packageData.packageName,
            packageType: packageData.packageType,
            packageAddress: packageData.packageAddress,
            packageDescription: packageData.packageDescription
        });
        return {
            EM: 'create package successfully',
            EC: '0',
            DT: data
        }
    } catch (error) {
        console.error("Error createPackage", error);
    }
}
const updatePackage = async (packageData) => {
    try {
        let data = await db.Packages.findOne({
            where: { id: packageData.id }
        })
        if (data) {
            let res = await db.Packages.update({
                packageName: packageData.packageName,
                packageAddress: packageData.packageAddress,
                packageType: packageData.packageType,
                packageDescription: packageData.packageDescription
            }, {
                where: {
                    id: packageData.id
                }
            })
        }
        return {
            EM: 'update package successfully',
            EC: '0',
            DT: '',
        }
    } catch (error) {
        console.error("Error updatePackage", error);
    }
}
const deletePackage = async (id) => {
    try {
        let data = await db.Packages.findOne({
            where: { id: id }
        })
        if (data) {
            let res = await db.Packages.destroy({
                where: { id: id }
            });
            console.log(res);
            return {
                EM: 'delete package successfully',
                EC: '0',
                DT: '',
            }
        }
        else {
            return {
                EM: 'not found package',
                EC: '0',
                DT: '',
            }
        }

    } catch (error) {
        console.error("Error createPackage", error);
    }
}
module.exports = {
    getPackageById, getPackageList, getPackageWithPagination, createPackage, deletePackage, updatePackage, getPackageByAddressList
}