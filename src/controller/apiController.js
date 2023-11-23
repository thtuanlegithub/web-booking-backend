import packageService from '../services/packageService';
import packageApiService from '../services/packageApiService'
const getPackageList = async (req, res) => {
    try {
        if (req.query.page != null) {
            const itemsPerPage = 10;
            let data = await packageService.getPackageList(req.query.page);
            let totalList = await packageService.getAllPackageList();
            let totalPage = await Math.ceil(totalList.length / itemsPerPage);
            return res.status(200).json({
                EM: data.EM,
                EC: data.EC,
                DT: data,
                TotalPage: totalPage,
            });
        }
        else {
            const itemsPerPage = 10;
            let data = await packageService.getPackageList(1);
            let totalList = await packageService.getAllPackageList();
            let totalPage = await Math.ceil(totalList.length / itemsPerPage);
            return res.status(200).json({
                EM: data.EM,
                EC: data.EC,
                DT: data,
                TotalPage: totalPage,
            });
        }
    } catch (error) {
        console.log('Error caught:', error);
        return res.status(500).json({
            EM: 'error from server', //error message
            EC: '-1', //error code
            DT: '',
        })
    }
}
const getPackageById = async (req, res) => {
    try {
        let packageData = {};
        let packageId = req.params.packageId;
        packageData = await packageApiService.getPackageById(packageId);
        return res.status(200).json({
            EM: packageData.EM,
            EC: packageData.EC,
            DT: packageData.DT,
        });
    } catch (error) {
        return res.status(500).json({
            EM: error, //error message
            EC: '-1', //error code
            DT: '',
        })
    }
}
module.exports = {
    getPackageList, getPackageById
}