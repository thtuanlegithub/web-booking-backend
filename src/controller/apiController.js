import packageApiService from '../services/packageApiService'
const getPackageList = async (req, res) => {
    try {
        let data = await packageApiService.getPackageList();
        return res.status(200).json({
            EM: data.EM,
            EC: data.EC,
            DT: data.DT,
        });
    }
    catch (error) {
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