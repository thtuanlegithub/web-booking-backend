import express from "express";
import homeController from "../controller/homeController";
const router = express.Router();

/**
 * 
 * @param {*} app : express app
 */

const initWebRoutes = (app) => {
    router.get("/", homeController.handleHomePage);
    router.get("/travel", homeController.handleTravelPage);
    router.get("/tour", homeController.handleTourPage);
    router.get("/package", homeController.handlePackagePage);
    router.get("/discount", homeController.handleDiscountPage);
    router.get("/account", homeController.handleAccountPage);
    router.get("/booking", homeController.handleBookingPage);
    router.get("/invoice", homeController.handleInvoicePage);
    router.get("/customer", homeController.handleCustomerPage);
    router.get("/statistics", homeController.handleStatisticsPage);
    return app.use("/", router);
}

export default initWebRoutes;