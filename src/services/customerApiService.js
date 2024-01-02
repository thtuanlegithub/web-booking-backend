import db from "../models/index";
const createCustomer = async (customerData) => {
    try {
        let data = await db.Customers.create({

        })
        return {
            EM: 'create customer successfully',
            EC: '0',
            DT: data
        }
    } catch (error) {
        console.error("Error createCustomer", error);
    }
}
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
        return {
            EM: 'get customer by id successfully',
            EC: '0',
            DT: customer
        }
    } catch (error) {
        console.error("Error - get customer by id", error);
    }
}
const getCustomerWithPagination = async (page, limit) => {
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

}
const updateCustomer = async (customerData) => {
    console.log("update customer in api service called");
    console.log(customerData);
    let data = await db.Customers.findOne({
        where: { id: customerData.id }
    })
    if (data) {
        let res = await db.Customers.update({

        }, {
            where: {
                id: customerData.id
            }
        })
    }
    console.log(">>> completed");

    return {
        EM: 'update package successfully',
        EC: '0',
        DT: data,
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
        console.error("Error deleteCustomer", error);
        return {
            EM: 'error deleting customer',
            EC: '1',
            DT: ''
        };
    }
};


module.exports = { createCustomer, getCustomerWithPagination, updateCustomer, deleteCustomer, getCustomerById };