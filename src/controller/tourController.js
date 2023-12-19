import tourApiService from '../services/tourApiService';
const createTour = async (req, res) => {
    try {
        const data = await tourApiService.createTour(req.body);
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
const readTourPagination = async (req, res) => {
    try {
        if (req.query.page && req.query.limit) {
            let page = req.query.page;
            let limit = req.query.limit;

            let data = await tourApiService.getTourWithPagination(+page, +limit);
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
const readTourById = async (req, res) => {
    try {
        if (req.query.id) {
            let data = await tourApiService.getTourById(+req.query.id);
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
const deleteTour = async (req, res) => {
    try {
        let data = await tourApiService.deleteTour(req.body.id);
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
    createTour, readTourPagination, deleteTour, readTourById
}