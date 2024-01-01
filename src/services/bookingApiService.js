import { where } from "sequelize";
import db from "../models/index";
import { Sequelize } from "../models/index";
const createBooking = async (bookingData) => {
    try {
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
            const createdBooking = await db.Bookings.create({
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
            const createdBooking = await db.Bookings.create({
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
            DT: ''
        }
    } catch (error) {
        console.error("Error createBooking", error);
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
                    include: {
                        model: db.Tours
                    }
                }
            ]
        });
        return {
            EM: 'get booking by id successfully',
            EC: '0',
            DT: booking
        }
    } catch (error) {
        console.error("Error - get booking by id", error);
    }
}
const getBookingWithPagination = async (page, limit) => {
    if (page == 0 && limit == 0) {
        let data = await db.Bookings.findAll({
            include: {
                model: db.Customers
            }
        });
        return {
            EM: 'get data successfully',
            EC: '0',
            DT: data,
        }
    }
    else {
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
}
const updateBooking = async (bookingData) => {
    console.log("update booking in api service called");
    console.log(bookingData);
    let data = await db.Bookings.findOne({
        where: { id: bookingData.id }
    })
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
        console.log(">>> update Tourists successfully");

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
        console.log(">>> update Booking successfully: ", res);
    }
    console.log(">>> completed");

    return {
        EM: 'update booking successfully',
        EC: '0',
        DT: '',
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
        console.error("Error deleteBooking", error);
        return {
            EM: 'error deleting booking',
            EC: '1',
            DT: ''
        };
    }
};


module.exports = { createBooking, getBookingWithPagination, updateBooking, deleteBooking, getBookingById };