import { where } from "sequelize";
import db from "../models/index";
import { Sequelize } from "../models/index";
const createBooking = async (bookingData) => {
    try {
        let createdBooking = {};
        const existCustomer = await db.Customers.findOne({
            where: {
                customerGmail: bookingData.customer.customerGmail,
            }
        })
        if (existCustomer) {
            await db.Customers.update({
                customerPhone: bookingData.customer.customerPhone,
                customerName: bookingData.customer.customerName
            }, {
                where: {
                    id: existCustomer.id
                }
            })
            createdBooking = await db.Bookings.create({
                exportInvoice: bookingData.exportInvoice,
                bookingStatus: bookingData.bookingStatus,
                bookingPrice: bookingData.bookingPrice,
                paymentNote: bookingData.paymentNote,
                paymentImage: bookingData.paymentImage,
                travelId: bookingData.travelId,
                customerId: existCustomer.id
            });
            for (let i = 0; i < bookingData.touristList.length; i++) {
                await db.Tourists.create({
                    touristName: bookingData.touristList[i],
                    bookingId: createdBooking.id
                })
            }
        }
        else {
            const createdCustomer = await db.Customers.create({
                customerName: bookingData.customer.customerName,
                customerPhone: bookingData.customer.customerPhone,
                customerGmail: bookingData.customer.customerGmail
            });
            createdBooking = await db.Bookings.create({
                exportInvoice: bookingData.exportInvoice,
                bookingStatus: bookingData.bookingStatus,
                bookingPrice: bookingData.bookingPrice,
                paymentNote: bookingData.paymentNote,
                paymentImage: bookingData.paymentImage,
                travelId: bookingData.travelId,
                customerId: createdCustomer.id
            })
            for (let i = 0; i < bookingData.touristList.length; i++) {
                await db.Tourists.create({
                    touristName: bookingData.touristList[i],
                    bookingId: createdBooking.id
                })
            }
        }
        return {
            EM: 'create booking successfully',
            EC: '0',
            DT: createdBooking
        }
    } catch (error) {
    }
}
const getBookingById = async (bookingId) => {
    try {
        let booking = await db.Bookings.findOne({
            where: {
                id: bookingId
            },
            include: [
                {
                    model: db.Customers,
                },
                {
                    model: db.Tourists
                },
                {
                    model: db.Travels,
                    include: [
                        {
                            model: db.Tours
                        },
                        {
                            model: db.Discounts
                        }
                    ]
                }
            ]
        });
        return {
            EM: 'get booking by id successfully',
            EC: '0',
            DT: booking
        }
    } catch (error) {
    }
}
const getBookingWithPagination = async (page, limit) => {
    if (page == 0 && limit == 0) {
        let data = await db.Bookings.findAll({
            include: [
                {
                    model: db.Customers
                },
                {
                    model: db.Travels,
                }
            ]
        });
        return {
            EM: 'get data successfully',
            EC: '0',
            DT: data,
        }
    }
    else if (page >= 1 && limit >= 1) {
        let offset = (page - 1) * limit;
        const { count, rows } = await db.Bookings.findAndCountAll({
            offset: offset,
            limit: limit,
            order: [["id", "DESC"]],
            include: [{
                model: db.Customers
            }]
        });
        let totalPages = Math.ceil(count / limit);
        let data = {
            totalRows: count,
            totalPages: totalPages,
            bookings: rows,
        }
        return {
            EM: 'get data successfully',
            EC: '0',
            DT: data,
        }
    }
    else {
        return {
            EM: 'error getting data',
            EC: '1',
            DT: null,
        }
    }
}
const updateBooking = async (bookingData) => {
    try {
        let data = await db.Bookings.findOne({
            where: { id: bookingData.id }
        })
        if (bookingData.exportInvoice === true) {
            let touristNum = bookingData.touristList.length;
            let needUpdateTravel = await db.Travels.findOne({
                where: {
                    id: bookingData.travelId
                }
            })
            if (needUpdateTravel) {
                let newRemain = needUpdateTravel.remainTicket - touristNum;
                let res = await db.Travels.update({
                    remainTicket: newRemain
                }, {
                    where: {
                        id: bookingData.travelId
                    }
                })
            }

        }


        if (data) {
            await db.Tourists.destroy(
                {
                    where: {
                        bookingId: bookingData.id
                    }
                }
            );
            for (let i = 0; i < bookingData.touristList.length; i++) {
                await db.Tourists.create({
                    touristName: bookingData.touristList[i],
                    bookingId: bookingData.id
                })
            }

            let res = await db.Bookings.update({
                exportInvoice: bookingData.exportInvoice,
                bookingStatus: bookingData.bookingStatus,
                bookingPrice: bookingData.bookingPrice,
                paymentNote: bookingData.paymentNote,
                paymentImage: bookingData.paymentImage,
                travelId: bookingData.travelId
            }, {
                where: {
                    id: bookingData.id
                }
            })
        }

        return {
            EM: 'update booking successfully',
            EC: '0',
            DT: '',
        }
    } catch (error) {
        return {
            EM: 'Error updating booking',
            EC: '1',
            DT: '',
        }
    }
}
const deleteBooking = async (id) => {
    try {
        const booking = await db.Bookings.findOne({ where: { id: id } });
        if (booking) {
            // Delete BOOKING
            await db.Tourists.destroy({
                where: {
                    bookingId: booking.id
                }
            })
            await db.Bookings.destroy({
                where: { id: booking.id }
            });

            return {
                EM: 'delete booking successfully',
                EC: '0',
                DT: ''
            };
        } else {
            return {
                EM: 'not found booking',
                EC: '0',
                DT: ''
            };
        }
    } catch (error) {
        return {
            EM: 'error deleting booking',
            EC: '1',
            DT: ''
        };
    }
};


module.exports = { createBooking, getBookingWithPagination, updateBooking, deleteBooking, getBookingById };