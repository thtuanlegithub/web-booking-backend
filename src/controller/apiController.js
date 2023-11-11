import packageService from '../services/packageService';
const getPackageList = async (req, res) => {
    try {
        let data = await packageService.getAllPackageList();
        return res.status(200).json({
            EM: data.EM,
            EC: data.EC,
            DT: data,
        });
    } catch (error) {
        console.log('Error caught:', error);
        return res.status(500).json({
            EM: 'error from server', //error message
            EC: '-1', //error code
            DT: '',
        })
    }
}
module.exports = {
    getPackageList
}