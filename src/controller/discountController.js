import discountApiService from '../services/discountApiService';
const createDiscount = async (req, res) => {
    try {
        console.log(">>> controller create discount called");
        const data = await discountApiService.createDiscount(req.body);
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
const readDiscountPagination = async (req, res) => {
    try {
        if (req.query.page && req.query.limit) {
            let page = req.query.page;
            let limit = req.query.limit;
            let data = await discountApiService.getDiscountWithPagination(+page, +limit);
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
const readDiscountById = async (req, res) => {
    try {
        if (req.query.id) {
            let data = await discountApiService.getDiscountById(+req.query.id);
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
const updateDiscount = async (req, res) => {
    try {
        console.log("update in discount controller called")
        let data = await discountApiService.updateDiscount(req.body);
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
const deleteDiscount = async (req, res) => {
    try {
        let data = await discountApiService.deleteDiscount(req.body.id);
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
    createDiscount, readDiscountPagination, updateDiscount, deleteDiscount, readDiscountById
}