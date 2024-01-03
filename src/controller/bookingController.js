import bookingApiService from '../services/bookingApiService';
const createBooking = async (req, res) => {
    try {
        const data = await bookingApiService.createBooking(req.body);
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
const readBookingPagination = async (req, res) => {
    try {
        if (req.query.page && req.query.limit) {
            let page = req.query.page;
            let limit = req.query.limit;
            let data = await bookingApiService.getBookingWithPagination(+page, +limit);
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
const readBookingById = async (req, res) => {
    try {
        if (req.query.id) {
            let data = await bookingApiService.getBookingById(+req.query.id);
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
const updateBooking = async (req, res) => {
    try {
        console.log("update in booking controller called")
        let data = await bookingApiService.updateBooking(req.body);
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
const deleteBooking = async (req, res) => {
    try {
        let data = await bookingApiService.deleteBooking(req.body.id);
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
    createBooking, readBookingPagination, updateBooking, deleteBooking, readBookingById
}