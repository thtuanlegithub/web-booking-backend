import tourPackageApiService from '../services/tourPackageApiService';
const readAllTourPackage = async (req, res) => {
    try {
        let data = await tourPackageApiService.getAllTourPackage();
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

module.exports = { readAllTourPackage };