import customerApiService from '../services/customerApiService';
const createCustomer = async (req, res) => {
    try {
        console.log(">>> controller create customer called");
        const data = await customerApiService.createCustomer(req.body);
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
const readCustomerPagination = async (req, res) => {
    try {
        if (req.query.page && req.query.limit) {
            let page = req.query.page;
            let limit = req.query.limit;
            let data = await customerApiService.getCustomerWithPagination(+page, +limit);
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
const readCustomerById = async (req, res) => {
    try {
        if (req.query.id) {
            let data = await customerApiService.getCustomerById(+req.query.id);
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
const updateCustomer = async (req, res) => {
    try {
        console.log("update in customer controller called")
        let data = await customerApiService.updateCustomer(req.body);
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
const deleteCustomer = async (req, res) => {
    try {
        let data = await customerApiService.deleteCustomer(req.body.id);
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
    createCustomer, readCustomerPagination, updateCustomer, deleteCustomer, readCustomerById
}