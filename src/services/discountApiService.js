import db from "../models/index";
const createDiscount = async (discountData) => {
    try {
        // CREATE
        return {
            EM: 'create discount successfully',
            EC: '0',
            DT: ''
        }
    } catch (error) {
        console.error("Error createDiscount", error);
    }
}
const getDiscountById = async (discountId) => {
    try {
        let discount = await db.Discounts.findOne({
            where: {
                id: discountId
            },
            include: {
                model: db.Travels
            }
        });
        return {
            EM: 'get discount by id successfully',
            EC: '0',
            DT: discount
        }
    } catch (error) {
        console.error("Error - get discount by id", error);
    }
}
const getDiscountWithPagination = async (page, limit) => {
    if (page == 0 && limit == 0) {
        let data = await db.Discounts.findAll();
        return {
            EM: 'get all discount successfully',
            EC: '0',
            DT: data,
        }
    }
    else {
        let offset = (page - 1) * limit;
        const { count, rows } = await db.Discounts.findAndCountAll({
            offset: offset,
            limit: limit,
            order: [["id", "DESC"]],
            include: [{
                model: db.Travels
            }]
        });
        let totalPages = Math.ceil(count / limit);
        let data = {
            totalRows: count,
            totalPages: totalPages,
            discounts: rows,
        }
        return {
            EM: 'get pagination discount successfully',
            EC: '0',
            DT: data,
        }
    }
}
const updateDiscount = async (discountData) => {
    console.log("update discount in api service called");
    console.log(discountData);
    let data = await db.Discounts.findOne({
        where: { id: discountData.id }
    })
    if (data) {

    }
    console.log(">>> completed");

    return {
        EM: 'update discount successfully',
        EC: '0',
        DT: '',
    }
}
const deleteDiscount = async (id) => {
    try {
        const discount = await db.Discounts.findOne({ where: { id: id } });
        if (discount) {
            await db.Discounts.destroy({
                where: { id: discount.id }
            });
            return {
                EM: 'delete discount successfully',
                EC: '0',
                DT: ''
            };
        } else {
            return {
                EM: 'not found discount',
                EC: '0',
                DT: ''
            };
        }
    } catch (error) {
        console.error("Error deleteDiscount", error);
        return {
            EM: 'error deleting discount',
            EC: '1',
            DT: ''
        };
    }
};


module.exports = { createDiscount, getDiscountWithPagination, updateDiscount, deleteDiscount, getDiscountById };