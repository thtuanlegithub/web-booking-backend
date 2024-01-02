import db from "../models/index";
const getCustomerById = async (customerId) => {
    try {
        let customer = await db.Customers.findOne({
            where: {
                id: customerId
            },
            include:
            {
                model: db.CustomerAccounts
            }
        });
        if (customer) {
            return {
                EM: 'get customer by id successfully',
                EC: '0',
                DT: customer
            }
        }
        else {
            return {
                EM: 'not found customer',
                EC: '0',
                DT: null
            }
        }
    } catch (error) {
        return {
            EM: 'error - get customer by id',
            EC: '1',
            DT: null
        }
    }
}
const getCustomerWithPagination = async (page, limit) => {
    try {
        if (page == 0 && limit === 0) {
            let data = await db.Customers.findAll();
            return {
                EM: 'get data successfully',
                EC: '0',
                DT: data,
            }
        }
        else {
            let offset = (page - 1) * limit;
            const { count, rows } = await db.Customers.findAndCountAll({
                offset: offset,
                limit: limit,
                order: [["id", "DESC"]],
                include: [
                    { model: db.CustomerAccounts }
                ]
            });
            let totalPages = Math.ceil(count / limit);
            let data = {
                totalRows: count,
                totalPages: totalPages,
                customers: rows,
            }
            return {
                EM: 'get data successfully',
                EC: '0',
                DT: data,
            }
        }
    } catch (error) {
        return {
            EM: 'error - get customer with pagination',
            EC: '1',
            DT: null
        }
    }
}
const deleteCustomer = async (id) => {
    try {
        const customer = await db.Customers.findOne({ where: { id: id } });
        if (customer) {
            // Delete CUSTOMER
            await db.Customers.destroy({
                where: { id: customer.id }
            });

            return {
                EM: 'delete customer successfully',
                EC: '0',
                DT: ''
            };
        } else {
            return {
                EM: 'not found customer',
                EC: '0',
                DT: ''
            };
        }
    } catch (error) {
        return {
            EM: 'error deleting customer',
            EC: '1',
            DT: ''
        };
    }
};


module.exports = { getCustomerWithPagination, deleteCustomer, getCustomerById };