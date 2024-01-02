import express from "express";
import packageController from '../controller/packageController';
import tourController from '../controller/tourController';
import travelController from '../controller/travelController';
import customerController from '../controller/customerController';
import bookingController from '../controller/bookingController';
import discountController from '../controller/discountController';
import tourPackageController from '../controller/tourPackageController';
import loginController from '../controller/loginController';
import dashboardController from '../controller/dashboardController';
const router = express.Router();

/**
 * 
 * @param {*} app : express app
 */

const initApiRoutes = (app) => {
    router.post("/package/create", packageController.createPackage);
    router.get("/package/read-by-address", packageController.readPackageByAddressList);
    router.get("/package/read", packageController.readPackagePagination);
    router.put("/package/update", packageController.updatePackage);
    router.delete("/package/delete", packageController.deletePackage);

    router.post("/tour/create", tourController.createTour);
    router.get("/tour/read", tourController.readTourPagination);
    router.get("/tour/read-by-id", tourController.readTourById);
    router.put("/tour/update", tourController.updateTour);
    router.delete("/tour/delete", tourController.deleteTour);

    router.get("/travel/read", travelController.readTravelPagination);
    router.get("/travel/read-by-id", travelController.readTravelById);
    router.post("/travel/create", travelController.createTravel);
    router.put("/travel/update", travelController.updateTravel);
    router.delete("/travel/delete", travelController.deleteTravel);

    router.get("/customer/read", customerController.readCustomerPagination);
    router.get("/customer/read-by-id", customerController.readCustomerById);
    router.post("/customer/create", customerController.createCustomer);
    router.put("/customer/update", customerController.updateCustomer);
    router.delete("/customer/delete", customerController.deleteCustomer);

    router.get("/booking/read", bookingController.readBookingPagination);
    router.get("/booking/read-by-id", bookingController.readBookingById);
    router.post("/booking/create", bookingController.createBooking);
    router.put("/booking/update", bookingController.updateBooking);
    router.delete("/booking/delete", bookingController.deleteBooking);

    router.get("/discount/read", discountController.readDiscountPagination);
    router.get("/discount/read-by-id", discountController.readDiscountById);
    router.post("/discount/create", discountController.createDiscount);
    router.put("/discount/update", discountController.updateDiscount);
    router.delete("/discount/delete", discountController.deleteDiscount);

    router.get("/tourpackage/read", tourPackageController.readAllTourPackage);
    router.post("/company-login/", loginController.handleCompanyLogin);

    router.get("/tourplanning", dashboardController.fetchTourPlanning);
    return app.use("/api", router);
}

export default initApiRoutes;