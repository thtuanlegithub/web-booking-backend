import db from "../models/index";
const createDiscount = async (discountData) => {
    try {
        let data = await db.Discounts.create({
            discountName: discountData.discountName,
            discountType: discountData.discountType,
            discountAmount: discountData.discountAmount,
            discountDescription: discountData.discountDescription,
        })
        return {
            EM: 'create discount successfully',
            EC: '0',
            DT: data
        }
    } catch (error) {
        return {
            EM: 'error creating discount',
            EC: '1',
            DT: undefined,
        }
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
        return {
            EM: 'error getting discount by id',
            EC: '1',
            DT: undefined,
        }
    }
}
const getDiscountWithPagination = async (page, limit) => {
    try {
        if (page == 0 && limit == 0) {
            try {
                let data = await db.Discounts.findAll({
                    include: [{
                        model: db.Travels
                    }]
                });
                return {
                    EM: 'get all discount successfully',
                    EC: '0',
                    DT: data,
                }
            } catch (error) {
                return {
                    EM: 'error getting all discounts',
                    EC: '1',
                    DT: undefined,
                }
            }
        }
        else {
            try {
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
            } catch (error) {
                return {
                    EM: 'error getting pagination discounts',
                    EC: '1',
                    DT: undefined,
                }
            }

        }
    } catch (error) {
        return {
            EM: 'error getting all discounts',
            EC: '1',
            DT: undefined,
        }
    }
}
const updateDiscount = async (discountData) => {
    let data = await db.Discounts.findOne({
        where: { id: discountData.id }
    })
    if (data) {
        await db.Discounts.update({
            discountName: discountData.discountName,
            discountType: discountData.discountType,
            discountAmount: discountData.discountAmount,
            discountDescription: discountData.discountDescription,
        }, {
            where: {
                id: discountData.id
            }
        })
    }
    else {
        return {
            EM: 'not found discount',
            EC: '0',
            DT: '',
        }
    }
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
        return {
            EM: 'error deleting discount',
            EC: '1',
            DT: ''
        };
    }
};


module.exports = { createDiscount, getDiscountWithPagination, updateDiscount, deleteDiscount, getDiscountById };