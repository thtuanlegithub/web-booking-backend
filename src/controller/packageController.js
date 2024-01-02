import packageApiService from "../services/packageApiService";

const readPackagePagination = async (req, res) => {
    try {
        if (req.query.page && req.query.limit) {
            let page = req.query.page;
            let limit = req.query.limit;

            let data = await packageApiService.getPackageWithPagination(+page, +limit);
            return res.status(200).json({
                EM: data.EM,
                EC: data.EC,
                DT: data.DT,
            })
        }
    } catch (error) {
        return res.status(500).json({
            EM: 'error from server',
            EC: '1',
            DT: '',
        })
    }
}
const readPackageByAddressList = async (req, res) => {
    try {
        const decodedAddressList = decodeURIComponent(req.query.addressList);
        let data = await packageApiService.getPackageByAddressList(decodedAddressList);
        return res.status(200).json({
            EM: data.EM,
            EC: data.EC,
            DT: data.DT,
        })
    } catch (error) {
        return res.status(500).json({
            EM: 'error from server',
            EC: '1',
            DT: '',
        })
    }
}
const readPackageById = async (req, res) => {

}
const createPackage = async (req, res) => {
    try {
        let data = await packageApiService.createPackage(req.body);
        return res.status(200).json({
            EM: data.EM,
            EC: data.EC,
            DT: data.DT,
        })
    } catch (error) {
        return res.status(500).json({
            EM: 'error from server',
            EC: '1',
            DT: '',
        })
    }
}
const updatePackage = async (req, res) => {
    try {
        let data = await packageApiService.updatePackage(req.body);
        return res.status(200).json({
            EM: data.EM,
            EC: data.EC,
            DT: data.DT,
        })
    } catch (error) {
        return res.status(500).json({
            EM: 'error from server',
            EC: '1',
            DT: '',
        })
    }
}

const deletePackage = async (req, res) => {
    try {
        let data = await packageApiService.deletePackage(req.body.id);
        return res.status(200).json({
            EM: data.EM,
            EC: data.EC,
            DT: data.DT,
        })
    } catch (error) {
        return res.status(500).json({
            EM: 'error from server',
            EC: '1',
            DT: '',
        })
    }
}
module.exports = {
    readPackagePagination, readPackageById, readPackageByAddressList, createPackage, deletePackage, updatePackage
}